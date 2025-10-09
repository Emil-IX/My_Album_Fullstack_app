import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import { createUserValidator, loginUserValidator } from '../validators/user.validators.js';
import { validate } from '../middlewares/validate.js';
import { LoginLimiter } from '../config/limiter.js';
import crypto from 'crypto';
import nodemailer from "nodemailer";

const router = Router();



/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registering a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               age:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: The email already exists or the data is invalid.
 *       500:
 *         description: Internal Server Error
 */

//Register router
router.post("/register", createUserValidator, validate, async (req, res) => {

    try {

        const { name, email, password, age } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'This email is already used' })


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({ name, email, password: hashedPassword, age })
        await user.save()



        res.status(201).json({ message: 'User created successfully' })

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exist' })
        }
        res.status(500).json({ message: error.message })
    }


})


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */


//Login router

router.post("/login", LoginLimiter, loginUserValidator, validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })


        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({ token })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: A password reset link has been sent
 *       400:
 *         description: Invalid or unregistered email
 *       500:
 *         description: Internal Server Error
 */

//Forgot-password

router.post('/forgot-password', LoginLimiter, async (req, res) => {

    try {

        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ message: 'Invalid email' })

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        )

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

        const transporter = nodemailer.createTransport({
            /*     service: 'hotmail',
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                } */

            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }

        })

        console.log("Message sent: %s", transporter.messageId)

        await transporter.sendMail({
            from: `"Emilix app" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset - Emilix App",
            html: `
  <div style="background-color:#111827; padding:40px; font-family:Arial, sans-serif;">
    <div style="max-width:500px; margin:auto; background:#1f2937; border-radius:12px; padding:30px; color:#f3f4f6; border:1px solid #374151;">
      
      <h2 style="text-align:center; margin-bottom:20px; color:#fff;">
        🔐 Reset your password
      </h2>

      <p style="font-size:15px; line-height:1.5; color:#d1d5db;">
        We received a request to reset your password for your <b>Emilix App</b> account.
      </p>

      <p style="font-size:15px; line-height:1.5; color:#d1d5db;">
        Click the button below to reset your password:
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a href="${resetUrl}" target="_blank" 
          style="background:#3b82f6; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">
          Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#9ca3af;">
        ⚠️ This link will expire in <b>15 minutes</b>. If you didn’t request this, please ignore this email.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #374151;">

      <p style="text-align:center; font-size:12px; color:#6b7280;">
        &copy; ${new Date().getFullYear()} Emilix App. All rights reserved.
      </p>
    </div>
  </div>
  `
        });


        res.json({ message: 'Password reset link has been sent to your email', resetUrl })

    } catch (err) {

        res.status(500).json({ message: err.message })

    }

})


/**
 * @swagger
 * /auth/forgot-password/{token}:
 *   post:
 *     summary: Reset password with a valid token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Reset token received in the mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NuevaClave123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal Server Error
 */

router.post('/reset-password/:token', async (req, res) => {

    try {

        const { token } = req.params
        const { password } = req.body

        const decoder = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoder.id)

        if (!user) return res.status(404).json({ message: 'User not faund' })

        const salt = bcrypt.genSaltSync(10)
        user.password = bcrypt.hashSync(password, salt)
        await user.save()

        res.json({ message: 'Password has been reset successfully' })



    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})



export default router;