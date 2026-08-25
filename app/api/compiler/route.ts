import { NextResponse } from "next/server";
import { callCompilerService } from "@/lib/compiler/service-client";

/**
 * Server-only boundary between the browser and the isolated compiler service.
 * COMPILER_SERVICE_URL is intentionally never exposed as NEXT_PUBLIC_*.
 */
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
  return NextResponse.json(result.body, { status: result.status });
}
