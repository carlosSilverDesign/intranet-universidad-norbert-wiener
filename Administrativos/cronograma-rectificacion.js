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
        <td><span class="period-badge-tag">${item.periodo}</span></td>
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
        <td style="text-align: center;">
          <button type="button" class="btn-table-action-icon" data-id="${item.id}" title="Editar / Configurar Cronograma" aria-label="Editar">
            ${EDIT_SVG}
          </button>
        </td>
      `;

      const btnEdit = tr.querySelector('.btn-table-action-icon');
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

  // Inicialización
  renderTable();
});
