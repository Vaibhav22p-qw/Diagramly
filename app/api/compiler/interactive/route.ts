import { NextResponse } from "next/server";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";
import crypto from "crypto";

type Language = "c" | "cpp" | "java" | "python";

type CompilerSession = {
  process: ChildProcessWithoutNullStreams;
  output: string;
  error: string;
  finished: boolean;
  exitCode: number | null;
  tempDir: string;
};

const sessions = new Map<string, CompilerSession>();

const TIMEOUT = 10000;
const MAX_OUTPUT = 1024 * 1024;

function getConfig(
  language: Language,
  dir: string
) {
  switch (language) {
    case "c":
      return {
        source: path.join(dir, "main.c"),
        executable: path.join(dir, "main.exe"),
        compiler: "gcc",
      };

    case "cpp":
      return {
        source: path.join(dir, "main.cpp"),
        executable: path.join(dir, "main.exe"),
        compiler: "g++",
      };

    case "java":
      return {
        source: path.join(dir, "Main.java"),
        executable: "",
        compiler: "javac",
      };

    case "python":
      return {
        source: path.join(dir, "main.py"),
        executable: "",
        compiler: "python",
      };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const action = body.action as
      | "start"
      | "input"
      | "poll"
      | "stop";

    // -----------------------------------------
    // START
    // -----------------------------------------

    if (action === "start") {
      const language =
        body.language as Language;

      const code = body.code;

      if (!language || !code) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Language and code are required.",
          },
          { status: 400 }
        );
      }

      const supported: Language[] = [
        "c",
        "cpp",
        "java",
        "python",
      ];

      if (!supported.includes(language)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Unsupported programming language.",
          },
          { status: 400 }
        );
      }

      const tempDir = path.join(
        os.tmpdir(),
        `diagramly-${crypto.randomUUID()}`
      );

      await fs.mkdir(tempDir, {
        recursive: true,
      });

      const config = getConfig(
        language,
        tempDir
      );

      await fs.writeFile(
        config.source,
        code,
        "utf8"
      );

      // -----------------------------------------
      // Compile C / C++
      // -----------------------------------------

      if (
        language === "c" ||
        language === "cpp"
      ) {
        const compileProcess = spawn(
          config.compiler,
          [
            config.source,
            "-o",
            config.executable,
          ],
          {
            cwd: tempDir,
            windowsHide: true,
            shell: false,
          }
        );

        let compileOutput = "";
        let compileError = "";

        compileProcess.stdout.on(
          "data",
          (data) => {
            compileOutput +=
              data.toString();
          }
        );

        compileProcess.stderr.on(
          "data",
          (data) => {
            compileError +=
              data.toString();
          }
        );

        const compileResult =
          await new Promise<{
            code: number | null;
          }>((resolve) => {
            compileProcess.on(
              "close",
              (code) => {
                resolve({ code });
              }
            );
          });

        if (compileResult.code !== 0) {
          await fs.rm(tempDir, {
            recursive: true,
            force: true,
          });

          return NextResponse.json({
            success: false,
            compiled: false,
            executed: false,
            output: compileOutput,
            error:
              compileError ||
              "Compilation failed.",
            exitCode: compileResult.code,
          });
        }
      }

      // -----------------------------------------
      // Compile Java
      // -----------------------------------------

      if (language === "java") {
        const compileProcess = spawn(
          "javac",
          [config.source],
          {
            cwd: tempDir,
            windowsHide: true,
            shell: false,
          }
        );

        let compileError = "";

        compileProcess.stderr.on(
          "data",
          (data) => {
            compileError +=
              data.toString();
          }
        );

        const compileResult =
          await new Promise<{
            code: number | null;
          }>((resolve) => {
            compileProcess.on(
              "close",
              (code) => {
                resolve({ code });
              }
            );
          });

        if (compileResult.code !== 0) {
          await fs.rm(tempDir, {
            recursive: true,
            force: true,
          });

          return NextResponse.json({
            success: false,
            compiled: false,
            executed: false,
            output: "",
            error:
              compileError ||
              "Java compilation failed.",
            exitCode: compileResult.code,
          });
        }
      }

      // -----------------------------------------
      // Start program
      // -----------------------------------------

      let command = "";
      let args: string[] = [];

      if (language === "cpp" || language === "c") {
        command = config.executable;
      }

      if (language === "python") {
        command = "python";
        args = [config.source];
      }

      if (language === "java") {
        command = "java";
        args = [
          "-cp",
          tempDir,
          "Main",
        ];
      }

      const child = spawn(
        command,
        args,
        {
          cwd: tempDir,
          windowsHide: true,
          shell: false,
        }
      );

      const sessionId =
        crypto.randomUUID();

      const session: CompilerSession = {
        process: child,
        output: "",
        error: "",
        finished: false,
        exitCode: null,
        tempDir,
      };

      sessions.set(
        sessionId,
        session
      );

      child.stdout.on(
        "data",
        (data) => {
          session.output +=
            data.toString();

          if (
            session.output.length >
            MAX_OUTPUT
          ) {
            child.kill();
            session.error =
              "Output limit exceeded.";
          }
        }
      );

      child.stderr.on(
        "data",
        (data) => {
          session.error +=
            data.toString();
        }
      );

      child.on(
        "close",
        async (code) => {
          session.finished = true;
          session.exitCode = code;

          setTimeout(async () => {
            sessions.delete(sessionId);

            try {
              await fs.rm(
                session.tempDir,
                {
                  recursive: true,
                  force: true,
                }
              );
            } catch {}
          }, 30000);
        }
      );

      const timeout = setTimeout(() => {
        if (!session.finished) {
          child.kill();

          session.error =
            "Program timed out. Check for an infinite loop or missing input.";
        }
      }, TIMEOUT);

      child.on("close", () => {
        clearTimeout(timeout);
      });

      return NextResponse.json({
        success: true,
        sessionId,
        compiled: true,
        executed: true,
      });
    }

    // -----------------------------------------
    // INPUT
    // -----------------------------------------

    if (action === "input") {
      const {
        sessionId,
        input,
      } = body;

      const session =
        sessions.get(sessionId);

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Compiler session not found.",
          },
          { status: 404 }
        );
      }

      if (session.finished) {
        return NextResponse.json({
          success: false,
          message:
            "Program has already finished.",
        });
      }

      session.process.stdin.write(
        String(input) + "\n"
      );

      return NextResponse.json({
        success: true,
      });
    }

    // -----------------------------------------
    // POLL
    // -----------------------------------------

    if (action === "poll") {
      const { sessionId } = body;

      const session =
        sessions.get(sessionId);

      if (!session) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Compiler session not found.",
          },
          { status: 404 }
        );
      }

      const response = {
        success: true,
        output: session.output,
        error: session.error,
        finished: session.finished,
        exitCode: session.exitCode,
      };

      session.output = "";
      session.error = "";

      return NextResponse.json(
        response
      );
    }

    // -----------------------------------------
    // STOP
    // -----------------------------------------

    if (action === "stop") {
      const { sessionId } = body;

      const session =
        sessions.get(sessionId);

      if (session) {
        session.process.kill();

        sessions.delete(sessionId);

        try {
          await fs.rm(
            session.tempDir,
            {
              recursive: true,
              force: true,
            }
          );
        } catch {}
      }

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action.",
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error(
      "Interactive compiler error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Interactive compiler failed.",
      },
      { status: 500 }
    );
  }
}