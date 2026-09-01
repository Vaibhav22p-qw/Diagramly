import { NextResponse } from "next/server";
import { callCompilerService } from "@/lib/compiler/service-client";
import { beginCompilerExecution, finishCompilerExecution } from "@/lib/compiler/execution-store";
import type { CompilerExecutionLanguage } from "@/models/CompilerExecution";

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
  let learnableExecutionTracked = false;

  if (
    action === "start" &&
    result.status < 400 &&
    typeof sessionId === "string" &&
    typeof body.language === "string" &&
    typeof body.code === "string" &&
    ["c", "cpp", "java", "python"].includes(body.language)
  ) {
    try {
      await beginCompilerExecution({
        executionId: sessionId,
        language: body.language as CompilerExecutionLanguage,
        sourceCode: body.code,
      });
      learnableExecutionTracked = true;
    } catch (error) {
      // Compilation remains available even if the optional Learn-solution
      // tracking store is temporarily unavailable.
      console.error("Failed to persist compiler execution tracking:", error);
    }
  }

  if (
    action === "poll" &&
    typeof body.sessionId === "string" &&
    result.body.finished === true
  ) {
    try {
      await finishCompilerExecution({
        executionId: body.sessionId,
        exitCode:
          typeof result.body.exitCode === "number"
            ? result.body.exitCode
            : null,
      });
      learnableExecutionTracked = result.body.exitCode === 0;
    } catch (error) {
      console.error("Failed to finalize compiler execution tracking:", error);
    }
  }

  const responseBody = {
    ...result.body,
    ...(action === "start"
      ? { learnableExecutionTracked }
      : action === "poll" && result.body.finished === true
        ? { learnableExecutionTracked }
        : {}),
  };

  return NextResponse.json(responseBody, { status: result.status });
}
