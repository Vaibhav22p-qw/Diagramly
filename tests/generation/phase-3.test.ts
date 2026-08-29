import test from "node:test";
import assert from "node:assert/strict";
import { analyzeGenerationRequest } from "@/lib/generation/request-analysis";
import { generateTemplate } from "@/lib/generation/templates";
import { selectCompatibleExample } from "@/lib/generation/example-selector";
import { repairCode } from "@/lib/generation/feedback";

test("analysis extracts language, concept, function and optimization", () => {
  const result = analyzeGenerationRequest({ prompt: "write an optimized binary search function named findItem in C++", language: "cpp" });
  assert.equal(result.language, "cpp"); assert.equal(result.concept, "binary-search"); assert.equal(result.functionName, "findItem"); assert.equal(result.preference, "optimized");
});
test("analysis recognizes sorting and palindrome", () => {
  assert.equal(analyzeGenerationRequest({ prompt: "implement quick sort in Python" }).concept, "quick-sort");
  assert.equal(analyzeGenerationRequest({ prompt: "write a palindrome program in Java" }).concept, "palindrome");
});
test("binary search templates cover every compiler language", () => {
  for (const language of ["c", "cpp", "java", "python"] as const) assert.ok(generateTemplate(language, analyzeGenerationRequest({ prompt: `binary search in ${language}`, language }))); 
});
test("selector rejects wrong-language knowledge", () => {
  const item = { _id: { toString: () => "python" }, concept: "binary-search", intent: "implementation", language: "python", code: "print(1)", validation: { compiled: true, executed: true, testsPassed: false, accepted: true }, usage: { timesRetrieved: 0, timesAccepted: 0 }, prompt: "binary search" };
  assert.equal(selectCompatibleExample([item] as never, analyzeGenerationRequest({ prompt: "binary search in C++", language: "cpp" })), null);
});
test("safe repairs change only known diagnostic patterns", () => {
  assert.equal(repairCode("cpp", "int main() { cout << 1; }", "cout was not declared").changed, true);
  assert.equal(repairCode("cpp", "int main() {}", "an unknown compiler error").changed, false);
});
