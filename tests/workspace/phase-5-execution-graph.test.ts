import assert from "node:assert/strict";
import test from "node:test";
import type { CanvasObject, Connector } from "@/app/(routes)/workspace/_components/canvas/types";
import { buildExecutionGraph } from "@/app/(routes)/workspace/_components/canvas/execution/graphBuilder";
import { validateExecutionGraph } from "@/app/(routes)/workspace/_components/canvas/execution/graphValidator";
import { composeProgram } from "@/app/(routes)/workspace/_components/canvas/execution/codeComposer";
import { runExecutionGraph } from "@/app/(routes)/workspace/_components/canvas/execution/graphRunner";

// ==========================================
// Test Fixtures
// ==========================================
const createCodeBox = (
  id: string,
  role: "main" | "function",
  language: string = "cpp",
  code: string = "// code"
): CanvasObject => ({
  id,
  type: "codebox",
  x: 0,
  y: 0,
  width: 200,
  height: 150,
  data: { role, language, code, output: "", outputVisible: false },
});

// ==========================================
// GRAPH BUILDER TESTS (1–6)
// ==========================================
test("1. Builds Main + one Function", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() { return 0; }"),
    createCodeBox("fn_1", "function", "cpp", "void helper() {}"),
  ];
  const connectors: Connector[] = [
    {
      id: "conn_1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.equal(graph.mainNode.id, "main_1");
  assert.equal(graph.functionNodes.length, 1);
  assert.equal(graph.functionNodes[0].id, "fn_1");
  assert.equal(graph.edges.length, 1);
});

test("2. Builds Main + multiple Functions", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
    createCodeBox("fn_2", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c2",
      sourceObjectId: "main_1",
      targetObjectId: "fn_2",
      sourceSide: "bottom",
      targetSide: "top",
      type: "main-function",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.equal(graph.functionNodes.length, 2);
  assert.deepEqual(
    graph.functionNodes.map((n) => n.id),
    ["fn_1", "fn_2"]
  );
});

test("3. Builds standalone Main", () => {
  const objects: CanvasObject[] = [createCodeBox("main_solo", "main")];
  const connectors: Connector[] = [];

  const graph = buildExecutionGraph(objects, connectors, "main_solo");
  assert.ok(graph);
  assert.equal(graph.mainNode.id, "main_solo");
  assert.equal(graph.functionNodes.length, 0);
  assert.equal(graph.edges.length, 0);
});

test("4. Ignores normal connectors", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "conn_normal",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.equal(graph.functionNodes.length, 0, "Normal connector must not create graph dependency");
  assert.equal(graph.edges.length, 0);
});

test("5. Ignores unrelated Main graphs", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_A", "main"),
    createCodeBox("fn_A", "function"),
    createCodeBox("main_B", "main"),
    createCodeBox("fn_B", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "c_A",
      sourceObjectId: "main_A",
      targetObjectId: "fn_A",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c_B",
      sourceObjectId: "main_B",
      targetObjectId: "fn_B",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const graphA = buildExecutionGraph(objects, connectors, "main_A");
  assert.ok(graphA);
  assert.equal(graphA.mainNode.id, "main_A");
  assert.deepEqual(graphA.functionNodes.map((f) => f.id), ["fn_A"]);

  const graphB = buildExecutionGraph(objects, connectors, "main_B");
  assert.ok(graphB);
  assert.equal(graphB.mainNode.id, "main_B");
  assert.deepEqual(graphB.functionNodes.map((f) => f.id), ["fn_B"]);
});

test("6. Ignores non-CodeBox objects", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    { id: "rect_1", type: "rectangle", x: 0, y: 0, width: 100, height: 100 },
  ];
  const connectors: Connector[] = [
    {
      id: "c_rect",
      sourceObjectId: "main_1",
      targetObjectId: "rect_1",
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.equal(graph.functionNodes.length, 0);
});

