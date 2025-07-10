import { deleteUser, findUserById, updateUser } from "../models/userModel.js";

export const getProfile = async (req, res) => {
  const user = await findUserById(req.userId);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  delete user.contraseña;
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { nombre, correo } = req.body;
  await updateUser(req.userId, nombre, correo);
  res.json({ message: "Perfil actualizado" });
};

export const deleteProfile = async (req, res) => {
  await deleteUser(req.userId);
  res.json({ message: "Usuario eliminado" });
};