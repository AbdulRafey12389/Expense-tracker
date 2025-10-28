import { Router } from "express";

// AUTH CONTROLLERS...
import register from "../controllers/auth/register.js";
import login from "../controllers/auth/login.js";
import getCurrentUser from "../controllers/auth/getCurrentUser.js";

// MIDDLEWARES...
import authentication from "../middlewares/authentication.js";
import upload from "../middlewares/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authentication, getCurrentUser);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileDataUri, {
      folder: "profile_images", // optional folder in Cloudinary
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
