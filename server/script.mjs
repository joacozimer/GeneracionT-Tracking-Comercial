import connection from './db/db.mjs';

export async function newUser(nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento) {
  try {
    await connection.query('BEGIN'); // Inicia la transacción

    // Inserta el nuevo Usuario en la tabla Usuario
    await connection.query('INSERT INTO Usuario(nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento, Cliente_Empleado) VALUES (?, ?, ?, ?, ?, ?, NULL)', [nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento]);

    // Inserta el Correo del nuevo Usuario en la tabla Cliente
    await connection.query('INSERT INTO Cliente(Correo_Cliente) VALUES (?)', [Correo]);

    await connection.query('COMMIT'); // Confirma la transacción
    console.log('Registro exitoso');
  } catch (error) {
    await connection.query('ROLLBACK'); // Revierte la transacción en caso de error
    console.error('Error en el registro:', error.message);
  }
}

export async function actualizarTipoDeUsuario(Correo, nuevoTipo) {
  try {
    connection.query(
      'UPDATE Usuario SET Tipo_Usuario = ? WHERE Correo = ?',
      [nuevoTipo, Correo]
    );
    console.log('Actualización de Tipo de Usuario exitosa');
  } catch (error) {
    console.error('Error en la actualización de Tipo de Usuario:', error.message);
  }
}

export function selectUser(Correo, contrasenia) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM Usuario WHERE Correo = ? and contrasenia = ?', [Correo, contrasenia],
      (err, result) => {
        if (err) {
          console.error(err);
          console.log('Error en la consulta a la base de datos');
          reject({ error: 'Error en la consulta a la base de datos' });
        }
        if (result && result.length > 0 && result[0].Correo === Correo && result[0].contrasenia === contrasenia) {
          console.log('Usuario encontrado');
          resolve(result);
        } else {
          console.log('Usuario no encontrado');
          resolve({ error: 'Credenciales incorrectas' });
        }
      }
    );
  });
}

