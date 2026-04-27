import React, { useEffect, useState } from 'react'
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";

function Canvas({ onSaveTrigger }: { onSaveTrigger?: any }) {

  const [whiteBoardData, setWhiteBoardData] = useState<any>()

  useEffect(() => {
    if (onSaveTrigger) {
      console.log("Saved data:", whiteBoardData)
    }
  }, [onSaveTrigger])

  return (
    <div style={{ height: "670px" }}>
      <Excalidraw
        theme='light'
        onChange={(elements) => setWhiteBoardData(elements)}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: {
              saveFileToDisk: true
            }
          }
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
  )
}

export default Canvas