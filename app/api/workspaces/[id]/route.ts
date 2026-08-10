import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Get JWT token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
    };

    // Find workspace owned by logged-in user
    const workspace = await Workspace.findOne({
      _id: params.id,
      ownerId: decoded.id,
      isTrashed: false,
    });

    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error("Failed to fetch workspace:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workspace",
      },
      { status: 500 }
    );
  }
}