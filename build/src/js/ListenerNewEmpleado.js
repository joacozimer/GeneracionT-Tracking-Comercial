document.getElementById('nuevoEmpleadoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const Correo = document.getElementById('Correo').value;
    const Tipo_Empleado = parseInt(document.getElementById('Tipo_Empleado').value);

    if(Correo === "" || isNaN(Tipo_Empleado) || Tipo_Empleado === 0){
        Swal.fire({
            title: "Campos vacíos o Tipo de Empleado no seleccionado",
            icon: "error"
        })
    } else {
        try {
            const response = await fetch(`http://localhost:7777/nuevoEmpleado/${Correo}/${Tipo_Empleado}`, {
                method: 'POST'
            });
            if(response.status == 200){
                Swal.fire({
                    title: "El Usuario ya es un Empleado",
                    icon: "error"
                })
                return;
            } else if(response.status == 201) {
                Swal.fire({
                    title: 'Prospecto creado',
                    text: 'El prospecto se ha creado exitosamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    window.location.href = "/ruta/administrarEmpleado";
                });
            } else {
                Swal.fire({
                    title: "Ocurrió un error",
                    icon: "error",
                })
                return;
            }
        } catch(error) {
            console.error('Error de red:', error);
        }
    }
});