import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  exportToBlob,
} from "@excalidraw/excalidraw";


const Canvas = forwardRef(({ onSaveTrigger }: any, ref: any) => {
  const excalidrawAPI = useRef<any>(null);
  const [whiteBoardData, setWhiteBoardData] = useState<any>();

  useEffect(() => {
    if (onSaveTrigger) {
      console.log("Saved data:", whiteBoardData);
    }
  }, [onSaveTrigger]);

  // Export Excalidraw as Base64 Image
  const exportCanvas = async () => {
    if (!excalidrawAPI.current) return null;

    const blob = await exportToBlob({
      elements: excalidrawAPI.current.getSceneElements(),
      appState: {
        ...excalidrawAPI.current.getAppState(),
        exportBackground: true,
      },
      files: excalidrawAPI.current.getFiles(),
      mimeType: "image/png",
    });

    return await new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(blob);
    });
  };

  // Expose exportCanvas() to parent
  useImperativeHandle(ref, () => ({
  exportCanvas,
}));

console.log("Canvas mounted");

  return (
    <div className="h-full">
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPI.current = api;
        }}
        theme="light"
        autoFocus={false}
        onChange={(elements) => setWhiteBoardData(elements)}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: {
              saveFileToDisk: true,
            },
          },
        }}
      >
        <MainMenu>
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>

        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint />
          <WelcomeScreen.Hints.ToolbarHint />
          <WelcomeScreen.Center>
            <WelcomeScreen.Center.MenuItemHelp />
          </WelcomeScreen.Center>
        </WelcomeScreen>
      </Excalidraw>
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
