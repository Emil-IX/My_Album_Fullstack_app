import express from 'express';
import router from './routers/user.routes.js';
import authRouter from './routers/auth.routes.js';
import photoRouter  from "./routers/photo.routes.js"
import { connectDB } from './config/db.js';
import { createInitialAdmin } from './utils/createAdmin.js';
import { corsMiddleware } from './config/cors.js';
import { securityMiddleware } from './middlewares/security.js';
import { swaggerUi, swaggerSpec } from "./swagger.js";


const app = express();


app.use(express.json());
app.disable('x-powered-by');


app.use(corsMiddleware)


 connectDB().then( async() => {
   await createInitialAdmin()
})
 

app.use('/api/auth', authRouter )
app.use('/api/users' , router)
app.use('/api/photos', photoRouter )

//swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));








export default app;