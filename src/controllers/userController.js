import { createUser, getUserByEmail } from "../services/userService.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const {
    nombre,
    email,
    telefono,
    dni,
    fecha_nacimiento,
    genero,
    direccion,
    password,
    rol = "USER",
  } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ msg: "Usuario ya existe" });

    const userId = await createUser(
      nombre,
      email,
      password, 
      telefono,
      dni,
      fecha_nacimiento,
      genero,
      direccion,
      rol
    );

    res.status(201).json({ msg: "Usuario registrado", id: userId });
  } catch (error) {
    res.status(500).json({ msg: "Error al registrar usuario", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    res.status(200).json({
      msg: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en login", error });
  }
};
