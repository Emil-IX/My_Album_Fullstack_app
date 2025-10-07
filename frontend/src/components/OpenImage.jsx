

export default function OpenImage({ imageUrl, comment, closeImage }) {
    return (
        <div
            onClick={() => closeImage(false)}
             className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-25"
            >
            <img
                src={imageUrl}
                alt={comment}
                className="max-w-full max-h-full object-contain"
                />
        </div>
    )
}
