import connection from './db/db.mjs';
import express from 'express';
import { obtenerInfoProspectos } from './script.mjs';
import { error } from 'console';  

const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  // Solucion nefasta
  if (req?.session?.passport?.user) {
    // Si el usuario está autenticado, permite el acceso a la siguiente ruta
    return next();
  }
  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  res.redirect('/');
}

router.use((req, res, next) => {
  obtenerInfoProspectos(req, res, (error, id, nombre, plazo) => {
    if (error) {
      // Maneja el error aquí
      console.error('Error al obtener los nombres de los prospectos: ' + error);
      // Puedes redirigir a una página de error o realizar otra acción adecuada
    } else {
      res.locals.navData = [id, nombre, plazo];
      //res.locals.navData = ;
      next();
      
    }
  });

  //try {
  //  const prospectoData = mostrarInfoProspectos(req, res); // Llama a la función para obtener los datos
  //  res.locals.prospectoData = prospectoData;
  //  res.render("pages/prospecto", { pageTitle: 'Crear Prospecto' });
  //} catch (error) {
  //  console.error('Error al obtener la información de los prospectos: ' + error);
  //  
  //}

  

  //mostrarInfoProspectos(req, res, (error, prospectoData) )
});




router.get('/', (req, res) => {
  res.render("index", { pageTitle: 'Tracking Comercial' });
});

// Ruta protegida que solo se puede acceder si el usuario está autenticado
router.get('/inicio', (req, res) => {
  res.render("pages/inicio", { pageTitle: 'Inicio'});
});

// Ruta protegida que solo se puede acceder si el usuario está autenticado
router.use('/crearProspecto', (req, res) => {
  res.render("pages/crearProspecto", { pageTitle: 'Crear Prospecto' });
});


router.use('/prospecto', (req, res) => {
  res.render("pages/prospecto", { pageTitle: 'Prospecto' });
});

// <% prospectoData.forEach(row => { %>
//  <li> <%= nombreProspecto %></li>
//<% }); %>

// Ruta protegida que solo se puede acceder si el usuario está autenticado
router.get('/misProspectos', (req, res) => {
  res.render("pages/misProspectos", { pageTitle: 'Inicio'});
});

//router.get('/mostrar-datos', isAuthenticated, (req, res) => {
//  connection.query('SELECT * FROM cliente', (error, results) => {
//    if (error) {
//      console.error('Error al consultar la base de datos: ' + error);
//      return res.status(500).send('Error al consultar la base de datos');
//    }
//
//    res.render('mostrar-datos', { data: results });
//  });
//});

export default router;
