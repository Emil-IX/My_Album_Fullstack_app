import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios";

export default function MyAlbum() {

    const Navigate = useNavigate()
    const [photos, setPhotos] = useState([])


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
            await api.delete(`/photos/${id}`);
            setPhotos(photos.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Error al eliminar foto:", error.response?.data || error.message);
        }
    };



    return (

        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">My Album</h2>
            <button
                type='button'
                className="mb-10 px-5 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => Navigate("/MyAlbum/UploadPhoto")}
            >
                Upload Image
            </button>
            {photos.length === 0 ? (
                <p>No tienes fotos aún.</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {photos.map((photo) => (
                        <div key={photo._id} className="border rounded shadow-md">
                            <img src={photo.imageUrl} alt={photo.comment} className="w-full h-40 object-cover rounded-t" />
                            <div className="p-2">
                                <p className="text-sm">{photo.comment}</p>
                                <small className="block mb-2">
                                    {photo.isPublic ? "🌍 Public" : "🔒 Private"}
                                </small>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleVisibility(photo._id)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Change visivility
                                    </button>
                                    <button
                                        onClick={() => deletePhoto(photo._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
