import { NextResponse } from "next/server";
import { learnFromSolution } from "@/lib/knowledge/learn";
import {
  consumeSuccessfulExecution,
  type CompilerLanguage,
} from "@/lib/compiler/execution-results";

const SUPPORTED_LANGUAGES = new Set<CompilerLanguage>([
  "c",
  "cpp",
  "java",
  "python",
]);

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

    if (!SUPPORTED_LANGUAGES.has(language)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unsupported programming language.",
        },
        { status: 400 }
      );
    }

    const validation = consumeSuccessfulExecution({
      executionId,
      language,
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
      language,
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
