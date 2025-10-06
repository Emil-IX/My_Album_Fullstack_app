import { useState } from "react";
import { Home, User, Settings, Image } from "lucide-react";
import { NavLink } from "react-router-dom"

export default function Sidebar() {


    const [open, setOpen] = useState(true);


    return (

        <div className="flex">
            {/* Sidebar */}
            <div
                className={`${open ? "w-55" : "w-20"
                    } bg-gray-900 text-white h-screen p-4 duration-300`}
            >
                {/* Botón para abrir/cerrar */}
                <button
                    onClick={() => setOpen(!open)}
                    className="mb-6 text-gray-300 hover:text-white"
                >
                    {open ? "<" : ">"}
                </button>

                {/* Links */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center mt-3 gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <Home />
                    {open && <span>Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/Gallery"
                    className={({ isActive }) =>
                        `flex items-center mt-3 gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <Image />
                    {open && <span>Public Gallery</span>}
                </NavLink>

                <NavLink
                    to="/MyAlbum"
                    className={({ isActive }) =>
                        `flex items-center mt-3 gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <User />
                    {open && <span>My Album</span>}
                </NavLink>

                <NavLink
                    to="/settings/users"
                    className={({ isActive }) =>
                        `flex items-center mt-3 gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <Settings />
                    {open && <span>Settings</span>}
                </NavLink>

            </div>
        </div>
    )
}
