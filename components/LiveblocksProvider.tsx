"use client";

import { LiveblocksProvider } from "@liveblocks/react";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiveblocksProvider
  authEndpoint="/api/liveblocks-auth"
  badgeLocation="bottom-left"
>
      {children}
    </LiveblocksProvider>
  );
}