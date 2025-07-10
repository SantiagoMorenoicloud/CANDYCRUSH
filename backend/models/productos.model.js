import { pool } from "../config/db.js";

export const getLibroById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio FROM productos WHERE id = ?`,
    [id]
  );
  return rows[0]; // puede ser undefined si no existe
};

// Obtener todos los productos con nombre de marca y categoría
export const getAllProductos = async () => {
  const [rows] = await pool.query(`
    SELECT productos.*, marcas.nombre AS marca, categorias.nombre AS categoria
    FROM productos
    JOIN marcas ON productos.marca_id = marcas.id
    JOIN categorias ON productos.categoria_id = categorias.id
  `);
  return rows;
};

// Crear un nuevo libro
export const createProducto = async (producto) => {
  const { nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio } = producto;
  const [result] = await pool.query(
    `INSERT INTO productos (nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio]
  );
  return result.insertId;
};

// Actualizar un producto
export const updateProducto = async (id, producto) => {
  const { nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio } = producto;
  const [result] = await pool.query(
    `UPDATE productos SET nombre_prod = ?, marca_id = ?, categoria_id = ?, anio = ?, imagen = ?, stock = ?, precio = ? WHERE id = ?`,
    [nombre_prod, marca_id, categoria_id, anio, imagen, stock, precio, id]
  );
  return result.affectedRows;
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
  return result.affectedRows;
};

// Obtener todos los marcas (id + nombre)
export const getMarcas = async () => {
  const [rows] = await pool.query("SELECT id, nombre FROM marcas");
  return rows;
};

// Obtener todas las categorías (id + nombre)
export const getCategorias = async () => {
  const [rows] = await pool.query("SELECT id, nombre FROM categorias");
  return rows;
};
