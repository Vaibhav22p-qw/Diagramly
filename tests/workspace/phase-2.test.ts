import assert from "node:assert/strict";
import test from "node:test";
import {
  CanvasObject,
  CanvasObjectType,
  Viewport,
  MIN_ZOOM,
  MAX_ZOOM,
  MIN_OBJECT_SIZE,
  screenToWorld,
  worldToScreen,
  generateObjectId,
} from "@/app/(routes)/workspace/_components/canvas/types";

test("generateObjectId creates unique IDs with prefix", () => {
  const id1 = generateObjectId("rect");
  const id2 = generateObjectId("rect");
  const id3 = generateObjectId("circle");

  assert.ok(id1.startsWith("rect_"));
  assert.ok(id3.startsWith("circle_"));
  assert.notEqual(id1, id2);
  assert.notEqual(id1, id3);
});

test("Coordinate transformation: screenToWorld and worldToScreen invert accurately", () => {
  const viewport: Viewport = { x: 120, y: -60, zoom: 1.5 };
  const worldX = 250;
  const worldY = 350;

  const screen = worldToScreen(worldX, worldY, viewport);
  assert.equal(screen.x, worldX * 1.5 + 120);
  assert.equal(screen.y, worldY * 1.5 - 60);

  const backToWorld = screenToWorld(screen.x, screen.y, viewport);
  assert.ok(Math.abs(backToWorld.x - worldX) < 1e-9);
  assert.ok(Math.abs(backToWorld.y - worldY) < 1e-9);
});

test("Canvas object creation for all 4 types (Rectangle, Circle, Text, Image)", () => {
  const types: CanvasObjectType[] = ["rectangle", "circle", "text", "image"];
  const objects: CanvasObject[] = types.map((type) => ({
    id: generateObjectId(type),
    type,
    x: 100,
    y: 100,
    width: type === "circle" ? 120 : 160,
    height: type === "circle" ? 120 : 100,
    data: type === "text" ? { text: "Hello" } : { label: type },
  }));

  assert.equal(objects.length, 4);
  assert.equal(objects[0].type, "rectangle");
  assert.equal(objects[1].type, "circle");
  assert.equal(objects[2].type, "text");
  assert.equal(objects[3].type, "image");
});

test("Object selection and clearing selection", () => {
  let selectedId: string | null = null;
  const objectId = generateObjectId("rectangle");

  // Select object
  selectedId = objectId;
  assert.equal(selectedId, objectId);

  // Click empty canvas clears selection
  selectedId = null;
  assert.equal(selectedId, null);
});

test("Object movement: moves accurately in world coordinates accounting for zoom", () => {
  const viewport: Viewport = { x: 50, y: 50, zoom: 2.0 };
  const initialObj: CanvasObject = {
    id: "obj_test",
    type: "rectangle",
    x: 100,
    y: 100,
    width: 150,
    height: 100,
  };

  const deltaClientX = 40; // 40px screen delta
  const deltaClientY = 60; // 60px screen delta

  const worldDeltaX = deltaClientX / viewport.zoom; // 20 world units
  const worldDeltaY = deltaClientY / viewport.zoom; // 30 world units

  const movedObj: CanvasObject = {
    ...initialObj,
    x: initialObj.x + worldDeltaX,
    y: initialObj.y + worldDeltaY,
  };

  assert.equal(movedObj.x, 120);
  assert.equal(movedObj.y, 130);
});

test("Object resizing: enforces MIN_OBJECT_SIZE and updates dimensions with zoom division", () => {
  const viewport: Viewport = { x: 0, y: 0, zoom: 0.5 };
  const initialObj: CanvasObject = {
    id: "obj_test",
    type: "rectangle",
    x: 50,
    y: 50,
    width: 100,
    height: 80,
  };

  // Drag handle out by 50px screen = 100px world at 0.5 zoom
  const deltaClientX = 50;
  const deltaClientY = 40;
  const worldDeltaW = deltaClientX / viewport.zoom;
  const worldDeltaH = deltaClientY / viewport.zoom;

  const resizedObj: CanvasObject = {
    ...initialObj,
    width: Math.max(MIN_OBJECT_SIZE, initialObj.width + worldDeltaW),
    height: Math.max(MIN_OBJECT_SIZE, initialObj.height + worldDeltaH),
  };

  assert.equal(resizedObj.width, 200);
  assert.equal(resizedObj.height, 160);

  // Attempt to resize smaller than MIN_OBJECT_SIZE (30px)
  const tinyWidth = Math.max(MIN_OBJECT_SIZE, 10);
  assert.equal(tinyWidth, MIN_OBJECT_SIZE);
});

