// src/services/userService.js
import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  return rows;
};

export const createUser = async (
  nombre,
  email,
  password,
  telefono,
  dni,
  fecha_nacimiento,
  genero,
  direccion,
  rol
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    `INSERT INTO usuarios 
     (nombre, email, telefono, dni, fecha_nacimiento, genero, direccion, password, rol) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      email,
      telefono,
      dni,
      fecha_nacimiento,
      genero,
      direccion,
      hashedPassword, 
      rol,
    ]
  );
  return result.insertId;
};

export const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  return rows[0];
};
