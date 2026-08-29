import type { IKnowledge } from "@/models/Knowledge";
import type { RequestAnalysis } from "./types";

export type KnowledgeCandidate = Pick<IKnowledge, "concept" | "intent" | "language" | "code" | "validation" | "usage" | "prompt"> & { _id: { toString(): string }; semanticScore?: number };

/** Ranks only language-compatible examples. A weak keyword match never crosses language boundaries. */
export function selectCompatibleExample(items: KnowledgeCandidate[], analysis: RequestAnalysis): KnowledgeCandidate | null {
  if (analysis.language === "unknown") return null;
  const compatible = items.filter(item => item.language === analysis.language && item.code.trim());
  const ranked = compatible.map(item => {
    let score = 0;
    if (item.concept === analysis.concept && analysis.concept !== "unknown") score += 100;
    if (item.intent === analysis.intent && analysis.intent !== "unknown") score += 35;
    if (item.validation.compiled && item.validation.executed) score += 30;
    if (item.validation.accepted) score += 20;
    score += Math.min(item.usage.timesAccepted * 3 + item.usage.timesRetrieved, 20);
    score += Math.round((item.semanticScore || 0) * 10);
    return { item, score };
  }).sort((a, b) => b.score - a.score);
  return ranked[0]?.score >= 100 ? ranked[0].item : null;
}
