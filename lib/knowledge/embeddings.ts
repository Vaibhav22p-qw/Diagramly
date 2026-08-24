import crypto from "crypto";
import {
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

export const EMBEDDING_MODEL =
  process.env.DIAGRAMLY_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_VERSION = 1;
export const EMBEDDING_DIMENSIONS = 384;

type EmbeddingInput = {
  prompt: string;
  concept: string;
  intent: string;
  language: string;
  tags: string[];
};

export type KnowledgeEmbedding = {
  embedding: number[];
  embeddingModel: string;
  embeddingVersion: number;
  embeddingTextHash: string;
  embeddedAt: Date;
};

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function normalizeValue(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildEmbeddingText({
  prompt,
  concept,
  intent,
  language,
  tags,
}: EmbeddingInput): string {
  const stableTags = Array.from(
    new Set(tags.map((tag) => normalizeValue(tag).toLowerCase()).filter(Boolean))
  ).sort();

  return [
    `Prompt: ${normalizeValue(prompt)}`,
    `Concept: ${normalizeValue(concept)}`,
    `Intent: ${normalizeValue(intent)}`,
    `Language: ${normalizeValue(language)}`,
    `Tags: ${stableTags.join(", ")}`,
  ].join("\n");
}

export function getEmbeddingTextHash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL, {
      dtype: "fp32",
    });
  }

  try {
    return await extractorPromise;
  } catch (error) {
    extractorPromise = null;
    throw error;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(normalizeValue(text), {
    pooling: "mean",
    normalize: true,
  });

  const embedding = Array.from(output.data as Float32Array);

  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected ${EMBEDDING_DIMENSIONS} embedding dimensions, received ${embedding.length}.`
    );
  }

  return embedding;
}

export async function generateEmbeddingSafely(
  text: string
): Promise<number[] | null> {
  try {
    return await generateEmbedding(text);
  } catch (error) {
    console.warn(
      "Diagramly local embedding generation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

export async function createKnowledgeEmbedding(
  input: EmbeddingInput
): Promise<KnowledgeEmbedding | null> {
  const embeddingText = buildEmbeddingText(input);
  const embedding = await generateEmbeddingSafely(embeddingText);

  if (!embedding) return null;

  return {
    embedding,
    embeddingModel: EMBEDDING_MODEL,
    embeddingVersion: EMBEDDING_VERSION,
    embeddingTextHash: getEmbeddingTextHash(embeddingText),
    embeddedAt: new Date(),
  };
}
