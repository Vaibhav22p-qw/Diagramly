import type { CompilerLanguage } from "@/lib/compiler/execution-results";

export function buildKeywordKnowledgeQuery(
  searchConditions: Record<string, unknown>[],
  language: CompilerLanguage | ""
) {
  return {
    $and: [
      { $or: searchConditions },
      ...(language ? [{ language }] : []),
    ],
  };
}

/** Combines vector candidates with keyword candidates while retaining fallback behavior. */
export function buildHybridKnowledgeQuery(
  keywordQuery: Record<string, unknown>,
  semanticIds: string[]
) {
  return semanticIds.length > 0
    ? {
        $or: [
          keywordQuery,
          { _id: { $in: semanticIds } },
        ],
      }
    : keywordQuery;
}
