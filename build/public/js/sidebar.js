const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

const WIDTH_THRESHOLD = 199.78;

toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
    content.classList.toggle('collapsed');
});


function verificarAnchos() {
    const elementos = document.querySelectorAll('.form__campo_container');
    elementos.forEach(elemento => {
        const estilos = getComputedStyle(elemento);
        const ancho = parseFloat(estilos.getPropertyValue('width'));
        if (ancho <= WIDTH_THRESHOLD) {
            elemento.classList.add('form__campo_container_show-sidebar');
        } else {
            elemento.classList.remove('form__campo_container_show-sidebar');
        }
    });
}

// Ejecutar la función inicialmente
verificarAnchos();

// Establecer un intervalo para ejecutar la función cada cierto tiempo (por ejemplo, cada 1000 ms o 1 segundo)
setInterval(verificarAnchos, 10); // Puedes ajustar el intervalo según tus necesidades
