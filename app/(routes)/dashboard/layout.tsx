"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SideNav from "./_components/SideNav";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

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
        if (!cancelled) router.push("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed h-screen w-72 border-r border-gray-100 bg-white">
        <SideNav />
      </div>

      <div className="ml-72 flex-1">{children}</div>
    </div>
  );
}

export default DashboardLayout;