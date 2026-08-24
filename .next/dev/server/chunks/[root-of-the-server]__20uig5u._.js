module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/knowledge/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Knowledge.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$concept$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/knowledge/concept-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/knowledge/embeddings.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const CANONICAL_LANGUAGES = new Set([
    "c",
    "cpp",
    "java",
    "python"
]);
const VECTOR_INDEX_NAME = process.env.KNOWLEDGE_VECTOR_INDEX || "knowledge_embedding_vector";
const SEMANTIC_CANDIDATE_LIMIT = 50;
function getCanonicalLanguage(value) {
    const normalized = value.trim().toLowerCase();
    return CANONICAL_LANGUAGES.has(normalized) ? normalized : "";
}
async function findSemanticScores(query, language) {
    const queryEmbedding = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$embeddings$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateEmbeddingSafely"])(query);
    if (!queryEmbedding) return new Map();
    try {
        const results = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $vectorSearch: {
                    index: VECTOR_INDEX_NAME,
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: SEMANTIC_CANDIDATE_LIMIT * 4,
                    limit: SEMANTIC_CANDIDATE_LIMIT,
                    ...language ? {
                        filter: {
                            language
                        }
                    } : {}
                }
            },
            {
                $project: {
                    semanticScore: {
                        $meta: "vectorSearchScore"
                    }
                }
            }
        ]);
        return new Map(results.map((result)=>[
                result._id.toString(),
                result.semanticScore
            ]));
    } catch (error) {
        console.warn("Diagramly semantic retrieval unavailable; using keyword retrieval:", error instanceof Error ? error.message : "Unknown error");
        return new Map();
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { concept, intent, language, prompt, code, source, validation, tags } = body;
        if (!concept || !intent || !language || !prompt || !code) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "concept, intent, language, prompt, and code are required."
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const knowledge = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            concept,
            intent,
            language,
            prompt,
            code,
            source: {
                type: source?.type || "compiler",
                userId: source?.userId,
                workspaceId: source?.workspaceId
            },
            validation: {
                compiled: validation?.compiled ?? false,
                testsPassed: validation?.testsPassed ?? false,
                accepted: validation?.accepted ?? false
            },
            usage: {
                timesRetrieved: 0,
                timesAccepted: 0
            },
            tags: tags || []
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            knowledge
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Knowledge API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to save knowledge."
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const body = await request.json();
        const { knowledgeId, action } = body;
        if (!knowledgeId || !action) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "knowledgeId and action are required."
            }, {
                status: 400
            });
        }
        if (action !== "retrieved" && action !== "accepted") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "action must be 'retrieved' or 'accepted'."
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const update = action === "retrieved" ? {
            $inc: {
                "usage.timesRetrieved": 1
            }
        } : {
            $inc: {
                "usage.timesAccepted": 1
            }
        };
        const knowledge = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(knowledgeId, update, {
            new: true
        });
        if (!knowledge) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Knowledge entry not found."
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            knowledge
        });
    } catch (error) {
        console.error("Knowledge feedback error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to update knowledge feedback."
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim() || "";
        const requestedLanguage = searchParams.get("language")?.trim() || "";
        if (!query) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Search query is required."
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        // -----------------------------------------
        // 1. Understand the user's request
        // -----------------------------------------
        const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$concept$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeConcept"])(query);
        const language = getCanonicalLanguage(requestedLanguage || analysis.language);
        // -----------------------------------------
        // 2. Build search terms
        // -----------------------------------------
        const queryWords = analysis.keywords.filter((word)=>word.length > 2);
        const searchConditions = [];
        if (analysis.concept !== "unknown") {
            searchConditions.push({
                concept: {
                    $regex: analysis.concept,
                    $options: "i"
                }
            });
        }
        if (analysis.intent !== "unknown") {
            searchConditions.push({
                intent: {
                    $regex: analysis.intent,
                    $options: "i"
                }
            });
        }
        searchConditions.push({
            prompt: {
                $regex: queryWords.join("|"),
                $options: "i"
            }
        });
        if (queryWords.length > 0) {
            searchConditions.push({
                tags: {
                    $in: queryWords
                }
            });
        }
        const keywordQuery = {
            $or: searchConditions
        };
        const semanticScores = await findSemanticScores(query, language);
        const semanticIds = Array.from(semanticScores.keys());
        const knowledgeItems = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(semanticIds.length > 0 ? {
            $or: [
                keywordQuery,
                {
                    _id: {
                        $in: semanticIds
                    }
                }
            ]
        } : keywordQuery).limit(SEMANTIC_CANDIDATE_LIMIT * 2);
        // -----------------------------------------
        // 3. Rank the knowledge
        // -----------------------------------------
        const rankedResults = knowledgeItems.map((item)=>{
            const concept = item.concept.toLowerCase();
            const intent = item.intent.toLowerCase();
            const itemLanguage = item.language.toLowerCase();
            let score = 0;
            const semanticScore = semanticScores.get(item._id.toString());
            if (semanticScore !== undefined) {
                score += Math.round(semanticScore * 100);
            }
            // -------------------------------------
            // Concept matching
            // -------------------------------------
            if (analysis.concept !== "unknown" && concept === analysis.concept.toLowerCase()) {
                score += 60;
            }
            // -------------------------------------
            // Intent matching
            // -------------------------------------
            if (analysis.intent !== "unknown" && intent === analysis.intent.toLowerCase()) {
                score += 25;
            }
            // -------------------------------------
            // Language matching
            // -------------------------------------
            if (language && language !== "unknown" && itemLanguage === language.toLowerCase()) {
                score += 40;
            }
            // -------------------------------------
            // Complexity matching
            // -------------------------------------
            if (analysis.complexity !== "unknown" && item.tags.some((tag)=>tag.toLowerCase() === analysis.complexity)) {
                score += 15;
            }
            // -------------------------------------
            // Keyword matching
            // -------------------------------------
            const itemText = [
                item.concept,
                item.intent,
                item.prompt,
                ...item.tags
            ].join(" ").toLowerCase();
            for (const word of queryWords){
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
            score += Math.min(item.usage.timesAccepted * 3, 20);
            return {
                item,
                score
            };
        }).sort((a, b)=>b.score - a.score);
        const results = rankedResults.slice(0, 5);
        // -----------------------------------------
        // 4. Return structured knowledge
        // -----------------------------------------
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            query,
            analysis: {
                concept: analysis.concept,
                intent: analysis.intent,
                complexity: analysis.complexity,
                language,
                keywords: analysis.keywords
            },
            count: results.length,
            results: results.map(({ item, score })=>({
                    id: item._id,
                    concept: item.concept,
                    intent: item.intent,
                    language: item.language,
                    prompt: item.prompt,
                    code: item.code,
                    tags: item.tags,
                    validation: item.validation,
                    score
                }))
        });
    } catch (error) {
        console.error("Knowledge retrieval error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to retrieve knowledge."
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/knowledge/concept-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeConcept",
    ()=>analyzeConcept
]);
const CONCEPT_RULES = [
    {
        concept: "binary-search",
        keywords: [
            "binary search",
            "binary-search",
            "binarysearch"
        ]
    },
    {
        concept: "linear-search",
        keywords: [
            "linear search",
            "linear-search",
            "sequential search"
        ]
    },
    {
        concept: "bubble-sort",
        keywords: [
            "bubble sort",
            "bubble-sort",
            "bubblesort"
        ]
    },
    {
        concept: "selection-sort",
        keywords: [
            "selection sort",
            "selection-sort"
        ]
    },
    {
        concept: "insertion-sort",
        keywords: [
            "insertion sort",
            "insertion-sort"
        ]
    },
    {
        concept: "merge-sort",
        keywords: [
            "merge sort",
            "merge-sort"
        ]
    },
    {
        concept: "quick-sort",
        keywords: [
            "quick sort",
            "quick-sort",
            "quicksort"
        ]
    },
    {
        concept: "linked-list",
        keywords: [
            "linked list",
            "linked-list",
            "linkedlist"
        ]
    },
    {
        concept: "stack",
        keywords: [
            "stack",
            "stack implementation"
        ]
    },
    {
        concept: "queue",
        keywords: [
            "queue",
            "queue implementation"
        ]
    },
    {
        concept: "binary-tree",
        keywords: [
            "binary tree",
            "binary-tree"
        ]
    },
    {
        concept: "binary-search-tree",
        keywords: [
            "binary search tree",
            "binary-search-tree",
            "bst"
        ]
    },
    {
        concept: "graph",
        keywords: [
            "graph",
            "graph implementation",
            "graph traversal"
        ]
    },
    {
        concept: "dfs",
        keywords: [
            "dfs",
            "depth first search",
            "depth-first search"
        ]
    },
    {
        concept: "bfs",
        keywords: [
            "bfs",
            "breadth first search",
            "breadth-first search"
        ]
    },
    {
        concept: "recursion",
        keywords: [
            "recursion",
            "recursive",
            "recursive function"
        ]
    }
];
const IMPLEMENTATION_KEYWORDS = [
    "write",
    "implement",
    "implementation",
    "code",
    "program",
    "create",
    "build",
    "solve"
];
const EXPLANATION_KEYWORDS = [
    "explain",
    "explanation",
    "how",
    "what is",
    "meaning",
    "understand"
];
const DEBUG_KEYWORDS = [
    "debug",
    "fix",
    "error",
    "bug",
    "wrong",
    "not working"
];
const OPTIMIZATION_KEYWORDS = [
    "optimize",
    "optimization",
    "faster",
    "efficient",
    "performance",
    "time complexity"
];
const SIMPLE_KEYWORDS = [
    "simple",
    "basic",
    "easy",
    "beginner",
    "short"
];
const ADVANCED_KEYWORDS = [
    "advanced",
    "optimized",
    "complex",
    "production"
];
function normalizeText(text) {
    return text.toLowerCase().replace(/[^\w\s+#.-]/g, " ").replace(/\s+/g, " ").trim();
}
function containsKeyword(text, keyword) {
    return text.includes(keyword);
}
function detectConcept(text) {
    let bestMatch = {
        concept: "unknown",
        matchedKeywords: []
    };
    for (const rule of CONCEPT_RULES){
        const matches = rule.keywords.filter((keyword)=>containsKeyword(text, keyword.toLowerCase()));
        if (matches.length > bestMatch.matchedKeywords.length) {
            bestMatch = {
                concept: rule.concept,
                matchedKeywords: matches
            };
        }
    }
    return bestMatch;
}
function detectIntent(text) {
    if (DEBUG_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "debugging";
    }
    if (OPTIMIZATION_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "optimization";
    }
    if (EXPLANATION_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "explanation";
    }
    if (IMPLEMENTATION_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "implementation";
    }
    return "unknown";
}
function detectComplexity(text) {
    if (SIMPLE_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "simple";
    }
    if (ADVANCED_KEYWORDS.some((keyword)=>containsKeyword(text, keyword))) {
        return "advanced";
    }
    if (text.includes("medium") || text.includes("intermediate")) {
        return "medium";
    }
    return "unknown";
}
function detectLanguage(text) {
    if (text.includes("c++") || text.includes("cpp") || text.includes("c plus plus")) {
        return "cpp";
    }
    if (text.includes("python") || text.includes("py")) {
        return "python";
    }
    if (text.includes("java")) {
        return "java";
    }
    if (text.includes("javascript") || text.includes("js")) {
        return "javascript";
    }
    if (text === "c" || text.includes(" c ") || text.includes("c language") || text.includes("c programming")) {
        return "c";
    }
    return "unknown";
}
function analyzeConcept(text) {
    const normalizedText = normalizeText(text);
    const conceptResult = detectConcept(normalizedText);
    const intent = detectIntent(normalizedText);
    const complexity = detectComplexity(normalizedText);
    const language = detectLanguage(normalizedText);
    const words = normalizedText.split(" ").filter((word)=>word.length > 2);
    const keywords = Array.from(new Set([
        ...words,
        ...conceptResult.matchedKeywords.map((keyword)=>keyword.toLowerCase())
    ]));
    return {
        concept: conceptResult.concept,
        intent,
        complexity,
        language,
        keywords
    };
}
}),
"[project]/lib/knowledge/embeddings.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "EMBEDDING_DIMENSIONS",
    ()=>EMBEDDING_DIMENSIONS,
    "EMBEDDING_MODEL",
    ()=>EMBEDDING_MODEL,
    "EMBEDDING_VERSION",
    ()=>EMBEDDING_VERSION,
    "buildEmbeddingText",
    ()=>buildEmbeddingText,
    "createKnowledgeEmbedding",
    ()=>createKnowledgeEmbedding,
    "generateEmbedding",
    ()=>generateEmbedding,
    "generateEmbeddingSafely",
    ()=>generateEmbeddingSafely,
    "getEmbeddingTextHash",
    ()=>getEmbeddingTextHash
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$huggingface$2f$transformers__$5b$external$5d$__$2840$huggingface$2f$transformers$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$29$__ = __turbopack_context__.i("[externals]/@huggingface/transformers [external] (@huggingface/transformers, esm_import, [project]/node_modules/@huggingface/transformers)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$huggingface$2f$transformers__$5b$external$5d$__$2840$huggingface$2f$transformers$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$huggingface$2f$transformers__$5b$external$5d$__$2840$huggingface$2f$transformers$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const EMBEDDING_MODEL = process.env.DIAGRAMLY_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
const EMBEDDING_VERSION = 1;
const EMBEDDING_DIMENSIONS = 384;
let extractorPromise = null;
function normalizeValue(value) {
    return value.replace(/\s+/g, " ").trim();
}
function buildEmbeddingText({ prompt, concept, intent, language, tags }) {
    const stableTags = Array.from(new Set(tags.map((tag)=>normalizeValue(tag).toLowerCase()).filter(Boolean))).sort();
    return [
        `Prompt: ${normalizeValue(prompt)}`,
        `Concept: ${normalizeValue(concept)}`,
        `Intent: ${normalizeValue(intent)}`,
        `Language: ${normalizeValue(language)}`,
        `Tags: ${stableTags.join(", ")}`
    ].join("\n");
}
function getEmbeddingTextHash(text) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(text).digest("hex");
}
async function getExtractor() {
    if (!extractorPromise) {
        extractorPromise = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$huggingface$2f$transformers__$5b$external$5d$__$2840$huggingface$2f$transformers$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$huggingface$2f$transformers$29$__["pipeline"])("feature-extraction", EMBEDDING_MODEL, {
            dtype: "fp32"
        });
    }
    try {
        return await extractorPromise;
    } catch (error) {
        extractorPromise = null;
        throw error;
    }
}
async function generateEmbedding(text) {
    const extractor = await getExtractor();
    const output = await extractor(normalizeValue(text), {
        pooling: "mean",
        normalize: true
    });
    const embedding = Array.from(output.data);
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(`Expected ${EMBEDDING_DIMENSIONS} embedding dimensions, received ${embedding.length}.`);
    }
    return embedding;
}
async function generateEmbeddingSafely(text) {
    try {
        return await generateEmbedding(text);
    } catch (error) {
        console.warn("Diagramly local embedding generation failed:", error instanceof Error ? error.message : "Unknown error");
        return null;
    }
}
async function createKnowledgeEmbedding(input) {
    const embeddingText = buildEmbeddingText(input);
    const embedding = await generateEmbeddingSafely(embeddingText);
    if (!embedding) return null;
    return {
        embedding,
        embeddingModel: EMBEDDING_MODEL,
        embeddingVersion: EMBEDDING_VERSION,
        embeddingTextHash: getEmbeddingTextHash(embeddingText),
        embeddedAt: new Date()
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable.");
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
}),
"[project]/models/Knowledge.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const KnowledgeSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    concept: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    intent: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true,
        index: true,
        trim: true,
        enum: [
            "c",
            "cpp",
            "java",
            "python"
        ]
    },
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true
    },
    source: {
        type: {
            type: String,
            enum: [
                "compiler",
                "document",
                "canvas"
            ],
            required: true
        },
        userId: {
            type: String
        },
        workspaceId: {
            type: String
        }
    },
    validation: {
        compiled: {
            type: Boolean,
            default: false
        },
        testsPassed: {
            type: Boolean,
            default: false
        },
        accepted: {
            type: Boolean,
            default: false
        }
    },
    usage: {
        timesRetrieved: {
            type: Number,
            default: 0
        },
        timesAccepted: {
            type: Number,
            default: 0
        }
    },
    tags: {
        type: [
            String
        ],
        default: [],
        index: true
    },
    embedding: {
        type: [
            Number
        ],
        default: undefined
    },
    embeddingModel: {
        type: String
    },
    embeddingVersion: {
        type: Number
    },
    embeddingTextHash: {
        type: String
    },
    embeddedAt: {
        type: Date
    }
}, {
    timestamps: true
});
const Knowledge = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Knowledge || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model("Knowledge", KnowledgeSchema);
const __TURBOPACK__default__export__ = Knowledge;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__20uig5u._.js.map