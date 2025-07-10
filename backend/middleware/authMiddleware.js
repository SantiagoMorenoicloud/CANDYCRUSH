import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token, "secreto123");
    req.userId = decoded.id;

    // 🔧 Aquí obtenemos los datos del usuario desde la BD (incluyendo el rol)
    const [rows] = await pool.query("SELECT id, nombre, correo, id_rol FROM usuarios WHERE id = ?", [decoded.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    req.usuario = rows[0]; // Esto hace que funcione req.usuario.id_rol
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
