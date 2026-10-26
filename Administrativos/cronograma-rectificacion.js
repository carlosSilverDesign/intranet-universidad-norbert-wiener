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
    { id: 4, periodo: '2026-I', tipoEval: 'Eval. Permanente 2 (UD2)', tipoCurso: 'REGULAR', fechaInicio: '06/04/2026', fechaFin: '16/07/2026', estado: 'INACTIVO' },
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
      return JSON.parse(data);
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
    inputFechaInicio.value = '2026-09-14';
    inputFechaFin.value = '2026-09-18';
    inputEstado.value = 'ACTIVO';
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
    
    // Convertir DD/MM/YYYY a YYYY-MM-DD
    const parseToIso = (str) => {
      if (!str) return '2026-09-14';
      const parts = str.split('/');
      if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      return str;
    };

    inputFechaInicio.value = parseToIso(item.fechaInicio);
    inputFechaFin.value = parseToIso(item.fechaFin);
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

    const parseFromIso = (str) => {
      if (!str) return '14/09/2026';
      const parts = str.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return str;
    };

    const fechaIniFormateada = parseFromIso(inputFechaInicio.value);
    const fechaFinFormateada = parseFromIso(inputFechaFin.value);

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
  // CUSTOM SELECT ENHANCEMENT (Animación, chevron rotativo, menú flotante)
  // Look & Feel exacto de rectificacion-nota.html
  // ==========================================================================

  function initCustomSelects() {
    const wrappers = document.querySelectorAll('.notes-select-wrapper');

    wrappers.forEach(wrapper => {
      const select = wrapper.querySelector('select');
      if (!select) return;

      select.classList.add('custom-select-hidden');

      let trigger = wrapper.querySelector('.custom-select-trigger');
      let menu = wrapper.querySelector('.custom-select-menu');
      let icon = wrapper.querySelector('.notes-select-icon');

      if (!icon) {
        icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'notes-select-icon');
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
        trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.tabIndex = 0;
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'listbox');

        const valSpan = document.createElement('span');
        valSpan.className = 'custom-select-value';
        trigger.appendChild(valSpan);

        wrapper.insertBefore(trigger, icon);

        // Click en el trigger para alternar menú y rotar flecha 180°
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = wrapper.classList.contains('is-open');
          closeAllCustomSelects();
          if (!isOpen) {
            wrapper.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });

        // Soporte de navegación por teclado
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            const isOpen = wrapper.classList.contains('is-open');
            if (!isOpen) {
              closeAllCustomSelects();
              wrapper.classList.add('is-open');
              trigger.setAttribute('aria-expanded', 'true');
            } else if (e.key === 'Enter' || e.key === ' ') {
              closeAllCustomSelects();
            }
          } else if (e.key === 'Escape') {
            closeAllCustomSelects();
          }
        });
      }

      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'custom-select-menu';
        menu.setAttribute('role', 'listbox');
        wrapper.appendChild(menu);
      }

      // Reconstruir opciones del menú
      menu.innerHTML = '';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      const valSpan = trigger.querySelector('.custom-select-value');
      if (valSpan && selectedOption) {
        valSpan.textContent = selectedOption.textContent;
      }

      Array.from(select.options).forEach(opt => {
        const item = document.createElement('div');
        item.className = 'custom-select-option' + (opt.selected ? ' is-selected' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
        item.setAttribute('data-value', opt.value);

        const textSpan = document.createElement('span');
        textSpan.textContent = opt.textContent;
        item.appendChild(textSpan);

        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('class', 'option-check-icon');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', 'currentColor');
        checkSvg.setAttribute('stroke-width', '2.5');
        checkSvg.setAttribute('stroke-linecap', 'round');
        checkSvg.setAttribute('stroke-linejoin', 'round');
        checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
        item.appendChild(checkSvg);

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          if (valSpan) valSpan.textContent = opt.textContent;

          menu.querySelectorAll('.custom-select-option').forEach(el => {
            el.classList.remove('is-selected');
            el.setAttribute('aria-selected', 'false');
          });
          item.classList.add('is-selected');
          item.setAttribute('aria-selected', 'true');

          closeAllCustomSelects();
          trigger.focus();

          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        menu.appendChild(item);
      });
    });
  }

  function closeAllCustomSelects() {
    document.querySelectorAll('.notes-select-wrapper.is-open').forEach(w => {
      w.classList.remove('is-open');
      const trig = w.querySelector('.custom-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.notes-select-wrapper')) {
      closeAllCustomSelects();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllCustomSelects();
    }
  });

  function syncCustomSelect(selectEl) {
    if (!selectEl) return;
    const wrapper = selectEl.closest('.notes-select-wrapper');
    if (!wrapper) return;
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const menu = wrapper.querySelector('.custom-select-menu');
    if (!trigger || !menu) return;

    const valSpan = trigger.querySelector('.custom-select-value');
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    if (valSpan && selectedOption) {
      valSpan.textContent = selectedOption.textContent;
    }

    menu.querySelectorAll('.custom-select-option').forEach(item => {
      const isSel = item.getAttribute('data-value') === selectEl.value;
      if (isSel) {
        item.classList.add('is-selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('is-selected');
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  // Inicialización
  initCustomSelects();
  renderTable();
});
