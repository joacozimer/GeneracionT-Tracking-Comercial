// Import the 'node-fetch' library for making HTTP requests
//import fetch from 'node-fetch';
import connection from './db/db.mjs';

export async function newUser(nombre, apellido, correo, contrasenia, telefono, fechaNacimiento) {
  try {
    await connection.query('BEGIN'); // Inicia la transacción

    // Inserta el nuevo usuario en la tabla Usuarios
    await connection.query('INSERT INTO usuarios(nombre, apellido, correo, contrasenia, telefono, fechaNacimiento, cliente_Empleado) VALUES (?, ?, ?, ?, ?, ?, NULL)', [nombre, apellido, correo, contrasenia, telefono, fechaNacimiento]);

    // Inserta el correo del nuevo usuario en la tabla clientes
    await connection.query('INSERT INTO clientes(correo_cliente) VALUES (?)', [correo]);

    await connection.query('COMMIT'); // Confirma la transacción
    console.log('Registro exitoso');
  } catch (error) {
    await connection.query('ROLLBACK'); // Revierte la transacción en caso de error
    console.error('Error en el registro:', error.message);
  }
}

export async function actualizarTipoDeUsuario(correo, nuevoTipo) {
  try {
    connection.query(
      'UPDATE usuarios SET tipo_usuario = ? WHERE correo = ?',
      [nuevoTipo, correo]
    );
    console.log('Actualización de tipo de usuario exitosa');
  } catch (error) {
    console.error('Error en la actualización de tipo de usuario:', error.message);
  }
}


export function selectUser(correo, contrasenia) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM usuarios WHERE correo = ? and contrasenia = ?', [correo, contrasenia],
      (err, result) => {
        if (err) {
          console.error(err);
          console.log('Error en la consulta a la base de datos');
          reject({ error: 'Error en la consulta a la base de datos' });
        }
        if (result && result.length > 0 && result[0].correo === correo && result[0].contrasenia === contrasenia) {
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




// En script.mjs

export async function obtenerInfoProspectos(req, res, next) {
  // Consulta SQL para obtener los nombres de los prospectos ordenados por fecha de forma descendente y limitar a 3
  const sql = 'SELECT prospecto_id, nombreProspecto, plazoTiempoDelProspecto FROM prospecto ORDER BY prospecto_id DESC LIMIT 3';
  
  // Ejecuta la consulta SQL
  try {
    const [results] = await connection.query(sql); 
    const nombresDeProspectos = results.map((row) => row.nombreProspecto);
    const IDDeProspectos = results.map((row) => row.prospecto_id);
    const plazo = results.map((row) => row.plazoTiempoDelProspecto);
    console.log(nombresDeProspectos);
    console.log(IDDeProspectos);
    next(null, nombresDeProspectos, IDDeProspectos, plazo);
  } catch (error) {
    console.error('Error al consultar la base de datos: ' + error);
    next(error);    
  }
}

export async function mostrarInfoProspectos(req, res, next) {
  
  const sql = 'SELECT prospecto_id, nombreProspecto, plazoTiempoDelProspecto, presupuestoDelProspecto, especificacionTecnica, descripcionDeLaNecesidad, documentosAdicionales, estado FROM prospecto';
  
  try {
    
    const [results] = await connection.query(sql);
    const prospectos = results.map((row) => ({
      ID: row.prospecto_id,
      nombreProspecto: row.nombreProspecto,
      plazo: row.plazoTiempoDelProspecto,
      presupuesto: row.presupuestoDelProspecto,
      especTec: row.especificacionTecnica,
      descNecesidad: row.descripcionDeLaNecesidad,
      docAdicionales: row.documentosAdicionales,
      estado: row.estado,
    }));

    //next(null,prospectos);
  } catch (error) {
    console.error('Error al consultar la base de datos: ' + error);
    next(error);
  }
}


