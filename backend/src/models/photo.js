import mongoose  from "mongoose"

const photoSchema = new mongoose.Schema({

    userId:{
        Types: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },

    comment: {
        type: String,
        require: true,
    },

    imageUrl: {
        type: String,
        require: true,
    },

    publicId: {
        type: String,
        require: true,
    },

    isPublic: {
        type: Boolean,
        default: false,
    },

}, {timestamps: true } )



export default mongoose.model("photo", photoSchema)