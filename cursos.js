// Lógica interactiva para el cambio de pestañas y acordeones en cursos.html / cursos-lc.html
document.addEventListener('DOMContentLoaded', () => {
  const tabMatriculados = document.getElementById('tabMatriculados');
  const tabProgreso = document.getElementById('tabProgreso');
  
  const coursesGrid = document.getElementById('coursesGrid');
  const progresoContainer = document.getElementById('progresoContainer');

  if (tabMatriculados && tabProgreso) {
    // Evento al hacer clic en "Matriculados"
    tabMatriculados.addEventListener('click', () => {
      tabMatriculados.classList.add('active');
      tabProgreso.classList.remove('active');
      
      if (coursesGrid) coursesGrid.style.display = 'grid';
      if (progresoContainer) progresoContainer.style.display = 'none';
    });

    // Evento al hacer clic en "Progreso académico"
    tabProgreso.addEventListener('click', () => {
      tabProgreso.classList.add('active');
      tabMatriculados.classList.remove('active');
      
      if (coursesGrid) coursesGrid.style.display = 'none';
      if (progresoContainer) progresoContainer.style.display = 'flex';
    });
  }

  // Lógica interactiva para desplegar / replegar tarjetas (acordeones) en Progreso Académico
  const accordionHeaders = document.querySelectorAll('.lc-accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.lc-accordion');
      const content = accordion.querySelector('.lc-accordion-content');

      if (accordion.classList.contains('expanded')) {
        accordion.classList.remove('expanded');
        if (content) content.style.display = 'none';
      } else {
        accordion.classList.add('expanded');
        if (content) content.style.display = 'block';
      }
    });
  });
});
