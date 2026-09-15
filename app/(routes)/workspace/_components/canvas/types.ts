export const CANVAS_WIDTH = 3000;
export const CANVAS_HEIGHT = 2000;

export type CanvasObjectType = "rectangle" | "circle" | "text" | "image" | "codebox" | "header" | "path" | "output";

export interface CanvasObjectStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  opacity?: number;
}

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: any;
  style?: CanvasObjectStyle;
}

export type CodeBoxRole = "main" | "function" | "unassigned";

export interface CodeBoxData {
  /** Strictly constrained role: "main" (entry-point) or "function" (dependency) */
  role: CodeBoxRole;
  /** Language key matching LANGUAGES (e.g., "cpp", "python") */
  language: string;
  /** Source code content */
  code: string;
  /** Optional compiler output */
  output?: string;
  /** Whether output panel is visible */
  outputVisible?: boolean;
}

export interface HeaderData {
  /** Language key matching LANGUAGES (e.g., "cpp", "python") */
  language: string;
  /** Source code content */
  code: string;
}

export interface OutputData {
  /** Current state of output */
  state: "idle" | "compiling" | "running" | "error" | "done";
  /** Terminal output string */
  output: string;
  /** Optional error message */
  error?: string;
}

export interface PathData {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export type ConnectionSide = "top" | "right" | "bottom" | "left";

export type ConnectorType = "normal" | "main-function" | "main-output";

export interface Connector {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  sourceSide: ConnectionSide;
  targetSide: ConnectionSide;
  type?: ConnectorType;
  style?: Record<string, any>;
}

export interface ConnectingState {
  sourceObjectId: string;
  sourceSide: ConnectionSide;
  currentWorldPos: { x: number; y: number };
  hoveredTarget?: {
    targetObjectId: string;
    targetSide: ConnectionSide;
  };
}

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 3.0;
export const MIN_OBJECT_SIZE = 30;

export function screenToWorld(
  screenX: number,
  screenY: number,
  viewport: Viewport
): { x: number; y: number } {
  return {
    x: (screenX - viewport.x) / viewport.zoom,
    y: (screenY - viewport.y) / viewport.zoom,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  viewport: Viewport
): { x: number; y: number } {
  return {
    x: worldX * viewport.zoom + viewport.x,
    y: worldY * viewport.zoom + viewport.y,
  };
}

export function generateObjectId(prefix: string = "obj"): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomPart}`;
}

export function getConnectionPointCoordinates(
  object: CanvasObject,
  side: ConnectionSide
): { x: number; y: number } {
  const x = Number(object.x) || 0;
  const y = Number(object.y) || 0;
  const width = Number(object.width) || 0;
  const height = Number(object.height) || 0;

  switch (side) {
    case "top":
      return { x: x + width / 2, y: y };
    case "right":
      return { x: x + width, y: y + height / 2 };
    case "bottom":
      return { x: x + width / 2, y: y + height };
    case "left":
      return { x: x, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
}
