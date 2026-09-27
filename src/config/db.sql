CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contrasenaHash VARCHAR(255),
    token VARCHAR(255),
    expiraToken DATETIME,
    tipoUsuario VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50) NOT NULL,
    imagen VARCHAR(255),
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    marca VARCHAR(100),
    numeroParte VARCHAR(100),
    umbralStockBajo INT NOT NULL DEFAULT 5,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProducto INT NOT NULL UNIQUE,
    fichaTecnica VARCHAR(255),
    manual VARCHAR(255),
    fuenteEnergia VARCHAR(255),
    FOREIGN KEY (idProducto) REFERENCES producto(id)
);

CREATE TABLE pregunta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(255) NOT NULL,
    orden INT NOT NULL
);

CREATE TABLE recomendacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT
);

CREATE TABLE opcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPregunta INT NOT NULL,
    texto VARCHAR(255) NOT NULL,
    sigPaso INT NOT NULL,
    tipoSigPaso VARCHAR(20) NOT NULL,
    FOREIGN KEY (idPregunta) REFERENCES pregunta(id)
);

CREATE TABLE recomendacion_producto (
    idRecomendacion INT NOT NULL,
    idProducto INT NOT NULL,
    PRIMARY KEY (idRecomendacion, idProducto),
    FOREIGN KEY (idRecomendacion) REFERENCES recomendacion(id),
    FOREIGN KEY (idProducto) REFERENCES producto(id)
);

CREATE TABLE historialCuestionario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respuestas TEXT NOT NULL,
    mensajeCliente TEXT,
    equipoRecomendado VARCHAR(255),
    contactado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE cuestionario_completado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(30) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    idProducto INT NOT NULL,
    origen VARCHAR(20) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id),
    FOREIGN KEY (idProducto) REFERENCES producto(id)
);

CREATE TABLE mensajeContacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT FALSE,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL UNIQUE,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE detalle_carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCarrito INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (idCarrito) REFERENCES carrito(id),
    FOREIGN KEY (idProducto) REFERENCES producto(id)
);

CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    nombreContacto VARCHAR(100) NOT NULL,
    emailContacto VARCHAR(150) NOT NULL,
    telefonoContacto VARCHAR(20),
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaExpiracion TIMESTAMP NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(id)
);

CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedido(id),
    FOREIGN KEY (idProducto) REFERENCES producto(id)
);

CREATE TABLE pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    metodo VARCHAR(30) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES pedido(id)
);
