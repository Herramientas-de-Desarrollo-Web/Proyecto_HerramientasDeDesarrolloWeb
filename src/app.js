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
app.use(express.static(path.join(__dirname, "../docs")));

// Rutas API
app.use("/api/users", userRoutes);

// Ruta de verificación (debe estar ANTES del fallback)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Fallback para cualquier otra ruta
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../docs/index.html"));
});

export default app;

