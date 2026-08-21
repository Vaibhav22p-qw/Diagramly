import { NextResponse } from "next/server";
import { learnFromSolution } from "@/lib/knowledge/learn";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      prompt,
      code,
      language,
      validation,
      source,
    } = body;

    if (!prompt || !code || !language) {
      return NextResponse.json(
        {
          success: false,
          message:
            "prompt, code, and language are required.",
        },
        { status: 400 }
      );
    }

    const result = await learnFromSolution({
      prompt,
      code,
      language,

      validation: {
        compiled: validation?.compiled ?? false,
        testsPassed: validation?.testsPassed ?? false,
        accepted: validation?.accepted ?? false,
      },

      source,
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