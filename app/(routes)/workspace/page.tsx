"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./_components/WorkspaceHeader";

const Editor = nextDynamic(() => import("./_components/Editor"), {
  ssr: false,
});

const Canvas = nextDynamic(() => import("./_components/Canvas"), {
  ssr: false,
});

function Workspace() {
  const [triggerSave, setTriggerSave] = useState(false);

  return (
    <div className="h-screen overflow-hidden">
      <WorkspaceHeader onSave={() => setTriggerSave(!triggerSave)} />

      <div className="pt-16 grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-4rem)]">
        <div className="overflow-auto">
          <Editor onSaveTrigger={triggerSave} />
        </div>

        <div className="border-l overflow-hidden">
          <Canvas onSaveTrigger={triggerSave} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
