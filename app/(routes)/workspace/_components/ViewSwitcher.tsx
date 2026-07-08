"use client";

type Props = {
  view: "document" | "both" | "canvas";
  setView: (view: "document" | "both" | "canvas") => void;
};

export default function ViewSwitcher({ view, setView }: Props) {
  return (
    <div className="flex justify-center py-3 border-b bg-white">
      <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => setView("document")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
            view === "document"
              ? "bg-white shadow text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Document
        </button>

        <button
          onClick={() => setView("both")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
            view === "both"
              ? "bg-gray-100 text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Both
        </button>

        <button
          onClick={() => setView("canvas")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition ${
            view === "canvas"
              ? "bg-white shadow text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Canvas
        </button>
      </div>
    </div>
  );
}