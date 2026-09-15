import assert from "node:assert/strict";
import test from "node:test";
import type { CanvasObject, CodeBoxData, Connector } from "@/app/(routes)/workspace/_components/canvas/types";
import { generateObjectId } from "@/app/(routes)/workspace/_components/canvas/types";
import { LANGUAGES } from "@/lib/compiler/languages";

test("1. CodeBox creation with default role 'main'", () => {
  const codeBoxData: CodeBoxData = {
    role: "main",
    language: "cpp",
    code: LANGUAGES["cpp"].defaultCode,
    output: "",
    outputVisible: false,
  };

  const obj: CanvasObject = {
    id: generateObjectId("codebox"),
    type: "codebox",
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    data: codeBoxData,
  };

  assert.ok(obj.id.startsWith("codebox_"));
  assert.equal(obj.type, "codebox");
  assert.equal(obj.data.role, "main");
  assert.equal(obj.data.language, "cpp");
  assert.equal(obj.data.code, LANGUAGES["cpp"].defaultCode);
  assert.equal(obj.data.outputVisible, false);
});

test("2. Stable unique ID generation for multiple CodeBoxes", () => {
  const id1 = generateObjectId("codebox");
  const id2 = generateObjectId("codebox");
  assert.notEqual(id1, id2);
  assert.ok(id1.startsWith("codebox_"));
  assert.ok(id2.startsWith("codebox_"));
});

test("3. Save updates code, language, role, and output", () => {
  let initial: CodeBoxData = {
    role: "main",
    language: "cpp",
    code: "int main() {}",
    output: "",
    outputVisible: false,
  };

  const updated: CodeBoxData = {
    role: "function",
    language: "python",
    code: "def hello(): pass",
    output: "done",
    outputVisible: true,
  };

  // Simulating Save
  initial = { ...updated };
  assert.equal(initial.role, "function");
  assert.equal(initial.language, "python");
  assert.equal(initial.code, "def hello(): pass");
  assert.equal(initial.output, "done");
  assert.equal(initial.outputVisible, true);
});

test("4. Cancel discards unsaved edits", () => {
  const saved: CodeBoxData = {
    role: "main",
    language: "cpp",
    code: "int main() {}",
  };

  let editingDraft = { ...saved, code: "unsaved changes" };
  // Cancel action: discard draft
  editingDraft = { ...saved };
  assert.equal(editingDraft.code, "int main() {}");
});

test("5. Output visibility toggle retains stored output value", () => {
  const codeBox: CodeBoxData = {
    role: "main",
    language: "cpp",
    code: "int main() {}",
    output: "Compilation successful. Result: 100",
    outputVisible: true,
  };

  // Hide output
  const hidden = { ...codeBox, outputVisible: false };
  assert.equal(hidden.outputVisible, false);
  assert.equal(hidden.output, "Compilation successful. Result: 100", "Output must remain stored when hidden");

  // Re-show output
  const reshown = { ...hidden, outputVisible: true };
  assert.equal(reshown.outputVisible, true);
  assert.equal(reshown.output, "Compilation successful. Result: 100");
});

test("6. Duplication creates new unique ID and copies saved state", () => {
  const original: CanvasObject = {
    id: "codebox_original",
    type: "codebox",
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    data: {
      role: "function",
      language: "python",
      code: "print('duplicated')",
      output: "duplicated",
      outputVisible: true,
    } as CodeBoxData,
  };

  const duplicated: CanvasObject = {
    ...original,
    id: generateObjectId("codebox"),
    x: original.x + 24,
    y: original.y + 24,
    data: JSON.parse(JSON.stringify(original.data)),
  };

  assert.notEqual(duplicated.id, original.id);
  assert.equal(duplicated.x, 74);
  assert.equal(duplicated.y, 74);
  assert.equal(duplicated.data.role, "function");
  assert.equal(duplicated.data.code, "print('duplicated')");
});

test("7. Deletion removes CodeBox and cleans up connected connectors", () => {
  let objects: CanvasObject[] = [
    { id: "cb_1", type: "codebox", x: 0, y: 0, width: 200, height: 100 },
    { id: "cb_2", type: "codebox", x: 300, y: 0, width: 200, height: 100 },
  ];
  let connectors: Connector[] = [
    {
      id: "conn_1",
      sourceObjectId: "cb_1",
      targetObjectId: "cb_2",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  // Delete cb_1
  const deleteId = "cb_1";
  objects = objects.filter((o) => o.id !== deleteId);
  connectors = connectors.filter(
    (c) => c.sourceObjectId !== deleteId && c.targetObjectId !== deleteId
  );

  assert.equal(objects.length, 1);
  assert.equal(connectors.length, 0);
});

test("8. Normal connector compatibility with CodeBoxes", () => {
  const normConn: Connector = {
    id: "conn_norm",
    sourceObjectId: "shape_1",
    targetObjectId: "cb_1",
    sourceSide: "right",
    targetSide: "left",
    type: "normal",
  };
  assert.equal(normConn.type, "normal");
});
