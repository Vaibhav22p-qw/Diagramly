import { NextResponse } from "next/server";
import { learnFromSolution } from "@/lib/knowledge/learn";
import {
  consumeSuccessfulCompilerExecution,
} from "@/lib/compiler/execution-store";
import { normalizeKnowledge } from "@/lib/knowledge/normalize";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      prompt,
      code,
      language,
      executionId,
      source,
    } = body;

    if (!prompt || !code || !language || !executionId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "prompt, code, language, and executionId are required.",
        },
        { status: 400 }
      );
    }

    const normalized = normalizeKnowledge({ prompt, language });
    if (!normalized) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported programming language.",
        },
        { status: 400 }
      );
    }

    const validation = await consumeSuccessfulCompilerExecution({
      executionId,
      language: normalized.language,
      sourceCode: code,
    });

    if (!validation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This solution does not match a recent successful compiler execution.",
        },
        { status: 409 }
      );
    }

    const result = await learnFromSolution({
      prompt,
      code,
      language: normalized.language,
      validation,
      source: {
        type: "compiler",
        userId: source?.userId,
        workspaceId: source?.workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error(
      "Diagramly learning API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to learn solution.",
      },
      { status: 500 }
    );
  }
}
