import { connectDB } from "@/lib/mongodb";
import Knowledge from "@/models/Knowledge";
import { analyzeConcept } from "@/lib/knowledge/concept-engine";

type LearnInput = {
  prompt: string;
  code: string;
  language: string;

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

  const detectedLanguage =
    language?.trim() ||
    analysis.language;

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

  // Check whether Diagramly already knows
  // this concept + language + intent.
  const existing = await Knowledge.findOne({
    concept: analysis.concept,
    language: detectedLanguage,
    intent: analysis.intent,
  });

  if (existing) {
    // Keep the better validated solution.
    if (
      !existing.validation.accepted ||
      existing.code !== code
    ) {
      existing.code = code;
      existing.prompt = prompt;

      existing.validation = validation;

      existing.tags = tags;

      await existing.save();
    }

    return {
      learned: true,
      created: false,
      knowledgeId: existing._id,
      concept: existing.concept,
    };
  }

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
  });

  return {
    learned: true,
    created: true,
    knowledgeId: knowledge._id,
    concept: knowledge.concept,
  };
}