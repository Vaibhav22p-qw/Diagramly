import { NextResponse } from "next/server";
import { generateCode } from "@/lib/generation/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body.prompt !== "string") return NextResponse.json({ success: false, message: "prompt is required" }, { status: 400 });
    const result = await generateCode(body);
    return NextResponse.json(result, { status: result.success ? 200 : 422 });
  } catch (error) {
    console.error("Code generation error:", error);
    return NextResponse.json({ success: false, message: "Unable to generate code." }, { status: 500 });
  }
}
