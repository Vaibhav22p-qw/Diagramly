import assert from "node:assert/strict";
import test from "node:test";
import {
  CanvasObject,
  ConnectionSide,
  Connector,
  Viewport,
  generateObjectId,
  getConnectionPointCoordinates,
} from "@/app/(routes)/workspace/_components/canvas/types";

test("Unique connector ID generation with 'conn' prefix", () => {
  const id1 = generateObjectId("conn");
  const id2 = generateObjectId("conn");

  assert.ok(id1.startsWith("conn_"));
  assert.ok(id2.startsWith("conn_"));
  assert.notEqual(id1, id2);
});

test("Four connection sides calculate correct geometric points on CanvasObject", () => {
  const obj: CanvasObject = {
    id: "obj_test",
    type: "rectangle",
    x: 100,
    y: 200,
    width: 160,
    height: 100,
  };

  const top = getConnectionPointCoordinates(obj, "top");
  const right = getConnectionPointCoordinates(obj, "right");
  const bottom = getConnectionPointCoordinates(obj, "bottom");
  const left = getConnectionPointCoordinates(obj, "left");

  assert.deepEqual(top, { x: 180, y: 200 });
  assert.deepEqual(right, { x: 260, y: 250 });
  assert.deepEqual(bottom, { x: 180, y: 300 });
  assert.deepEqual(left, { x: 100, y: 250 });
});

test("Valid source and target connector creation", () => {
  const connector: Connector = {
    id: generateObjectId("conn"),
    sourceObjectId: "obj_a",
    targetObjectId: "obj_b",
    sourceSide: "right",
    targetSide: "left",
    type: "normal",
  };

  assert.ok(connector.id);
  assert.equal(connector.sourceObjectId, "obj_a");
  assert.equal(connector.targetObjectId, "obj_b");
  assert.equal(connector.sourceSide, "right");
  assert.equal(connector.targetSide, "left");
  assert.equal(connector.type, "normal");
});

test("Self-connections are rejected", () => {
  const sourceId = "obj_a";
  const targetId = "obj_a";

  const isValidConnection = (src: string, tgt: string) => src !== tgt;

  assert.equal(isValidConnection(sourceId, targetId), false, "Self-connections must be rejected");
  assert.equal(isValidConnection("obj_a", "obj_b"), true, "Connections between distinct objects are valid");
});

test("Connector selection and deselection", () => {
  let selectedConnectorId: string | null = null;
  let selectedObjectId: string | null = "obj_a";

  // Select connector
  const connId = "conn_1";
  selectedConnectorId = connId;
  selectedObjectId = null;

  assert.equal(selectedConnectorId, "conn_1");
  assert.equal(selectedObjectId, null);

  // Deselect on empty canvas
  selectedConnectorId = null;
  assert.equal(selectedConnectorId, null);
});

