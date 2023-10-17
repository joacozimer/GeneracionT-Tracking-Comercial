document.getElementById('formReg').addEventListener('submit', async function(evento) {

    const nombre = document.getElementById('FormNameInput').value;
    const apellido = document.getElementById('FormSurnameInput').value;
    const Correo = document.getElementById('FormNewEmailInput').value;
    const contrasenia = document.getElementById('FormNewPasswordInput').value;
    const telefono = document.getElementById('FormPhoneInput').value;
    const diaNacimiento = document.getElementById('FormDayInput').value;
    const mesNacimiento = document.getElementById('FormMonthInput').value;
    const añoNacimiento = document.getElementById('FormYearInput').value;
    evento.preventDefault();

    if(nombre === "" || apellido === "" || Correo === "" || contrasenia == "" || telefono === "" || diaNacimiento === "" || mesNacimiento === "" || añoNacimiento === ""){
      Swal.fire({
        title:'Campos Vacios',
        text:'Hay campos vacios complete todos los campos antes de continuar',
        icon:'error'
      })
    } else {
      const fechaNacimiento = `${añoNacimiento}:${mesNacimiento}:${diaNacimiento}`;
      const datos = {
        nombre: nombre,
        apellido: apellido,
        Correo: Correo,
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
          Swal.fire({
            title: 'Prospecto creado',
            text: 'El prospecto se ha creado exitosamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
        } else {
          // La solicitud falló, manejar el error mostrando el mensaje del servidor
          const responseJson = await res.json();
          Swal.fire({
            title:'Error en el registro',
            text:'El Correo que usted esta intentando registrar ya se encuantra registrado, pruebe con otro mail',
            icon:'error'
          })
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });
  