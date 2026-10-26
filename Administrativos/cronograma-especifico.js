/**
 * CRONOGRAMA ESPECÍFICO DE RECTIFICACIÓN DE NOTAS - LÓGICA JS
 * Perfil: Administrador RRAA / Director de Escuela
 * Universidad Norbert Wiener
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Datos iniciales precargados (se sincronizan con localStorage)
  const INITIAL_CRONOGRAMAS_ESPECIFICOS = [
    {
      id: 1,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Marzo',
      modalidad: 'Presencial',
      carrera: 'NUTRICIÓN Y DIETÉTICA',
      seccion: 'ND2N5',
      curso: 'MECANISMOS DE AGRESIÓN Y DEFENSA I',
      tipoSesion: 'Teoría',
      tipoEval: 'Examen Sustitutorio (E3)',
      docente: 'VALDIVIESO OLIVA VANESSA',
      fechaInicio: '12/09/2026',
      fechaFin: '12/09/2026',
      estado: 'INACTIVO'
    },
    {
      id: 2,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Marzo',
      modalidad: 'Presencial',
      carrera: 'NUTRICIÓN Y DIETÉTICA',
      seccion: 'ND2N5',
      curso: 'MECANISMOS DE AGRESIÓN Y DEFENSA I',
      tipoSesion: 'Teoría',
      tipoEval: 'Examen Sustitutorio (E3)',
      docente: 'MANOSALVA MEDINA KARIM DEL PILAR',
      fechaInicio: '12/09/2026',
      fechaFin: '12/09/2026',
      estado: 'INACTIVO'
    },
    {
      id: 3,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Marzo',
      modalidad: 'Presencial',
      carrera: 'MEDICINA HUMANA',
      seccion: 'MH3T2',
      curso: 'FARMACOLOGÍA GENERAL',
      tipoSesion: 'Teoría',
      tipoEval: 'Examen Parcial (E1)',
      docente: 'ALVAREZ SANDOVAL CARLOS ENRIQUE',
      fechaInicio: '15/09/2026',
      fechaFin: '20/09/2026',
      estado: 'ACTIVO'
    },
    {
      id: 4,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Marzo',
      modalidad: 'Semipresencial',
      carrera: 'ENFERMERÍA',
      seccion: 'EN1M1',
      curso: 'BIOQUÍMICA Y NUTRICIÓN',
      tipoSesion: 'Práctica',
      tipoEval: 'Eval. Permanente 1 (UD1)',
      docente: 'QUISPE MENDOZA JORGE LUIS',
      fechaInicio: '18/09/2026',
      fechaFin: '22/09/2026',
      estado: 'ACTIVO'
    },
    {
      id: 5,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Marzo',
      modalidad: 'Presencial',
      carrera: 'DERECHO',
      seccion: 'DE2N1',
      curso: 'DERECHO CONSTITUCIONAL',
      tipoSesion: 'Teoría',
      tipoEval: 'Examen Sustitutorio (E3)',
      docente: 'RAMIREZ TORRES PATRICIA ELENA',
      fechaInicio: '10/09/2026',
      fechaFin: '12/09/2026',
      estado: 'INACTIVO'
    },
    {
      id: 6,
      institucion: 'Universidad Privada Norbert Wiener S.A.',
      periodo: '2026-I',
      mes: 'Abril',
      modalidad: 'Presencial',
      carrera: 'NUTRICIÓN Y DIETÉTICA',
      seccion: 'ND3M1',
      curso: 'EVALUACIÓN DEL ESTADO NUTRICIONAL',
      tipoSesion: 'Práctica',
      tipoEval: 'Eval. Permanente 2 (UD2)',
      docente: 'HUAMAN ROJAS CARMEN ROSA',
      fechaInicio: '22/09/2026',
      fechaFin: '28/09/2026',
      estado: 'ACTIVO'
    }
  ];

  const STORAGE_KEY = 'wiener_cronogramas_especificos_data';

  function getCronogramasEspecificos() {
    const data = localStorage.getItem(STORAGE_KEY);
    let list;
    if (!data) {
      list = JSON.parse(JSON.stringify(INITIAL_CRONOGRAMAS_ESPECIFICOS));
    } else {
      try {
        list = JSON.parse(data);
      } catch (e) {
        list = JSON.parse(JSON.stringify(INITIAL_CRONOGRAMAS_ESPECIFICOS));
      }
    }
    list.forEach(item => {
      if (item.tipoSesion) {
        item.tipoSesion = item.tipoSesion.replace(/\s*-\s*$/, '');
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return list;
  }

  function saveCronogramasEspecificos(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // Utilidades de formato de fechas (DD/MM/YYYY <-> YYYY-MM-DD)
  function ddmmyyyyToYyyymmdd(str) {
    if (!str || !str.includes('/')) return '';
    const parts = str.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
    return '';
  }

  function yyyymmddToDdmmyyyy(str) {
    if (!str || !str.includes('-')) return '';
    const parts = str.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const m = parts[1];
      const d = parts[2];
      return `${d}/${m}/${y}`;
    }
    return '';
  }

  // 2. Elementos DOM de la vista
  const tableBody = document.getElementById('cronogramasTableBody');
  const countShownEl = document.getElementById('countShown');
  const countActivosEl = document.getElementById('countActivos');
  const countInactivosEl = document.getElementById('countInactivos');
  const pagCountEl = document.getElementById('pagCount');
  const pagTotalEl = document.getElementById('pagTotal');

  // Modal 1: Agregar cronograma específico
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const modalAgregarBackdrop = document.getElementById('modalAgregarBackdrop');
  const btnCloseModalAgregar = document.getElementById('btnCloseModalAgregar');
  const btnCancelModalAgregar = document.getElementById('btnCancelModalAgregar');
  const btnSaveAgregar = document.getElementById('btnSaveAgregar');
  const addPersonal = document.getElementById('addPersonal');
  const docenteSearchBox = document.getElementById('docenteSearchBox');

  function updateDocenteSearchVisibility() {
    if (docenteSearchBox && addPersonal) {
      docenteSearchBox.style.display = addPersonal.checked ? 'block' : 'none';
    }
  }

  if (addPersonal) {
    addPersonal.addEventListener('change', updateDocenteSearchVisibility);
  }

  const addInstitucion = document.getElementById('addInstitucion');
  const addPeriodo = document.getElementById('addPeriodo');
  const addMes = document.getElementById('addMes');
  const addModalidad = document.getElementById('addModalidad');
  const addCarrera = document.getElementById('addCarrera');
  const addSeccion = document.getElementById('addSeccion');
  const addCurso = document.getElementById('addCurso');
  const addTipoSesion = document.getElementById('addTipoSesion');
  const addTipoEval = document.getElementById('addTipoEval');
  const addFechaInicio = document.getElementById('addFechaInicio');
  const addFechaFin = document.getElementById('addFechaFin');

  const searchApePaterno = document.getElementById('searchApePaterno');
  const searchApeMaterno = document.getElementById('searchApeMaterno');
  const searchNombres = document.getElementById('searchNombres');
  const btnBuscarDocente = document.getElementById('btnBuscarDocente');
  const btnLimpiarDocente = document.getElementById('btnLimpiarDocente');
  const docenteSelectedPreview = document.getElementById('docenteSelectedPreview');
  const docenteSelectedName = document.getElementById('docenteSelectedName');

  // Modal 2: Detalle cronograma
  const modalDetalleBackdrop = document.getElementById('modalDetalleBackdrop');
  const btnCloseModalDetalle = document.getElementById('btnCloseModalDetalle');
  const btnCancelModalDetalle = document.getElementById('btnCancelModalDetalle');
  const btnSaveDetalle = document.getElementById('btnSaveDetalle');
  const detalleEditId = document.getElementById('detalleEditId');

  const detalleInstitucion = document.getElementById('detalleInstitucion');
  const detallePeriodo = document.getElementById('detallePeriodo');
  const detalleMes = document.getElementById('detalleMes');
  const detalleCarrera = document.getElementById('detalleCarrera');
  const detalleSeccion = document.getElementById('detalleSeccion');
  const detalleCurso = document.getElementById('detalleCurso');
  const detalleTipoSesion = document.getElementById('detalleTipoSesion');
  const detalleTipoEval = document.getElementById('detalleTipoEval');
  const detalleDocente = document.getElementById('detalleDocente');
  const detalleFechaInicio = document.getElementById('detalleFechaInicio');
  const detalleFechaFin = document.getElementById('detalleFechaFin');

  // Toast
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  function showToast(msg) {
    if (!toastMessage || !toastText) return;
    toastText.textContent = msg;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  // 3. Renderizar Tabla
  function renderTable() {
    const list = getCronogramasEspecificos();

    // Actualizar contadores
    const activos = list.filter(x => x.estado === 'ACTIVO').length;
    const inactivos = list.filter(x => x.estado === 'INACTIVO').length;
    if (countShownEl) countShownEl.textContent = list.length;
    if (countActivosEl) countActivosEl.textContent = activos;
    if (countInactivosEl) countInactivosEl.textContent = inactivos;
    if (pagCountEl) pagCountEl.textContent = list.length;
    if (pagTotalEl) pagTotalEl.textContent = list.length;

    tableBody.innerHTML = '';

    if (list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 48px 16px; color: #64748B;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p style="font-weight: 700; color: #334155; font-size: 15px;">No se encontraron excepciones de cronograma específico</p>
              <p style="font-size: 13px;">Agrega un nuevo cronograma específico mediante el botón superior.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((item, index) => {
      const isActivo = item.estado === 'ACTIVO';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${index + 1}</td>
        <td>${item.periodo}</td>
        <td><span style="font-weight: 600; color: #334155;">${item.mes}</span></td>
        <td style="font-weight: 600; font-size: 11.5px; color: #1E293B;">${item.carrera}</td>
        <td><strong style="color: #0F848F;">${item.seccion}</strong></td>
        <td style="font-weight: 600; color: #0F172A; max-width: 240px;">${item.curso}</td>
        <td style="color: #475569; font-weight: 500;">${item.tipoSesion}</td>
        <td style="font-weight: 500; color: #1E293B;">${item.tipoEval}</td>
        <td class="col-td-docente" title="${item.docente}">${item.docente}</td>
        <td><span style="font-weight: 600; white-space: nowrap;">${item.fechaInicio}</span></td>
        <td><span style="font-weight: 600; white-space: nowrap;">${item.fechaFin}</span></td>
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
      tableBody.appendChild(tr);
    });

    // Asignar listeners a los botones de "Detalle"
    tableBody.querySelectorAll('.btn-row-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openDetalleModal(id);
      });
    });
  }

  // 4. Modal 1: Agregar Cronograma Específico
  let currentSelectedDocente = 'VALDIVIESO OLIVA VANESSA';

  function openAgregarModal() {
    if (!modalAgregarBackdrop) return;

    // Valores por defecto
    if (addInstitucion) addInstitucion.value = 'Universidad Privada Norbert Wiener S.A.';
    if (addPeriodo) addPeriodo.value = '2026-I';
    if (addMes) addMes.value = 'Marzo';
    if (addModalidad) addModalidad.value = 'Presencial';
    if (addCarrera) addCarrera.value = 'NUTRICIÓN Y DIETÉTICA';
    if (addSeccion) addSeccion.value = 'ND2N5';
    if (addCurso) addCurso.value = 'MECANISMOS DE AGRESIÓN Y DEFENSA I';
    if (addTipoSesion) addTipoSesion.value = 'Teoría';
    if (addPersonal) addPersonal.checked = false;
    updateDocenteSearchVisibility();
    if (addTipoEval) addTipoEval.value = 'Examen Sustitutorio (E3)';
    if (addFechaInicio) addFechaInicio.value = '2026-09-12';
    if (addFechaFin) addFechaFin.value = '2026-09-12';

    if (searchApePaterno) searchApePaterno.value = '';
    if (searchApeMaterno) searchApeMaterno.value = '';
    if (searchNombres) searchNombres.value = '';

    currentSelectedDocente = 'VALDIVIESO OLIVA VANESSA';
    if (docenteSelectedName) docenteSelectedName.textContent = currentSelectedDocente;

    [addInstitucion, addPeriodo, addMes, addModalidad, addCarrera, addSeccion, addCurso, addTipoSesion, addTipoEval].forEach(syncCustomSelect);

    modalAgregarBackdrop.classList.add('active');
  }

  function closeAgregarModal() {
    if (!modalAgregarBackdrop) return;
    modalAgregarBackdrop.classList.remove('active');
  }

  if (btnOpenAddModal) btnOpenAddModal.addEventListener('click', openAgregarModal);
  if (btnCloseModalAgregar) btnCloseModalAgregar.addEventListener('click', closeAgregarModal);
  if (btnCancelModalAgregar) btnCancelModalAgregar.addEventListener('click', closeAgregarModal);

  // Búsqueda de docente dentro del modal
  if (btnBuscarDocente) {
    btnBuscarDocente.addEventListener('click', () => {
      const apPaterno = (searchApePaterno ? searchApePaterno.value.trim() : '').toUpperCase();
      const apMaterno = (searchApeMaterno ? searchApeMaterno.value.trim() : '').toUpperCase();
      const nombres = (searchNombres ? searchNombres.value.trim() : '').toUpperCase();

      if (apPaterno || apMaterno || nombres) {
        currentSelectedDocente = `${apPaterno} ${apMaterno} ${nombres}`.replace(/\s+/g, ' ').trim();
      } else {
        currentSelectedDocente = 'VALDIVIESO OLIVA VANESSA';
      }

      if (docenteSelectedName) docenteSelectedName.textContent = currentSelectedDocente;
      showToast(`Docente asignado: ${currentSelectedDocente}`);
    });
  }

  if (btnLimpiarDocente) {
    btnLimpiarDocente.addEventListener('click', () => {
      if (searchApePaterno) searchApePaterno.value = '';
      if (searchApeMaterno) searchApeMaterno.value = '';
      if (searchNombres) searchNombres.value = '';
      currentSelectedDocente = 'VALDIVIESO OLIVA VANESSA';
      if (docenteSelectedName) docenteSelectedName.textContent = currentSelectedDocente;
    });
  }

  if (btnSaveAgregar) {
    btnSaveAgregar.addEventListener('click', () => {
      const inicioVal = addFechaInicio ? addFechaInicio.value : '';
      const finVal = addFechaFin ? addFechaFin.value : '';

      if (!inicioVal || !finVal) {
        alert('Por favor ingrese las fechas de inicio y fin.');
        return;
      }

      if (inicioVal > finVal) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }

      const list = getCronogramasEspecificos();
      const nextId = list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1;

      const newRecord = {
        id: nextId,
        institucion: addInstitucion ? addInstitucion.value : 'Universidad Privada Norbert Wiener S.A.',
        periodo: addPeriodo ? addPeriodo.value : '2026-I',
        mes: addMes ? addMes.value : 'Marzo',
        modalidad: addModalidad ? addModalidad.value : 'Presencial',
        carrera: addCarrera ? addCarrera.value : 'NUTRICIÓN Y DIETÉTICA',
        seccion: addSeccion ? addSeccion.value : 'ND2N5',
        curso: addCurso ? addCurso.value : 'MECANISMOS DE AGRESIÓN Y DEFENSA I',
        tipoSesion: addTipoSesion ? addTipoSesion.value : 'Teoría',
        tipoEval: addTipoEval ? addTipoEval.value : 'Examen Sustitutorio (E3)',
        docente: currentSelectedDocente || 'DOCENTE DESIGNADO',
        fechaInicio: yyyymmddToDdmmyyyy(inicioVal),
        fechaFin: yyyymmddToDdmmyyyy(finVal),
        estado: 'ACTIVO'
      };

      list.unshift(newRecord);
      saveCronogramasEspecificos(list);

      closeAgregarModal();
      renderTable();
      showToast('Cronograma específico agregado exitosamente');
    });
  }

  // 5. Modal 2: Detalle Cronograma
  function openDetalleModal(id) {
    if (!modalDetalleBackdrop) return;
    const list = getCronogramasEspecificos();
    const item = list.find(x => x.id === id);
    if (!item) return;

    if (detalleEditId) detalleEditId.value = item.id;
    if (detalleInstitucion) detalleInstitucion.value = item.institucion || 'Universidad Privada Norbert Wiener S.A.';
    if (detallePeriodo) detallePeriodo.value = item.periodo;
    if (detalleMes) detalleMes.value = item.mes;
    if (detalleCarrera) detalleCarrera.value = item.carrera;
    if (detalleSeccion) detalleSeccion.value = item.seccion;
    if (detalleCurso) detalleCurso.value = item.curso;
    if (detalleTipoSesion) detalleTipoSesion.value = item.tipoSesion;
    if (detalleTipoEval) detalleTipoEval.value = item.tipoEval;
    if (detalleDocente) detalleDocente.value = item.docente;

    // Solo fechas son editables
    if (detalleFechaInicio) detalleFechaInicio.value = ddmmyyyyToYyyymmdd(item.fechaInicio);
    if (detalleFechaFin) detalleFechaFin.value = ddmmyyyyToYyyymmdd(item.fechaFin);

    modalDetalleBackdrop.classList.add('active');
  }

  function closeDetalleModal() {
    if (!modalDetalleBackdrop) return;
    modalDetalleBackdrop.classList.remove('active');
  }

  if (btnCloseModalDetalle) btnCloseModalDetalle.addEventListener('click', closeDetalleModal);
  if (btnCancelModalDetalle) btnCancelModalDetalle.addEventListener('click', closeDetalleModal);

  if (btnSaveDetalle) {
    btnSaveDetalle.addEventListener('click', () => {
      const id = parseInt(detalleEditId.value, 10);
      const inicioVal = detalleFechaInicio ? detalleFechaInicio.value : '';
      const finVal = detalleFechaFin ? detalleFechaFin.value : '';

      if (!inicioVal || !finVal) {
        alert('Por favor ingrese las fechas de inicio y fin.');
        return;
      }

      if (inicioVal > finVal) {
        alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
        return;
      }

      const list = getCronogramasEspecificos();
      const itemIndex = list.findIndex(x => x.id === id);
      if (itemIndex >= 0) {
        list[itemIndex].fechaInicio = yyyymmddToDdmmyyyy(inicioVal);
        list[itemIndex].fechaFin = yyyymmddToDdmmyyyy(finVal);

        saveCronogramasEspecificos(list);
        closeDetalleModal();
        renderTable();
        showToast('Fechas de cronograma específico actualizadas');
      }
    });
  }

  // Cerrar modales con clic en backdrop o Escape
  [modalAgregarBackdrop, modalDetalleBackdrop].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAgregarModal();
      closeDetalleModal();
    }
  });

  // 6. SISTEMA DE SELECTS PERSONALIZADOS CON CHEVRON ANIMADO Y MENÚ FLOTANTE
  function initCustomSelects() {
    const wrappers = document.querySelectorAll('.notes-select-wrapper');

    wrappers.forEach(wrapper => {
      const select = wrapper.querySelector('select');
      const icon = wrapper.querySelector('.notes-select-icon');
      if (!select) return;

      select.classList.add('custom-select-hidden');

      let trigger = wrapper.querySelector('.custom-select-trigger');
      let menu = wrapper.querySelector('.custom-select-menu');

      if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const valSpan = document.createElement('span');
        valSpan.className = 'custom-select-value';
        trigger.appendChild(valSpan);

        wrapper.insertBefore(trigger, icon);

        // Click en el trigger para alternar menú flotante y rotar flecha 180°
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = wrapper.classList.contains('is-open');
          closeAllCustomSelects();
          if (!isOpen) {
            positionSelectMenu(wrapper);
            wrapper.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            const parentRow = wrapper.closest('.modal-grid-3col, .modal-grid-2col, .form-field-item');
            if (parentRow) parentRow.style.zIndex = '1000';
          }
        });

        // Soporte de navegación por teclado
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            const isOpen = wrapper.classList.contains('is-open');
            if (!isOpen) {
              closeAllCustomSelects();
              positionSelectMenu(wrapper);
              wrapper.classList.add('is-open');
              trigger.setAttribute('aria-expanded', 'true');
              const parentRow = wrapper.closest('.modal-grid-3col, .modal-grid-2col, .form-field-item');
              if (parentRow) parentRow.style.zIndex = '1000';
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

  function positionSelectMenu(wrapper) {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const menu = wrapper.querySelector('.custom-select-menu');
    if (!trigger || !menu) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Si hay menos de 230px abajo y más espacio arriba, abrir hacia arriba (dropup flotante)
    if (spaceBelow < 230 && spaceAbove > spaceBelow) {
      wrapper.classList.add('is-dropup');
      menu.style.maxHeight = Math.min(260, Math.max(140, spaceAbove - 24)) + 'px';
    } else {
      wrapper.classList.remove('is-dropup');
      menu.style.maxHeight = Math.min(260, Math.max(140, spaceBelow - 24)) + 'px';
    }
  }

  function closeAllCustomSelects() {
    document.querySelectorAll('.notes-select-wrapper.is-open').forEach(w => {
      w.classList.remove('is-open');
      w.classList.remove('is-dropup');
      const trig = w.querySelector('.custom-select-trigger');
      if (trig) trig.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.modal-grid-3col, .modal-grid-2col, .form-field-item').forEach(el => {
      el.style.zIndex = '';
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

  // Inicialización inicial
  initCustomSelects();
  renderTable();
});
