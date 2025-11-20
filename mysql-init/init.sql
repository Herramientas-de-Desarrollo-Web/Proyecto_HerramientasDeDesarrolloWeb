CREATE DATABASE IF NOT EXISTS proyecto;

USE proyecto;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(15),
    fecha_nacimiento DATE,
    genero ENUM('Masculino','Femenino','Otro'),
    direccion VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN','USER') DEFAULT 'USER',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('Pequeno','Mediano','Grande','Otro') NOT NULL,
    capacidad INT,
    precio_base DECIMAL(10,2) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    sala_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('Pendiente','Confirmada','Cancelada') DEFAULT 'Pendiente',
    comentarios TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (sala_id) REFERENCES salas(id)
);

CREATE TABLE IF NOT EXISTS reserva_servicio (
    reserva_id INT NOT NULL,
    servicio_id INT NOT NULL,
    PRIMARY KEY (reserva_id, servicio_id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);
