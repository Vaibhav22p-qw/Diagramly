"use client";

import React from "react";
import SideNavTopSection from "./SideNavTopSection";
import SideNavBottomSection from "./SideNavBottomSection";

function SideNav() {
  return (
    <div className="fixed flex h-screen w-72 flex-col border-r border-slate-200/70 bg-white/80 p-4 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
      <SideNavTopSection />

      <div className="flex-1" />

      <SideNavBottomSection />
    </div>
  );
}

export default SideNav;