// 📁 backend/server.js
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import pqrsRoutes from "./routes/pqrsRoutes.js";
import productoRoutes from "./routes/productos.routes.js";
import userRoutes from "./routes/userRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";

// Configuración para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ✅ Servir archivos estáticos desde frontend/
const frontendPath = path.join(__dirname, "..", "frontend");
app.use(express.static(frontendPath));

// 👇 Esto sirve los archivos estáticos de tu carpeta frontend
app.use(express.static(path.join(__dirname, "../frontend")));


// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/catalogoIndex.html"));
});

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/pqrs", pqrsRoutes);
app.use("/api/citas", citasRoutes);

// Middleware de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
