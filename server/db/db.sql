DROP DATABASE IF EXISTS db_tracking_comercial;
CREATE DATABASE db_tracking_comercial;
USE db_tracking_comercial;

ALTER DATABASE db_tracking_comercial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Tipo_Empleado(
    ID INT PRIMARY KEY NOT NULL,
    Tipo_Empleado VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Usuario(
    Correo VARCHAR(255) PRIMARY KEY NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    contrasenia VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,	
    fechaNacimiento DATE NOT NULL,
    DNI INT NULL UNIQUE,
    Cliente_Empleado INT NULL,
    Tipo_Usuario VARCHAR(255) DEFAULT 'Cliente',
    FOREIGN KEY (Cliente_Empleado) REFERENCES Tipo_Empleado(ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Estado(
    ID_Estado INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Estado VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Aceptacion(
    ID_Aceptacion INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Aceptacion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Cliente(
    ID_Cliente INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Correo_Cliente VARCHAR(255),
    FOREIGN KEY (Correo_Cliente) REFERENCES Usuario(Correo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Empleado(
    ID_Empleado INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Correo_Empleado VARCHAR(255),
    FOREIGN KEY (Correo_Empleado) REFERENCES Usuario(Correo) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Prospecto(
    ID_Prospecto INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombreProspecto VARCHAR(255) NOT NULL,
    plazoTiempoDelProspecto DATE NOT NULL,
    presupuestoDelProspecto INT NOT NULL,
    especificacionTecnica VARCHAR(255) NOT NULL,
    descripcionDeLaNecesidad VARCHAR(255) NOT NULL,
    documentosAdicionales BLOB,
    propuestaTecnica VARCHAR(255) NULL,
    Estado INT NOT NULL,
    Aceptacion INT NULL,
    ID_Cliente INT NULL,
    ID_Empleado_Tecnico INT NULL, 
    ID_Empleado_Comercial INT NULL, 
    FOREIGN KEY (Estado) REFERENCES Estado(ID_Estado) ON DELETE CASCADE,
    FOREIGN KEY (Aceptacion) REFERENCES Aceptacion(ID_Aceptacion) ON DELETE CASCADE,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Empleado_Tecnico) REFERENCES Empleado(ID_Empleado) ON DELETE CASCADE, 
    FOREIGN KEY (ID_Empleado_Comercial) REFERENCES Empleado(ID_Empleado) ON DELETE CASCADE 
);


CREATE TABLE IF NOT EXISTS Archivo (
    ID_Archivo INT  PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ruta VARCHAR(255) NOT NULL,
    ID_Prospecto INT NOT NULL,
    FOREIGN KEY (ID_Prospecto) REFERENCES Prospecto(ID_Prospecto) ON DELETE CASCADE
);

INSERT INTO Usuario VALUES ("Admin@Admin", "Admin", "Admin", "Admin", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("a@a", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("b@b", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("c@c", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("d@d", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("e@e", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");
INSERT INTO Usuario VALUES ("f@f", "Admin", "Admin", "1", "11 1111-1111", "2000-10-10", Null, Null, "Cliente");

INSERT INTO Tipo_Empleado VALUES (1, "Admin");
INSERT INTO Tipo_Empleado VALUES (2, "Tecnico");
INSERT INTO Tipo_Empleado VALUES (3, "Comercial");

INSERT INTO Estado (Estado) VALUES ("A estimar");
INSERT INTO Estado (Estado) VALUES ("Estimado");
INSERT INTO Estado (Estado) VALUES ("Enviado al Cliente");
INSERT INTO Estado (Estado) VALUES ("Terminado");

INSERT INTO Aceptacion (Aceptacion) VALUES ("");
INSERT INTO Aceptacion (Aceptacion) VALUES ("Aprobado");
INSERT INTO Aceptacion (Aceptacion) VALUES ("Rechazado");
INSERT INTO Aceptacion (Aceptacion) VALUES ("Observado");



-- Procedimiento Mover Cliente a Empleado ---------------------------------------------
DROP PROCEDURE IF EXISTS MoverUsuarioDeClienteAEmpleado;

DELIMITER //
CREATE PROCEDURE MoverUsuarioDeClienteAEmpleado(
    IN Correo_Usuario VARCHAR(255),
    IN Cliente_Empleado INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    START TRANSACTION;
    DELETE FROM Empleado WHERE Correo_Empleado = Correo_Usuario;
    DELETE FROM Cliente WHERE Correo_Cliente = Correo_Usuario;
    INSERT INTO Empleado (Correo_Empleado) VALUES (Correo_Usuario);
    INSERT INTO Usuario (Correo, Cliente_Empleado, Tipo_Usuario) VALUES (Correo_Usuario, Cliente_Empleado, 
        CASE WHEN Cliente_Empleado = 1 THEN 'Admin' ELSE 'Empleado' END)
    ON DUPLICATE KEY UPDATE Cliente_Empleado = Cliente_Empleado, Tipo_Usuario = CASE WHEN Cliente_Empleado = 1 THEN 'Admin' ELSE 'Empleado' END;
    COMMIT;
END //
DELIMITER ;

CALL MoverUsuarioDeClienteAEmpleado('Admin@Admin', 1);

CALL MoverUsuarioDeClienteAEmpleado('c@c', 2);
CALL MoverUsuarioDeClienteAEmpleado('d@d', 2);
CALL MoverUsuarioDeClienteAEmpleado('e@e', 3);
CALL MoverUsuarioDeClienteAEmpleado('f@f', 3);



-- Procedimiento Mover Empleado a Cliente -----------------------------------------------------------
DROP PROCEDURE IF EXISTS MoverUsuarioDeEmpleadoACliente;

DELIMITER //
CREATE PROCEDURE MoverUsuarioDeEmpleadoACliente(
    IN Correo_Usuario VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    START TRANSACTION;
    DELETE FROM Empleado WHERE Correo_Empleado = Correo_Usuario;
    INSERT INTO Cliente (Correo_Cliente) VALUES (Correo_Usuario);
    UPDATE Usuario SET Cliente_Empleado = NULL, Tipo_Usuario = 'Cliente' WHERE Correo = Correo_Usuario;
    COMMIT;
END //
DELIMITER ;



CALL MoverUsuarioDeEmpleadoACliente('a@a');
CALL MoverUsuarioDeEmpleadoACliente('b@b');