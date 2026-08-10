/* ==========================================================================
   INTERACTIVIDAD DE FILTROS - DETALLE DE ASISTENCIA
   Norbert Wiener Intranet - Wieners Brand Redesign
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Obtener los checkboxes de filtro
  const filterAttended = document.getElementById('filter-attended');
  const filterAbsent = document.getElementById('filter-absent');
  const filterJustified = document.getElementById('filter-justified');
  const filterPending = document.getElementById('filter-pending');

  // Función para aplicar filtros de visibilidad de columnas
  const applyFilters = () => {
    const showAttended = filterAttended.checked;
    const showAbsent = filterAbsent.checked;
    const showJustified = filterJustified.checked;
    const showPending = filterPending.checked;

    // 1. Mostrar/Ocultar celdas correspondientes en las tablas
    const toggleCells = (status, shouldShow) => {
      const cells = document.querySelectorAll(`[data-status="${status}"]`);
      cells.forEach(cell => {
        if (shouldShow) {
          cell.style.display = '';
        } else {
          cell.style.display = 'none';
        }
      });
    };

    toggleCells('attended', showAttended);
    toggleCells('absent', showAbsent);
    toggleCells('justified', showJustified);
    toggleCells('pending', showPending);
  };

  // Agregar event listeners a cada control de filtro
  if (filterAttended) filterAttended.addEventListener('change', applyFilters);
  if (filterAbsent) filterAbsent.addEventListener('change', applyFilters);
  if (filterJustified) filterJustified.addEventListener('change', applyFilters);
  if (filterPending) filterPending.addEventListener('change', applyFilters);

  // Aplicar filtros por defecto al cargar (inicialización)
  applyFilters();

});
