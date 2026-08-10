"use client"

import React, { useEffect, useRef, useState } from "react"
import EditorJS from "@editorjs/editorjs"
// @ts-ignore
import Header from "@editorjs/header"
// @ts-ignore
import List from "@editorjs/list"
// @ts-ignore
import Checklist from "@editorjs/checklist"
// @ts-ignore
import Paragraph from "@editorjs/paragraph"
// @ts-ignore
import Warning from "@editorjs/warning"
import { Sparkles, Loader2, X } from "lucide-react"

const rawDocument = {
  time: Date.now(),
  blocks: [
    {
      type: "header",
      data: {
        text: "Start writing here...",
        level: 2,
      },
    },
  ],
  version: "2.8.1",
}

function Editor({ onSaveTrigger }: { onSaveTrigger?: any }) {
  const ref = useRef<EditorJS | null>(null)

  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  useEffect(() => {
    initEditor()

    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy()
        ref.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (onSaveTrigger) {
      onSaveDocument()
    }
  }, [onSaveTrigger])

  const initEditor = () => {
    if (ref.current) return

    const editor = new EditorJS({
      holder: "editorjs",
      data: rawDocument,
      tools: {
        header: {
          class: Header as any,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Enter a Header",
          },
        },
        list: {
          class: List as any,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist as any,
          inlineToolbar: true,
        },
        paragraph: Paragraph as any,
        warning: Warning as any,
      },
    })

    ref.current = editor
  }

  const onSaveDocument = () => {
    if (ref.current) {
      ref.current
        .save()
        .then((outputData) => {
          console.log("Saved document:", outputData)
        })
        .catch((error) => {
          console.log("Saving failed:", error)
        })
    }
  }

  // --------------------------------
  // BASIC OWN AI
  // --------------------------------

  const generateBasicAIResponse = (prompt: string) => {
    const text = prompt.toLowerCase()

    if (text.includes("summarize") || text.includes("summary")) {
      return "This document contains the main ideas provided by the user. The content can be organized into clear sections, highlighting the most important information while removing unnecessary details."
    }

    if (
      text.includes("introduction") ||
      text.includes("intro")
    ) {
      return "Introduction\n\nThis section introduces the topic, explains its importance, and provides the necessary background information for understanding the subject."
    }

    if (
      text.includes("conclusion") ||
      text.includes("conclude")
    ) {
      return "Conclusion\n\nIn conclusion, the discussed concepts provide a clear understanding of the topic. The key ideas can be applied to develop practical and effective solutions."
    }

    if (
      text.includes("project") ||
      text.includes("software")
    ) {
      return "Project Overview\n\nThis project focuses on developing a practical software solution that improves productivity, collaboration, and user experience through modern technologies."
    }

    if (
      text.includes("features") ||
      text.includes("feature")
    ) {
      return "Key Features\n\n• User-friendly interface\n• Real-time collaboration\n• Document editing\n• Intelligent assistance\n• Secure data management"
    }

    if (
      text.includes("paragraph") ||
      text.includes("write")
    ) {
      return "This paragraph provides a clear and structured explanation of the requested topic. The information is presented in a simple and readable manner so that users can easily understand the main concept."
    }

    return `${prompt}`
  }

  const handleAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt.")
      return
    }

    if (!ref.current) {
      alert("Editor is not ready yet.")
      return
    }

    try {
      setAiLoading(true)

      const generatedText = generateBasicAIResponse(aiPrompt)

      await ref.current.isReady

      ref.current.blocks.insert("paragraph", {
        text: generatedText.replace(/\n/g, "<br>"),
      })

      setAiPrompt("")
      setIsPopupOpen(false)
    } catch (error) {
      console.error("AI generation failed:", error)
    } finally {
      setAiLoading(false)
    }
  }
  

return (
  <div className="relative w-full">
    {/* EDITOR */}
    <div
      id="editorjs"
      className="min-h-[500px] w-full"
    />

    {/* FLOATING AI CHAT/POPUP */}
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* POPUP BOX */}
      {isPopupOpen && (
        <div className="mb-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-all sm:w-96">
          
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
              </div>

              <h3 className="text-xs font-semibold leading-none text-gray-900">
                Diagramly AI
              </h3>
            </div>

            <button
              onClick={() => setIsPopupOpen(false)}
              className="text-gray-400 transition hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* INPUT */}
          <div className="p-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAI()
                }
              }}
              placeholder="Ask Diagramly AI to write something..."
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {/* GENERATE BUTTON */}
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleAI}
                disabled={aiLoading}
                className="flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING AI BUTTON */}
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        title="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    </div>
  </div>
)
}

export default Editor
