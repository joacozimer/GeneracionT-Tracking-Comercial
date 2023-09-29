import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { newUser, selectUser } from './script.mjs';

// Convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory path from the file path
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(cors());

// Set the full path to the "index.html" file
app.use(express.static(path.join(__dirname, 'build')));

// app.post('/ejecutarConsulta', (req, res) => {
//   res.json({ message: 'Query executed successfully' });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/Login', async (req, res) => {
  const { correo, contraseña } = req.body;
  const respuesta = {
    datosRecibidos: {
      correo,
      contraseña
    }
  };
  selectUser(correo, contraseña, res)
    .then(response => {
      // Maneja la respuesta aquí
      if (res.err) {
        // Muestra un mensaje de error al usuario
        alert(res.err);
      } else {
        // Realiza alguna acción en caso de éxito
        console.log("Login exitoso");
        // Puedes redirigir o hacer cualquier otra acción necesaria aquí
      }
    })
    .catch(error => {
      console.error(error);
      // Maneja errores de la llamada a selectUser
    });
  console.log(respuesta);
});



app.post('/', (req, res) => {
 const{ nombre, apellido, correo, contraseña, telefono, fechaNacimiento } = req.body;
 const respuesta = {
  datosRecibidos: {
    nombre, 
    apellido, 
    correo, 
    contraseña, 
    telefono, 
    fechaNacimiento
  }
 };
  newUser(
    req.body.nombre, 
    req.body.apellido, 
    req.body.correo, 
    req.body.contraseña, 
    req.body.telefono, 
    req.body.fechaNacimiento
  );
  res.json(respuesta);
  console.log(respuesta);
});