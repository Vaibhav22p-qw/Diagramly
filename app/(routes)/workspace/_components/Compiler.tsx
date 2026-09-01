"use client";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import Editor from "@monaco-editor/react";
import Terminal, {
  TerminalEntry,
} from "@/components/compiler/Terminal";

type CompilerLanguage = "c" | "cpp" | "java" | "python";

const LANGUAGES: Record<
  string,
  { name: string; monacoLang: string; defaultCode: string }
> = {
  cpp: {
    name: "C++",
    monacoLang: "cpp",
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello Diagramly!" << endl;\n    return 0;\n}`,
  },
  c: {
    name: "C",
    monacoLang: "c",
    defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello Diagramly!\\n");\n    return 0;\n}`,
  },
  java: {
    name: "Java",
    monacoLang: "java",
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Diagramly!");\n    }\n}`,
  },
  python: {
    name: "Python 3",
    monacoLang: "python",
    defaultCode: `print("Hello Diagramly!")`,
  },
};

export default function Compiler() {
  const jdoodleSessionRef = useRef<{
    sendInput: (input: string) => void;
    disconnect: () => void;
  } | null>(null);
  
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";

  const [languageKey, setLanguageKey] = useState<CompilerLanguage>("cpp");
  const [code, setCode] = useState<string>(LANGUAGES["cpp"].defaultCode);

  const [showAI, setShowAI] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [generationSource, setGenerationSource] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [knowledgeId, setKnowledgeId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [compilerError, setCompilerError] = useState("");
  const [compileStatus, setCompileStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [successfulExecutionId, setSuccessfulExecutionId] =
    useState<string | null>(null);
  const [codePrompt, setCodePrompt] = useState<string | null>(null);
  const [retrievedPrompt, setRetrievedPrompt] = useState<string | null>(null);
  const [successfulExecutionPrompt, setSuccessfulExecutionPrompt] =
    useState<string | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);

  const [terminalEntries, setTerminalEntries] =
    useState<TerminalEntry[]>([]);

  const [exitCode, setExitCode] = useState<number | null>(
    null
  );

  const [terminalHeight, setTerminalHeight] = useState(260);

  const [isDraggingTerminal, setIsDraggingTerminal] =
    useState(false);

  const clearTerminal = () => {
    setTerminalEntries([]);
    setOutput("");
    setCompilerError("");
    setExitCode(null);
    setCompileStatus("idle");
    setSuccessfulExecutionId(null);
    setSuccessfulExecutionPrompt(null);
  };
  useEffect(() => {
  const handleTerminalClear = () => {
    clearTerminal();
  };

  window.addEventListener(
    "diagramly-terminal-clear",
    handleTerminalClear
  );

  return () => {
    window.removeEventListener(
      "diagramly-terminal-clear",
      handleTerminalClear
    );
  };
}, []);
  const handleLanguageChange = (key: CompilerLanguage) => {
    setLanguageKey(key);
    setCode(LANGUAGES[key].defaultCode);
    setAiResponse("");
    setGenerationSource(null);
    setSuccessfulExecutionId(null);
    setCodePrompt(null);
    setRetrievedPrompt(null);
    setSuccessfulExecutionPrompt(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    setCode(LANGUAGES[languageKey].defaultCode);
    setSuccessfulExecutionId(null);
    setCodePrompt(null);
    setSuccessfulExecutionPrompt(null);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setSuccessfulExecutionId(null);
    setSuccessfulExecutionPrompt(null);
  };

const handleRunCode = async () => {
  if (!code.trim() || isRunning) return;

  setIsRunning(true);
  setOutput("");
  setCompilerError("");
  setExitCode(null);
  setCompileStatus("idle");
  setSuccessfulExecutionId(null);

  setTerminalEntries(
    input.trim()
      ? [
          {
            type: "system",
            text: `> ${input}`,
          },
        ]
      : []
  );

  try {
    const response = await fetch("/api/compiler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageKey,
        code,
        stdin: input,
      }),
    });

    const data = await response.json();

    if (data.output) {
      setOutput(data.output);

      setTerminalEntries((prev) => [
        ...prev,
        {
          type: "output",
          text: data.output,
        },
      ]);
    }

    if (data.error) {
      setCompilerError(data.error);

      setTerminalEntries((prev) => [
        ...prev,
        {
          type: "error",
          text: data.error,
        },
      ]);
    }

    if (data.compiled && data.executed) {
      setCompileStatus("success");
      setExitCode(0);
    } else {
      setCompileStatus("error");
      setExitCode(1);
    }
  } catch (error) {
    console.error("Compiler error:", error);

    setCompilerError(
      "Unable to connect to the compiler service."
    );

    setCompileStatus("error");
    setExitCode(1);

    setTerminalEntries((prev) => [
      ...prev,
      {
        type: "error",
        text: "Unable to connect to the compiler service.",
      },
    ]);
  } finally {
    setIsRunning(false);
  }
};
const handleInteractiveRun = async () => {
  if (!code.trim() || isRunning) return;

  const promptForExecution = codePrompt || prompt.trim() || null;

  setIsRunning(true);
  setOutput("");
  setCompilerError("");
  setExitCode(null);
  setCompileStatus("idle");
  setSuccessfulExecutionId(null);
  setSuccessfulExecutionPrompt(null);
  setTerminalEntries([]);

  try {
    const response = await fetch(
      "/api/compiler/interactive",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
          language: languageKey,
          code,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to start program."
      );
    }

    jdoodleSessionRef.current = {
      sendInput: async (input: string) => {
        await fetch(
          "/api/compiler/interactive",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "input",
              sessionId: data.sessionId,
              input: input.replace(/\n$/, ""),
            }),
          }
        );
      },

      disconnect: async () => {
        await fetch(
          "/api/compiler/interactive",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "stop",
              sessionId: data.sessionId,
            }),
          }
        );
      },
    };

    setTerminalEntries([
      {
        type: "system",
        text: "Program started...",
      },
    ]);

    // Poll for program output
    const pollOutput = async () => {
      try {
        const result = await fetch(
          "/api/compiler/interactive",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "poll",
              sessionId: data.sessionId,
            }),
          }
        );

        const pollData =
          await result.json();

        if (pollData.output) {
          setOutput(
            (prev) =>
              prev + pollData.output
          );

          setTerminalEntries((prev) => [
            ...prev,
            {
              type: "output",
              text: pollData.output,
            },
          ]);
        }

        if (pollData.error) {
          setCompilerError(
            pollData.error
          );

          setTerminalEntries((prev) => [
            ...prev,
            {
              type: "error",
              text: pollData.error,
            },
          ]);
        }

        if (pollData.finished) {
          setExitCode(
            pollData.exitCode
          );

          setIsRunning(false);

          setCompileStatus(
            pollData.exitCode === 0
              ? "success"
              : "error"
          );

          jdoodleSessionRef.current =
            null;

          if (pollData.exitCode === 0) {
            setSuccessfulExecutionId(data.sessionId);
            setSuccessfulExecutionPrompt(promptForExecution);
          }

          return;
        }

        setTimeout(
          pollOutput,
          300
        );
      } catch (error: any) {
        setCompilerError(
          error.message ||
            "Failed to read program output."
        );

        setIsRunning(false);
      }
    };

    pollOutput();
  } catch (error: any) {
    setCompilerError(
      error.message ||
        "Unable to start program."
    );

    setTerminalEntries([
      {
        type: "error",
        text:
          error.message ||
          "Unable to start program.",
      },
    ]);

    setExitCode(1);
    setCompileStatus("error");
    setIsRunning(false);
  }
};
const sendRuntimeInput = () => {
  if (
    !jdoodleSessionRef.current ||
    !isRunning ||
    !input.trim()
  ) {
    return;
  }

  jdoodleSessionRef.current.sendInput(
    input + "\n"
  );

  setTerminalEntries((prev) => [
    ...prev,
    {
      type: "system",
      text: `> ${input}`,
    },
  ]);

  setInput("");
};
  useEffect(() => {
    if (!isDraggingTerminal) return;

    const handlePointerMove = (event: PointerEvent) => {
      const newHeight =
        window.innerHeight - event.clientY;

      const minHeight = 140;
      const maxHeight = window.innerHeight - 180;

      setTerminalHeight(
        Math.min(
          Math.max(newHeight, minHeight),
          maxHeight
        )
      );
    };

    const handlePointerUp = () => {
      setIsDraggingTerminal(false);
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, [isDraggingTerminal]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const originalPrompt = prompt.trim();

    setIsGenerating(true);
    setAiResponse("");
    setGenerationSource(null);
    setKnowledgeId(null);
    setRetrievedPrompt(null);

    try {
      const response = await fetch("/api/code-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: originalPrompt, language: languageKey }),
      });

      const data = await response.json();

      if (!data.success) {
        setAiResponse(data.notes?.join("\n") || "// No safe deterministic generation path is available.");
        return;
      }
      setAiResponse(data.code || "");
      setGenerationSource(data.provenance?.label || "Diagramly generation");
      setRetrievedPrompt(originalPrompt);
    } catch (error) {
      console.error(
        "Diagramly Knowledge Engine error:",
        error
      );

      setAiResponse(
        "// Unable to generate code right now."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRepair = async () => {
    if (!compilerError || isRepairing) return;
    setIsRepairing(true);
    setAiResponse("");
    try {
      const response = await fetch("/api/code-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt || "repair code", language: languageKey, currentCode: code, diagnostics: compilerError, executionOutput: output, repair: true }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.notes?.join(" ") || "No safe repair is available.");
      setAiResponse(data.code);
      setGenerationSource(data.provenance?.label || "Repaired using compiler feedback");
      setRetrievedPrompt(prompt || "repair code");
      setShowAI(true);
    } catch (error: any) {
      setTerminalEntries(prev => [...prev, { type: "error", text: error.message || "No safe repair is available." }]);
    } finally { setIsRepairing(false); }
  };

  const handleLearnSuccessfulSolution = async () => {
    if (!successfulExecutionId || isLearning) return;

    setIsLearning(true);

    try {
      const response = await fetch("/api/knowledge/learn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            successfulExecutionPrompt || "manual code submission",
          code,
          language: languageKey,
          executionId: successfulExecutionId,
          source: {
            type: "compiler",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.learned) {
        throw new Error(data.message || "Failed to learn solution.");
      }

      setTerminalEntries((prev) => [
        ...prev,
        {
          type: "system",
          text: "Solution saved to Diagramly knowledge.",
        },
      ]);
      setSuccessfulExecutionId(null);
      setSuccessfulExecutionPrompt(null);
    } catch (error: any) {
      setTerminalEntries((prev) => [
        ...prev,
        {
          type: "error",
          text: error.message || "Failed to learn solution.",
        },
      ]);
    } finally {
      setIsLearning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleInsertCode = async () => {
    if (!aiResponse.trim()) return;

    handleCodeChange(aiResponse);
    setCodePrompt(retrievedPrompt || prompt.trim() || null);

    // Mark the learned solution as accepted.
    if (knowledgeId) {
      try {
        await fetch("/api/knowledge", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            knowledgeId,
            action: "accepted",
          }),
        });
      } catch (error) {
        console.error(
          "Failed to record knowledge acceptance:",
          error
        );
      }
    }

    setShowAI(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative h-full w-full bg-slate-50 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Top Navigation Header */}
      <header
        className={`h-14 border-b px-4 flex items-center justify-between z-10 select-none transition-colors duration-200 ${
          isDark
            ? "border-slate-800 bg-slate-900/90 text-slate-100"
            : "border-slate-200 bg-white/90 text-slate-800"
        } backdrop-blur`}
      >
        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              id="language-select"
              aria-label="Select programming language"
              value={languageKey}
              onChange={(e) =>
                handleLanguageChange(e.target.value as CompilerLanguage)
              }
              className={`text-xs font-medium px-3 py-1.5 pr-8 rounded-md border transition-all cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDark
                  ? "bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600"
                  : "bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400"
              }`}
            >
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <option
                  key={key}
                  value={key}
                  className={isDark ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800"}
                >
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            />
          </div>

          <div className={`h-4 w-[1px] mx-1 ${isDark ? "bg-slate-800" : "bg-slate-300"}`} />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all ${
              isDark
                ? "bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-300 hover:text-slate-100"
                : "bg-slate-200/80 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? (
              <>
                <SunIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Utility Actions */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 text-xs border px-2.5 py-1.5 rounded-md transition-all ${
              isDark
                ? "text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border-slate-700/50"
                : "text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border-slate-300"
            }`}
            title="Copy Code"
          >
            {copied ? (
              <>
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetCode}
            className={`flex items-center gap-1.5 text-xs border px-2.5 py-1.5 rounded-md transition-all ${
              isDark
                ? "text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border-slate-700/50"
                : "text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border-slate-300"
            }`}
            title="Reset Starter Code"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
              {/* Run Code */}
<button
  type="button"
  onClick={handleInteractiveRun}
  disabled={isRunning || !code.trim()}
  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${
    isRunning
      ? isDark
        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
        : "bg-amber-50 border-amber-200 text-amber-600"
      : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
  } disabled:opacity-50 disabled:cursor-not-allowed`}
  title="Run Code"
>
  {isRunning ? (
    <>
      <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
      <span>Running...</span>
    </>
  ) : (
    <>
      <span>Run</span>
    </>
  )}
</button>
          {compileStatus === "error" && compilerError && (
            <button
              type="button"
              onClick={handleRepair}
              disabled={isRepairing}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border bg-amber-600 hover:bg-amber-500 border-amber-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Create a preview using safe compiler-feedback repairs"
            >
              <span>{isRepairing ? "Repairing..." : "Repair Code"}</span>
            </button>
          )}
          {successfulExecutionId && (
            <button
              type="button"
              onClick={handleLearnSuccessfulSolution}
              disabled={isLearning}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save this successful solution to Diagramly knowledge"
            >
              <span>{isLearning ? "Learning..." : "Learn solution"}</span>
            </button>
          )}
          {/* AI Toggle Header Button */}
          <button
            type="button"
            onClick={() => setShowAI(!showAI)}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
              showAI
                ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : isDark
                ? "border-indigo-800/60 bg-indigo-950/50 text-indigo-300 hover:border-indigo-500 hover:bg-indigo-900/70 hover:text-indigo-200 hover:shadow-lg hover:shadow-indigo-500/20"
                : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-lg hover:shadow-indigo-200/50"
            }`}
            title="Diagramly AI"
            aria-label="Diagramly AI"
          >
            <SparklesIcon
              className={`h-5 w-5 transition-transform duration-200 ${
                showAI
                  ? "scale-110"
                  : "group-hover:scale-110"
              }`}
            />

            {/* Active indicator */}
            {showAI && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </button>
        </div>
      </header>

      {/* Editor + Terminal */}
      <div className="flex-1 min-h-0 flex flex-col">

        {/* Monaco Editor */}
        <main
          className={`flex-1 min-h-0 w-full relative ${
            isDark ? "bg-slate-950" : "bg-white"
          }`}
        >
<Editor
  height="100%"
  language={LANGUAGES[languageKey].monacoLang}
  value={code}
  onChange={(val) => handleCodeChange(val || "")}
  theme={isDark ? "vs-dark" : "light"}
  options={{
    // --- Typography & Readability ---
    fontSize: 15, // Slightly larger for less eye strain
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
    fontLigatures: true, // Turns '===' and '=>' into beautiful connected symbols
    lineHeight: 24, // Adds vertical breathing room between lines
    
    // --- UI Layout ---
    minimap: { enabled: false }, // Keeps it clean
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 20, bottom: 20 },
    wordWrap: "on", // Prevents annoying horizontal scrolling
    
    // --- Animations & Cursors ---
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on", // Silky smooth typing animation
    
    // --- Coding Aids ---
    lineNumbersMinChars: 3,
    renderLineHighlight: "all",
    bracketPairColorization: {
      enabled: true, // Colors matching brackets (e.g., {}, [], ())
    },
    guides: {
      bracketPairs: true, // Draws connecting lines for matching brackets
      indentation: true, // Shows vertical lines for indentation levels
    },
    
    // --- Polish ---
    formatOnPaste: true,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      alwaysConsumeMouseWheel: false, // Prevents scroll trapping
    },
  }}
/>
        </main>

        {/* Resize Handle */}
        <div
          onPointerDown={() => setIsDraggingTerminal(true)}
          className={`h-1.5 shrink-0 cursor-row-resize border-y transition-colors ${
            isDraggingTerminal
              ? "bg-indigo-500"
              : isDark
              ? "bg-slate-800 hover:bg-indigo-500"
              : "bg-slate-200 hover:bg-indigo-400"
          }`}
          title="Drag to resize terminal"
        />

        {/* Terminal */}
        <div
          style={{ height: terminalHeight }}
          className="shrink-0 min-h-0"
        >
          <Terminal
  entries={terminalEntries}
  input={input}
  onInputChange={setInput}
  onSubmitInput={sendRuntimeInput}
  exitCode={exitCode}
  isRunning={isRunning}
/>
        </div>

      </div>

      {/* AI Assistant Overlay Panel */}
      {showAI && (
        <div
          className={`absolute bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] backdrop-blur-xl border rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col transition-all ${
            isDark
              ? "bg-slate-900/95 border-slate-700/80 text-slate-100"
              : "bg-white/95 border-slate-200 text-slate-800"
          }`}
        >
          {/* Panel Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-500 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-xs">Diagramly AI</h2>
                <span className={`text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Target: {LANGUAGES[languageKey].name}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAI(false)}
              className={`p-1 rounded-md transition ${
                isDark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              }`}
              aria-label="Close AI panel"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 flex flex-col gap-3">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI to write code, refactor, or fix bugs..."
                rows={3}
                className={`w-full resize-none rounded-xl border p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${
                  isDark
                    ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
              />
              <span className={`absolute bottom-2.5 right-3 text-[10px] pointer-events-none ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}>
                ⌘ + Enter
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Code...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {/* AI Output Section */}
          {aiResponse && (
            <div className={`border-t p-4 flex flex-col gap-2.5 max-h-[260px] ${
              isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-100 bg-slate-50/60"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  AI Output Preview
                </span>
                {generationSource && (
                  <span className={`text-[10px] ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
                    {generationSource}
                  </span>
                )}
              </div>

              <pre className={`flex-1 overflow-auto rounded-lg border p-3 text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${
                isDark
                  ? "bg-slate-950 border-slate-800/80 text-emerald-400"
                  : "bg-white border-slate-200 text-emerald-600"
              }`}>
                {aiResponse}
              </pre>

              <button
                type="button"
                onClick={handleInsertCode}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-semibold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
              >
                <CheckIcon className="w-3.5 h-3.5" />
                <span>Replace Code in Editor</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Visual Helper SVG Components
function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.707.707M5.05 18.95l-.707.707M21 12h-1M4 12H3m16.66 6.66l-.707-.707M5.05 5.05l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
