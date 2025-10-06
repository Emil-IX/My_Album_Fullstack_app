import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';    
dotenv.config();

export const connectDB = async () => {
    try{

      const { connection } =  await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });

        const url = `${connection.host}:${connection.port}`;
        console.log(colors.cyan.bold(`MongoDB is connected to: ${url}`));

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1)

    }
}

