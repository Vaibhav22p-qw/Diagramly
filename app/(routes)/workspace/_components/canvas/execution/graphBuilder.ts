import type { CanvasObject, Connector } from "../types";
import type { ExecutionGraph, ExecutionNode, ExecutionEdge } from "./types";

/**
 * Pure builder that extracts the execution graph for a specific Main CodeBox.
 *
 * Requirements:
 * - Finds requested Main CodeBox.
 * - Ignores all normal connectors.
 * - Ignores unrelated Main graphs elsewhere on Canvas.
 * - Resolves reachable Function CodeBoxes via `type === "main-function"` connectors.
 * - Ignores non-CodeBox objects.
 * - Orders functionNodes deterministically by their canvasIndex in `objects`.
 */
export function buildExecutionGraph(
  objects: CanvasObject[],
  connectors: Connector[],
  mainObjectId: string
): ExecutionGraph | null {
  const mainIndex = objects.findIndex((obj) => obj.id === mainObjectId);
  if (mainIndex === -1) return null;

  const mainObj = objects[mainIndex];
  if (mainObj.type !== "codebox") return null;

  const mainData = mainObj.data || {};
  if (mainData.role !== "main") return null;

  const mainNode: ExecutionNode = {
    id: mainObj.id,
    role: "main",
    language: mainData.language || "cpp",
    code: mainData.code || "",
    canvasIndex: mainIndex,
  };

  // Find semantic connectors originating from this Main
  const semanticConnectors = connectors.filter(
    (c) => c.type === "main-function" && c.sourceObjectId === mainObjectId
  );

  const edges: ExecutionEdge[] = [];
  const functionNodesMap = new Map<string, ExecutionNode>();

  for (const conn of semanticConnectors) {
    const targetId = conn.targetObjectId;
    const targetIndex = objects.findIndex((obj) => obj.id === targetId);
    if (targetIndex === -1) continue;

    const targetObj = objects[targetIndex];
    if (targetObj.type !== "codebox") continue;

    const targetData = targetObj.data || {};
    if (targetData.role !== "function") continue;

    edges.push({
      id: conn.id,
      sourceId: conn.sourceObjectId,
      targetId: conn.targetObjectId,
    });

    if (!functionNodesMap.has(targetId)) {
      functionNodesMap.set(targetId, {
        id: targetObj.id,
        role: "function",
        language: targetData.language || mainNode.language,
        code: targetData.code || "",
        canvasIndex: targetIndex,
      });
    }
  }

  // Sibling ordering: Sort Function nodes deterministically by their index in the canonical objects array
  const functionNodes = Array.from(functionNodesMap.values()).sort(
    (a, b) => a.canvasIndex - b.canvasIndex
  );

  let headerNode: ExecutionNode | undefined = undefined;
  const headerIndex = objects.findIndex((obj) => obj.type === "header" && obj.data?.language === mainNode.language);
  if (headerIndex !== -1) {
    const headerObj = objects[headerIndex];
    headerNode = {
      id: headerObj.id,
      role: "header",
      language: headerObj.data?.language || mainNode.language,
      code: headerObj.data?.code || "",
      canvasIndex: headerIndex,
    };
  }

  return {
    headerNode,
    mainNode,
    functionNodes,
    edges,
    language: mainNode.language,
  };
}
