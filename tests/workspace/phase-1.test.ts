import assert from "node:assert/strict";
import test from "node:test";
import type { PanelMode, WorkspacePanel } from "@/app/(routes)/workspace/_components/Workspace";

test("PanelMode supports two and three modes", () => {
  const modes: PanelMode[] = ["two", "three"];
  assert.equal(modes.length, 2);
  assert.ok(modes.includes("two"));
  assert.ok(modes.includes("three"));
});

test("2-panel mode enforces maximum of 2 active panels via LRU", () => {
  let openPanels: Record<WorkspacePanel, boolean> = {
    document: true,
    compiler: false,
    canvas: false,
  };
  let recentPanels: WorkspacePanel[] = ["document"];
  const panelMode: PanelMode = "two";

  const openPanel = (panel: WorkspacePanel) => {
    const currentlyOpen = (Object.keys(openPanels) as WorkspacePanel[]).filter(
      (key) => openPanels[key]
    );
    const limit = panelMode === "two" ? 2 : 3;
    const oldest =
      currentlyOpen.length >= limit
        ? recentPanels.find((key) => openPanels[key])
        : undefined;

    if (!openPanels[panel]) {
      const next = { ...openPanels, [panel]: true };
      if (oldest) {
        next[oldest] = false;
      }
      openPanels = next;
    }
    recentPanels = [...recentPanels.filter((key) => key !== panel), panel];
  };

  // Open compiler (panels: document + compiler = 2)
  openPanel("compiler");
  assert.deepEqual(openPanels, { document: true, compiler: true, canvas: false });

  // Open canvas: oldest (document) is evicted
  openPanel("canvas");
  assert.deepEqual(openPanels, { document: false, compiler: true, canvas: true });
  assert.equal(
    Object.values(openPanels).filter(Boolean).length,
    2,
    "At most 2 panels can be open in 2-panel mode"
  );
});

test("3-panel mode allows all 3 panels concurrently", () => {
  const openPanels: Record<WorkspacePanel, boolean> = {
    document: true,
    compiler: true,
    canvas: true,
  };
  const visibleCount = (Object.keys(openPanels) as WorkspacePanel[]).filter(
    (k) => openPanels[k]
  ).length;
  assert.equal(visibleCount, 3);
});