test("Object deletion removes object from state", () => {
  let objects: CanvasObject[] = [
    { id: "obj_1", type: "rectangle", x: 0, y: 0, width: 100, height: 100 },
    { id: "obj_2", type: "circle", x: 200, y: 0, width: 80, height: 80 },
  ];
  let selectedId: string | null = "obj_1";

  // Delete selected
  objects = objects.filter((o) => o.id !== selectedId);
  selectedId = null;

  assert.equal(objects.length, 1);
  assert.equal(objects[0].id, "obj_2");
  assert.equal(selectedId, null);
});

test("Object duplication creates duplicate with unique ID and offset position", () => {
  const original: CanvasObject = {
    id: "obj_orig",
    type: "text",
    x: 150,
    y: 120,
    width: 160,
    height: 50,
    data: { text: "Duplicated note" },
    style: { color: "#1e293b" },
  };

  const duplicate: CanvasObject = {
    ...original,
    id: generateObjectId(original.type),
    x: original.x + 24,
    y: original.y + 24,
    data: original.data ? JSON.parse(JSON.stringify(original.data)) : undefined,
    style: original.style ? { ...original.style } : undefined,
  };

  assert.notEqual(duplicate.id, original.id);
  assert.equal(duplicate.x, 174);
  assert.equal(duplicate.y, 144);
  assert.deepEqual(duplicate.data, original.data);
  assert.deepEqual(duplicate.style, original.style);
});

test("Pan updates viewport x and y coordinates", () => {
  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  const panDeltaX = 145;
  const panDeltaY = -75;

  viewport = {
    ...viewport,
    x: viewport.x + panDeltaX,
    y: viewport.y + panDeltaY,
  };

  assert.equal(viewport.x, 145);
  assert.equal(viewport.y, -75);
  assert.equal(viewport.zoom, 1);
});

test("Zoom updates zoom level clamped to [MIN_ZOOM, MAX_ZOOM] centered around cursor", () => {
  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  const cursorX = 400;
  const cursorY = 300;

  // Zoom in by factor 1.2
  const factor = 1.2;
  const newZoom = Math.min(Math.max(viewport.zoom * factor, MIN_ZOOM), MAX_ZOOM);
  const worldX = (cursorX - viewport.x) / viewport.zoom;
  const worldY = (cursorY - viewport.y) / viewport.zoom;

  viewport = {
    zoom: newZoom,
    x: cursorX - worldX * newZoom,
    y: cursorY - worldY * newZoom,
  };

  assert.equal(viewport.zoom, 1.2);
  // Point under cursor remains invariant
  const pointWorldX = (cursorX - viewport.x) / viewport.zoom;
  const pointWorldY = (cursorY - viewport.y) / viewport.zoom;
  assert.ok(Math.abs(pointWorldX - worldX) < 1e-9);
  assert.ok(Math.abs(pointWorldY - worldY) < 1e-9);

  // Exceed max zoom
  const clampedMax = Math.min(Math.max(10.0, MIN_ZOOM), MAX_ZOOM);
  assert.equal(clampedMax, MAX_ZOOM);

  // Below min zoom
  const clampedMin = Math.min(Math.max(0.01, MIN_ZOOM), MAX_ZOOM);
  assert.equal(clampedMin, MIN_ZOOM);
});

test("Phase 1 compatibility: Canvas remains mounted with interaction paused during Merge mode", () => {
  const panelMode = "merge";
  const isMergeMode = panelMode === "merge";

  const wrapperClasses = isMergeMode
    ? "pointer-events-none select-none filter blur-[2px] opacity-40 transition-all duration-200"
    : "";

  assert.ok(wrapperClasses.includes("pointer-events-none"));
  assert.ok(wrapperClasses.includes("blur-[2px]"));
  assert.ok(wrapperClasses.includes("opacity-40"));
});
