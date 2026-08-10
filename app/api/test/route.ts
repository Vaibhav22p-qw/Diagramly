import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database Connected Successfully 🎉",
    });
  } catch (error: any) {
    console.error("DB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        name: error?.name,
        message: error?.message,
        reason: error?.reason,
        cause: error?.cause,
      },
      { status: 500 }
    );
  }
}