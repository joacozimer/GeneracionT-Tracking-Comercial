DROP DATABASE IF EXISTS db_tracking_comercial;
CREATE DATABASE db_tracking_comercial;
USE db_tracking_comercial;
CREATE TABLE Cliente(
    id_cliente INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre_cliente VARCHAR(255) NOT NULL,
    apellido_cliente VARCHAR(255) NOT NULL
);

CREATE TABLE Prospecto(
    id_prospecto INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre_proyecto VARCHAR(255) NOT NULL,
    cliente_id INT,
    FOREIGN key (cliente_id) REFERENCES Cliente(id_cliente),
    descripcion_oportunidad VARCHAR(255) NOT NULL,
    descripcion_necesidad VARCHAR(255) NOT NULL,
    especificaciones_tecnicas VARCHAR(255) NOT NULL,
    restricciones_tiempo TIME NOT NULL,
    restricciones_economicas INT(255) NOT NULL,
    estado_prospecto VARCHAR(255) NOT NULL,
    documentos_adicionales BLOB,
    propuesta_tecnica BLOB
);
    
CREATE TABLE Estado(
    id_estado INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    prospecto_id INT,
    FOREIGN key (prospecto_id) REFERENCES Prospecto(id_prospecto),
    A_estimar DATE NOT NULL,
    estimado DATE NOT NULL,
    enviado_al_cliente BOOLEAN NOT NULL,
    aprobado BOOLEAN NOT NULL,
    rechazado BOOLEAN NOT NULL,
    observado BOOLEAN NOT NULL
);
        
CREATE TABLE Usuarios(
    id_usuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,	
    fechaNacimiento DATE NOT NULL
);



-- SELECT * FROM Usuarios;
-- INSERT INTO Usuarios(nombre, apellido, correo, contrasñea, telefono, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?);

-- //---------------Prospectos

-- // Cambiar el estado_prospecto

-- (update estado_prospecto set ? where id_estado = ?, [estado_prospecto, id_estado]);