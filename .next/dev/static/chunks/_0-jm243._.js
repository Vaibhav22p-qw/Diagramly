(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(routes)/workspace/_components/Compiler.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Compiler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$compiler$2f$Terminal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/compiler/Terminal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const LANGUAGES = {
    cpp: {
        name: "C++",
        monacoLang: "cpp",
        defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello Diagramly!" << endl;\n    return 0;\n}`
    },
    c: {
        name: "C",
        monacoLang: "c",
        defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello Diagramly!\\n");\n    return 0;\n}`
    },
    java: {
        name: "Java",
        monacoLang: "java",
        defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Diagramly!");\n    }\n}`
    },
    python: {
        name: "Python 3",
        monacoLang: "python",
        defaultCode: `print("Hello Diagramly!")`
    }
};
function Compiler() {
    _s();
    const jdoodleSessionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("dark");
    const isDark = theme === "dark";
    const [languageKey, setLanguageKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("cpp");
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(LANGUAGES["cpp"].defaultCode);
    const [showAI, setShowAI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [prompt, setPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [aiResponse, setAiResponse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [knowledgeId, setKnowledgeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [output, setOutput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [compilerError, setCompilerError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [compileStatus, setCompileStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [successfulExecutionId, setSuccessfulExecutionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [codePrompt, setCodePrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [retrievedPrompt, setRetrievedPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [successfulExecutionPrompt, setSuccessfulExecutionPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLearning, setIsLearning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [terminalEntries, setTerminalEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [exitCode, setExitCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [terminalHeight, setTerminalHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(260);
    const [isDraggingTerminal, setIsDraggingTerminal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const clearTerminal = ()=>{
        setTerminalEntries([]);
        setOutput("");
        setCompilerError("");
        setExitCode(null);
        setCompileStatus("idle");
        setSuccessfulExecutionId(null);
        setSuccessfulExecutionPrompt(null);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Compiler.useEffect": ()=>{
            const handleTerminalClear = {
                "Compiler.useEffect.handleTerminalClear": ()=>{
                    clearTerminal();
                }
            }["Compiler.useEffect.handleTerminalClear"];
            window.addEventListener("diagramly-terminal-clear", handleTerminalClear);
            return ({
                "Compiler.useEffect": ()=>{
                    window.removeEventListener("diagramly-terminal-clear", handleTerminalClear);
                }
            })["Compiler.useEffect"];
        }
    }["Compiler.useEffect"], []);
    const handleLanguageChange = (key)=>{
        setLanguageKey(key);
        setCode(LANGUAGES[key].defaultCode);
        setAiResponse("");
        setSuccessfulExecutionId(null);
        setCodePrompt(null);
        setRetrievedPrompt(null);
        setSuccessfulExecutionPrompt(null);
    };
    const handleCopyCode = ()=>{
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    const handleResetCode = ()=>{
        setCode(LANGUAGES[languageKey].defaultCode);
        setSuccessfulExecutionId(null);
        setCodePrompt(null);
        setSuccessfulExecutionPrompt(null);
    };
    const handleCodeChange = (value)=>{
        setCode(value);
        setSuccessfulExecutionId(null);
        setSuccessfulExecutionPrompt(null);
    };
    const handleRunCode = async ()=>{
        if (!code.trim() || isRunning) return;
        setIsRunning(true);
        setOutput("");
        setCompilerError("");
        setExitCode(null);
        setCompileStatus("idle");
        setSuccessfulExecutionId(null);
        setTerminalEntries(input.trim() ? [
            {
                type: "system",
                text: `> ${input}`
            }
        ] : []);
        try {
            const response = await fetch("/api/compiler", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    language: languageKey,
                    code,
                    stdin: input
                })
            });
            const data = await response.json();
            if (data.output) {
                setOutput(data.output);
                setTerminalEntries((prev)=>[
                        ...prev,
                        {
                            type: "output",
                            text: data.output
                        }
                    ]);
            }
            if (data.error) {
                setCompilerError(data.error);
                setTerminalEntries((prev)=>[
                        ...prev,
                        {
                            type: "error",
                            text: data.error
                        }
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
            setCompilerError("Unable to connect to the compiler service.");
            setCompileStatus("error");
            setExitCode(1);
            setTerminalEntries((prev)=>[
                    ...prev,
                    {
                        type: "error",
                        text: "Unable to connect to the compiler service."
                    }
                ]);
        } finally{
            setIsRunning(false);
        }
    };
    const handleInteractiveRun = async ()=>{
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
            const response = await fetch("/api/compiler/interactive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "start",
                    language: languageKey,
                    code
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || data.error || "Failed to start program.");
            }
            jdoodleSessionRef.current = {
                sendInput: async (input)=>{
                    await fetch("/api/compiler/interactive", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            action: "input",
                            sessionId: data.sessionId,
                            input: input.replace(/\n$/, "")
                        })
                    });
                },
                disconnect: async ()=>{
                    await fetch("/api/compiler/interactive", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            action: "stop",
                            sessionId: data.sessionId
                        })
                    });
                }
            };
            setTerminalEntries([
                {
                    type: "system",
                    text: "Program started..."
                }
            ]);
            // Poll for program output
            const pollOutput = async ()=>{
                try {
                    const result = await fetch("/api/compiler/interactive", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            action: "poll",
                            sessionId: data.sessionId
                        })
                    });
                    const pollData = await result.json();
                    if (pollData.output) {
                        setOutput((prev)=>prev + pollData.output);
                        setTerminalEntries((prev)=>[
                                ...prev,
                                {
                                    type: "output",
                                    text: pollData.output
                                }
                            ]);
                    }
                    if (pollData.error) {
                        setCompilerError(pollData.error);
                        setTerminalEntries((prev)=>[
                                ...prev,
                                {
                                    type: "error",
                                    text: pollData.error
                                }
                            ]);
                    }
                    if (pollData.finished) {
                        setExitCode(pollData.exitCode);
                        setIsRunning(false);
                        setCompileStatus(pollData.exitCode === 0 ? "success" : "error");
                        jdoodleSessionRef.current = null;
                        if (pollData.exitCode === 0) {
                            setSuccessfulExecutionId(data.sessionId);
                            setSuccessfulExecutionPrompt(promptForExecution);
                        }
                        return;
                    }
                    setTimeout(pollOutput, 300);
                } catch (error) {
                    setCompilerError(error.message || "Failed to read program output.");
                    setIsRunning(false);
                }
            };
            pollOutput();
        } catch (error) {
            setCompilerError(error.message || "Unable to start program.");
            setTerminalEntries([
                {
                    type: "error",
                    text: error.message || "Unable to start program."
                }
            ]);
            setExitCode(1);
            setCompileStatus("error");
            setIsRunning(false);
        }
    };
    const sendRuntimeInput = ()=>{
        if (!jdoodleSessionRef.current || !isRunning || !input.trim()) {
            return;
        }
        jdoodleSessionRef.current.sendInput(input + "\n");
        setTerminalEntries((prev)=>[
                ...prev,
                {
                    type: "system",
                    text: `> ${input}`
                }
            ]);
        setInput("");
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Compiler.useEffect": ()=>{
            if (!isDraggingTerminal) return;
            const handlePointerMove = {
                "Compiler.useEffect.handlePointerMove": (event)=>{
                    const newHeight = window.innerHeight - event.clientY;
                    const minHeight = 140;
                    const maxHeight = window.innerHeight - 180;
                    setTerminalHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
                }
            }["Compiler.useEffect.handlePointerMove"];
            const handlePointerUp = {
                "Compiler.useEffect.handlePointerUp": ()=>{
                    setIsDraggingTerminal(false);
                }
            }["Compiler.useEffect.handlePointerUp"];
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
            return ({
                "Compiler.useEffect": ()=>{
                    window.removeEventListener("pointermove", handlePointerMove);
                    window.removeEventListener("pointerup", handlePointerUp);
                }
            })["Compiler.useEffect"];
        }
    }["Compiler.useEffect"], [
        isDraggingTerminal
    ]);
    const handleGenerate = async ()=>{
        if (!prompt.trim() || isGenerating) return;
        const originalPrompt = prompt.trim();
        setIsGenerating(true);
        setAiResponse("");
        setKnowledgeId(null);
        setRetrievedPrompt(null);
        try {
            const response = await fetch(`/api/knowledge?q=${encodeURIComponent(originalPrompt)}&language=${encodeURIComponent(languageKey)}`);
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Knowledge retrieval failed");
            }
            const bestResult = data.results?.[0];
            if (!bestResult) {
                setAiResponse("// Diagramly has not learned this concept yet.\n// Try another request or teach Diagramly by adding a successful solution.");
                return;
            }
            setAiResponse(bestResult.code || "");
            setKnowledgeId(bestResult.id || null);
            setRetrievedPrompt(originalPrompt);
            // Tell Diagramly this knowledge was retrieved.
            if (bestResult.id) {
                await fetch("/api/knowledge", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        knowledgeId: bestResult.id,
                        action: "retrieved"
                    })
                });
            }
        } catch (error) {
            console.error("Diagramly Knowledge Engine error:", error);
            setAiResponse("// Unable to retrieve learned knowledge right now.");
        } finally{
            setIsGenerating(false);
        }
    };
    const handleLearnSuccessfulSolution = async ()=>{
        if (!successfulExecutionId || isLearning) return;
        setIsLearning(true);
        try {
            const response = await fetch("/api/knowledge/learn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: successfulExecutionPrompt || "manual code submission",
                    code,
                    language: languageKey,
                    executionId: successfulExecutionId,
                    source: {
                        type: "compiler"
                    }
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success || !data.learned) {
                throw new Error(data.message || "Failed to learn solution.");
            }
            setTerminalEntries((prev)=>[
                    ...prev,
                    {
                        type: "system",
                        text: "Solution saved to Diagramly knowledge."
                    }
                ]);
            setSuccessfulExecutionId(null);
            setSuccessfulExecutionPrompt(null);
        } catch (error) {
            setTerminalEntries((prev)=>[
                    ...prev,
                    {
                        type: "error",
                        text: error.message || "Failed to learn solution."
                    }
                ]);
        } finally{
            setIsLearning(false);
        }
    };
    const handleKeyDown = (e)=>{
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleGenerate();
        }
    };
    const handleInsertCode = async ()=>{
        if (!aiResponse.trim()) return;
        handleCodeChange(aiResponse);
        setCodePrompt(retrievedPrompt || prompt.trim() || null);
        // Mark the learned solution as accepted.
        if (knowledgeId) {
            try {
                await fetch("/api/knowledge", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        knowledgeId,
                        action: "accepted"
                    })
                });
            } catch (error) {
                console.error("Failed to record knowledge acceptance:", error);
            }
        }
        setShowAI(false);
    };
    const toggleTheme = ()=>{
        setTheme((prev)=>prev === "dark" ? "light" : "dark");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: `h-14 border-b px-4 flex items-center justify-between z-10 select-none transition-colors duration-200 ${isDark ? "border-slate-800 bg-slate-900/90 text-slate-100" : "border-slate-200 bg-white/90 text-slate-800"} backdrop-blur`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "language-select",
                                    "aria-label": "Select programming language",
                                    value: languageKey,
                                    onChange: (e)=>handleLanguageChange(e.target.value),
                                    className: `text-xs font-medium px-3 py-1.5 pr-8 rounded-md border transition-all cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? "bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600" : "bg-slate-100 text-slate-800 border-slate-300 hover:border-slate-400"}`,
                                    children: Object.entries(LANGUAGES).map(([key, lang])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: key,
                                            className: isDark ? "bg-slate-900 text-slate-200" : "bg-white text-slate-800",
                                            children: lang.name
                                        }, key, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 679,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 665,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronDownIcon, {
                                    className: `w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${isDark ? "text-slate-400" : "text-slate-500"}`
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 688,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 664,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-4 w-[1px] mx-1 ${isDark ? "bg-slate-800" : "bg-slate-300"}`
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 695,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: toggleTheme,
                            className: `flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all ${isDark ? "bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 text-slate-300 hover:text-slate-100" : "bg-slate-200/80 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"}`,
                            title: `Switch to ${isDark ? "Light" : "Dark"} Mode`,
                            children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SunIcon, {
                                        className: "w-3.5 h-3.5 text-amber-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 710,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Light"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 711,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 709,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoonIcon, {
                                        className: "w-3.5 h-3.5 text-slate-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 715,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Dark"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 716,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 714,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 698,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleCopyCode,
                            className: `flex items-center gap-1.5 text-xs border px-2.5 py-1.5 rounded-md transition-all ${isDark ? "text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border-slate-700/50" : "text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border-slate-300"}`,
                            title: "Copy Code",
                            children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {
                                        className: "w-3.5 h-3.5 text-emerald-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 734,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-emerald-500",
                                        children: "Copied"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 735,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 733,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyIcon, {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 739,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Copy"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 740,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 738,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 722,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleResetCode,
                            className: `flex items-center gap-1.5 text-xs border px-2.5 py-1.5 rounded-md transition-all ${isDark ? "text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border-slate-700/50" : "text-slate-600 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200 border-slate-300"}`,
                            title: "Reset Starter Code",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RefreshIcon, {
                                    className: "w-3.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 755,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Reset"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 756,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 745,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleInteractiveRun,
                            disabled: isRunning || !code.trim(),
                            className: `flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${isRunning ? isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600" : "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"} disabled:opacity-50 disabled:cursor-not-allowed`,
                            title: "Run Code",
                            children: isRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpinnerIcon, {
                                        className: "w-3.5 h-3.5 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 774,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Running..."
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 775,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 773,
                                columnNumber: 5
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Run"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 779,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 778,
                                columnNumber: 5
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 759,
                            columnNumber: 1
                        }, this),
                        successfulExecutionId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleLearnSuccessfulSolution,
                            disabled: isLearning,
                            className: "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed",
                            title: "Save this successful solution to Diagramly knowledge",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isLearning ? "Learning..." : "Learn solution"
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 791,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 784,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setShowAI(!showAI),
                            className: `group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${showAI ? "border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : isDark ? "border-indigo-800/60 bg-indigo-950/50 text-indigo-300 hover:border-indigo-500 hover:bg-indigo-900/70 hover:text-indigo-200 hover:shadow-lg hover:shadow-indigo-500/20" : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-lg hover:shadow-indigo-200/50"}`,
                            title: "Diagramly AI",
                            "aria-label": "Diagramly AI",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SparklesIcon, {
                                    className: `h-5 w-5 transition-transform duration-200 ${showAI ? "scale-110" : "group-hover:scale-110"}`
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 808,
                                    columnNumber: 13
                                }, this),
                                showAI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 818,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 795,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                    lineNumber: 662,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                lineNumber: 654,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-h-0 flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: `flex-1 min-h-0 w-full relative ${isDark ? "bg-slate-950" : "bg-white"}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                            height: "100%",
                            language: LANGUAGES[languageKey].monacoLang,
                            value: code,
                            onChange: (val)=>handleCodeChange(val || ""),
                            theme: isDark ? "vs-dark" : "light",
                            options: {
                                fontSize: 13.5,
                                fontFamily: "Fira Code, JetBrains Mono, monospace",
                                minimap: {
                                    enabled: false
                                },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: {
                                    top: 16,
                                    bottom: 16
                                },
                                smoothScrolling: true,
                                cursorBlinking: "smooth",
                                lineNumbersMinChars: 3,
                                renderLineHighlight: "all"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 833,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 828,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onPointerDown: ()=>setIsDraggingTerminal(true),
                        className: `h-1.5 shrink-0 cursor-row-resize border-y transition-colors ${isDraggingTerminal ? "bg-indigo-500" : isDark ? "bg-slate-800 hover:bg-indigo-500" : "bg-slate-200 hover:bg-indigo-400"}`,
                        title: "Drag to resize terminal"
                    }, void 0, false, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 855,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: terminalHeight
                        },
                        className: "shrink-0 min-h-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$compiler$2f$Terminal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            entries: terminalEntries,
                            input: input,
                            onInputChange: setInput,
                            onSubmitInput: sendRuntimeInput,
                            exitCode: exitCode,
                            isRunning: isRunning
                        }, void 0, false, {
                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                            lineNumber: 872,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 868,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                lineNumber: 825,
                columnNumber: 7
            }, this),
            showAI && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] backdrop-blur-xl border rounded-2xl shadow-2xl z-30 overflow-hidden flex flex-col transition-all ${isDark ? "bg-slate-900/95 border-slate-700/80 text-slate-100" : "bg-white/95 border-slate-200 text-slate-800"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/80"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-500 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SparklesIcon, {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 901,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 900,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-semibold text-xs",
                                                children: "Diagramly AI"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                                lineNumber: 904,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[10px] block ${isDark ? "text-slate-400" : "text-slate-500"}`,
                                                children: [
                                                    "Target: ",
                                                    LANGUAGES[languageKey].name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                                lineNumber: 905,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 903,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 899,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowAI(false),
                                className: `p-1 rounded-md transition ${isDark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"}`,
                                "aria-label": "Close AI panel",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CloseIcon, {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 919,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 911,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 894,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 flex flex-col gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: prompt,
                                        onChange: (e)=>setPrompt(e.target.value),
                                        onKeyDown: handleKeyDown,
                                        placeholder: "Ask AI to write code, refactor, or fix bugs...",
                                        rows: 3,
                                        className: `w-full resize-none rounded-xl border p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all ${isDark ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 926,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `absolute bottom-2.5 right-3 text-[10px] pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`,
                                        children: "⌘ + Enter"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 938,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 925,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleGenerate,
                                disabled: isGenerating || !prompt.trim(),
                                className: "w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2",
                                children: isGenerating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpinnerIcon, {
                                            className: "w-3.5 h-3.5 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 953,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Generating Code..."
                                        }, void 0, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 954,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 952,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SparklesIcon, {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 958,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Generate"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                            lineNumber: 959,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 957,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 945,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 924,
                        columnNumber: 11
                    }, this),
                    aiResponse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `border-t p-4 flex flex-col gap-2.5 max-h-[260px] ${isDark ? "border-slate-800 bg-slate-950/60" : "border-slate-100 bg-slate-50/60"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-[11px] font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`,
                                    children: "AI Output Preview"
                                }, void 0, false, {
                                    fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                    lineNumber: 971,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 970,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: `flex-1 overflow-auto rounded-lg border p-3 text-[11px] font-mono leading-relaxed whitespace-pre-wrap ${isDark ? "bg-slate-950 border-slate-800/80 text-emerald-400" : "bg-white border-slate-200 text-emerald-600"}`,
                                children: aiResponse
                            }, void 0, false, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 976,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleInsertCode,
                                className: "w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-semibold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 989,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Replace Code in Editor"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                        lineNumber: 990,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                                lineNumber: 984,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                        lineNumber: 967,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                lineNumber: 886,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 652,
        columnNumber: 5
    }, this);
}
_s(Compiler, "h9oMi/hIOcz/tbsMCqfAsx21qdc=");
_c = Compiler;
// Visual Helper SVG Components
function SunIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 3v1m0 16v1m8.66-13.66l-.707.707M5.05 18.95l-.707.707M21 12h-1M4 12H3m16.66 6.66l-.707-.707M5.05 5.05l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1004,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1003,
        columnNumber: 5
    }, this);
}
_c1 = SunIcon;
function MoonIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1012,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1011,
        columnNumber: 5
    }, this);
}
_c2 = MoonIcon;
function ChevronDownIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M19 9l-7 7-7-7"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1020,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1019,
        columnNumber: 5
    }, this);
}
_c3 = ChevronDownIcon;
function SparklesIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1028,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1027,
        columnNumber: 5
    }, this);
}
_c4 = SparklesIcon;
function CopyIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1036,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1035,
        columnNumber: 5
    }, this);
}
_c5 = CopyIcon;
function RefreshIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1044,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1043,
        columnNumber: 5
    }, this);
}
_c6 = RefreshIcon;
function CheckIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M5 13l4 4L19 7"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1052,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1051,
        columnNumber: 5
    }, this);
}
_c7 = CheckIcon;
function CloseIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M6 18L18 6M6 6l12 12"
        }, void 0, false, {
            fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
            lineNumber: 1060,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1059,
        columnNumber: 5
    }, this);
}
_c8 = CloseIcon;
function SpinnerIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                lineNumber: 1068,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
                lineNumber: 1069,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(routes)/workspace/_components/Compiler.tsx",
        lineNumber: 1067,
        columnNumber: 5
    }, this);
}
_c9 = SpinnerIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Compiler");
__turbopack_context__.k.register(_c1, "SunIcon");
__turbopack_context__.k.register(_c2, "MoonIcon");
__turbopack_context__.k.register(_c3, "ChevronDownIcon");
__turbopack_context__.k.register(_c4, "SparklesIcon");
__turbopack_context__.k.register(_c5, "CopyIcon");
__turbopack_context__.k.register(_c6, "RefreshIcon");
__turbopack_context__.k.register(_c7, "CheckIcon");
__turbopack_context__.k.register(_c8, "CloseIcon");
__turbopack_context__.k.register(_c9, "SpinnerIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(routes)/workspace/_components/Compiler.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/app/(routes)/workspace/_components/Compiler.tsx [app-client] (ecmascript)"));
}),
"[project]/components/compiler/Terminal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Terminal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function Terminal({ entries, input, onInputChange, onSubmitInput, exitCode = null, isRunning = false }) {
    _s();
    const terminalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isMaximized, setIsMaximized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSettings, setShowSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Terminal.useEffect": ()=>{
            if (terminalRef.current) {
                terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
        }
    }["Terminal.useEffect"], [
        entries,
        isRunning
    ]);
    const handleClear = ()=>{
        // Parent will handle clearing history later.
        window.dispatchEvent(new CustomEvent("diagramly-terminal-clear"));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col w-full bg-black text-white border-t border-slate-00 ${isMaximized ? "fixed inset-0 z-50" : "h-full"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-9 shrink-0 flex items-center justify-between bg-white border-b border-[#000] px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                title: "Terminal",
                                className: "px-2 py-1 text-xs text-black hover:bg-[#2b2b2b] rounded",
                                children: "Terminal"
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleClear,
                                title: "Clear terminal",
                                className: "px-2 py-1 text-xs text-black hover:text-white hover:bg-[#2b2b2b] rounded",
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowSettings((prev)=>!prev),
                                title: "Terminal settings",
                                className: "px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2b2b2b] rounded",
                                children: "⚙"
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 75,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `h-2 w-2 rounded-full ${isRunning ? "bg-yellow-400 animate-pulse" : "bg-emerald-500"}`
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400",
                                children: isRunning ? "Running" : "Input"
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/compiler/Terminal.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            showSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-2 mt-9 z-20 w-48 rounded-lg border border-[#333] bg-[#1b1b1b] p-3 shadow-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs font-medium text-gray-200 mb-2",
                        children: "Terminal Settings"
                    }, void 0, false, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-[11px] text-gray-500",
                        children: "Comming soon...."
                    }, void 0, false, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 110,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/compiler/Terminal.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: terminalRef,
                className: "flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6",
                children: [
                    isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mt-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-green-500",
                                children: ">"
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 123,
                                columnNumber: 5
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                autoFocus: true,
                                value: input,
                                onChange: (e)=>onInputChange(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        onSubmitInput?.();
                                    }
                                },
                                className: "flex-1 bg-transparent outline-none border-none text-gray-200 font-mono text-[13px] p-0",
                                placeholder: ""
                            }, void 0, false, {
                                fileName: "[project]/components/compiler/Terminal.tsx",
                                lineNumber: 127,
                                columnNumber: 5
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 122,
                        columnNumber: 3
                    }, this),
                    entries.length === 0 && !isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-gray-600",
                        children: "Diagramly terminal"
                    }, void 0, false, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    entries.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `whitespace-pre-wrap break-words ${entry.type === "error" ? "text-red-400" : entry.type === "system" ? "text-green-400" : entry.type === "input" ? "text-blue-400" : "text-gray-200"}`,
                            children: entry.text
                        }, `${index}-${entry.type}`, false, {
                            fileName: "[project]/components/compiler/Terminal.tsx",
                            lineNumber: 151,
                            columnNumber: 11
                        }, this)),
                    isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-yellow-400",
                        children: "Running program..."
                    }, void 0, false, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this),
                    exitCode !== null && !isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 text-green-400",
                        children: [
                            "Program code ",
                            exitCode
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/compiler/Terminal.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/compiler/Terminal.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/compiler/Terminal.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(Terminal, "gqZOAUjxW4fecISPXyTb7jYhxoU=");
_c = Terminal;
var _c;
__turbopack_context__.k.register(_c, "Terminal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "arrayLikeToArray",
    ()=>_arrayLikeToArray,
    "arrayWithHoles",
    ()=>_arrayWithHoles,
    "defineProperty",
    ()=>_defineProperty,
    "iterableToArrayLimit",
    ()=>_iterableToArrayLimit,
    "nonIterableRest",
    ()=>_nonIterableRest,
    "objectSpread2",
    ()=>_objectSpread2,
    "objectWithoutProperties",
    ()=>_objectWithoutProperties,
    "objectWithoutPropertiesLoose",
    ()=>_objectWithoutPropertiesLoose,
    "slicedToArray",
    ()=>_slicedToArray,
    "toPrimitive",
    ()=>_toPrimitive,
    "toPropertyKey",
    ()=>_toPropertyKey,
    "unsupportedIterableToArray",
    ()=>_unsupportedIterableToArray
]);
function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for(var e = 0, n = Array(a); e < a; e++)n[e] = r[e];
    return n;
}
function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: true,
        configurable: true,
        writable: true
    }) : e[r] = t, e;
}
function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
        var e, n, i, u, a = [], f = true, o = false;
        try {
            if (i = (t = t.call(r)).next, 0 === l) ;
            else for(; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
        } catch (r) {
            o = true, n = r;
        } finally{
            try {
                if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
            } finally{
                if (o) throw n;
            }
        }
        return a;
    }
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread2(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), true).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r);
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
    if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = ({}).toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
}
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/config/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>config
]);
var config = {
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs'
    }
};
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/loader/index.js [app-client] (ecmascript)");
;
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/loader/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>loader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$state$2d$local$2f$lib$2f$es$2f$state$2d$local$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/state-local/lib/es/state-local.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$config$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/config/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$validators$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/validators/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$compose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/utils/compose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$deepMerge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$makeCancelable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var _excluded = [
    "monaco"
];
/** the local state of the module */ var _state$create = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$state$2d$local$2f$lib$2f$es$2f$state$2d$local$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    config: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$config$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
    isInitialized: false,
    resolve: null,
    reject: null,
    monaco: null
}), _state$create2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slicedToArray"])(_state$create, 2), getState = _state$create2[0], setState = _state$create2[1];
/**
 * set the loader configuration
 * @param {Object} config - the configuration object
 */ function config(globalConfig) {
    var _validators$config = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$validators$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].config(globalConfig), monaco = _validators$config.monaco, config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["objectWithoutProperties"])(_validators$config, _excluded);
    setState(function(state) {
        return {
            config: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$deepMerge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(state.config, config),
            monaco: monaco
        };
    });
}
/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */ function init() {
    var state = getState(function(_ref) {
        var monaco = _ref.monaco, isInitialized = _ref.isInitialized, resolve = _ref.resolve;
        return {
            monaco: monaco,
            isInitialized: isInitialized,
            resolve: resolve
        };
    });
    if (!state.isInitialized) {
        setState({
            isInitialized: true
        });
        if (state.monaco) {
            state.resolve(state.monaco);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$makeCancelable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(wrapperPromise);
        }
        if (window.monaco && window.monaco.editor) {
            storeMonacoInstance(window.monaco);
            state.resolve(window.monaco);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$makeCancelable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(wrapperPromise);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$compose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(injectScripts, getMonacoLoaderScript)(configureLoader);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$makeCancelable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(wrapperPromise);
}
/**
 * injects provided scripts into the document.body
 * @param {Object} script - an HTML script element
 * @return {Object} - the injected HTML script element
 */ function injectScripts(script) {
    return document.body.appendChild(script);
}
/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {Object} - the created HTML script element
 */ function createScript(src) {
    var script = document.createElement('script');
    return src && (script.src = src), script;
}
/**
 * creates an HTML script element with the monaco loader src
 * @return {Object} - the created HTML script element
 */ function getMonacoLoaderScript(configureLoader) {
    var state = getState(function(_ref2) {
        var config = _ref2.config, reject = _ref2.reject;
        return {
            config: config,
            reject: reject
        };
    });
    var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));
    loaderScript.onload = function() {
        return configureLoader();
    };
    loaderScript.onerror = state.reject;
    return loaderScript;
}
/**
 * configures the monaco loader
 */ function configureLoader() {
    var state = getState(function(_ref3) {
        var config = _ref3.config, resolve = _ref3.resolve, reject = _ref3.reject;
        return {
            config: config,
            resolve: resolve,
            reject: reject
        };
    });
    var require = window.require;
    require.config(state.config);
    require([
        'vs/editor/editor.main'
    ], function(loaded) {
        var monaco = loaded.m /* for 0.53 & 0.54 */  || loaded /* for other versions */ ;
        storeMonacoInstance(monaco);
        state.resolve(monaco);
    }, function(error) {
        state.reject(error);
    });
}
/**
 * store monaco instance in local state
 */ function storeMonacoInstance(monaco) {
    if (!getState().monaco) {
        setState({
            monaco: monaco
        });
    }
}
/**
 * internal helper function
 * extracts stored monaco instance
 * @return {Object|null} - the monaco instance
 */ function __getMonacoInstance() {
    return getState(function(_ref4) {
        var monaco = _ref4.monaco;
        return monaco;
    });
}
var wrapperPromise = new Promise(function(resolve, reject) {
    return setState({
        resolve: resolve,
        reject: reject
    });
});
var loader = {
    config: config,
    init: init,
    __getMonacoInstance: __getMonacoInstance
};
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/utils/compose.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>compose
]);
var compose = function compose() {
    for(var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++){
        fns[_key] = arguments[_key];
    }
    return function(x) {
        return fns.reduceRight(function(y, f) {
            return f(y);
        }, x);
    };
};
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/utils/curry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>curry
]);
function curry(fn) {
    return function curried() {
        var _this = this;
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        return args.length >= fn.length ? fn.apply(this, args) : function() {
            for(var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
                nextArgs[_key2] = arguments[_key2];
            }
            return curried.apply(_this, [].concat(args, nextArgs));
        };
    };
}
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>merge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js [app-client] (ecmascript)");
;
function merge(target, source) {
    Object.keys(source).forEach(function(key) {
        if (source[key] instanceof Object) {
            if (target[key]) {
                Object.assign(source[key], merge(target[key], source[key]));
            }
        }
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["objectSpread2"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$_virtual$2f$_rollupPluginBabelHelpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["objectSpread2"])({}, target), source);
}
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/utils/isObject.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isObject
]);
function isObject(value) {
    return ({}).toString.call(value).includes('Object');
}
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CANCELATION_MESSAGE",
    ()=>CANCELATION_MESSAGE,
    "default",
    ()=>makeCancelable
]);
// The source (has been changed) is https://github.com/facebook/react/issues/5465#issuecomment-157888325
var CANCELATION_MESSAGE = {
    type: 'cancelation',
    msg: 'operation is manually canceled'
};
function makeCancelable(promise) {
    var hasCanceled_ = false;
    var wrappedPromise = new Promise(function(resolve, reject) {
        promise.then(function(val) {
            return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
        });
        promise["catch"](reject);
    });
    return wrappedPromise.cancel = function() {
        return hasCanceled_ = true;
    }, wrappedPromise;
}
;
}),
"[project]/node_modules/@monaco-editor/loader/lib/es/validators/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>validators,
    "errorHandler",
    ()=>errorHandler,
    "errorMessages",
    ()=>errorMessages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$curry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/utils/curry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$isObject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/utils/isObject.js [app-client] (ecmascript)");
;
;
/**
 * validates the configuration object and informs about deprecation
 * @param {Object} config - the configuration object 
 * @return {Object} config - the validated configuration object
 */ function validateConfig(config) {
    if (!config) errorHandler('configIsRequired');
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$isObject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(config)) errorHandler('configType');
    if (config.urls) {
        informAboutDeprecation();
        return {
            paths: {
                vs: config.urls.monacoBase
            }
        };
    }
    return config;
}
/**
 * logs deprecation message
 */ function informAboutDeprecation() {
    console.warn(errorMessages.deprecation);
}
function throwError(errorMessages, type) {
    throw new Error(errorMessages[type] || errorMessages["default"]);
}
var errorMessages = {
    configIsRequired: 'the configuration object is required',
    configType: 'the configuration object should be an object',
    "default": 'an unknown error accured in `@monaco-editor/loader` package',
    deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$utils$2f$curry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(throwError)(errorMessages);
var validators = {
    config: validateConfig
};
;
}),
"[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DiffEditor",
    ()=>we,
    "Editor",
    ()=>de,
    "default",
    ()=>Ft,
    "useMonaco",
    ()=>Le
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@monaco-editor/loader/lib/es/loader/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
;
;
;
;
var le = {
    wrapper: {
        display: "flex",
        position: "relative",
        textAlign: "initial"
    },
    fullWidth: {
        width: "100%"
    },
    hide: {
        display: "none"
    }
}, v = le;
;
var ae = {
    container: {
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
}, Y = ae;
function Me({ children: e }) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        style: Y.container
    }, e);
}
var Z = Me;
var $ = Z;
function Ee({ width: e, height: r, isEditorReady: n, loading: t, _ref: a, className: m, wrapperProps: E }) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("section", {
        style: {
            ...v.wrapper,
            width: e,
            height: r
        },
        ...E
    }, !n && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement($, null, t), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: a,
        style: {
            ...v.fullWidth,
            ...!n && v.hide
        },
        className: m
    }));
}
var ee = Ee;
var H = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ee);
;
function Ce(e) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(e, []);
}
var k = Ce;
;
function he(e, r, n = !0) {
    let t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(!0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t.current || !n ? ()=>{
        t.current = !1;
    } : e, r);
}
var l = he;
function D() {}
function h(e, r, n, t) {
    return De(e, t) || be(e, r, n, t);
}
function De(e, r) {
    return e.editor.getModel(te(e, r));
}
function be(e, r, n, t) {
    return e.editor.createModel(r, n, t ? te(e, t) : void 0);
}
function te(e, r) {
    return e.Uri.parse(r);
}
function Oe({ original: e, modified: r, language: n, originalLanguage: t, modifiedLanguage: a, originalModelPath: m, modifiedModelPath: E, keepCurrentOriginalModel: g = !1, keepCurrentModifiedModel: N = !1, theme: x = "light", loading: P = "Loading...", options: y = {}, height: V = "100%", width: z = "100%", className: F, wrapperProps: j = {}, beforeMount: A = D, onMount: q = D }) {
    let [M, O] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!1), [T, s] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!0), u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), w = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(q), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(A), b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(!1);
    k(()=>{
        let i = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init();
        return i.then((f)=>(c.current = f) && s(!1)).catch((f)=>f?.type !== "cancelation" && console.error("Monaco initialization: error:", f)), ()=>u.current ? I() : i.cancel();
    }), l(()=>{
        if (u.current && c.current) {
            let i = u.current.getOriginalEditor(), f = h(c.current, e || "", t || n || "text", m || "");
            f !== i.getModel() && i.setModel(f);
        }
    }, [
        m
    ], M), l(()=>{
        if (u.current && c.current) {
            let i = u.current.getModifiedEditor(), f = h(c.current, r || "", a || n || "text", E || "");
            f !== i.getModel() && i.setModel(f);
        }
    }, [
        E
    ], M), l(()=>{
        let i = u.current.getModifiedEditor();
        i.getOption(c.current.editor.EditorOption.readOnly) ? i.setValue(r || "") : r !== i.getValue() && (i.executeEdits("", [
            {
                range: i.getModel().getFullModelRange(),
                text: r || "",
                forceMoveMarkers: !0
            }
        ]), i.pushUndoStop());
    }, [
        r
    ], M), l(()=>{
        u.current?.getModel()?.original.setValue(e || "");
    }, [
        e
    ], M), l(()=>{
        let { original: i, modified: f } = u.current.getModel();
        c.current.editor.setModelLanguage(i, t || n || "text"), c.current.editor.setModelLanguage(f, a || n || "text");
    }, [
        n,
        t,
        a
    ], M), l(()=>{
        c.current?.editor.setTheme(x);
    }, [
        x
    ], M), l(()=>{
        u.current?.updateOptions(y);
    }, [
        y
    ], M);
    let L = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!c.current) return;
        o.current(c.current);
        let i = h(c.current, e || "", t || n || "text", m || ""), f = h(c.current, r || "", a || n || "text", E || "");
        u.current?.setModel({
            original: i,
            modified: f
        });
    }, [
        n,
        r,
        a,
        e,
        t,
        m,
        E
    ]), U = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        !b.current && w.current && (u.current = c.current.editor.createDiffEditor(w.current, {
            automaticLayout: !0,
            ...y
        }), L(), c.current?.editor.setTheme(x), O(!0), b.current = !0);
    }, [
        y,
        x,
        L
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        M && d.current(u.current, c.current);
    }, [
        M
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        !T && !M && U();
    }, [
        T,
        M,
        U
    ]);
    function I() {
        let i = u.current?.getModel();
        g || i?.original?.dispose(), N || i?.modified?.dispose(), u.current?.dispose();
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(H, {
        width: z,
        height: V,
        isEditorReady: M,
        loading: P,
        _ref: w,
        className: F,
        wrapperProps: j
    });
}
var ie = Oe;
var we = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ie);
;
;
function Pe() {
    let [e, r] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].__getMonacoInstance());
    return k(()=>{
        let n;
        return e || (n = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init(), n.then((t)=>{
            r(t);
        })), ()=>n?.cancel();
    }), e;
}
var Le = Pe;
;
;
;
;
function He(e) {
    let r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        r.current = e;
    }, [
        e
    ]), r.current;
}
var se = He;
var _ = new Map;
function Ve({ defaultValue: e, defaultLanguage: r, defaultPath: n, value: t, language: a, path: m, theme: E = "light", line: g, loading: N = "Loading...", options: x = {}, overrideServices: P = {}, saveViewState: y = !0, keepCurrentModel: V = !1, width: z = "100%", height: F = "100%", className: j, wrapperProps: A = {}, beforeMount: q = D, onMount: M = D, onChange: O, onValidate: T = D }) {
    let [s, u] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!1), [c, w] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!0), d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), L = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(M), U = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(q), I = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(), i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t), f = se(m), Q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(!1), B = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(!1);
    k(()=>{
        let p = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$monaco$2d$editor$2f$loader$2f$lib$2f$es$2f$loader$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].init();
        return p.then((R)=>(d.current = R) && w(!1)).catch((R)=>R?.type !== "cancelation" && console.error("Monaco initialization: error:", R)), ()=>o.current ? pe() : p.cancel();
    }), l(()=>{
        let p = h(d.current, e || t || "", r || a || "", m || n || "");
        p !== o.current?.getModel() && (y && _.set(f, o.current?.saveViewState()), o.current?.setModel(p), y && o.current?.restoreViewState(_.get(m)));
    }, [
        m
    ], s), l(()=>{
        o.current?.updateOptions(x);
    }, [
        x
    ], s), l(()=>{
        !o.current || t === void 0 || (o.current.getOption(d.current.editor.EditorOption.readOnly) ? o.current.setValue(t) : t !== o.current.getValue() && (B.current = !0, o.current.executeEdits("", [
            {
                range: o.current.getModel().getFullModelRange(),
                text: t,
                forceMoveMarkers: !0
            }
        ]), o.current.pushUndoStop(), B.current = !1));
    }, [
        t
    ], s), l(()=>{
        let p = o.current?.getModel();
        p && a && d.current?.editor.setModelLanguage(p, a);
    }, [
        a
    ], s), l(()=>{
        g !== void 0 && o.current?.revealLine(g);
    }, [
        g
    ], s), l(()=>{
        d.current?.editor.setTheme(E);
    }, [
        E
    ], s);
    let X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!(!b.current || !d.current) && !Q.current) {
            U.current(d.current);
            let p = m || n, R = h(d.current, t || e || "", r || a || "", p || "");
            o.current = d.current?.editor.create(b.current, {
                model: R,
                automaticLayout: !0,
                ...x
            }, P), y && o.current.restoreViewState(_.get(p)), d.current.editor.setTheme(E), g !== void 0 && o.current.revealLine(g), u(!0), Q.current = !0;
        }
    }, [
        e,
        r,
        n,
        t,
        a,
        m,
        x,
        P,
        y,
        E,
        g
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        s && L.current(o.current, d.current);
    }, [
        s
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        !c && !s && X();
    }, [
        c,
        s,
        X
    ]), i.current = t, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        s && O && (I.current?.dispose(), I.current = o.current?.onDidChangeModelContent((p)=>{
            B.current || O(o.current.getValue(), p);
        }));
    }, [
        s,
        O
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (s) {
            let p = d.current.editor.onDidChangeMarkers((R)=>{
                let G = o.current.getModel()?.uri;
                if (G && R.find((J)=>J.path === G.path)) {
                    let J = d.current.editor.getModelMarkers({
                        resource: G
                    });
                    T?.(J);
                }
            });
            return ()=>{
                p?.dispose();
            };
        }
        return ()=>{};
    }, [
        s,
        T
    ]);
    function pe() {
        I.current?.dispose(), V ? y && _.set(m, o.current.saveViewState()) : o.current.getModel()?.dispose(), o.current.dispose();
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(H, {
        width: z,
        height: F,
        isEditorReady: s,
        loading: N,
        _ref: b,
        className: j,
        wrapperProps: A
    });
}
var fe = Ve;
var de = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(fe);
var Ft = de;
;
}),
"[project]/node_modules/state-local/lib/es/state-local.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread2(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}
function compose() {
    for(var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++){
        fns[_key] = arguments[_key];
    }
    return function(x) {
        return fns.reduceRight(function(y, f) {
            return f(y);
        }, x);
    };
}
function curry(fn) {
    return function curried() {
        var _this = this;
        for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
            args[_key2] = arguments[_key2];
        }
        return args.length >= fn.length ? fn.apply(this, args) : function() {
            for(var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++){
                nextArgs[_key3] = arguments[_key3];
            }
            return curried.apply(_this, [].concat(args, nextArgs));
        };
    };
}
function isObject(value) {
    return ({}).toString.call(value).includes('Object');
}
function isEmpty(obj) {
    return !Object.keys(obj).length;
}
function isFunction(value) {
    return typeof value === 'function';
}
function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
function validateChanges(initial, changes) {
    if (!isObject(changes)) errorHandler('changeType');
    if (Object.keys(changes).some(function(field) {
        return !hasOwnProperty(initial, field);
    })) errorHandler('changeField');
    return changes;
}
function validateSelector(selector) {
    if (!isFunction(selector)) errorHandler('selectorType');
}
function validateHandler(handler) {
    if (!(isFunction(handler) || isObject(handler))) errorHandler('handlerType');
    if (isObject(handler) && Object.values(handler).some(function(_handler) {
        return !isFunction(_handler);
    })) errorHandler('handlersType');
}
function validateInitial(initial) {
    if (!initial) errorHandler('initialIsRequired');
    if (!isObject(initial)) errorHandler('initialType');
    if (isEmpty(initial)) errorHandler('initialContent');
}
function throwError(errorMessages, type) {
    throw new Error(errorMessages[type] || errorMessages["default"]);
}
var errorMessages = {
    initialIsRequired: 'initial state is required',
    initialType: 'initial state should be an object',
    initialContent: 'initial state shouldn\'t be an empty object',
    handlerType: 'handler should be an object or a function',
    handlersType: 'all handlers should be a functions',
    selectorType: 'selector should be a function',
    changeType: 'provided value of changes should be an object',
    changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
    "default": 'an unknown error accured in `state-local` package'
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
    changes: validateChanges,
    selector: validateSelector,
    handler: validateHandler,
    initial: validateInitial
};
function create(initial) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    validators.initial(initial);
    validators.handler(handler);
    var state = {
        current: initial
    };
    var didUpdate = curry(didStateUpdate)(state, handler);
    var update = curry(updateState)(state);
    var validate = curry(validators.changes)(initial);
    var getChanges = curry(extractChanges)(state);
    function getState() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function(state) {
            return state;
        };
        validators.selector(selector);
        return selector(state.current);
    }
    function setState(causedChanges) {
        compose(didUpdate, update, validate, getChanges)(causedChanges);
    }
    return [
        getState,
        setState
    ];
}
function extractChanges(state, causedChanges) {
    return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}
function updateState(state, changes) {
    state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
    return changes;
}
function didStateUpdate(state, handler, changes) {
    isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function(field) {
        var _handler$field;
        return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
    });
    return changes;
}
var index = {
    create: create
};
const __TURBOPACK__default__export__ = index;
}),
]);

//# sourceMappingURL=_0-jm243._.js.map