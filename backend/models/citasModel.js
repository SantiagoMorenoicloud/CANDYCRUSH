import { pool } from "../config/db.js";

export const crearCita = async (usuario_id, fecha, hora, motivo) => {
  const [res] = await pool.query(
    `INSERT INTO citas (usuario_id, fecha, hora, motivo) VALUES (?, ?, ?, ?)`,
    [usuario_id, fecha, hora, motivo]
  );
  return res.insertId;
};

export const obtenerCitasUsuario = async (usuario_id) => {
  const [rows] = await pool.query(
    `SELECT * FROM citas WHERE usuario_id = ? ORDER BY fecha, hora`,
    [usuario_id]
  );
  return rows;
};

export const obtenerCitasPorFecha = async (fecha) => {
  const [rows] = await pool.query(
    `SELECT hora FROM citas WHERE fecha = ?`,
    [fecha]
  );
  return rows;
};

export const cancelarCita = async (id, usuario_id) => {
  await pool.query(
    `UPDATE citas SET estado = 'cancelada' WHERE id = ? AND usuario_id = ?`,
    [id, usuario_id]
  );
};

// ✅ Obtener todas las citas con datos del usuario
export const obtenerTodasLasCitas = async () => {
  const [rows] = await pool.query(`
    SELECT c.id, c.fecha, c.hora, c.motivo, c.estado, u.nombre AS usuario
    FROM citas c
    JOIN usuarios u ON c.usuario_id = u.id
    ORDER BY c.fecha, c.hora
  `);
  return rows;
};

// ✅ Actualizar estado de una cita por ID (para el admin)
export const actualizarEstado = async (id, estado) => {
  await pool.query(
    `UPDATE citas SET estado = ? WHERE id = ?`,
    [estado, id]
  );
};
