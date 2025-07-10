import { Router } from "express";
import {
    actualizarEstadoCita,
    cancelarCitaUsuario,
    horasOcupadas,
    listarCitasAdmin,
    listarCitasUsuario,
    registrarCita
} from "../controllers/citasController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// ✅ Usuario logueado
router.post("/", verifyToken, registrarCita);
router.get("/", verifyToken, listarCitasUsuario);
router.get("/ocupadas/:fecha", verifyToken, horasOcupadas);
router.put("/cancelar/:id", verifyToken, cancelarCitaUsuario);

// ✅ Nuevas rutas para el administrador
router.get("/admin", verifyToken, listarCitasAdmin);        // ver todas las citas
router.put("/:id", verifyToken, actualizarEstadoCita);      // cambiar estado: Resuelto/Cancelado

export default router;

