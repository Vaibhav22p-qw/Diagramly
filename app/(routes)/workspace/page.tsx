"use client"

import React, { useState } from 'react'
import dynamic from "next/dynamic"
import WorkspaceHeader from './_components/WorkspaceHeader'

const Editor = dynamic(() => import('./_components/Editor'), { ssr: false })
const Canvas = dynamic(() => import('./_components/Canvas'), { ssr: false })

function Workspace() {
  const [triggerSave, setTriggerSave] = useState(false)

  return (
    <div>
      <WorkspaceHeader onSave={() => setTriggerSave(!triggerSave)} />

      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className='h-screen'>
          <Editor onSaveTrigger={triggerSave} />
        </div>

        <div className='h-screen border-l'>
          <Canvas onSaveTrigger={triggerSave} />
        </div>
      </div>
    </div>
  )
}

export default Workspace
