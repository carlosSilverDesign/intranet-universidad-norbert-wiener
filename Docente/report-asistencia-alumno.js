/**
 * Reporte Asistencia Alumnos - Portal Docente Universidad Norbert Wiener
 * Lógica: Selects Flotantes, Tags de Filtro por Mes a la Izquierda,
 *         Desktop Drag-to-Scroll y Renderizado de Matriz (Solo Visualización)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lista de Sesiones Programadas
  const sesiones = [
    { id: 's1', mesKey: 'ago', month: 'Ago', day: '27' },
    { id: 's2', mesKey: 'sep', month: 'Sep', day: '03' },
    { id: 's3', mesKey: 'sep', month: 'Sep', day: '10' },
    { id: 's4', mesKey: 'sep', month: 'Sep', day: '17' },
    { id: 's5', mesKey: 'sep', month: 'Sep', day: '24' },
    { id: 's6', mesKey: 'oct', month: 'Oct', day: '01' },
    { id: 's7', mesKey: 'oct', month: 'Oct', day: '08' },
    { id: 's8', mesKey: 'oct', month: 'Oct', day: '15' },
    { id: 's9', mesKey: 'oct', month: 'Oct', day: '22' },
    { id: 's10', mesKey: 'oct', month: 'Oct', day: '29' },
    { id: 's11', mesKey: 'nov', month: 'Nov', day: '05' },
    { id: 's12', mesKey: 'nov', month: 'Nov', day: '12' },
    { id: 's13', mesKey: 'nov', month: 'Nov', day: '19' },
    { id: 's14', mesKey: 'nov', month: 'Nov', day: '26' },
    { id: 's15', mesKey: 'dic', month: 'Dic', day: '03' },
    { id: 's16', mesKey: 'dic', month: 'Dic', day: '10' },
    { id: 's17', mesKey: 'dic', month: 'Dic', day: '17' }
  ];

  // Base de datos de alumnos (Fiel al visual de reporte)
  // Estados: 'attended' (✓), 'absent' (F), 'noclass' (Sin clase), 'future' (Gris)
  const alumnosData = [
    {
      num: 1,
      codigo: '2026104373',
      nombre: 'CUBAS GUERRA, Rubi Camila',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['noclass', 'attended', 'absent', 'attended', 'absent', 'attended', 'absent', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 2,
      codigo: '2025103274',
      nombre: 'DIAZ SALAS, Franchesco Luis',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'attended', 'attended', 'absent', 'attended', 'attended', 'noclass', 'absent', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 3,
      codigo: '2024100600',
      nombre: 'LINARES PALOMINO, Farid Sebastian',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'attended', 'attended', 'attended', 'attended', 'absent', 'attended', 'attended', 'attended', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 4,
      codigo: '2026201845',
      nombre: 'TORRES MAMANI, Valeria Xiomara',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['absent', 'absent', 'attended', 'attended', 'absent', 'attended', 'attended', 'noclass', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 5,
      codigo: '2025098312',
      nombre: 'QUISPE FLORES, Rodrigo Alonso',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'absent', 'attended', 'attended', 'attended', 'attended', 'absent', 'attended', 'attended', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 6,
      codigo: '2026104375',
      nombre: 'BENITES MORALES, Valeria Nicole',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'absent', 'attended', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 7,
      codigo: '2026104376',
      nombre: 'CASTRO PAREDES, Joaquín Mateo',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'absent', 'attended', 'attended', 'absent', 'attended', 'attended', 'attended', 'absent', 'future', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    },
    {
      num: 8,
      codigo: '2026104377',
      nombre: 'DELGADO GUTIERREZ, Luciana Belén',
      seccion: 'AD2N4',
      prog: 17,
      estados: ['attended', 'attended', 'attended', 'attended', 'attended', 'attended', 'absent', 'attended', 'attended', 'attended', 'future', 'future', 'future', 'future', 'future', 'future', 'future']
    }
  ];

  // Referencias DOM
  const tableBody = document.getElementById('reportAlumnosBody');
  const monthTags = document.querySelectorAll('.report-month-tag');
  const scrollContainer = document.querySelector('.report-table-scroll-container');
  const btnBuscar = document.getElementById('btnBuscarReporte');

  let activeMonthFilter = 'todos';

  // =========================================================================
  // 1. RENDERIZADO DE MATRIZ DE ASISTENCIA (SOLO VISUALIZACIÓN / LECTURA)
  // =========================================================================
  function renderTable() {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    alumnosData.forEach(alumno => {
      const tr = document.createElement('tr');

      // Columnas fijas
      let html = `
        <td class="td-num">${alumno.num}</td>
        <td class="td-code">${alumno.codigo}</td>
        <td class="td-student">${alumno.nombre}</td>
        <td class="td-section">${alumno.seccion}</td>
        <td class="td-prog">${alumno.prog}</td>
      `;

      // 17 Celdas de sesión
      sesiones.forEach((sesion, idx) => {
        const estado = alumno.estados[idx] || 'future';
        let boxContent = '';

        if (estado === 'attended') {
          boxContent = `<span class="report-status-box attended" title="Asistió">✓</span>`;
        } else if (estado === 'absent') {
          boxContent = `<span class="report-status-box absent" title="Faltó">F</span>`;
        } else if (estado === 'noclass') {
          boxContent = `<span class="report-status-box noclass" title="Sin clase"></span>`;
        } else {
          boxContent = `<span class="report-status-box future" title="Programada"></span>`;
        }

        html += `<td class="td-session" data-month="${sesion.mesKey}">${boxContent}</td>`;
      });

      tr.innerHTML = html;
      tableBody.appendChild(tr);
    });

    applyMonthFilter(activeMonthFilter);
  }

  // =========================================================================
  // 2. FILTRADO POR MES CON TAGS (ALINEADOS A LA IZQUIERDA)
  // =========================================================================
  function applyMonthFilter(month) {
    activeMonthFilter = month.toLowerCase();

    // Actualizar botones de tags
    monthTags.forEach(btn => {
      const tagVal = btn.getAttribute('data-month').toLowerCase();
      if (tagVal === activeMonthFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const thDates = document.querySelectorAll('.report-table thead th.th-date');
    const tdSessions = document.querySelectorAll('.report-table tbody td.td-session');

    if (activeMonthFilter === 'todos') {
      thDates.forEach(th => {
        th.classList.remove('dimmed', 'highlighted');
      });
      tdSessions.forEach(td => {
        td.classList.remove('dimmed');
      });
    } else {
      // Atenuar columnas no pertenecientes al mes y resaltar las del mes
      let firstMatchTh = null;

      thDates.forEach(th => {
        const thMonth = (th.getAttribute('data-month') || '').toLowerCase();
        if (thMonth === activeMonthFilter) {
          th.classList.remove('dimmed');
          th.classList.add('highlighted');
          if (!firstMatchTh) firstMatchTh = th;
        } else {
          th.classList.add('dimmed');
          th.classList.remove('highlighted');
        }
      });

      tdSessions.forEach(td => {
        const tdMonth = (td.getAttribute('data-month') || '').toLowerCase();
        if (tdMonth === activeMonthFilter) {
          td.classList.remove('dimmed');
        } else {
          td.classList.add('dimmed');
        }
      });

      // Si existe columna del mes, hacer scroll suave hacia ella
      if (firstMatchTh && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const thRect = firstMatchTh.getBoundingClientRect();
        const offsetLeft = firstMatchTh.offsetLeft - 380; // Compensar ancho de columnas sticky

        scrollContainer.scrollTo({
          left: Math.max(0, offsetLeft),
          behavior: 'smooth'
        });
      }
    }
  }

  monthTags.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedMonth = btn.getAttribute('data-month');
      applyMonthFilter(selectedMonth);
    });
  });

  // =========================================================================
  // 3. SELECTS FLOTANTES CON ROTACIÓN Y SMART FLIP
  // =========================================================================
  const selectContainers = document.querySelectorAll('.custom-select-container');

  function closeAllDropdowns() {
    selectContainers.forEach(container => {
      container.classList.remove('is-open');
      const trigger = container.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  selectContainers.forEach(container => {
    const trigger = container.querySelector('.custom-select-trigger');
    const menu = container.querySelector('.custom-dropdown-menu');
    const label = container.querySelector('.custom-select-label');
    const options = container.querySelectorAll('.custom-option');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        // Smart Flip
        const triggerRect = trigger.getBoundingClientRect();
        const menuHeight = 220;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        menu.classList.remove('dropdown-above', 'dropdown-below');

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
          menu.classList.add('dropdown-above');
        } else {
          menu.classList.add('dropdown-below');
        }

        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        const text = opt.querySelector('span') ? opt.querySelector('span').textContent.trim() : opt.textContent.trim();
        const val = opt.getAttribute('data-value') || text;

        if (label) label.textContent = text;
        container.setAttribute('data-current-value', val);

        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDropdowns();
      renderTable();
    });
  }

  // =========================================================================
  // 4. DESKTOP DRAG-TO-SCROLL SUAVE
  // =========================================================================
  if (scrollContainer) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    scrollContainer.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDown = true;
      scrollContainer.classList.add('is-dragging');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
      isDown = false;
      scrollContainer.classList.remove('is-dragging');
    });

    scrollContainer.addEventListener('mouseup', () => {
      isDown = false;
      scrollContainer.classList.remove('is-dragging');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // Render inicial
  renderTable();
});
