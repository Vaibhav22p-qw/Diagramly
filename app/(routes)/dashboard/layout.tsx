"use client"

import React, { useState } from 'react'
import SideNav from './_components/SideNav'
import { FileListContext } from '@/app/_context/FilesListContext'

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [fileList_, setFileList_] = useState<any[]>([])

  return (
    <div>
      <FileListContext.Provider value={{ fileList_, setFileList_ }}>
        <div className='grid grid-cols-4'>
          
          <div className='bg-white h-screen w-72 fixed'>
            <SideNav />
          </div>

          <div className='col-span-4 ml-72'>
            {children}
          </div>

        </div>
      </FileListContext.Provider>
    </div>
  )
}

export default DashboardLayout