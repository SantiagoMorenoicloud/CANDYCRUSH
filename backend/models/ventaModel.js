import { pool } from "../config/db.js";

export const obtenerVentas = async () => {
  const [rows] = await pool.query(`
    SELECT v.id, p.nombre_prod AS producto, u.nombre AS usuario, v.precio, v.cantidad, v.total, v.fecha
    FROM ventas v
    JOIN productos p ON v.producto_id = p.id
    JOIN usuarios u ON v.usuario_id = u.id
  `);
  return rows;
};

export const crearVenta = async (venta) => {
  const { producto_id, usuario_id, cantidad } = venta;

  // 1. Obtener precio actual del producto
  const [[producto]] = await pool.query("SELECT precio, stock FROM productos WHERE id = ?", [producto_id]);
  if (!producto) throw new Error("producto no encontrado");
  if (producto.stock < cantidad) throw new Error("Stock insuficiente");

  const precio = producto.precio;
  const total = precio * cantidad;

  // 2. Insertar la venta
  const [result] = await pool.query(
    "INSERT INTO ventas (producto_id, usuario_id, precio, cantidad, total) VALUES (?, ?, ?, ?, ?)",
    [producto_id, usuario_id, precio, cantidad, total]
  );

  // 3. Actualizar stock
  await pool.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [cantidad, producto_id]);

  return result.insertId;
};

export const obtenerVentaPorId = async (id) => {
  const [rows] = await pool.query("SELECT * FROM ventas WHERE id = ?", [id]);
  return rows[0];
};

export const actualizarVenta = async (id, venta) => {
  // ❗ Opcional: podrías recalcular total y ajustar stock, pero para simplicidad lo dejamos fijo
  const { producto_id, usuario_id, cantidad } = venta;

  const [[producto]] = await pool.query("SELECT precio FROM productos WHERE id = ?", [producto_id]);
  const precio = producto.precio;
  const total = precio * cantidad;

  const [result] = await pool.query(
    "UPDATE ventas SET producto_id = ?, usuario_id = ?, precio = ?, cantidad = ?, total = ? WHERE id = ?",
    [producto_id, usuario_id, precio, cantidad, total, id]
  );
  return result.affectedRows;
};

export const eliminarVenta = async (id) => {
  // 1. Obtener la venta
  const [ventaRows] = await pool.query("SELECT producto_id, cantidad FROM ventas WHERE id = ?", [id]);
  if (ventaRows.length === 0) return 0;
  const { producto_id, cantidad } = ventaRows[0];

  // 2. Eliminar la venta
  const [result] = await pool.query("DELETE FROM ventas WHERE id = ?", [id]);

  // 3. Devolver al stock
  await pool.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [cantidad, producto_id]);

  return result.affectedRows;
};

