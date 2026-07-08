"use client"

import React from 'react'
import Header from './_components/Header'
import FileList from './_components/FileList'


function Dashboard() {

  return (
    <div className='p-8'>
      <Header />

      <FileList />

      <AdBanner
        data-ad-slot="4796371341"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default Dashboard
