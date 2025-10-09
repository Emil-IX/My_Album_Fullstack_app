import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {


  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-300 to-purple-200 w-full  text-center'>
        
        <div className='background1 justify-center items-center flex  min-h-screen min-w-screen  '>

        <main >
                <Outlet/>
        </main>
        </div>

</div>
  )
}
