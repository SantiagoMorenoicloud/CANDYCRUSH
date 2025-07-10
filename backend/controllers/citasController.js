import {
  actualizarEstado,
  cancelarCita,
  crearCita,
  obtenerCitasPorFecha,
  obtenerCitasUsuario,
  obtenerTodasLasCitas
} from "../models/citasModel.js";

export const registrarCita = async (req, res) => {
  const { fecha, hora, motivo } = req.body;
  const usuario_id = req.userId;

  const id = await crearCita(usuario_id, fecha, hora, motivo);
  res.json({ message: "Cita registrada", id });
};

export const listarCitasUsuario = async (req, res) => {
  const citas = await obtenerCitasUsuario(req.userId);
  res.json(citas);
};

export const horasOcupadas = async (req, res) => {
  const { fecha } = req.params;
  const horas = await obtenerCitasPorFecha(fecha);
  res.json(horas);
};

export const cancelarCitaUsuario = async (req, res) => {
  const { id } = req.params;
  await cancelarCita(id, req.userId);
  res.json({ message: "Cita cancelada" });
};
// ✅ 1. Listar todas las citas (solo admin)
export const listarCitasAdmin = async (req, res) => {
  const usuario = req.usuario;
  if (usuario.id_rol !== 1) {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }

  const citas = await obtenerTodasLasCitas();
  res.json(citas);
};

// ✅ 2. Actualizar estado de una cita (solo admin)
export const actualizarEstadoCita = async (req, res) => {
  const usuario = req.usuario;
  if (usuario.id_rol !== 1) {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }

  const { id } = req.params;
  const { estado } = req.body;

  if (!["confirmada", "cancelada"].includes(estado)) {
    return res.status(400).json({ message: "Estado inválido. Solo se permite 'confirmada' o 'Cancelado'." });
  }

  await actualizarEstado(id, estado);
  res.json({ message: `Estado de la cita actualizado a ${estado}` });
};