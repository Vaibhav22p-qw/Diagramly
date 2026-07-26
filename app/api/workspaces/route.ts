import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Workspace from "@/models/Workspace";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get JWT token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Find logged-in user
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Read request body
    const { title, template } = await req.json();

    // Validate
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, message: "Workspace title is required" },
        { status: 400 }
      );
    }

    // Create workspace
    const workspace = await Workspace.create({
      title: title.trim(),
      ownerId: user._id,
      template: template || "blank",
    });

    return NextResponse.json(
      {
        success: true,
        workspace,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create workspace",
      },
      { status: 500 }
    );
  }
}