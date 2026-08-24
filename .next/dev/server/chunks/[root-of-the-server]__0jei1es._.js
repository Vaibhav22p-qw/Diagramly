module.exports = [
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
"[project]/app/api/knowledge/learn/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$learn$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/knowledge/learn.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compiler$2f$execution$2d$results$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/compiler/execution-results.ts [app-route] (ecmascript)");
;
;
;
const SUPPORTED_LANGUAGES = new Set([
    "c",
    "cpp",
    "java",
    "python"
]);
async function POST(request) {
    try {
        const body = await request.json();
        const { prompt, code, language, executionId, source } = body;
        if (!prompt || !code || !language || !executionId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "prompt, code, language, and executionId are required."
            }, {
                status: 400
            });
        }
        if (!SUPPORTED_LANGUAGES.has(language)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Unsupported programming language."
            }, {
                status: 400
            });
        }
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$compiler$2f$execution$2d$results$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeSuccessfulExecution"])({
            executionId,
            language,
            sourceCode: code
        });
        if (!validation) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "This solution does not match a recent successful compiler execution."
            }, {
                status: 409
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$learn$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["learnFromSolution"])({
            prompt,
            code,
            language,
            validation,
            source: {
                type: "compiler",
                userId: source?.userId,
                workspaceId: source?.workspaceId
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("Diagramly learning API error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message || "Failed to learn solution."
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/compiler/execution-results.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "consumeSuccessfulExecution",
    ()=>consumeSuccessfulExecution,
    "recordSuccessfulExecution",
    ()=>recordSuccessfulExecution
]);
const EXECUTION_TTL_MS = 5 * 60 * 1000;
const successfulExecutions = new Map();
function recordSuccessfulExecution({ executionId, language, sourceCode, exitCode }) {
    if (exitCode !== 0) return;
    successfulExecutions.set(executionId, {
        language,
        sourceCode,
        completedAt: Date.now()
    });
}
function consumeSuccessfulExecution({ executionId, language, sourceCode }) {
    const execution = successfulExecutions.get(executionId);
    if (!execution) return null;
    successfulExecutions.delete(executionId);
    if (Date.now() - execution.completedAt > EXECUTION_TTL_MS || execution.language !== language || execution.sourceCode !== sourceCode) {
        return null;
    }
    return {
        compiled: true,
        testsPassed: true,
        accepted: true
    };
}
}),
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
"[project]/lib/knowledge/learn.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "learnFromSolution",
    ()=>learnFromSolution
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Knowledge.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$concept$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/knowledge/concept-engine.ts [app-route] (ecmascript)");
;
;
;
async function learnFromSolution(input) {
    const { prompt, code, language, validation, source } = input;
    if (!prompt?.trim() || !code?.trim()) {
        throw new Error("Prompt and code are required for learning.");
    }
    // Only learn from validated solutions.
    if (!validation.compiled || !validation.testsPassed || !validation.accepted) {
        return {
            learned: false,
            reason: "Solution was not fully validated."
        };
    }
    // Understand the user's request.
    const analysis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$knowledge$2f$concept$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeConcept"])(`${prompt} ${language}`);
    const detectedLanguage = language;
    const tags = Array.from(new Set([
        analysis.concept,
        ...analysis.keywords,
        analysis.complexity
    ])).filter((tag)=>tag && tag !== "unknown");
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
    // Check whether Diagramly already knows
    // this concept + language + intent.
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        concept: analysis.concept,
        language: detectedLanguage,
        intent: analysis.intent
    });
    if (existing) {
        // Keep the better validated solution.
        if (!existing.validation.accepted || existing.code !== code) {
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
            concept: existing.concept
        };
    }
    const knowledge = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Knowledge$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
        concept: analysis.concept,
        intent: analysis.intent,
        language: detectedLanguage,
        prompt,
        code,
        source: {
            type: source?.type || "compiler",
            userId: source?.userId,
            workspaceId: source?.workspaceId
        },
        validation,
        usage: {
            timesRetrieved: 0,
            timesAccepted: 0
        },
        tags
    });
    return {
        learned: true,
        created: true,
        knowledgeId: knowledge._id,
        concept: knowledge.concept
    };
}
}),
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0jei1es._.js.map