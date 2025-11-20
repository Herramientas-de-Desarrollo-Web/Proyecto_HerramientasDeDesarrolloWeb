// src/controllers/userController.js
import { getAllUsers } from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error en getUsers:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
