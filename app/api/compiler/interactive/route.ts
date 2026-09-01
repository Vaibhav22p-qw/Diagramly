import { NextResponse } from "next/server";
import { callCompilerService } from "@/lib/compiler/service-client";
import {
  recordSuccessfulExecution,
  type CompilerLanguage,
} from "@/lib/compiler/execution-results";

const sessionSources = new Map<
  string,
  { language: CompilerLanguage; sourceCode: string }
>();

/** Proxies interactive compiler sessions without importing child_process on Vercel. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const result = await callCompilerService(body);

  const action = body.action;
  const sessionId = result.body.sessionId;
  if (
    action === "start" &&
    typeof sessionId === "string" &&
    typeof body.language === "string" &&
    typeof body.code === "string" &&
    ["c", "cpp", "java", "python"].includes(body.language)
  ) {
    sessionSources.set(sessionId, {
      language: body.language as CompilerLanguage,
      sourceCode: body.code,
    });
  }

  if (action === "poll" && typeof body.sessionId === "string") {
    const source = sessionSources.get(body.sessionId);
    if (source && result.body.finished === true) {
      recordSuccessfulExecution({
        executionId: body.sessionId,
        ...source,
        exitCode:
          typeof result.body.exitCode === "number"
            ? result.body.exitCode
            : null,
      });
      sessionSources.delete(body.sessionId);
    }
  }

  if (action === "stop" && typeof body.sessionId === "string") {
    sessionSources.delete(body.sessionId);
  }

  return NextResponse.json(result.body, { status: result.status });
}
