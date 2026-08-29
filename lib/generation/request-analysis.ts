import { analyzeConcept } from "@/lib/knowledge/concept-engine";
import { normalizeKnowledgeLanguage } from "@/lib/knowledge/normalize";
import type { GenerationRequest, RequestAnalysis } from "./types";

function extract(text: string, expressions: RegExp[]): string | undefined {
  for (const expression of expressions) {
    const match = text.match(expression);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

export function analyzeGenerationRequest(request: GenerationRequest): RequestAnalysis {
  const base = analyzeConcept(request.prompt);
  const requestedLanguage = normalizeKnowledgeLanguage(request.language);
  const text = request.prompt.toLowerCase();
  const functionName = extract(request.prompt, [/function\s+(?:named\s+)?([A-Za-z_]\w*)/i, /named\s+([A-Za-z_]\w*)/i]);
  const className = extract(request.prompt, [/class\s+(?:named\s+)?([A-Za-z_]\w*)/i]);
  const implementationStyle = /\brecursive|recursion\b/.test(text) ? "recursive" : /\biterative\b/.test(text) ? "iterative" : undefined;
  const preference = /\boptimi[sz]ed|efficient|fast(?:er)?\b/.test(text) ? "optimized" : /\bsimple|basic|beginner\b/.test(text) ? "simple" : undefined;
  const inputOutput = /\b(input|output|stdin|stdout|read|print)\b/.test(text) ? "console input/output" : undefined;
  return {
    ...base,
    language: requestedLanguage || (base.language === "javascript" ? "unknown" : base.language),
    explicitRequirements: [functionName && `function:${functionName}`, className && `class:${className}`, implementationStyle, preference, inputOutput].filter(Boolean) as string[],
    functionName, className, inputOutput, implementationStyle, preference,
  };
}
