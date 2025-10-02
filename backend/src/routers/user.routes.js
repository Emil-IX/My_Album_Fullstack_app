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
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado (falta token o token inválido)
 *       403:
 *         description: Acceso denegado (solo admin)
 *       500:
 *         description: Error al obtener los usuarios
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
 *     summary: Obtener un usuario por ID (admin o el mismo usuario)
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
 *         description: Usuario encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener usuario
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
 *     summary: Crear un nuevo usuario (solo admin)
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
 *         description: Usuario creado
 *       400:
 *         description: Error al crear usuario
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
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
 *     summary: Actualizar usuario por ID (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
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
 *         description: Usuario actualizado
 *       400:
 *         description: Error en la actualización
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
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
 *     summary: Eliminar usuario por ID (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al eliminar usuario
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