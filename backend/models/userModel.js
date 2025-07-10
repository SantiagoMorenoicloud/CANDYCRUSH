import { pool } from "../config/db.js";

export const findUserByEmail = async (correo) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return rows[0];
};

export const createUser = async (nombre, correo, contraseña, id_rol = 2) => {
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, correo, contraseña, id_rol) VALUES (?, ?, ?, ?)",
    [nombre, correo, contraseña, id_rol]
  );
  return result.insertId;
};

export const updateUser = async (id, nombre, correo) => {
  await pool.query("UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?", [nombre, correo, id]);
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
};