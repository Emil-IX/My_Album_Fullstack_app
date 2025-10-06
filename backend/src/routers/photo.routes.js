import { Router } from 'express';
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authMiddleware } from "../middlewares/auth.js";
import { Photo } from '../models/photo.js';






const router = Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /photos/upload:
 *   post:
 *     summary: Sube una nueva imagen al servidor y la almacena en Cloudinary.
 *     description: 
 *       Este endpoint permite al usuario autenticado subir una imagen. 
 *       La imagen se guarda en Cloudinary y se crea un registro en la base de datos 
 *       con el comentario, el estado de visibilidad (público o privado) y el usuario asociado.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requiere autenticación mediante token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen que se desea subir.
 *               comment:
 *                 type: string
 *                 example: "Foto de perfil actualizada."
 *                 description: Comentario asociado a la imagen.
 *               isPublic:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "true"
 *                 description: Define si la imagen será pública o privada.
 *     responses:
 *       201:
 *         description: Imagen subida y registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6718ab23e8a72b9c1d56a4e3"
 *                 userId:
 *                   type: string
 *                   example: "6718ab23e8a72b9c1d56a4e2"
 *                 comment:
 *                   type: string
 *                   example: "Foto de perfil actualizada."
 *                 imageUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v1234567/user_photos/image.jpg"
 *                 publicId:
 *                   type: string
 *                   example: "user_photos/abc123xyz"
 *                 isPublic:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Error en la solicitud o datos inválidos.
 *       401:
 *         description: No autorizado. El token JWT es inválido o no fue proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */


//upload image
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_photos",
    });

    const newPhoto = await Photo.create({
      userId: req.user.id,
      comment: req.body.comment,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      isPublic: req.body.isPublic === "true",
    });

    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



/**
 * @swagger
 * /photos/my-photos:
 *   get:
 *     summary: Obtiene todas las fotos del usuario autenticado.
 *     description: 
 *       Este endpoint devuelve todas las fotos subidas por el usuario actualmente autenticado.
 *       Requiere un token JWT válido.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requiere autenticación con JWT
 *     responses:
 *       200:
 *         description: Lista de fotos del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6718ab23e8a72b9c1d56a4e3"
 *                   userId:
 *                     type: string
 *                     example: "6718ab23e8a72b9c1d56a4e2"
 *                   comment:
 *                     type: string
 *                     example: "Foto del fin de semana."
 *                   imageUrl:
 *                     type: string
 *                     example: "https://res.cloudinary.com/demo/image/upload/v1234567/user_photos/image.jpg"
 *                   publicId:
 *                     type: string
 *                     example: "user_photos/abc123xyz"
 *                   isPublic:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado. El token JWT es inválido o no fue proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */


// get photo from current auth user
router.get("/my-photos", authMiddleware, async (req, res) => {
    try {
        const photos = await Photo.find({ userId: req.user.id });
        res.json(photos);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


/**
 * @swagger
 * /photos/public:
 *   get:
 *     summary: Obtiene todas las fotos públicas.
 *     description: 
 *       Este endpoint devuelve todas las fotos que han sido marcadas como públicas por los usuarios.
 *       Cada foto incluye la información básica del usuario que la publicó (solo el correo electrónico).
 *     tags:
 *       - Photos
 *     responses:
 *       200:
 *         description: Lista de todas las fotos públicas disponibles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6718ab23e8a72b9c1d56a4e3"
 *                   userId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6718ab23e8a72b9c1d56a4e2"
 *                       email:
 *                         type: string
 *                         example: "usuario@example.com"
 *                     description: Información del usuario propietario de la foto.
 *                   comment:
 *                     type: string
 *                     example: "Atardecer en la playa 🌅"
 *                   imageUrl:
 *                     type: string
 *                     example: "https://res.cloudinary.com/demo/image/upload/v1234567/user_photos/image.jpg"
 *                   publicId:
 *                     type: string
 *                     example: "user_photos/abc123xyz"
 *                   isPublic:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor.
 */

// get all public photos
router.get("/public", async (req, res) => {
    try {
        const photos = await Photo.find({ isPublic: true }).populate("userId", "name");
        res.json(photos);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/**
 * @swagger
 * /photos/{id}/toggle:
 *   patch:
 *     summary: Cambia la visibilidad (público/privado) de una foto del usuario autenticado.
 *     description: 
 *       Este endpoint permite alternar el estado de visibilidad (`isPublic`) de una foto específica.
 *       Solo el propietario de la foto puede modificarla.  
 *       Si la foto estaba pública, pasará a privada y viceversa.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requiere autenticación con JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la foto que se desea modificar.
 *         example: "6718ab23e8a72b9c1d56a4e3"
 *     responses:
 *       200:
 *         description: Estado de visibilidad actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6718ab23e8a72b9c1d56a4e3"
 *                 userId:
 *                   type: string
 *                   example: "6718ab23e8a72b9c1d56a4e2"
 *                 comment:
 *                   type: string
 *                   example: "Mi nueva foto de perfil."
 *                 imageUrl:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v1234567/user_photos/image.jpg"
 *                 publicId:
 *                   type: string
 *                   example: "user_photos/abc123xyz"
 *                 isPublic:
 *                   type: boolean
 *                   example: false
 *                   description: Nuevo estado de visibilidad tras el cambio.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: No autorizado. El token JWT es inválido o no fue proporcionado.
 *       404:
 *         description: No se encontró la foto o no pertenece al usuario autenticado.
 *       500:
 *         description: Error interno del servidor.
 */


//change visibility photo
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id, userId: req.user.id });
        if (!photo) return res.status(404).json({ message: "Not faund" });

        photo.isPublic = !photo.isPublic;
        await photo.save();
        res.json(photo);


    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})


/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Elimina una foto del usuario autenticado.
 *     description: 
 *       Este endpoint permite eliminar una foto específica perteneciente al usuario autenticado.  
 *       La foto se elimina tanto de la base de datos como de Cloudinary usando su `publicId`.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requiere autenticación con JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la foto que se desea eliminar.
 *         example: "6718ab23e8a72b9c1d56a4e3"
 *     responses:
 *       200:
 *         description: Foto eliminada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo was deleted"
 *       401:
 *         description: No autorizado. El token JWT es inválido o no fue proporcionado.
 *       404:
 *         description: No se encontró la foto o no pertenece al usuario autenticado.
 *       500:
 *         description: Error interno del servidor.
 */

//Delete photo
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const photo = await Photo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!photo) return res.status(404).json({ message: "Not found" });

        await cloudinary.uploader.destroy(photo.publicId);
        res.json({ message: "photo was eliminated" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



export default router