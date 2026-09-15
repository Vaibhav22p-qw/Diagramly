import type { CodeBoxRole } from "../types";

export interface ExecutionNode {
  /** Stable CanvasObject ID */
  id: string;
  role?: CodeBoxRole | "header";
  language: string;
  code: string;
  /** Position index in the canonical Canvas objects array for deterministic ordering */
  canvasIndex: number;
}

export interface ExecutionEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface ExecutionGraph {
  headerNode?: ExecutionNode;
  mainNode: ExecutionNode;
  functionNodes: ExecutionNode[]; // Deterministically ordered
  edges: ExecutionEdge[];
  language: string;
}

export type GraphValidationErrorCode =
  | "NO_MAIN"
  | "MULTIPLE_MAINS"
  | "INVALID_ROLE"
  | "MAIN_TO_MAIN"
  | "FUNCTION_TO_MAIN"
  | "FUNCTION_TO_FUNCTION"
  | "SELF_REFERENCE"
  | "MISSING_NODE"
  | "DUPLICATE_EDGE"
  | "CYCLE_DETECTED"
  | "MIXED_LANGUAGES"
  | "EMPTY_GRAPH"
  | "NON_CODEBOX_PARTICIPATION"
  | "MULTIPLE_HEADERS";

export interface GraphValidationError {
  code: GraphValidationErrorCode;
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

export type GraphValidationResult =
  | { valid: true; graph: ExecutionGraph; errors?: never }
  | { valid: false; errors: GraphValidationError[]; graph?: never };

export interface ComposedProgram {
  language: string;
  composedCode: string;
  orderedNodeIds: string[];
}
