// Shared helper to run code via the existing compiler endpoint
import { LANGUAGES } from "./languages";

export async function runCode(language: keyof typeof LANGUAGES, code: string, stdin: string = "") {
  const response = await fetch("/api/compiler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, stdin }),
  });
  const data = await response.json();
  return data;
}
