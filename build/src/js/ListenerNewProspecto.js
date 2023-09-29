//document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nuevoProspecto').addEventListener('click', async function(evento) {
        const nombre = document.getElementById('FormNameProjectInput').value;
        const plazo = document.getElementById('FormTimeProjectInput').value;
        const presupuesto = document.getElementById('FormMoneyProjetInput').value;
        const espTecnica = document.getElementById('FormTecProjectInput').value;
        const descripcion = document.getElementById('FormDesProjectInput').value;

        const archivoInput = document.getElementById('FormFileInput');
        const archivos = archivoInput.files; // Obtén todos los archivos seleccionados

        console.log("Evento de clic en 'Crear Prospecto' activado");


        if (nombre === "" || plazo === "" || presupuesto === "" || espTecnica === "" || descripcion === "") {
            alert("Hay algunos campos que deben ser completados");
            evento.preventDefault();
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('plazo', plazo);
        formData.append('presupuesto', presupuesto);
        formData.append('espTecnica', espTecnica);
        formData.append('descripcion', descripcion);

         //Agregar todos los archivos seleccionados al formulario
        for (let i = 0; i < archivos.length; i++) {
            formData.append('archivos', archivos[i]);
            console.log(archivos[i] + ":" + i);
        }
        
        try {
            const response = fetch('http://localhost:7777/newProspecto', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                //alert("Prospecto creado exitosamente");
                window.location.href("/crearProspecto");
            } else {
                alert("Error al crear el prospecto");
            }
        } catch (error) {
            console.error(error);
            alert("Error en la solicituuud");
        }
    });
//});
