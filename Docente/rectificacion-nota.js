/**
 * RECTIFICACIÓN DE NOTAS Y NOTA EXTEMPORÁNEA - LÓGICA JS
 * Perfil: Docente
 * Universidad Norbert Wiener - Sistema Institucional 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  
  const STORAGE_CRONOGRAMAS = 'wiener_cronogramas_data';
  const STORAGE_SOLICITUDES = 'wiener_solicitudes_data';

  // Base inicial de alumnos del curso
  const ALUMNOS_DATA = [
    { id: '2025104071', nombre: 'AMABLE CALAGUA, Gimena', notaActual: 14, retirado: false },
    { id: '2024101435', nombre: 'BAYLON SIFUENTES, Princesa', notaActual: 13, retirado: false },
    { id: '2024103352', nombre: 'BRITO TRUJILLO, Luz', notaActual: 13, retirado: false },
    { id: '2025104711', nombre: 'CALLUPE CASTILLO, Jorge', notaActual: 13, retirado: false },
    { id: '2023202592', nombre: 'CHICLLA QUISPE, Flor', notaActual: 14, retirado: false },
    { id: '2025100990', nombre: 'CUMBICUS ALZAMORA, Gabriela', notaActual: 13, retirado: false },
    { id: '2025103415', nombre: 'CUNIAS SANTAMARIA, Rocio', notaActual: 13, retirado: false },
    { id: '2025102137', nombre: 'FARFÁN BLAS, Estrella', notaActual: 13, retirado: false },
    { id: '2023201727', nombre: 'FERRER COBEÑAS, Naomi', notaActual: 13, retirado: false },
    { id: '2025105632', nombre: 'GONZALES PAUCAR, Ronald', notaActual: 12, retirado: false },
    { id: '2025100313', nombre: 'GONZALEZ DIAZ, Barbara', notaActual: 11, retirado: false },
    { id: '2025100292', nombre: 'MOLINA LONCHARICH, Leonardo', notaActual: 13, retirado: false },
    { id: '2023202350', nombre: 'MORALES SOLIS, Angeles', notaActual: 11, retirado: false },
    { id: '2025100685', nombre: 'PAZ QUISPE, Rafael', notaActual: 14, retirado: false },
    { id: '2024202114', nombre: 'PEREZ HUAMAN, Claudia', notaActual: 13, retirado: false },
    { id: '2025100290', nombre: 'PILCO ARIAS, Sebastian', notaActual: 14, retirado: false },
    { id: '2025103818', nombre: 'RENGIFO FASANANDO, Henri', notaActual: 13, retirado: false },
    { id: '2024101271', nombre: 'ROJAS DAVILA, Maritza', notaActual: 13, retirado: false },
    { id: '2025103139', nombre: 'VELA SANTOS, Mia', notaActual: 13, retirado: false },
    { id: '2025105640', nombre: 'VILLEGAS HUAMAN, Gabriel', notaActual: 12, retirado: false },
    { id: '2022100874', nombre: 'ZAVALA PÉREZ, Christian', notaActual: null, retirado: true }
  ];

  const INITIAL_SOLICITUDES = [
    {
      id: 1,
      tipoSolicitud: 'Extemporánea',
      ticket: '2026.3736',
      carrera: 'ODONTOLOGÍA',
      periodo: '2026-I',
      solicitante: 'OBREGON FIGUEROA ANA DORILA',
      seccion: 'OD3N3',
      curso: 'OD5033 - ESTRUCTURA Y FUNCIÓN DEL COMPLEJO OROFACIAL II',
      sesion: 'Teoría',
      tipoEval: 'Examen Sustitutorio (E3)',
      estado: 'Procesado',
      fechaSolicitud: '16/07/2026 10:06 AM',
      motivo: 'Omisión de registro de nota por cierre de periodo',
      detalleMotivo: 'El alumno no asistió al Examen Sustitutorio, estaba aprobado. Fue un error involuntario por la premura del tiempo de cierre del sistema.',
      alumnosAfectados: [
        { alumno: '2025101678 - GUZMAN PALOMINO, Wildo', notaActual: '-', notaNueva: 'NP' }
      ],
      eap: {
        director: 'DRA. VERGARA PINTO BRENDA ROXANA',
        fecha: '16/07/2026 12:05 PM',
        sustento: 'Solicitud revisada y procesada conforme a la directiva académica vigente.'
      }
    },
    {
      id: 2,
      tipoSolicitud: 'Rectificación',
      ticket: '2026.3826',
      carrera: 'ODONTOLOGÍA',
      periodo: '2026-I',
      solicitante: 'OBREGON FIGUEROA ANA DORILA',
      seccion: 'OD3N3',
      curso: 'OD5033 - ESTRUCTURA Y FUNCIÓN DEL COMPLEJO OROFACIAL II',
      sesion: 'Práctica 3',
      tipoEval: 'Eval. Permanente 1 (UD1)',
      estado: 'Solicitado',
      fechaSolicitud: '14/09/2026 01:28 PM',
      motivo: 'Evaluación omitida en cómputo final',
      detalleMotivo: 'Se adjunta revisión de rúbrica calificada omitida en el cómputo final de la práctica clínica.',
      alumnosAfectados: [
        { alumno: '2025104071 - AMABLE CALAGUA, Gimena', notaActual: 14, notaNueva: 18 },
        { alumno: '2025102524 - GRANADOS ZULOETA, Ricardo', notaActual: 13, notaNueva: 16 }
      ],
      eap: null
    }
  ];

  function getSolicitudes() {
    const data = localStorage.getItem(STORAGE_SOLICITUDES);
    if (!data) {
      localStorage.setItem(STORAGE_SOLICITUDES, JSON.stringify(INITIAL_SOLICITUDES));
      return INITIAL_SOLICITUDES;
    }
    try {
      const parsed = JSON.parse(data);
      // Normalizar nombres de tipos si venían de versiones anteriores
      return parsed.map(s => {
        if (s.tipoSolicitud === 'Nota Extemporanea') s.tipoSolicitud = 'Extemporánea';
        if (s.tipoSolicitud === 'Rectificacion de Nota') s.tipoSolicitud = 'Rectificación';
        return s;
      });
    } catch (e) {
      return INITIAL_SOLICITUDES;
    }
  }

  function saveSolicitudes(list) {
    localStorage.setItem(STORAGE_SOLICITUDES, JSON.stringify(list));
  }

  function getCronogramas() {
    const data = localStorage.getItem(STORAGE_CRONOGRAMAS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  // Elementos DOM Principales
  const tableBody = document.getElementById('solicitudesTableBody');
  const tableRowsCount = document.getElementById('tableRowsCount');
  const countProcesados = document.getElementById('countProcesados');
  const countSolicitados = document.getElementById('countSolicitados');
  const pagCurrent = document.getElementById('pagCurrent');
  const pagTotal = document.getElementById('pagTotal');

  // Filtros
  const filterPeriodo = document.getElementById('filterPeriodo');
  const filterCarrera = document.getElementById('filterCarrera');
  const filterTipoSolicitud = document.getElementById('filterTipoSolicitud');
  const filterEstado = document.getElementById('filterEstado');
  const btnClearFilters = document.getElementById('btnClearFilters');

  // Botones de Apertura de Modales
  const btnOpenModalRectificacion = document.getElementById('btnOpenModalRectificacion');
  const btnOpenModalExtemporanea = document.getElementById('btnOpenModalExtemporanea');

  // Modal 1: Rectificación
  const modalRectBackdrop = document.getElementById('modalRectificacionBackdrop');
  const btnCloseModalRect = document.getElementById('btnCloseModalRect');
  const btnCancelModalRect = document.getElementById('btnCancelModalRect');
  const btnSubmitRectificacion = document.getElementById('btnSubmitRectificacion');
  const modalRectCurso = document.getElementById('modalRectCurso');
  const modalRectSeccion = document.getElementById('modalRectSeccion');
  const modalRectTipoEval = document.getElementById('modalRectTipoEval');
  const chkSelectAllRect = document.getElementById('chkSelectAllRect');
  const modalRectAlumnosList = document.getElementById('modalRectAlumnosList');
  const rectSelectedCountText = document.getElementById('rectSelectedCountText');
  const modalRectMotivoSelect = document.getElementById('modalRectMotivoSelect');
  const modalRectDetalleMotivo = document.getElementById('modalRectDetalleMotivo');

  // Modal 2: Extemporánea
  const modalExtBackdrop = document.getElementById('modalExtemporaneaBackdrop');
  const btnCloseModalExt = document.getElementById('btnCloseModalExt');
  const btnCancelModalExt = document.getElementById('btnCancelModalExt');
  const btnSubmitExtemporanea = document.getElementById('btnSubmitExtemporanea');
  const modalExtCurso = document.getElementById('modalExtCurso');
  const modalExtSeccion = document.getElementById('modalExtSeccion');
  const modalExtTipoEval = document.getElementById('modalExtTipoEval');
  const modalExtAlumnosList = document.getElementById('modalExtAlumnosList');
  const modalExtMotivoSelect = document.getElementById('modalExtMotivoSelect');
  const modalExtDetalleMotivo = document.getElementById('modalExtDetalleMotivo');

  // Modal 3: Resumen
  const modalResumenBackdrop = document.getElementById('modalResumenBackdrop');
  const btnCloseModalResumen = document.getElementById('btnCloseModalResumen');
  const btnCerrarModalResumen = document.getElementById('btnCerrarModalResumen');
  const modalResumenTitle = document.getElementById('modalResumenTitle');
  const resumenTicketBadge = document.getElementById('resumenTicketBadge');
  const resumenCursoSeccion = document.getElementById('resumenCursoSeccion');
  const resumenTipoEval = document.getElementById('resumenTipoEval');
  const resumenFechaSolicitud = document.getElementById('resumenFechaSolicitud');
  const resumenEstadoVal = document.getElementById('resumenEstadoVal');
  const thResumenNotaActual = document.getElementById('thResumenNotaActual');
  const thResumenNotaNueva = document.getElementById('thResumenNotaNueva');
  const resumenStudentsTableBody = document.getElementById('resumenStudentsTableBody');
  const resumenDocenteMotivoText = document.getElementById('resumenDocenteMotivoText');
  const resumenEapBox = document.getElementById('resumenEapBox');
  const resumenEapDirectorFecha = document.getElementById('resumenEapDirectorFecha');
  const resumenEapText = document.getElementById('resumenEapText');

  // Modal 4: Confirmación
  const modalConfirmDocenteBackdrop = document.getElementById('modalConfirmDocenteBackdrop');
  const btnConfirmDocenteAceptar = document.getElementById('btnConfirmDocenteAceptar');
  const btnConfirmDocenteCancelar = document.getElementById('btnConfirmDocenteCancelar');
  let pendingSubmission = null;

  // Toast
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  const SEARCH_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`;

  // Poblar Tipos de Evaluación Activos en Rectificación
  function updateEvaluacionesActivas() {
    const cronos = getCronogramas();
    const activas = cronos.filter(c => c.estado === 'ACTIVO');

    if (modalRectTipoEval) {
      modalRectTipoEval.innerHTML = '';
      if (activas.length === 0) {
        const opt = document.createElement('option');
        opt.value = 'Eval. Permanente 1 (UD1)';
        opt.textContent = 'Eval. Permanente 1 (UD1) • ACTIVO';
        modalRectTipoEval.appendChild(opt);
      } else {
        activas.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.tipoEval;
          opt.textContent = `${c.tipoEval} (${c.tipoCurso}) • ACTIVO`;
          modalRectTipoEval.appendChild(opt);
        });
      }
    }
  }

  // Renderizar Tabla de Solicitudes
  function renderSolicitudesTable() {
    const list = getSolicitudes();
    const fPeriodo = filterPeriodo ? filterPeriodo.value : 'todos';
    const fCarrera = filterCarrera ? filterCarrera.value : 'todos';
    const fTipo = filterTipoSolicitud ? filterTipoSolicitud.value : 'todos';
    const fEstado = filterEstado ? filterEstado.value : 'todos';

    const filtered = list.filter(item => {
      const matchPeriodo = fPeriodo === 'todos' || item.periodo.toLowerCase().includes(fPeriodo.toLowerCase().replace(/\s+/g, ''));
      const matchCarrera = fCarrera === 'todos' || item.carrera.toLowerCase().includes(fCarrera.toLowerCase());
      const matchTipo = fTipo === 'todos' || item.tipoSolicitud.toLowerCase() === fTipo.toLowerCase();
      const matchEstado = fEstado === 'todos' || item.estado.toLowerCase() === fEstado.toLowerCase();
      return matchPeriodo && matchCarrera && matchTipo && matchEstado;
    });

    // Actualizar contadores
    const numProcesados = list.filter(s => s.estado === 'Procesado').length;
    const numSolicitados = list.filter(s => s.estado === 'Solicitado').length;
    if (countProcesados) countProcesados.textContent = `${numProcesados} Procesada${numProcesados !== 1 ? 's' : ''}`;
    if (countSolicitados) countSolicitados.textContent = `${numSolicitados} Solicitada${numSolicitados !== 1 ? 's' : ''}`;

    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 36px; color: #64748B;">
            No se encontraron solicitudes registradas con los filtros seleccionados.
          </td>
        </tr>
      `;
      if (tableRowsCount) tableRowsCount.innerHTML = `Mostrando <strong>0</strong> solicitudes registradas`;
      if (pagCurrent) pagCurrent.textContent = '0';
      if (pagTotal) pagTotal.textContent = '0';
      return;
    }

    filtered.forEach((item, index) => {
      const row = document.createElement('tr');

      let badgeClass = 'badge-solicitado';
      if (item.estado === 'Procesado') badgeClass = 'badge-procesado';
      if (item.estado === 'Rechazado') badgeClass = 'badge-rechazado';

      // Una sola palabra limpia
      const tipoLabel = item.tipoSolicitud === 'Rectificación' || item.tipoSolicitud === 'Rectificacion de Nota'
        ? 'Rectificación'
        : 'Extemporánea';

      row.innerHTML = `
        <td class="col-td-num">${index + 1}</td>
        <td class="col-td-tipo"><strong>${tipoLabel}</strong></td>
        <td class="col-td-ticket">${item.ticket}</td>
        <td class="col-td-carrera">${item.carrera}</td>
        <td class="col-td-periodo">${item.periodo}</td>
        <td class="col-td-solicitante">${item.solicitante}</td>
        <td class="col-td-seccion">${item.seccion}</td>
        <td class="col-td-curso" title="${item.curso}">${item.curso}</td>
        <td class="col-td-sesion">${item.sesion}</td>
        <td class="col-td-eval">${item.tipoEval}</td>
        <td class="col-td-estado">
          <span class="badge-status-pill ${badgeClass}">${item.estado}</span>
        </td>
        <td class="col-td-acciones">
          <button type="button" class="btn-row-action" data-ticket="${item.ticket}" title="Ver resumen de la solicitud">
            ${SEARCH_SVG}
          </button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    if (tableRowsCount) tableRowsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> solicitud${filtered.length !== 1 ? 'es' : ''} registrada${filtered.length !== 1 ? 's' : ''}`;
    if (pagCurrent) pagCurrent.textContent = String(filtered.length);
    if (pagTotal) pagTotal.textContent = String(filtered.length);

    // Eventos Click en Botón Acción Fila
    tableBody.querySelectorAll('.btn-row-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = btn.getAttribute('data-ticket');
        openResumenModal(ticket);
      });
    });
  }

  // Renderizar Lista de Alumnos en Modal Rectificación
  function renderModalRectAlumnos() {
    if (!modalRectAlumnosList) return;
    modalRectAlumnosList.innerHTML = '';
    if (chkSelectAllRect) chkSelectAllRect.checked = false;
    updateRectCounter();

    ALUMNOS_DATA.forEach((alumno, index) => {
      const tr = document.createElement('tr');
      if (alumno.retirado) tr.className = 'row-alumno-retirado';

      const disabledAttr = alumno.retirado ? 'disabled' : '';

      tr.innerHTML = `
        <td style="text-align: center;">
          <input type="checkbox" class="modal-alumno-checkbox" data-index="${index}" ${disabledAttr} style="width: 17px; height: 17px; accent-color: #0F848F; cursor: pointer;">
        </td>
        <td style="text-align: center;">${index + 1}</td>
        <td><strong>${alumno.id}</strong></td>
        <td>${alumno.nombre} ${alumno.retirado ? '<span class="tag-retirado">Retirado</span>' : ''}</td>
        <td style="text-align: center; font-weight: 700;">${alumno.notaActual !== null ? alumno.notaActual : '-'}</td>
        <td style="text-align: center;">
          <input type="number" min="0" max="20" class="input-calificacion-control input-rect-nota" data-index="${index}" placeholder="--" disabled>
        </td>
      `;

      modalRectAlumnosList.appendChild(tr);
    });

    // Check individual events
    const checkboxes = modalRectAlumnosList.querySelectorAll('.modal-alumno-checkbox');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = e.target.getAttribute('data-index');
        const inputNota = modalRectAlumnosList.querySelector(`.input-rect-nota[data-index="${idx}"]`);
        if (inputNota) {
          inputNota.disabled = !e.target.checked;
          if (e.target.checked) {
            inputNota.focus();
          } else {
            inputNota.value = '';
          }
        }
        updateRectCounter();
      });
    });
  }

  function updateRectCounter() {
    if (!rectSelectedCountText || !modalRectAlumnosList) return;
    const selected = modalRectAlumnosList.querySelectorAll('.modal-alumno-checkbox:checked').length;
    rectSelectedCountText.textContent = `${selected} alumno${selected !== 1 ? 's' : ''} seleccionado${selected !== 1 ? 's' : ''}`;
  }

  // Check all Rectificación
  if (chkSelectAllRect) {
    chkSelectAllRect.addEventListener('change', (e) => {
      if (!modalRectAlumnosList) return;
      const checkboxes = modalRectAlumnosList.querySelectorAll('.modal-alumno-checkbox:not([disabled])');
      checkboxes.forEach(chk => {
        chk.checked = e.target.checked;
        const idx = chk.getAttribute('data-index');
        const inputNota = modalRectAlumnosList.querySelector(`.input-rect-nota[data-index="${idx}"]`);
        if (inputNota) {
          inputNota.disabled = !e.target.checked;
          if (!e.target.checked) inputNota.value = '';
        }
      });
      updateRectCounter();
    });
  }

  // Renderizar Lista de Alumnos en Modal Extemporánea
  function renderModalExtAlumnos() {
    if (!modalExtAlumnosList) return;
    modalExtAlumnosList.innerHTML = '';
    ALUMNOS_DATA.forEach((alumno, index) => {
      const tr = document.createElement('tr');
      if (alumno.retirado) tr.className = 'row-alumno-retirado';

      const disabledAttr = alumno.retirado ? 'disabled' : '';

      tr.innerHTML = `
        <td style="text-align: center;">${index + 1}</td>
        <td><strong>${alumno.id}</strong></td>
        <td>${alumno.nombre} ${alumno.retirado ? '<span class="tag-retirado">Retirado</span>' : ''}</td>
        <td style="text-align: center; color: #64748B;">${alumno.retirado ? 'Retirado' : 'Sin calificar'}</td>
        <td style="text-align: center;">
          <input type="text" class="input-calificacion-control input-ext-nota" data-index="${index}" placeholder="--" maxlength="2" ${disabledAttr}>
        </td>
      `;

      modalExtAlumnosList.appendChild(tr);
    });
  }

  // Modal Resumen
  function openResumenModal(ticket) {
    const list = getSolicitudes();
    const item = list.find(s => s.ticket === ticket);
    if (!item || !modalResumenBackdrop) return;

    const isRect = item.tipoSolicitud === 'Rectificación' || item.tipoSolicitud === 'Rectificacion de Nota';

    if (modalResumenTitle) {
      modalResumenTitle.textContent = isRect
        ? 'Detalle de Solicitud de Rectificación'
        : 'Detalle de Solicitud de Nota Extemporánea';
    }

    if (resumenTicketBadge) resumenTicketBadge.textContent = `Ticket: ${item.ticket}`;
    if (resumenCursoSeccion) resumenCursoSeccion.textContent = `${item.curso} • ${item.seccion}`;
    if (resumenTipoEval) resumenTipoEval.textContent = `${item.tipoEval} (${item.sesion})`;
    if (resumenFechaSolicitud) resumenFechaSolicitud.textContent = item.fechaSolicitud || '14/09/2026 01:28 PM';

    if (resumenEstadoVal) {
      let badgeClass = 'badge-solicitado';
      if (item.estado === 'Procesado') badgeClass = 'badge-procesado';
      if (item.estado === 'Rechazado') badgeClass = 'badge-rechazado';
      resumenEstadoVal.innerHTML = `<span class="badge-status-pill ${badgeClass}">${item.estado}</span>`;
    }

    if (thResumenNotaActual) {
      thResumenNotaActual.style.display = isRect ? 'table-cell' : 'none';
    }
    if (thResumenNotaNueva) {
      thResumenNotaNueva.textContent = isRect ? 'Nota Solicitada' : 'Calificación Registrada';
    }

    if (resumenStudentsTableBody) {
      resumenStudentsTableBody.innerHTML = '';
      if (item.alumnosAfectados && item.alumnosAfectados.length > 0) {
        item.alumnosAfectados.forEach((al, idx) => {
          const tr = document.createElement('tr');
          const tdActual = isRect ? `<td style="text-align: center; font-weight: 700;">${al.notaActual}</td>` : '';
          tr.innerHTML = `
            <td style="text-align: center;">${idx + 1}</td>
            <td><strong>${al.alumno}</strong></td>
            ${tdActual}
            <td style="text-align: center; font-weight: 700; color: #0F848F;">${al.notaNueva}</td>
          `;
          resumenStudentsTableBody.appendChild(tr);
        });
      } else {
        resumenStudentsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 12px; color: #64748B;">No hay alumnos registrados.</td></tr>`;
      }
    }

    if (resumenDocenteMotivoText) {
      resumenDocenteMotivoText.innerHTML = `<strong>${item.motivo || 'Motivo no especificado'}:</strong> ${item.detalleMotivo || ''}`;
    }

    if (resumenEapBox) {
      if (item.eap && (item.estado === 'Procesado' || item.estado === 'Rechazado')) {
        resumenEapBox.style.display = 'block';
        if (resumenEapDirectorFecha) {
          resumenEapDirectorFecha.textContent = `Evaluado por: ${item.eap.director || 'Dirección de Escuela'} • ${item.eap.fecha || ''}`;
        }
        if (resumenEapText) {
          resumenEapText.textContent = item.eap.sustento || 'Dictamen emitido.';
        }
      } else {
        resumenEapBox.style.display = 'none';
      }
    }

    modalResumenBackdrop.classList.add('active');
  }

  // Guardado y Confirmación Docente
  function triggerConfirmModal(submissionType, data) {
    pendingSubmission = { type: submissionType, data: data };
    if (modalConfirmDocenteBackdrop) {
      modalConfirmDocenteBackdrop.classList.add('active');
    }
  }

  if (btnConfirmDocenteAceptar) {
    btnConfirmDocenteAceptar.addEventListener('click', () => {
      if (modalConfirmDocenteBackdrop) {
        modalConfirmDocenteBackdrop.classList.remove('active');
      }
      if (!pendingSubmission) return;

      const list = getSolicitudes();
      const newId = list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1;
      const ticketNum = `2026.${3800 + newId}`;

      const newSolicitud = {
        id: newId,
        tipoSolicitud: pendingSubmission.data.tipoSolicitud,
        ticket: ticketNum,
        carrera: pendingSubmission.data.carrera,
        periodo: pendingSubmission.data.periodo,
        solicitante: 'OBREGON FIGUEROA ANA DORILA',
        seccion: pendingSubmission.data.seccion,
        curso: pendingSubmission.data.curso,
        sesion: pendingSubmission.data.sesion,
        tipoEval: pendingSubmission.data.tipoEval,
        estado: 'Solicitado',
        fechaSolicitud: getCurrentFormattedDateTime(),
        motivo: pendingSubmission.data.motivo,
        detalleMotivo: pendingSubmission.data.detalleMotivo,
        alumnosAfectados: pendingSubmission.data.alumnosAfectados,
        eap: null
      };

      list.unshift(newSolicitud);
      saveSolicitudes(list);

      if (pendingSubmission.type === 'rectificacion' && modalRectBackdrop) {
        modalRectBackdrop.classList.remove('active');
      } else if (modalExtBackdrop) {
        modalExtBackdrop.classList.remove('active');
      }

      renderSolicitudesTable();
      showToast('Solicitud enviada con éxito');

      setTimeout(() => {
        openResumenModal(ticketNum);
      }, 350);

      pendingSubmission = null;
    });
  }

  if (btnConfirmDocenteCancelar) {
    btnConfirmDocenteCancelar.addEventListener('click', () => {
      if (modalConfirmDocenteBackdrop) {
        modalConfirmDocenteBackdrop.classList.remove('active');
      }
      pendingSubmission = null;
    });
  }

  // Envío Formulario Rectificación
  if (btnSubmitRectificacion) {
    btnSubmitRectificacion.addEventListener('click', () => {
      const checkboxes = modalRectAlumnosList ? modalRectAlumnosList.querySelectorAll('.modal-alumno-checkbox:checked') : [];
      if (checkboxes.length === 0) {
        alert('Por favor seleccione al menos un alumno e ingrese su nueva calificación.');
        return;
      }

      const alumnosAfectados = [];
      let hasInvalidNota = false;

      checkboxes.forEach(chk => {
        const idx = chk.getAttribute('data-index');
        const inputNota = modalRectAlumnosList.querySelector(`.input-rect-nota[data-index="${idx}"]`);
        const valNota = inputNota ? inputNota.value.trim() : '';

        if (valNota === '' || isNaN(valNota) || parseInt(valNota) < 0 || parseInt(valNota) > 20) {
          hasInvalidNota = true;
        } else {
          const alData = ALUMNOS_DATA[idx];
          alumnosAfectados.push({
            alumno: `${alData.id} - ${alData.nombre}`,
            notaActual: alData.notaActual !== null ? alData.notaActual : '-',
            notaNueva: parseInt(valNota, 10)
          });
        }
      });

      if (hasInvalidNota) {
        alert('Por favor ingrese notas válidas entre 00 y 20 para todos los alumnos seleccionados.');
        return;
      }

      const detalle = modalRectDetalleMotivo ? modalRectDetalleMotivo.value.trim() : '';
      if (detalle === '') {
        alert('Por favor ingrese el detalle / justificación del motivo para Dirección de Escuela.');
        if (modalRectDetalleMotivo) modalRectDetalleMotivo.focus();
        return;
      }

      const seccionVal = modalRectSeccion ? modalRectSeccion.value : 'OD3N3 • Práctica - 3';
      const partesSeccion = seccionVal.split(' - ');
      const seccionCodigo = partesSeccion[0] || 'OD3N3';
      const sesionNombre = partesSeccion[1] || 'Práctica 3';

      const data = {
        tipoSolicitud: 'Rectificación',
        periodo: '2026-I',
        carrera: 'ODONTOLOGÍA',
        seccion: seccionCodigo,
        curso: modalRectCurso ? modalRectCurso.value : 'OD5033 - ESTRUCTURA Y FUNCIÓN DEL COMPLEJO OROFACIAL II',
        sesion: sesionNombre,
        tipoEval: modalRectTipoEval ? modalRectTipoEval.value : 'Eval. Permanente 1 (UD1)',
        motivo: modalRectMotivoSelect ? modalRectMotivoSelect.value : 'Error de digitación en la transcripción de notas',
        detalleMotivo: detalle,
        alumnosAfectados: alumnosAfectados
      };

      triggerConfirmModal('rectificacion', data);
    });
  }

  // Envío Formulario Extemporánea
  if (btnSubmitExtemporanea) {
    btnSubmitExtemporanea.addEventListener('click', () => {
      const inputs = modalExtAlumnosList ? modalExtAlumnosList.querySelectorAll('.input-ext-nota:not([disabled])') : [];
      const alumnosAfectados = [];
      let hasAnyGrade = false;

      inputs.forEach(input => {
        const val = input.value.trim().toUpperCase();
        const idx = input.getAttribute('data-index');
        const alData = ALUMNOS_DATA[idx];

        if (val !== '') {
          hasAnyGrade = true;
          alumnosAfectados.push({
            alumno: `${alData.id} - ${alData.nombre}`,
            notaActual: '-',
            notaNueva: val
          });
        }
      });

      if (!hasAnyGrade || alumnosAfectados.length === 0) {
        alert('Por favor ingrese al menos una calificación (número 00-20 o NP) en el listado.');
        return;
      }

      const detalle = modalExtDetalleMotivo ? modalExtDetalleMotivo.value.trim() : '';
      if (detalle === '') {
        alert('Por favor ingrese el detalle / justificación de la nota extemporánea.');
        if (modalExtDetalleMotivo) modalExtDetalleMotivo.focus();
        return;
      }

      const seccionVal = modalExtSeccion ? modalExtSeccion.value : 'OD3N3 • Teoría';
      const partesSeccion = seccionVal.split(' - ');
      const seccionCodigo = partesSeccion[0] || 'OD3N3';
      const sesionNombre = partesSeccion[1] || 'Teoría';

      const data = {
        tipoSolicitud: 'Extemporánea',
        periodo: '2026-I',
        carrera: 'ODONTOLOGÍA',
        seccion: seccionCodigo,
        curso: modalExtCurso ? modalExtCurso.value : 'OD5033 - ESTRUCTURA Y FUNCIÓN DEL COMPLEJO OROFACIAL II',
        sesion: sesionNombre,
        tipoEval: modalExtTipoEval ? modalExtTipoEval.value : 'Examen Sustitutorio (E3)',
        motivo: modalExtMotivoSelect ? modalExtMotivoSelect.value : 'Omisión de registro de nota por cierre de periodo',
        detalleMotivo: detalle,
        alumnosAfectados: alumnosAfectados
      };

      triggerConfirmModal('extemporanea', data);
    });
  }

  // Toast Feedback
  let toastTimer = null;
  function showToast(msg) {
    if (!toastMessage || !toastText) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = msg;
    toastMessage.classList.add('show');
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3500);
  }

  function getCurrentFormattedDateTime() {
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const anio = now.getFullYear();
    let horas = now.getHours();
    const minutos = String(now.getMinutes()).padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;
    const horasStr = String(horas).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horasStr}:${minutos} ${ampm}`;
  }

  // Apertura y Cierre de Modales
  if (btnOpenModalRectificacion) {
    btnOpenModalRectificacion.addEventListener('click', () => {
      updateEvaluacionesActivas();
      renderModalRectAlumnos();
      if (modalRectDetalleMotivo) modalRectDetalleMotivo.value = '';
      if (modalRectBackdrop) modalRectBackdrop.classList.add('active');
    });
  }

  if (btnOpenModalExtemporanea) {
    btnOpenModalExtemporanea.addEventListener('click', () => {
      renderModalExtAlumnos();
      if (modalExtDetalleMotivo) modalExtDetalleMotivo.value = '';
      if (modalExtBackdrop) modalExtBackdrop.classList.add('active');
    });
  }

  if (btnCloseModalRect) btnCloseModalRect.addEventListener('click', () => modalRectBackdrop.classList.remove('active'));
  if (btnCancelModalRect) btnCancelModalRect.addEventListener('click', () => modalRectBackdrop.classList.remove('active'));

  if (btnCloseModalExt) btnCloseModalExt.addEventListener('click', () => modalExtBackdrop.classList.remove('active'));
  if (btnCancelModalExt) btnCancelModalExt.addEventListener('click', () => modalExtBackdrop.classList.remove('active'));

  if (btnCloseModalResumen) btnCloseModalResumen.addEventListener('click', () => modalResumenBackdrop.classList.remove('active'));
  if (btnCerrarModalResumen) btnCerrarModalResumen.addEventListener('click', () => modalResumenBackdrop.classList.remove('active'));

  // Cerrar al hacer clic en el backdrop exterior
  [modalRectBackdrop, modalExtBackdrop, modalResumenBackdrop, modalConfirmDocenteBackdrop].forEach(backdrop => {
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
        }
      });
    }
  });

  // Filtros interactivos
  if (filterPeriodo) filterPeriodo.addEventListener('change', renderSolicitudesTable);
  if (filterCarrera) filterCarrera.addEventListener('change', renderSolicitudesTable);
  if (filterTipoSolicitud) filterTipoSolicitud.addEventListener('change', renderSolicitudesTable);
  if (filterEstado) filterEstado.addEventListener('change', renderSolicitudesTable);

  if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
      if (filterPeriodo) filterPeriodo.value = 'todos';
      if (filterCarrera) filterCarrera.value = 'todos';
      if (filterTipoSolicitud) filterTipoSolicitud.value = 'todos';
      if (filterEstado) filterEstado.value = 'todos';
      renderSolicitudesTable();
      showToast('Filtros restablecidos');
    });
  }

  // Inicializar
  renderSolicitudesTable();
});
