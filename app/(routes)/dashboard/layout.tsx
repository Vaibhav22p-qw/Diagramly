"use client";

import {
  FileText,
  HelpCircle,
  Home,
  Keyboard,
  LayoutGrid,
  Menu,
  MessageSquare,
  Settings,
  Star,
  Trash2,
  Users2,
  X,
  Plus,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SideNav from "./_components/SideNav";
import { Button } from "@/components/ui/button";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  const menuItems = [
    {
      name: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      name: "My Workspaces",
      icon: LayoutGrid,
      path: "/dashboard/workspaces",
    },
    {
      name: "Favorites",
      icon: Star,
      path: "/dashboard/favorites",
    },
    {
      name: "Shared With Me",
      icon: Users2,
      path: "/dashboard/shared",
    },
    {
      name: "Templates",
      icon: FileText,
      path: "/dashboard/templates",
    },
    {
      name: "Trash",
      icon: Trash2,
      path: "/dashboard/trash",
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      name: "Help Center",
      icon: HelpCircle,
      path: "/help",
    },
    {
      name: "Keyboard Shortcuts",
      icon: Keyboard,
      path: "/shortcuts",
    },
    {
      name: "Feedback",
      icon: MessageSquare,
      path: "/feedback",
    },
  ];

  const navigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-950">

    {/* Desktop sidebar */}
    {/* Desktop sidebar */}
{!isWorkspacePage && (
  <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block">
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