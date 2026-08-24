import { connectDB } from "@/lib/mongodb";
import Knowledge from "@/models/Knowledge";
import { analyzeConcept } from "@/lib/knowledge/concept-engine";
import type { CompilerLanguage } from "@/lib/compiler/execution-results";
import {
  buildEmbeddingText,
  createKnowledgeEmbedding,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_VERSION,
  getEmbeddingTextHash,
} from "@/lib/knowledge/embeddings";

type LearnInput = {
  prompt: string;
  code: string;
  language: CompilerLanguage;

  validation: {
    compiled: boolean;
    testsPassed: boolean;
    accepted: boolean;
  };

  source?: {
    type?: "compiler" | "document" | "canvas";
    userId?: string;
    workspaceId?: string;
  };
};

export async function learnFromSolution(
  input: LearnInput
) {
  const {
    prompt,
    code,
    language,
    validation,
    source,
  } = input;

  if (!prompt?.trim() || !code?.trim()) {
    throw new Error(
      "Prompt and code are required for learning."
    );
  }

  // Only learn from validated solutions.
  if (
    !validation.compiled ||
    !validation.testsPassed ||
    !validation.accepted
  ) {
    return {
      learned: false,
      reason: "Solution was not fully validated.",
    };
  }

  // Understand the user's request.
  const analysis = analyzeConcept(
    `${prompt} ${language}`
  );

  const detectedLanguage = language;

  const tags = Array.from(
    new Set([
      analysis.concept,
      ...analysis.keywords,
      analysis.complexity,
    ])
  ).filter(
    (tag) =>
      tag &&
      tag !== "unknown"
  );

  await connectDB();

  const embeddingInput = {
    prompt,
    concept: analysis.concept,
    intent: analysis.intent,
    language: detectedLanguage,
    tags,
  };
  const embeddingTextHash = getEmbeddingTextHash(
    buildEmbeddingText(embeddingInput)
  );

  // Check whether Diagramly already knows
  // this concept + language + intent.
  const existing = await Knowledge.findOne({
    concept: analysis.concept,
    language: detectedLanguage,
    intent: analysis.intent,
  });

  if (existing) {
    const meaningfulContentChanged =
      !existing.validation.accepted ||
      existing.code !== code ||
      existing.prompt !== prompt ||
      existing.tags.join("\u0000") !== tags.join("\u0000");

    const hasCurrentEmbedding =
      existing.embedding?.length === EMBEDDING_DIMENSIONS &&
      existing.embeddingVersion === EMBEDDING_VERSION &&
      existing.embeddingTextHash === embeddingTextHash;

    const knowledgeEmbedding =
      meaningfulContentChanged || !hasCurrentEmbedding
        ? await createKnowledgeEmbedding(embeddingInput)
        : null;

    // Keep the better validated solution.
    if (meaningfulContentChanged) {
      existing.code = code;
      existing.prompt = prompt;
      existing.validation = validation;
      existing.tags = tags;
      existing.tags = tags;
    }

    if (knowledgeEmbedding) {
      existing.embedding = knowledgeEmbedding.embedding;
      existing.embeddingModel = knowledgeEmbedding.embeddingModel;
      existing.embeddingVersion = knowledgeEmbedding.embeddingVersion;
      existing.embeddingTextHash = knowledgeEmbedding.embeddingTextHash;
      existing.embeddedAt = knowledgeEmbedding.embeddedAt;
    } else if (meaningfulContentChanged) {
      existing.embedding = undefined;
      existing.embeddingModel = undefined;
      existing.embeddingVersion = undefined;
      existing.embeddingTextHash = undefined;
      existing.embeddedAt = undefined;
    }

    if (meaningfulContentChanged || knowledgeEmbedding) {
      await existing.save();
    }

    return {
      learned: true,
      created: false,
      knowledgeId: existing._id,
      concept: existing.concept,
    };
  }

  const knowledgeEmbedding = await createKnowledgeEmbedding(embeddingInput);

  const knowledge = await Knowledge.create({
    concept: analysis.concept,
    intent: analysis.intent,
    language: detectedLanguage,

    prompt,
    code,

    source: {
      type: source?.type || "compiler",
      userId: source?.userId,
      workspaceId: source?.workspaceId,
    },

    validation,

    usage: {
      timesRetrieved: 0,
      timesAccepted: 0,
    },

    tags,

    ...(knowledgeEmbedding || {}),
  });

  return {
    learned: true,
    created: true,
    knowledgeId: knowledge._id,
    concept: knowledge.concept,
  };
}
