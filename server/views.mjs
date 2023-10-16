import express from 'express';
import { obtenerInfoProspecto, obtenerDatosProspectoPorID, obtenerEmpleado, obtenerProspecto} from './script.mjs';

const router = express.Router();

// Middleware para verificar si el Usuario está autenticado


router.use("/ruta", (req, res, next) => {
  const Usuario = req.user;

  if(req.isAuthenticated() && Usuario.Tipo_Usuario !== 'Admin'){
    obtenerInfoProspecto(req, res, (error, ProspectoData) => {
      //console.log(prospectoData);
      if (error) {
        // Maneja el error aquí
        console.error('Error al obtener los nombres de los prospectos: ' + error);
        // Puedes redirigir a una página de error o realizar otra acción adecuada
      } else {
        res.locals.user = req.user;
        res.locals.ProspectoData = ProspectoData;
        //console.log(req.user.Tipo_Usuario);
        next();
      }
    });
  } else{
    
      res.locals.user = req.user;
      //res.locals.ProspectoData = ProspectoData;
      //console.log(req.user.Tipo_Usuario);
      next();
    }
});



router.get('/', (req, res) => {
  res.render("index", { pageTitle: 'Tracking Comercial'});
});

// Ruta protegida que solo se puede acceder si el Usuario está autenticado
router.use('/ruta/inicio', (req, res) => {
  //autenticarYEnrutarPorTipo_Usuario(req, res, 'pages/inicio', 'pages/crearProspecto', 'pages/inicio');
  if (req.isAuthenticated()) {
    res.render("pages/inicio", { pageTitle: 'Inicio' });
  } else {
    res.redirect('/');
  }
})


// Ruta protegida que solo se puede acceder si el Usuario está autenticado
router.use('/ruta/crearProspecto', (req, res) => {
  if (req.isAuthenticated()) {
    const Usuario = req.user;
    if(Usuario && Usuario.Tipo_Usuario === 'Cliente'){
      res.render("pages/crearProspecto", { pageTitle: 'Crear Prospecto' });
    }else{
      res.redirect('/ruta/inicio');
    }
  } else {
    res.redirect('/');
  }
});


router.use('/ruta/Prospecto/:ID_Prospecto/:nombreDeProspecto', async (req, res) => {
  const ID_Prospecto = req.params.ID_Prospecto;
  const nombreDeProspecto = req.params.nombreDeProspecto;

  try {
    // Utiliza la función obtenerDatosProspectoPorId para obtener los datos del prospecto
    obtenerDatosProspectoPorID(ID_Prospecto, (error, Prospecto) => {
      if (error) {
        console.error('Error al obtener los datos del prospecto: ' + error);
        console.log(Prospecto);
        res.redirect('/'); // Maneja el error redirigiendo a una página de error o realizando otra acción adecuada
      } else {
        if (req.isAuthenticated()) {
          //const Tipo_Archivo = obtenerIconoPorExtension()
          // console.log(prospecto);
          res.render("pages/Prospecto", {
            pageTitle: 'Prospecto',
            titulo: nombreDeProspecto,
            Usuario: req.user,
            Prospecto: Prospecto, // Pasa los datos del prospecto a la vista
          });
          console.log(Prospecto);
        } else {
          res.redirect('/');
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener los datos del prospecto: ' + error);
    res.redirect('/'); // Maneja el error redirigiendo a una página de error o realizando otra acción adecuada
  }
});


// Ruta protegida que solo se puede acceder si el Usuario está autenticado
router.get('/ruta/misProspecto', (req, res) => {
  if (req.isAuthenticated()) {
    res.render("pages/misProspecto", { pageTitle: 'Mis Prospectos' });
  } else {
    res.redirect('/');
  }
});

router.get('/ruta/administrarEmpleado', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Empleado = await obtenerEmpleado();
      res.render('pages/listaEmpleado', { pageTitle: 'Revisar Empleado', Empleado });
    } catch (error) {
      console.error('Error al obtener Empleado:', error);
      res.status(500).send('Error interno del servidor');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/ruta/asignarProspecto', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Empleado = await obtenerEmpleado();
      res.render('pages/asignarProspecto', { pageTitle: 'Asignar Prospecto' });
    } catch (error) {
      console.error('Error al obtener Empleado:', error);
      res.status(500).send('Error interno del servidor');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/ruta/nuevoEmpleado', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Empleado = await obtenerEmpleado();
      res.render('pages/nuevoEmpleado', { pageTitle: 'Revisar Empleado', Empleado });
    } catch (error) {
      console.error('Error al obtener Empleado:', error);
      res.status(500).send('Error interno del servidor');
    }
  } else {
    res.redirect('/');
  }
});

router.get('/ruta/ProspectoDisponibles', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const Prospecto = await obtenerProspecto(req);
      console.log(Prospecto);
      res.render('pages/ProspectoDisponibles', { pageTitle: 'Prospectos Disponibles', Prospecto });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).send('Error interno del servidor');
    }
  } else {
    res.redirect('/');
  }
})

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error(err);
    }
    
    // Verificar si el Usuario está en la ruta raíz ("/")
    if (req.path === '/') {
      req.isAuthenticated() == false;
      console.log("Desautenticado");
    }
    
    res.redirect('/'); // Redirige al Usuario a la página de inicio u otra página después de cerrar la sesión.
  });
});

export default router;