"use client";

import { useSearchParams } from "next/navigation";
import Workspace from "./_components/Workspace";

export default function WorkspacePage() {
  const searchParams = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");

  return <Workspace workspaceId={workspaceId || undefined} />;
}