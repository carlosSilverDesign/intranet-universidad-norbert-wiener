document.addEventListener('DOMContentLoaded', () => {
  const userDropdownTrigger = document.getElementById('userDropdownTrigger');
  const dropdownMenu = document.getElementById('dropdownMenu');

  // Toggle al hacer click en el contenedor del usuario
  userDropdownTrigger.addEventListener('click', (e) => {
    // Evita que el click se propague al document
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
  });

  // Cerrar el menú si se hace click fuera de él
  document.addEventListener('click', (e) => {
    if (!userDropdownTrigger.contains(e.target)) {
      dropdownMenu.classList.remove('active');
    }
  });

  // Evitar que al hacer click dentro del menú se cierre (opcional, dependiendo de la UX deseada)
  dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