export async function obtenerInfoProspecto(req, res, next) {

  if(req.isAuthenticated() ){

    const Usuario = req.user;
    
      const ID = await obtenerID_ClienteOEmpleadoPorCorreo(Usuario.Correo, Usuario.Tipo_Usuario);
 
      try {
        let results;
        
        if (Usuario.Tipo_Usuario === "Cliente") {
          [results] = await connection.query(`SELECT P.*, E.Estado Tipo FROM Prospecto P, Estado E WHERE P.Estado = E.ID_Estado AND ID_Cliente = ? ORDER BY ID_Prospecto DESC`, [ID]);
        } else if (Usuario.Tipo_Usuario === "Empleado" && Usuario.Cliente_Empleado === 2) {
          [results] = await connection.query(`SELECT P.*, E.Estado Tipo, A.Aceptacion Resolucion FROM Prospecto P, Estado E, Aceptacion A WHERE P.Estado = E.ID_Estado AND P.Aceptacion = A.ID_Aceptacion AND ID_Empleado_Tecnico = ? AND P.Aceptacion != 2 AND P.Estado = 1 ORDER BY ID_Prospecto DESC`, [ID]);
        } else {
          [results] = await connection.query(`SELECT P.*, E.Estado Tipo, A.Aceptacion Resolucion FROM Prospecto P, Estado E, Aceptacion A WHERE P.Estado = E.ID_Estado AND P.Aceptacion = A.ID_Aceptacion AND ID_Empleado_Comercial = ? AND P.propuestaTecnica IS NOT NULL AND P.Estado != 1 AND P.Aceptacion != 2 ORDER BY ID_Prospecto DESC`, [ID]);
        }
        const nombresDeProspecto = results.map((row) => row.nombreProspecto);
        const ID_Prospecto = results.map((row) => row.ID_Prospecto);
        const plazo = results.map((row) => row.plazoTiempoDelProspecto);
        const presupuesto = results.map((row) => row.presupuestoDelProspecto);
        const especificacionTec = results.map((row) => row.especificacionTecnica);
        const descNecesidad = results.map((row) => row.descripcionDeLaNecesidad);
        const propTec = results.map((row) => row.propuestaTecnica);
        const Estado = results.map((row) => row.Estado);
        const Tipo = results.map((row) => row.Tipo);
        const Resolucion = results.map((row) => row.Resolucion);
        console.log(nombresDeProspecto);
        console.log(ID_Prospecto);
        const ProspectoData = {
          nombresDeProspecto,
          ID_Prospecto,
          plazo,
          presupuesto,
          especificacionTec,
          descNecesidad,
          propTec,
          Estado,
          Tipo,
          Resolucion,
        };
  
        next(null, ProspectoData);
      } catch (error) {
        console.error('Error al consultar la base de datos: ' + error);
        next(error);    
      }
    }else{
      console.log('Usuario no autenticado');
      res.redirect('/');
      console.log(res.status);
    }
      
  
  }

  export async function obtenerProspecto(req){
    let results 
    if (req.user.Cliente_Empleado === 2) {[results] = await connection.query(`SELECT * FROM Prospecto WHERE ID_Empleado_Tecnico is null AND ID_Empleado_Comercial is null AND propuestaTecnica is null`);}
    else if (req.user.Cliente_Empleado === 3) {[results] = await connection.query(`SELECT * FROM Prospecto WHERE ID_Empleado_Tecnico is not null AND ID_Empleado_Comercial is null AND propuestaTecnica is not null`);}
    if(req.isAuthenticated()){
      const nombresDeProspecto = results.map((row) => row.nombreProspecto);
        const ID_Prospecto = results.map((row) => row.ID_Prospecto);
        const plazo = results.map((row) => row.plazoTiempoDelProspecto);
        const presupuesto = results.map((row) => row.presupuestoDelProspecto);
        const especificacionTec = results.map((row) => row.especificacionTecnica);
        const descNecesidad = results.map((row) => row.descripcionDeLaNecesidad);
        const propTec = results.map((row) => row.propuestaTecnica);
        const Estado = results.map((row) => row.Estado);
        const Tipo = results.map((row) => row.Tipo);
        const ID_Empleado_Tecnico = results.map((row) => row.ID_Empleado_Tecnico);
        const ID_Empleado_Comercial = results.map((row) => row.ID_Empleado_Comercial);
        const ProspectoData = {
          nombresDeProspecto,
          ID_Prospecto,
          plazo,
          presupuesto,
          especificacionTec,
          descNecesidad,
          propTec,
          Estado,
          Tipo,
          ID_Empleado_Tecnico,
          ID_Empleado_Comercial,
        };
        return ProspectoData;
    }else{
      res.redirect('/');
    }
  }

  export async function obtenerID_ClienteOEmpleadoPorCorreo(Correo, Tipo) {
    try {
      if (Tipo === 'Cliente') {
        const resultCliente = await connection.query('SELECT ID_Cliente FROM Cliente WHERE Correo_Cliente = ?', [Correo]);
        //console.log('Resultado de la consulta de Cliente:', resultCliente);
        if (resultCliente.length > 0) {
          const ID_Cliente = resultCliente[0][0].ID_Cliente; 
          return (ID_Cliente); 
        }
      } else if (Tipo === 'Empleado') {
        const resultEmpleado = await connection.query('SELECT ID_Empleado FROM Empleado WHERE Correo_Empleado = ?', [Correo]);
        if (resultEmpleado.length > 0) {
          const ID_Empleado = resultEmpleado[0][0].ID_Empleado; 
          return (ID_Empleado);
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

export async function obtenerArchivo(ID_Prospecto) {
  try {
    const Archivo = await connection.query('SELECT * FROM Archivo WHERE ID_Prospecto = ?', [ID_Prospecto]);
    return Archivo;
  } catch (error) {
    console.error('Error ', error.message);
    throw error; // Lanza el error para que sea manejado por el código que llama a esta función
  }
}

export async function obtenerDatosProspectoPorID(ID_Prospecto, callback) {
  try {
    const [results] = await connection.query('SELECT P.*, E.Estado Tipo, U.Correo, U.nombre, U.apellido,  A.Aceptacion Resolucion FROM Usuario U,Prospecto P, Cliente C, Estado E, Aceptacion A WHERE P.ID_Cliente = C.ID_Cliente AND C.Correo_Cliente = U.Correo AND P.Aceptacion = A.ID_Aceptacion AND ID_Prospecto = ? AND P.Estado = E.ID_Estado', [ID_Prospecto]);
    //const [Cliente] = await connection.query('SELECT Correo, nombre, apellido FROM Usuario U,prospecto P, Cliente C WHERE P.ID_Cliente = C.ID_Cliente AND C.Correo_Cliente = U.Correo AND ID_Prospecto = ?', [ID_Prospecto]);
    if (results.length === 0) {
      throw new Error('El prospecto con el ID especificado no existe');
    }

    const Prospecto = results[0];
    // Obtener archivos por ID_Prospecto
    const [Archivo] = await connection.query('SELECT * FROM Archivo WHERE ID_Prospecto = ?', [ID_Prospecto]);

    const ProspectoData = {
      ID_Prospecto: Prospecto.ID_Prospecto,
      nombre: Prospecto.nombreProspecto,
      plazo: Prospecto.plazoTiempoDelProspecto,
      presupuesto: Prospecto.presupuestoDelProspecto,
      especificacionTec: Prospecto.especificacionTecnica,
      descNecesidad: Prospecto.descripcionDeLaNecesidad,
      propTec: Prospecto.propuestaTecnica,
      ID_Empleado_Tecnico: Prospecto.ID_Empleado_Tecnico,
      ID_Empleado_Comercial: Prospecto.ID_Empleado_Comercial,
      Estado: Prospecto.Estado,
      Aceptacion: Prospecto.Aceptacion,
      Tipo: Prospecto.Tipo,
      Correo_Cliente : Prospecto.Correo,
      nombreCliente : Prospecto.nombre,
      apellidoCliente :Prospecto.apellido,
      Archivo: Archivo, 
      Resolucion: Prospecto.Resolucion, 
    };
    callback(null, ProspectoData);
  } catch (error) {
    callback(error, null);
  }
}


export async function obtenerEmpleado() {
  try {
    const [rows, fields] = await connection.execute('SELECT * FROM Usuario WHERE Tipo_Usuario = "Empleado"');
    return rows;
  } catch (error) {
    throw error;
  }
}