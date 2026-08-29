"use client";

import React from "react";
import Header from "./_components/Header";
import DashboardView from "@/components/dashboard/DashboardView";

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6 lg:px-8">
        <Header />
      </div>

      <DashboardView />
    </main>
  );
}

export default Dashboard;
