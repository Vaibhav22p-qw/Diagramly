"use client";

import React from "react";
import SideNavTopSection from "./SideNavTopSection";
import SideNavBottomSection from "./SideNavBottomSection";

function SideNav() {
  return (
    <div className="fixed flex h-screen w-72 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <SideNavTopSection />

      <div className="flex-1" />

      <SideNavBottomSection />
    </div>
  );
}

export default SideNav;