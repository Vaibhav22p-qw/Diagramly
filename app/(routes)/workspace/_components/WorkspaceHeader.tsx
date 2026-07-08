"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function WorkspaceHeader({
  onSave,
  fileName,
  setFileName,
}: {
  onSave: () => void;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const handleLiveToggle = () => {
  if (!isLive) {
    const confirmLive = window.confirm(
      "Are you sure you want to go live?"
    );

    if (!confirmLive) return;
  }

  setIsLive(!isLive);
};

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center">
      <div className="w-1/4 flex items-center gap-6">
      <Link href="/">
  <Image
    src="/logo-1.png"
    alt="Logo"
    width={50}
    height={50}
    className="cursor-pointer hover:scale-105 transition-transform duration-200"
  />
</Link>
   
{isEditing ? (
  <div className="flex items-center rounded-lg bg-gray-100 px-2">
    <Input
      autoFocus
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
      onBlur={() => setIsEditing(false)}
      onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
      className="h-9 w-48 border-0 bg-transparent p-0 text-[15px] font-medium shadow-none focus-visible:ring-0"
    />
    <span className="text-[15px] font-medium text-gray-500">
      .pdf
    </span>
  </div>
) : (
  <button
    onClick={() => setIsEditing(true)}
    className="group flex h-9 items-center gap-1 rounded-lg px-2 transition-colors hover:bg-gray-100"
  >
    <span className="max-w-[220px] truncate text-[15px] font-medium text-gray-900">
      {fileName}
    </span>

    <span className="text-[15px] text-gray-500">
      .pdf
    </span>
  </button>
)}
      </div>

      <div className="w-2/4 flex justify-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full h-11 rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
      </div>

      <div>
    <Button
  onClick={handleLiveToggle}
  className={`relative w-20 h-7 rounded-full transition-colors duration-300 ${
    isLive ? "bg-red-500" : "bg-gray-300"
  }`}>
    <div className="w-14">
      {isLive && (
        <span className="px-1 py-1 rounded-full bg-red-500 text-white-1000 text-xs font-medium">
          Live :
        </span>
      )}
  </div>
  <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full transition-colors duration-300 ${
    isLive ? 'bg-green-500' : 'bg-red-500'
  }`}></span>
  <span
    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
      isLive ? "translate-x-12" : ""
    }`}
  />
  
</Button>
</div>
<div className="w-1/4 flex justify-end items-center gap-10">
<div className="flex items-center gap-2">

  <Button
    variant="outline"
    className="h-10 rounded-xl border-gray-200 bg-white px-4 shadow-sm hover:bg-gray-50"
  >
    <img src="/sh.svg" className="mr-2 h-4 w-4" />
    Share
  </Button>

  <Button
    onClick={() => onSave()}
    className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
  >
    <img src="/dow.svg" className="mr-2 h-4 w-4 invert" />
    Save
  </Button>

</div>
        <Button className="h-10 w-10 p-0 bg-transparent hover:bg-green-600 transition-all duration-200 rounded-full">
          <img src="/p.png" alt="Profile" className="h-9 w-9 rounded-full object-cover" />
        </Button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
