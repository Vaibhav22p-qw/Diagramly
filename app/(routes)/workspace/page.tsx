"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Workspace from "./_components/Workspace";

function WorkspacePageContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return <Workspace workspaceId={workspaceId || undefined} />;
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div>Loading workspace...</div>}>
      <WorkspacePageContent />
    </Suspense>
  );
}
