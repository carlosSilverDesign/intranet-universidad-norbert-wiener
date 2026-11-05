/**
 * ============================================================================
 * REGULARIZACIÓN DE ASISTENCIA DOCENTE - PERFIL ADMINISTRATIVO (RRAA)
 * Portal Administrativo - Universidad Norbert Wiener
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // Helper para normalizar y formatear fechas a DD/MM/AAAA
  function formatDateDDMMYYYY(str) {
    if (!str) return '-';
    const m = String(str).match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(.*)$/);
    if (m) {
      const y = m[1];
      const month = String(m[2]).padStart(2, '0');
      const d = String(m[3]).padStart(2, '0');
      const rest = m[4] || '';
      return `${d}/${month}/${y}${rest}`;
    }
    return str;
  }


  // Clave de almacenamiento en LocalStorage
  const STORAGE_KEY_ASISTENCIA_SOLICITUDES = 'wiener_rraa_asistencia_solicitudes_v1';
  const STORAGE_KEY_CRONOGRAMAS = 'wiener_rraa_cronogramas_corte_v1';

  // ==========================================================================
  // DATOS INICIALES (Fieles a la Imagen 1 del requerimiento)
  // ==========================================================================
  const INITIAL_SOLICITUDES = [
    {
      ticket: '1',
      fecha: '02/10/2025 - Jue.',
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
      fecha: '02/10/2025 - Jue.',
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
      fecha: '02/10/2025 - Jue.',
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
      fecha: '25/09/2025 - Jue.',
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
    let list = INITIAL_SOLICITUDES;
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES, JSON.stringify(INITIAL_SOLICITUDES));
    } else {
      try {
        list = JSON.parse(raw);
      } catch (e) {
        list = INITIAL_SOLICITUDES;
      }
    }
    // Asegurar formato estricto DD/MM/AAAA en todas las fechas
    list.forEach(item => {
      if (item.fecha) item.fecha = formatDateDDMMYYYY(item.fecha);
      if (item.fechaSolicitud) item.fechaSolicitud = formatDateDDMMYYYY(item.fechaSolicitud);
    });
    return list;
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

  // Modal Evaluación y Decisión Integral (Opción A)
  const modalEvaluacionBackdrop = document.getElementById('modalEvaluacionBackdrop');
  const btnCloseModalEvaluacion = document.getElementById('btnCloseModalEvaluacion');
  const btnCerrarModalEvaluacion = document.getElementById('btnCerrarModalEvaluacion');
  const evalModalTicketBadge = document.getElementById('evalModalTicketBadge');
  const evalDocenteNombre = document.getElementById('evalDocenteNombre');
  const evalDocenteCodigo = document.getElementById('evalDocenteCodigo');
  const evalCursoNombre = document.getElementById('evalCursoNombre');
  const evalCarrera = document.getElementById('evalCarrera');
  const evalSeccionSesion = document.getElementById('evalSeccionSesion');
  const evalPeriodo = document.getElementById('evalPeriodo');
  const evalFechaSesion = document.getElementById('evalFechaSesion');
  const evalFechaSolicitud = document.getElementById('evalFechaSolicitud');
  const evalBadgeIncidencia = document.getElementById('evalBadgeIncidencia');
  const evalHorarioInicio = document.getElementById('evalHorarioInicio');
  const evalHorarioFin = document.getElementById('evalHorarioFin');
  const evalRegistroInicio = document.getElementById('evalRegistroInicio');
  const evalRegistroFin = document.getElementById('evalRegistroFin');
  const evalTardanzaObs = document.getElementById('evalTardanzaObs');
  const evalTipoSustento = document.getElementById('evalTipoSustento');
  const evalJefeInmediato = document.getElementById('evalJefeInmediato');
  const evalFileName = document.getElementById('evalFileName');
  const evalFileSize = document.getElementById('evalFileSize');
  const btnDescargarSustentoDoc = document.getElementById('btnDescargarSustentoDoc');
  const evalAuditStatusBox = document.getElementById('evalAuditStatusBox');
  const evalDecisionFormArea = document.getElementById('evalDecisionFormArea');
  const evalTxtObservacion = document.getElementById('evalTxtObservacion');
  const evalErrorObservacion = document.getElementById('evalErrorObservacion');
  const evalObsMandatoryMarker = document.getElementById('evalObsMandatoryMarker');
  const evalActionButtonsGroup = document.getElementById('evalActionButtonsGroup');
  const btnModalEvalRechazar = document.getElementById('btnModalEvalRechazar');
  const btnModalEvalAprobar = document.getElementById('btnModalEvalAprobar');
  let currentEvaluatingTicket = null;

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
          <td colspan="12" style="text-align: center; padding: 40px; color: #64748B;">
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

      // Badges según incidencia
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
          <div class="row-actions-group-modern">
            <button type="button" class="btn-rectify-countdown" data-ticket="${item.ticket}" title="Deshacer decisión dentro del plazo de 5 minutos">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span>Rectificar (${mins}:${secs})</span>
            </button>
            <button type="button" class="btn-evaluar-solicitud btn-view-only" data-ticket="${item.ticket}" title="Ver expediente">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        `;
      } else if (item.condicion === 'Solicitado') {
        accionesHtml = `
          <div class="row-actions-group-modern">
            <button type="button" class="btn-evaluar-solicitud" data-ticket="${item.ticket}" title="Evaluar y resolver solicitud">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Evaluar</span>
            </button>
            <button type="button" class="btn-row-approve-sm" data-ticket="${item.ticket}" title="Aprobar rápidamente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button type="button" class="btn-row-reject-sm" data-ticket="${item.ticket}" title="Rechazar con motivo obligatorio">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;
      } else {
        accionesHtml = `
          <div class="row-actions-group-modern">
            <button type="button" class="btn-evaluar-solicitud btn-view-only" data-ticket="${item.ticket}" title="Ver expediente resuelto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Ver Ficha</span>
            </button>
          </div>
        `;
      }

      row.innerHTML = `
        <td class="col-check">
          <input type="checkbox" class="chk-row" data-ticket="${item.ticket}" ${isChecked ? 'checked' : ''} aria-label="Seleccionar ticket ${item.ticket}">
        </td>
        <td class="col-ticket">#${item.ticket}</td>
        <td class="col-docente">
          <div class="table-docente-name">${item.docente}</div>
          <div class="table-docente-sub">${item.docenteCodigo || 'DOC-45871'} · ${item.area}</div>
        </td>
        <td class="col-curso" title="${item.curso}">
          <div class="table-curso-name">${item.curso}</div>
          <div class="table-curso-sub">
            <span class="badge-seccion-tag">${item.seccion}</span>
            <span>${item.sesion}</span>
          </div>
        </td>
        <td class="col-fecha">
          <div class="table-fecha-main">${formatDateDDMMYYYY(item.fecha)}</div>
          <div class="table-fecha-sub">Sol: ${formatDateDDMMYYYY(item.fechaSolicitud)}</div>
        </td>
        <td class="col-time">${item.horarioInicio || '-'}</td>
        <td class="col-time">${item.horarioFin || '-'}</td>
        <td class="col-time ${item.registroInicio === '00:00' ? 'time-omitted-cell' : ''}">${item.registroInicio || '-'}</td>
        <td class="col-time ${item.registroFin === '00:00' ? 'time-omitted-cell' : ''}">${item.registroFin || '-'}</td>
        <td class="col-estado">
          <span class="badge-estado-incidencia ${estadoBadgeClass}">
            ${item.estado}
          </span>
        </td>
        <td class="col-condicion">
          <span class="badge-condicion-tramite ${condicionBadgeClass}">${item.condicion}</span>
        </td>
        <td class="col-acciones">${accionesHtml}</td>
      `;

      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
        abrirModalEvaluacion(item.ticket);
      });

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
        const tr = chk.closest('tr');
        if (tr) tr.classList.toggle('is-selected', chk.checked);
      });
    });

    // Botones Evaluar / Ver Ficha
    solicitudesTableBody.querySelectorAll('.btn-evaluar-solicitud').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticket = btn.getAttribute('data-ticket');
        abrirModalEvaluacion(ticket);
      });
    });

    // Botones Aprobar Rápido
    solicitudesTableBody.querySelectorAll('.btn-row-approve-sm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticket = btn.getAttribute('data-ticket');
        aprobarSolicitudes([ticket]);
      });
    });

    // Botones Rechazar Rápido
    solicitudesTableBody.querySelectorAll('.btn-row-reject-sm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticket = btn.getAttribute('data-ticket');
        abrirModalRechazo([ticket]);
      });
    });

    // Botones Rectificar Decisión (5 min)
    solicitudesTableBody.querySelectorAll('.btn-rectify-countdown').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ticket = btn.getAttribute('data-ticket');
        rectificarDecision(ticket);
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
  // MODAL INTEGRAL DE EVALUACIÓN Y DECISIÓN (OPCIÓN A)
  // ==========================================================================
  function abrirModalEvaluacion(ticket) {
    const list = getSolicitudes();
    const item = list.find(s => s.ticket === ticket);
    if (!item || !modalEvaluacionBackdrop) return;
    currentEvaluatingTicket = ticket;

    if (evalModalTicketBadge) {
      evalModalTicketBadge.textContent = `Ticket #${item.ticket} • ${item.condicion}`;
    }
    if (evalDocenteNombre) evalDocenteNombre.textContent = item.docente;
    if (evalDocenteCodigo) evalDocenteCodigo.textContent = `Código: ${item.docenteCodigo || 'DOC-45871'}`;
    if (evalCursoNombre) evalCursoNombre.textContent = item.curso;
    if (evalCarrera) evalCarrera.textContent = `Área / Carrera: ${item.area || 'NUTRICIÓN Y DIETÉTICA'}`;
    if (evalSeccionSesion) evalSeccionSesion.textContent = `Sección: ${item.seccion} • Sesión: ${item.sesion}`;
    if (evalPeriodo) evalPeriodo.textContent = `Periodo Académico: ${item.periodo || '2025-II'}`;
    if (evalFechaSesion) evalFechaSesion.textContent = formatDateDDMMYYYY(item.fecha);
    if (evalFechaSolicitud) evalFechaSolicitud.textContent = `Fecha de Solicitud: ${formatDateDDMMYYYY(item.fechaSolicitud)}`;

    // Incidencia
    let estadoBadgeClass = 'badge-incidencia-observado';
    if (item.estado === 'Inasistencia') estadoBadgeClass = 'badge-incidencia-inasistencia';
    if (item.estado === 'Tardanza') estadoBadgeClass = 'badge-incidencia-tardanza';

    if (evalBadgeIncidencia) {
      evalBadgeIncidencia.className = `badge-estado-incidencia ${estadoBadgeClass}`;
      evalBadgeIncidencia.textContent = `${item.estado}${item.tardanza ? ` (${item.tardanza}m tardanza)` : ''}`;
    }

    // Biometría
    if (evalHorarioInicio) evalHorarioInicio.textContent = item.horarioInicio;
    if (evalHorarioFin) evalHorarioFin.textContent = item.horarioFin;
    if (evalRegistroInicio) {
      evalRegistroInicio.textContent = item.registroInicio === '00:00' ? '00:00 (Omitido)' : item.registroInicio;
      evalRegistroInicio.className = `compare-time-val ${item.registroInicio === '00:00' ? 'time-omitted' : ''}`;
    }
    if (evalRegistroFin) {
      evalRegistroFin.textContent = item.registroFin === '00:00' ? '00:00 (Omitido)' : item.registroFin;
      evalRegistroFin.className = `compare-time-val ${item.registroFin === '00:00' ? 'time-omitted' : ''}`;
    }

    if (evalTardanzaObs) {
      if (item.estado === 'Tardanza' && item.tardanza) {
        evalTardanzaObs.textContent = `Tardanza registrada de ${item.tardanza} minutos respecto al horario oficial programado.`;
      } else if (item.registroFin === '00:00') {
        evalTardanzaObs.textContent = 'Incidencia: Salida no registrada en marcación.';
      } else if (item.registroInicio === '00:00') {
        evalTardanzaObs.textContent = 'Incidencia: Sin marcación biométrica de ingreso.';
      } else {
        evalTardanzaObs.textContent = 'Incidencia: Marcación observada sujeta a regularización.';
      }
    }

    // Sustento
    if (evalTipoSustento) evalTipoSustento.textContent = item.tipoSustento || 'Descanso Médico';
    if (evalFileName) evalFileName.textContent = item.sustento;

    // Formulario de Decisión / Auditoría
    if (item.condicion === 'Solicitado') {
      if (evalAuditStatusBox) evalAuditStatusBox.style.display = 'none';
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'block';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'flex';
      if (evalTxtObservacion) {
        evalTxtObservacion.value = '';
        evalTxtObservacion.classList.remove('has-error');
      }
      if (evalErrorObservacion) evalErrorObservacion.style.display = 'none';
      if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'none';
    } else if (item.condicion === 'Aprobado') {
      if (evalAuditStatusBox) {
        evalAuditStatusBox.style.display = 'block';
        evalAuditStatusBox.className = 'eval-audit-box approved';
        const now = Date.now();
        const hasTimer = item.decisionTimestamp && (now - item.decisionTimestamp < CINCO_MINUTOS_MS);
        evalAuditStatusBox.innerHTML = `
          <div class="eval-audit-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Solicitud Aprobada</span>
          </div>
          <div>Resuelto por: <strong>${item.aprobador || 'RRAA - Lic. Carlos Silva'}</strong></div>
          <div style="margin-top: 4px; font-size: 12px; color: #14532D;">Observación: ${item.observacion || 'Regularización procedente según validación biométrica'}</div>
          ${hasTimer ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(22, 101, 52, 0.3); display: flex; justify-content: flex-end;">
              <button type="button" class="btn-rectify-countdown" id="btnModalRectify" style="padding: 6px 12px; font-size: 12px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                <span>Rectificar Decisión (Deshacer)</span>
              </button>
            </div>
          ` : ''}
        `;
        const btnModalRectify = document.getElementById('btnModalRectify');
        if (btnModalRectify) {
          btnModalRectify.addEventListener('click', () => {
            cerrarModalEvaluacion();
            rectificarDecision(item.ticket);
          });
        }
      }
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'none';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'none';
    } else if (item.condicion === 'Rechazado') {
      if (evalAuditStatusBox) {
        evalAuditStatusBox.style.display = 'block';
        evalAuditStatusBox.className = 'eval-audit-box rejected';
        const now = Date.now();
        const hasTimer = item.decisionTimestamp && (now - item.decisionTimestamp < CINCO_MINUTOS_MS);
        evalAuditStatusBox.innerHTML = `
          <div class="eval-audit-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            <span>Solicitud Rechazada</span>
          </div>
          <div>Resuelto por: <strong>${item.aprobador || 'RRAA - Lic. Carlos Silva'}</strong></div>
          <div style="margin-top: 4px; font-size: 12px; color: #7F1D1D;">Motivo formal de rechazo: <em>${item.observacion || 'Sustento no acreditado'}</em></div>
          ${hasTimer ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(220, 38, 38, 0.3); display: flex; justify-content: flex-end;">
              <button type="button" class="btn-rectify-countdown" id="btnModalRectifyRej" style="padding: 6px 12px; font-size: 12px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                <span>Rectificar Decisión (Deshacer)</span>
              </button>
            </div>
          ` : ''}
        `;
        const btnModalRectifyRej = document.getElementById('btnModalRectifyRej');
        if (btnModalRectifyRej) {
          btnModalRectifyRej.addEventListener('click', () => {
            cerrarModalEvaluacion();
            rectificarDecision(item.ticket);
          });
        }
      }
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'none';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'none';
    }

    modalEvaluacionBackdrop.classList.add('active');
  }

  function cerrarModalEvaluacion() {
    if (modalEvaluacionBackdrop) modalEvaluacionBackdrop.classList.remove('active');
    currentEvaluatingTicket = null;
  }

  if (btnCloseModalEvaluacion) btnCloseModalEvaluacion.addEventListener('click', cerrarModalEvaluacion);
  if (btnCerrarModalEvaluacion) btnCerrarModalEvaluacion.addEventListener('click', cerrarModalEvaluacion);

  if (btnDescargarSustentoDoc) {
    btnDescargarSustentoDoc.addEventListener('click', () => {
      const filename = evalFileName ? evalFileName.textContent : 'sustento.pdf';
      showToast(`Descargando archivo adjunto: ${filename}`);
    });
  }

  // Aprobación desde el Modal de Evaluación
  if (btnModalEvalAprobar) {
    btnModalEvalAprobar.addEventListener('click', () => {
      if (!currentEvaluatingTicket) return;
      const obs = evalTxtObservacion ? evalTxtObservacion.value.trim() : '';
      const list = getSolicitudes();
      const now = Date.now();
      const item = list.find(s => s.ticket === currentEvaluatingTicket);
      if (item) {
        item.condicion = 'Aprobado';
        item.observacion = obs || 'Regularización procedente según validación biométrica';
        item.aprobador = 'RRAA - Lic. Carlos Silva';
        item.decisionTimestamp = now;
      }
      saveSolicitudes(list);
      cerrarModalEvaluacion();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud #${currentEvaluatingTicket} aprobada con éxito. Puedes rectificar durante 5 minutos.`);
    });
  }

  // Rechazo desde el Modal de Evaluación
  if (btnModalEvalRechazar) {
    btnModalEvalRechazar.addEventListener('click', () => {
      if (!currentEvaluatingTicket) return;
      const motivo = evalTxtObservacion ? evalTxtObservacion.value.trim() : '';
      if (!motivo) {
        if (evalTxtObservacion) evalTxtObservacion.classList.add('has-error');
        if (evalErrorObservacion) evalErrorObservacion.style.display = 'block';
        if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'inline';
        if (evalTxtObservacion) evalTxtObservacion.focus();
        return;
      }

      const list = getSolicitudes();
      const now = Date.now();
      const item = list.find(s => s.ticket === currentEvaluatingTicket);
      if (item) {
        item.condicion = 'Rechazado';
        item.observacion = motivo;
        item.aprobador = 'RRAA - Lic. Carlos Silva';
        item.decisionTimestamp = now;
      }
      saveSolicitudes(list);
      cerrarModalEvaluacion();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud #${currentEvaluatingTicket} rechazada. Motivo formal registrado.`);
    });
  }

  if (evalTxtObservacion) {
    evalTxtObservacion.addEventListener('input', () => {
      if (evalTxtObservacion.value.trim()) {
        evalTxtObservacion.classList.remove('has-error');
        if (evalErrorObservacion) evalErrorObservacion.style.display = 'none';
        if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'none';
      }
    });
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
      const detailTarget = document.getElementById('rejectionDetailText') || rejectionInfoText;
      if (tickets.length === 1) {
        const item = getSolicitudes().find(s => s.ticket === tickets[0]);
        detailTarget.innerHTML = `Está a punto de rechazar la solicitud del <strong>Ticket #${tickets[0]}</strong> (${item ? item.curso : ''}). Este proceso requiere sustento formal.`;
      } else {
        detailTarget.innerHTML = `Está a punto de rechazar <strong>${tickets.length} solicitudes</strong> en bloque. Este motivo se aplicará a todas las solicitudes seleccionadas.`;
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
      const form = document.getElementById('asistenciaFiltersForm');
      if (form) {
        form.querySelectorAll('.custom-select-container').forEach(c => {
          const defVal = 'todos';
          const hidden = c.querySelector('input[type="hidden"]');
          const label = c.querySelector('.custom-select-label');
          const options = c.querySelectorAll('.custom-option');

          c.setAttribute('data-current-value', defVal);
          if (hidden) hidden.value = defVal;

          options.forEach(o => {
            if (o.getAttribute('data-value') === defVal) {
              o.classList.add('selected');
              if (label) label.textContent = o.querySelector('span') ? o.querySelector('span').textContent.trim() : o.textContent.trim();
            } else {
              o.classList.remove('selected');
            }
          });
        });
      }
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
      link.setAttribute("download", `Reporte_Regularizacion_Asistencia_${new Date().toISOString().slice(0, 10)}.csv`);
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
      link.setAttribute("download", `Planilla_Manual_Consolidada_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // ==========================================================================
  // CUSTOM SELECTS Y DATEPICKERS (REPLICADOS DE DOCENTE/LISTADO-ALUMNO.HTML)
  // ==========================================================================
  function initCustomSelects() {
    const containers = document.querySelectorAll('.custom-select-container');

    containers.forEach(container => {
      const trigger = container.querySelector('.custom-select-trigger');
      const menu = container.querySelector('.custom-dropdown-menu');
      const label = container.querySelector('.custom-select-label');
      const hiddenInput = container.querySelector('input[type="hidden"]');
      const options = container.querySelectorAll('.custom-option');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = container.classList.contains('is-open');

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

          if (hiddenInput) {
            hiddenInput.value = val;
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
          }

          container.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');

          if (container.closest('#panelSolicitudes')) {
            renderSolicitudesTable();
          } else if (container.closest('#panelReportes')) {
            renderReportesTable();
          }
        });
      });
    });
  }

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function initDatePicker(containerId, inputId, defaultDateStr) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    const popup = container ? container.querySelector('.custom-calendar-popup') : null;
    const trigger = container ? container.querySelector('.custom-date-trigger') : null;

    if (!container || !input || !popup || !trigger) return;

    let parts = defaultDateStr.split('/');
    let curDay = parseInt(parts[0], 10) || 1;
    let curMonth = (parseInt(parts[1], 10) || 10) - 1;
    let curYear = parseInt(parts[2], 10) || 2025;

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
        if (window.innerHeight - triggerRect.bottom < 260 && triggerRect.top > 260) {
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
    document.querySelectorAll('.custom-select-container').forEach(c => {
      c.classList.remove('is-open');
      const t = c.querySelector('.custom-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.custom-date-container').forEach(c => {
      c.classList.remove('is-open');
    });
  }

  document.addEventListener('click', () => {
    closeAllCustomDropdowns();
  });


  initCustomSelects();
  initDatePicker('dateContainerCorteInicio', 'cronoFechaCorteInicio', '12/09/2025');
  initDatePicker('dateContainerCorteFin', 'cronoFechaCorteFin', '11/10/2025');
  initDatePicker('dateContainerFechaLimite', 'cronoFechaLimite', '15/10/2025');

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
