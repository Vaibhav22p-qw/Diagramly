import type { CompilerLanguage } from "@/lib/compiler/execution-results";

export type RepairResult = { code: string; changed: boolean; notes: string[] };

/** Conservative repairs: every rule has an observable diagnostic and a narrow transformation. */
export function repairCode(language: CompilerLanguage, code: string, diagnostics = ""): RepairResult {
  const diagnostic = diagnostics.toLowerCase();
  if (language === "cpp" && /cout|cin/.test(code) && /not declared|undeclared/.test(diagnostic) && !/#include\s*<iostream>/.test(code)) return { code: `#include <iostream>\n${code}`, changed: true, notes: ["Added the missing <iostream> include."] };
  if (language === "c" && /printf|scanf/.test(code) && /not declared|undeclared/.test(diagnostic) && !/#include\s*<stdio.h>/.test(code)) return { code: `#include <stdio.h>\n${code}`, changed: true, notes: ["Added the missing <stdio.h> include."] };
  if (language === "java" && /class Main is public.*file/i.test(diagnostics)) return { code: code.replace(/public\s+class\s+\w+/, "public class Main"), changed: true, notes: ["Aligned the public Java class name with Main."] };
  if (language === "python" && /expected an indented block/i.test(diagnostics)) return { code, changed: false, notes: ["Indentation requires a contextual human edit, so no code was changed."] };
  if ((language === "c" || language === "cpp") && /expected [';’]|missing ';'/.test(diagnostic)) {
    const lines = code.split("\n");
    const index = lines.findIndex(line => /\b(return|printf|scanf|cout|cin)\b/.test(line) && !/[;{}]\s*$/.test(line));
    if (index >= 0) { lines[index] = `${lines[index].trimEnd()};`; return { code: lines.join("\n"), changed: true, notes: ["Added a semicolon to the diagnostic-safe statement."] }; }
  }
  return { code, changed: false, notes: ["No safe deterministic repair matched the compiler feedback."] };
}
