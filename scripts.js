document.addEventListener('DOMContentLoaded', () => {
  const userDropdownTrigger = document.getElementById('userDropdownTrigger');
  const dropdownMenu = document.getElementById('dropdownMenu');

  // Toggle al hacer click en el contenedor del usuario
  if (userDropdownTrigger && dropdownMenu) {
    userDropdownTrigger.addEventListener('click', (e) => {
      // Evita que el click se propague al document
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });
  }

  // Cerrar el menú si se hace click fuera de él
  document.addEventListener('click', (e) => {
    if (userDropdownTrigger && dropdownMenu && !userDropdownTrigger.contains(e.target)) {
      dropdownMenu.classList.remove('active');
    }
  });

  // Evitar que al hacer click dentro del menú se cierre (opcional, dependiendo de la UX deseada)
  if (dropdownMenu) {
    dropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Lógica de Reordenamiento Automático (Grid Masonry) y Guardado en LocalStorage
  const grid = document.querySelector('.dashboard-grid');
  const toggleDragBtn = document.getElementById('toggleDragBtn');
  let sortableInstance = null;
  let isDragEnabled = false;

  if (grid) {
    // 1. Restaurar orden guardado previamente
    const savedOrder = localStorage.getItem('dashboardOrder');
    if (savedOrder) {
      try {
        const orderClasses = JSON.parse(savedOrder);
        // Reordenar los nodos en el DOM basado en el array de clases
        orderClasses.forEach(className => {
          const el = grid.querySelector('.card.' + className);
          if (el) grid.appendChild(el); 
        });
      } catch (e) {
        console.error('Error restaurando el orden:', e);
      }
    }

    // 2. Inicializar SortableJS
    if (typeof Sortable !== 'undefined') {
      sortableInstance = new Sortable(grid, {
        animation: 250, 
        disabled: true, 
        ghostClass: 'dragging', 
        filter: '.btn, a, button, input', 
        preventOnFilter: false,
        onSort: function () {
          // Guardar el nuevo orden dinámicamente extrayendo la clase identificadora (ej. card-next-class)
          const currentOrder = Array.from(grid.querySelectorAll('.card')).map(card => card.classList[1]);
          localStorage.setItem('dashboardOrder', JSON.stringify(currentOrder));
        }
      });
    }
  }

  // Lógica del botón Toggle "Reordenar Tarjetas"
  if (toggleDragBtn) {
    toggleDragBtn.addEventListener('click', () => {
      isDragEnabled = !isDragEnabled;
      if(sortableInstance) sortableInstance.option('disabled', !isDragEnabled);
      
      const toggleText = document.getElementById('toggleDragText');
      if (toggleText) {
        toggleText.textContent = isDragEnabled ? 'Modo Edición: Activo' : 'Modo Edición: Inactivo';
      } else {
        // Fallback orignal
        toggleDragBtn.textContent = isDragEnabled ? 'Guardar Cambios' : 'Activar Reordenamiento';
      }
      
      toggleDragBtn.style.backgroundColor = isDragEnabled ? '#0F848F' : '';
      toggleDragBtn.style.color = isDragEnabled ? '#fff' : '';

      // Feedback visual para el usuario
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.style.cursor = isDragEnabled ? 'grab' : 'default';
        card.style.border = isDragEnabled ? '2px dashed #0F848F' : '';
      });
    });
  }

  // Inicialización de Lottie
    const lottieContainer = document.getElementById('lottie-welcome-container');

    if (lottieContainer) {
        lottie.loadAnimation({
            container: lottieContainer, // El div donde se va a renderizar
            renderer: 'svg',            // Renderizado en SVG para máxima calidad
            loop: true,                 // ¿Se repite infinitamente?
            autoplay: true,             // ¿Inicia automáticamente?
            path: '/json/eye-progress.json'      // La ruta a tu archivo JSON exportado
        });
    }


});

