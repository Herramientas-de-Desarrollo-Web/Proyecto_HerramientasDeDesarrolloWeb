import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Necesario para manejar rutas de archivos en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../public")));

// Rutas API
app.use("/api/users", userRoutes);

// Si el usuario accede a cualquier ruta que no sea API, envia el index.html
// (esto sirve si tu frontend tiene varias páginas)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/HTML/index.html"));
});

export default app;

