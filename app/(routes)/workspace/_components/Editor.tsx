"use client"

import React, { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
// @ts-ignore
import Header from '@editorjs/header'
// @ts-ignore
import List from "@editorjs/list"
// @ts-ignore
import Checklist from '@editorjs/checklist'
// @ts-ignore
import Paragraph from '@editorjs/paragraph'
// @ts-ignore
import Warning from '@editorjs/warning'

const rawDocument = {
  time: Date.now(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Start writing here...',
        level: 2
      }
    }
  ],
  version: "2.8.1"
}

function Editor({ onSaveTrigger }: { onSaveTrigger?: any }) {

  const ref = useRef<EditorJS | null>(null)

  useEffect(() => {
    initEditor()
  }, [])

  useEffect(() => {
    if (onSaveTrigger) {
      onSaveDocument()
    }
  }, [onSaveTrigger])

  const initEditor = () => {
    if (ref.current) return

    const editor = new EditorJS({
      holder: 'editorjs',
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
      ref.current.save().then((outputData) => {
        console.log("Saved document:", outputData)
      }).catch((error) => {
        console.log('Saving failed:', error)
      })
    }
  }

  return (
    <div>
      <div id='editorjs' className='ml-20'></div>
    </div>
  )
}

export default Editor

