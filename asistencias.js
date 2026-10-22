document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SIMULACIÓN DE CARGA CON SKELETON LOADER
  // ==========================================
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
  // 1. CONFIGURACIÓN DE MESES Y DÍAS (2025-II)
  // ==========================================
  const monthsConfig = [
    { key: 'mar', name: 'Mar.', days: 31, monthIndex: 2 },
    { key: 'abr', name: 'Abr.', days: 30, monthIndex: 3 },
    { key: 'may', name: 'May.', days: 31, monthIndex: 4 },
    { key: 'jun', name: 'Jun.', days: 30, monthIndex: 5 },
    { key: 'jul', name: 'Jul.', days: 31, monthIndex: 6 }
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  function getDateString(year, monthIndex, day, monthName) {
    const d = new Date(year, monthIndex, day);
    const dayName = daysOfWeek[d.getDay()];
    const cleanMonth = monthName.replace('.', '');
    return `${dayName} ${day < 10 ? '0' + day : day} ${cleanMonth}`;
  }

  // ==========================================
  // 2. DATASET DE ASISTENCIA POR CURSO (Alta Fidelidad)
  // Soporta sesiones de Teoría y Práctica individuales o simultáneas el mismo día
  // ==========================================
  const attendanceDataset = [
    {
      id: 1, // Comportamiento Organizacional (Solo Teoría)
      activeTypeFilter: 'all',
      schedule: {
        mar: {
          17: { teoria: 'attended' },
          19: { teoria: 'attended' },
          24: { teoria: 'attended' },
          26: { teoria: 'absent' },
          31: { teoria: 'absent' }
        },
        abr: {
          2: { teoria: 'absent' },
          7: { teoria: 'attended' },
          21: { teoria: 'attended' },
          28: { teoria: 'absent' }
        },
        may: {},
        jun: {},
        jul: {}
      }
    },
    {
      id: 2, // Comunicación de Alto Impacto (Teoría y Práctica)
      activeTypeFilter: 'all',
      schedule: {
        mar: {
          17: { teoria: 'attended' },
          // Caso 3: Asiste a Teoría (✓) y Falta a Práctica (F) -> Celda Dividida Bicolor
          19: { teoria: 'attended', practica: 'absent' },
          24: { practica: 'attended' },
          26: { teoria: 'attended' },
          28: { practica: 'attended' },
          31: { teoria: 'attended' }
        },
        abr: {
          2: { practica: 'absent' },
          4: { practica: 'attended' },
          9: { teoria: 'attended' },
          14: { teoria: 'attended' },
          21: { teoria: 'absent' }
        },
        may: {},
        jun: {},
        jul: {}
      }
    },
    {
      id: 3, // Elementos de Comunicación Intercultural (Solo Teoría)
      activeTypeFilter: 'all',
      schedule: {
        mar: {
          18: { teoria: 'attended' },
          25: { teoria: 'absent' },
          27: { teoria: 'absent' }
        },
        abr: {
          2: { teoria: 'attended' },
          9: { teoria: 'absent' },
          16: { teoria: 'absent' },
          30: { teoria: 'absent' }
        },
        may: {},
        jun: {},
        jul: {}
      }
    },
    {
      id: 4, // Inglés III (Teoría y Práctica)
      activeTypeFilter: 'all',
      schedule: {
        mar: {
          18: { teoria: 'attended' },
          // Caso 3: Asiste a Teoría y Falta a Práctica -> Celda Dividida
          19: { teoria: 'attended', practica: 'absent' },
          // Caso 1: Asistió a ambas (Teoría ✓ y Práctica ✓) -> Celda completa en verde con ✓
          21: { teoria: 'attended', practica: 'attended' },
          25: { teoria: 'attended' },
          26: { practica: 'attended' },
          28: { teoria: 'attended' }
        },
        abr: {
          2: { practica: 'absent' },
          4: { practica: 'attended' },
          // Caso 4: Falta a Teoría (F) y Asiste a Práctica (✓) [viceversa] -> Celda Dividida
          8: { teoria: 'absent', practica: 'attended' }
        },
        may: {},
        jun: {},
        jul: {}
      }
    },
    {
      id: 5, // Microeconomía (Solo Teoría)
      activeTypeFilter: 'all',
      schedule: {
        mar: {
          19: { teoria: 'attended' },
          21: { teoria: 'attended' },
          26: { teoria: 'attended' },
          31: { teoria: 'absent' }
        },
        abr: {
          2: { teoria: 'absent' },
          9: { teoria: 'attended' }
        },
        may: {},
        jun: {},
        jul: {}
      }
    }
  ];

  // ==========================================
  // 3. TOOLTIP FLOTANTE (Desktop & Mobile)
  // ==========================================
  const tooltip = document.getElementById('attendanceTooltip');
  let activeTooltipCell = null;

  function showTooltip(cell) {
    if (!tooltip || !cell.dataset.tooltipInfo) return;

    let data;
    try {
      data = JSON.parse(cell.dataset.tooltipInfo);
    } catch (e) {
      return;
    }

    activeTooltipCell = cell;

    let html = `<div class="tooltip-date">${data.dateStr}</div><div class="tooltip-items">`;
    data.sessions.forEach(s => {
      const isAtt = s.status === 'attended';
      const label = `${s.type}: ${isAtt ? 'Asistió (✓)' : 'Faltó (F)'}`;
      html += `
        <div class="tooltip-item">
          <span class="tooltip-dot ${isAtt ? 'dot-attended' : 'dot-absent'}"></span>
          <span>${label}</span>
        </div>`;
    });
    html += `</div>`;
    tooltip.innerHTML = html;

    // Posicionamiento flotante sobre la celda
    const rect = cell.getBoundingClientRect();
    let left = rect.left + rect.width / 2;
    let top = rect.top;

    tooltip.classList.remove('tooltip-bottom');

    // Si queda muy arriba en el viewport, mostrarlo hacia abajo
    if (rect.top < 95) {
      tooltip.classList.add('tooltip-bottom');
      top = rect.bottom;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');

    // Evitar desborde horizontal de pantalla
    requestAnimationFrame(() => {
      const tipRect = tooltip.getBoundingClientRect();
      if (tipRect.left < 10) {
        tooltip.style.left = `${left + (10 - tipRect.left)}px`;
      } else if (tipRect.right > window.innerWidth - 10) {
        tooltip.style.left = `${left - (tipRect.right - (window.innerWidth - 10))}px`;
      }
    });
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    activeTooltipCell = null;
  }

  // Cerrar tooltip al hacer clic fuera o scrollear
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.calendar-cell')) {
      hideTooltip();
    }
  });

  window.addEventListener('scroll', hideTooltip, { passive: true });
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.calendar-cell')) {
      hideTooltip();
    }
  }, { passive: true });

  // ==========================================
  // 4. ACTUALIZACIÓN DINÁMICA DE ESTADÍSTICAS EN HEADER
  // ==========================================
  function updateCourseHeaderStats(courseId, filterType) {
    const course = attendanceDataset.find(c => c.id === courseId);
    if (!course) return;

    let tAttended = 0, tTotal = 0;
    let pAttended = 0, pTotal = 0;

    monthsConfig.forEach(m => {
      const mSchedule = course.schedule[m.key] || {};
      for (const day in mSchedule) {
        const d = mSchedule[day];
        if (d.teoria) {
          tTotal++;
          if (d.teoria === 'attended') tAttended++;
        }
        if (d.practica) {
          pTotal++;
          if (d.practica === 'attended') pAttended++;
        }
      }
    });

    const labelEl = document.querySelector(`[data-stats-label="${courseId}"]`);
    const breakdownEl = document.querySelector(`[data-stats-breakdown="${courseId}"]`);
    const badgeEl = document.querySelector(`[data-stats-badge="${courseId}"]`);
    const badgeContainer = document.querySelector(`[data-stats-badge-container="${courseId}"]`);

    if (!labelEl || !badgeEl) return;

    let attended = 0, total = 0, breakdownText = '';

    if (filterType === 'teoria') {
      attended = tAttended;
      total = tTotal;
      breakdownText = 'Solo Teoría';
    } else if (filterType === 'practica') {
      attended = pAttended;
      total = pTotal;
      breakdownText = 'Solo Práctica';
    } else {
      attended = tAttended + pAttended;
      total = tTotal + pTotal;
      breakdownText = `T ${tAttended}/${tTotal} · P ${pAttended}/${pTotal}`;
    }

    const percentage = total > 0 ? ((attended / total) * 100).toFixed(2) : '0.00';

    labelEl.textContent = `${attended}/${total} clases asistidas`;
    if (breakdownEl) breakdownEl.textContent = breakdownText;
    badgeEl.textContent = `${percentage}%`;

    if (badgeContainer) {
      badgeContainer.classList.remove('badge-success', 'badge-warning', 'badge-danger');
      const pctNum = parseFloat(percentage);
      if (pctNum >= 70) {
        badgeContainer.classList.add('badge-success');
      } else if (pctNum >= 50) {
        badgeContainer.classList.add('badge-warning');
      } else {
        badgeContainer.classList.add('badge-danger');
      }
    }
  }

  // ==========================================
  // 5. RENDERIZADO DE TABLA DE CALENDARIO DE UN CURSO
  // ==========================================
  function renderCourseCalendar(course) {
    const tbody = document.querySelector(`[data-course-calendar="${course.id}"] tbody`);
    if (!tbody) return;

    tbody.innerHTML = '';
    const filter = course.activeTypeFilter || 'all';

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

        // 1. Verificar si sobrepasa los días del mes
        if (day > month.days) {
          tdDay.classList.add('cell-outside');
          tr.appendChild(tdDay);
          continue;
        }

        // 2. Verificar ciclo del semestre (Marzo 1-15 y Julio 16-31 fuera)
        if ((month.key === 'mar' && day <= 15) || (month.key === 'jul' && day >= 16)) {
          tdDay.classList.add('cell-outside');
          tr.appendChild(tdDay);
          continue;
        }

        // 3. Obtener sesión(es) del día
        const dayData = course.schedule[month.key]?.[day];
        let tooltipSessions = [];

        if (filter === 'teoria') {
          // Filtrado: Solo Teoría
          if (dayData && dayData.teoria) {
            if (dayData.teoria === 'attended') {
              tdDay.classList.add('cell-attended');
              tdDay.textContent = '✓';
              tooltipSessions.push({ type: 'Teoría', status: 'attended' });
            } else {
              tdDay.classList.add('cell-absent');
              tdDay.textContent = 'F';
              tooltipSessions.push({ type: 'Teoría', status: 'absent' });
            }
          } else {
            tdDay.classList.add('cell-none');
          }
        } else if (filter === 'practica') {
          // Filtrado: Solo Práctica
          if (dayData && dayData.practica) {
            if (dayData.practica === 'attended') {
              tdDay.classList.add('cell-attended');
              tdDay.textContent = '✓';
              tooltipSessions.push({ type: 'Práctica', status: 'attended' });
            } else {
              tdDay.classList.add('cell-absent');
              tdDay.textContent = 'F';
              tooltipSessions.push({ type: 'Práctica', status: 'absent' });
            }
          } else {
            tdDay.classList.add('cell-none');
          }
        } else {
          // Modo "Todo"
          if (dayData) {
            // ¿Doble sesión el mismo día (Teoría y Práctica)?
            if (dayData.teoria && dayData.practica) {
              // Caso 1: Asistió a ambas -> Celda completa en verde con ✓
              if (dayData.teoria === 'attended' && dayData.practica === 'attended') {
                tdDay.classList.add('cell-attended');
                tdDay.textContent = '✓';
                tooltipSessions.push({ type: 'Teoría', status: 'attended' });
                tooltipSessions.push({ type: 'Práctica', status: 'attended' });
              }
              // Caso 2: Faltó a ambas -> Celda completa en rojo con F
              else if (dayData.teoria === 'absent' && dayData.practica === 'absent') {
                tdDay.classList.add('cell-absent');
                tdDay.textContent = 'F';
                tooltipSessions.push({ type: 'Teoría', status: 'absent' });
                tooltipSessions.push({ type: 'Práctica', status: 'absent' });
              }
              // Caso 3: Asistió a Teoría (✓) y Faltó a Práctica (F) -> Celda Dividida Bicolor
              else if (dayData.teoria === 'attended' && dayData.practica === 'absent') {
                tdDay.classList.add('cell-split');
                tdDay.innerHTML = `
                  <span class="split-half-top split-attended">✓</span>
                  <span class="split-half-bottom split-absent">F</span>
                `;
                tooltipSessions.push({ type: 'Teoría', status: 'attended' });
                tooltipSessions.push({ type: 'Práctica', status: 'absent' });
              }
              // Caso 4: Faltó a Teoría (F) y Asistió a Práctica (✓) [viceversa] -> Celda Dividida
              else if (dayData.teoria === 'absent' && dayData.practica === 'attended') {
                tdDay.classList.add('cell-split');
                tdDay.innerHTML = `
                  <span class="split-half-top split-absent">F</span>
                  <span class="split-half-bottom split-attended">✓</span>
                `;
                tooltipSessions.push({ type: 'Teoría', status: 'absent' });
                tooltipSessions.push({ type: 'Práctica', status: 'attended' });
              }
            }
            // Sesión única: Solo Teoría
            else if (dayData.teoria) {
              if (dayData.teoria === 'attended') {
                tdDay.classList.add('cell-attended');
                tdDay.textContent = '✓';
                tooltipSessions.push({ type: 'Teoría', status: 'attended' });
              } else {
                tdDay.classList.add('cell-absent');
                tdDay.textContent = 'F';
                tooltipSessions.push({ type: 'Teoría', status: 'absent' });
              }
            }
            // Sesión única: Solo Práctica
            else if (dayData.practica) {
              if (dayData.practica === 'attended') {
                tdDay.classList.add('cell-attended');
                tdDay.textContent = '✓';
                tooltipSessions.push({ type: 'Práctica', status: 'attended' });
              } else {
                tdDay.classList.add('cell-absent');
                tdDay.textContent = 'F';
                tooltipSessions.push({ type: 'Práctica', status: 'absent' });
              }
            }
          } else {
            // Sin clase programada
            tdDay.classList.add('cell-none');
          }
        }

        // Asociar datos de tooltip interactivo
        if (tooltipSessions.length > 0) {
          const dateStr = getDateString(2025, month.monthIndex, day, month.name);
          tdDay.dataset.tooltipInfo = JSON.stringify({
            dateStr: dateStr,
            sessions: tooltipSessions
          });

          // Eventos para hover (Desktop)
          tdDay.addEventListener('mouseenter', () => showTooltip(tdDay));
          tdDay.addEventListener('mouseleave', () => hideTooltip());

          // Evento para click/tap (Mobile y Touch)
          tdDay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTooltipCell === tdDay) {
              hideTooltip();
            } else {
              showTooltip(tdDay);
            }
          });
        }

        tr.appendChild(tdDay);
      }

      tbody.appendChild(tr);
    });
  }

  // ==========================================
  // 6. RENDERIZADO INICIAL DE TODOS LOS CURSOS
  // ==========================================
  const renderAllCalendars = () => {
    attendanceDataset.forEach(course => {
      renderCourseCalendar(course);
      updateCourseHeaderStats(course.id, course.activeTypeFilter || 'all');
    });
  };

  renderAllCalendars();

  // ==========================================
  // 7. SELECTOR DE TIPO POR CURSO ([ Todo ] | [ Solo Teoría ] | [ Solo Práctica ])
  // ==========================================
  document.querySelectorAll('.course-type-filter').forEach(filterContainer => {
    const courseId = parseInt(filterContainer.getAttribute('data-course-id'), 10);
    const course = attendanceDataset.find(c => c.id === courseId);
    if (!course) return;

    filterContainer.querySelectorAll('.type-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.type-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const type = btn.getAttribute('data-type'); // 'all', 'teoria', 'practica'
        course.activeTypeFilter = type;

        // Re-renderizar el calendario del curso y recalcular stats
        renderCourseCalendar(course);
        updateCourseHeaderStats(course.id, type);

        // Mantener el filtro de mes si estuviera activo
        applyActiveMonthFilter();
      });
    });
  });

  // ==========================================
  // 8. MANEJO DE FILTROS POR MES GENERAL
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');

  function applyActiveMonthFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (!activeBtn) return;

    const selectedMonth = activeBtn.getAttribute('data-month');
    const calendarRows = document.querySelectorAll('.calendar-table tbody tr');

    calendarRows.forEach(row => {
      const rowMonth = row.getAttribute('data-row-month');
      if (selectedMonth === 'all') {
        row.classList.remove('hidden-row');
      } else {
        if (rowMonth === selectedMonth) {
          row.classList.remove('hidden-row');
        } else {
          row.classList.add('hidden-row');
        }
      }
    });
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyActiveMonthFilter();
      });
    });
  }

});
