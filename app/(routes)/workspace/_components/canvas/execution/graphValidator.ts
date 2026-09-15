import type { CanvasObject, Connector } from "../types";
import type {
  ExecutionGraph,
  GraphValidationError,
  GraphValidationResult,
  GraphValidationErrorCode,
} from "./types";
import { buildExecutionGraph } from "./graphBuilder";

/**
 * Pure structural graph validator for Phase 5.
 *
 * Distinguishes structural graph errors from compiler errors.
 *
 * Enforces:
 * - Main existence and role === "main"
 * - Target object existence and CodeBox type
 * - Role compatibility (Main -> Function only)
 * - Prohibition of Main -> Main, Function -> Main, Function -> Function
 * - Prohibition of self-references and duplicate semantic edges
 * - Prohibition of cycles via DFS cycle detection
 * - Language uniformity (all participating CodeBoxes must share the same language)
 * - Standalone Main support (Main + zero Functions is valid)
 * - Independence of unrelated Main graphs on the canvas
 */
export function validateExecutionGraph(
  objects: CanvasObject[],
  connectors: Connector[],
  mainObjectId: string
): GraphValidationResult {
  const errors: GraphValidationError[] = [];

  // 1. Verify Main exists
  const mainObj = objects.find((obj) => obj.id === mainObjectId);
  if (!mainObj) {
    return {
      valid: false,
      errors: [
        {
          code: "NO_MAIN",
          message: `Main CodeBox with ID "${mainObjectId}" does not exist.`,
          nodeIds: [mainObjectId],
        },
      ],
    };
  }

  // 2. Verify Main is a CodeBox
  if (mainObj.type !== "codebox") {
    return {
      valid: false,
      errors: [
        {
          code: "NON_CODEBOX_PARTICIPATION",
          message: `Object "${mainObjectId}" is of type "${mainObj.type}", expected "codebox".`,
          nodeIds: [mainObjectId],
        },
      ],
    };
  }

  // 3. Verify Main role
  const mainData = mainObj.data || {};
  if (mainData.role !== "main") {
    return {
      valid: false,
      errors: [
        {
          code: "INVALID_ROLE",
          message: `CodeBox "${mainObjectId}" has role "${mainData.role}", expected "main".`,
          nodeIds: [mainObjectId],
        },
      ],
    };
  }

  // Collect semantic connectors associated with this Main
  const semanticConnectors = connectors.filter((c) => c.type === "main-function");
  const relevantConnectors = semanticConnectors.filter(
    (c) => c.sourceObjectId === mainObjectId || c.targetObjectId === mainObjectId
  );

  // Check self-reference
  for (const conn of relevantConnectors) {
    if (conn.sourceObjectId === conn.targetObjectId) {
      errors.push({
        code: "SELF_REFERENCE",
        message: `Self-reference is not allowed on CodeBox "${conn.sourceObjectId}".`,
        nodeIds: [conn.sourceObjectId],
        edgeIds: [conn.id],
      });
    }
  }

  // Check duplicate semantic edges
  const seenPairs = new Set<string>();
  for (const conn of relevantConnectors) {
    const pairKey = `${conn.sourceObjectId}->${conn.targetObjectId}`;
    if (seenPairs.has(pairKey)) {
      errors.push({
        code: "DUPLICATE_EDGE",
        message: `Duplicate semantic connection from "${conn.sourceObjectId}" to "${conn.targetObjectId}".`,
        edgeIds: [conn.id],
      });
    }
    seenPairs.add(pairKey);
  }

  // Check connectors touching this graph
  for (const conn of relevantConnectors) {
    // Check missing target
    const targetObj = objects.find((o) => o.id === conn.targetObjectId);
    if (!targetObj) {
      errors.push({
        code: "MISSING_NODE",
        message: `Target object "${conn.targetObjectId}" does not exist.`,
        nodeIds: [conn.targetObjectId],
        edgeIds: [conn.id],
      });
      continue;
    }

    // Check target is CodeBox
    if (targetObj.type !== "codebox") {
      errors.push({
        code: "NON_CODEBOX_PARTICIPATION",
        message: `Target "${conn.targetObjectId}" is of type "${targetObj.type}", expected "codebox".`,
        nodeIds: [conn.targetObjectId],
        edgeIds: [conn.id],
      });
      continue;
    }

    const sourceObj = objects.find((o) => o.id === conn.sourceObjectId);
    if (!sourceObj || sourceObj.type !== "codebox") {
      errors.push({
        code: "NON_CODEBOX_PARTICIPATION",
        message: `Source "${conn.sourceObjectId}" is not a valid CodeBox.`,
        nodeIds: [conn.sourceObjectId],
        edgeIds: [conn.id],
      });
      continue;
    }

    const sourceRole = sourceObj.data?.role;
    const targetRole = targetObj.data?.role;

    // Reject Main -> Main
    if (sourceRole === "main" && targetRole === "main" && conn.sourceObjectId !== conn.targetObjectId) {
      errors.push({
        code: "MAIN_TO_MAIN",
        message: `Main CodeBox "${conn.sourceObjectId}" cannot connect to another Main CodeBox "${conn.targetObjectId}".`,
        nodeIds: [conn.sourceObjectId, conn.targetObjectId],
        edgeIds: [conn.id],
      });
    }

    // Reject Function -> Main
    if (sourceRole === "function" && targetRole === "main") {
      errors.push({
        code: "FUNCTION_TO_MAIN",
        message: `Function CodeBox "${conn.sourceObjectId}" cannot connect to Main CodeBox "${conn.targetObjectId}".`,
        nodeIds: [conn.sourceObjectId, conn.targetObjectId],
        edgeIds: [conn.id],
      });
    }

    // Reject Function -> Function
    if (sourceRole === "function" && targetRole === "function") {
      errors.push({
        code: "FUNCTION_TO_FUNCTION",
        message: `Function-to-Function connections are not supported in Phase 5 ("${conn.sourceObjectId}" -> "${conn.targetObjectId}").`,
        nodeIds: [conn.sourceObjectId, conn.targetObjectId],
        edgeIds: [conn.id],
      });
    }

    // Reject invalid target role (not function)
    if (sourceRole === "main" && targetRole !== "function" && targetRole !== "main") {
      errors.push({
        code: "INVALID_ROLE",
        message: `Target CodeBox "${conn.targetObjectId}" has invalid role "${targetRole}", expected "function".`,
        nodeIds: [conn.targetObjectId],
        edgeIds: [conn.id],
      });
    }
  }

  // Check language compatibility across all participating CodeBoxes
  const mainLanguage = mainData.language || "cpp";
  const outgoingConnectors = semanticConnectors.filter(
    (c) => c.sourceObjectId === mainObjectId && c.targetObjectId !== mainObjectId
  );

  for (const conn of outgoingConnectors) {
    const targetObj = objects.find((o) => o.id === conn.targetObjectId);
    if (targetObj && targetObj.type === "codebox") {
      const targetLang = targetObj.data?.language || "cpp";
      if (targetLang !== mainLanguage) {
        errors.push({
          code: "MIXED_LANGUAGES",
          message: `Incompatible languages in execution graph: Main uses "${mainLanguage}" but Function "${conn.targetObjectId}" uses "${targetLang}".`,
          nodeIds: [mainObjectId, conn.targetObjectId],
          edgeIds: [conn.id],
        });
      }
    }
  }

  // Check Header (optional, max 1, matching language)
  const headerObjs = objects.filter((o) => o.type === "header" && o.data?.language === mainLanguage);
  const otherLangHeaders = objects.filter((o) => o.type === "header" && o.data?.language !== mainLanguage);

  // If there's an ambiguous situation (multiple headers for same language)
  if (headerObjs.length > 1) {
    errors.push({
      code: "MULTIPLE_HEADERS",
      message: `Multiple Headers found for language "${mainLanguage}". Only one Header is allowed per execution graph.`,
      nodeIds: headerObjs.map((h) => h.id),
    });
  }

  // Cycle detection on semantic connectors reachable from/connected to this graph
  // DFS 3-color cycle detection
  const adj = new Map<string, string[]>();
  for (const conn of semanticConnectors) {
    const list = adj.get(conn.sourceObjectId) || [];
    list.push(conn.targetObjectId);
    adj.set(conn.sourceObjectId, list);
  }

  const visitedState = new Map<string, "UNVISITED" | "VISITING" | "VISITED">();
  let hasCycle = false;
  let cycleNodes: string[] = [];

  function dfs(nodeId: string, path: string[]) {
    visitedState.set(nodeId, "VISITING");
    path.push(nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const next of neighbors) {
      const state = visitedState.get(next) || "UNVISITED";
      if (state === "VISITING") {
        hasCycle = true;
        const cycleStartIndex = path.indexOf(next);
        cycleNodes = path.slice(cycleStartIndex).concat(next);
        return;
      }
      if (state === "UNVISITED") {
        dfs(next, path);
        if (hasCycle) return;
      }
    }

    visitedState.set(nodeId, "VISITED");
    path.pop();
  }

  dfs(mainObjectId, []);

  if (hasCycle) {
    errors.push({
      code: "CYCLE_DETECTED",
      message: `Cycle detected in execution graph: ${cycleNodes.join(" -> ")}.`,
      nodeIds: cycleNodes,
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Build the graph
  const graph = buildExecutionGraph(objects, connectors, mainObjectId);
  if (!graph) {
    return {
      valid: false,
      errors: [
        {
          code: "EMPTY_GRAPH",
          message: `Failed to construct execution graph for Main "${mainObjectId}".`,
          nodeIds: [mainObjectId],
        },
      ],
    };
  }

  return { valid: true, graph };
}
