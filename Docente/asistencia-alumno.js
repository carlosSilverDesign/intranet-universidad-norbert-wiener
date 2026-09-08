/**
 * ==========================================================================
 * LÓGICA INTERACTIVA - REGISTRO DE ASISTENCIA ALUMNOS (PERFIL DOCENTE)
 * Universidad Norbert Wiener
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.attendance-table');
  const btnSaveAttendance = document.getElementById('btnRegistrarAsistencia');
  const btnSearchFilters = document.getElementById('btnBuscarFiltros');
  const btnExportExcel = document.getElementById('btnDescargarExcel');
  const toastNotification = document.getElementById('attendanceToast');
  const toastText = document.getElementById('attendanceToastText');

  // Total de sesiones programadas por defecto para el curso
  const TOTAL_PROGRAMADAS = 17;

  /**
   * 1. RECALCULAR ESTADÍSTICAS POR FILA DE ALUMNO
   * Cuenta cuántas casillas tienen 'status-attended' (✓) y calcula el porcentaje.
   */
  function updateRowStats(row) {
    if (!row) return;

    const attendedCells = row.querySelectorAll('.cell-trigger.status-attended');
    const count = attendedCells.length;

    const progCell = row.querySelector('.td-prog');
    let programmed = TOTAL_PROGRAMADAS;
    if (progCell && !isNaN(parseInt(progCell.textContent.trim(), 10))) {
      programmed = parseInt(progCell.textContent.trim(), 10);
    }

    const percentage = programmed > 0 ? Math.round((count / programmed) * 100) : 0;

    const countElem = row.querySelector('.td-asist-count');
    const pctElem = row.querySelector('.td-asist-pct');

    if (countElem) {
      countElem.textContent = count;
    }
    if (pctElem) {
      pctElem.textContent = `${percentage}%`;
    }
  }

  /**
   * 2. INTERACTIVIDAD DE MARCACIÓN EN CASILLAS
   * Clic:
   * - Vacío (status-empty) -> Asistió (✓)
   * - Asistió (status-attended) -> Faltó (F)
   * - Faltó (status-absent) -> Asistió (✓)
   * Clic derecho o Alt/Shift + Clic:
   * - Limpiar casilla y devolver a Vacío (status-empty)
   */
  if (table) {
    table.addEventListener('click', (e) => {
      const cellBtn = e.target.closest('.cell-trigger');
      if (!cellBtn) return;

      // Si es una casilla bloqueada (futura o sin clase programada), no hacer nada
      if (cellBtn.classList.contains('status-future')) return;

      const currentRow = cellBtn.closest('tr');

      // Si presionó shift o alt, limpiar la casilla
      if (e.shiftKey || e.altKey) {
        cellBtn.className = 'cell-trigger status-empty';
        cellBtn.textContent = '';
        cellBtn.setAttribute('title', 'Sin marcar (Clic para marcar Asistió)');
        cellBtn.setAttribute('aria-label', 'Sin marcar');
        updateRowStats(currentRow);
        return;
      }

      // Ciclo de marcación principal
      if (cellBtn.classList.contains('status-empty')) {
        // De vacío a Asistió
        cellBtn.className = 'cell-trigger status-attended';
        cellBtn.textContent = '✓';
        cellBtn.setAttribute('title', 'Asistió (Clic para marcar Falta)');
        cellBtn.setAttribute('aria-label', 'Asistió');
      } else if (cellBtn.classList.contains('status-attended')) {
        // De Asistió a Falta
        cellBtn.className = 'cell-trigger status-absent';
        cellBtn.textContent = 'F';
        cellBtn.setAttribute('title', 'Faltó (Clic para marcar Asistió)');
        cellBtn.setAttribute('aria-label', 'Faltó');
      } else if (cellBtn.classList.contains('status-absent')) {
        // De Falta a Asistió
        cellBtn.className = 'cell-trigger status-attended';
        cellBtn.textContent = '✓';
        cellBtn.setAttribute('title', 'Asistió (Clic para marcar Falta)');
        cellBtn.setAttribute('aria-label', 'Asistió');
      }

      // Recalcular estadísticas del alumno en tiempo real
      updateRowStats(currentRow);
    });

    // Permitir clic derecho para limpiar casilla a vacío
    table.addEventListener('contextmenu', (e) => {
      const cellBtn = e.target.closest('.cell-trigger');
      if (!cellBtn || cellBtn.classList.contains('status-future')) return;

      e.preventDefault();
      cellBtn.className = 'cell-trigger status-empty';
      cellBtn.textContent = '';
      cellBtn.setAttribute('title', 'Sin marcar');
      cellBtn.setAttribute('aria-label', 'Sin marcar');

      const currentRow = cellBtn.closest('tr');
      updateRowStats(currentRow);
    });
  }

  /**
   * 3. NOTIFICACIÓN TOAST FLOTANTE
   */
  let toastTimer = null;
  function showToast(message, isError = false) {
    if (!toastNotification) return;

    if (toastText) {
      toastText.textContent = message;
    }

    if (isError) {
      toastNotification.style.backgroundColor = '#B91C1C';
    } else {
      toastNotification.style.backgroundColor = '#0F172A';
    }

    toastNotification.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3800);
  }

  /**
   * 4. BOTÓN "REGISTRAR ASISTENCIA ALUMNO"
   */
  if (btnSaveAttendance) {
    btnSaveAttendance.addEventListener('click', () => {
      const originalText = btnSaveAttendance.innerHTML;
      btnSaveAttendance.disabled = true;
      btnSaveAttendance.innerHTML = `
        <svg class="spinner-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Guardando...
      `;

      setTimeout(() => {
        btnSaveAttendance.disabled = false;
        btnSaveAttendance.innerHTML = originalText;
        showToast('¡Asistencia registrada con éxito! Los datos fueron guardados correctamente en el sistema.');
      }, 700);
    });
  }

  /**
   * 5. BOTÓN DE FILTRADO "BUSCAR"
   */
  if (btnSearchFilters) {
    btnSearchFilters.addEventListener('click', (e) => {
      e.preventDefault();
      const curso = document.getElementById('filtroCurso')?.value || '';
      const seccion = document.getElementById('filtroSeccion')?.value || '';
      const mes = document.getElementById('filtroMes')?.value || '';

      showToast(`Cargando lista de alumnos para: ${seccion} - ${mes}...`);
    });
  }

  /**
   * 6. BOTÓN "DESCARGAR EXCEL"
   */
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      showToast('Generando y descargando reporte de asistencia en formato Excel (.xlsx)...');
    });
  }

  /**
   * 7. ESTILO DINÁMICO PARA ANIMACIÓN DE CARGA DEL BOTÓN
   */
  const styleSpin = document.createElement('style');
  styleSpin.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(styleSpin);
});