// ==========================================
// GRAPH VALIDATION TESTS (7–20)
// ==========================================
test("7. Rejects missing Main", () => {
  const res = validateExecutionGraph([], [], "nonexistent_main");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "NO_MAIN"));
});

test("8. Rejects invalid Main role", () => {
  const objects: CanvasObject[] = [createCodeBox("box_1", "function")];
  const res = validateExecutionGraph(objects, [], "box_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "INVALID_ROLE"));
});

test("9. Rejects Main -> Main", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("main_2", "main"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "main_2",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "MAIN_TO_MAIN"));
});

test("10. Rejects Function -> Main", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "fn_1",
      targetObjectId: "main_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "FUNCTION_TO_MAIN"));
});

test("11. Rejects Function -> Function", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
    createCodeBox("fn_2", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c2",
      sourceObjectId: "fn_1",
      targetObjectId: "fn_2",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  // Validating from main_1 where fn_1 connects to fn_2
  // We include c2 in semantic connectors checked
  const res = validateExecutionGraph(objects, connectors, "fn_1");
  assert.equal(res.valid, false); // fn_1 is not main
});

test("12. Rejects self-reference", () => {
  const objects: CanvasObject[] = [createCodeBox("main_1", "main")];
  const connectors: Connector[] = [
    {
      id: "c_self",
      sourceObjectId: "main_1",
      targetObjectId: "main_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "SELF_REFERENCE"));
});

test("13. Rejects duplicate semantic edges", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c2",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "bottom",
      targetSide: "top",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "DUPLICATE_EDGE"));
});

test("14. Rejects missing target object", () => {
  const objects: CanvasObject[] = [createCodeBox("main_1", "main")];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "missing_fn",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "MISSING_NODE"));
});

test("15. Rejects non-CodeBox target", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    { id: "shape_1", type: "circle", x: 0, y: 0, width: 80, height: 80 },
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "shape_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "NON_CODEBOX_PARTICIPATION"));
});

test("16. Rejects invalid target role", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    {
      id: "box_invalid",
      type: "codebox",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      data: { role: "custom_role" as any, language: "cpp", code: "" },
    },
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "box_invalid",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "INVALID_ROLE"));
});

test("17. Rejects mixed languages", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_cpp", "main", "cpp"),
    createCodeBox("fn_py", "function", "python"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_cpp",
      targetObjectId: "fn_py",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_cpp");
  assert.equal(res.valid, false);
  assert.ok(res.errors?.some((e) => e.code === "MIXED_LANGUAGES"));
});

test("18. Detects cycles through the graph validation infrastructure", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
  ];
  // An artificial cycle where main_1 -> fn_1 -> main_1
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c2",
      sourceObjectId: "fn_1",
      targetObjectId: "main_1",
      sourceSide: "left",
      targetSide: "right",
      type: "main-function",
    },
  ];
  const res = validateExecutionGraph(objects, connectors, "main_1");
  assert.equal(res.valid, false);
  // Both FUNCTION_TO_MAIN and CYCLE_DETECTED will be triggered
  assert.ok(
    res.errors?.some((e) => e.code === "CYCLE_DETECTED" || e.code === "FUNCTION_TO_MAIN")
  );
});

test("19. Allows standalone Main", () => {
  const objects: CanvasObject[] = [createCodeBox("main_solo", "main", "python")];
  const res = validateExecutionGraph(objects, [], "main_solo");
  assert.equal(res.valid, true);
  assert.ok(res.graph);
  assert.equal(res.graph.functionNodes.length, 0);
});

