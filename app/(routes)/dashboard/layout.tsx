"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isWorkspacePage = pathname.startsWith("/dashboard/workspaces/");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        if (!data.success) {
          router.push("/login");
          return;
        }

        setCheckingAuth(false);
      })
      .catch(() => {
        if (!cancelled) {
          router.push("/login");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600 dark:border-purple-900 dark:border-t-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      {!isWorkspacePage && (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 lg:block">
          <SideNav />
        </aside>
      )}

      {/* Main */}
      <main className={`min-h-screen ${!isWorkspacePage ? "lg:ml-72" : ""}`}>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;