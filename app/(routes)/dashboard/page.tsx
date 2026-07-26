"use client";

import React from "react";
import Header from "./_components/Header";
import TemplateSection from "./_components/TemplateSection";
import WorkspaceList from "./_components/WorkspaceList";

function Dashboard() {
  return (
    <div className="p-8">
      <Header />

      <TemplateSection />

      <WorkspaceList />
    </div>
  );
}

export default Dashboard;