const selectDia = document.getElementById("FormDayInput");
const selectMes = document.getElementById("FormMonthInput");
const selectAnio = document.getElementById("FormYearInput");

const anioActual = new Date().getFullYear();
const minAnio = anioActual - 120;

function crearOpciones(orden, select, inicio, fin) {
  select.innerHTML = ""; // Limpia las opciones existentes del HTML
  switch (orden){
    case 0:
        for (let i = inicio; i <= fin; i++) {
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = i;
            nuevaOpcion.textContent = i;
            select.appendChild(nuevaOpcion);
        }
        break;
    case 1:
        for (let i = fin; i >= inicio; i--) {
            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = i;
            nuevaOpcion.textContent = i;
            select.appendChild(nuevaOpcion);
        }
        break;
    default:
        console.log("ERROR");
        break;
  }

}

function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
}

function actualizarDias() {
  const mesSeleccionado = parseInt(selectMes.value);
  let diasMaximos = 31;

  if (mesSeleccionado === 2) {
    const anioSeleccionado = parseInt(selectAnio.value);
    diasMaximos = esBisiesto(anioSeleccionado) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(mesSeleccionado)) {
    diasMaximos = 30;
  }

  crearOpciones(0,selectDia, 1, diasMaximos);
}

selectMes.addEventListener("change", actualizarDias);
selectAnio.addEventListener("change", actualizarDias);

crearOpciones(0,selectDia, 1, 31);
crearOpciones(0,selectMes, 1, 12);
crearOpciones(1,selectAnio, minAnio, anioActual);