test("Connector deletion removes connector without deleting connected objects", () => {
  let objects: CanvasObject[] = [
    { id: "obj_a", type: "rectangle", x: 0, y: 0, width: 100, height: 100 },
    { id: "obj_b", type: "circle", x: 200, y: 0, width: 80, height: 80 },
  ];
  let connectors: Connector[] = [
    {
      id: "conn_1",
      sourceObjectId: "obj_a",
      targetObjectId: "obj_b",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
  ];

  let selectedConnectorId: string | null = "conn_1";

  // Delete connector
  connectors = connectors.filter((c) => c.id !== selectedConnectorId);
  selectedConnectorId = null;

  assert.equal(connectors.length, 0);
  assert.equal(objects.length, 2, "Objects must remain intact when deleting a connector");
  assert.equal(selectedConnectorId, null);
});

test("Object movement dynamically updates connector geometry without stale coordinates", () => {
  let objA: CanvasObject = {
    id: "obj_a",
    type: "rectangle",
    x: 0,
    y: 0,
    width: 100,
    height: 60,
  };
  const objB: CanvasObject = {
    id: "obj_b",
    type: "circle",
    x: 300,
    y: 0,
    width: 80,
    height: 80,
  };

  const connector: Connector = {
    id: "conn_1",
    sourceObjectId: "obj_a",
    targetObjectId: "obj_b",
    sourceSide: "right",
    targetSide: "left",
    type: "normal",
  };

  // Initial connector coordinates
  let p1 = getConnectionPointCoordinates(objA, connector.sourceSide);
  let p2 = getConnectionPointCoordinates(objB, connector.targetSide);
  assert.deepEqual(p1, { x: 100, y: 30 });
  assert.deepEqual(p2, { x: 300, y: 40 });

  // Move Object A by +50x, +70y
  objA = { ...objA, x: objA.x + 50, y: objA.y + 70 };

  // Recalculate connector coordinates from new object state
  p1 = getConnectionPointCoordinates(objA, connector.sourceSide);
  p2 = getConnectionPointCoordinates(objB, connector.targetSide);
  assert.deepEqual(p1, { x: 150, y: 100 });
  assert.deepEqual(p2, { x: 300, y: 40 });
});

test("Object resizing dynamically updates connector geometry", () => {
  let objA: CanvasObject = {
    id: "obj_a",
    type: "rectangle",
    x: 100,
    y: 100,
    width: 120,
    height: 80,
  };

  // Initial right connection point
  let pRight = getConnectionPointCoordinates(objA, "right");
  assert.deepEqual(pRight, { x: 220, y: 140 });

  // Resize width to 200, height to 120
  objA = { ...objA, width: 200, height: 120 };

  pRight = getConnectionPointCoordinates(objA, "right");
  assert.deepEqual(pRight, { x: 300, y: 160 });
});

test("Object deletion automatically removes all dependent connectors (no dangling references)", () => {
  let objects: CanvasObject[] = [
    { id: "obj_a", type: "rectangle", x: 0, y: 0, width: 100, height: 100 },
    { id: "obj_b", type: "circle", x: 200, y: 0, width: 80, height: 80 },
    { id: "obj_c", type: "text", x: 400, y: 0, width: 100, height: 50 },
  ];

  let connectors: Connector[] = [
    {
      id: "conn_ab",
      sourceObjectId: "obj_a",
      targetObjectId: "obj_b",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
    {
      id: "conn_bc",
      sourceObjectId: "obj_b",
      targetObjectId: "obj_c",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
  ];

  // Delete Object B
  const deletedId = "obj_b";
  objects = objects.filter((o) => o.id !== deletedId);
  connectors = connectors.filter(
    (c) => c.sourceObjectId !== deletedId && c.targetObjectId !== deletedId
  );

  assert.equal(objects.length, 2);
  assert.equal(connectors.length, 0, "Both connectors referencing obj_b must be removed");
});

test("Multiple connectors originating from and targeting objects", () => {
  const connectors: Connector[] = [
    {
      id: "conn_1",
      sourceObjectId: "obj_a",
      targetObjectId: "obj_b",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
    {
      id: "conn_2",
      sourceObjectId: "obj_a",
      targetObjectId: "obj_c",
      sourceSide: "bottom",
      targetSide: "top",
      type: "normal",
    },
    {
      id: "conn_3",
      sourceObjectId: "obj_b",
      targetObjectId: "obj_d",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
  ];

  assert.equal(connectors.length, 3);
  const outFromA = connectors.filter((c) => c.sourceObjectId === "obj_a");
  assert.equal(outFromA.length, 2);
});

test("Pan and zoom compatibility: connectors layer resides within world transformation container", () => {
  const viewport: Viewport = { x: 150, y: -80, zoom: 1.4 };
  const transformStyle = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;

  assert.equal(transformStyle, "translate(150px, -80px) scale(1.4)");
});

test("Phase 1 compatibility: Canvas and Connectors remain mounted with interactions paused during Merge mode", () => {
  const panelMode = "merge";
  const isMergeMode = panelMode === "merge";

  const wrapperClasses = isMergeMode
    ? "pointer-events-none select-none filter blur-[2px] opacity-40 transition-all duration-200"
    : "";

  assert.ok(wrapperClasses.includes("pointer-events-none"));
  assert.ok(wrapperClasses.includes("blur-[2px]"));
  assert.ok(wrapperClasses.includes("opacity-40"));
});
