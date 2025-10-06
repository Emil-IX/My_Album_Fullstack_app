import rateLimit from 'express-rate-limit'; 

export const LoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
})