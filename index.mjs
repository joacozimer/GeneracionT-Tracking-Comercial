import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { newUser, obtenerID_ClienteOEmpleadoPorCorreo, obtenerArchivo  } from './server/script.mjs';
import viewsRouter from './server/views.mjs';
import multer from 'multer';
import connection from './server/db/db.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import flash from 'express-flash';

// Convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
// Derive the directory path from the file path
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'build', 'public')));
// Configurar una ruta estática para los archivos JavaScript en src/js
app.use('/scripts', express.static(path.join(__dirname, 'build', 'src', 'js')));

// Configurar express-session
app.use(session({
  secret: 'tu_secreto',
  resave: false,  
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('', viewsRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'build', 'src', 'views'));


passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},
  async function(username, password, done) {
    console.log(username);
    try {
      const [user] = await connection.query('SELECT * FROM Usuario WHERE Correo = ? AND contrasenia = ?', [username, password]);
      console.log("Hola");
      if (!user.length) {
        // Usuario no encontrado en la base de datos
        console.log('Usuario no encontrado');
        //res.status(404);
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const dbPassword = user[0].contrasenia;

      if (password !== dbPassword) {
        // Contrasenia incorrecta
        console.log("contraseña incorrecta");
        return done(null, false, { message: 'Contrasenia incorrecta' });
      }

      // Autenticación exitosa, pasa al siguiente middleware
      console.log("entro");
      return done(null, user[0]);
    } catch (error) {
      console.log("error");
      return done(error);
    }
  }
));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.Correo);
});

passport.deserializeUser(async function(Correo, done) {
  try {
    const [user] = await connection.query('SELECT * FROM Usuario WHERE Correo = ?', [Correo]);

    if (!user || user.length === 0) {
      // Si no se encuentra un Usuario, puedes manejar el caso aquí
      return done(null, false);
    }

    // Si se encuentra un Usuario válido, lo pasas como resultado al próximo middleware
    return done(null, user[0]);
  } catch (error) {
    console.error("Error:", error);
    return done(error);
  }
});

app.post('/Login', passport.authenticate('local', {
  successRedirect: '/ruta/inicio',
  failureRedirect: '/',
  failureFlash: true
}));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define la carpeta donde se guardarán los archivos
    cb(null, 'files/'); // Crea una carpeta llamada 'uploads' en tu proyecto
  },
  filename: function (req, file, cb) {
    // Define el nombre del archivo en el servidor
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/newProspecto', upload.array('Archivo', 5), async (req, res) => {
  // Obtener los datos del formulario
  const nombre = req.body.nombre;
  const plazo = req.body.plazo;
  const presupuesto = req.body.presupuesto;
  const espTecnica = req.body.espTecnica;
  const descripcion = req.body.descripcion;

  const Usuario = req.user;
  const ID = await obtenerID_ClienteOEmpleadoPorCorreo(Usuario.Correo, Usuario.Tipo_Usuario);
  console.log(Usuario.Tipo_Usuario + ID);
  // Procesar los archivos adjuntos
  const Archivos = req.files; // Aquí están los archivos
  if (!Array.isArray(Archivos)) {
    console.error('Los archivos no son una matriz iterable');
    return res.status(500).json({ error: 'Error en el servidor' });
  }
  
  try {
    // Iniciar la transacción
    await connection.beginTransaction();
  
    // Guardar los datos del formulario en la tabla "prospecto"
      const insertProspectoResult = await connection.query(
        'INSERT INTO Prospecto (nombreProspecto, plazoTiempoDelProspecto, presupuestoDelProspecto, especificacionTecnica, descripcionDeLaNecesidad, Estado, Aceptacion, ID_Cliente) VALUES (?, ?, ?, ?, ?, 1, 1, ?)',
        [nombre, plazo, presupuesto, espTecnica, descripcion, ID]
      );  
    const [rows, fields] = await connection.query('SELECT MAX(ID_Prospecto) as ID_max FROM Prospecto');
    const ID_Prospecto = rows[0].ID_max;
    console.log("Ultimo ID: " + ID_Prospecto);
  
    for (const Archivo of Archivos) {
      await connection.query('INSERT INTO Archivo (ruta, ID_Prospecto) VALUES (?, ?)', [Archivo.path, ID_Prospecto]);
    }
  
    await connection.commit();
    res.status(200).json({ message: 'Prospecto y Archivo cargados exitosamente.' });
    
  } catch (error) {
    console.error('Error:', error);
    await connection.rollback();
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/', async (req, res) => {
  const { nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento } = req.body;

  try {
    // Consulta si el Correo electrónico ya existe en la base de datos
    const [existingUser] = await connection.query('SELECT * FROM Usuario WHERE Correo = ?', [Correo]);

    if (existingUser.length > 0) {
      // Si el Correo ya existe, envía una respuesta de error
      return res.status(409).json({ error: 'El Correo ya está registrado. Utiliza otro Correo.' });
    }

    // Si el Correo no existe, procede con el registro
    const response = await newUser(nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento);
    const respuesta = {
      datosRecibidos: {
        nombre, apellido, Correo, contrasenia, telefono, fechaNacimiento
      }
    };
    res.status(200).json(respuesta);
  } catch (error) {
    console.error(error);

    // Manejo de otros errores
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'El Correo ya está registrado. Utiliza otro Correo.' });
    } else {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
});

