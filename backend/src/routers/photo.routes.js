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
 *     summary: Upload a new image to the server and store it in Cloudinary.
 *     description: 
 *       This endpoint allows the authenticated user to upload an image.
 *       The image is saved to Cloudinary, and a record is created in the database
 *       with the comment, visibility status (public or private), and the associated user.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   #Requires authentication via JWT token
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
 *                 description: Image you want to upload.
 *               comment:
 *                 type: string
 *                 example: "Updated profile picture."
 *                 description: Comment associated with the image.
 *               isPublic:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "true"
 *                 description: Define whether the image will be public or private.
 *     responses:
 *       201:
 *         description: Image uploaded and registered successfully.
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
 *                   example: "Updated profile picture."
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
 *         description: Request error or invalid data.
 *       401:
 *         description: Unauthorized. The JWT token is invalid or was not provided.
 *       500:
 *         description: Internal Server Error.
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
 *     summary: Gets all photos of the authenticated user.
 *     description: 
 *       This endpoint returns all photos uploaded by the currently authenticated user.
 *       Requires a valid JWT token.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requires authentication with JWT
 *     responses:
 *       200:
 *         description: List of photos of the authenticated user.
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
 *         description: Unauthorized. The JWT token is invalid or was not provided.
 *       500:
 *         description: Internal Server Error.
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
 *     summary: Get all public photos.
 *     description: 
 *       This endpoint returns all photos that have been marked as public by users.
 *        Each photo includes basic information about the user who posted it (email only).
 *     tags:
 *       - Photos
 *     responses:
 *       200:
 *         description: List of all available public photos.
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
 *                         example: "user@example.com"
 *                     description: Information about the user who owns the photo.
 *                   comment:
 *                     type: string
 *                     example: "Sunset on the beach 🌅"
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
 *         description: Internal Server Error
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
 * /photos/no-user:
 *   get:
 *     summary: Get all photos without user
 *     description: 
 *       This endpoint returns all photos that have been marked as public by users that do not exist.
 *        Each photo includes basic information about the user who posted it (email only).
 *     tags:
 *       - Photos
 *     responses:
 *       200:
 *         description: List of all available public photos without users.
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
 *                     type: null
 *                     example: null
 *                   comment:
 *                     type: string
 *                     example: "Sunset on the beach"
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
 *       404:
 *         description: Not Faund
 *       500:
 *         description: Internal Server Error
 */

//get all photos without user
router.get("/no-user" , async (req, res)=> {
    try {
         const photos = await Photo.find().populate("userId", "name").lean()


        const photosWithOurUsers = photos.filter( photo => photo.userId === null )

        if(photosWithOurUsers.length == 0) res.status(404).json({ message:'Not faund'})
        res.json(photosWithOurUsers)
        
    } catch (error) {
        res.status(500).json({ message:'internal server error'})
    }
})


/**
 * @swagger
 * /photos/{id}/toggle:
 *   patch:
 *     summary: Changes the visibility (public/private) of a photo of the authenticated user.
 *     description: 
 *      This endpoint allows you to toggle the visibility status (`isPublic`) of a specific photo.
 *      Only the owner of the photo can edit it.
 *      If the photo was public, it will become private, and vice versa.
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requires authentication with JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the photo you want to modify.
 *         example: "6718ab23e8a72b9c1d56a4e3"
 *     responses:
 *       200:
 *         description: Visibility status updated successfully.
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
 *                   description: New visibility status after the change.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized. The JWT token is invalid or was not provided.
 *       404:
 *         description: The photo was not found or does not belong to the authenticated user.
 *       500:
 *         description: Internal Server Error.
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
 *     summary: Deletes a photo of the authenticated user.
 *     description: 
 *       This endpoint allows you to delete a specific photo belonging to the authenticated user.
 *       The photo is deleted from both the database and Cloudinary using its public ID.
 *       
 *     tags:
 *       - Photos
 *     security:
 *       - bearerAuth: []   # Requires authentication with JWT
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the photo you want to delete.
 *         example: "6718ab23e8a72b9c1d56a4e3"
 *     responses:
 *       200:
 *         description: Photo successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Photo was deleted"
 *       401:
 *         description: Unauthorized. The JWT token is invalid or was not provided.
 *       404:
 *         description: The photo was not found or does not belong to the authenticated user.
 *       500:
 *         description: Internal Server Error.
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