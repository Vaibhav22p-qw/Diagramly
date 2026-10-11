"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  LayoutGrid,
  Menu,
  Moon,
  Plus,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import ProfileMenu from "@/components/menu";

function Header() {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    window.dispatchEvent(new CustomEvent("workspace-search", { detail: val }));
  };

  const navigate = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const handleCreateWorkspace = () => {
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-create-workspace"));
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
  ];

  return (
    <>
      {/* ============================= */}
      {/* DESKTOP HEADER */}
      {/* ============================= */}

      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* LIVE SEARCH BAR */}
        <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg border border-slate-200/80 bg-white/70 px-3 py-1.5 backdrop-blur-sm transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 dark:border-slate-800/80 dark:bg-slate-900/70">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search workspaces by name..."
            aria-label="Search workspaces"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                window.dispatchEvent(
                  new CustomEvent("workspace-search", { detail: "" })
                );
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white/70 text-slate-600 backdrop-blur-sm transition hover:border-purple-300 hover:text-purple-600 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-purple-800 dark:hover:text-purple-400"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* PROFILE */}
          <ProfileMenu />
        </div>
      </div>

      {/* ============================= */}
      {/* MOBILE HEADER */}
      {/* ============================= */}

      <div className="flex w-full items-center justify-between lg:hidden">
        {/* BRAND */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={34}
            height={34}
            alt="Diagramly"
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Diagramly
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* THEME TOGGLE */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* PROFILE */}
          <ProfileMenu />

          {/* MENU */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 text-slate-700 transition hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
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
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="flex h-full w-[280px] flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER */}
            <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-4 dark:border-slate-800/80">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logo.png"
                  width={34}
                  height={34}
                  alt="Diagramly"
                  className="object-contain"
                />
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Diagramly
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
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
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          isActive
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-slate-500"
                        }`}
                      />
                      {item.name}
                    </button>
                  );
                })}
              </div>

              <div className="my-5 border-t border-slate-200/80 dark:border-slate-800/80" />

              {/* NEW WORKSPACE ACTION */}
              <button
                type="button"
                onClick={handleCreateWorkspace}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3 text-sm font-medium text-white shadow-md shadow-purple-500/20 transition hover:from-purple-700 hover:to-fuchsia-700"
              >
                <Plus className="h-4 w-4" />
                New Workspace
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-slate-400"
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