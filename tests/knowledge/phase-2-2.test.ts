import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEmbeddingText,
  createKnowledgeEmbeddingWithStatus,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_VERSION,
  getEmbeddingTextHash,
  hasCurrentKnowledgeEmbedding,
} from "@/lib/knowledge/embeddings";
import {
  normalizeKnowledge,
  normalizeKnowledgeConcept,
  normalizeKnowledgeIntent,
  normalizeKnowledgeLanguage,
  normalizeKnowledgeTags,
} from "@/lib/knowledge/normalize";
import {
  buildHybridKnowledgeQuery,
  buildKeywordKnowledgeQuery,
} from "@/lib/knowledge/retrieval";
import {
  consumeSuccessfulExecution,
  recordSuccessfulExecution,
} from "@/lib/compiler/execution-results";
import { isLearnableValidation } from "@/lib/knowledge/validation";

const embeddingInput = {
  prompt: "Implement binary search in C++",
  concept: "binary-search",
  intent: "implementation",
  language: "cpp",
  tags: ["binary search", "implementation"],
};

test("normalizes concepts, intents, languages, and deduplicated tags", () => {
  assert.equal(normalizeKnowledgeConcept("Binary Search"), "binary-search");
  assert.equal(normalizeKnowledgeIntent("write code"), "implementation");
  assert.equal(normalizeKnowledgeLanguage("C++"), "cpp");
  assert.deepEqual(
    normalizeKnowledgeTags([" Graph ", "graph", "DFS"], "implement graph", "graph"),
    ["graph", "implement", "dfs"]
  );
});

test("generic knowledge payload normalization uses the shared canonical pipeline", () => {
  assert.deepEqual(
    normalizeKnowledge({
      prompt: "Write a Binary Search implementation",
      concept: "Binary Search",
      intent: "write code",
      language: "C++",
      tags: ["Binary Search", "binary search", "custom tag"],
    }),
    {
      concept: "binary-search",
      intent: "implementation",
      language: "cpp",
      tags: [
        "binary-search",
        "write",
        "binary",
        "search",
        "implementation",
        "cpp",
        "binary search",
        "custom tag",
      ],
    }
  );
});

test("embedding generation records ready metadata", async () => {
  const attempt = await createKnowledgeEmbeddingWithStatus(
    embeddingInput,
    async () => Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0.5)
  );

  assert.equal(attempt.error, undefined);
  assert.equal(attempt.knowledgeEmbedding?.embedding.length, EMBEDDING_DIMENSIONS);
  assert.equal(attempt.knowledgeEmbedding?.embeddingVersion, EMBEDDING_VERSION);
});

test("embedding failures expose a safe failed status message", async () => {
  const attempt = await createKnowledgeEmbeddingWithStatus(embeddingInput, async () => {
    throw new Error("private internal path");
  });

  assert.equal(attempt.knowledgeEmbedding, null);
  assert.equal(
    attempt.error,
    "Local embedding generation failed. Retry collection or run the embedding backfill."
  );
});

test("changed embedding input invalidates stale embeddings", () => {
  const currentHash = getEmbeddingTextHash(buildEmbeddingText(embeddingInput));
  const record = {
    embedding: Array.from({ length: EMBEDDING_DIMENSIONS }, () => 0),
    embeddingVersion: EMBEDDING_VERSION,
    embeddingTextHash: currentHash,
  };

  assert.equal(hasCurrentKnowledgeEmbedding(record, embeddingInput), true);
  assert.equal(
    hasCurrentKnowledgeEmbedding(record, { ...embeddingInput, tags: ["different"] }),
    false
  );
});

test("keyword retrieval is language-isolated and remains the vector failure fallback", () => {
  const keywordQuery = buildKeywordKnowledgeQuery([{ tags: { $in: ["graph"] } }], "cpp");
  assert.deepEqual(keywordQuery, {
    $and: [{ $or: [{ tags: { $in: ["graph"] } }] }, { language: "cpp" }],
  });
  assert.deepEqual(buildHybridKnowledgeQuery(keywordQuery, []), keywordQuery);
});

test("a zero exit code is execution success, not a passing test suite", () => {
  recordSuccessfulExecution({
    executionId: "phase-2-2-test",
    language: "python",
    sourceCode: "print('ok')",
    exitCode: 0,
  });
  const validation = consumeSuccessfulExecution({
    executionId: "phase-2-2-test",
    language: "python",
    sourceCode: "print('ok')",
  });

  assert.deepEqual(validation, {
    compiled: true,
    executed: true,
    testsPassed: false,
    accepted: true,
  });
});

test("successful-execution records are consumed once and remain gated for Learn solution", () => {
  recordSuccessfulExecution({
    executionId: "phase-2-2-gate",
    language: "c",
    sourceCode: "int main(void) { return 0; }",
    exitCode: 0,
  });

  const validation = consumeSuccessfulExecution({
    executionId: "phase-2-2-gate",
    language: "c",
    sourceCode: "int main(void) { return 0; }",
  });
  assert.ok(validation);
  assert.equal(isLearnableValidation(validation), true);
  assert.equal(
    consumeSuccessfulExecution({
      executionId: "phase-2-2-gate",
      language: "c",
      sourceCode: "int main(void) { return 0; }",
    }),
    null
  );
  assert.equal(
    isLearnableValidation({ ...validation, accepted: false }),
    false,
    "the explicit Learn solution confirmation remains required"
  );
});
