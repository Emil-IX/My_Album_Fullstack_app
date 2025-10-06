import { useState } from "react";
import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

export default function PrivateLayout() {

     const [open, setOpen] = useState(true);

      const contentMarginClass = open ? "ml-56" : "ml-20"; 

    return (
        <div className='flex min-h-screen  bg-gradient-to-b from-blue-300 to-purple-200 w-full '>
            <Sidebar  open={open} setOpen={setOpen} />
            <div className={`flex-1 ${contentMarginClass} transition-all duration-300`}>
                
                {/* Aqui va el header */}
                <main className="p-5  min-h-screen ">
                        <Outlet/>
                </main>

            </div>
        </div>
    )
}
