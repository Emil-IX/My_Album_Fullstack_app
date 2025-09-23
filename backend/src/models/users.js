import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    name:{ 
        type: String, 
        required: true,
        trim: true
    },

    age:{ 
        type: Date,
        required: true
    },

    email:{ 
        type: String, 
        required: true, 
        unique: true ,
        trim: true,
        lowercase: true

        },

    password:{
        type: String,
        required: true,
        trim: true
    },

    role:{
        type: String,
        enum:['admin','user'],
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date


    
},{ timestamps: true })


export const User = mongoose.model('User', userSchema);