app.post('/editarProspecto/:ID_Prospecto', async (req, res) => {
  const ID_Prospecto = req.params.ID_Prospecto;
  const propuestaTecnica = req.body.propuestaTecnica;
  const Aceptacion = req.body.Aceptacion;
  const Tipo_Empleado = req.user.Cliente_Empleado;
  const Estado = (await connection.query("select P.Estado From Prospecto P where P.ID_Prospecto = ?", [ID_Prospecto]))[0][0].Estado;
  try {
    await connection.query("START TRANSACTION");
    // Verificar si la Aceptación es 2 y actualizar propuestaTecnica
    if (Tipo_Empleado === 2 && Estado === 1) {
      await connection.query("UPDATE Prospecto SET propuestaTecnica = ?, Estado = 2 WHERE ID_Prospecto = ?", [propuestaTecnica, ID_Prospecto]);
    } else if (Tipo_Empleado === 3 && Estado === 2){
      const nuevoEstado = (Aceptacion === 2)? 4: 1
      await connection.query("UPDATE Prospecto SET propuestaTecnica = NULL, Aceptacion = ?, Estado = ? WHERE ID_Prospecto = ?", [Aceptacion, nuevoEstado, ID_Prospecto]);
    }
    await connection.query("COMMIT");
    res.status(200).send('Prospecto actualizado correctamente');
  } catch (error) {
    console.error(error);
    await connection.query("ROLLBACK");
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/Prospecto/:ID_Prospecto', async (req, res) => {
  const ID_Prospecto = req.params.ID_Prospecto;
  try {
      const Archivo = await obtenerArchivo(ID_Prospecto);
      console.log('Archivos obtenidos:', Archivo);
      res.render('pages/Prospecto', { Archivo });
  } catch (error) {
      console.error('Error al obtener archivos:', error);
      res.status(500).send('Error al obtener archivos');
  }
});

app.post('/nuevoEmpleado/:Correo/:Tipo_Empleado', async (req, res) => {
  const Correo = req.params.Correo;
  const Tipo_Empleado = req.params.Tipo_Empleado; 
  
try {
  const result = (await connection.query("SELECT * FROM Empleado WHERE Correo_Empleado = ?", [Correo]))[0];
  if (result.length > 0) {
    res.status(200).send("El Usuario ya es un Empleado");
  } else {
    await connection.query("CALL MoverUsuarioDeClienteAEmpleado(?, ?)", [Correo, Tipo_Empleado]);
    res.status(201).send("Nuevo Empleado creado con éxito");
  }
    } catch (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).send("Error en la consulta");
    }
});

app.post('/asignarProspecto/:ID_Prospecto/:Cliente_Empleado/:Correo', async (req, res) => {
  const ID_Prospecto = req.params.ID_Prospecto;
  const Cliente_Empleado = req.params.Cliente_Empleado
  console.log("CLIENTE EMPLEADO: " + Cliente_Empleado);
  try {
    if(Cliente_Empleado == 2){
      const ID_Empleado_Tecnico = (await connection.query("SELECT ID_Empleado FROM Empleado WHERE Correo_Empleado = ?", [req.params.Correo]))[0][0].ID_Empleado;
      await connection.query("UPDATE Prospecto SET ID_Empleado_Tecnico = ? WHERE ID_Prospecto = ?", [ID_Empleado_Tecnico, ID_Prospecto]);
    } else if(Cliente_Empleado == 3){
      const ID_Empleado_Comercial = (await connection.query("SELECT ID_Empleado FROM Empleado WHERE Correo_Empleado = ?", [req.params.Correo]))[0][0].ID_Empleado;
      await connection.query("UPDATE Prospecto SET ID_Empleado_Comercial = ? WHERE ID_Prospecto = ?", [ID_Empleado_Comercial, ID_Prospecto]);
    }
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send('Error interno del servidor');
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});