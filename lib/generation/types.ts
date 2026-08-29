import type { CompilerLanguage } from "@/lib/compiler/execution-results";

export type GenerationMode = "retrieved-example" | "adapted-example" | "template" | "repair" | "unsupported";

export type RequestAnalysis = {
  language: CompilerLanguage | "unknown";
  concept: string;
  intent: string;
  complexity: "simple" | "medium" | "advanced" | "unknown";
  keywords: string[];
  explicitRequirements: string[];
  functionName?: string;
  className?: string;
  inputOutput?: string;
  implementationStyle?: "iterative" | "recursive";
  preference?: "simple" | "optimized";
};

export type GenerationRequest = {
  prompt: string;
  language?: CompilerLanguage | string;
  currentCode?: string;
  diagnostics?: string;
  executionOutput?: string;
  repair?: boolean;
};

export type GenerationPlan = {
  mode: GenerationMode;
  reason: string;
  knowledgeId?: string;
  template?: string;
};

export type GenerationProvenance = { kind: "knowledge" | "template" | "repair"; label: string; id?: string };

export type GenerationResult = {
  success: boolean;
  code: string;
  language: CompilerLanguage | "unknown";
  mode: GenerationMode;
  analysis: RequestAnalysis;
  provenance?: GenerationProvenance;
  notes: string[];
  confidence: "high" | "medium" | "low";
};
