document.getElementById('inisiarSesion').addEventListener('submit', async function (evento){
    const Correo = document.getElementById('FormEmailInput').value;
    const contrasenia = document.getElementById('FormPasswordInput').value;
    evento.preventDefault();
  
    if (Correo === "" || contrasenia === "") {
      Swal.fire({
        title:'Campos Vacios',
        text:'Hay campos vacios complete todos los campos antes de continuar',
        icon:'error'
      })
    } else {
      const datos = {
        Correo: Correo,
        contrasenia: contrasenia
      };
  
      try {
        const res = await fetch('https://generaciont-tracking-comercial-dev-bqpp.1.us-1.fl0.io/Login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });
        if (res.ok) {
          window.location.href = '/ruta/inicio';
        } else {
          Swal.fire({
            title:'Usuario no encontrado',
            text:'El Usuario con el que esta intentado iniciar sesion no existe, pruebe otro correo o contraseña',
            icon:'error'
          })
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
});  