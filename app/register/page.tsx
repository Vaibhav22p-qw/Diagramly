"use client";

import { useId, useState } from "react";

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagramlyId, setDiagramlyId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const nameId = useId();
  const passwordId = useId();
  const errorId = useId();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagramlyId(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, password }),
      });

      let data: { success?: boolean; diagramlyId?: string; message?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Unexpected response from server.");
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setDiagramlyId(data.diagramlyId ?? null);
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error && err.message === "Unexpected response from server."
          ? err.message
          : "Network error. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyId = async () => {
    if (!diagramlyId) return;
    try {
      await navigator.clipboard.writeText(diagramlyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy to clipboard. Please copy it manually.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-100">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-500/20">
            <img src="/diahead.gif" alt="" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Get started with Diagramly today
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor={nameId}
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Full Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={isLoading}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition duration-150 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
              placeholder="e.g. Alex Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-16 text-sm text-gray-900 placeholder-gray-400 outline-none transition duration-150 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div
            id={errorId}
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Success Banner */}
        {diagramlyId && (
          <div
            role="status"
            className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4"
          >
            <p className="text-xs font-medium text-emerald-800">
              Account created successfully!
            </p>
            <p className="mt-1 text-xs text-emerald-600">Your Diagramly ID:</p>
            <div className="mt-2 flex items-center justify-between rounded-md border border-emerald-200 bg-white p-2">
              <code className="text-xs font-mono font-semibold text-gray-800">
                {diagramlyId}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
              >
                {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
          have a workspace : {" "}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Login
          </a>
        </p>
          </div>
        )}
      </div>
    </div>
  );
}
