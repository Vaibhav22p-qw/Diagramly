"use client";

import { useState } from "react";

export default function NamePrompt({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          What's your name?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This is how others will see you in this session.
        </p>

        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}