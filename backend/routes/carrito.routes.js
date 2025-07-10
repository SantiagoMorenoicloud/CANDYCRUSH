import { Router } from "express";
import {
    agregarAlCarrito,
    confirmarCompra,
    eliminarDelCarrito,
    obtenerCarrito
} from "../controllers/carrito.controller.js";

const router = Router();

// Agregar producto al carrito
router.post("/", agregarAlCarrito);

// Obtener carrito por usuario
router.get("/:usuario_id", obtenerCarrito);

// Eliminar un ítem del carrito
router.delete("/:id", eliminarDelCarrito);

// Confirmar compra y registrar en ventas
router.post("/confirmar", confirmarCompra);

export default router;
