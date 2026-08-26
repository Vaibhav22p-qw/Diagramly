import { analyzeConcept } from "@/lib/knowledge/concept-engine";
import type { CompilerLanguage } from "@/lib/compiler/execution-results";

const SUPPORTED_LANGUAGES = new Set<CompilerLanguage>([
  "c",
  "cpp",
  "java",
  "python",
]);

const LANGUAGE_ALIASES: Record<string, CompilerLanguage> = {
  c: "c",
  cpp: "cpp",
  "c++": "cpp",
  java: "java",
  python: "python",
  python3: "python",
};

const CANONICAL_INTENTS = new Set([
  "implementation",
  "explanation",
  "debugging",
  "optimization",
  "unknown",
]);

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeLabel(value: string): string {
  return normalizeText(value)
    .replace(/[^a-z0-9+#]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeKnowledgeLanguage(
  value: unknown
): CompilerLanguage | null {
  if (typeof value !== "string") return null;

  const language = LANGUAGE_ALIASES[normalizeText(value)];
  return language && SUPPORTED_LANGUAGES.has(language) ? language : null;
}

export function normalizeKnowledgeConcept(value: unknown, prompt = ""): string {
  const requested = typeof value === "string" ? value : "";
  const requestedAnalysis = analyzeConcept(requested);

  if (requestedAnalysis.concept !== "unknown") {
    return requestedAnalysis.concept;
  }

  const promptAnalysis = analyzeConcept(prompt);
  if (!normalizeText(requested) && promptAnalysis.concept !== "unknown") {
    return promptAnalysis.concept;
  }

  return normalizeLabel(requested) || "unknown";
}

export function normalizeKnowledgeIntent(value: unknown, prompt = ""): string {
  const requested = typeof value === "string" ? normalizeText(value) : "";
  const requestedAnalysis = analyzeConcept(requested);

  if (CANONICAL_INTENTS.has(requestedAnalysis.intent)) {
    return requestedAnalysis.intent;
  }

  const promptAnalysis = analyzeConcept(prompt);
  if (!requested && CANONICAL_INTENTS.has(promptAnalysis.intent)) {
    return promptAnalysis.intent;
  }

  return CANONICAL_INTENTS.has(requested) ? requested : "unknown";
}

export function normalizeKnowledgeTags(
  tags: unknown,
  analysisText: string,
  concept: string
): string[] {
  const analysis = analyzeConcept(analysisText);
  const supplied = Array.isArray(tags) ? tags : [];
  const values = [
    concept,
    ...analysis.keywords,
    analysis.complexity,
    ...supplied.filter((tag): tag is string => typeof tag === "string"),
  ];

  return Array.from(
    new Set(values.map(normalizeText).filter((tag) => tag && tag !== "unknown"))
  );
}

export type NormalizedKnowledge = {
  concept: string;
  intent: string;
  language: CompilerLanguage;
  tags: string[];
};

export function normalizeKnowledge(input: {
  prompt: string;
  concept?: unknown;
  intent?: unknown;
  language: unknown;
  tags?: unknown;
}): NormalizedKnowledge | null {
  const language = normalizeKnowledgeLanguage(input.language);
  if (!language) return null;

  const concept = normalizeKnowledgeConcept(input.concept, input.prompt);
  const intent = normalizeKnowledgeIntent(input.intent, input.prompt);

  return {
    concept,
    intent,
    language,
    tags: normalizeKnowledgeTags(
      input.tags,
      `${input.prompt} ${concept} ${intent} ${language}`,
      concept
    ),
  };
}
