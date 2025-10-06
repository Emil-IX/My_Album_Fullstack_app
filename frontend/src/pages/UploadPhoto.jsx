
import { useState } from "react";
import api from "../api/axios";


export default function UploadPhoto() {

    const [image, setImage] = useState(null)
    const [comment, setComment] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!image) return alert("Inser a image or photo")

        const formData = new FormData()
        formData.append("image", image)
        formData.append("comment", comment)
        formData.append("isPublic", isPublic)

        try {
            setLoading(true)
            await api.post("/photos/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            alert("Image was uploaded")
            setComment("")
            setImage(null)
        } catch (err) {
            alert(err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Upload mage</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">

                <div className="flex flex-col items-start gap-2">
                    <label
                        htmlFor="file-upload"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Upload an image here
                    </label>

                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full max-w-sm px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-blue-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0l-4 4m4-4l4 4"
                            />
                        </svg>
                        <span className="text-gray-600 font-medium">Click to upload</span>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="hidden"
                        />
                    </label>

                    {image && (
                        <p className="text-sm text-green-600 mt-1">
                            ✅ {image.name} selected
                        </p>
                    )}
                </div>


                <input
                    type="text"
                    placeholder="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border p-2 rounded"
                />
                <label>
                    <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /> Public
                </label>
                <button disabled={loading} className="bg-blue-500 text-white py-2 rounded">
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>
        </div>
    )
}
