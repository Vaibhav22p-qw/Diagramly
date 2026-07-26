"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();
  const [diagramlyId, setDiagramlyId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!diagramlyId || !password) {
      setError("Enter your Diagramly ID and password to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diagramlyId,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();
      

      if (data.success) {
        router.push("/workspace");
      } else {
        setError(data.message || "That ID or password doesn't match our records.");
        idInputRef.current?.focus();
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-4">
      {/* Subtle blueprint-grid backdrop, nods to the product without shouting it */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-500/20">
            <img src="/diahead.gif" alt="Diagramly" className="h-full w-full object-contain" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your Diagramly workspace
          </p>
        </div>

        {/* Error feedback — above the fields so it's seen before re-attempting */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-600"
          >
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.28 11.18c.75 1.334-.213 2.987-1.742 2.987H3.72c-1.53 0-2.492-1.653-1.743-2.987l6.28-11.18zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="diagramlyId"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Diagramly ID
            </label>
            <input
              id="diagramlyId"
              ref={idInputRef}
              type="text"
              autoComplete="username"
              autoFocus
              required
              disabled={isLoading}
              aria-invalid={!!error}
              className="mt-1.5 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition duration-150 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="UGI***"
              value={diagramlyId}
              onChange={(e) => setDiagramlyId(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isLoading}
                aria-invalid={!!error}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-3.5 pr-11 text-sm text-gray-900 placeholder-gray-400 outline-none transition duration-150 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 focus:outline-none disabled:opacity-50"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path
                      d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.3 5.3A9.9 9.9 0 0112 5c5 0 9 4 10 7-.5 1.4-1.5 2.9-2.8 4.1M6.6 6.6C4.4 8 2.9 9.9 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <label className="flex select-none items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            Keep me signed in
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have a workspace yet?{" "}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-700">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}