// Shared language definitions for Monaco editor and compiler integration
export interface CompilerLanguage {
  /** Display name of the language */
  name: string;
  /** Monaco editor language identifier */
  monacoLang: string;
  /** Default starter code for new objects */
  defaultCode: string;
}

export const LANGUAGES: Record<string, CompilerLanguage> = {
  cpp: {
    name: "C++",
    monacoLang: "cpp",
    defaultCode: "// Write code here\n",
  },
  c: {
    name: "C",
    monacoLang: "c",
    defaultCode: "// Write code here\n",
  },
  java: {
    name: "Java",
    monacoLang: "java",
    defaultCode: "// Write code here\n",
  },
  python: {
    name: "Python",
    monacoLang: "python",
    defaultCode: "# Write code here\n",
  },
};
