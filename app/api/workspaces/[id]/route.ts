import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Workspace from "@/models/Workspace";

interface JWTPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // -----------------------------------
    // Get workspace ID
    // -----------------------------------
    const { id } = await params;

    console.log("Requested workspace ID:", id);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace ID is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // Validate MongoDB ObjectId
    // -----------------------------------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid workspace ID",
        },
        { status: 400 }
      );
    }

    // -----------------------------------
    // Get JWT token
    // -----------------------------------
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

    // -----------------------------------
    // Verify JWT
    // -----------------------------------
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    console.log("Decoded JWT:", decoded);
    console.log("Authenticated user ID:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token",
        },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID in authentication token",
        },
        { status: 401 }
      );
    }

    // -----------------------------------
    // Find workspace
    // -----------------------------------
    const workspace = await Workspace.findOne({
      _id: id,
      ownerId: new mongoose.Types.ObjectId(userId),
      isTrashed: { $ne: true },
    }).lean();

    console.log(
      "Workspace found:",
      workspace ? workspace._id : "NOT FOUND"
    );

    // -----------------------------------
    // Workspace doesn't exist
    // -----------------------------------
    if (!workspace) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------
    // Success
    // -----------------------------------
    return NextResponse.json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error(
      "Failed to fetch workspace:",
      error
    );

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired authentication token",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch workspace",
      },
      { status: 500 }
    );
  }
}
