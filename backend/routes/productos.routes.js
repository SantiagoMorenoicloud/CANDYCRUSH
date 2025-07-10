import { Router } from "express";
import * as controller from "../controllers/productos.controller.js";




const router = Router();

// ✅ Rutas específicas primero
router.get("/marcas/lista", controller.getMarcas);
router.get("/categorias/lista", controller.getCategorias);

// ✅ Ruta para obtener un libro por ID (antes que "/")
router.get("/:id", controller.obtenerProductoPorId);



// ✅ Rutas CRUD
router.get("/", controller.getProductos);
router.post("/", controller.createProducto);
router.put("/:id", controller.updateProducto);
router.delete("/:id", controller.deleteProducto);

export default router;

