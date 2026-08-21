import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Knowledge from "@/models/Knowledge";
import { analyzeConcept } from "@/lib/knowledge/concept-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      concept,
      intent,
      language,
      prompt,
      code,
      source,
      validation,
      tags,
    } = body;

    if (!concept || !intent || !language || !prompt || !code) {
      return NextResponse.json(
        {
          message:
            "concept, intent, language, prompt, and code are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const knowledge = await Knowledge.create({
      concept,
      intent,
      language,
      prompt,
      code,

      source: {
        type: source?.type || "compiler",
        userId: source?.userId,
        workspaceId: source?.workspaceId,
      },

      validation: {
        compiled: validation?.compiled ?? false,
        testsPassed: validation?.testsPassed ?? false,
        accepted: validation?.accepted ?? false,
      },

      usage: {
        timesRetrieved: 0,
        timesAccepted: 0,
      },

      tags: tags || [],
    });

    return NextResponse.json(
      {
        success: true,
        knowledge,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Knowledge API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save knowledge.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const {
      knowledgeId,
      action,
    } = body;

    if (!knowledgeId || !action) {
      return NextResponse.json(
        {
          success: false,
          message: "knowledgeId and action are required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "retrieved" &&
      action !== "accepted"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "action must be 'retrieved' or 'accepted'.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const update =
      action === "retrieved"
        ? {
            $inc: {
              "usage.timesRetrieved": 1,
            },
          }
        : {
            $inc: {
              "usage.timesAccepted": 1,
            },
          };

    const knowledge = await Knowledge.findByIdAndUpdate(
      knowledgeId,
      update,
      {
        new: true,
      }
    );

    if (!knowledge) {
      return NextResponse.json(
        {
          success: false,
          message: "Knowledge entry not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      knowledge,
    });
  } catch (error) {
    console.error("Knowledge feedback error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update knowledge feedback.",
      },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";
    const requestedLanguage =
      searchParams.get("language")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query is required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // -----------------------------------------
    // 1. Understand the user's request
    // -----------------------------------------

    const analysis = analyzeConcept(query);

    const language =
      requestedLanguage || analysis.language;

    // -----------------------------------------
    // 2. Build search terms
    // -----------------------------------------

    const queryWords = analysis.keywords.filter(
      (word) => word.length > 2
    );

    const searchConditions: any[] = [];

    if (analysis.concept !== "unknown") {
      searchConditions.push({
        concept: {
          $regex: analysis.concept,
          $options: "i",
        },
      });
    }

    if (analysis.intent !== "unknown") {
      searchConditions.push({
        intent: {
          $regex: analysis.intent,
          $options: "i",
        },
      });
    }

    searchConditions.push({
      prompt: {
        $regex: queryWords.join("|"),
        $options: "i",
      },
    });

    if (queryWords.length > 0) {
      searchConditions.push({
        tags: {
          $in: queryWords,
        },
      });
    }

    const knowledgeItems = await Knowledge.find({
      $or: searchConditions,
    }).limit(50);

    // -----------------------------------------
    // 3. Rank the knowledge
    // -----------------------------------------

    const rankedResults = knowledgeItems
      .map((item) => {
        const concept = item.concept.toLowerCase();
        const intent = item.intent.toLowerCase();
        const itemLanguage = item.language.toLowerCase();

        let score = 0;

        // -------------------------------------
        // Concept matching
        // -------------------------------------

        if (
          analysis.concept !== "unknown" &&
          concept === analysis.concept.toLowerCase()
        ) {
          score += 60;
        }

        // -------------------------------------
        // Intent matching
        // -------------------------------------

        if (
          analysis.intent !== "unknown" &&
          intent === analysis.intent.toLowerCase()
        ) {
          score += 25;
        }

        // -------------------------------------
        // Language matching
        // -------------------------------------

        if (
          language &&
          language !== "unknown" &&
          itemLanguage === language.toLowerCase()
        ) {
          score += 40;
        }

        // -------------------------------------
        // Complexity matching
        // -------------------------------------

        if (
          analysis.complexity !== "unknown" &&
          item.tags.some(
            (tag: string) =>
              tag.toLowerCase() === analysis.complexity
          )
        ) {
          score += 15;
        }

        // -------------------------------------
        // Keyword matching
        // -------------------------------------

        const itemText = [
          item.concept,
          item.intent,
          item.prompt,
          ...item.tags,
        ]
          .join(" ")
          .toLowerCase();

        for (const word of queryWords) {
          if (itemText.includes(word.toLowerCase())) {
            score += 5;
          }
        }

        // -------------------------------------
        // Validation quality
        // -------------------------------------

        if (item.validation.compiled) {
          score += 20;
        }

        if (item.validation.testsPassed) {
          score += 30;
        }

        if (item.validation.accepted) {
          score += 40;
        }

        // -------------------------------------
        // Usage history
        // -------------------------------------

        score += Math.min(
          item.usage.timesAccepted * 3,
          20
        );

        return {
          item,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    const results = rankedResults.slice(0, 5);

    // -----------------------------------------
    // 4. Return structured knowledge
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      query,

      analysis: {
        concept: analysis.concept,
        intent: analysis.intent,
        complexity: analysis.complexity,
        language,
        keywords: analysis.keywords,
      },

      count: results.length,

      results: results.map(({ item, score }) => ({
        id: item._id,
        concept: item.concept,
        intent: item.intent,
        language: item.language,
        prompt: item.prompt,
        code: item.code,
        tags: item.tags,
        validation: item.validation,
        score,
      })),
    });
  } catch (error) {
    console.error("Knowledge retrieval error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve knowledge.",
      },
      { status: 500 }
    );
  }
}