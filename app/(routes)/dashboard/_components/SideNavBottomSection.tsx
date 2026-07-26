"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  HelpCircle,
  Keyboard,
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SideNavBottomSection() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [open, setOpen] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      id: 2,
      name: "Help Center",
      icon: HelpCircle,
      path: "/help",
    },
    {
      id: 3,
      name: "Keyboard Shortcuts",
      icon: Keyboard,
      path: "/shortcuts",
    },
    {
      id: 4,
      name: "Feedback",
      icon: MessageSquare,
      path: "/feedback",
    },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = workspaceName.trim();

    if (trimmed.length < 4) return;

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmed,
          template: "blank",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create workspace");
        return;
      }

      console.log("Workspace created:", data.workspace);

      setWorkspaceName("");
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 mt-auto">
      {/* Create New Workspace Action */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </DialogTrigger>

        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create Workspace</DialogTitle>
              <DialogDescription>
                Give your workspace a name to start collaborating and creating diagrams.
              </DialogDescription>
            </DialogHeader>

            <Input
              autoFocus
              placeholder="Enter Workspace Name"
              className="mt-3"
              minLength={4}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={workspaceName.trim().length < 4}
              >
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Divider */}
      <div className="border-b border-slate-200 dark:border-slate-800" />

      {/* Bottom Auxiliary Links */}
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => router.push(item.path)}
            className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 font-normal text-sm"
          >
            <item.icon className="h-4 w-4 text-slate-500" />
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default SideNavBottomSection;