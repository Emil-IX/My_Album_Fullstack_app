import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PublicGallery() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await api.get("/photos/public");
                setPhotos(response.data);
            } catch (error) {
                console.error("Error fetching public photos:", error);
            }
        };
        fetchPhotos();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Public Gallery</h2>
            <div className="grid grid-cols-4 gap-5">
                {photos.map((photo) => (
                    <div key={photo._id} className="rounded shadow-md">
                        <div className="w-full h-64 flex justify-center items-center bg-white/30">
                            <img
                                src={photo.imageUrl}
                                alt={photo.comment}
                                className="max-w-full max-h-full object-contain"
                            />

                        </div>
                        <div className="p-5 bg-white">
                            <p>{photo.comment}</p>
                            <small className="font-bold">Owner - <span className="text-gray-500 font-semibold">{photo.userId?.name}</span> </small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
