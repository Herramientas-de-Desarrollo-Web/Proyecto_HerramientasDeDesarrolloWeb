import express from "express";
import mysql from "mysql2";

const router = express.Router();

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "TU_USUARIO",
  password: process.env.DB_PASSWORD || "TU_CONTRASEÑA",
  database: process.env.DB_NAME || "proyecto"
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado a la BD MySQL desde reservaRoutes");
});

// Crear reserva
router.post("/", (req, res) => {
  const { usuarioId, salaId, fechaInicio, fechaFin, total, comentarios, servicios } = req.body;

  const sqlReserva = `
    INSERT INTO reservas (usuario_id, sala_id, fecha_inicio, fecha_fin, total, comentarios)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlReserva, [usuarioId, salaId, fechaInicio, fechaFin, total, comentarios], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const reservaId = result.insertId;

    if (servicios && servicios.length > 0) {
      const sqlServicios = "INSERT INTO reserva_servicio (reserva_id, servicio_id) VALUES ?";
      const values = servicios.map(id => [reservaId, id]);

      db.query(sqlServicios, [values], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Reserva creada con servicios", reservaId });
      });
    } else {
      res.json({ message: "Reserva creada sin servicios", reservaId });
    }
  });
});

// Obtener reservas de un usuario
router.get("/:usuarioId", (req, res) => {
  const usuarioId = req.params.usuarioId;
  const sql = `
    SELECT r.*, s.nombre AS sala_nombre
    FROM reservas r
    JOIN salas s ON r.sala_id = s.id
    WHERE r.usuario_id = ?
    ORDER BY r.fecha_inicio DESC
  `;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

export default router;
