document.addEventListener('DOMContentLoaded', function() {

    var enviar = document.getElementById("modicarProspectoTec");

    enviar.addEventListener('click', async function(event) {
        event.preventDefault();
        const ID_Prospecto = enviar.getAttribute('data-ID_Prospecto');
        const propuestaTecnica = document.getElementById('FormPropuestaTecnicaProjectInput').value;
        let Aceptacion = document.getElementById('FormAprobacionInput').value;
        console.log(Aceptacion);
        
        if(Aceptacion === "Blank"){
            Aceptacion = 1;
        }else if(Aceptacion === "Aprobado") {
            Aceptacion = 2;
        }else if(Aceptacion === "Rechazado") {
            Aceptacion = 3;
        }else {
            Aceptacion = 4;
        }

        try {
            const response = await fetch(`http://localhost:7777/editarProspecto/${ID_Prospecto}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propuestaTecnica: propuestaTecnica,
                    Aceptacion: Aceptacion
                })
            });
            if (response.status === 200) {
                Swal.fire({
                    title:'Los datos se enviaron correctamente',
                    text: 'Los datos que ha ingresado se guardaron correctamente',
                    icon:'success',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() =>{
                    window.location.href = '/ruta/misProspecto';
                })
            } else {
                Swal.fire({
                    title:'Ocurrio un error',
                    text: 'Ha ocurrido un error al intentar guardar los cambios',
                    icon:'error',
                })
            }
        } catch (error) {
            console.error("Error: " + error);
        }

    })
});




document.addEventListener('DOMContentLoaded', function() {

    var enviar = document.getElementById("modicarProspectoCom");

    enviar.addEventListener('click', async function(event) {
        event.preventDefault();
        const ID_Prospecto = enviar.getAttribute('data-ID_Prospecto');
        const propuestaTecnica = document.getElementById('FormPropuestaTecnicaProjectInput').value;
        let Aceptacion = document.getElementById('FormAprobacionInput').value;
        console.log(Aceptacion);
        
        if(Aceptacion === "Blank"){
            Aceptacion = 1;
        }else if(Aceptacion === "Aprobado") {
            Aceptacion = 2;
        }else if(Aceptacion === "Rechazado") {
            Aceptacion = 3;
        }else {
            Aceptacion = 4;
        }

        try {
            const response = await fetch(`http://localhost:7777/editarProspecto/${ID_Prospecto}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    propuestaTecnica: propuestaTecnica,
                    Aceptacion: Aceptacion
                })
            });
            if (response.status === 200) {
                Swal.fire({
                    title:'Los datos se enviaron correctamente',
                    text: 'Los datos que ha ingresado se guardaron correctamente',
                    icon:'success',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() =>{
                    window.location.href = '/ruta/misProspecto';
                })
            } else {
                Swal.fire({
                    title:'Ocurrio un error',
                    text: 'Ha ocurrido un error al intentar guardar los cambios',
                    icon:'error',
                })
            }
        } catch (error) {
            console.error("Error: " + error);
        }

    })
});