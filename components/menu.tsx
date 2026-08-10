"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  name: string;
  diagramlyId: string;
  email: string | null;
  avatarUrl?: string | null;
};

export default function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) setUser(data.user);
      })
      .catch(() => {
        // fail silently — menu just won't render
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Escape to close, return focus to the trigger
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Focus the first menu item when it opens
  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Skeleton while we don't yet know if there's a user
  if (loadingProfile) {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!user) return null;

  const avatarSrc = user.avatarUrl || "/p.png";

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className="h-10 w-10 rounded-full p-0 ring-1 ring-transparent transition-all hover:ring-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <img
          src={avatarSrc}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2.5 w-72 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-xl shadow-gray-200/70 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-3 rounded-lg px-2.5 py-2.5">
            <img
              src={avatarSrc}
              alt=""
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="truncate font-semibold text-gray-900">{user.name}</div>
              <div className="truncate text-xs text-gray-500">
                {user.email ?? "No email on file"}
              </div>
            </div>
          </div>

          <div className="mx-2.5 mb-1 mt-0.5 inline-flex items-center gap-1 rounded-md bg-gray-80 px-2 py-1 font-mono text-[18px] text-gray-500">
            {user.diagramlyId}
          </div>

          <hr className="my-2 border-gray-100" />

          <a
            ref={firstItemRef}
            href="/settings"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 outline-none transition hover:bg-gray-50 focus-visible:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Account settings
          </a>

          <a
            href="/help"
            role="menuitem"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 outline-none transition hover:bg-gray-50 focus-visible:bg-gray-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.1 9a3 3 0 015.8 1c0 2-3 2-3 4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17h.01" strokeLinecap="round" />
            </svg>
            Help &amp; docs
          </a>

          <hr className="my-2 border-gray-100" />

          <button
            onClick={logout}
            role="menuitem"
            disabled={loggingOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 outline-none transition hover:bg-red-50 focus-visible:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}