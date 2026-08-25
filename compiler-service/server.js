"use strict";

const http = require("node:http");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

// Railway injects PORT at runtime. The fallback is only for local development.
const PORT = Number(process.env.PORT) || 8787;
const SERVICE_TOKEN = process.env.COMPILER_SERVICE_TOKEN || "";
const MAX_SOURCE_BYTES = 256 * 1024;
const MAX_STDIN_BYTES = 64 * 1024;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const EXECUTION_TIMEOUT_MS = 10_000;
const COMPILATION_TIMEOUT_MS = 10_000;
const SESSION_TTL_MS = 30_000;
const sessions = new Map();

const languages = {
  c: { filename: "main.c", compile: (file) => ["gcc", [file, "-O2", "-o", "program"]], run: () => ["./program", []] },
  cpp: { filename: "main.cpp", compile: (file) => ["g++", [file, "-O2", "-std=c++17", "-o", "program"]], run: () => ["./program", []] },
  java: { filename: "Main.java", compile: (file) => ["javac", [file]], run: () => ["java", ["-cp", ".", "Main"]] },
  python: { filename: "main.py", run: (file) => ["python3", [file]] },
};

function send(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}

function isAuthorized(request) {
  if (!SERVICE_TOKEN) return true;
  const value = request.headers.authorization || "";
  const supplied = value.startsWith("Bearer ") ? value.slice(7) : "";
  return supplied.length === SERVICE_TOKEN.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(SERVICE_TOKEN));
}

function processResult(command, args, options, input, timeoutMs) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;
    let overflowed = false;
    let child;
    let timeout;
    const finish = (result) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        resolve({ stdout, stderr, timedOut, overflowed, ...result });
      }
    };
    try {
      child = spawn(command, args, { ...options, shell: false, windowsHide: true, detached: process.platform !== "win32" });
    } catch (error) {
      finish({ code: null, error: error.message });
      return;
    }
    const kill = () => {
      if (!child || child.killed) return;
      if (process.platform !== "win32" && child.pid) {
        try { process.kill(-child.pid, "SIGKILL"); return; } catch {}
      }
      child.kill("SIGKILL");
    };
    const append = (current, chunk) => {
      const text = chunk.toString("utf8");
      if (Buffer.byteLength(current) + Buffer.byteLength(text) > MAX_OUTPUT_BYTES) {
        overflowed = true;
        kill();
        return current;
      }
      return current + text;
    };
    child.stdout.on("data", (chunk) => { stdout = append(stdout, chunk); });
    child.stderr.on("data", (chunk) => { stderr = append(stderr, chunk); });
    child.on("error", (error) => finish({ code: null, error: error.code === "ENOENT" ? "Required compiler runtime is unavailable." : "Compiler process could not be started." }));
    child.on("close", (code, signal) => finish({ code, signal }));
    timeout = setTimeout(() => { timedOut = true; kill(); }, timeoutMs);
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

function errorResponse(message, status = 400) {
  return [status, { success: false, compiled: false, executed: false, output: "", error: message, exitCode: null }];
}

async function makeWorkspace() {
  return fs.mkdtemp(path.join(process.env.TMPDIR || os.tmpdir(), "diagramly-"));
}

async function compile(language, code) {
  const config = languages[language];
  const tempDir = await makeWorkspace();
  const source = path.join(tempDir, config.filename);
  await fs.writeFile(source, code, { encoding: "utf8", mode: 0o600 });
  if (!config.compile) return { tempDir, source, config, compilation: null };
  const [command, args] = config.compile(config.filename);
  const compilation = await processResult(command, args, { cwd: tempDir, env: { PATH: process.env.PATH, HOME: tempDir, LANG: "C.UTF-8" } }, "", COMPILATION_TIMEOUT_MS);
  return { tempDir, source, config, compilation };
}

function compileFailure(result) {
  if (result.timedOut) return "Compilation timed out.";
  if (result.overflowed) return "Compilation output limit exceeded.";
  return result.stderr || result.error || "Compilation failed.";
}

function safeDiagnostic(text, tempDir) {
  return String(text || "").split(tempDir).join("<workspace>");
}

