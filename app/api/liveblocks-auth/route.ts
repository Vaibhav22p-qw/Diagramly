import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export async function POST(req: NextRequest) {
  try {
    const { room } = await req.json();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      name: string;
      diagramlyId: string;
    };

    const color =
      COLORS[Math.floor(Math.random() * COLORS.length)];

    const session = liveblocks.prepareSession(decoded.diagramlyId, {
      userInfo: {
        name: decoded.name,
        color,
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    return new NextResponse(body, { status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
}