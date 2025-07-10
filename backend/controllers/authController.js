import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

export const register = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;
  const user = await findUserByEmail(correo);
  if (user) return res.status(400).json({ message: "Correo ya registrado." });

  const hash = await bcrypt.hash(contraseña, 10);
  const id = await createUser(nombre, correo, hash);
  res.json({ message: "Usuario creado", id });
};

export const login = async (req, res) => {
  const { correo, contraseña } = req.body;
  const user = await findUserByEmail(correo);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  const valid = await bcrypt.compare(contraseña, user.contraseña);
  if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id }, "secreto123", { expiresIn: "1h" });

  // 👇 Aquí respondemos con los datos del usuario
  res.json({
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol
    },
    message: "Inicio de sesión exitoso"
  });
};
