"use client";

export const dynamic = "force-dynamic";

import React, { useRef, useState } from "react";
import nextDynamic from "next/dynamic";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import ViewSwitcher from "./_components/ViewSwitcher";



const Editor = nextDynamic(() => import("./_components/Editor"), {
  ssr: false,
});

const Canvas = nextDynamic(
  () => import("./_components/Canvas"),
  {
    ssr: false,
  }
);

function Workspace() {
  const [view, setView] = useState<"document" | "both" | "canvas">("both");
  const canvasRef = useRef<any>(null);

  const [triggerSave, setTriggerSave] = useState(false);
  const [fileName, setFileName] = useState("Untitled");

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const editor = document.getElementById("editor-container");

    if (!editor) return;

    // Export Excalidraw image
    const canvasImage = await canvasRef.current?.exportCanvas();
console.log(canvasRef.current);
console.log(canvasImage);
    // Temporary container for PDF
    const container = document.createElement("div");
    container.style.padding = "30px";
    container.style.background = "#ffffffff";
    container.style.width = "800px";

    // Add editor content
    container.appendChild(editor.cloneNode(true));

    // Add Excalidraw drawing
    if (canvasImage) {
      const title = document.createElement("h2");
      title.style.marginTop = "40px";
      title.style.marginBottom = "15px";
      title.style.fontSize = "24px";

      const wrapper = document.createElement("div");

wrapper.style.width = "80%";
wrapper.style.height = "auto";
wrapper.style.display = "flex";
wrapper.style.justifyContent = "center";
wrapper.style.alignItems = "center";
wrapper.style.overflow = "hidden";
wrapper.style.border = "1px solid #ddd";
wrapper.style.borderRadius = "8px";
wrapper.style.padding = "10px";

const image = document.createElement("img");
image.src = canvasImage;
image.style.maxWidth = "100%";
image.style.maxHeight = "100%";
image.style.width = "auto";
image.style.height = "auto";
image.style.objectFit = "contain";

wrapper.appendChild(image);

container.appendChild(title);
container.appendChild(wrapper);
    }

    await html2pdf()
      .from(container)
      .set({
        filename: `${fileName}.pdf`,
        margin: 10,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  return (
    <div className="h-screen overflow-hidden">
      <WorkspaceHeader
        fileName={fileName}
        setFileName={setFileName}
        onSave={downloadPDF}
      />

      <ViewSwitcher view={view} setView={setView} />

      <div
  className={`h-[calc(100vh-7rem)] ${
    view === "both"
      ? "grid grid-cols-1 md:grid-cols-2"
      : "grid grid-cols-1"
  }`}
>
  {(view === "document" || view === "both") && (
    <div id="editor-container" className="overflow-auto">
      <Editor onSaveTrigger={triggerSave} />
    </div>
  )}

  {(view === "canvas" || view === "both") && (
    <div className={`${view === "both" ? "border-l" : ""} overflow-hidden`}>
      <Canvas
        ref={canvasRef}
        onSaveTrigger={triggerSave}
      />
    </div>
  )}
</div>
    </div>
  );
}

export default Workspace;
