import React from 'react'
import { Button } from '@/components/ui/button'

export type TEAM = {
  _id?: string
  name?: string
}

function SideNavTopSection({ setActiveTeamInfo }: any) {
  return (
    <div>
      <h2 className="text-lg font-bold">Teams</h2>

      <Button
        onClick={() =>
          setActiveTeamInfo({ _id: "1", name: "Demo Team" })
        }
      >
        Select Demo Team
      </Button>
    </div>
  )
}

export default SideNavTopSection