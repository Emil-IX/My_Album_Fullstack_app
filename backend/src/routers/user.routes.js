import { Router } from "express";
import { User } from "../models/users.js";
import { createUserValidator, idValidator, updateUserValidator } from "../validators/user.validators.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.js";
import bcrypt from "bcryptjs";
import { authorize } from "../middlewares/authorize.js";


const router = Router();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized (missing token or invalid token)
 *       403:
 *         description: Access denied (admin only)
 *       500:
 *         description: Error getting users
 */

router.get('/', authMiddleware, authorize('admin') ,async (req, res) => {
  try{
    const users = await User.find()
    res.json(users)

  } catch(error){{
    res.status(500).json({ error:"Error to get users" })
  }}
})


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (admin or the user itself)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Error getting user
 */
router.get('/:id',authMiddleware, authorize('admin','user'),idValidator , validate,async (req, res) =>{
  try {
    
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('User not found')
      res.json(user)
  } catch (error) {
    res.status(500).json({ error:"Error to get user by ID" })
  }
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Emil IXs
 *               email:
 *                 type: string
 *                 example: emilixs@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234567
 *               age:
 *                 type: integer
 *                 example: 1999-01-01
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Error creating user
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.post('/' ,authMiddleware, authorize('admin'),createUserValidator, validate ,async (req, res) => {
try {

  const { name , email, password, age, role } = req.body

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash( password, salt)

  const newUser= new User({ name, email, password: hashedPassword, age, role  })
  await newUser.save()
  res.status(201).json(newUser)

} catch (error) {
  res.status(400).json({ error:"Error to create user" })
}
})


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pedro Gómez
 *               age:
 *                 type: integer
 *                 example: 30
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Update failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.put('/:id',authMiddleware,authorize('admin'),idValidator,updateUserValidator, validate, async (req, res) => {
  try {
    const UpdateUser = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true })
    res.json(UpdateUser)
  } catch (error) {
    res.status(400).json({ error:"Error to update user" })
  }
})


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting user
 */
router.delete('/:id', authMiddleware, authorize('admin') ,idValidator, validate, async (req, res) => {
 try {
  const deletedUser = await User.findByIdAndDelete(req.params.id)
  if(!deletedUser) return res.status(404).send('User not found')
    res.json(deletedUser)
 } catch (error) {
  res.status(500).json({ error:"Error to delete user" })
 }
})


export default router;