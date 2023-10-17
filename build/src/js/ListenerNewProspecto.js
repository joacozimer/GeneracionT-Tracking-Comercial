document.getElementById('nuevoProspecto').addEventListener('click', async function(evento) {
    evento.preventDefault();


    const nombre = document.getElementById('FormNameProjectInput').value;
    const plazo = document.getElementById('FormTimeProjectInput').value;
    const presupuestoValue = document.getElementById('FormMoneyProjetInput').value;
    const espTecnica = document.getElementById('FormTecProjectInput').value;
    const descripcion = document.getElementById('FormDesProjectInput').value; 
    const presupuesto = presupuestoValue.replace(/\./g, '');
    const ArchivoInput = document.getElementById('FormFileInput');
    const Archivos = ArchivoInput.files;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('plazo', plazo);
    formData.append('presupuesto', presupuesto);
    formData.append('espTecnica', espTecnica);
    formData.append('descripcion', descripcion);

    for (let i = 0; i < Archivos.length; i++) {
        formData.append('Archivo', Archivos[i]);
    }

    if (nombre === "" || plazo === "" || presupuesto === "" || espTecnica === "" || descripcion === "") {
        Swal.fire({
            title: 'Campos vacios',
            text: 'Hay campos vacíos. Por favor complete todos los campos antes de continuar',
            icon: 'error',
            showConfirmButton: true,
        });
        return;
    } else if (Archivos.length === 0) {
        Swal.fire({
            title: 'Advertencia',
            text: 'El campo de archivo está vacío. ¿Deseas continuar de todas formas?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('http://localhost:7777/newProspecto', {
                        method: 'POST',
                        body: formData
                    });

                    if(response.status === 500){
                        Swal.fire({
                            title: "Ups ...",
                            text: "Se han subido muchos archivos prueba subiendo un maximo de 5",
                            icon: "error"
                        })
                    }else if (response.status === 200) {
                        Swal.fire({
                            title: 'Prospecto creado',
                            text: 'El prospecto se ha creado exitosamente.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1000
                        }).then(() => {
                            window.location.href = "/ruta/inicio";
                        });
                    } else {
                        Swal.fire({
                            title: 'Error al crear el prospecto',
                            text: 'Ha ocurrido un error al crear el prospecto.',
                            icon: 'error',
                            showConfirmButton: true,
                        });
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        title: 'Error en la solicitud',
                        text: error.message,
                        icon: 'error',
                        showConfirmButton: true,
                    });
                }
            }
        });
    }else{
        try {
            const response = await fetch('http://localhost:7777/newProspecto', {
                method: 'POST',
                body: formData
            });

            console.log(response.status);

            if(response.status === 500){
                Swal.fire({
                    title: "Ups ...",
                    text: "Se han subido muchos Archivo prueba subiendo un maximo de 5",
                    icon: "error"
                })
            }else if (response.status === 200) {
                Swal.fire({
                    title: 'Prospecto creado',
                    text: 'El prospecto se ha creado exitosamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    window.location.href = "/ruta/misProspecto";
                });
            } else {
                Swal.fire({
                    title: 'Error al crear el prospecto',
                    text: 'Ha ocurrido un error al crear el prospecto.',
                    icon: 'error',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error en la solicitud',
                text: error.message,
                icon: 'error',
                showConfirmButton: true,
            });
        }
    }
    return;
});
