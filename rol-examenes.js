document.addEventListener('DOMContentLoaded', () => {
  // 1. Simulación de Carga Inicial con Skeleton Loader
  const skeletonLoader = document.getElementById('skeletonLoader');
  const examsContent = document.getElementById('examsContent');

  if (skeletonLoader && examsContent) {
    setTimeout(() => {
      skeletonLoader.style.display = 'none';
      examsContent.style.display = 'block';
      console.log('Skeleton ocultado y contenido de exámenes visible.');
    }, 1500); // 1.5 segundos de retraso para dar sensación de app real
  }

  // 2. Interactividad de Pestañas (Tabs) con comportamiento idéntico y accesible al de Cursos
  const tabParcial = document.getElementById('tabParcial');
  const tabFinal = document.getElementById('tabFinal');
  const parcialContainer = document.getElementById('parcialContainer');
  const finalContainer = document.getElementById('finalContainer');
  const announcer = document.getElementById('a11y-announcer');

  // Función helper para anunciar mensajes a lectores de pantalla (a11y)
  function announce(message) {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  }

  if (tabParcial && tabFinal) {
    const tabs = [tabParcial, tabFinal];

    function activateTab(selectedTab, tabName) {
      // Quitar estado activo y accesibilidad de todas las pestañas
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      // Activar la pestaña seleccionada
      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-selected', 'true');
      selectedTab.setAttribute('tabindex', '0');

      // Alternar contenedores
      if (tabName === 'Examen Parcial') {
        if (parcialContainer) parcialContainer.style.display = 'block';
        if (finalContainer) finalContainer.style.display = 'none';
      } else if (tabName === 'Examen Final') {
        if (parcialContainer) parcialContainer.style.display = 'none';
        if (finalContainer) finalContainer.style.display = 'block';
      }

      announce(`Pestaña ${tabName} seleccionada`);
      console.log(`Mostrando ${tabName}`);
    }

    tabParcial.addEventListener('click', () => {
      activateTab(tabParcial, 'Examen Parcial');
    });

    tabFinal.addEventListener('click', () => {
      activateTab(tabFinal, 'Examen Final');
    });

    // Navegación por teclado entre pestañas (ArrowRight, ArrowLeft, Home, End)
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

  // 3. Simulación de filtro de periodo (opcional, por si el usuario cambia el periodo)
  const periodSelect = document.getElementById('period');
  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      console.log(`Periodo seleccionado: ${e.target.value}`);
      // Simula recargar los datos
      if (examsContent) {
        examsContent.style.opacity = '0.5';
        setTimeout(() => {
          examsContent.style.opacity = '1';
        }, 300);
      }
    });
  }
});
