document.addEventListener('DOMContentLoaded', function() {
    var aceptarBtn = document.getElementById('AceptarProspecto');

    aceptarBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        const ID_Prospecto = aceptarBtn.getAttribute('data-ID_Prospecto');
        const Cliente_Empleado = aceptarBtn.getAttribute('data-Cliente_Empleado');
        const Correo = aceptarBtn.getAttribute('data-correo');

        try {
            const response = await fetch(`https://generaciont-tracking-comercial-dev-apde.2.us-1.fl0.io/asignarProspecto/${ID_Prospecto}/${Cliente_Empleado}/${Correo}`, {
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