async function runOnce(body) {
  const { language, code } = body;
  const stdin = typeof body.stdin === "string" ? body.stdin : "";
  if (!languages[language]) return errorResponse("Unsupported programming language.");
  if (typeof code !== "string" || !code.trim()) return errorResponse("Language and code are required.");
  if (Buffer.byteLength(code) > MAX_SOURCE_BYTES || Buffer.byteLength(stdin) > MAX_STDIN_BYTES) return errorResponse("Source code or input exceeds the allowed size.", 413);
  let workspace;
  try {
    workspace = await compile(language, code);
    if (workspace.compilation && workspace.compilation.code !== 0) {
      return [200, { success: false, compiled: false, executed: false, output: workspace.compilation.stdout, error: compileFailure(workspace.compilation), exitCode: workspace.compilation.code }];
    }
    const [command, args] = workspace.config.run(workspace.config.filename);
    const result = await processResult(command, args, { cwd: workspace.tempDir, env: { PATH: process.env.PATH, HOME: workspace.tempDir, LANG: "C.UTF-8" } }, stdin, EXECUTION_TIMEOUT_MS);
    const error = result.timedOut ? "Program timed out. Check for an infinite loop or missing input." : result.overflowed ? "Program output limit exceeded." : safeDiagnostic(result.stderr || result.error, workspace.tempDir);
    const executed = result.code === 0 && !result.timedOut && !result.overflowed;
    return [200, { success: executed, compiled: true, executed, output: result.stdout, error, exitCode: result.code }];
  } catch (error) {
    return errorResponse("Compiler service could not process this request.", 500);
  } finally {
    if (workspace) await fs.rm(workspace.tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function startInteractive(body) {
  const { language, code } = body;
  if (!languages[language]) return errorResponse("Unsupported programming language.");
  if (typeof code !== "string" || !code.trim()) return errorResponse("Language and code are required.");
  if (Buffer.byteLength(code) > MAX_SOURCE_BYTES) return errorResponse("Source code exceeds the allowed size.", 413);
  let workspace;
  try {
    workspace = await compile(language, code);
    if (workspace.compilation && workspace.compilation.code !== 0) {
      await fs.rm(workspace.tempDir, { recursive: true, force: true });
      return [200, { success: false, compiled: false, executed: false, output: workspace.compilation.stdout, error: compileFailure(workspace.compilation), exitCode: workspace.compilation.code }];
    }
    const [command, args] = workspace.config.run(workspace.config.filename);
    const child = spawn(command, args, { cwd: workspace.tempDir, env: { PATH: process.env.PATH, HOME: workspace.tempDir, LANG: "C.UTF-8" }, shell: false, windowsHide: true, detached: process.platform !== "win32" });
    const id = crypto.randomUUID();
    const session = { child, tempDir: workspace.tempDir, output: "", error: "", finished: false, exitCode: null, timedOut: false };
    sessions.set(id, session);
    const cleanup = async () => { sessions.delete(id); await fs.rm(session.tempDir, { recursive: true, force: true }).catch(() => {}); };
    const kill = () => { if (process.platform !== "win32" && child.pid) { try { process.kill(-child.pid, "SIGKILL"); return; } catch {} } child.kill("SIGKILL"); };
    const add = (field, chunk) => { if (Buffer.byteLength(session[field]) + Buffer.byteLength(chunk) > MAX_OUTPUT_BYTES) { session.error = "Program output limit exceeded."; kill(); } else session[field] += chunk.toString("utf8"); };
    child.stdout.on("data", (chunk) => add("output", chunk));
    child.stderr.on("data", (chunk) => add("error", chunk));
    child.on("error", () => { session.error = "Compiler process could not be started."; });
    child.on("close", (code) => { session.finished = true; session.exitCode = code; clearTimeout(session.timeout); setTimeout(cleanup, SESSION_TTL_MS).unref(); });
    session.timeout = setTimeout(() => { if (!session.finished) { session.timedOut = true; session.error = "Program timed out. Check for an infinite loop or missing input."; kill(); } }, EXECUTION_TIMEOUT_MS);
    return [200, { success: true, sessionId: id, compiled: true, executed: true }];
  } catch {
    if (workspace) await fs.rm(workspace.tempDir, { recursive: true, force: true }).catch(() => {});
    return errorResponse("Compiler service could not start the program.", 500);
  }
}

async function interactive(body) {
  if (body.action === "start") return startInteractive(body);
  const session = sessions.get(body.sessionId);
  if (body.action === "stop") {
    if (session && !session.finished) session.child.kill("SIGKILL");
    return [200, { success: true }];
  }
  if (!session) return errorResponse("Compiler session not found.", 404);
  if (body.action === "input") {
    if (session.finished) return errorResponse("Program has already finished.", 409);
    const input = String(body.input || "");
    if (Buffer.byteLength(input) > MAX_STDIN_BYTES) return errorResponse("Input exceeds the allowed size.", 413);
    session.child.stdin.write(`${input}\n`);
    return [200, { success: true }];
  }
  if (body.action === "poll") {
    const response = { success: true, output: session.output, error: session.error, finished: session.finished, exitCode: session.exitCode };
    session.output = ""; session.error = "";
    return [200, response];
  }
  return errorResponse("Invalid action.");
}

const server = http.createServer(async (request, response) => {
  // Deliberately unauthenticated so Railway can probe the running container.
  if (request.method === "GET" && request.url === "/health") return send(response, 200, { status: "ok" });
  if (request.method !== "POST" || request.url !== "/compile") return send(response, 404, { error: "Not found." });
  if (!isAuthorized(request)) return send(response, 401, { success: false, error: "Unauthorized." });
  let raw = "";
  request.on("data", (chunk) => { raw += chunk; if (Buffer.byteLength(raw) > MAX_SOURCE_BYTES + MAX_STDIN_BYTES + 4096) request.destroy(); });
  request.on("end", async () => {
    let body;
    try { body = JSON.parse(raw); } catch { return send(response, 400, errorResponse("Invalid request body.")[1]); }
    const [status, result] = body.action ? await interactive(body) : await runOnce(body);
    send(response, status, result);
  });
});

server.listen(PORT, "0.0.0.0", () => console.log(`Diagramly compiler service listening on ${PORT}`));
