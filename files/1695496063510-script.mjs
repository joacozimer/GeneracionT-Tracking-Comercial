// Import the 'node-fetch' library for making HTTP requests
//import fetch from 'node-fetch';
import connection from './db.mjs';

// Function to make a request to the backend
// export async function realizarConsulta(consulta, id_estado) {
//   console.log("hice click");
//   try {
//     const response = await fetch('/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ consulta }),
//     });

//     if (!response.ok) {
//       throw new Error('Error in the backend request');
//     }

//     const data = await response.json();
//     console.log(`Query executed successfully for id_estado = ${id_estado}`);
//     console.log('Backend response:', data);
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }

export async function newUser(nombre, apellido, correo, contraseña, telefono, fechaNacimiento) {
  try {
    connection.query('INSERT INTO usuarios(nombre, apellido, correo, contraseña, telefono, fechaNacimiento) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellido, correo, contraseña, telefono, fechaNacimiento]);
    console.log('Inserción exitosa');
  } catch (error) {
    console.error('Error en la inserción:', error.message);
  }
}

export async function selectUser(correo, contraseña, res) {
  connection.query('SELECT * FROM usuarios WHERE correo = ? and contraseña = ?', [correo, contraseña], (err, result) => {
    if (err) {
      console.log(err);
      console.log("Error en la consulta a la base de datos");
      return res.status(500).json({ error: "Error en la consulta a la base de datos" });
    }

    if (result && result.length > 0 && result[0].correo === correo && result[0].contraseña === contraseña) {
      console.log("Usuario encontrado");
      res.json(result);
    } else {
      //alert("Usuario o contraseña incorrecta")
      console.log("Usuario no encontrado");
      res.status(404).json({ error: "Credenciales incorrectas" });
    }
  });
}


// export async function newCliente(nombre, apellido, correo, telefono){
//   try {
//     connection.query('INSERT INTO Cliente(nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellido, correo, telefono])
//   } catch (error) {
//     console.error('Error:', error.message);
//   }
// }


// Simular clic en botón 1
// realizarConsulta(

//   'select * from estado;',

//   // 'UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 1',
//   1
// );

// // Simular clic en botón 2
// realizarConsulta(
//   'UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 2',
//   2
// );

// // Simular clic en botón 3
// realizarConsulta(
//   'UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 3',
//   3
// );

// // Simular clic en botón 4
// realizarConsulta(
//   'UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 4',
//   4
// );



















// Version HTML
// import connection from "./db.js";

// // Manejar el clic en Botón 1
// document.getElementById('boton1').addEventListener('click', () => {
//     realizarConsulta('UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 1');
//     // connection.query("select * from usuarios", function(error, results) {
//     //     if(error)
//     //         throw(error)
//     //     results.forEach(Element => {
//     //         console.log(results);
//     //     });
//     // });
//   });
  
//   // Manejar el clic en Botón 2
//   document.getElementById('boton2').addEventListener('click', () => {
//     realizarConsulta('UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 2');
//   });
  
//   // Manejar el clic en Botón 3
//   document.getElementById('boton3').addEventListener('click', () => {
//     realizarConsulta('UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 3');
//   });
  
//   // Manejar el clic en Botón 4
//   document.getElementById('boton4').addEventListener('click', () => {
//     realizarConsulta('UPDATE estado SET aprobado = true, rechazado = false, observado = true WHERE id_estado = 4');
//   });
  
//   // Función para realizar la solicitud al backend
//   function realizarConsulta(consulta) {
//     fetch('./ejecutarConsulta', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ consulta }),
//     })
//     .then((response) => response.json())
//     .then((data) => {
//       // En este punto, puedes manejar la respuesta del backend si es necesario
//       // Por ejemplo, puedes mostrar un mensaje de éxito en la página
//       alert('Consulta ejecutada correctamente');
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
//   }
  