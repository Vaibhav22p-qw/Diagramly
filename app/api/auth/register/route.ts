import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

async function generateDiagramlyId() {
  const lastUser = await User.findOne().sort({ createdAt: -1 });

  if (!lastUser || !lastUser.diagramlyId) {
    return "UGI0100";
  }

  const lastNumber = parseInt(
    lastUser.diagramlyId.replace("UGI", ""),
    10
  );

  return `UGI${lastNumber + 1}`;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and Password are required.",
        },
        { status: 400 }
      );
    }

    const diagramlyId = await generateDiagramlyId();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      diagramlyId,
      name,
      password: hashedPassword,
      provider: "manual",
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      diagramlyId: user.diagramlyId,
    });
  } catch (error: any) {
  console.error("REGISTER ERROR:", error);
  console.error(error?.stack);

  return NextResponse.json(
    {
      success: false,
      message: error.message,
      name: error.name,
    },
    { status: 500 }
  );
  }
} 