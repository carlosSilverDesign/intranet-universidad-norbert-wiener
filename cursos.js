// Lógica interactiva accesible para cursos.html y cursos-lc.html (WCAG 2.1 AA)
document.addEventListener('DOMContentLoaded', () => {
  const tabMatriculados = document.getElementById('tabMatriculados');
  const tabProgreso = document.getElementById('tabProgreso');
  
  const coursesGrid = document.getElementById('coursesGrid');
  const progresoContainer = document.getElementById('progresoContainer');
  const announcer = document.getElementById('a11y-announcer');

  // Función helper para anunciar mensajes a lectores de pantalla
  function announce(message) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  // --- Manejo Accesible de Pestañas (Tabs) ---
  if (tabMatriculados && tabProgreso) {
    const tabs = [tabMatriculados, tabProgreso];

    function activateTab(selectedTab, targetPanel, hiddenPanel, tabName) {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-selected', 'true');
      selectedTab.setAttribute('tabindex', '0');

      if (targetPanel) targetPanel.style.display = targetPanel.classList.contains('courses-grid') ? 'grid' : 'flex';
      if (hiddenPanel) hiddenPanel.style.display = 'none';

      announce(`Pestaña ${tabName} seleccionada`);
    }

    tabMatriculados.addEventListener('click', () => {
      activateTab(tabMatriculados, coursesGrid, progresoContainer, 'Matriculados');
    });

    tabProgreso.addEventListener('click', () => {
      activateTab(tabProgreso, progresoContainer, coursesGrid, 'Progreso académico');
    });

    // Navegación por teclado entre pestañas (Teclas Flecha Izquierda / Derecha / Inicio / Fin)
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = tabs.length - 1;
        } else {
          return;
        }

        e.preventDefault();
        tabs[newIndex].focus();
        tabs[newIndex].click();
      });
    });
  }

  // --- Manejo Accesible de Acordeones (Ciclos y Electivos) ---
  const accordionHeaders = document.querySelectorAll('.lc-accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.lc-accordion');
      const content = accordion.querySelector('.lc-accordion-content');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const titleText = header.querySelector('h3') ? header.querySelector('h3').textContent.trim() : 'Ciclo';

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        accordion.classList.remove('expanded');
        if (content) content.style.display = 'none';
        announce(`${titleText} colapsado`);
      } else {
        header.setAttribute('aria-expanded', 'true');
        accordion.classList.add('expanded');
        if (content) content.style.display = 'block';
        announce(`${titleText} desplegado`);
      }
    });
  });
});
