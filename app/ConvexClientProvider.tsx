"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = null as any;

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}