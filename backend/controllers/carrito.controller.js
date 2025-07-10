import { pool } from "../config/db.js";

// ✅ Agregar al carrito con control de duplicados
export const agregarAlCarrito = async (req, res) => {
  try {
    const { producto_id, cantidad, usuario_id } = req.body;

    const [productos] = await pool.query("SELECT stock FROM productos WHERE id = ?", [producto_id]);
    if (productos.length === 0) return res.status(404).json({ error: "producto no encontrado" });

    const stock = productos[0].stock;

    const [existente] = await pool.query(
      "SELECT id, cantidad FROM carrito WHERE producto_id = ? AND usuario_id = ?",
      [producto_id, usuario_id]
    );

    if (existente.length > 0) {
      const nuevaCantidad = existente[0].cantidad + cantidad;
      if (nuevaCantidad > stock) {
        return res.status(400).json({ error: "Cantidad total excede el stock disponible" });
      }

      await pool.query(
        "UPDATE carrito SET cantidad = ? WHERE id = ?",
        [nuevaCantidad, existente[0].id]
      );
    } else {
      if (cantidad > stock) return res.status(400).json({ error: "Stock insuficiente" });

      await pool.query(
        "INSERT INTO carrito (producto_id, cantidad, usuario_id) VALUES (?, ?, ?)",
        [producto_id, cantidad, usuario_id]
      );
    }

    res.status(200).json({ mensaje: "producto agregado al carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Obtener el carrito con total
export const obtenerCarrito = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const [items] = await pool.query(
      `SELECT c.id, p.nombre_prod, p.precio, c.cantidad, (p.precio * c.cantidad) AS subtotal
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );
    const total = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);
    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Eliminar producto del carrito
export const eliminarDelCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM carrito WHERE id = ?", [id]);
    res.json({ mensaje: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Confirmar compra con transacciones
export const confirmarCompra = async (req, res) => {
  const { usuario_id } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [items] = await conn.query(
      `SELECT c.producto_id, c.cantidad, p.precio FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = ?`,
      [usuario_id]
    );

    if (items.length === 0) {
      await conn.release();
      return res.status(400).json({ error: "Carrito vacío" });
    }

    for (const item of items) {
      const total = item.precio * item.cantidad;

      await conn.query(
        `INSERT INTO ventas (producto_id, usuario_id, precio, cantidad, total) VALUES (?, ?, ?, ?, ?)`,
          [item.producto_id, usuario_id, item.precio, item.cantidad, total]
      );


      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [item.cantidad, item.producto_id]
      );
    }

    await conn.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);
    await conn.commit();
    res.json({ mensaje: "Compra confirmada" });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: "Error al confirmar la compra: " + error.message });
  } finally {
    conn.release();
  }
};
