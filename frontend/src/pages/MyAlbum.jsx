import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios";
import OpenImage from '../components/OpenImage';
import { Image } from "lucide-react";

export default function MyAlbum() {

    const Navigate = useNavigate()
    const [photos, setPhotos] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)


    //load user photo
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await api.get('/photos/my-photos')
                setPhotos(res.data)
            } catch (error) {
                console.assert(error.message)
            }
        }
        fetchPhotos()
    }, [])

    const toggleVisibility = async (id) => {
        try {
            const res = await api.patch(`/photos/${id}/toggle`);
            setPhotos(photos.map((p) => (p._id === id ? res.data : p)));
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    const deletePhoto = async (id) => {
        try {
            let sure = confirm("Are you sure to delete this photo ?") 
            if(!sure) return
            await api.delete(`/photos/${id}`);
            setPhotos(photos.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Error al eliminar foto:", error.response?.data || error.message);
        }
    };

    const expandImage = ({imageUrl, comment }) => {
        setSelectedImage({imageUrl, comment})
    }

    const closeImage = () => {
        setSelectedImage(null)
    }



    return (

        <div className="p-6">
            <h2 className="text-2xl font-bold mb-10">My Album</h2>
            <button
                type='button'
                className="mb-10 px-5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer shadow-sm"
                onClick={() => Navigate("/MyAlbum/UploadPhoto")}
            >
                Upload Image
            </button>
            {photos.length === 0 ? (
                <div className='flex flex-col items-center gap-20 '>
                    <p className='p-3 bg-white/50 rounded text-gray-500 font-semibold text-center flex item-center w-full'>You don't have images or photos to show </p>
                    <Image className="opacity-20" size={200} />
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-5">
                    {photos.map((photo) => (
                        <div key={photo._id} className=" rounded shadow-md">
                            
                               <div className="w-full h-64 flex justify-center items-center bg-white/30">
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.comment}
                                    className="max-w-full max-h-full object-contain cursor-pointer"
                                    onClick={() => expandImage({imageUrl: photo.imageUrl, comment: photo.comment})}
                                />
                            </div>
                            
                            <div className="py-4 px-3 bg-white ">
                                <p className="text-m mt-1 ">{photo.comment}</p>
                                <small className="block mt-2">
                                    {photo.isPublic ? "🌍 Public" : "🔒 Private"}
                                </small>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => toggleVisibility(photo._id)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-900"
                                    >
                                        Change visivility
                                    </button>
                                    <button
                                        onClick={() => deletePhoto(photo._id)}
                                        className="bg-gray-400 text-white px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
              {selectedImage && (
                <OpenImage 
                imageUrl={selectedImage.imageUrl}
                comment={selectedImage.comment}
                closeImage={closeImage} 
                
                />)}
        </div>
    )
}
