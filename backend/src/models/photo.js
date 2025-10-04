import mongoose from "mongoose"

const photoSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",                         
        required: true,
    },

    comment: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
    },

    publicId: {
        type: String,
        required: true,
    },

    isPublic: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true })



export const Photo = mongoose.model("photo", photoSchema)