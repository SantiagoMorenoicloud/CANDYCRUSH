// controllers/ventaController.js
import { pool } from "../config/db.js";
import {
  actualizarVenta,
  crearVenta,
  eliminarVenta,
  obtenerVentaPorId,
  obtenerVentas
} from "../models/ventaModel.js";

export const getVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVentaById = async (req, res) => {
  try {
    const venta = await obtenerVentaPorId(req.params.id);
    if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postVenta = async (req, res) => {
  try {
    const id = await crearVenta(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putVenta = async (req, res) => {
  try {
    const actualizado = await actualizarVenta(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.json({ mensaje: "Venta actualizada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVenta = async (req, res) => {
  try {
    const eliminado = await eliminarVenta(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.json({ mensaje: "Venta eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getVentasPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [ventas] = await pool.query(
      `SELECT v.id, p.nombre_prod AS producto, v.precio, v.cantidad, v.total, v.fecha
       FROM ventas v
       JOIN productos p ON v.producto_id = p.id
       WHERE v.usuario_id = ?
       ORDER BY v.fecha DESC`,
      [id]
    );

    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUltimaCompraPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [[ultima]] = await pool.query(
      `SELECT MAX(fecha) as fecha FROM ventas WHERE usuario_id = ?`,
      [id]
    );

    if (!ultima || !ultima.fecha) {
      return res.status(404).json({ error: "No hay compras registradas" });
    }

    const [ventas] = await pool.query(
      `SELECT v.id, p.nombre_prod AS producto, v.precio, v.cantidad, v.total, v.fecha
       FROM ventas v
       JOIN productos p ON v.producto_id = p.id
       WHERE v.usuario_id = ? AND v.fecha = ?
       ORDER BY v.id ASC`,
      [id, ultima.fecha]
    );

    if (ventas.length === 0) {
      return res.status(404).json({ error: "No se encontró la compra más reciente" });
    }

    // Generar número de factura (ejemplo: FAC-20250619-0012)
    const primeraVenta = ventas[0];
    const fecha = new Date(primeraVenta.fecha);
    const fechaFormato = fecha.toISOString().slice(0, 10).replace(/-/g, ""); // 20250619
    const numeroFactura = `FAC-${fechaFormato}-${String(primeraVenta.id).padStart(4, "0")}`;

    res.json({ factura: numeroFactura, ventas });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
