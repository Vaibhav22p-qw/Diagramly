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
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function SideNavBottomSection() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOpenCreateWorkspace = () => {
      setOpen(true);
    };

    window.addEventListener(
      "open-create-workspace",
      handleOpenCreateWorkspace
    );

    return () => {
      window.removeEventListener(
        "open-create-workspace",
        handleOpenCreateWorkspace
      );
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = workspaceName.trim();
    if (trimmed.length < 3) return;

    try {
      setIsSubmitting(true);
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

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to create workspace");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("workspace-created", {
          detail: data.workspace,
        })
      );

      setWorkspaceName("");
      setOpen(false);
    } catch (error) {
      console.error("Create workspace error:", error);
      alert("Something went wrong while creating your workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-auto flex flex-col gap-3 p-2">
      {/* Create New Workspace Action */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 font-medium text-white shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-fuchsia-700">
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </DialogTrigger>

        <DialogContent className="border border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95 sm:max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">
                Create Workspace
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Give your workspace a name to start drawing diagrams, writing notes, and collaborating.
              </DialogDescription>
            </DialogHeader>

            <Input
              autoFocus
              placeholder="e.g. Architecture Flow, Sprint Diagram"
              className="mt-3 border-slate-200/80 focus-visible:ring-purple-500 dark:border-slate-700"
              minLength={3}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700"
                disabled={workspaceName.trim().length < 3 || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Workspace"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SideNavBottomSection;