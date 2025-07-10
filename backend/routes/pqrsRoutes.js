import express from "express";
import {
    crearPQRSController,
    listarPQRSUsuario,
    listarTodasPQRS,
    responderPQRSController
} from "../controllers/pqrsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", verifyToken, crearPQRSController);
router.get("/", verifyToken, listarPQRSUsuario);
router.get("/admin", verifyToken, listarTodasPQRS);
router.put("/admin/:id", verifyToken, responderPQRSController);

export default router;