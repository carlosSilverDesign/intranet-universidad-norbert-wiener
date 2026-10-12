/**
 * ==========================================================================
 * LÓGICA INTERACTIVA: ASISTENCIA DOCENTE Y REGULARIZACIÓN
 * Universidad Norbert Wiener - Portal Docente
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DATA INICIAL DE ASISTENCIA (Basada en Captura de Referencia)
  // ==========================================
  const asistenciaData = [
    {
      id: 1,
      fecha: '06/01/2026 Martes',
      fechaIso: '2026-01-06',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '18:30',
      horarioFin: '19:15',
      registroInicio: '18:22',
      registroFin: '19:15',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 2,
      fecha: '06/01/2026 Martes',
      fechaIso: '2026-01-06',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '19:15',
      horarioFin: '20:00',
      registroInicio: '19:15',
      registroFin: '20:00',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 3,
      fecha: '06/01/2026 Martes',
      fechaIso: '2026-01-06',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '20:00',
      horarioFin: '20:45',
      registroInicio: '20:00',
      registroFin: '20:45',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 4,
      fecha: '06/01/2026 Martes',
      fechaIso: '2026-01-06',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '20:45',
      horarioFin: '21:30',
      registroInicio: '20:45',
      registroFin: '21:30',
      tarde: "1'",
      estado: 'Tardanza', // Hora de entrada posterior a la programada
      observacion: 'Portal no carga',
      solicitudId: null
    },
    {
      id: 5,
      fecha: '13/01/2026 Martes',
      fechaIso: '2026-01-13',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '18:30',
      horarioFin: '19:15',
      registroInicio: '18:15',
      registroFin: '00:00',
      tarde: '—',
      estado: 'Observado', // Sin Marcación de Salida
      observacion: '—',
      solicitudId: null
    },
    {
      id: 6,
      fecha: '13/01/2026 Martes',
      fechaIso: '2026-01-13',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '19:15',
      horarioFin: '20:00',
      registroInicio: '00:00',
      registroFin: '00:00',
      tarde: '—',
      estado: 'Inasistencia', // Sin marcación Registro
      observacion: '—',
      solicitudId: null
    },
    {
      id: 7,
      fecha: '13/01/2026 Martes',
      fechaIso: '2026-01-13',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '20:00',
      horarioFin: '20:45',
      registroInicio: '20:00',
      registroFin: '20:45',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 8,
      fecha: '13/01/2026 Martes',
      fechaIso: '2026-01-13',
      area: 'P.E. INVESTIGACIÓN',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horarioInicio: '20:45',
      horarioFin: '21:30',
      registroInicio: '20:45',
      registroFin: '21:30',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 9,
      fecha: '28/03/2026 Sábado',
      fechaIso: '2026-03-28',
      area: 'Ing. Sist. e Inf.',
      curso: 'Introducción A La Ingeniería - IS6011',
      periodo: '2026-I',
      seccion: 'IS1M7',
      sesion: 'Prac.',
      horarioInicio: '07:00',
      horarioFin: '07:45',
      registroInicio: '06:58',
      registroFin: '07:45',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 10,
      fecha: '28/03/2026 Sábado',
      fechaIso: '2026-03-28',
      area: 'Ing. Sist. e Inf.',
      curso: 'Introducción A La Ingeniería - IS6011',
      periodo: '2026-I',
      seccion: 'IS1M7',
      sesion: 'Prac.',
      horarioInicio: '07:45',
      horarioFin: '08:30',
      registroInicio: '07:45',
      registroFin: '08:30',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 11,
      fecha: '02/04/2026 Jueves',
      fechaIso: '2026-04-02',
      area: 'NUTRICION. Y DIET.',
      curso: 'Prácticas En Nutrición I - ND4012',
      periodo: '2026-I',
      seccion: 'ND1M1',
      sesion: 'Prac. - A1',
      horarioInicio: '12:15',
      horarioFin: '13:00',
      registroInicio: '12:14',
      registroFin: '00:00',
      tarde: '—',
      estado: 'Observado',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 12,
      fecha: '02/04/2026 Jueves',
      fechaIso: '2026-04-02',
      area: 'NUTRICION. Y DIET.',
      curso: 'Prácticas En Nutrición I - ND4012',
      periodo: '2026-I',
      seccion: 'ND1M1',
      sesion: 'Prac. - A1',
      horarioInicio: '13:00',
      horarioFin: '13:45',
      registroInicio: '00:00',
      registroFin: '00:00',
      tarde: '—',
      estado: 'Inasistencia',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 13,
      fecha: '02/04/2026 Jueves',
      fechaIso: '2026-04-02',
      area: 'NUTRICION. Y DIET.',
      curso: 'Nutrición Y Dietoterapia Del Niño Y Del Adolescente - ND4054',
      periodo: '2026-I',
      seccion: 'ND5N2',
      sesion: 'Prac. - 21',
      horarioInicio: '19:45',
      horarioFin: '20:30',
      registroInicio: '19:55',
      registroFin: '20:30',
      tarde: "10'",
      estado: 'Tardanza',
      observacion: '—',
      solicitudId: null
    },
    {
      id: 14,
      fecha: '03/04/2026 Viernes',
      fechaIso: '2026-04-03',
      area: 'NUTRICION. Y DIET.',
      curso: 'Prácticas En Nutrición Iii - ND4035',
      periodo: '2026-I',
      seccion: 'ND3M1',
      sesion: 'Prac. - A1',
      horarioInicio: '07:00',
      horarioFin: '07:45',
      registroInicio: '06:58',
      registroFin: '07:45',
      tarde: '—',
      estado: 'Asistió',
      observacion: '—',
      solicitudId: null
    }
  ];

  // ==========================================
  // 2. REPOSITORIO DE SOLICITUDES DE REGULARIZACIÓN
  // ==========================================
  // Estados válidos:
  // - "Solicitado – Proceso de Validación"
  // - "Rechazado (No Procede)"
  // - "Aceptado (Procede)"
  let solicitudesList = [
    {
      solicitudId: 'SOL-2026-001',
      asistenciaId: 5,
      fechaSolicitud: '14/01/2026 09:20',
      fechaSesion: '13/01/2026 Martes',
      curso: 'Validación De Instrumentos De Investigación - PEIC004',
      periodo: '2025-III',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      horaInicioProg: '18:30',
      horaFinProg: '19:15',
      horaInicioReg: '18:15',
      horaFinReg: '00:00',
      tipo: 'Descanso Médico',
      fechaInicioDM: '2026-01-13',
      fechaFinDM: '2026-01-14',
      jefeInmediato: 'Lic. Denssy López - Coordinadora Académica',
      tipoCentroSalud: 'Essalud',
      nombreArchivo: 'CITT_EsSalud_Ene2026_JonahAsensio.pdf',
      estado: 'Solicitado – Proceso de Validación',
      motivoRechazo: ''
    }
  ];

  // Enlazar la solicitud inicial con la fila 5
  const filaInicial = asistenciaData.find(d => d.id === 5);
  if (filaInicial) {
    filaInicial.solicitudId = 'SOL-2026-001';
  }

  // ==========================================
  // 3. REFERENCIAS AL DOM
  // ==========================================
  const tableBody = document.getElementById('asistenciaTableBody');
  const counterText = document.getElementById('asistenciaCounterText');
  const pendingRequestsCountBadge = document.getElementById('pendingRequestsCount');
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // Filtros
  const filtroPersonal = document.getElementById('filtroPersonal');
  const filtroFechaDesde = document.getElementById('filtroFechaDesde');
  const filtroFechaHasta = document.getElementById('filtroFechaHasta');
  const btnBuscarAsistencia = document.getElementById('btnBuscarAsistencia');
  const btnExportarExcel = document.getElementById('btnExportarExcel');
  const filterPillBtns = document.querySelectorAll('.pill-filter-btn');

  // Modales
  const modalRegularizacion = document.getElementById('modalRegularizacion');
  const modalVistaSolicitud = document.getElementById('modalVistaSolicitud');
  const modalHistorial = document.getElementById('modalHistorialSolicitudes');
  const modalConfirmacionRegularizacion = document.getElementById('modalConfirmacionRegularizacion');

  // Botones de modales
  const btnCloseModalReg = document.getElementById('btnCloseModalReg');
  const btnCancelarReg = document.getElementById('btnCancelarReg');
  const btnGuardarRegularizacion = document.getElementById('btnGuardarRegularizacion');

  const btnCancelarConfirmacion = document.getElementById('btnCancelarConfirmacion');
  const btnConformeConfirmacion = document.getElementById('btnConformeConfirmacion');
  let pendingSolicitudData = null;

  const btnCloseModalVista = document.getElementById('btnCloseModalVista');
  const btnAceptarVista = document.getElementById('btnAceptarVista');

  const btnOpenHistorial = document.getElementById('btnOpenHistorial');
  const btnCloseModalHistorial = document.getElementById('btnCloseModalHistorial');
  const btnAceptarHistorial = document.getElementById('btnAceptarHistorial');

  // Formulario Regularización
  const formRegularizacion = document.getElementById('formRegularizacion');
  const regSessionSummaryBox = document.getElementById('regSessionSummaryBox');
  const radioDescanso = document.getElementById('typeDescanso');
  const radioAcademico = document.getElementById('typeAcademico');
  const cardDescanso = document.getElementById('cardDescanso');
  const cardAcademico = document.getElementById('cardAcademico');
  const formDescansoContainer = document.getElementById('formDescansoContainer');
  const formAcademicoContainer = document.getElementById('formAcademicoContainer');

  // Campos Descanso Médico
  const regFechaInicioDM = document.getElementById('regFechaInicioDM');
  const regFechaFinDM = document.getElementById('regFechaFinDM');
  const regJefeInmediato = document.getElementById('regJefeInmediato');
  const radioSaludEssalud = document.getElementById('saludEssalud');
  const radioSaludPrivado = document.getElementById('saludPrivado');
  const fileDescansoInput = document.getElementById('fileDescansoInput');
  const dropzoneDescanso = document.getElementById('dropzoneDescanso');
  const errorMsgDescanso = document.getElementById('errorMsgDescanso');
  const filePillDescanso = document.getElementById('filePillDescanso');
  const fileNameDescanso = document.getElementById('fileNameDescanso');
  const btnRemoveFileDescanso = document.getElementById('btnRemoveFileDescanso');

  // Campos Motivo Académico
  const regMotivoAcademicoTexto = document.getElementById('regMotivoAcademicoTexto');
  const fileAcademicoInput = document.getElementById('fileAcademicoInput');
  const dropzoneAcademico = document.getElementById('dropzoneAcademico');
  const errorMsgAcademico = document.getElementById('errorMsgAcademico');
  const filePillAcademico = document.getElementById('filePillAcademico');
  const fileNameAcademico = document.getElementById('fileNameAcademico');
  const btnRemoveFileAcademico = document.getElementById('btnRemoveFileAcademico');

  // Variables de sesión en curso
  let currentSessionForRegularizacion = null;
  let attachedFileDescanso = null;
  let attachedFileAcademico = null;
  let currentActivePillFilter = 'todos';

  // ==========================================
  // 4. RENDERIZAR TABLA DE ASISTENCIA
  // ==========================================
  function renderTable(filterEstado = 'todos') {
    if (!tableBody) return;

    let filtered = asistenciaData;

    // Filtrar por rango de fechas Desde - Hasta si se ingresaron
    const fDesde = filtroFechaDesde ? filtroFechaDesde.value : '';
    const fHasta = filtroFechaHasta ? filtroFechaHasta.value : '';
    if (fDesde && fHasta) {
      filtered = filtered.filter(item => {
        if (!item.fechaIso) return true;
        return item.fechaIso >= fDesde && item.fechaIso <= fHasta;
      });
    }

    if (filterEstado !== 'todos') {
      filtered = filtered.filter(item => item.estado.toLowerCase() === filterEstado.toLowerCase());
    }

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="14" style="padding: 32px; text-align: center; color: #64748B;">
            No se encontraron registros de asistencia para los criterios seleccionados.
          </td>
        </tr>
      `;
      if (counterText) counterText.innerHTML = `Mostrando <strong>0</strong> de ${asistenciaData.length} entradas`;
      return;
    }

    filtered.forEach((row, index) => {
      const tr = document.createElement('tr');

      // Columna TARDA
      const tardeVal = (row.tarde && row.tarde !== '—') 
        ? `<span class="td-tarda-val">${row.tarde}</span>` 
        : `<span>—</span>`;

      // Columna REGISTRO horas
      const regIniClass = (row.registroInicio === '00:00') ? 'is-zero' : '';
      const regFinClass = (row.registroFin === '00:00') ? 'is-zero' : '';

      // Columna ESTADO Badge
      let badgeClass = 'estado-asistio';
      if (row.estado === 'Observado') badgeClass = 'estado-observado';
      else if (row.estado === 'Inasistencia') badgeClass = 'estado-inasistencia';
      else if (row.estado === 'Tardanza') badgeClass = 'estado-tardanza';

      const estadoBadge = `<span class="badge-estado ${badgeClass}">${row.estado}</span>`;

      // Columna SOLICITUD
      // Casos:
      // Si ya tiene solicitud registrada -> botón con badge de estado
      // Si estado es Observado, Inasistencia o Tardanza y no tiene solicitud -> botón 'Ingresa'
      // Si estado es Asistió -> '-'
      let solicitudHtml = `<span class="text-no-solicitud">—</span>`;

      if (row.solicitudId) {
        const sol = solicitudesList.find(s => s.solicitudId === row.solicitudId);
        let solBadgeClass = 'status-solicitado';
        let solLabel = 'Solicitado';

        if (sol) {
          if (sol.estado.includes('Aceptado')) {
            solBadgeClass = 'status-aceptado';
            solLabel = 'Aceptado';
          } else if (sol.estado.includes('Rechazado')) {
            solBadgeClass = 'status-rechazado';
            solLabel = 'Rechazado';
          }
        }

        solicitudHtml = `
          <button type="button" class="btn-ver-solicitud-badge ${solBadgeClass}" data-sol-id="${row.solicitudId}" title="Ver detalle de la solicitud">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <span>${solLabel}</span>
          </button>
        `;
      } else if (row.estado === 'Observado' || row.estado === 'Inasistencia' || row.estado === 'Tardanza') {
        solicitudHtml = `
          <button type="button" class="btn-solicitud-ingresa" data-row-id="${row.id}">
            <span>Ingresa</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        `;
      }

      tr.innerHTML = `
        <td class="td-num">${row.id}</td>
        <td class="td-fecha">${row.fecha}</td>
        <td class="td-area">${row.area}</td>
        <td class="td-curso">${row.curso}</td>
        <td class="td-periodo">${row.periodo}</td>
        <td class="td-seccion">${row.seccion}</td>
        <td class="td-sesion">${row.sesion}</td>
        <td class="td-time-prog">${row.horarioInicio}</td>
        <td class="td-time-prog">${row.horarioFin}</td>
        <td class="td-time-reg ${regIniClass}">${row.registroInicio}</td>
        <td class="td-time-reg ${regFinClass}">${row.registroFin}</td>
        <td>${tardeVal}</td>
        <td>${estadoBadge}</td>
        <td>${solicitudHtml}</td>
        <td class="td-obs">${row.observacion}</td>
      `;

      tableBody.appendChild(tr);
    });

    if (counterText) {
      counterText.innerHTML = `Mostrando <strong>1 - ${filtered.length}</strong> de ${asistenciaData.length} entradas`;
    }

    updatePillCounters();
    updatePendingBadge();
    attachTableActionEvents();
  }

  // ==========================================
  // 5. EVENTOS EN LA TABLA (Ingresa & Ver Solicitud)
  // ==========================================
  function attachTableActionEvents() {
    // Botones "Ingresa"
    const ingresaButtons = document.querySelectorAll('.btn-solicitud-ingresa');
    ingresaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rowId = parseInt(btn.getAttribute('data-row-id'), 10);
        openRegularizacionModal(rowId);
      });
    });

    // Botones "Ver Solicitud"
    const verSolBadges = document.querySelectorAll('.btn-ver-solicitud-badge');
    verSolBadges.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const solId = btn.getAttribute('data-sol-id');
        openVistaSolicitudModal(solId);
      });
    });
  }

  // ==========================================
  // 6. CONTADORES Y PILLS DE ESTADOS
  // ==========================================
  function updatePillCounters() {
    const counts = {
      todos: asistenciaData.length,
      observado: asistenciaData.filter(d => d.estado === 'Observado').length,
      inasistencia: asistenciaData.filter(d => d.estado === 'Inasistencia').length,
      tardanza: asistenciaData.filter(d => d.estado === 'Tardanza').length,
      asistio: asistenciaData.filter(d => d.estado === 'Asistió').length
    };

    filterPillBtns.forEach(btn => {
      const type = btn.getAttribute('data-estado');
      const countTag = btn.querySelector('.count-tag');
      if (countTag && counts[type] !== undefined) {
        countTag.textContent = counts[type];
      }
    });
  }

  function updatePendingBadge() {
    if (pendingRequestsCountBadge) {
      pendingRequestsCountBadge.textContent = solicitudesList.length;
    }
  }

  // Evento clic en las pills de filtrado rápido
  filterPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActivePillFilter = btn.getAttribute('data-estado');
      renderTable(currentActivePillFilter);
    });
  });

  // ==========================================
  // 7. MODAL: REGULARIZACIÓN DE ASISTENCIA
  // ==========================================
  function openRegularizacionModal(rowId) {
    const session = asistenciaData.find(d => d.id === rowId);
    if (!session) return;

    currentSessionForRegularizacion = session;

    // Reset formulario
    resetFormularioRegularizacion();

    // Inyectar datos en la tarjeta resumen de sesión
    let badgeClass = 'estado-asistio';
    if (session.estado === 'Observado') badgeClass = 'estado-observado';
    else if (session.estado === 'Inasistencia') badgeClass = 'estado-inasistencia';
    else if (session.estado === 'Tardanza') badgeClass = 'estado-tardanza';

    if (regSessionSummaryBox) {
      regSessionSummaryBox.innerHTML = `
        <div class="session-summary-header">
          <span class="session-summary-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A99D" stroke-width="2.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Detalle de la Marcación a Regularizar
          </span>
          <span class="badge-estado ${badgeClass}">${session.estado}</span>
        </div>
        <div class="session-summary-grid">
          <div class="session-info-item">
            <span class="info-label">Fecha y Día:</span>
            <span class="info-val">${session.fecha}</span>
          </div>
          <div class="session-info-item">
            <span class="info-label">Curso:</span>
            <span class="info-val">${session.curso}</span>
          </div>
          <div class="session-info-item">
            <span class="info-label">Periodo / Sección:</span>
            <span class="info-val">${session.periodo} - Sección ${session.seccion} (${session.sesion})</span>
          </div>
          <div class="session-info-item">
            <span class="info-label">Horario Programado:</span>
            <span class="info-val">${session.horarioInicio} - ${session.horarioFin}</span>
          </div>
          <div class="session-info-item">
            <span class="info-label">Marcación Registrada:</span>
            <span class="info-val">${session.registroInicio} - ${session.registroFin}</span>
          </div>
          <div class="session-info-item">
            <span class="info-label">Tardanza:</span>
            <span class="info-val">${session.tarde}</span>
          </div>
        </div>
      `;
    }

    // Fecha por defecto para Descanso Médico
    if (regFechaInicioDM) regFechaInicioDM.value = session.fechaIso;
    if (regFechaFinDM) regFechaFinDM.value = session.fechaIso;

    // Seleccionar Descanso Médico por defecto
    selectRegularizacionType('descanso');

    // Mostrar modal
    if (modalRegularizacion) modalRegularizacion.classList.add('active');
  }

  function closeRegularizacionModal() {
    if (modalRegularizacion) modalRegularizacion.classList.remove('active');
    currentSessionForRegularizacion = null;
  }

  if (btnCloseModalReg) btnCloseModalReg.addEventListener('click', closeRegularizacionModal);
  if (btnCancelarReg) btnCancelarReg.addEventListener('click', closeRegularizacionModal);

  function clearDropzoneErrors() {
    if (dropzoneDescanso) dropzoneDescanso.classList.remove('has-error');
    if (errorMsgDescanso) errorMsgDescanso.style.display = 'none';
    if (dropzoneAcademico) dropzoneAcademico.classList.remove('has-error');
    if (errorMsgAcademico) errorMsgAcademico.style.display = 'none';
  }

  // Selector Tipo de Regularización (Descanso Médico vs Motivo Académico)
  function selectRegularizacionType(type) {
    clearDropzoneErrors();
    if (type === 'descanso') {
      if (radioDescanso) radioDescanso.checked = true;
      if (cardDescanso) cardDescanso.classList.add('selected');
      if (cardAcademico) cardAcademico.classList.remove('selected');

      if (formDescansoContainer) formDescansoContainer.style.display = 'flex';
      if (formAcademicoContainer) formAcademicoContainer.style.display = 'none';
    } else {
      if (radioAcademico) radioAcademico.checked = true;
      if (cardAcademico) cardAcademico.classList.add('selected');
      if (cardDescanso) cardDescanso.classList.remove('selected');

      if (formDescansoContainer) formDescansoContainer.style.display = 'none';
      if (formAcademicoContainer) formAcademicoContainer.style.display = 'flex';
    }
  }

  if (cardDescanso) {
    cardDescanso.addEventListener('click', () => selectRegularizacionType('descanso'));
  }

  if (cardAcademico) {
    cardAcademico.addEventListener('click', () => selectRegularizacionType('academico'));
  }

  // Radios Centro de Salud
  const healthRadios = document.querySelectorAll('.health-radio-item');
  healthRadios.forEach(item => {
    item.addEventListener('click', () => {
      healthRadios.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      const radio = item.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Manejador Dropzone Descanso Médico
  if (dropzoneDescanso && fileDescansoInput) {
    dropzoneDescanso.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-attached-file')) return;
      fileDescansoInput.click();
    });

    fileDescansoInput.addEventListener('change', (e) => {
      if (fileDescansoInput.files && fileDescansoInput.files[0]) {
        handleFileSelectedDescanso(fileDescansoInput.files[0]);
      }
    });

    dropzoneDescanso.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneDescanso.classList.add('dragover');
    });

    dropzoneDescanso.addEventListener('dragleave', () => {
      dropzoneDescanso.classList.remove('dragover');
    });

    dropzoneDescanso.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneDescanso.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelectedDescanso(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFileSelectedDescanso(file) {
    attachedFileDescanso = file;
    if (dropzoneDescanso) dropzoneDescanso.classList.remove('has-error');
    if (errorMsgDescanso) errorMsgDescanso.style.display = 'none';
    const dropzoneContent = dropzoneDescanso.querySelector('.dropzone-inner-content');
    if (dropzoneContent) dropzoneContent.style.display = 'none';
    if (filePillDescanso) {
      filePillDescanso.style.display = 'flex';
      if (fileNameDescanso) fileNameDescanso.textContent = file.name;
    }
  }

  if (btnRemoveFileDescanso) {
    btnRemoveFileDescanso.addEventListener('click', (e) => {
      e.stopPropagation();
      attachedFileDescanso = null;
      if (fileDescansoInput) fileDescansoInput.value = '';
      const dropzoneContent = dropzoneDescanso.querySelector('.dropzone-inner-content');
      if (dropzoneContent) dropzoneContent.style.display = 'flex';
      if (filePillDescanso) filePillDescanso.style.display = 'none';
    });
  }

  // Manejador Dropzone Motivo Académico
  if (dropzoneAcademico && fileAcademicoInput) {
    dropzoneAcademico.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-attached-file')) return;
      fileAcademicoInput.click();
    });

    fileAcademicoInput.addEventListener('change', (e) => {
      if (fileAcademicoInput.files && fileAcademicoInput.files[0]) {
        handleFileSelectedAcademico(fileAcademicoInput.files[0]);
      }
    });

    dropzoneAcademico.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneAcademico.classList.add('dragover');
    });

    dropzoneAcademico.addEventListener('dragleave', () => {
      dropzoneAcademico.classList.remove('dragover');
    });

    dropzoneAcademico.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneAcademico.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelectedAcademico(e.dataTransfer.files[0]);
      }
    });
  }

  function handleFileSelectedAcademico(file) {
    attachedFileAcademico = file;
    if (dropzoneAcademico) dropzoneAcademico.classList.remove('has-error');
    if (errorMsgAcademico) errorMsgAcademico.style.display = 'none';
    const dropzoneContent = dropzoneAcademico.querySelector('.dropzone-inner-content');
    if (dropzoneContent) dropzoneContent.style.display = 'none';
    if (filePillAcademico) {
      filePillAcademico.style.display = 'flex';
      if (fileNameAcademico) fileNameAcademico.textContent = file.name;
    }
  }

  if (btnRemoveFileAcademico) {
    btnRemoveFileAcademico.addEventListener('click', (e) => {
      e.stopPropagation();
      attachedFileAcademico = null;
      if (fileAcademicoInput) fileAcademicoInput.value = '';
      const dropzoneContent = dropzoneAcademico.querySelector('.dropzone-inner-content');
      if (dropzoneContent) dropzoneContent.style.display = 'flex';
      if (filePillAcademico) filePillAcademico.style.display = 'none';
    });
  }

  function resetFormularioRegularizacion() {
    clearDropzoneErrors();
    attachedFileDescanso = null;
    attachedFileAcademico = null;
    if (fileDescansoInput) fileDescansoInput.value = '';
    if (fileAcademicoInput) fileAcademicoInput.value = '';

    const dropzoneContentD = dropzoneDescanso ? dropzoneDescanso.querySelector('.dropzone-inner-content') : null;
    if (dropzoneContentD) dropzoneContentD.style.display = 'flex';
    if (filePillDescanso) filePillDescanso.style.display = 'none';

    const dropzoneContentA = dropzoneAcademico ? dropzoneAcademico.querySelector('.dropzone-inner-content') : null;
    if (dropzoneContentA) dropzoneContentA.style.display = 'flex';
    if (filePillAcademico) filePillAcademico.style.display = 'none';

    if (regMotivoAcademicoTexto) regMotivoAcademicoTexto.value = '';
  }

  // ENVIAR SOLICITUD DE REGULARIZACIÓN (ABRE MODAL DE CONFIRMACIÓN)
  if (btnGuardarRegularizacion) {
    btnGuardarRegularizacion.addEventListener('click', () => {
      if (!currentSessionForRegularizacion) return;

      const isDescanso = radioDescanso && radioDescanso.checked;

      if (isDescanso) {
        // Validaciones Descanso Médico
        const fInicio = regFechaInicioDM ? regFechaInicioDM.value : '';
        const fFin = regFechaFinDM ? regFechaFinDM.value : '';
        const jefe = regJefeInmediato ? regJefeInmediato.value : '';
        const tipoSalud = radioSaludPrivado && radioSaludPrivado.checked ? 'Privado' : 'Essalud';

        if (!fInicio || !fFin) {
          showToast('Por favor, ingrese las fechas de inicio y fin del descanso médico.');
          return;
        }

        if (!attachedFileDescanso) {
          if (dropzoneDescanso) dropzoneDescanso.classList.add('has-error');
          if (errorMsgDescanso) errorMsgDescanso.style.display = 'flex';
          showToast('Debe adjuntar el sustento correspondiente.');
          return;
        }

        pendingSolicitudData = {
          tipo: 'Descanso Médico',
          fechaInicioDM: fInicio,
          fechaFinDM: fFin,
          jefeInmediato: jefe,
          tipoCentroSalud: tipoSalud,
          nombreArchivo: attachedFileDescanso.name || 'Certificado_Descanso_Medico.pdf'
        };

      } else {
        // Validaciones Motivo Académico
        const motivoTexto = regMotivoAcademicoTexto ? regMotivoAcademicoTexto.value.trim() : '';

        if (!motivoTexto) {
          showToast('Por favor, describa el motivo académico de la regularización.');
          return;
        }

        if (!attachedFileAcademico) {
          if (dropzoneAcademico) dropzoneAcademico.classList.add('has-error');
          if (errorMsgAcademico) errorMsgAcademico.style.display = 'flex';
          showToast('Debe adjuntar el sustento correspondiente.');
          return;
        }

        pendingSolicitudData = {
          tipo: 'Motivo Académico',
          motivoTexto: motivoTexto,
          nombreArchivo: attachedFileAcademico.name || 'Sustento_Academico.pdf'
        };
      }

      // Abrir Modal de Confirmación
      if (modalConfirmacionRegularizacion) {
        modalConfirmacionRegularizacion.classList.add('active');
      }
    });
  }

  // ACCIÓN CANCELAR EN EL MODAL DE CONFIRMACIÓN
  if (btnCancelarConfirmacion) {
    btnCancelarConfirmacion.addEventListener('click', () => {
      if (modalConfirmacionRegularizacion) {
        modalConfirmacionRegularizacion.classList.remove('active');
      }
    });
  }

  // ACCIÓN CONFORME EN EL MODAL DE CONFIRMACIÓN (ENVÍO DEFINITIVO)
  if (btnConformeConfirmacion) {
    btnConformeConfirmacion.addEventListener('click', () => {
      if (!currentSessionForRegularizacion || !pendingSolicitudData) return;

      const newSolId = `SOL-2026-${String(solicitudesList.length + 1).padStart(3, '0')}`;
      const newSolicitud = {
        solicitudId: newSolId,
        asistenciaId: currentSessionForRegularizacion.id,
        fechaSolicitud: getCurrentDateTimeFormatted(),
        fechaSesion: currentSessionForRegularizacion.fecha,
        curso: currentSessionForRegularizacion.curso,
        periodo: currentSessionForRegularizacion.periodo,
        seccion: currentSessionForRegularizacion.seccion,
        sesion: currentSessionForRegularizacion.sesion,
        horaInicioProg: currentSessionForRegularizacion.horarioInicio,
        horaFinProg: currentSessionForRegularizacion.horarioFin,
        horaInicioReg: currentSessionForRegularizacion.registroInicio,
        horaFinReg: currentSessionForRegularizacion.registroFin,
        estado: 'Solicitado – Proceso de Validación', // Estado automático inicial
        motivoRechazo: '',
        ...pendingSolicitudData
      };

      solicitudesList.push(newSolicitud);
      currentSessionForRegularizacion.solicitudId = newSolId;

      // Cerrar modal de confirmación y modal de formulario
      if (modalConfirmacionRegularizacion) {
        modalConfirmacionRegularizacion.classList.remove('active');
      }
      closeRegularizacionModal();

      // Actualizar contador del badge de historial si existe
      if (pendingRequestsCountBadge) {
        const pendingCount = solicitudesList.filter(s => s.estado.includes('Solicitado')).length;
        pendingRequestsCountBadge.textContent = pendingCount;
      }

      // Actualizar tabla principal con el estado actualizado
      renderTable(currentActivePillFilter);

      showToast(`Solicitud ${newSolId} enviada con éxito. Se encuentra en Proceso de Validación.`);
      pendingSolicitudData = null;
    });
  }

  // ==========================================
  // 8. MODAL: VISTA DE SOLICITUD (Campos especificados)
  // ==========================================
  // Considera exactamente los campos:
  // Fecha, Curso, Periodo, Sección, Hora Inicio Programado,
  // Hora Fin Programado, Hora Inicio Registrado, Hora Fin Registrado,
  // Estado, Archivo [Aceptar]
  function openVistaSolicitudModal(solId) {
    const solicitud = solicitudesList.find(s => s.solicitudId === solId);
    if (!solicitud) return;

    const vistaDetailsContainer = document.getElementById('vistaSolicitudDetails');
    const vistaTicketNumber = document.getElementById('vistaTicketNumber');
    const vistaEstadoBadge = document.getElementById('vistaEstadoBadge');

    if (vistaTicketNumber) vistaTicketNumber.textContent = solicitud.solicitudId;

    // Badge Estado
    let badgeClass = 'status-solicitado';
    if (solicitud.estado.includes('Aceptado')) badgeClass = 'status-aceptado';
    else if (solicitud.estado.includes('Rechazado')) badgeClass = 'status-rechazado';

    if (vistaEstadoBadge) {
      vistaEstadoBadge.className = `btn-ver-solicitud-badge ${badgeClass}`;
      vistaEstadoBadge.textContent = solicitud.estado;
    }

    if (vistaDetailsContainer) {
      vistaDetailsContainer.innerHTML = `
        <div class="detail-row-flex">
          <span class="detail-label-title">Fecha de la Sesión</span>
          <span class="detail-value-bold">${solicitud.fechaSesion}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Curso</span>
          <span class="detail-value-bold">${solicitud.curso}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Periodo</span>
          <span class="detail-value-bold">${solicitud.periodo}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Sección</span>
          <span class="detail-value-bold">${solicitud.seccion} (${solicitud.sesion})</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Hora Inicio Programado</span>
          <span class="detail-value-bold">${solicitud.horaInicioProg}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Hora Fin Programado</span>
          <span class="detail-value-bold">${solicitud.horaFinProg}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Hora Inicio Registrado</span>
          <span class="detail-value-bold">${solicitud.horaInicioReg}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Hora Fin Registrado</span>
          <span class="detail-value-bold">${solicitud.horaFinReg}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Tipo de Regularización</span>
          <span class="detail-value-bold">${solicitud.tipo}</span>
        </div>
        <div class="detail-row-flex">
          <span class="detail-label-title">Estado de la Solicitud</span>
          <span class="detail-value-bold" style="color: ${solicitud.estado.includes('Aceptado') ? '#15803D' : (solicitud.estado.includes('Rechazado') ? '#B91C1C' : '#0369A1')}">
            ${solicitud.estado}
          </span>
        </div>
        <div class="detail-row-flex" style="flex-direction: column; align-items: flex-start; gap: 8px;">
          <span class="detail-label-title">Archivo Adjunto de Sustento:</span>
          <div class="file-preview-card" style="width: 100%;">
            <div class="file-preview-left">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div>
                <div style="font-size: 13px; font-weight: 700; color: #1E293B;">${solicitud.nombreArchivo}</div>
                <div style="font-size: 11px; color: #64748B;">Documento de sustento oficial presentado por el docente</div>
              </div>
            </div>
            <button type="button" class="btn-file-download" onclick="alert('Descargando archivo: ${solicitud.nombreArchivo}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Descargar</span>
            </button>
          </div>
        </div>
      `;
    }

    if (modalVistaSolicitud) modalVistaSolicitud.classList.add('active');
  }

  function closeVistaSolicitudModal() {
    if (modalVistaSolicitud) modalVistaSolicitud.classList.remove('active');
  }

  if (btnCloseModalVista) btnCloseModalVista.addEventListener('click', closeVistaSolicitudModal);
  if (btnAceptarVista) btnAceptarVista.addEventListener('click', closeVistaSolicitudModal);

  // ==========================================
  // 9. MODAL: HISTORIAL DE SOLICITUDES
  // ==========================================
  function openHistorialModal() {
    renderHistorialTable('todas');
    if (modalHistorial) modalHistorial.classList.add('active');
  }

  function closeHistorialModal() {
    if (modalHistorial) modalHistorial.classList.remove('active');
  }

  if (btnOpenHistorial) btnOpenHistorial.addEventListener('click', openHistorialModal);
  if (btnCloseModalHistorial) btnCloseModalHistorial.addEventListener('click', closeHistorialModal);
  if (btnAceptarHistorial) btnAceptarHistorial.addEventListener('click', closeHistorialModal);

  function renderHistorialTable(filterState = 'todas') {
    const historyBody = document.getElementById('historialTableBody');
    if (!historyBody) return;

    let filtered = solicitudesList;
    if (filterState === 'solicitado') {
      filtered = solicitudesList.filter(s => s.estado.toLowerCase().includes('solicitado'));
    } else if (filterState === 'aceptado') {
      filtered = solicitudesList.filter(s => s.estado.toLowerCase().includes('aceptado'));
    } else if (filterState === 'rechazado') {
      filtered = solicitudesList.filter(s => s.estado.toLowerCase().includes('rechazado'));
    }

    historyBody.innerHTML = '';

    if (filtered.length === 0) {
      historyBody.innerHTML = `
        <tr>
          <td colspan="8" style="padding: 24px; text-align: center; color: #64748B;">
            No hay solicitudes registradas con el estado seleccionado.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(sol => {
      const tr = document.createElement('tr');

      let badgeClass = 'status-solicitado';
      let tagTexto = 'Solicitado';
      if (sol.estado.toLowerCase().includes('aceptado')) {
        badgeClass = 'status-aceptado';
        tagTexto = 'Aceptado';
      } else if (sol.estado.toLowerCase().includes('rechazado')) {
        badgeClass = 'status-rechazado';
        tagTexto = 'Rechazado';
      }

      tr.innerHTML = `
        <td class="td-sol-id" style="font-weight: 700; color: #0F848F;">${sol.solicitudId}</td>
        <td>${sol.fechaSolicitud}</td>
        <td>${sol.fechaSesion}</td>
        <td class="td-sol-curso">${sol.curso}</td>
        <td>${sol.seccion}</td>
        <td><span style="font-weight: 600;">${sol.tipo}</span></td>
        <td class="td-sol-estado" style="text-align: center;">
          <span class="btn-ver-solicitud-badge ${badgeClass}">${tagTexto}</span>
        </td>
        <td class="td-sol-action" style="text-align: center;">
          <button type="button" class="btn-action-lupa" data-open-sol-id="${sol.solicitudId}" title="Ver detalle de la solicitud" aria-label="Ver solicitud">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </td>
      `;

      historyBody.appendChild(tr);
    });

    // Eventos dentro de la tabla del historial
    const viewButtons = historyBody.querySelectorAll('[data-open-sol-id]');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-sol-id');
        openVistaSolicitudModal(id);
      });
    });
  }

  // Pestañas de filtrado en el Historial
  const historyTabs = document.querySelectorAll('.history-tab-btn');
  historyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      historyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const state = tab.getAttribute('data-state-filter');
      renderHistorialTable(state);
    });
  });

  // ==========================================
  // 10. INTERACTIVIDAD DE SELECTORES DE FECHA Y PAGINACIÓN
  // ==========================================
  const datePickerWrappers = document.querySelectorAll('.date-picker-wrapper');
  datePickerWrappers.forEach(wrapper => {
    const dateInput = wrapper.querySelector('input[type="date"]');
    if (!dateInput) return;

    wrapper.addEventListener('click', (e) => {
      if (e.target !== dateInput) {
        try {
          if (typeof dateInput.showPicker === 'function') {
            dateInput.showPicker();
          } else {
            dateInput.focus();
          }
        } catch (err) {
          dateInput.focus();
        }
      }
    });

    dateInput.addEventListener('click', () => {
      try {
        if (typeof dateInput.showPicker === 'function') {
          dateInput.showPicker();
        }
      } catch (err) {}
    });
  });

  if (filtroFechaDesde) {
    filtroFechaDesde.addEventListener('change', () => {
      renderTable(currentActivePillFilter);
    });
  }

  if (filtroFechaHasta) {
    filtroFechaHasta.addEventListener('change', () => {
      renderTable(currentActivePillFilter);
    });
  }

  // Interacción visual de botones de paginación
  const pageNumButtons = document.querySelectorAll('.page-num-item');
  pageNumButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      pageNumButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pageNum = btn.textContent.trim();
      showToast(`Mostrando registros de página ${pageNum}.`);
    });
  });

  if (btnBuscarAsistencia) {
    btnBuscarAsistencia.addEventListener('click', () => {
      showToast('Búsqueda actualizada según el rango de fechas ingresado.');
      renderTable(currentActivePillFilter);
    });
  }

  if (btnExportarExcel) {
    btnExportarExcel.addEventListener('click', () => {
      showToast('Generando archivo Excel del Reporte de Asistencia...');
    });
  }

  // ==========================================
  // 11. UTILITARIOS (Toast y Fechas)
  // ==========================================
  let toastTimer = null;
  function showToast(message) {
    if (!toastMessage) return;
    if (toastText) toastText.textContent = message;

    toastMessage.classList.add('active');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('active');
    }, 3800);
  }

  function getCurrentDateTimeFormatted() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Cerrar modales con clic en el overlay de fondo
  const allOverlays = document.querySelectorAll('.modal-overlay');
  allOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allOverlays.forEach(overlay => overlay.classList.remove('active'));
    }
  });

  // ==========================================
  // 12. INICIALIZACIÓN
  // ==========================================
  renderTable('todos');

});
