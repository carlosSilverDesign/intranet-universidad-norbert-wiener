/**
 * CRONOGRAMA DE RECTIFICACIÓN DE NOTAS - LOGICA JS
 * Perfil: Administrador RRAA
 * Universidad Norbert Wiener
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Datos iniciales precargados (se sincronizan con localStorage)
  const INITIAL_CRONOGRAMAS = [
    { id: 1, periodo: '2026-I', tipoEval: 'Eval. Permanente 1 (UD1)', tipoCurso: 'REGULAR', fechaInicio: '14/09/2026', fechaFin: '18/09/2026', estado: 'ACTIVO' },
    { id: 2, periodo: '2026-I', tipoEval: 'Eval. Permanente 1 (UD1)', tipoCurso: 'MODULO 1', fechaInicio: '16/03/2026', fechaFin: '18/04/2026', estado: 'INACTIVO' },
    { id: 3, periodo: '2026-I', tipoEval: 'Eval. Permanente 1 (UD1)', tipoCurso: 'MODULO 2', fechaInicio: '01/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 4, periodo: '2026-I', tipoEval: 'Eval. Permanente 2 (UD2)', tipoCurso: 'REGULAR', fechaInicio: '06/04/2026', fechaFin: '16/07/2026', estado: 'ACTIVO' },
    { id: 5, periodo: '2026-I', tipoEval: 'Eval. Permanente 2 (UD2)', tipoCurso: 'MODULO 1', fechaInicio: '06/04/2026', fechaFin: '09/05/2026', estado: 'INACTIVO' },
    { id: 6, periodo: '2026-I', tipoEval: 'Eval. Permanente 2 (UD2)', tipoCurso: 'MODULO 2', fechaInicio: '08/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 7, periodo: '2026-I', tipoEval: 'Eval. Permanente 3 (UD3)', tipoCurso: 'REGULAR', fechaInicio: '04/05/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 8, periodo: '2026-I', tipoEval: 'Eval. Permanente 3 (UD3)', tipoCurso: 'MODULO 1', fechaInicio: '20/04/2026', fechaFin: '16/05/2026', estado: 'INACTIVO' },
    { id: 9, periodo: '2026-I', tipoEval: 'Eval. Permanente 3 (UD3)', tipoCurso: 'MODULO 2', fechaInicio: '15/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 10, periodo: '2026-I', tipoEval: 'Eval. Permanente 4 (UD4)', tipoCurso: 'REGULAR', fechaInicio: '01/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 11, periodo: '2026-I', tipoEval: 'Eval. Permanente 4 (UD4)', tipoCurso: 'MODULO 1', fechaInicio: '18/05/2026', fechaFin: '13/06/2026', estado: 'INACTIVO' },
    { id: 12, periodo: '2026-I', tipoEval: 'Eval. Permanente 4 (UD4)', tipoCurso: 'MODULO 2', fechaInicio: '22/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 13, periodo: '2026-I', tipoEval: 'Examen Parcial (E1)', tipoCurso: 'REGULAR', fechaInicio: '25/05/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 14, periodo: '2026-I', tipoEval: 'Examen Parcial (E1)', tipoCurso: 'MODULO 1', fechaInicio: '20/04/2026', fechaFin: '17/05/2026', estado: 'INACTIVO' },
    { id: 15, periodo: '2026-I', tipoEval: 'Examen Parcial (E1)', tipoCurso: 'MODULO 2', fechaInicio: '15/06/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 16, periodo: '2026-I', tipoEval: 'Examen Final (E2)', tipoCurso: 'MODULO 2', fechaInicio: '13/07/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 17, periodo: '2026-I', tipoEval: 'Examen Final (E2)', tipoCurso: 'REGULAR', fechaInicio: '13/07/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 18, periodo: '2026-I', tipoEval: 'Examen Final (E2)', tipoCurso: 'MODULO 1', fechaInicio: '18/05/2026', fechaFin: '20/05/2026', estado: 'INACTIVO' },
    { id: 19, periodo: '2026-I', tipoEval: 'Examen Sustitutorio (E3)', tipoCurso: 'REGULAR', fechaInicio: '16/07/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
    { id: 20, periodo: '2026-II', tipoEval: 'Eval. Permanente 1 (UD1)', tipoCurso: 'REGULAR', fechaInicio: '14/09/2026', fechaFin: '18/09/2026', estado: 'ACTIVO' }
  ];

  const STORAGE_KEY = 'wiener_cronogramas_data';

  function getCronogramas() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CRONOGRAMAS));
      return INITIAL_CRONOGRAMAS;
    }
    try {
      const list = JSON.parse(data);
      const activos2026I = list.filter(x => x.periodo === '2026-I' && x.estado === 'ACTIVO');
      if (activos2026I.length < 2) {
        const item4 = list.find(x => x.id === 4);
        if (item4) item4.estado = 'ACTIVO';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      return INITIAL_CRONOGRAMAS;
    }
  }

  function saveCronogramas(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // 2. Elementos DOM
  const tableBody = document.getElementById('cronogramasTableBody');
  const countShownEl = document.getElementById('countShown');
  const countActivosEl = document.getElementById('countActivos');
  const countInactivosEl = document.getElementById('countInactivos');
  const pagCountEl = document.getElementById('pagCount');
  const pagTotalEl = document.getElementById('pagTotal');
  
  const filterPeriodo = document.getElementById('filterPeriodo');
  const filterTipoEval = document.getElementById('filterTipoEval');
  const filterTipoCurso = document.getElementById('filterTipoCurso');
  const filterEstado = document.getElementById('filterEstado');
  const btnClearFilters = document.getElementById('btnClearFilters');

  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const modalBackdrop = document.getElementById('modalCronogramaBackdrop');
  const btnCloseModal = document.getElementById('btnCloseModalCronograma');
  const btnCancelModal = document.getElementById('btnCancelModalCronograma');
  const btnSaveCronograma = document.getElementById('btnSaveCronograma');
  const modalTitle = document.getElementById('modalCronogramaTitle');

  const inputEditIndex = document.getElementById('cronogramaEditIndex');
  const inputPeriodo = document.getElementById('modalInputPeriodo');
  const inputTipoEval = document.getElementById('modalInputTipoEval');
  const inputTipoCurso = document.getElementById('modalInputTipoCurso');
  const inputFechaInicio = document.getElementById('modalInputFechaInicio');
  const inputFechaFin = document.getElementById('modalInputFechaFin');
  const inputEstado = document.getElementById('modalInputEstado');

  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // SVG Icono Lupa / Detalle
  const EDIT_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>`;

  // 3. Renderizar Tabla
  function renderTable() {
    const list = getCronogramas();
    const fPeriodo = filterPeriodo.value;
    const fEval = filterTipoEval.value;
    const fCurso = filterTipoCurso.value;
    const fEstado = filterEstado.value;

    const filtered = list.filter(item => {
      const matchPeriodo = fPeriodo === 'todos' || item.periodo.replace(/\s+/g, '') === fPeriodo.replace(/\s+/g, '');
      const matchEval = fEval === 'todos' || item.tipoEval.toLowerCase() === fEval.toLowerCase();
      const matchCurso = fCurso === 'todos' || item.tipoCurso.toUpperCase() === fCurso.toUpperCase();
      const matchEstado = fEstado === 'todos' || item.estado.toUpperCase() === fEstado.toUpperCase();
      return matchPeriodo && matchEval && matchCurso && matchEstado;
    });

    // Actualizar contadores
    const activos = filtered.filter(x => x.estado === 'ACTIVO').length;
    const inactivos = filtered.filter(x => x.estado === 'INACTIVO').length;
    if (countShownEl) countShownEl.textContent = filtered.length;
    if (countActivosEl) countActivosEl.textContent = activos;
    if (countInactivosEl) countInactivosEl.textContent = inactivos;
    if (pagCountEl) pagCountEl.textContent = filtered.length;
    if (pagTotalEl) pagTotalEl.textContent = list.length;

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 48px 16px; color: #64748B;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p style="font-weight: 700; color: #334155; font-size: 15px;">No se encontraron registros de cronograma</p>
              <p style="font-size: 13px;">Prueba ajustando los filtros de periodo o evaluación.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item, index) => {
      const isActivo = item.estado === 'ACTIVO';
      const isModulo = item.tipoCurso.includes('MODULO');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${index + 1}</td>
        <td>${item.periodo}</td>
        <td style="font-weight: 700; color: #0F172A;">${item.tipoEval}</td>
        <td>
          <span class="course-type-pill ${isModulo ? 'modulo' : 'regular'}">
            ${item.tipoCurso}
          </span>
        </td>
        <td><span style="font-weight: 600;">${item.fechaInicio}</span></td>
        <td><span style="font-weight: 600;">${item.fechaFin}</span></td>
        <td style="text-align: center;">
          <span class="status-badge-inline ${isActivo ? 'activo' : 'inactivo'}">
            <span class="badge-dot"></span>
            ${item.estado}
          </span>
        </td>
        <td class="col-td-acciones col-td-detalle">
          <button type="button" class="btn-row-action" data-id="${item.id}" title="Ver detalle de cronograma">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </td>
      `;

      const btnEdit = tr.querySelector('.btn-row-action');
      btnEdit.addEventListener('click', () => {
        openEditModal(item);
      });

      tableBody.appendChild(tr);
    });
  }

  // 4. Modal Helpers
  function openAddModal() {
    inputEditIndex.value = '-1';
    modalTitle.textContent = 'Agregar Nuevo Cronograma';
    inputPeriodo.value = '2026-I';
    inputTipoEval.value = 'Eval. Permanente 1 (UD1)';
    inputTipoCurso.value = 'REGULAR';
    inputFechaInicio.value = '14/09/2026';
    inputFechaFin.value = '18/09/2026';
    inputEstado.value = 'ACTIVO';
    initDatePicker('dateContainerModalInicio', 'modalInputFechaInicio', '14/09/2026');
    initDatePicker('dateContainerModalFin', 'modalInputFechaFin', '18/09/2026');
    syncCustomSelect(inputPeriodo);
    syncCustomSelect(inputTipoEval);
    syncCustomSelect(inputTipoCurso);
    syncCustomSelect(inputEstado);
    modalBackdrop.classList.add('active');
  }

  function openEditModal(item) {
    inputEditIndex.value = item.id;
    modalTitle.textContent = 'Editar Detalle de Cronograma';
    inputPeriodo.value = item.periodo.replace(/\s+/g, '');
    inputTipoEval.value = item.tipoEval;
    inputTipoCurso.value = item.tipoCurso;
    inputFechaInicio.value = item.fechaInicio;
    inputFechaFin.value = item.fechaFin;
    initDatePicker('dateContainerModalInicio', 'modalInputFechaInicio', item.fechaInicio);
    initDatePicker('dateContainerModalFin', 'modalInputFechaFin', item.fechaFin);
    inputEstado.value = item.estado;

    syncCustomSelect(inputPeriodo);
    syncCustomSelect(inputTipoEval);
    syncCustomSelect(inputTipoCurso);
    syncCustomSelect(inputEstado);

    modalBackdrop.classList.add('active');
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
  }

  function showToast(msg) {
    toastText.textContent = msg;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3500);
  }

  function handleSave() {
    const list = getCronogramas();
    const id = parseInt(inputEditIndex.value, 10);

    const fechaIniFormateada = inputFechaInicio.value || '14/09/2026';
    const fechaFinFormateada = inputFechaFin.value || '18/09/2026';

    if (id === -1) {
      // Crear nuevo
      const newId = list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1;
      const nuevo = {
        id: newId,
        periodo: inputPeriodo.value,
        tipoEval: inputTipoEval.value,
        tipoCurso: inputTipoCurso.value,
        fechaInicio: fechaIniFormateada,
        fechaFin: fechaFinFormateada,
        estado: inputEstado.value
      };
      list.unshift(nuevo);
      saveCronogramas(list);
      showToast('Cronograma agregado exitosamente');
    } else {
      // Actualizar existente
      const idx = list.findIndex(x => x.id === id);
      if (idx !== -1) {
        list[idx].periodo = inputPeriodo.value;
        list[idx].tipoEval = inputTipoEval.value;
        list[idx].tipoCurso = inputTipoCurso.value;
        list[idx].fechaInicio = fechaIniFormateada;
        list[idx].fechaFin = fechaFinFormateada;
        list[idx].estado = inputEstado.value;
        saveCronogramas(list);
        showToast('Cronograma actualizado exitosamente');
      }
    }

    closeModal();
    renderTable();
  }

  // 5. Event Listeners
  if (filterPeriodo) filterPeriodo.addEventListener('change', renderTable);
  if (filterTipoEval) filterTipoEval.addEventListener('change', renderTable);
  if (filterTipoCurso) filterTipoCurso.addEventListener('change', renderTable);
  if (filterEstado) filterEstado.addEventListener('change', renderTable);

  if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
      filterPeriodo.value = 'todos';
      filterTipoEval.value = 'todos';
      filterTipoCurso.value = 'todos';
      filterEstado.value = 'todos';
      syncCustomSelect(filterPeriodo);
      syncCustomSelect(filterTipoEval);
      syncCustomSelect(filterTipoCurso);
      syncCustomSelect(filterEstado);
      renderTable();
      showToast('Filtros restablecidos');
    });
  }

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', openAddModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);
  if (btnSaveCronograma) btnSaveCronograma.addEventListener('click', handleSave);

  // Cerrar al clickear backdrop
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }


  // ==========================================================================
  // CUSTOM SELECTS PERSONALIZADOS WIENER (Smart Positioning, Keyframes y Micro-animaciones)
  // Replicado del estándar de rectificacion-asistencia-docente.html
  // ==========================================================================
  function initCustomSelects() {
    const wrappers = document.querySelectorAll('.rect-select-wrapper, .notes-select-wrapper, .custom-select-container');

    wrappers.forEach(wrapper => {
      const select = wrapper.querySelector('select');
      if (!select) return;

      select.classList.add('custom-select-hidden');

      let trigger = wrapper.querySelector('.custom-select-trigger');
      let menu = wrapper.querySelector('.custom-dropdown-menu, .custom-select-menu');
      let icon = wrapper.querySelector('.rect-select-icon, .notes-select-icon, .custom-select-arrow');

      if (!icon) {
        icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'rect-select-icon custom-select-arrow');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        wrapper.appendChild(icon);
      }

      if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-trigger';
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'listbox');

        const valSpan = document.createElement('span');
        valSpan.className = 'custom-select-value custom-select-label';
        trigger.appendChild(valSpan);

        wrapper.insertBefore(trigger, icon);

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = wrapper.classList.contains('is-open');
          closeAllCustomDropdowns();

          if (!isOpen) {
            const triggerRect = trigger.getBoundingClientRect();
            const menuHeight = 220;
            const spaceBelow = window.innerHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');
            if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
              menu.classList.add('dropdown-above');
            } else {
              menu.classList.add('dropdown-below');
            }

            if (window.innerWidth - triggerRect.left < 260) {
              menu.classList.add('align-right');
            }

            wrapper.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });

        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            const isOpen = wrapper.classList.contains('is-open');
            if (!isOpen) {
              closeAllCustomDropdowns();
              const triggerRect = trigger.getBoundingClientRect();
              const menuHeight = 220;
              const spaceBelow = window.innerHeight - triggerRect.bottom;
              const spaceAbove = triggerRect.top;
              menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');
              if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
                menu.classList.add('dropdown-above');
              } else {
                menu.classList.add('dropdown-below');
              }
              wrapper.classList.add('is-open');
              trigger.setAttribute('aria-expanded', 'true');
            } else if (e.key === 'Enter' || e.key === ' ') {
              closeAllCustomDropdowns();
            }
          } else if (e.key === 'Escape') {
            closeAllCustomDropdowns();
          }
        });
      }

      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'custom-dropdown-menu custom-select-menu';
        menu.setAttribute('role', 'listbox');
        wrapper.appendChild(menu);
      }

      menu.innerHTML = '';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      const valSpan = trigger.querySelector('.custom-select-value');
      if (valSpan && selectedOption) {
        valSpan.textContent = selectedOption.textContent;
      }

      Array.from(select.options).forEach(opt => {
        const item = document.createElement('div');
        item.className = 'custom-option custom-select-option' + (opt.selected ? ' selected is-selected' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
        item.setAttribute('data-value', opt.value);

        const textSpan = document.createElement('span');
        textSpan.textContent = opt.textContent;
        item.appendChild(textSpan);

        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('class', 'option-check option-check-icon');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('width', '16');
        checkSvg.setAttribute('height', '16');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', '#0F848F');
        checkSvg.setAttribute('stroke-width', '2.2');
        checkSvg.setAttribute('stroke-linecap', 'round');
        checkSvg.setAttribute('stroke-linejoin', 'round');
        checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        item.appendChild(checkSvg);

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          if (valSpan) valSpan.textContent = opt.textContent;

          menu.querySelectorAll('.custom-option, .custom-select-option').forEach(el => {
            el.classList.remove('selected', 'is-selected');
            el.setAttribute('aria-selected', 'false');
          });
          item.classList.add('selected', 'is-selected');
          item.setAttribute('aria-selected', 'true');

          closeAllCustomDropdowns();
          trigger.focus();

          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        menu.appendChild(item);
      });
    });
  }

  // ==========================================================================
  // CUSTOM DATEPICKER WIENER (CALENDARIO FLOTANTE INTERACTIVO)
  // Replicado del estándar de rectificacion-asistencia-docente.html
  // ==========================================================================
  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function initDatePicker(containerId, inputId, defaultDateStr) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    if (!container || !input) return;

    if (defaultDateStr) {
      input.value = defaultDateStr;
    }

    if (container._datePickerInitialized) {
      if (container._setDate) container._setDate(defaultDateStr || input.value);
      return;
    }
    container._datePickerInitialized = true;

    const popup = container.querySelector('.custom-calendar-popup');
    const trigger = container.querySelector('.custom-date-trigger');
    if (!popup || !trigger) return;

    let parts = (defaultDateStr || '14/09/2026').split('/');
    let curDay = parseInt(parts[0], 10) || 14;
    let curMonth = (parseInt(parts[1], 10) || 9) - 1;
    let curYear = parseInt(parts[2], 10) || 2026;

    let viewMonth = curMonth;
    let viewYear = curYear;

    function renderCalendar() {
      popup.innerHTML = `
        <div class="cal-header">
          <span class="cal-month-title">${mesesNombres[viewMonth]} ${viewYear}</span>
          <div class="cal-nav-group">
            <button type="button" class="cal-nav-btn prev-month" aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="cal-nav-btn next-month" aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
        <div class="cal-weekdays-grid">
          <span class="cal-weekday">DO</span>
          <span class="cal-weekday">LU</span>
          <span class="cal-weekday">MA</span>
          <span class="cal-weekday">MI</span>
          <span class="cal-weekday">JU</span>
          <span class="cal-weekday">VI</span>
          <span class="cal-weekday">SÁ</span>
        </div>
        <div class="cal-days-grid" id="calDaysGrid_${inputId}"></div>
      `;

      const grid = popup.querySelector(`#calDaysGrid_${inputId}`);
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

      for (let i = firstDay - 1; i >= 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell other-month';
        cell.textContent = daysInPrevMonth - i;
        grid.appendChild(cell);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        cell.textContent = day;

        if (day === curDay && viewMonth === curMonth && viewYear === curYear) {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          curDay = day;
          curMonth = viewMonth;
          curYear = viewYear;

          const dd = String(curDay).padStart(2, '0');
          const mm = String(curMonth + 1).padStart(2, '0');
          input.value = `${dd}/${mm}/${curYear}`;
          input.dispatchEvent(new Event('change', { bubbles: true }));

          container.classList.remove('is-open');
        });

        grid.appendChild(cell);
      }

      popup.querySelector('.prev-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });

      popup.querySelector('.next-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');
      closeAllCustomDropdowns();

      if (!isOpen) {
        renderCalendar();
        const triggerRect = trigger.getBoundingClientRect();
        popup.classList.remove('popup-above', 'popup-below', 'align-right');
        const modalBody = container.closest('.modal-body-rect, .modal-body, .modal-container, .modal-card');
        let openAbove = false;
        if (modalBody) {
          const bodyRect = modalBody.getBoundingClientRect();
          if (bodyRect.bottom - triggerRect.bottom < 270 && triggerRect.top - bodyRect.top > 200) {
            openAbove = true;
          }
        }
        if (!openAbove && (window.innerHeight - triggerRect.bottom < 280 && triggerRect.top > 280)) {
          openAbove = true;
        }
        if (openAbove) {
          popup.classList.add('popup-above');
        } else {
          popup.classList.add('popup-below');
        }
        if (window.innerWidth - triggerRect.left < 300) {
          popup.classList.add('align-right');
        }
        container.classList.add('is-open');
      }
    });
  }

  function closeAllCustomDropdowns() {
    document.querySelectorAll('.rect-select-wrapper.is-open, .notes-select-wrapper.is-open, .custom-select-container.is-open').forEach(c => {
      c.classList.remove('is-open');
      const t = c.querySelector('.custom-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.custom-date-container.is-open').forEach(c => {
      c.classList.remove('is-open');
    });
  }

  document.addEventListener('click', () => {
    closeAllCustomDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCustomDropdowns();
    }
  });

  function syncCustomSelect(selectEl) {
    if (!selectEl) return;
    const wrapper = selectEl.closest('.rect-select-wrapper, .notes-select-wrapper, .custom-select-container');
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const menu = wrapper.querySelector('.custom-dropdown-menu, .custom-select-menu');
    if (!trigger || !menu) return;

    const valSpan = trigger.querySelector('.custom-select-value');
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    if (valSpan && selectedOption) {
      valSpan.textContent = selectedOption.textContent;
    }

    menu.innerHTML = '';
    Array.from(selectEl.options).forEach(opt => {
      const item = document.createElement('div');
      item.className = 'custom-option custom-select-option' + (opt.selected ? ' selected is-selected' : '');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
      item.setAttribute('data-value', opt.value);

      const textSpan = document.createElement('span');
      textSpan.textContent = opt.textContent;
      item.appendChild(textSpan);

      const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      checkSvg.setAttribute('class', 'option-check option-check-icon');
      checkSvg.setAttribute('viewBox', '0 0 24 24');
      checkSvg.setAttribute('width', '16');
      checkSvg.setAttribute('height', '16');
      checkSvg.setAttribute('fill', 'none');
      checkSvg.setAttribute('stroke', '#0F848F');
      checkSvg.setAttribute('stroke-width', '2.2');
      checkSvg.setAttribute('stroke-linecap', 'round');
      checkSvg.setAttribute('stroke-linejoin', 'round');
      checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      item.appendChild(checkSvg);

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectEl.value = opt.value;
        if (valSpan) valSpan.textContent = opt.textContent;

        menu.querySelectorAll('.custom-option, .custom-select-option').forEach(el => {
          el.classList.remove('selected', 'is-selected');
          el.setAttribute('aria-selected', 'false');
        });
        item.classList.add('selected', 'is-selected');
        item.setAttribute('aria-selected', 'true');

        closeAllCustomDropdowns();
        trigger.focus();
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
      });

      menu.appendChild(item);
    });
  }
  // Cargar tabla inicial
  renderTable();
  initCustomSelects();
});
