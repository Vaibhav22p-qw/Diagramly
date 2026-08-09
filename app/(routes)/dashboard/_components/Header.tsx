"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  FileText,
  HelpCircle,
  Home,
  Keyboard,
  LayoutGrid,
  Menu,
  MessageSquare,
  Moon,
  Send,
  Settings,
  Star,
  Sun,
  Trash2,
  Users2,
  X,
} from "lucide-react";
import Image from "next/image";
import ProfileMenu from "@/components/menu";

function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const navigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

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

  return (
    <>
      {/* ============================= */}
      {/* DESKTOP HEADER */}
      {/* ============================= */}

      <div className="hidden w-full items-center justify-end gap-2 lg:flex">
        <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/20">
          <SearchIcon />

          <input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-56"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          <Bell className="h-4 w-4" />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <Button className="flex h-8 gap-2 bg-blue-600 text-sm hover:bg-blue-700">
          <Send className="h-4 w-4" />
          Invite
        </Button>

        <ProfileMenu />
      </div>

      {/* ============================= */}
      {/* MOBILE HEADER */}
      {/* ============================= */}

      <div className="flex w-full items-center justify-between lg:hidden">

        {/* BRAND */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <Image
            src="/diahead.gif"
            width={34}
            height={34}
            alt="Diagramly"
            className="rounded-lg"
          />

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Diagramly
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-1.5">

          {/* SEARCH */}
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <SearchIcon />
          </button>

          {/* NOTIFICATIONS */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
          </button>

          {/* PROFILE */}
          <ProfileMenu />

          {/* MENU */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ============================= */}
      {/* MOBILE DRAWER */}
      {/* ============================= */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="flex h-full w-[280px] flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/diahead.gif"
                  width={34}
                  height={34}
                  alt="Diagramly"
                  className="rounded-lg"
                />

                <span className="text-lg font-bold text-slate-900">
                  Diagramly
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto p-4">

              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </p>

              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.path === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.path ||
                        pathname.startsWith(item.path + "/");

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500"
                        }`}
                      />

                      {item.name}
                    </button>
                  );
                })}
              </div>

              <div className="my-5 border-t border-slate-200" />

              {/* NEW WORKSPACE */}
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex h-11 w-full items-center gap-3 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <span className="text-lg leading-none">+</span>
                New Workspace
              </button>

              <div className="my-5 border-t border-slate-200" />

              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                More
              </p>

              <div className="space-y-1">
                {bottomItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => navigate(item.path)}
                      className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      <Icon className="h-4 w-4 text-slate-500" />

                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

/* Small reusable search icon */
function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default Header;