import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { diagramlyId, password, rememberMe } = await req.json();

    if (!diagramlyId || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Diagramly ID and Password are required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ diagramlyId });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password.",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        diagramlyId: user.diagramlyId,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

const response = NextResponse.json({
  success: true,
  message: "Login successful.",
  user: {
    name: user.name,
    diagramlyId: user.diagramlyId,
  },
});

response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: rememberMe
    ? 60 * 60 * 24 * 30
    : 60 * 60 * 24,
});

return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed.",
      },
      { status: 500 }
    );
  }
}