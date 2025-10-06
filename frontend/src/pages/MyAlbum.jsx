import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyAlbum() {


    const Navigate = useNavigate()   
    return (
        <div>
            <div>MyAlbum</div>
            <button
                type='button'
                 className="px-5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => Navigate("/MyAlbum/UploadPhoto")}
            >
                Upload Image</button>
        </div>
    )
}
