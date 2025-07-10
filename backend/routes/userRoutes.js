import express from "express";
import { deleteProfile, getProfile, updateProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/perfil", verifyToken, getProfile);
router.put("/perfil", verifyToken, updateProfile);
router.delete("/perfil", verifyToken, deleteProfile);

export default router;