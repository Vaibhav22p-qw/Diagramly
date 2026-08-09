"use client";

import { useParams } from "next/navigation";
import Workspace from "@/app/(routes)/workspace/page";

export default function WorkspaceByIdPage() {
  const params = useParams();

  return <Workspace workspaceId={params.id as string} />;
}