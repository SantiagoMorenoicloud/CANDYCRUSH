-- Crear base de datos proyecto
CREATE DATABASE IF NOT EXISTS candy_crush;
USE candy_crush;

-- Tabla de roles (simplificada)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla de usuarios (simplificada)3
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
	correo VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(250),
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

-- Tabla PQRS con respuesta
CREATE TABLE pqrs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('Petición', 'Queja', 'Reclamo', 'Sugerencia') NOT NULL,
    asunto VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'En Proceso', 'Resuelto') DEFAULT 'Pendiente',
    respuesta TEXT,
    fecha_respuesta DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(255),
  estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);



-- Tabla de autores (simplificada)
CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de categorías (simplificada con ENUM como en tu ejemplo sencillo)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de libros (simplificada)
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prod VARCHAR(100) NOT NULL,
    marca_id INT NOT NULL,
    categoria_id INT NOT NULL,
    anio INT CHECK (anio >= 0),
    imagen VARCHAR(255),
    descripcion text,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    precio DECIMAL(10,2),
    FOREIGN KEY (marca_id) REFERENCES marcas(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de ventas (simplificada)
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL (10,2),
    total DECIMAL(10,2) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE carrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  usuario_id INT NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

ALTER TABLE ventas ADD COLUMN precio DECIMAL(10,2) AFTER usuario_id;
ALTER TABLE libros ADD descripcion TEXT;


-- Índices adicionales opcionales para rendimiento
CREATE INDEX idx_productos_nombre ON productos(nombre_prod);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);