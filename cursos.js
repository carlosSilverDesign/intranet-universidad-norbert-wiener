// Lógica interactiva para el cambio de pestañas en cursos.html
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
});
