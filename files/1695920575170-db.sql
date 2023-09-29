DROP DATABASE IF EXISTS db_tracking_comercial;
CREATE DATABASE db_tracking_comercial;
USE db_tracking_comercial;

ALTER DATABASE db_tracking_comercial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS TipoEmpleados(
    ID INT PRIMARY KEY NOT NULL,
    Tipo_Empleado VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Usuarios(
    correo VARCHAR(255) PRIMARY KEY NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,	
    fechaNacimiento DATE NOT NULL,
    DNI INT NULL UNIQUE,
    cliente_Empleado INT NULL,
    tipo_usuario VARCHAR(255) DEFAULT 'cliente',
    FOREIGN KEY (cliente_Empleado) REFERENCES TipoEmpleados(ID)
);

CREATE TABLE IF NOT EXISTS estado(
    estado_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    A_estimar DATE NOT NULL,
    estimado DATE NOT NULL,
    enviado_al_cliente BOOLEAN NOT NULL,
    aprobado BOOLEAN NOT NULL,
    rechazado BOOLEAN NOT NULL,
    observado BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes(
    ID_cliente INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    correo_cliente VARCHAR(255),
    FOREIGN KEY (correo_cliente) REFERENCES Usuarios(correo)
);

CREATE TABLE IF NOT EXISTS empleados(
    ID_empleado INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    correo_empleado VARCHAR(255),
    FOREIGN KEY (correo_empleado) REFERENCES Usuarios(correo)
);

CREATE TABLE IF NOT EXISTS prospecto(
    prospecto_id INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombreProspecto VARCHAR(255) NOT NULL,
    plazoTiempoDelProspecto DATE NOT NULL,
    presupuestoDelProspecto INT NOT NULL,
    especificacionTecnica VARCHAR(255) NOT NULL,
    descripcionDeLaNecesidad VARCHAR(255) NOT NULL,
    documentosAdicionales BLOB,
    propuestaTecnica VARCHAR(255) NULL,
    estado INT NULL,
    ID_cliente INT NULL,
    ID_empleado INT NULL,
    FOREIGN KEY (estado) REFERENCES estado(estado_id),
    FOREIGN KEY (ID_cliente) REFERENCES clientes(ID_cliente),
    FOREIGN KEY (ID_empleado) REFERENCES empleados(ID_empleado)
);

CREATE TABLE IF NOT EXISTS archivos (
    archivo_id INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ruta VARCHAR(255) NOT NULL,
    prospecto_id INT NOT NULL,
    FOREIGN KEY (prospecto_id) REFERENCES prospecto(prospecto_id)
);

INSERT INTO TipoEmpleados VALUES (1, "Tecnico");
INSERT INTO TipoEmpleados VALUES (2, "Comercial");