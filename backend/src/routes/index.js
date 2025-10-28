import { Router } from "express";

// AUTH ROUTES IMPORTS...
import authRoutes from "./auth.js";

const router = Router();

// Define a simple route for testing
router.get("/", (req, res) => {
  res.send("API is running...");
});

// AUTH ROUTES...
router.use("/auth", authRoutes);

export default router;