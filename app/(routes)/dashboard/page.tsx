"use client";

import React from "react";
import Header from "./_components/Header";
import DashboardView from "@/components/dashboard/DashboardView";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950">
      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/70 sm:px-6 lg:px-8">
        <Header />
      </div>

      <DashboardView />
    </div>
  );
}

export default Dashboard;
