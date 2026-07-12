"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const LANGUAGES: Record<string, { name: string; monacoLang: string; defaultCode: string }> = {
  c: {
    name: "C",
    monacoLang: "c",
    defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello Diagramly\\n");\n    return 0;\n}`,
  },
  cpp: {
    name: "C++",
    monacoLang: "cpp",
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello Diagramly";\n    return 0;\n}`,
  },
  java: {
    name: "Java",
    monacoLang: "java",
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Diagramly");\n    }\n}`,
  },
  python: {
    name: "Python",
    monacoLang: "python",
    defaultCode: `print("Hello Diagramly")`,
  },
};

export default function Compiler() {
  const [languageKey, setLanguageKey] = useState<string>("cpp");
  const [code, setCode] = useState<string>(LANGUAGES["cpp"].defaultCode);

  const handleLanguageChange = (key: string) => {
    setLanguageKey(key);
    setCode(LANGUAGES[key].defaultCode);
  };

  return (
    <div className="h-screen w-full bg-white text-gray-900 flex flex-col font-sans">
      <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between shadow-sm">
        <h1 className="font-semibold text-lg text-gray-800">Diagramly Code Editor</h1>

        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm font-medium text-gray-600">
            Language:
          </label>
          <select
            id="language-select"
            value={languageKey}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-50 text-gray-800 text-sm px-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 w-full bg-white">
        <Editor
          height="100%"
          language={LANGUAGES[languageKey].monacoLang}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-light"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
