
import bcrypt from "bcryptjs";
import { User } from "../models/users.js";


export const createInitialAdmin = async () =>{

    try {

        const adminExists = await User.findOne({role:'admin'})

        if (adminExists) {
            console.log('Admin already exist')
            return
        }

        const hashedPassword = await bcrypt.hash(process.env.FIRST_ADMIN_PASSWORD, 10)

        const admin = new User({
            name:"admin_GM 2000",
            email: "admin@hotmail.com",
            password: hashedPassword,
            role: "admin",
            age:"08-14-1994"

        })

        await admin.save()

        console.log('Admin was created')
        console.log(`email: ${admin.email}`)
        console.log(`Password: ${process.env.FIRST_ADMIN_PASSWORD}`)

        
    } catch (error) {

        console.log('Error to create an admin' ,error)
        
    }
}