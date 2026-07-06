"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/app/components/ui/input";
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
      <div className="w-1/4 flex items-center gap-3">
        <Image
          src="/logo-1.png"
          alt="Logo"
          width={40}
          height={40}
        />

        {isEditing ? (
          <Input
            type="text"
            autoFocus
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onBlur={() => setIsEditing(false)}
  onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
  className="text-lg font-semibold border-b border-red-500 outline-none bg-transparent"
/>
) : (
  <h2
    onClick={() => setIsEditing(true)}
    className="text-lg font-semibold cursor-text"
  >
    {fileName}
  </h2>
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

      <div className="w-1/4 flex justify-end items-center gap-3">
    <Button
  onClick={handleLiveToggle}
  className={`relative w-20 h-7 rounded-full transition-colors duration-300 ${
    isLive ? "bg-red-500" : "bg-gray-300"
  }`}>  <div className="w-14">
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

        <Button className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 transition-all duration-200 rounded-full">
          <img src="/sh.svg" alt="Share" className="h-5 w-5 object-contain" />
        </Button> 

        <Button onClick={() => onSave()} className="h-8 w-8 p-0 bg-transparent hover:bg-blue-200 transition-all duration-10 rounded-full">
          <img src="/dow.svg" alt="Save" className="h-5 w-5 object-contain" />
        </Button>

        <Button className="h-8 w-8 p-0 bg-transparent hover:bg-green-600 transition-all duration-200 rounded-full">
          <img src="/p.png" alt="Profile" className="h-7 w-7 rounded-full object-cover" />
        </Button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;
