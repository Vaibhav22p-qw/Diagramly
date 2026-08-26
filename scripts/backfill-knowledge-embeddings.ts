import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";

loadEnvConfig(process.cwd());

const batchSize = Math.max(
  1,
  Number.parseInt(process.env.KNOWLEDGE_EMBEDDING_BACKFILL_BATCH_SIZE || "25", 10)
);

async function main() {
  const [{ connectDB }, { default: Knowledge }, embeddings] = await Promise.all([
    import("@/lib/mongodb"),
    import("@/models/Knowledge"),
    import("@/lib/knowledge/embeddings"),
  ]);

  const {
    createKnowledgeEmbeddingWithStatus,
    hasCurrentKnowledgeEmbedding,
  } = embeddings;

  try {
    await connectDB();

    let lastId: string | null = null;
    let scanned = 0;
    let embedded = 0;
    let skipped = 0;
    let failed = 0;

    while (true) {
      const records = await Knowledge.find(
        lastId ? { _id: { $gt: lastId } } : {}
      )
        .sort({ _id: 1 })
        .limit(batchSize);

      if (records.length === 0) break;

      for (const record of records) {
        lastId = record._id.toString();
        scanned += 1;

        const embeddingInput = {
          prompt: record.prompt,
          concept: record.concept,
          intent: record.intent,
          language: record.language,
          tags: record.tags,
        };
        const isCurrent = hasCurrentKnowledgeEmbedding(record, embeddingInput);

        if (isCurrent) {
          if (record.embeddingStatus !== "ready" || record.embeddingError) {
            record.embeddingStatus = "ready";
            record.embeddingError = undefined;
            await record.save({ validateBeforeSave: false });
          }
          skipped += 1;
          continue;
        }

        const embeddingAttempt = await createKnowledgeEmbeddingWithStatus(embeddingInput);
        const knowledgeEmbedding = embeddingAttempt.knowledgeEmbedding;

        if (!knowledgeEmbedding) {
          record.embeddingStatus = "failed";
          record.embeddingError = embeddingAttempt.error;
          await record.save({ validateBeforeSave: false });
          failed += 1;
          continue;
        }

        record.embedding = knowledgeEmbedding.embedding;
        record.embeddingModel = knowledgeEmbedding.embeddingModel;
        record.embeddingVersion = knowledgeEmbedding.embeddingVersion;
        record.embeddingTextHash = knowledgeEmbedding.embeddingTextHash;
        record.embeddedAt = knowledgeEmbedding.embeddedAt;
        record.embeddingStatus = "ready";
        record.embeddingError = undefined;
        await record.save({ validateBeforeSave: false });
        embedded += 1;
      }

      console.log(
        `Scanned ${scanned}; embedded ${embedded}; skipped ${skipped}; failed ${failed}.`
      );
    }

    console.log(
      `Knowledge embedding backfill complete. Scanned ${scanned}; embedded ${embedded}; skipped ${skipped}; failed ${failed}.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Knowledge embedding backfill failed:", error);
  process.exitCode = 1;
});
