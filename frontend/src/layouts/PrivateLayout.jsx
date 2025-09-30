import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"

export default function PrivateLayout() {
    return (
        <div className='PrincipalContent' style={{display:"flex"}}>
            <Sidebar/>
            <div style={{flex: 1 }}>
                
                {/* Aqui va el header */}
                <main style={{ padding: "20px"}}>
                        <Outlet/>
                </main>

            </div>
        </div>
    )
}
