"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import { useEffect, useState } from "react";
import NamePrompt from "@/app/(routes)/workspace/_components/NamePrompt";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // On every reload, clear any previous name so the prompt always shows
  useEffect(() => {
    document.cookie = "mock-user-name=; path=/; max-age=0";
    setChecked(true);
  }, []);

  const handleSubmit = (name: string) => {
    document.cookie = `mock-user-name=${encodeURIComponent(name)}; path=/`;
    setUserName(name);
  };

  if (!checked) return null; // avoid flashing the prompt before cookie clear runs

  if (!userName) {
    return <NamePrompt onSubmit={handleSubmit} />;
  }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
}