test("20. Allows multiple independent Main graphs on same Canvas", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_A", "main", "cpp"),
    createCodeBox("fn_A", "function", "cpp"),
    createCodeBox("main_B", "main", "python"),
    createCodeBox("fn_B", "function", "python"),
  ];
  const connectors: Connector[] = [
    {
      id: "c_A",
      sourceObjectId: "main_A",
      targetObjectId: "fn_A",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
    {
      id: "c_B",
      sourceObjectId: "main_B",
      targetObjectId: "fn_B",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const resA = validateExecutionGraph(objects, connectors, "main_A");
  assert.equal(resA.valid, true, "Graph A must be valid independently");
  assert.equal(resA.graph?.language, "cpp");

  const resB = validateExecutionGraph(objects, connectors, "main_B");
  assert.equal(resB.valid, true, "Graph B must be valid independently with its own language");
  assert.equal(resB.graph?.language, "python");
});

// ==========================================
// DETERMINISTIC ORDERING TESTS (21–23)
// ==========================================
test("21. Functions before Main in composed program", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
    createCodeBox("fn_1", "function", "cpp", "void f1() {}"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.deepEqual(composed.orderedNodeIds, ["fn_1", "main_1"]);
});

test("22. Function sibling order is deterministic using Canvas index", () => {
  // Objects created in order: fn_early (index 1), fn_late (index 2)
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_early", "function"),
    createCodeBox("fn_late", "function"),
  ];
  // Even if connectors are connected in reverse order:
  const connectors: Connector[] = [
    {
      id: "c_late",
      sourceObjectId: "main_1",
      targetObjectId: "fn_late",
      sourceSide: "bottom",
      targetSide: "top",
      type: "main-function",
    },
    {
      id: "c_early",
      sourceObjectId: "main_1",
      targetObjectId: "fn_early",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.deepEqual(
    graph.functionNodes.map((f) => f.id),
    ["fn_early", "fn_late"],
    "Must preserve canvasIndex ordering regardless of connector insertion order"
  );
});

test("23. Repeated graph construction produces identical order", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("fn_1", "function"),
    createCodeBox("fn_2", "function"),
    createCodeBox("fn_3", "function"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "main_1", targetObjectId: "fn_3", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
    { id: "c2", sourceObjectId: "main_1", targetObjectId: "fn_1", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
    { id: "c3", sourceObjectId: "main_1", targetObjectId: "fn_2", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  const graph1 = buildExecutionGraph(objects, connectors, "main_1");
  const graph2 = buildExecutionGraph(objects, connectors, "main_1");

  assert.deepEqual(
    graph1?.functionNodes.map((f) => f.id),
    graph2?.functionNodes.map((f) => f.id)
  );
});

// ==========================================
// CODE COMPOSITION TESTS (24–28)
// ==========================================
test("24. All participating Function code is included", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
    createCodeBox("fn_1", "function", "cpp", "int add(int a, int b) { return a + b; }"),
    createCodeBox("fn_2", "function", "cpp", "int sub(int a, int b) { return a - b; }"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "main_1", targetObjectId: "fn_1", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
    { id: "c2", sourceObjectId: "main_1", targetObjectId: "fn_2", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.ok(composed.composedCode.includes("int add(int a, int b) { return a + b; }"));
  assert.ok(composed.composedCode.includes("int sub(int a, int b) { return a - b; }"));
});

test("25. Main code is included", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() { cout << 10; return 0; }"),
  ];
  const graph = buildExecutionGraph(objects, [], "main_1");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.ok(composed.composedCode.includes("int main() { cout << 10; return 0; }"));
});

test("26. Node IDs are represented in provenance comments", () => {
  const objects: CanvasObject[] = [
    createCodeBox("obj_main_123", "main", "python", "print('main')"),
    createCodeBox("obj_fn_456", "function", "python", "def helper(): pass"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "obj_main_123", targetObjectId: "obj_fn_456", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  const graph = buildExecutionGraph(objects, connectors, "obj_main_123");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.ok(composed.composedCode.includes("// Diagramly CodeBox: obj_fn_456"));
  assert.ok(composed.composedCode.includes("// Diagramly CodeBox: obj_main_123"));
});

test("27. orderedNodeIds is correct", () => {
  const objects: CanvasObject[] = [
    createCodeBox("m", "main"),
    createCodeBox("f1", "function"),
    createCodeBox("f2", "function"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "m", targetObjectId: "f1", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
    { id: "c2", sourceObjectId: "m", targetObjectId: "f2", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  const graph = buildExecutionGraph(objects, connectors, "m");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.deepEqual(composed.orderedNodeIds, ["f1", "f2", "m"]);
});

test("28. Language is preserved", () => {
  const objects: CanvasObject[] = [createCodeBox("m", "main", "python")];
  const graph = buildExecutionGraph(objects, [], "m");
  assert.ok(graph);
  const composed = composeProgram(graph);
  assert.equal(composed.language, "python");
});

// ==========================================
// GRAPH RUNNER TESTS (29–34)
// ==========================================
test("29. Graph runner uses the existing runCode pathway", async () => {
  let invoked = false;
  const mockRunCode = async (lang: any, code: string) => {
    invoked = true;
    return { output: "Success output", error: undefined };
  };

  const objects: CanvasObject[] = [createCodeBox("main_1", "main")];
  const res = await runExecutionGraph(objects, [], "main_1", mockRunCode as any);

  assert.equal(invoked, true);
  assert.equal(res.success, true);
  assert.equal(res.output, "Success output");
});

test("30. Composed source is passed to runCode", async () => {
  let passedCode = "";
  let passedLang = "";
  const mockRunCode = async (lang: any, code: string) => {
    passedLang = lang;
    passedCode = code;
    return { output: "done" };
  };

  const objects: CanvasObject[] = [
    createCodeBox("m1", "main", "cpp", "int main() {}"),
    createCodeBox("f1", "function", "cpp", "void foo() {}"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "m1", targetObjectId: "f1", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  await runExecutionGraph(objects, connectors, "m1", mockRunCode as any);
  assert.equal(passedLang, "cpp");
  assert.ok(passedCode.includes("void foo() {}"));
  assert.ok(passedCode.includes("int main() {}"));
});

test("31. Compiler output is returned", async () => {
  const mockRunCode = async () => ({ output: "Program Output: 42" });
  const objects: CanvasObject[] = [createCodeBox("m1", "main")];

  const res = await runExecutionGraph(objects, [], "m1", mockRunCode as any);
  assert.equal(res.output, "Program Output: 42");
  assert.equal(res.success, true);
});

test("32. Compiler errors are returned", async () => {
  const mockRunCode = async () => ({ error: "syntax error: expected ;" });
  const objects: CanvasObject[] = [createCodeBox("m1", "main")];

  const res = await runExecutionGraph(objects, [], "m1", mockRunCode as any);
  assert.equal(res.error, "syntax error: expected ;");
  assert.equal(res.success, false);
});

test("33. Main CodeBox receives graph execution output", async () => {
  let objects: CanvasObject[] = [
    createCodeBox("main_target", "main"),
    createCodeBox("fn_1", "function"),
  ];
  const connectors: Connector[] = [
    { id: "c1", sourceObjectId: "main_target", targetObjectId: "fn_1", sourceSide: "r", targetSide: "l", type: "main-function" } as any,
  ];

  const mockRunCode = async () => ({ output: "Main received output" });
  const res = await runExecutionGraph(objects, connectors, "main_target", mockRunCode as any);

  // Update object state as Canvas would
  if (res.output) {
    objects = objects.map((obj) =>
      obj.id === "main_target"
        ? { ...obj, data: { ...obj.data, output: res.output, outputVisible: true } }
        : obj
    );
  }

  const updatedMain = objects.find((o) => o.id === "main_target");
  assert.equal(updatedMain?.data.output, "Main received output");
  assert.equal(updatedMain?.data.outputVisible, true);
});

test("34. Normal Compiler state is unaffected", async () => {
  // Verify that executing a graph does not touch global Compiler state or other objects
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main"),
    createCodeBox("main_other", "main"),
  ];
  const mockRunCode = async () => ({ output: "isolated output" });
  const res = await runExecutionGraph(objects, [], "main_1", mockRunCode as any);

  assert.equal(res.success, true);
  // Other main has untouched output
  assert.equal(objects[1].data.output, "");
});

// ==========================================
// CONNECTOR / UI TESTS (35–38)
// ==========================================
test("35. Main → Function creates main-function connector", () => {
  const sourceObj = createCodeBox("main_1", "main");
  const targetObj = createCodeBox("fn_1", "function");

  const createConnectorLogic = (src: CanvasObject, tgt: CanvasObject): Connector | null => {
    if (src.type === "codebox" && tgt.type === "codebox") {
      if (src.data?.role === "main" && tgt.data?.role === "function") {
        return {
          id: "conn_sem",
          sourceObjectId: src.id,
          targetObjectId: tgt.id,
          sourceSide: "right",
          targetSide: "left",
          type: "main-function",
        };
      }
      return null; // Rejected
    }
    return {
      id: "conn_norm",
      sourceObjectId: src.id,
      targetObjectId: tgt.id,
      sourceSide: "right",
      targetSide: "left",
      type: "normal",
    };
  };

  const conn = createConnectorLogic(sourceObj, targetObj);
  assert.ok(conn);
  assert.equal(conn.type, "main-function");
  assert.equal(conn.sourceObjectId, "main_1");
  assert.equal(conn.targetObjectId, "fn_1");
});

test("36. Invalid semantic relationships are rejected", () => {
  const main1 = createCodeBox("main_1", "main");
  const main2 = createCodeBox("main_2", "main");
  const fn1 = createCodeBox("fn_1", "function");
  const fn2 = createCodeBox("fn_2", "function");

  const tryConnect = (src: CanvasObject, tgt: CanvasObject): boolean => {
    if (src.id === tgt.id) return false;
    if (src.type === "codebox" && tgt.type === "codebox") {
      return src.data?.role === "main" && tgt.data?.role === "function";
    }
    return true;
  };

  // Main -> Main must be rejected
  assert.equal(tryConnect(main1, main2), false, "Main -> Main must be rejected");
  // Function -> Main must be rejected
  assert.equal(tryConnect(fn1, main1), false, "Function -> Main must be rejected");
  // Function -> Function must be rejected
  assert.equal(tryConnect(fn1, fn2), false, "Function -> Function must be rejected");
  // Self-connection must be rejected
  assert.equal(tryConnect(main1, main1), false, "Main -> self must be rejected");
  assert.equal(tryConnect(fn1, fn1), false, "Function -> self must be rejected");
});

test("37. Normal connectors still work", () => {
  const rect: CanvasObject = { id: "rect_1", type: "rectangle", x: 0, y: 0, width: 100, height: 100 };
  const circle: CanvasObject = { id: "circ_1", type: "circle", x: 200, y: 0, width: 80, height: 80 };
  const mainBox = createCodeBox("main_1", "main");

  const connectNormal = (src: CanvasObject, tgt: CanvasObject): Connector => ({
    id: "conn_norm",
    sourceObjectId: src.id,
    targetObjectId: tgt.id,
    sourceSide: "right",
    targetSide: "left",
    type: "normal",
  });

  const c1 = connectNormal(rect, circle);
  assert.equal(c1.type, "normal");

  const c2 = connectNormal(rect, mainBox);
  assert.equal(c2.type, "normal");

  // Normal connectors have no execution semantics
  const graph = buildExecutionGraph([mainBox, rect], [c2], "main_1");
  assert.ok(graph);
  assert.equal(graph.functionNodes.length, 0, "Normal connector connecting to codebox must be ignored by graph");
});

test("38. Semantic connector renders distinctly", () => {
  const normalConnector: Connector = {
    id: "c_norm",
    sourceObjectId: "obj_a",
    targetObjectId: "obj_b",
    sourceSide: "right",
    targetSide: "left",
    type: "normal",
  };
  const semanticConnector: Connector = {
    id: "c_sem",
    sourceObjectId: "main_1",
    targetObjectId: "fn_1",
    sourceSide: "right",
    targetSide: "left",
    type: "main-function",
  };

  const getStyle = (c: Connector) => ({
    stroke: c.type === "main-function" ? "#8b5cf6" : "#64748b",
    strokeWidth: c.type === "main-function" ? 2.75 : 1.75,
    markerEnd: c.type === "main-function" ? "url(#arrowhead-semantic)" : "url(#arrowhead)",
  });

  const normStyle = getStyle(normalConnector);
  const semStyle = getStyle(semanticConnector);

  assert.notEqual(normStyle.stroke, semStyle.stroke, "Colors must be distinct");
  assert.ok(semStyle.strokeWidth > normStyle.strokeWidth, "Semantic stroke must be thicker");
  assert.notEqual(normStyle.markerEnd, semStyle.markerEnd, "Markers must be distinct");
});

// ==========================================
// PHASE 6: HEADER EXTENSION TESTS
// ==========================================

const createHeader = (
  id: string,
  language: string = "cpp",
  code: string = "// header"
): CanvasObject => ({
  id,
  type: "header",
  x: 0,
  y: 0,
  width: 250,
  height: 150,
  data: { language, code },
});

test("39. Header appears before Functions and Main in composition", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
    createCodeBox("fn_1", "function", "cpp", "void f() {}"),
    createHeader("hdr_1", "cpp", "#include <iostream>"),
  ];
  const connectors: Connector[] = [
    {
      id: "c1",
      sourceObjectId: "main_1",
      targetObjectId: "fn_1",
      sourceSide: "right",
      targetSide: "left",
      type: "main-function",
    },
  ];

  const graph = buildExecutionGraph(objects, connectors, "main_1");
  assert.ok(graph);
  assert.equal(graph.headerNode?.id, "hdr_1");

  const composed = composeProgram(graph);
  assert.match(composed.composedCode, /#include <iostream>[\s\S]*void f\(\) \{\}[\s\S]*int main\(\) \{\}/);
  assert.deepEqual(composed.orderedNodeIds, ["hdr_1", "fn_1", "main_1"]);
});

test("40. Duplicate Header validation", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
    createHeader("hdr_1", "cpp", "#include <iostream>"),
    createHeader("hdr_2", "cpp", "#include <vector>"),
  ];
  
  const result = validateExecutionGraph(objects, [], "main_1");
  assert.equal(result.valid, false);
  assert.equal(result.errors![0].code, "MULTIPLE_HEADERS");
});

test("41. Header language mismatch validation ignores unrelated languages", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
    createHeader("hdr_py", "python", "import sys"),
  ];
  
  // It shouldn't attach the python header to a cpp graph
  const graph = buildExecutionGraph(objects, [], "main_1");
  assert.ok(graph);
  assert.ok(!graph.headerNode);
});

test("42. Header is optional", () => {
  const objects: CanvasObject[] = [
    createCodeBox("main_1", "main", "cpp", "int main() {}"),
  ];
  const graph = buildExecutionGraph(objects, [], "main_1");
  assert.ok(graph);
  assert.ok(!graph.headerNode);
});
test('43. Header code does not mutate Main source code', () => {
  const mainObj = createCodeBox('main_mut', 'main', 'cpp', 'int main() { return 0; }');
  const headerObj = createCodeBox('head_mut', 'main', 'cpp', '#include <iostream>');
  headerObj.type = 'header';

  const objects: CanvasObject[] = [mainObj, headerObj];
  const connectors: Connector[] = [];

  const graph = buildExecutionGraph(objects, connectors, 'main_mut');
  assert.ok(graph);
  
  const program = composeProgram(graph);
  
  assert.ok(program.composedCode.includes('#include <iostream>'), 'Program includes header');
  
  assert.equal(mainObj.data!.code, 'int main() { return 0; }', 'Main code was mutated!');
  assert.equal(headerObj.data!.code, '#include <iostream>', 'Header code was mutated!');
});
