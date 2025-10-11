
import bcrypt from "bcryptjs";
import { User } from "../models/users.js";

//This module is where the admin is created when the API is activated, 
//it checks if it exists and if not, it creates it.
export const createInitialAdmin = async () =>{

    try {

        const adminExists = await User.findOne({role:'admin'})
        const adminExists2 = await User.findOne({email: 'admin@gmail.com'})

        if (adminExists && adminExists2) {
            console.log('Admin already exist')
            return
        }

        const hashedPassword = await bcrypt.hash(process.env.FIRST_ADMIN_PASSWORD, 10)

        const admin = new User({
            name:"admin 2000",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            age:"1994-08-14"

        })

        await admin.save()

        console.log('Admin was created')
        console.log(`email: ${admin.email}`)
        console.log(`Password: ${process.env.FIRST_ADMIN_PASSWORD}`)

        
    } catch (error) {

        console.log('Error to create an admin' ,error)
        
    }
}