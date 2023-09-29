 document.getElementById('formReg').addEventListener('submit', async function(evento) {
    console.log("flaco hice click");
    evento.preventDefault();
    const nombre = document.getElementById('FormNameInput').value;
    const apellido = document.getElementById('FormSurnameInput').value;
    const correo = document.getElementById('FormNewEmailInput').value;
    const contrasenia = document.getElementById('FormNewPasswordInput').value;
    const telefono = document.getElementById('FormPhoneInput').value;
    const diaNacimiento = document.getElementById('FormDayInput').value;
    const mesNacimiento = document.getElementById('FormMonthInput').value;
    const añoNacimiento = document.getElementById('FormYearInput').value;
    console.log(nombre);
    if(nombre === "" || apellido === "" || correo === "" || contrasenia == "" || telefono === "" || diaNacimiento === "" || mesNacimiento === "" || añoNacimiento === ""){
      alert("Todos los campos deben ser completados");
      evento.preventDefault();
    } else {
      const fechaNacimiento = `${añoNacimiento}:${mesNacimiento}:${diaNacimiento}`;
      const datos = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        contrasenia: contrasenia,
        telefono: telefono,
        fechaNacimiento: fechaNacimiento
      };
  
      try {
        const res = await fetch('http://localhost:7777', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });
  
        if (res.ok) {
          // La solicitud fue exitosa, redireccionar al usuario a la página de inicio
          window.location.href = '/inicio';
        } else {
          // La solicitud falló, manejar el error mostrando el mensaje del servidor
          const responseJson = await res.json();
          alert(responseJson.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
  
  // document.getElementById('inisiarSesion').addEventListener('click', async function (evento){
  //   const correo = document.getElementById('FormEmailInput').value;
  //   const contrasenia = document.getElementById('FormPasswordInput').value;
  
  //   if (correo === "" || contrasenia === "") {
  //     alert("Completa todos los campos ");
  //     evento.preventDefault();
  //   } else {
  //     const datos = {
  //       correo: correo,
  //       contrasenia: contrasenia
  //     };
  
  //     try {
  //       const res = await fetch('http://localhost:7777/Login', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(datos)
  //       });
  
  //       if (res.ok) {
  //         // La solicitud fue exitosa, redireccionar al usuario a la página de inicio
  //         window.location.href = '/inicio';
  //       } else {
  //         // La solicitud falló, manejar el error
  //         alert("Error en la autenticación");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  // });  