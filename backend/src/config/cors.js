import cors from 'cors';

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
//Cors implementation
export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};



export const corsMiddleware = cors(corsOptions);