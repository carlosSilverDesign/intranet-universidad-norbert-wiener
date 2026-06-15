/* ==========================================================================
   INTERACTIVIDAD Y GENERACIÓN DE CALENDARIOS - SECCIÓN ASISTENCIAS
   Norbert Wiener Intranet - Wieners Brand Redesign
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Simulación de carga con Skeleton Loader
  const skeletonLoader = document.getElementById('skeletonLoader');
  const attendanceContent = document.getElementById('attendanceContent');

  if (skeletonLoader && attendanceContent) {
    setTimeout(() => {
      skeletonLoader.style.display = 'none';
      attendanceContent.style.display = 'flex';
      console.log('Skeleton ocultado y Asistencias real visible.');
    }, 2000); // Carga simulada de 2 segundos
  }

  // ==========================================
  // 1. DATASET DE ASISTENCIA POR CURSO (Alta Fidelidad)
  // Define las clases asistidas (✓) y faltas (F) para cada curso
  // ==========================================
  const attendanceDataset = [
    {
      id: 1, // Comportamiento Organizacional
      schedule: {
        mar: { attended: [19, 24], absent: [15, 26, 31] },
        abr: { attended: [7, 21], absent: [2, 28] },
        may: { attended: [], absent: [] },
        jun: { attended: [], absent: [] },
        jul: { attended: [], absent: [] }
      }
    },
    {
      id: 2, // Comunicación de Alto Impacto
      schedule: {
        mar: { attended: [18, 20, 23, 27], absent: [31] },
        abr: { attended: [3, 9], absent: [2, 10] },
        may: { attended: [], absent: [] },
        jun: { attended: [], absent: [] },
        jul: { attended: [], absent: [] }
      }
    },
    {
      id: 3, // Elementos de Comunicación Intercultural
      schedule: {
        mar: { attended: [18], absent: [25, 27] },
        abr: { attended: [2], absent: [9, 16, 30] },
        may: { attended: [], absent: [] },
        jun: { attended: [], absent: [] },
        jul: { attended: [], absent: [] }
      }
    },
    {
      id: 4, // Ingles III
      schedule: {
        mar: { attended: [21, 23], absent: [17, 28, 30] },
        abr: { attended: [9], absent: [2, 6, 14] },
        may: { attended: [], absent: [] },
        jun: { attended: [], absent: [] },
        jul: { attended: [], absent: [] }
      }
    },
    {
      id: 5, // Microeconomía
      schedule: {
        mar: { attended: [19, 21, 26], absent: [31] },
        abr: { attended: [9], absent: [2] },
        may: { attended: [], absent: [] },
        jun: { attended: [], absent: [] },
        jul: { attended: [], absent: [] }
      }
    }
  ];

  // Meses y número de días en el semestre 2025-II
  const monthsConfig = [
    { key: 'mar', name: 'Mar.', days: 31 },
    { key: 'abr', name: 'Abr.', days: 30 },
    { key: 'may', name: 'May.', days: 31 },
    { key: 'jun', name: 'Jun.', days: 30 },
    { key: 'jul', name: 'Jul.', days: 31 }
  ];

  // ==========================================
  // 2. GENERACIÓN DINÁMICA DE LAS TABLAS DE CALENDARIO
  // ==========================================
  const renderCalendars = () => {
    attendanceDataset.forEach(course => {
      const tbody = document.querySelector(`[data-course-calendar="${course.id}"] tbody`);
      if (!tbody) return;

      tbody.innerHTML = ''; // Limpiar filas anteriores

      monthsConfig.forEach(month => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-row-month', month.key);

        // Celda del Mes (Sticky left col)
        const tdMonth = document.createElement('td');
        tdMonth.className = 'col-mes';
        tdMonth.textContent = month.name;
        tr.appendChild(tdMonth);

        // Columnas de días del 01 al 31
        for (let day = 1; day <= 31; day++) {
          const tdDay = document.createElement('td');
          tdDay.className = 'calendar-cell';

          // Verificar si el día sobrepasa los días reales del mes
          if (day > month.days) {
            tdDay.classList.add('cell-outside'); // Fuera del mes
          }
          // Verificar si está fuera del ciclo del semestre (Marzo 1-15 y Julio 16-31)
          else if ((month.key === 'mar' && day <= 15) || (month.key === 'jul' && day >= 16)) {
            tdDay.classList.add('cell-outside');
          }
          // Verificar asistencias
          else if (course.schedule[month.key]?.attended?.includes(day)) {
            tdDay.classList.add('cell-attended');
            tdDay.textContent = '✓';
            tdDay.title = `${month.name} ${day} - Asistió`;
          }
          // Verificar faltas
          else if (course.schedule[month.key]?.absent?.includes(day)) {
            tdDay.classList.add('cell-absent');
            tdDay.textContent = 'F';
            tdDay.title = `${month.name} ${day} - Faltó`;
          }
          // Por defecto: Sin clase programada
          else {
            tdDay.classList.add('cell-none');
            tdDay.title = `${month.name} ${day} - Sin clase programada`;
          }

          tr.appendChild(tdDay);
        }

        tbody.appendChild(tr);
      });
    });
  };

  // Renderizar calendarios al iniciar
  renderCalendars();

  // ==========================================
  // 3. MANEJO DE FILTROS POR MES
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remover clase activa de todos los botones
        filterButtons.forEach(b => b.classList.remove('active'));
        // Agregar clase activa al botón actual
        btn.classList.add('active');

        const selectedMonth = btn.getAttribute('data-month');
        const calendarRows = document.querySelectorAll('.calendar-table tbody tr');

        calendarRows.forEach(row => {
          const rowMonth = row.getAttribute('data-row-month');

          if (selectedMonth === 'all') {
            // Mostrar todas las filas
            row.classList.remove('hidden-row');
          } else {
            // Mostrar sólo la coincidente y ocultar las demás
            if (rowMonth === selectedMonth) {
              row.classList.remove('hidden-row');
            } else {
              row.classList.add('hidden-row');
            }
          }
        });
      });
    });
  }

});
