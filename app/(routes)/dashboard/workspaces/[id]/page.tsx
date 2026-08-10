"use client";

import React from "react";
import { useParams } from "next/navigation";
import Workspace from "@/app/(routes)/workspace/_components/Workspace";

export default function WorkspacePage() {
  const params = useParams();

  const WorkspaceComponent =
    Workspace as React.ComponentType<{ workspaceId: string }>;

  return (
    <WorkspaceComponent
      workspaceId={params.id as string}
    />
  );
}
