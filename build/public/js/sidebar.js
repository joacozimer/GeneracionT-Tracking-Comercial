const toggleSidebarButton = document.getElementById('toggleSidebar');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

toggleSidebarButton.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
    content.classList.toggle('collapsed');
    console.log("holaaa");
});