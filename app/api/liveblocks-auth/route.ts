import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];

export async function POST(req: NextRequest) {
  const { room } = await req.json();

  const name = req.cookies.get("mock-user-name")?.value ?? "Anonymous";
  const userId = `user-${crypto.randomUUID()}`;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];

  const session = liveblocks.prepareSession(userId, {
    userInfo: { name, color },
  });

  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();

  return new NextResponse(body, { status });
}
