import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import { newUser, selectUser } from './server/script.mjs';
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
app.use('', viewsRouter);

// Configurar express-session
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: false
}));

passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},
  async function(username, password, done) {
    console.log(username);
    try {
      const [user] = await connection.query('SELECT * FROM Usuarios WHERE correo = ?', [username]);
      console.log("Hola");
      if (!user.length) {
        // Usuario no encontrado en la base de datos
        console.log('Usuario no encontrado');
        return done(null, false, { message: 'Usuario no encontrado' });
      }

      const dbPassword = user[0].contrasenia;

      if (password !== dbPassword) {
        // Contrasenia incorrecta
        console.log("Contraseña incorrecta");
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

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'build', 'src', 'views'));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.correo);
});

passport.deserializeUser(async function(correo, done) {
  try {
    const [user] = await connection.query('SELECT * FROM Usuarios WHERE correo = ?', [correo]);

    if (!user || user.length === 0) {
      // Si no se encuentra un usuario, puedes manejar el caso aquí
      return done(null, false);
    }

    // Si se encuentra un usuario válido, lo pasas como resultado al próximo middleware
    return done(null, user[0]);
  } catch (error) {
    console.error("Error:", error);
    return done(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/Login', passport.authenticate('local', {
  successRedirect: '/inicio',
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

app.post('/newProspecto', upload.array('archivos', 5), async (req, res) => {
  // Obtener los datos del formulario
  const nombre = req.body.nombre;
  const plazo = req.body.plazo;
  const presupuesto = req.body.presupuesto;
  const espTecnica = req.body.espTecnica;
  const descripcion = req.body.descripcion;

  // Procesar los archivos adjuntos
  const archivos = req.files; // Aquí están los archivos
  if (!Array.isArray(archivos)) {
    console.error('Los archivos no son una matriz iterable');
    return res.status(500).json({ error: 'Error en el servidor' });
  }
  
  
  try {
    // Iniciar la transacción
    await connection.beginTransaction();
  
    // Guardar los datos del formulario en la tabla "prospecto"
    const insertProspectoResult = await connection.query(
      'INSERT INTO prospecto (nombreProspecto, plazoTiempoDelProspecto, presupuestoDelProspecto, especificacionTecnica, descripcionDeLaNecesidad) VALUES (?, ?, ?, ?, ?)',
      [nombre, plazo, presupuesto, espTecnica, descripcion]
    );
    
    const [rows, fields] = await connection.query('SELECT MAX(prospecto_id) as max_id FROM prospecto');
    const prospectoId = rows[0].max_id;
    console.log("Ultimo id: " + prospectoId);
  
    for (const archivo of archivos) {
      await connection.query('INSERT INTO archivos (ruta, prospecto_id) VALUES (?, ?)', [archivo.path, prospectoId]);
    }
  
    res.status(200).json({ message: 'Prospecto y archivos cargados exitosamente.' });
  

    //const sql = "SELECT MAX(prospecto_id) as max_id FROM prospecto"
    //await connection.query(sql, (err, result) => {
    //  if (err) {
    //    // Maneja los errores aquí si es necesario
    //    console.error(err);
    //    return;
    //  }
    //  
    //  const prospectoId = result[0].max_id;
    //  //console.log("Ultimo id: " + prospectoId);
//
    //  for (const archivo of archivos) {
    //    connection.query('INSERT INTO archivos (ruta, prospecto_id) VALUES (?, ?)', [archivo.path, prospectoId]);
//
    //  }
    //res.status(200).json({ message: 'Prospecto y archivos cargados exitosamente.' });
      
    await connection.commit();
    
  
    //res.status(200).json({ message: 'Prospecto y archivos cargados exitosamente.' });
  } catch (error) {
    console.error('Error:', error);
    // Realizar un rollback en caso de error
    await connection.rollback();
    res.status(500).json({ error: 'Error en el servidor' });
  }
  
  
});

app.post('/', async (req, res) => {
  const { nombre, apellido, correo, contrasenia, telefono, fechaNacimiento } = req.body;

  try {
      const response = await newUser(nombre, apellido, correo, contrasenia, telefono, fechaNacimiento);
      const respuesta = {
          datosRecibidos: {
              nombre, apellido, correo, contrasenia, telefono, fechaNacimiento
          }
      };
      res.status(200).json(respuesta);
  } catch (error) {
      console.error(error);

      if (error.code === 'ER_DUP_ENTRY') {
          // Clave primaria (correo) duplicada, envía un estado 409 (Conflict) y un mensaje de error
          res.status(409).json({ error: 'El correo ya está registrado. Utiliza otro correo.' });
      } else {
          // Otro error, envía un estado 500 (Error interno del servidor) y un mensaje de error genérico
          res.status(500).json({ error: 'Error en el servidor' });
      }
  }
  // passport.authenticate('local')(req, res, function () {
  //   res.redirect('/inicio');
  // });
});

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Ruta protegida que solo se puede acceder si el usuario está autenticado
app.get('/inicio', passport.authenticate('local'), isAuthenticated, (req, res) => {
  // Ruta protegida
  res.send("test");
});
