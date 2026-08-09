"use client";

import Workspace from "../page";

interface WorkspacePageProps {
  params: {
    id: string;
  };
}

export default function WorkspaceByIdPage({
  params,
}: WorkspacePageProps) {
  console.log("Opening workspace:", params.id);

  return <Workspace />;
}