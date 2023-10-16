document.addEventListener('DOMContentLoaded', function() {
    var aceptarBtn = document.getElementById('AceptarProspecto');

    aceptarBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        const ID_Prospecto = aceptarBtn.getAttribute('data-ID_Prospecto');
        const Cliente_Empleado = aceptarBtn.getAttribute('data-Cliente_Empleado');
        const Correo = aceptarBtn.getAttribute('data-correo');

        try {
            const response = await fetch(`http://localhost:7777/asignarProspecto/${ID_Prospecto}/${Cliente_Empleado}/${Correo}`, {
                method: 'POST'
            });
            if(response.status == 200){
                Swal.fire({
                    title: "Prospecto Aceptado",
                    text: "El prospecto fua asignado correctamente",
                    icon:"success",
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = '/ruta/misProspecto';
                })
            }else{
                Swal.fire({
                    title: "Error",
                    text: "Ocurrio un error al asignar el prospecto",
                    icon: "error"
                })
            }
        } catch (error) {
            console.error(error);
        }

    });
});