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
    [3, 4, 6].forEach(id => {
      const it = list.find(x => x.id === id);
      if (it) it.estado = 'ACTIVO';
    });
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
    if (!docenteSearchBox || !addPersonal) return;
    if (addPersonal.checked) {
      docenteSearchBox.style.display = 'block';
      if (currentSelectedDocente) {
        if (docenteSelectedName) docenteSelectedName.textContent = currentSelectedDocente;
        if (docenteSelectedPreview) docenteSelectedPreview.style.display = 'flex';
      } else {
        if (docenteSelectedPreview) docenteSelectedPreview.style.display = 'none';
      }
    } else {
      docenteSearchBox.style.display = 'none';
      if (searchDocenteCompleto) searchDocenteCompleto.value = '';
      currentSelectedDocente = '';
      if (docenteSelectedPreview) docenteSelectedPreview.style.display = 'none';
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

  const searchDocenteCompleto = document.getElementById('searchDocenteCompleto');
  const btnBuscarDocente = document.getElementById('btnBuscarDocente');
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
    if (addFechaInicio) addFechaInicio.value = '12/09/2026';
    if (addFechaFin) addFechaFin.value = '12/09/2026';
    initDatePicker('dateContainerAddInicio', 'addFechaInicio', '12/09/2026');
    initDatePicker('dateContainerAddFin', 'addFechaFin', '12/09/2026');

    if (searchDocenteCompleto) searchDocenteCompleto.value = '';
    currentSelectedDocente = '';
    if (docenteSelectedName) docenteSelectedName.textContent = '';
    if (docenteSelectedPreview) docenteSelectedPreview.style.display = 'none';

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
      const nombre = searchDocenteCompleto ? searchDocenteCompleto.value.trim().toUpperCase() : '';
      if (!nombre) {
        showToast('Ingrese nombres y apellidos completos para buscar');
        if (searchDocenteCompleto) searchDocenteCompleto.focus();
        return;
      }
      currentSelectedDocente = nombre;
      if (docenteSelectedName) docenteSelectedName.textContent = currentSelectedDocente;
      if (docenteSelectedPreview) docenteSelectedPreview.style.display = 'flex';
      showToast('Docente asignado: ' + currentSelectedDocente);
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
    if (detalleFechaInicio) detalleFechaInicio.value = item.fechaInicio;
    if (detalleFechaFin) detalleFechaFin.value = item.fechaFin;
    initDatePicker('dateContainerDetalleInicio', 'detalleFechaInicio', item.fechaInicio);
    initDatePicker('dateContainerDetalleFin', 'detalleFechaFin', item.fechaFin);

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
              closeAllCustomSelects();
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

    let parts = (defaultDateStr || input.value || '12/09/2026').split('/');
    let curDay = parseInt(parts[0], 10) || 12;
    let curMonth = (parseInt(parts[1], 10) || 9) - 1;
    let curYear = parseInt(parts[2], 10) || 2026;

    let viewMonth = curMonth;
    let viewYear = curYear;

    container._setDate = function(dateStr) {
      if (!dateStr) return;
      const p = dateStr.split('/');
      curDay = parseInt(p[0], 10) || 12;
      curMonth = (parseInt(p[1], 10) || 9) - 1;
      curYear = parseInt(p[2], 10) || 2026;
      viewMonth = curMonth;
      viewYear = curYear;
    };

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
  // 5. Inicialización de la vista
  renderTable();
  initCustomSelects();
  initDatePicker('dateContainerAddInicio', 'addFechaInicio', '12/09/2026');
  initDatePicker('dateContainerAddFin', 'addFechaFin', '12/09/2026');
  initDatePicker('dateContainerDetalleInicio', 'detalleFechaInicio', '12/09/2026');
  initDatePicker('dateContainerDetalleFin', 'detalleFechaFin', '12/09/2026');
});
