"use client";

import Link from "next/link";

type Props = {
  showDocument: boolean;
  setShowDocument: React.Dispatch<React.SetStateAction<boolean>>;

  showCompiler: boolean;
  setShowCompiler: React.Dispatch<React.SetStateAction<boolean>>;

  showCanvas: boolean;
  setShowCanvas: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ViewSwitcher({
  showDocument,
  setShowDocument,
  showCompiler,
  setShowCompiler,
  showCanvas,
  setShowCanvas,
}: Props) {
  return (
    <div className="flex items-center justify-center min-w-0">
      <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">

        {/* Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9 9 9M5 10v10h14V10"
            />
          </svg>

          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-300 mx-1" />

        {/* Document */}
        <label
          className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            showDocument
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <input
            type="checkbox"
            checked={showDocument}
            onChange={() => setShowDocument(!showDocument)}
            className="accent-blue-600"
          />

          <span className="hidden sm:inline">
            Document
          </span>
        </label>

        {/* Compiler */}
        <label
          className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            showCompiler
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <input
            type="checkbox"
            checked={showCompiler}
            onChange={() => setShowCompiler(!showCompiler)}
            className="accent-blue-600"
          />

          <span className="hidden sm:inline">
            Compiler
          </span>
        </label>

        {/* Canvas */}
        <label
          className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            showCanvas
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <input
            type="checkbox"
            checked={showCanvas}
            onChange={() => setShowCanvas(!showCanvas)}
            className="accent-blue-600"
          />

          <span className="hidden sm:inline">
            Canvas
          </span>
        </label>

      </div>
    </div>
  );
}