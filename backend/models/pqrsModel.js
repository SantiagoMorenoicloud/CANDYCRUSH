import { pool } from "../config/db.js";

export const crearPQRS = async (usuario_id, tipo, asunto, mensaje) => {
  const [res] = await pool.query(
    "INSERT INTO pqrs (usuario_id, tipo, asunto, mensaje) VALUES (?, ?, ?, ?)",
    [usuario_id, tipo, asunto, mensaje]
  );
  return res.insertId;
};

export const obtenerPQRSporUsuario = async (usuario_id) => {
  const [rows] = await pool.query("SELECT * FROM pqrs WHERE usuario_id = ?", [usuario_id]);
  return rows;
};

export const responderPQRS = async (id, respuesta) => {
  await pool.query(
    "UPDATE pqrs SET respuesta = ?, estado = 'Resuelto', fecha_respuesta = NOW() WHERE id = ?",
    [respuesta, id]
  );
};
export const listarTodasPQRS = async () => {
  const [rows] = await pool.query(
    `SELECT p.*, u.nombre AS usuario FROM pqrs p JOIN usuarios u ON p.usuario_id = u.id`
  );
  return rows;
};