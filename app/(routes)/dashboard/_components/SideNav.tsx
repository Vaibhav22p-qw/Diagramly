import React, { useState } from 'react'
import SideNavTopSection, { TEAM } from './SideNavTopSection'
import SideNavBottomSection from './SideNavBottomSection'

function SideNav() {
  const [activeTeam, setActiveTeam] = useState<TEAM | any>()
  const [totalFiles, setTotalFiles] = useState<number>(0)

  const onFileCreate = (fileName: string) => {
    console.log("File created:", fileName)
    setTotalFiles(prev => prev + 1)
  }

  return (
    <div
      className='h-screen fixed w-72 border-r border-[1px] p-6 flex flex-col'
    >
      <div className='flex-1'>
        <SideNavTopSection
          user={null}
          setActiveTeamInfo={(team: TEAM) => setActiveTeam(team)}
        />
      </div>

      <div>
        <SideNavBottomSection
          totalFiles={totalFiles}
          onFileCreate={onFileCreate}
        />
      </div>
    </div>
  )
}

export default SideNav