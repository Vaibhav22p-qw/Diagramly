export type ConceptResult = {
  concept: string;
  intent: string;
  complexity: "simple" | "medium" | "advanced" | "unknown";
  language: "c" | "cpp" | "java" | "python" | "javascript" | "unknown";
  keywords: string[];
};

type ConceptRule = {
  concept: string;
  keywords: string[];
};

const CONCEPT_RULES: ConceptRule[] = [
  { concept: "palindrome", keywords: ["palindrome"] },
  { concept: "factorial", keywords: ["factorial"] },
  { concept: "fibonacci", keywords: ["fibonacci", "fibonacci series"] },
  { concept: "prime", keywords: ["prime number", "check prime", "prime"] },
  { concept: "array", keywords: ["array", "arrays"] },
  { concept: "string", keywords: ["string", "strings"] },
  { concept: "basic-loops", keywords: ["for loop", "while loop", "basic loop", "loops"] },
  {
    concept: "binary-search",
    keywords: [
      "binary search",
      "binary-search",
      "binarysearch",
    ],
  },

  {
    concept: "linear-search",
    keywords: [
      "linear search",
      "linear-search",
      "sequential search",
    ],
  },

  {
    concept: "bubble-sort",
    keywords: [
      "bubble sort",
      "bubble-sort",
      "bubblesort",
    ],
  },

  {
    concept: "selection-sort",
    keywords: [
      "selection sort",
      "selection-sort",
    ],
  },

  {
    concept: "insertion-sort",
    keywords: [
      "insertion sort",
      "insertion-sort",
    ],
  },

  {
    concept: "merge-sort",
    keywords: [
      "merge sort",
      "merge-sort",
    ],
  },

  {
    concept: "quick-sort",
    keywords: [
      "quick sort",
      "quick-sort",
      "quicksort",
    ],
  },

  {
    concept: "linked-list",
    keywords: [
      "linked list",
      "linked-list",
      "linkedlist",
    ],
  },

  {
    concept: "stack",
    keywords: [
      "stack",
      "stack implementation",
    ],
  },

  {
    concept: "queue",
    keywords: [
      "queue",
      "queue implementation",
    ],
  },

  {
    concept: "binary-tree",
    keywords: [
      "binary tree",
      "binary-tree",
    ],
  },

  {
    concept: "binary-search-tree",
    keywords: [
      "binary search tree",
      "binary-search-tree",
      "bst",
    ],
  },

  {
    concept: "graph",
    keywords: [
      "graph",
      "graph implementation",
      "graph traversal",
    ],
  },

  {
    concept: "dfs",
    keywords: [
      "dfs",
      "depth first search",
      "depth-first search",
    ],
  },

  {
    concept: "bfs",
    keywords: [
      "bfs",
      "breadth first search",
      "breadth-first search",
    ],
  },

  {
    concept: "recursion",
    keywords: [
      "recursion",
      "recursive",
      "recursive function",
    ],
  },
];

const IMPLEMENTATION_KEYWORDS = [
  "write",
  "implement",
  "implementation",
  "code",
  "program",
  "create",
  "build",
  "solve",
];

const EXPLANATION_KEYWORDS = [
  "explain",
  "explanation",
  "how",
  "what is",
  "meaning",
  "understand",
];

const DEBUG_KEYWORDS = [
  "debug",
  "fix",
  "error",
  "bug",
  "wrong",
  "not working",
];

const OPTIMIZATION_KEYWORDS = [
  "optimize",
  "optimization",
  "faster",
  "efficient",
  "performance",
  "time complexity",
];

const SIMPLE_KEYWORDS = [
  "simple",
  "basic",
  "easy",
  "beginner",
  "short",
];

const ADVANCED_KEYWORDS = [
  "advanced",
  "optimized",
  "complex",
  "production",
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeyword(text: string, keyword: string): boolean {
  return text.includes(keyword);
}

function detectConcept(text: string): {
  concept: string;
  matchedKeywords: string[];
} {
  let bestMatch = {
    concept: "unknown",
    matchedKeywords: [] as string[],
  };

  for (const rule of CONCEPT_RULES) {
    const matches = rule.keywords.filter((keyword) =>
      containsKeyword(text, keyword.toLowerCase())
    );

    if (matches.length > bestMatch.matchedKeywords.length) {
      bestMatch = {
        concept: rule.concept,
        matchedKeywords: matches,
      };
    }
  }

  return bestMatch;
}

function detectIntent(text: string): string {
  if (DEBUG_KEYWORDS.some((keyword) => containsKeyword(text, keyword))) {
    return "debugging";
  }

  if (
    OPTIMIZATION_KEYWORDS.some((keyword) =>
      containsKeyword(text, keyword)
    )
  ) {
    return "optimization";
  }

  if (
    EXPLANATION_KEYWORDS.some((keyword) =>
      containsKeyword(text, keyword)
    )
  ) {
    return "explanation";
  }

  if (
    IMPLEMENTATION_KEYWORDS.some((keyword) =>
      containsKeyword(text, keyword)
    )
  ) {
    return "implementation";
  }

  return "unknown";
}

function detectComplexity(
  text: string
): "simple" | "medium" | "advanced" | "unknown" {
  if (SIMPLE_KEYWORDS.some((keyword) => containsKeyword(text, keyword))) {
    return "simple";
  }

  if (ADVANCED_KEYWORDS.some((keyword) => containsKeyword(text, keyword))) {
    return "advanced";
  }

  if (text.includes("medium") || text.includes("intermediate")) {
    return "medium";
  }

  return "unknown";
}
function detectLanguage(
  text: string
): "c" | "cpp" | "java" | "python" | "javascript" | "unknown" {
  if (
    text.includes("c++") ||
    text.includes("cpp") ||
    text.includes("c plus plus")
  ) {
    return "cpp";
  }

  if (
    text.includes("python") ||
    text.includes("py")
  ) {
    return "python";
  }

  if (text.includes("java")) {
    return "java";
  }

  if (
    text.includes("javascript") ||
    text.includes("js")
  ) {
    return "javascript";
  }

  if (
    text === "c" ||
    text.includes(" c ") ||
    text.includes("c language") ||
    text.includes("c programming")
  ) {
    return "c";
  }

  return "unknown";
}
export function analyzeConcept(text: string): ConceptResult {
  const normalizedText = normalizeText(text);

  const conceptResult = detectConcept(normalizedText);

  const intent = detectIntent(normalizedText);

  const complexity = detectComplexity(normalizedText);
const language = detectLanguage(normalizedText);
  const words = normalizedText
    .split(" ")
    .filter((word) => word.length > 2);

  const keywords = Array.from(
    new Set([
      ...words,
      ...conceptResult.matchedKeywords.map((keyword) =>
        keyword.toLowerCase()
      ),
    ])
  );

return {
  concept: conceptResult.concept,
  intent,
  complexity,
  language,
  keywords,
};
}
