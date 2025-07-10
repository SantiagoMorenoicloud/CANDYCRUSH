// ✅ routes/ventaRoutes.js
import express from "express";
import {
  deleteVenta,
  getUltimaCompraPorUsuario,
  getVentaById,
  getVentas,
  getVentasPorUsuario,
  postVenta,
  putVenta
} from "../controllers/ventaController.js";

import { pool } from "../config/db.js";

const router = express.Router();

// ✅ Ruta de productos (antes de /:id)
router.get("/productos", async (req, res) => {
  try {
    const [productos] = await pool.query("SELECT id, nombre_prod, precio FROM productos");
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener los productos", detalle: err.message });
  }
});

// ✅ Ruta para obtener la última compra
router.get("/usuario/:id/ultima", getUltimaCompraPorUsuario);

// ✅ Ruta para obtener todas las ventas de un usuario
router.get("/usuario/:id", getVentasPorUsuario);

// ✅ CRUD de ventas
router.get("/", getVentas);

// ⚠️ Esta ruta debe ir después de /productos y /usuario/:id
router.get("/:id", getVentaById);
router.post("/", postVenta);
router.put("/:id", putVenta);
router.delete("/:id", deleteVenta);

export default router;




