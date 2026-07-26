"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Search, Send, Sun } from "lucide-react";
import ProfileMenu from "@/components/menu";

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="flex w-full items-center justify-end gap-2">
      <div className="flex items-center gap-2 rounded-md border border-gray-200 px-2.5 py-1.5 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/20">
        <Search className="h-4 w-4 text-gray-400" />
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
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <Button className="flex h-8 gap-2 bg-blue-600 text-sm hover:bg-blue-700">
        <Send className="h-4 w-4" />
        Invite
      </Button>

      <ProfileMenu />
    </div>
  );
}

export default Header;