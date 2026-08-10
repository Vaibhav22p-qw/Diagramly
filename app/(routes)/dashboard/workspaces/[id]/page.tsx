"use client";

import { useParams } from "next/navigation";
import Workspace from "@/app/(routes)/workspace/_components/Workspace";

export default function WorkspacePage() {
  const params = useParams();

  return <Workspace workspaceId={params.id as string} />;
}