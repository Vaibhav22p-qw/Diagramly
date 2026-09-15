import type { ExecutionGraph, ComposedProgram } from "./types";

/**
 * Pure code composer for Phase 5.
 *
 * Requirements:
 * - Deterministic ordering: Functions first, Main last.
 * - Sibling functions ordered by canvasIndex.
 * - Lightweight provenance comments identifying CodeBox IDs.
 * - Does not create a second compiler or execute code.
 */
export function composeProgram(graph: ExecutionGraph): ComposedProgram {
  const parts: string[] = [];
  const orderedNodeIds: string[] = [];

  // Header first
  if (graph.headerNode) {
    orderedNodeIds.push(graph.headerNode.id);
    parts.push(`// Diagramly Header: ${graph.headerNode.id}`);
    parts.push(graph.headerNode.code.trim());
    parts.push(""); // empty line separator
  }

  // C++ Forward Declarations
  if (graph.language === "cpp" && graph.functionNodes.length > 0) {
    parts.push("// Forward declarations");
    for (const fnNode of graph.functionNodes) {
      const match = fnNode.code.match(/^[a-zA-Z_][a-zA-Z0-9_\s\*&]+\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)/m);
      if (match) {
        parts.push(match[0].trim() + ";");
      }
    }
    parts.push("");
  }

  // Functions next
  for (const fnNode of graph.functionNodes) {
    orderedNodeIds.push(fnNode.id);
    parts.push(`// Diagramly CodeBox: ${fnNode.id}`);
    parts.push(fnNode.code.trim());
    parts.push(""); // empty line separator
  }

  // Main last
  orderedNodeIds.push(graph.mainNode.id);
  parts.push(`// Diagramly CodeBox: ${graph.mainNode.id}`);
  parts.push(graph.mainNode.code.trim());

  const composedCode = parts.join("\n");

  return {
    language: graph.language,
    composedCode,
    orderedNodeIds,
  };
}
