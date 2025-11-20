import dotenv from "dotenv";
import path from "path";
import express from "express";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Servir frontend desde /docs
app.use(express.static(path.join(process.cwd(), "docs")));

// Fallback para SPA o páginas simples
app.use((req, res) => {
  res.sendFile(path.join(process.cwd(), "docs", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
