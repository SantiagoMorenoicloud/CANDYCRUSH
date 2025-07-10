import { crearPQRS, obtenerPQRSporUsuario, listarTodasPQRS as obtenerTodasLasPQRS, responderPQRS } from "../models/pqrsModel.js";


export const crearPQRSController = async (req, res) => {
  const { tipo, asunto, mensaje } = req.body;
  const id = await crearPQRS(req.userId, tipo, asunto, mensaje);
  res.json({ message: "PQRS registrada", id });
};

export const listarPQRSUsuario = async (req, res) => {
  const lista = await obtenerPQRSporUsuario(req.userId);
  res.json(lista);
};

export const listarTodasPQRS = async (req, res) => {
  const usuario = req.usuario;
  if (usuario.id_rol !== 1) return res.status(403).json({ message: "Acceso denegado" });
  const lista = await obtenerTodasLasPQRS();
  res.json(lista);
};

export const responderPQRSController = async (req, res) => {
  const usuario = req.usuario;
  if (usuario.id_rol !== 1) return res.status(403).json({ message: "Acceso denegado" });
  const { id } = req.params;
  const { respuesta } = req.body;
  await responderPQRS(id, respuesta);
  res.json({ message: "PQRS respondida" });
};