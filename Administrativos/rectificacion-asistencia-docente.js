/**
 * ============================================================================
 * REGULARIZACIÓN DE ASISTENCIA DOCENTE - PERFIL ADMINISTRATIVO (RRAA)
 * Portal Administrativo - Universidad Norbert Wiener
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // Clave de almacenamiento en LocalStorage
  const STORAGE_KEY_ASISTENCIA_SOLICITUDES = 'wiener_rraa_asistencia_solicitudes_v1';
  const STORAGE_KEY_CRONOGRAMAS = 'wiener_rraa_cronogramas_corte_v1';

  // ==========================================================================
  // DATOS INICIALES (Fieles a la Imagen 1 del requerimiento)
  // ==========================================================================
  const INITIAL_SOLICITUDES = [
    {
      ticket: '1',
      fecha: '2025/10/02 - Jue.',
      area: 'NUTRICION. Y DIET.',
      curso: 'Prácticas En Nutrición I - ND4012',
      periodo: '2025-II',
      seccion: 'ND1M1',
      sesion: 'Prac. - A1',
      horarioInicio: '12:15',
      horarioFin: '13:45',
      registroInicio: '12:14',
      registroFin: '00:00',
      tardanza: '',
      estado: 'Observado',
      condicion: 'Solicitado',
      sustento: 'Certificado_Descanso_Medico_ND1M1.pdf',
      tipoSustento: 'Descanso Médico',
      fechaSolicitud: '10/11/2025',
      observacion: '-',
      docente: 'Lic. Obregon Figueroa Ana Dorila',
      docenteCodigo: 'DOC-45871',
      decisionTimestamp: null,
      aprobador: null
    },
    {
      ticket: '2',
      fecha: '2025/10/02 - Jue.',
      area: 'NUTRICION. Y DIET.',
      curso: 'Prácticas En Nutrición I - ND4012',
      periodo: '2025-II',
      seccion: 'ND1M3',
      sesion: 'Prac. - C1',
      horarioInicio: '13:45',
      horarioFin: '15:15',
      registroInicio: '00:00',
      registroFin: '00:00',
      tardanza: '',
      estado: 'Inasistencia',
      condicion: 'Solicitado',
      sustento: 'Justificacion_Comision_Servicios.pdf',
      tipoSustento: 'Motivo Académico',
      fechaSolicitud: '11/11/2025',
      observacion: '-',
      docente: 'Lic. Obregon Figueroa Ana Dorila',
      docenteCodigo: 'DOC-45871',
      decisionTimestamp: null,
      aprobador: null
    },
    {
      ticket: '3',
      fecha: '2025/10/02 - Jue.',
      area: 'NUTRICION. Y DIET.',
      curso: 'Nutrición Y Dietoterapia Del Niño Y Del Adolescente - ND4054',
      periodo: '2025-II',
      seccion: 'ND5N2',
      sesion: 'Prac. - 21',
      horarioInicio: '19:45',
      horarioFin: '22:45',
      registroInicio: '19:50',
      registroFin: '22:45',
      tardanza: '10',
      estado: 'Tardanza',
      condicion: 'Solicitado',
      sustento: 'Sustento_Tardanza_Clinica.pdf',
      tipoSustento: 'Motivo Académico',
      fechaSolicitud: '11/11/2025',
      observacion: '-',
      docente: 'Mg. Carlos Jesús Silva Sánchez',
      docenteCodigo: 'DOC-38290',
      decisionTimestamp: null,
      aprobador: null
    },
    {
      ticket: '4',
      fecha: '2025/09/25 - Jue.',
      area: 'ODONTOLOGÍA',
      curso: 'Estructura Y Función Del Complejo Orofacial II - OD5033',
      periodo: '2025-II',
      seccion: 'OD3N3',
      sesion: 'Teoría',
      horarioInicio: '08:00',
      horarioFin: '11:00',
      registroInicio: '07:58',
      registroFin: '11:02',
      tardanza: '',
      estado: 'Observado',
      condicion: 'Aprobado',
      sustento: 'Sustento_Marcacion_OD5033.pdf',
      tipoSustento: 'Motivo Académico',
      fechaSolicitud: '05/10/2025',
      observacion: 'Regularización procedente según reporte biométrico',
      docente: 'Dr. Rafael Paz Quispe',
      docenteCodigo: 'DOC-12094',
      decisionTimestamp: null,
      aprobador: 'RRAA - Lic. Carlos Silva'
    }
  ];

  // Datos iniciales de Cronogramas de Corte de Planilla
  const INITIAL_CRONOGRAMAS = [
    {
      id: 1,
      anio: '2025',
      mes: 'Setiembre',
      corteInicio: '12/08/2025',
      corteFin: '11/09/2025',
      fechaLimite: '15/09/2025',
      fechaBloqueo: '16/09/2025',
      estado: 'Cerrado'
    },
    {
      id: 2,
      anio: '2025',
      mes: 'Octubre',
      corteInicio: '12/09/2025',
      corteFin: '11/10/2025',
      fechaLimite: '15/10/2025',
      fechaBloqueo: '16/10/2025',
      estado: 'Vigente'
    },
    {
      id: 3,
      anio: '2025',
      mes: 'Noviembre',
      corteInicio: '12/10/2025',
      corteFin: '11/11/2025',
      fechaLimite: '15/11/2025',
      fechaBloqueo: '16/11/2025',
      estado: 'Programado'
    }
  ];

  // Datos iniciales para la Planilla Manual (20 columnas exactas de Imagen 2)
  const INITIAL_PLANILLA_MANUAL = [
    {
      num: 1,
      departamento: 'Lima',
      codDpto: '1501',
      tipoPrograma: 'Pregrado Regular',
      carreraPrograma: 'Nutrición y Dietética',
      codCarreraPrograma: 'NUT-01',
      apellidosNombres: 'OBREGON FIGUEROA, Ana Dorila',
      dni: '45871236',
      regimen: 'Tiempo Parcial',
      dedicacion: '20 Horas',
      tipoActividad: 'Docencia de Práctica',
      horasRealizadas: '4',
      importeTotal: 'S/ 240.00',
      motivo: 'Regularización extemporánea posterior al día 11 (Cierre de Planilla)',
      centroCosto: 'Escuela Profesional de Nutrición',
      codCentroCosto: 'CC-NUT-2025',
      proyecto: 'Plan de Fortalecimiento Clínico',
      codProyecto: 'PRY-2025-NUT',
      mesRegularizacion: 'Setiembre 2025',
      fechaRegularizacionDocente: '16/09/2025'
    },
    {
      num: 2,
      departamento: 'Lima',
      codDpto: '1501',
      tipoPrograma: 'Pregrado Regular',
      carreraPrograma: 'Odontología',
      codCarreraPrograma: 'ODO-02',
      apellidosNombres: 'PAZ QUISPE, Rafael Antonio',
      dni: '09845123',
      regimen: 'Tiempo Completo',
      dedicacion: '40 Horas',
      tipoActividad: 'Docencia Teórica / Laboratorio',
      horasRealizadas: '3',
      importeTotal: 'S/ 210.00',
      motivo: 'Omisión de registro biométrico por falla de terminal en sede',
      centroCosto: 'Facultad de Ciencias de la Salud',
      codCentroCosto: 'CC-ODO-2025',
      proyecto: 'Simulación Odontológica',
      codProyecto: 'PRY-2025-ODO',
      mesRegularizacion: 'Octubre 2025',
      fechaRegularizacionDocente: '18/10/2025'
    }
  ];

  // ==========================================================================
  // FUNCIONES DE PERSISTENCIA
  // ==========================================================================
  function getSolicitudes() {
    const raw = localStorage.getItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES, JSON.stringify(INITIAL_SOLICITUDES));
      return INITIAL_SOLICITUDES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return INITIAL_SOLICITUDES;
    }
  }

  function saveSolicitudes(list) {
    localStorage.setItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES, JSON.stringify(list));
  }

  function getCronogramas() {
    const raw = localStorage.getItem(STORAGE_KEY_CRONOGRAMAS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CRONOGRAMAS, JSON.stringify(INITIAL_CRONOGRAMAS));
      return INITIAL_CRONOGRAMAS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return INITIAL_CRONOGRAMAS;
    }
  }

  function saveCronogramas(list) {
    localStorage.setItem(STORAGE_KEY_CRONOGRAMAS, JSON.stringify(list));
  }

  // ==========================================================================
  // NAVEGACIÓN POR PESTAÑAS (TAPBAR CON SOPORTE DE HASH)
  // ==========================================================================
  const subnavLinks = document.querySelectorAll('.admin-subnav-link');
  const panels = {
    solicitudes: document.getElementById('panelSolicitudes'),
    cronograma: document.getElementById('panelCronograma'),
    reportes: document.getElementById('panelReportes'),
    planilla: document.getElementById('panelPlanilla')
  };

  function switchTab(tabKey) {
    if (!tabKey || !panels[tabKey]) return;

    subnavLinks.forEach(l => {
      if (l.getAttribute('data-tab') === tabKey) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    Object.keys(panels).forEach(key => {
      if (panels[key]) {
        if (key === tabKey) {
          panels[key].classList.add('active');
          panels[key].style.display = 'block';
        } else {
          panels[key].classList.remove('active');
          panels[key].style.display = 'none';
        }
      }
    });

    // Refrescar vistas al cambiar de pestaña
    if (tabKey === 'solicitudes') renderSolicitudesTable();
    if (tabKey === 'cronograma') renderCronogramasTable();
    if (tabKey === 'reportes') renderReportesTable();
    if (tabKey === 'planilla') renderPlanillaTable();
  }

  subnavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabKey = link.getAttribute('data-tab');
      if (tabKey) {
        window.location.hash = tabKey;
        switchTab(tabKey);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (['solicitudes', 'cronograma', 'reportes', 'planilla'].includes(h)) {
      switchTab(h);
    }
  });

  // ==========================================================================
  // ELEMENTOS DOM - VISTA 1: SOLICITUDES
  // ==========================================================================
  const solicitudesTableBody = document.getElementById('solicitudesAsistenciaBody');
  const tableRowsCount = document.getElementById('tableRowsCount');
  const countSolicitados = document.getElementById('countSolicitados');
  const countAprobados = document.getElementById('countAprobados');
  const countRechazados = document.getElementById('countRechazados');
  const countTabSolicitudes = document.getElementById('countTabSolicitudes');

  const filterCurso = document.getElementById('filterCurso');
  const filterSeccion = document.getElementById('filterSeccion');
  const filterDocente = document.getElementById('filterDocente');
  const filterPeriodo = document.getElementById('filterPeriodo');
  const filterCondicion = document.getElementById('filterCondicion');
  const btnClearFilters = document.getElementById('btnClearFilters');

  // Checkbox maestro y barra masiva
  const chkSelectAll = document.getElementById('chkSelectAll');
  const bulkActionsBar = document.getElementById('bulkActionsBar');
  const selectedCountText = document.getElementById('selectedCountText');
  const btnBulkApprove = document.getElementById('btnBulkApprove');
  const btnBulkReject = document.getElementById('btnBulkReject');
  const btnBulkClear = document.getElementById('btnBulkClear');

  // Modal Rechazo Obligatorio
  const modalRechazoBackdrop = document.getElementById('modalRechazoBackdrop');
  const btnCloseModalRechazo = document.getElementById('btnCloseModalRechazo');
  const btnCancelRechazo = document.getElementById('btnCancelRechazo');
  const btnConfirmRechazo = document.getElementById('btnConfirmRechazo');
  const rejectionInfoText = document.getElementById('rejectionInfoText');
  const txtMotivoRechazo = document.getElementById('txtMotivoRechazo');
  const errorMotivoRechazo = document.getElementById('errorMotivoRechazo');
  let pendingRejectionTickets = [];

  // Modal Visor de Sustento
  const modalSustentoBackdrop = document.getElementById('modalSustentoBackdrop');
  const btnCloseModalSustento = document.getElementById('btnCloseModalSustento');
  const btnCerrarModalSustento = document.getElementById('btnCerrarModalSustento');
  const sustModalTicket = document.getElementById('sustModalTicket');
  const sustModalDocente = document.getElementById('sustModalDocente');
  const sustModalCurso = document.getElementById('sustModalCurso');
  const sustModalFecha = document.getElementById('sustModalFecha');
  const sustModalTipo = document.getElementById('sustModalTipo');
  const sustModalFileName = document.getElementById('sustModalFileName');
  const btnDescargarSustentoModal = document.getElementById('btnDescargarSustentoModal');

  // Toast
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  function showToast(text) {
    if (!toastMessage || !toastText) return;
    toastText.textContent = text;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3800);
  }

  // ==========================================================================
  // RENDERIZADO DE TABLA SOLICITUDES (IMAGEN 1)
  // ==========================================================================
  let selectedTickets = new Set();
  const CINCO_MINUTOS_MS = 5 * 60 * 1000;

  function renderSolicitudesTable() {
    const list = getSolicitudes();
    if (!solicitudesTableBody) return;

    // Filtros
    const fCurso = filterCurso ? filterCurso.value : 'todos';
    const fSeccion = filterSeccion ? filterSeccion.value : 'todos';
    const fDocente = filterDocente ? filterDocente.value : 'todos';
    const fPeriodo = filterPeriodo ? filterPeriodo.value : 'todos';
    const fCondicion = filterCondicion ? filterCondicion.value : 'todos';

    const filtered = list.filter(item => {
      const matchCurso = fCurso === 'todos' || item.curso.includes(fCurso);
      const matchSeccion = fSeccion === 'todos' || item.seccion === fSeccion;
      const matchDocente = fDocente === 'todos' || item.docente.includes(fDocente);
      const matchPeriodo = fPeriodo === 'todos' || item.periodo === fPeriodo;
      const matchCondicion = fCondicion === 'todos' || item.condicion.toLowerCase() === fCondicion.toLowerCase();
      return matchCurso && matchSeccion && matchDocente && matchPeriodo && matchCondicion;
    });

    // Actualizar contadores
    const numSolicitados = list.filter(s => s.condicion === 'Solicitado').length;
    const numAprobados = list.filter(s => s.condicion === 'Aprobado').length;
    const numRechazados = list.filter(s => s.condicion === 'Rechazado').length;

    if (countSolicitados) countSolicitados.textContent = `${numSolicitados} Solicitada${numSolicitados !== 1 ? 's' : ''}`;
    if (countAprobados) countAprobados.textContent = `${numAprobados} Aprobada${numAprobados !== 1 ? 's' : ''}`;
    if (countRechazados) countRechazados.textContent = `${numRechazados} Rechazada${numRechazados !== 1 ? 's' : ''}`;
    if (countTabSolicitudes) countTabSolicitudes.textContent = String(list.length);
    if (tableRowsCount) {
      tableRowsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> de ${list.length} solicitudes registradas`;
    }

    solicitudesTableBody.innerHTML = '';

    if (filtered.length === 0) {
      solicitudesTableBody.innerHTML = `
        <tr>
          <td colspan="19" style="text-align: center; padding: 40px; color: #64748B;">
            No se encontraron solicitudes con los criterios de búsqueda seleccionados.
          </td>
        </tr>
      `;
      updateBulkToolbar();
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('tr');
      const isChecked = selectedTickets.has(item.ticket);
      if (isChecked) row.classList.add('is-selected');

      // Badges según imagen 1
      let estadoBadgeClass = 'badge-incidencia-observado';
      if (item.estado === 'Inasistencia') estadoBadgeClass = 'badge-incidencia-inasistencia';
      if (item.estado === 'Tardanza') estadoBadgeClass = 'badge-incidencia-tardanza';

      let condicionBadgeClass = 'badge-condicion-solicitado';
      if (item.condicion === 'Aprobado') condicionBadgeClass = 'badge-condicion-aprobado';
      if (item.condicion === 'Rechazado') condicionBadgeClass = 'badge-condicion-rechazado';

      // Acciones disponibles / Rectificación de 5 minutos
      let accionesHtml = '';
      const now = Date.now();
      const hasTimer = item.decisionTimestamp && (now - item.decisionTimestamp < CINCO_MINUTOS_MS);

      if (hasTimer) {
        const remainingSeconds = Math.max(0, Math.floor((CINCO_MINUTOS_MS - (now - item.decisionTimestamp)) / 1000));
        const mins = Math.floor(remainingSeconds / 60);
        const secs = String(remainingSeconds % 60).padStart(2, '0');

        accionesHtml = `
          <button type="button" class="btn-rectify-countdown" data-ticket="${item.ticket}" title="Deshacer decisión dentro del plazo de 5 minutos">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <span>Rectificar (${mins}:${secs})</span>
          </button>
        `;
      } else if (item.condicion === 'Solicitado') {
        accionesHtml = `
          <div class="row-actions-group">
            <button type="button" class="btn-row-approve" data-ticket="${item.ticket}" title="Aprobar Solicitud">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button type="button" class="btn-row-reject" data-ticket="${item.ticket}" title="Rechazar Solicitud (requiere motivo)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;
      } else {
        accionesHtml = `
          <span style="font-size: 11px; color: #94A3B8; font-weight: 500;">Procesado</span>
        `;
      }

      row.innerHTML = `
        <td class="col-check">
          <input type="checkbox" class="chk-row" data-ticket="${item.ticket}" ${isChecked ? 'checked' : ''} aria-label="Seleccionar ticket ${item.ticket}">
        </td>
        <td class="col-ticket">${item.ticket}</td>
        <td class="col-fecha">${item.fecha}</td>
        <td class="col-area">${item.area}</td>
        <td class="col-curso" title="${item.curso}"><strong>${item.curso}</strong></td>
        <td class="col-periodo">${item.periodo}</td>
        <td class="col-seccion">${item.seccion}</td>
        <td class="col-sesion">${item.sesion}</td>
        <td class="col-horario-sub">${item.horarioInicio}</td>
        <td class="col-horario-sub">${item.horarioFin}</td>
        <td class="col-registro-sub">${item.registroInicio}</td>
        <td class="col-registro-sub">${item.registroFin}</td>
        <td class="col-tarda">
          ${item.tardanza ? `<span class="col-tarda-val">${item.tardanza}</span>` : '-'}
        </td>
        <td class="col-estado">
          <span class="badge-estado-incidencia ${estadoBadgeClass}">${item.estado}</span>
        </td>
        <td class="col-condicion">
          <span class="badge-condicion-tramite ${condicionBadgeClass}">${item.condicion}</span>
        </td>
        <td class="col-sustento">
          <button type="button" class="btn-view-sustento" data-ticket="${item.ticket}" title="Ver archivo de sustento">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>Ver</span>
          </button>
        </td>
        <td class="col-fsolicitud">
          <span class="fsolicitud-val">${item.fechaSolicitud}</span>
        </td>
        <td class="col-obs" title="${item.observacion}">${item.observacion}</td>
        <td class="col-acciones">${accionesHtml}</td>
      `;

      solicitudesTableBody.appendChild(row);
    });

    // Checkboxes de fila
    solicitudesTableBody.querySelectorAll('.chk-row').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const t = chk.getAttribute('data-ticket');
        if (chk.checked) {
          selectedTickets.add(t);
        } else {
          selectedTickets.delete(t);
        }
        updateBulkToolbar();
        // Sincronizar estilo de fila
        const tr = chk.closest('tr');
        if (tr) tr.classList.toggle('is-selected', chk.checked);
      });
    });

    // Botones Aprobar Individual
    solicitudesTableBody.querySelectorAll('.btn-row-approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = btn.getAttribute('data-ticket');
        aprobarSolicitudes([ticket]);
      });
    });

    // Botones Rechazar Individual
    solicitudesTableBody.querySelectorAll('.btn-row-reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = btn.getAttribute('data-ticket');
        abrirModalRechazo([ticket]);
      });
    });

    // Botones Rectificar Decisión (5 min)
    solicitudesTableBody.querySelectorAll('.btn-rectify-countdown').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = btn.getAttribute('data-ticket');
        rectificarDecision(ticket);
      });
    });

    // Botones Ver Sustento
    solicitudesTableBody.querySelectorAll('.btn-view-sustento').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticket = btn.getAttribute('data-ticket');
        abrirModalSustento(ticket);
      });
    });

    updateBulkToolbar();
  }

  // Ticker controlado para actualizar temporizadores de 5 minutos solo cuando existan decisiones activas
  let timerInterval = null;
  function checkAndRunTimerTicker() {
    const list = getSolicitudes();
    const now = Date.now();
    const hasActiveTimer = list.some(item => item.decisionTimestamp && (now - item.decisionTimestamp < CINCO_MINUTOS_MS));
    if (hasActiveTimer) {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          const innerList = getSolicitudes();
          const innerNow = Date.now();
          const stillActive = innerList.some(item => item.decisionTimestamp && (innerNow - item.decisionTimestamp < CINCO_MINUTOS_MS));
          renderSolicitudesTable();
          if (!stillActive) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
        }, 1000);
      }
    } else if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ==========================================================================
  // GESTIÓN DE ACCIONES MASIVAS
  // ==========================================================================
  function updateBulkToolbar() {
    if (!bulkActionsBar) return;
    const count = selectedTickets.size;
    if (count > 0) {
      bulkActionsBar.classList.add('show');
      if (selectedCountText) {
        selectedCountText.textContent = `${count} solicitud${count !== 1 ? 'es' : ''} seleccionada${count !== 1 ? 's' : ''}`;
      }
    } else {
      bulkActionsBar.classList.remove('show');
    }

    if (chkSelectAll) {
      const allRowCheckboxes = document.querySelectorAll('.chk-row');
      if (allRowCheckboxes.length > 0) {
        chkSelectAll.checked = Array.from(allRowCheckboxes).every(c => c.checked);
      } else {
        chkSelectAll.checked = false;
      }
    }
  }

  if (chkSelectAll) {
    chkSelectAll.addEventListener('change', () => {
      const allRowCheckboxes = document.querySelectorAll('.chk-row');
      allRowCheckboxes.forEach(chk => {
        chk.checked = chkSelectAll.checked;
        const t = chk.getAttribute('data-ticket');
        if (chkSelectAll.checked) {
          selectedTickets.add(t);
        } else {
          selectedTickets.delete(t);
        }
        const tr = chk.closest('tr');
        if (tr) tr.classList.toggle('is-selected', chkSelectAll.checked);
      });
      updateBulkToolbar();
    });
  }

  if (btnBulkClear) {
    btnBulkClear.addEventListener('click', () => {
      selectedTickets.clear();
      renderSolicitudesTable();
    });
  }

  if (btnBulkApprove) {
    btnBulkApprove.addEventListener('click', () => {
      if (selectedTickets.size === 0) return;
      const count = selectedTickets.size;
      if (confirm(`¿Está seguro de aprobar las ${count} solicitudes seleccionadas?`)) {
        aprobarSolicitudes(Array.from(selectedTickets));
        selectedTickets.clear();
      }
    });
  }

  if (btnBulkReject) {
    btnBulkReject.addEventListener('click', () => {
      if (selectedTickets.size === 0) return;
      abrirModalRechazo(Array.from(selectedTickets));
    });
  }

  // ==========================================================================
  // ACCIONES: APROBACIÓN Y RECTIFICACIÓN
  // ==========================================================================
  function aprobarSolicitudes(tickets) {
    const list = getSolicitudes();
    const now = Date.now();

    list.forEach(item => {
      if (tickets.includes(item.ticket)) {
        item.condicion = 'Aprobado';
        item.observacion = 'Aprobado por RRAA';
        item.aprobador = 'RRAA - Lic. Carlos Silva';
        item.decisionTimestamp = now;
      }
    });

    saveSolicitudes(list);
    renderSolicitudesTable();
    renderReportesTable();
    checkAndRunTimerTicker();
    showToast(`${tickets.length === 1 ? 'Solicitud aprobada' : `${tickets.length} solicitudes aprobadas`} con éxito. Puedes rectificar durante 5 minutos.`);
  }

  function rectificarDecision(ticket) {
    const list = getSolicitudes();
    const item = list.find(s => s.ticket === ticket);
    if (!item) return;

    if (confirm(`¿Deseas rectificar la decisión sobre la solicitud #${ticket}? Volverá a estado 'Solicitado' para que puedas modificarla.`)) {
      item.condicion = 'Solicitado';
      item.observacion = '-';
      item.decisionTimestamp = null;
      item.aprobador = null;

      saveSolicitudes(list);
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Decisión sobre el ticket #${ticket} rectificada correctamente.`);
    }
  }

  // ==========================================================================
  // MODAL DE RECHAZO CON MOTIVO OBLIGATORIO
  // ==========================================================================
  function abrirModalRechazo(tickets) {
    pendingRejectionTickets = tickets;
    if (txtMotivoRechazo) {
      txtMotivoRechazo.value = '';
      txtMotivoRechazo.classList.remove('has-error');
    }
    if (errorMotivoRechazo) errorMotivoRechazo.classList.remove('show');

    if (rejectionInfoText) {
      if (tickets.length === 1) {
        const item = getSolicitudes().find(s => s.ticket === tickets[0]);
        rejectionInfoText.innerHTML = `Está a punto de rechazar la solicitud del <strong>Ticket #${tickets[0]}</strong> (${item ? item.curso : ''}). Este proceso requiere sustento.`;
      } else {
        rejectionInfoText.innerHTML = `Está a punto de rechazar <strong>${tickets.length} solicitudes</strong> en bloque. Este motivo se aplicará a todas las solicitudes seleccionadas.`;
      }
    }

    if (modalRechazoBackdrop) {
      modalRechazoBackdrop.classList.add('active');
      setTimeout(() => {
        if (txtMotivoRechazo) txtMotivoRechazo.focus();
      }, 100);
    }
  }

  function cerrarModalRechazo() {
    if (modalRechazoBackdrop) modalRechazoBackdrop.classList.remove('active');
    pendingRejectionTickets = [];
  }

  if (btnCloseModalRechazo) btnCloseModalRechazo.addEventListener('click', cerrarModalRechazo);
  if (btnCancelRechazo) btnCancelRechazo.addEventListener('click', cerrarModalRechazo);

  if (btnConfirmRechazo) {
    btnConfirmRechazo.addEventListener('click', () => {
      const motivo = txtMotivoRechazo ? txtMotivoRechazo.value.trim() : '';

      // Validación obligatoria del requerimiento
      if (!motivo) {
        if (txtMotivoRechazo) txtMotivoRechazo.classList.add('has-error');
        if (errorMotivoRechazo) errorMotivoRechazo.classList.add('show');
        if (txtMotivoRechazo) txtMotivoRechazo.focus();
        return;
      }

      const list = getSolicitudes();
      const now = Date.now();

      list.forEach(item => {
        if (pendingRejectionTickets.includes(item.ticket)) {
          item.condicion = 'Rechazado';
          item.observacion = motivo;
          item.aprobador = 'RRAA - Lic. Carlos Silva';
          item.decisionTimestamp = now;
        }
      });

      saveSolicitudes(list);
      cerrarModalRechazo();
      selectedTickets.clear();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud${pendingRejectionTickets.length > 1 ? 'es' : ''} rechazada${pendingRejectionTickets.length > 1 ? 's' : ''}. Motivo registrado en el expediente.`);
    });
  }

  // ==========================================================================
  // MODAL VISOR DE SUSTENTO ADJUNTO
  // ==========================================================================
  function abrirModalSustento(ticket) {
    const item = getSolicitudes().find(s => s.ticket === ticket);
    if (!item || !modalSustentoBackdrop) return;

    if (sustModalTicket) sustModalTicket.textContent = `#${item.ticket}`;
    if (sustModalDocente) sustModalDocente.textContent = item.docente;
    if (sustModalCurso) sustModalCurso.textContent = `${item.curso} (${item.seccion})`;
    if (sustModalFecha) sustModalFecha.textContent = item.fecha;
    if (sustModalTipo) sustModalTipo.textContent = item.tipoSustento;
    if (sustModalFileName) sustModalFileName.textContent = item.sustento;

    modalSustentoBackdrop.classList.add('active');
  }

  function cerrarModalSustento() {
    if (modalSustentoBackdrop) modalSustentoBackdrop.classList.remove('active');
  }

  if (btnCloseModalSustento) btnCloseModalSustento.addEventListener('click', cerrarModalSustento);
  if (btnCerrarModalSustento) btnCerrarModalSustento.addEventListener('click', cerrarModalSustento);

  if (btnDescargarSustentoModal) {
    btnDescargarSustentoModal.addEventListener('click', () => {
      const filename = sustModalFileName ? sustModalFileName.textContent : 'sustento.pdf';
      showToast(`Descargando archivo adjunto: ${filename}`);
    });
  }

  // Filtros de búsqueda - Eventos
  [filterCurso, filterSeccion, filterDocente, filterPeriodo, filterCondicion].forEach(f => {
    if (f) f.addEventListener('change', renderSolicitudesTable);
  });

  if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
      if (filterCurso) filterCurso.value = 'todos';
      if (filterSeccion) filterSeccion.value = 'todos';
      if (filterDocente) filterDocente.value = 'todos';
      if (filterPeriodo) filterPeriodo.value = 'todos';
      if (filterCondicion) filterCondicion.value = 'todos';
      renderSolicitudesTable();
      showToast('Filtros restablecidos');
    });
  }

  // ==========================================================================
  // VISTA 2: GESTIÓN DE CRONOGRAMA DE CORTE (RRAA)
  // ==========================================================================
  const cronogramasTableBody = document.getElementById('cronogramasTableBody');
  const formCronograma = document.getElementById('formCronograma');
  const cronoAnio = document.getElementById('cronoAnio');
  const cronoMes = document.getElementById('cronoMes');
  const cronoFechaCorteInicio = document.getElementById('cronoFechaCorteInicio');
  const cronoFechaCorteFin = document.getElementById('cronoFechaCorteFin');
  const cronoFechaLimite = document.getElementById('cronoFechaLimite');

  function renderCronogramasTable() {
    if (!cronogramasTableBody) return;
    const list = getCronogramas();
    cronogramasTableBody.innerHTML = '';

    list.forEach((item, idx) => {
      const row = document.createElement('tr');
      let statusBadge = '<span class="badge-status-pill badge-procesado">Vigente</span>';
      if (item.estado === 'Cerrado') statusBadge = '<span class="badge-status-pill badge-rechazado">Cerrado</span>';
      if (item.estado === 'Programado') statusBadge = '<span class="badge-status-pill badge-solicitado">Programado</span>';

      row.innerHTML = `
        <td style="text-align: center; font-weight: 700; color: #64748B;">${idx + 1}</td>
        <td style="font-weight: 700; text-align: center;">${item.anio}</td>
        <td style="font-weight: 600; color: #0F848F;">${item.mes}</td>
        <td style="text-align: center;">${item.corteInicio} al ${item.corteFin}</td>
        <td style="text-align: center; color: #DC2626; font-weight: 700;">${item.fechaLimite}</td>
        <td style="text-align: center; color: #7F1D1D; font-size: 11.5px;">Desde ${item.fechaBloqueo} (Bloqueo Total)</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: center;">
          <button type="button" class="btn-row-action btn-toggle-crono" data-id="${item.id}" title="Alternar Estado">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        </td>
      `;
      cronogramasTableBody.appendChild(row);
    });

    cronogramasTableBody.querySelectorAll('.btn-toggle-crono').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-id'));
        const list = getCronogramas();
        const found = list.find(c => c.id === id);
        if (found) {
          found.estado = found.estado === 'Vigente' ? 'Cerrado' : 'Vigente';
          saveCronogramas(list);
          renderCronogramasTable();
          showToast(`Estado del cronograma actualizado a ${found.estado}.`);
        }
      });
    });
  }

  if (formCronograma) {
    formCronograma.addEventListener('submit', (e) => {
      e.preventDefault();
      const anio = cronoAnio ? cronoAnio.value : '2025';
      const mes = cronoMes ? cronoMes.value : 'Diciembre';
      const fInicio = cronoFechaCorteInicio ? cronoFechaCorteInicio.value : '12/11/2025';
      const fFin = cronoFechaCorteFin ? cronoFechaCorteFin.value : '11/12/2025';
      const fLimite = cronoFechaLimite ? cronoFechaLimite.value : '15/12/2025';

      const list = getCronogramas();
      const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;

      list.push({
        id: newId,
        anio,
        mes,
        corteInicio: fInicio,
        corteFin: fFin,
        fechaLimite: fLimite,
        fechaBloqueo: '16/12/2025',
        estado: 'Vigente'
      });

      saveCronogramas(list);
      renderCronogramasTable();
      showToast('Nuevo cronograma de corte configurado con éxito.');
    });
  }

  // ==========================================================================
  // VISTA 3: REPORTE DE SOLICITUDES (CONSOLIDADO)
  // ==========================================================================
  const reportesTableBody = document.getElementById('reportesTableBody');
  const reportStateBtns = document.querySelectorAll('.report-state-btn');
  const filterReportCurso = document.getElementById('filterReportCurso');
  const filterReportAprobador = document.getElementById('filterReportAprobador');
  const btnExportExcel = document.getElementById('btnExportExcel');
  const btnExportPdf = document.getElementById('btnExportPdf');
  let currentReportState = 'todos';

  reportStateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      reportStateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentReportState = btn.getAttribute('data-state');
      renderReportesTable();
    });
  });

  function renderReportesTable() {
    if (!reportesTableBody) return;
    const list = getSolicitudes();

    const fCurso = filterReportCurso ? filterReportCurso.value : 'todos';
    const fAprobador = filterReportAprobador ? filterReportAprobador.value : 'todos';

    // Actualizar badges en botones de reporte
    const countAll = list.length;
    const countAprob = list.filter(s => s.condicion === 'Aprobado').length;
    const countRech = list.filter(s => s.condicion === 'Rechazado').length;
    const countProc = list.filter(s => s.condicion === 'Solicitado').length;

    const bAll = document.getElementById('repBadgeAll');
    const bAprob = document.getElementById('repBadgeAprobadas');
    const bRech = document.getElementById('repBadgeRechazadas');
    const bProc = document.getElementById('repBadgeProceso');

    if (bAll) bAll.textContent = countAll;
    if (bAprob) bAprob.textContent = countAprob;
    if (bRech) bRech.textContent = countRech;
    if (bProc) bProc.textContent = countProc;

    const filtered = list.filter(item => {
      const matchState = currentReportState === 'todos' || item.condicion.toLowerCase() === currentReportState.toLowerCase();
      const matchCurso = fCurso === 'todos' || item.curso.includes(fCurso);
      const matchAprobador = fAprobador === 'todos' || (item.aprobador && item.aprobador.includes(fAprobador));
      return matchState && matchCurso && matchAprobador;
    });

    reportesTableBody.innerHTML = '';

    if (filtered.length === 0) {
      reportesTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 36px; color: #64748B;">
            No se encontraron registros para el reporte con los filtros seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item, idx) => {
      const row = document.createElement('tr');
      let condBadge = '<span class="badge-status-pill badge-solicitado">En Proceso</span>';
      if (item.condicion === 'Aprobado') condBadge = '<span class="badge-status-pill badge-procesado">Aprobado</span>';
      if (item.condicion === 'Rechazado') condBadge = '<span class="badge-status-pill badge-rechazado">Rechazado</span>';

      row.innerHTML = `
        <td style="text-align: center; font-weight: 700; color: #64748B;">${idx + 1}</td>
        <td style="font-weight: 700; color: #0F848F;">${item.docenteCodigo || 'DOC-45871'}</td>
        <td style="font-weight: 600; color: #1E293B;">${item.docente}</td>
        <td style="line-height: 1.3;">${item.curso}</td>
        <td style="text-align: center;">${item.seccion} / ${item.sesion}</td>
        <td style="text-align: center;">${item.fecha}</td>
        <td style="text-align: center;">${item.fechaSolicitud}</td>
        <td style="text-align: center;">${condBadge}</td>
        <td style="font-size: 11px; color: #64748B;">${item.observacion}</td>
        <td style="font-size: 11.5px; font-weight: 600; color: #334155;">${item.aprobador || 'Pendiente de Asignación'}</td>
      `;
      reportesTableBody.appendChild(row);
    });
  }

  if (filterReportCurso) filterReportCurso.addEventListener('change', renderReportesTable);
  if (filterReportAprobador) filterReportAprobador.addEventListener('change', renderReportesTable);

  // Exportar Excel en Reportes
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      const list = getSolicitudes();
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "N,Codigo Docente,Docente,Curso,Seccion,Fecha Sesion,Fecha Solicitud,Estado,Observaciones,Aprobador\n";

      list.forEach((item, idx) => {
        const row = [
          idx + 1,
          `"${item.docenteCodigo || 'DOC-45871'}"`,
          `"${item.docente}"`,
          `"${item.curso}"`,
          `"${item.seccion} - ${item.sesion}"`,
          `"${item.fecha}"`,
          `"${item.fechaSolicitud}"`,
          `"${item.condicion}"`,
          `"${item.observacion}"`,
          `"${item.aprobador || 'Pendiente'}"`
        ];
        csvContent += row.join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Reporte_Regularizacion_Asistencia_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Reporte consolidado exportado a Excel exitosamente.');
    });
  }

  // Exportar PDF en Reportes
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // VISTA 4: PLANILLA MANUAL (20 COLUMNAS EXACTAS SEGÚN IMAGEN 2)
  // ==========================================================================
  const planillaTableBody = document.getElementById('planillaManualTableBody');
  const btnDescargarPlantillaVacia = document.getElementById('btnDescargarPlantillaVacia');
  const btnExportarConsolidadoPlanilla = document.getElementById('btnExportarConsolidadoPlanilla');
  const btnAbrirModalImportar = document.getElementById('btnAbrirModalImportar');

  // Modal Importar Planilla
  const modalImportarPlanillaBackdrop = document.getElementById('modalImportarPlanillaBackdrop');
  const btnCloseModalImportar = document.getElementById('btnCloseModalImportar');
  const btnCancelarImportar = document.getElementById('btnCancelarImportar');
  const btnConfirmarImportacion = document.getElementById('btnConfirmarImportacion');
  const fileInputPlanilla = document.getElementById('fileInputPlanilla');
  const dropzonePlanilla = document.getElementById('dropzonePlanilla');
  const selectedFileNameText = document.getElementById('selectedFileNameText');

  let planillaData = [...INITIAL_PLANILLA_MANUAL];

  function renderPlanillaTable() {
    if (!planillaTableBody) return;
    planillaTableBody.innerHTML = '';

    planillaData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="text-align: center; font-weight: 700; color: #64748B;">${item.num}</td>
        <td>${item.departamento}</td>
        <td style="text-align: center;">${item.codDpto}</td>
        <td>${item.tipoPrograma}</td>
        <td><strong>${item.carreraPrograma}</strong></td>
        <td style="text-align: center;">${item.codCarreraPrograma}</td>
        <td><strong>${item.apellidosNombres}</strong></td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${item.dni}</td>
        <td>${item.regimen}</td>
        <td>${item.dedicacion}</td>
        <td>${item.tipoActividad}</td>
        <td style="text-align: center; font-weight: 700; color: #0F848F;">${item.horasRealizadas}</td>
        <td style="text-align: right; font-weight: 700; color: #15803D;">${item.importeTotal}</td>
        <td title="${item.motivo}">${item.motivo}</td>
        <td>${item.centroCosto}</td>
        <td style="text-align: center;">${item.codCentroCosto}</td>
        <td>${item.proyecto}</td>
        <td style="text-align: center;">${item.codProyecto}</td>
        <td style="text-align: center; font-weight: 600;">${item.mesRegularizacion}</td>
        <td style="text-align: center; font-weight: 700; color: #DC2626;">${item.fechaRegularizacionDocente}</td>
      `;
      planillaTableBody.appendChild(row);
    });
  }

  // Descargar Plantilla Vacía Excel
  if (btnDescargarPlantillaVacia) {
    btnDescargarPlantillaVacia.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "N,Departamento,Cod. Dpto.,Tipo de Programa,Carrera o Programa,Cod. Carrera o Programa,Apellidos y Nombres,N D.N.I.,Regimen,Dedicacion,Tipo de Actividad,Horas/Cantidad Realizada,Importe Total,Motivo,Nombre del Centro de Costo,Cod. Del Centro de Costo,Nombre del Cod. de Proyecto,Cod. Del Proyecto,Mes de Regularizacion,FECHA DE REGULARIZACION POR PARTE DEL DOCENTE\n";
      csvContent += "1,,,,,,,,,,,,,,,,,,,\n";
      csvContent += "2,,,,,,,,,,,,,,,,,,,\n";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Plantilla_Vacia_Planilla_Manual_Wiener.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Plantilla vacía de planilla manual descargada.');
    });
  }

  // Exportar Consolidado Planilla
  if (btnExportarConsolidadoPlanilla) {
    btnExportarConsolidadoPlanilla.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "N,Departamento,Cod. Dpto.,Tipo de Programa,Carrera o Programa,Cod. Carrera o Programa,Apellidos y Nombres,N D.N.I.,Regimen,Dedicacion,Tipo de Actividad,Horas/Cantidad Realizada,Importe Total,Motivo,Nombre del Centro de Costo,Cod. Del Centro de Costo,Nombre del Cod. de Proyecto,Cod. Del Proyecto,Mes de Regularizacion,FECHA DE REGULARIZACION POR PARTE DEL DOCENTE\n";

      planillaData.forEach(item => {
        const row = [
          item.num,
          `"${item.departamento}"`,
          `"${item.codDpto}"`,
          `"${item.tipoPrograma}"`,
          `"${item.carreraPrograma}"`,
          `"${item.codCarreraPrograma}"`,
          `"${item.apellidosNombres}"`,
          `"${item.dni}"`,
          `"${item.regimen}"`,
          `"${item.dedicacion}"`,
          `"${item.tipoActividad}"`,
          `"${item.horasRealizadas}"`,
          `"${item.importeTotal}"`,
          `"${item.motivo}"`,
          `"${item.centroCosto}"`,
          `"${item.codCentroCosto}"`,
          `"${item.proyecto}"`,
          `"${item.codProyecto}"`,
          `"${item.mesRegularizacion}"`,
          `"${item.fechaRegularizacionDocente}"`
        ];
        csvContent += row.join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Planilla_Manual_Consolidada_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Planilla manual consolidada exportada exitosamente.');
    });
  }

  // Modal Importar Planilla
  if (btnAbrirModalImportar) {
    btnAbrirModalImportar.addEventListener('click', () => {
      if (modalImportarPlanillaBackdrop) {
        modalImportarPlanillaBackdrop.classList.add('active');
        if (selectedFileNameText) selectedFileNameText.textContent = '';
      }
    });
  }

  function cerrarModalImportar() {
    if (modalImportarPlanillaBackdrop) modalImportarPlanillaBackdrop.classList.remove('active');
  }

  if (btnCloseModalImportar) btnCloseModalImportar.addEventListener('click', cerrarModalImportar);
  if (btnCancelarImportar) btnCancelarImportar.addEventListener('click', cerrarModalImportar);

  if (dropzonePlanilla && fileInputPlanilla) {
    dropzonePlanilla.addEventListener('click', () => fileInputPlanilla.click());
    fileInputPlanilla.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        if (selectedFileNameText) {
          selectedFileNameText.textContent = `Archivo cargado: ${e.target.files[0].name} (${Math.round(e.target.files[0].size / 1024)} KB)`;
        }
      }
    });
  }

  if (btnConfirmarImportacion) {
    btnConfirmarImportacion.addEventListener('click', () => {
      if (!fileInputPlanilla || !fileInputPlanilla.files || fileInputPlanilla.files.length === 0) {
        alert('Por favor seleccione un archivo de planilla validada (.xlsx o .csv).');
        return;
      }

      // Demo de importación con nueva fila agregada
      planillaData.push({
        num: planillaData.length + 1,
        departamento: 'Lima',
        codDpto: '1501',
        tipoPrograma: 'Pregrado Regular',
        carreraPrograma: 'Nutrición y Dietética',
        codCarreraPrograma: 'NUT-01',
        apellidosNombres: 'SILVA SÁNCHEZ, Carlos Jesús',
        dni: '41289563',
        regimen: 'Tiempo Parcial',
        dedicacion: '16 Horas',
        tipoActividad: 'Docencia Práctica Clínica',
        horasRealizadas: '3',
        importeTotal: 'S/ 210.00',
        motivo: 'Regularización de sesión fuera de corte de planilla',
        centroCosto: 'Escuela Profesional de Nutrición',
        codCentroCosto: 'CC-NUT-2025',
        proyecto: 'Desarrollo Académico',
        codProyecto: 'PRY-2025-NUT',
        mesRegularizacion: 'Octubre 2025',
        fechaRegularizacionDocente: '19/10/2025'
      });

      cerrarModalImportar();
      renderPlanillaTable();
      showToast('Planilla manual importada y consolidada con éxito.');
    });
  }

  // ==========================================================================
  // INICIALIZACIÓN
  // ==========================================================================
  renderSolicitudesTable();
  renderCronogramasTable();
  renderReportesTable();
  renderPlanillaTable();
  checkAndRunTimerTicker();

  // Activación por hash al cargar la página (seguro tras inicializar todos los elementos)
  const initialHash = window.location.hash.replace('#', '');
  if (['solicitudes', 'cronograma', 'reportes', 'planilla'].includes(initialHash)) {
    switchTab(initialHash);
  }

});
