DROP PROCEDURE IF EXISTS MoverUsuarioDeClientesAEmpleados;

DELIMITER //

CREATE PROCEDURE MoverUsuarioDeClientesAEmpleados(
    IN correo_usuario VARCHAR(255),
    IN cliente_Empleado INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 1. Si el usuario ya es un empleado, elimínalo
    DELETE FROM empleados WHERE correo_empleado = correo_usuario;

    -- 2. Elimina al usuario de la tabla clientes si existe
    DELETE FROM clientes WHERE correo_cliente = correo_usuario;

    -- 3. Agrega al usuario a la tabla empleados
    INSERT INTO empleados (correo_empleado) VALUES (correo_usuario);

    -- 4. Actualiza el tipo de usuario en la tabla Usuarios
    INSERT INTO Usuarios (correo, cliente_Empleado, tipo_usuario) VALUES (correo_usuario, cliente_Empleado, CASE WHEN cliente_Empleado = 1 THEN 'Empleado' ELSE 'Emplado' END)
    ON DUPLICATE KEY UPDATE cliente_Empleado = cliente_Empleado, tipo_usuario = CASE WHEN cliente_Empleado = 1 THEN 'Empleado' ELSE 'Empleado' END;

    COMMIT;
END //

DELIMITER ;

CALL MoverUsuarioDeClientesAEmpleados('vladgenio9@gmail.com', 1);



DELIMITER //

CREATE PROCEDURE MoverUsuarioDeEmpleadosAClientes(
    IN correo_usuario VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 1. Elimina al usuario de la tabla empleados
    DELETE FROM empleados WHERE correo_empleado = correo_usuario;

    -- 2. Agrega al usuario a la tabla clientes
    INSERT INTO clientes (correo_cliente) VALUES (correo_usuario);

    -- 3. Actualiza el tipo de usuario en la tabla Usuarios y establece cliente_Empleado a NULL
    UPDATE Usuarios SET cliente_Empleado = NULL, tipo_usuario = 'Cliente' WHERE correo = correo_usuario;

    COMMIT;
END //

DELIMITER ;

CALL MoverUsuarioDeEmpleadosAClientes('vladgenio9@gmail.com');