/**
 * ============================================================================
 * GESTIÓN DE ASISTENCIA Y REPROGRAMACIÓN DOCENTE - PERFIL ADMINISTRATIVO
 * Flujo cerrado unificado: RRAA, Coordinador Académico y Director de Escuela
 * Portal Administrativo - Universidad Norbert Wiener
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const SCHEMA_VERSION = 2;
  const SYSTEM_TODAY_ISO = '2026-11-11';
  const CINCO_MINUTOS_MS = 5 * 60 * 1000;

  const STORAGE_KEY_ASISTENCIA_SOLICITUDES = 'wiener_rraa_asistencia_solicitudes_v1';
  const STORAGE_KEY_CRONOGRAMAS = 'wiener_rraa_cronogramas_corte_v1';

  // ==========================================================================
  // HELPERS DE FECHA / TEXTO (SIN PARSEO UTC DE STRINGS ISO)
  // ==========================================================================
  function escapeHtml(val) {
    return String(val == null ? '' : val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatIsoToDisplay(isoStr) {
    if (!isoStr) return '-';
    const m = String(isoStr).match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(.*)$/);
    if (m) {
      const y = m[1];
      const month = String(m[2]).padStart(2, '0');
      const d = String(m[3]).padStart(2, '0');
      const rest = m[4] || '';
      return `${d}/${month}/${y}${rest}`;
    }
    return String(isoStr);
  }

  function normalizeTextKey(val) {
    return String(val || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function formatNowDisplay() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${formatIsoToDisplay(SYSTEM_TODAY_ISO)} ${hh}:${mm}`;
  }

  function addDaysDisplay(ddmmyyyy, days) {
    const m = String(ddmmyyyy || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return ddmmyyyy || '-';
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]) + days);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  // ==========================================================================
  // PERFILES / BANDEJAS DEL PORTAL ADMINISTRATIVO
  // ==========================================================================
  const ADMIN_ROLES = {
    RRAA: {
      key: 'RRAA',
      initials: 'CS',
      avatarBg: '#008F9B',
      sidebarRole: 'RRAA',
      sidebarName: 'Lic. Carlos Silva',
      sidebarTitle: 'Lic. Carlos Jesús Silva Sánchez',
      sidebarCode: 'Registros Académicos',
      bannerTitle: 'Bandeja activa: Registros Académicos (RRAA) — Tardanzas y Observados',
      approverString: 'RRAA - Lic. Carlos Silva',
      resolverLabel: 'Lic. Carlos Silva (RRAA)'
    },
    COORDINADOR: {
      key: 'COORDINADOR',
      initials: 'DL',
      avatarBg: '#6B21A8',
      sidebarRole: 'COORDINADOR',
      sidebarName: 'Lic. Denssy López',
      sidebarTitle: 'Lic. Denssy López Mendoza',
      sidebarCode: 'Coordinación Académica',
      bannerTitle: 'Bandeja activa: Coordinador Académico — Asignación de Docente (A Programar)',
      approverString: 'Coordinador - Lic. Denssy López',
      resolverLabel: 'Lic. Denssy López (Coordinador)'
    },
    DIRECTOR: {
      key: 'DIRECTOR',
      initials: 'JM',
      avatarBg: '#C2410C',
      sidebarRole: 'DIRECTOR',
      sidebarName: 'Dr. Juan Carlos Mendoza',
      sidebarTitle: 'Dr. Juan Carlos Mendoza Rojas',
      sidebarCode: 'Dirección de Escuela',
      bannerTitle: 'Bandeja activa: Director de Escuela — Inasistencias y Reprogramaciones',
      approverString: 'Director de Escuela - Dr. Juan Carlos Mendoza',
      resolverLabel: 'Dr. Juan Carlos Mendoza (Director)'
    },
    ALL: {
      key: 'ALL',
      initials: 'AD',
      avatarBg: '#334155',
      sidebarRole: 'ADMIN GLOBAL',
      sidebarName: 'Vista Consolidada',
      sidebarTitle: 'Administración Académica Global',
      sidebarCode: 'Todas las bandejas',
      bannerTitle: 'Bandeja activa: Vista Global — Todas las etapas (RRAA, Coordinador, Director e Históricos)',
      approverString: 'Administración Académica',
      resolverLabel: 'Administración Académica'
    }
  };

  const DOCENTE_CODE_CATALOG = {
    'Jonah Miguel Asensio Peña': 'DOC-1042',
    'Dayana Nicole Ventocilla Aguilar': 'DOC-1088',
    'Carlos Alberto Paredes Quispe': 'DOC-1095',
    'Mariela Sofía Roldán Torres': 'DOC-1103',
    'Fernando Morales Silva': 'DOC-1120'
  };

  let currentAdminRole = 'RRAA';

  // ==========================================================================
  // DATOS SEMILLA CANÓNICOS V2 (SINCRONIZADOS CON PORTAL DOCENTE)
  // ==========================================================================
  const SEED_SOLICITUDES_V2 = [
    {
      id: 'REG-2026-101',
      schemaVersion: SCHEMA_VERSION,
      asistenciaId: 103,
      tramite: 'RECTIFICACION',
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      solicitadoPorRol: 'Docente',
      solicitadoPorNombre: 'Jonah Miguel Asensio Peña',
      periodo: '2026-II',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      fechaOriginalIso: '2026-10-19',
      fechaOriginal: '19/10/2026',
      horarioProgInicio: '18:30',
      horarioProgFin: '19:15',
      duracionOriginalMin: 45,
      horarioRegInicio: '18:30',
      horarioRegFin: '00:00',
      estadoOriginal: 'Observado',
      tardanzaMin: '-',
      observacionOriginal: 'Sin marcación de salida',
      tipoRegularizacion: 'Descanso Médico',
      detalleSalud: 'EsSalud',
      fechaInicioDM: '2026-10-19',
      fechaFinDM: '2026-10-20',
      motivo: 'Se adjunta CITT de atención médica por indisposición repentina al cierre de sesión.',
      archivoNombre: 'citt_essalud_19102026.pdf',
      reprogTipo: null,
      reprogTipoLabel: '',
      cambioDocente: false,
      docenteReemplazoCodigo: '',
      docenteReemplazo: '',
      sedeNueva: '',
      aulaNueva: '',
      fechaNuevaIso: '',
      fechaNueva: '',
      horaInicioNueva: '',
      horaFinNueva: '',
      duracionNuevaMin: null,
      cortePlanillaOriginal: '12/10/2026 – 11/11/2026',
      cortePlanillaPago: '12/10/2026 – 11/11/2026',
      notaPlanilla: 'Dentro del corte vigente (12/10/2026 – 11/11/2026).',
      requiereCoordinador: false,
      etapaActual: 'RRAA',
      condicion: 'Solicitado',
      aprobadorAsignado: 'RRAA - Lic. Carlos Silva',
      fechaSolicitudIso: '2026-10-20',
      fechaSolicitud: '20/10/2026 09:45',
      comentarioEvaluador: '',
      motivoRechazo: '',
      fechaResolucion: '',
      resolucionPor: ''
    },
    {
      id: 'REPROG-2026-102',
      schemaVersion: SCHEMA_VERSION,
      asistenciaId: 201,
      tramite: 'REPROGRAMACION',
      docenteCodigo: 'DOC-1088',
      docente: 'Dayana Nicole Ventocilla Aguilar',
      solicitadoPorRol: 'Docente',
      solicitadoPorNombre: 'Dayana Nicole Ventocilla Aguilar',
      periodo: '2026-II',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Validación de Instrumentos de Investigación - PEIC004',
      seccion: 'ND1M1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      fechaOriginalIso: '2026-10-22',
      fechaOriginal: '22/10/2026',
      horarioProgInicio: '18:30',
      horarioProgFin: '19:15',
      duracionOriginalMin: 45,
      horarioRegInicio: '00:00',
      horarioRegFin: '00:00',
      estadoOriginal: 'Inasistencia',
      tardanzaMin: '-',
      observacionOriginal: 'Pendiente reemplazo docente',
      tipoRegularizacion: null,
      detalleSalud: '',
      motivo: 'Compromiso institucional externo de acreditación universitaria. Se requiere docente de reemplazo.',
      archivoNombre: '',
      reprogTipo: 'reemplazo',
      reprogTipoLabel: 'Reemplazo',
      cambioDocente: true,
      docenteReemplazoCodigo: '',
      docenteReemplazo: '',
      sedeNueva: 'Sede Principal - Av. Arequipa',
      aulaNueva: 'B-302',
      fechaNuevaIso: '2026-11-13',
      fechaNueva: '13/11/2026',
      horaInicioNueva: '18:30',
      horaFinNueva: '19:15',
      duracionNuevaMin: 45,
      cortePlanillaOriginal: '12/10/2026 – 11/11/2026',
      cortePlanillaPago: '12/11/2026 – 11/12/2026',
      notaPlanilla: 'Dictado programado fuera del corte cerrado el 11/11; corresponde al corte 12/11/2026 – 11/12/2026 tras el dictado efectivo.',
      requiereCoordinador: true,
      etapaActual: 'COORDINADOR',
      condicion: 'Pendiente Coordinador',
      aprobadorAsignado: 'Coordinador - Lic. Denssy López',
      fechaSolicitudIso: '2026-11-08',
      fechaSolicitud: '08/11/2026 16:20',
      comentarioEvaluador: '',
      motivoRechazo: '',
      fechaResolucion: '',
      resolucionPor: ''
    },
    {
      id: 'REPROG-2026-103',
      schemaVersion: SCHEMA_VERSION,
      asistenciaId: 107,
      tramite: 'REPROGRAMACION',
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      solicitadoPorRol: 'Docente',
      solicitadoPorNombre: 'Jonah Miguel Asensio Peña',
      periodo: '2026-II',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Gestión del Cuidado en Enfermería - EN5011',
      seccion: 'EN5T1',
      sesion: 'Teor.',
      aulaOriginal: 'A-204',
      fechaOriginalIso: '2026-11-04',
      fechaOriginal: '04/11/2026',
      horarioProgInicio: '18:30',
      horarioProgFin: '19:15',
      duracionOriginalMin: 45,
      horarioRegInicio: '00:00',
      horarioRegFin: '00:00',
      estadoOriginal: 'Inasistencia',
      tardanzaMin: '-',
      observacionOriginal: 'Permiso institucional',
      tipoRegularizacion: null,
      detalleSalud: '',
      motivo: 'Recuperación normal coordinada con la totalidad de estudiantes de la sección EN5T1.',
      archivoNombre: '',
      reprogTipo: 'recuperacion_normal',
      reprogTipoLabel: 'Recuperación normal',
      cambioDocente: false,
      docenteReemplazoCodigo: '',
      docenteReemplazo: 'Jonah Miguel Asensio Peña',
      sedeNueva: 'Sede Principal - Av. Arequipa',
      aulaNueva: 'A-204',
      fechaNuevaIso: '2026-11-14',
      fechaNueva: '14/11/2026',
      horaInicioNueva: '18:30',
      horaFinNueva: '19:15',
      duracionNuevaMin: 45,
      cortePlanillaOriginal: '12/10/2026 – 11/11/2026',
      cortePlanillaPago: '12/11/2026 – 11/12/2026',
      notaPlanilla: 'Al reprogramarse después del 11/11/2026, el pago de esta recuperación pasa al siguiente corte (12/11/2026 – 11/12/2026).',
      requiereCoordinador: false,
      etapaActual: 'DIRECTOR',
      condicion: 'Pendiente Director',
      aprobadorAsignado: 'Director de Escuela - Dr. Juan Carlos Mendoza',
      fechaSolicitudIso: '2026-11-05',
      fechaSolicitud: '05/11/2026 11:10',
      comentarioEvaluador: '',
      motivoRechazo: '',
      fechaResolucion: '',
      resolucionPor: ''
    },
    {
      id: 'REG-2026-104',
      schemaVersion: SCHEMA_VERSION,
      asistenciaId: 301,
      tramite: 'RECTIFICACION',
      docenteCodigo: 'DOC-1095',
      docente: 'Carlos Alberto Paredes Quispe',
      solicitadoPorRol: 'Docente',
      solicitadoPorNombre: 'Carlos Alberto Paredes Quispe',
      periodo: '2026-II',
      programa: 'FARMACIA Y BIOQUÍMICA',
      facultad: 'Facultad de Farmacia y Bioquímica',
      curso: 'Farmacología Clínica Aplicada - FC2M1',
      seccion: 'FC2M1',
      sesion: 'Teor.',
      aulaOriginal: 'A-204',
      fechaOriginalIso: '2026-10-15',
      fechaOriginal: '15/10/2026',
      horarioProgInicio: '19:15',
      horarioProgFin: '20:00',
      duracionOriginalMin: 45,
      horarioRegInicio: '19:21',
      horarioRegFin: '20:00',
      estadoOriginal: 'Tardanza',
      tardanzaMin: "6'",
      observacionOriginal: 'Ingreso validado RRAA',
      tipoRegularizacion: 'Motivo Académico',
      detalleSalud: '',
      motivo: 'Demora en cierre de acta de laboratorio previo acreditada por coordinación de sede.',
      archivoNombre: 'constancia_laboratorio_1510.pdf',
      reprogTipo: null,
      reprogTipoLabel: '',
      cambioDocente: false,
      docenteReemplazoCodigo: '',
      docenteReemplazo: '',
      sedeNueva: '',
      aulaNueva: '',
      fechaNuevaIso: '',
      fechaNueva: '',
      horaInicioNueva: '',
      horaFinNueva: '',
      duracionNuevaMin: null,
      cortePlanillaOriginal: '12/10/2026 – 11/11/2026',
      cortePlanillaPago: '12/10/2026 – 11/11/2026',
      notaPlanilla: 'Aprobado dentro del corte 12/10/2026 – 11/11/2026.',
      requiereCoordinador: false,
      etapaActual: 'COMPLETADO',
      condicion: 'Aprobado',
      aprobadorAsignado: 'RRAA - Lic. Carlos Silva',
      fechaSolicitudIso: '2026-10-16',
      fechaSolicitud: '16/10/2026 10:15',
      comentarioEvaluador: 'Validado correctamente contra bitácora de laboratorio.',
      motivoRechazo: '',
      fechaResolucion: '17/10/2026 15:40',
      resolucionPor: 'Lic. Carlos Silva (RRAA)'
    }
  ];

  // ==========================================================================
  // DATOS INICIALES DE CRONOGRAMAS Y PLANILLA MANUAL (2026)
  // ==========================================================================
  const INITIAL_CRONOGRAMAS = [
    {
      id: 1,
      anio: '2026',
      mes: 'Setiembre',
      corteInicio: '12/08/2026',
      corteFin: '11/09/2026',
      fechaLimite: '11/09/2026',
      fechaBloqueo: '12/09/2026',
      estado: 'Cerrado'
    },
    {
      id: 2,
      anio: '2026',
      mes: 'Octubre',
      corteInicio: '12/09/2026',
      corteFin: '11/10/2026',
      fechaLimite: '11/10/2026',
      fechaBloqueo: '12/10/2026',
      estado: 'Cerrado'
    },
    {
      id: 3,
      anio: '2026',
      mes: 'Noviembre',
      corteInicio: '12/10/2026',
      corteFin: '11/11/2026',
      fechaLimite: '11/11/2026',
      fechaBloqueo: '12/11/2026',
      estado: 'Vigente'
    },
    {
      id: 4,
      anio: '2026',
      mes: 'Diciembre',
      corteInicio: '12/11/2026',
      corteFin: '11/12/2026',
      fechaLimite: '11/12/2026',
      fechaBloqueo: '12/12/2026',
      estado: 'Programado'
    }
  ];

  const INITIAL_PLANILLA_MANUAL = [
    {
      num: 1,
      departamento: 'Lima',
      codDpto: '1501',
      tipoPrograma: 'Pregrado Regular',
      carreraPrograma: 'Enfermería',
      codCarreraPrograma: 'ENF-01',
      apellidosNombres: 'ASENSIO PEÑA, Jonah Miguel',
      dni: '45871042',
      regimen: 'Tiempo Parcial',
      dedicacion: '20 Horas',
      tipoActividad: 'Docencia Teórica',
      horasRealizadas: '3',
      importeTotal: 'S/ 210.00',
      motivo: 'Recuperación dictada en siguiente corte tras cierre del 11/10/2026',
      centroCosto: 'Escuela Profesional de Enfermería',
      codCentroCosto: 'CC-ENF-2026',
      proyecto: 'Plan de Fortalecimiento Clínico',
      codProyecto: 'PRY-2026-ENF',
      mesRegularizacion: 'Octubre 2026',
      fechaRegularizacionDocente: '09/10/2026'
    },
    {
      num: 2,
      departamento: 'Lima',
      codDpto: '1501',
      tipoPrograma: 'Pregrado Regular',
      carreraPrograma: 'Farmacia y Bioquímica',
      codCarreraPrograma: 'FAR-02',
      apellidosNombres: 'PAREDES QUISPE, Carlos Alberto',
      dni: '40981095',
      regimen: 'Tiempo Completo',
      dedicacion: '40 Horas',
      tipoActividad: 'Docencia Práctica / Laboratorio',
      horasRealizadas: '2',
      importeTotal: 'S/ 160.00',
      motivo: 'Ajuste validado dentro del corte 12/10/2026 – 11/11/2026',
      centroCosto: 'Facultad de Farmacia y Bioquímica',
      codCentroCosto: 'CC-FAR-2026',
      proyecto: 'Simulación Farmacológica',
      codProyecto: 'PRY-2026-FAR',
      mesRegularizacion: 'Noviembre 2026',
      fechaRegularizacionDocente: '10/11/2026'
    }
  ];

  // ==========================================================================
  // FUNCIONES DE PERSISTENCIA V2
  // ==========================================================================
  function getSolicitudes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => item.schemaVersion === SCHEMA_VERSION)) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback limpio hacia SEED_SOLICITUDES_V2
    }
    const fresh = JSON.parse(JSON.stringify(SEED_SOLICITUDES_V2));
    localStorage.setItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES, JSON.stringify(fresh));
    return fresh;
  }

  function saveSolicitudes(list) {
    localStorage.setItem(STORAGE_KEY_ASISTENCIA_SOLICITUDES, JSON.stringify(list));
  }

  function getCronogramas() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CRONOGRAMAS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.some(c => String(c.anio) === '2026')) {
          return parsed;
        }
      }
    } catch (e) {
      // Fallback hacia 2026
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_CRONOGRAMAS));
    localStorage.setItem(STORAGE_KEY_CRONOGRAMAS, JSON.stringify(fresh));
    return fresh;
  }

  function saveCronogramas(list) {
    localStorage.setItem(STORAGE_KEY_CRONOGRAMAS, JSON.stringify(list));
  }

  // ==========================================================================
  // REGLAS DE ETAPA Y PERTENENCIA A BANDEJA
  // ==========================================================================
  function isPendingCondition(condicion) {
    return ['Solicitado', 'Pendiente Coordinador', 'Pendiente Director'].includes(condicion);
  }

  function isPendingForRole(item, role) {
    if (!isPendingCondition(item.condicion)) return false;
    if (role === 'ALL') return true;
    return item.etapaActual === role;
  }

  function belongsToInbox(item, role) {
    if (role === 'ALL') return true;
    if (item.etapaActual === role) return true;
    if (item.decisionActorRole === role) return true;
    const aprobStr = item.aprobadorAsignado || '';
    const resolStr = item.resolucionPor || '';
    if (role === 'RRAA') {
      return aprobStr.includes('RRAA') || resolStr.includes('RRAA');
    }
    if (role === 'COORDINADOR') {
      return Boolean(item.requiereCoordinador) || aprobStr.includes('Coordinador') || resolStr.includes('Coordinador');
    }
    if (role === 'DIRECTOR') {
      return aprobStr.includes('Director') || resolStr.includes('Director') || item.tramite === 'REPROGRAMACION' || (item.tramite === 'RECTIFICACION' && item.estadoOriginal === 'Inasistencia');
    }
    return false;
  }

  function getStageDisplayLabel(stage) {
    if (stage === 'RRAA') return 'Registros Académicos (RRAA)';
    if (stage === 'COORDINADOR') return 'Coordinador Académico';
    if (stage === 'DIRECTOR') return 'Director de Escuela';
    return 'Administración Académica';
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
  // ELEMENTOS DOM - BANDEJA MULTI-PERFIL Y SOLICITUDES
  // ==========================================================================
  const adminSidebarAvatar = document.getElementById('adminSidebarAvatar');
  const adminSidebarRole = document.getElementById('adminSidebarRole');
  const adminSidebarName = document.getElementById('adminSidebarName');
  const adminSidebarCode = document.getElementById('adminSidebarCode');
  const notificationBadge = document.getElementById('notificationBadge');

  const inboxRoleButtons = document.querySelectorAll('.inbox-role-btn');
  const badgeInboxRRAA = document.getElementById('badgeInboxRRAA');
  const badgeInboxCoord = document.getElementById('badgeInboxCoord');
  const badgeInboxDirector = document.getElementById('badgeInboxDirector');
  const badgeInboxAll = document.getElementById('badgeInboxAll');
  const activeInboxBannerTitle = document.getElementById('activeInboxBannerTitle');

  const solicitudesTableBody = document.getElementById('solicitudesAsistenciaBody');
  const tableRowsCount = document.getElementById('tableRowsCount');
  const paginationInfoEl = document.querySelector('#panelSolicitudes .pagination-info');
  const countSolicitados = document.getElementById('countSolicitados');
  const countAprobados = document.getElementById('countAprobados');
  const countRechazados = document.getElementById('countRechazados');
  const countTabSolicitudes = document.getElementById('countTabSolicitudes');

  const filterCurso = document.getElementById('filterCurso');
  const filterSeccion = document.getElementById('filterSeccion'); // Filtro Tipo de Trámite (todos | RECTIFICACION | REPROGRAMACION)
  const filterDocente = document.getElementById('filterDocente');
  const filterPeriodo = document.getElementById('filterPeriodo');
  const filterCondicion = document.getElementById('filterCondicion');
  const btnClearFilters = document.getElementById('btnClearFilters');

  const chkSelectAll = document.getElementById('chkSelectAll');
  const bulkActionsBar = document.getElementById('bulkActionsBar');
  const selectedCountText = document.getElementById('selectedCountText');
  const btnBulkApprove = document.getElementById('btnBulkApprove');
  const btnBulkReject = document.getElementById('btnBulkReject');
  const btnBulkClear = document.getElementById('btnBulkClear');

  // Modal Evaluación
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
  const evalSection2Title = document.getElementById('evalSection2Title');
  const evalBiometricCompareGrid = document.getElementById('evalBiometricCompareGrid');
  const evalReprogCompareContainer = document.getElementById('evalReprogCompareContainer');
  const evalReprogOrigFechaAula = document.getElementById('evalReprogOrigFechaAula');
  const evalReprogOrigHorario = document.getElementById('evalReprogOrigHorario');
  const evalReprogOrigDuracion = document.getElementById('evalReprogOrigDuracion');
  const evalReprogModalidadChip = document.getElementById('evalReprogModalidadChip');
  const evalReprogPropFechaAula = document.getElementById('evalReprogPropFechaAula');
  const evalReprogPropHorario = document.getElementById('evalReprogPropHorario');
  const evalReprogDocenteActual = document.getElementById('evalReprogDocenteActual');
  const evalPlanillaBanner = document.getElementById('evalPlanillaBanner');
  const evalHorarioInicio = document.getElementById('evalHorarioInicio');
  const evalHorarioFin = document.getElementById('evalHorarioFin');
  const evalRegistroInicio = document.getElementById('evalRegistroInicio');
  const evalRegistroFin = document.getElementById('evalRegistroFin');
  const evalTardanzaObs = document.getElementById('evalTardanzaObs');
  const evalSection3Title = document.getElementById('evalSection3Title');
  const evalTipoSustento = document.getElementById('evalTipoSustento');
  const evalJefeInmediato = document.getElementById('evalJefeInmediato');
  const evalDocenteMotivoTexto = document.getElementById('evalDocenteMotivoTexto');
  const evalSustentoFileBox = document.getElementById('evalSustentoFileBox');
  const evalFileName = document.getElementById('evalFileName');
  const evalFileSize = document.getElementById('evalFileSize');
  const btnDescargarSustentoDoc = document.getElementById('btnDescargarSustentoDoc');
  const evalSection4Title = document.getElementById('evalSection4Title');
  const evalAuditStatusBox = document.getElementById('evalAuditStatusBox');
  const evalOtherInboxNotice = document.getElementById('evalOtherInboxNotice');
  const evalOtherInboxText = document.getElementById('evalOtherInboxText');
  const btnSwitchInboxFromModal = document.getElementById('btnSwitchInboxFromModal');
  const evalCoordAssignArea = document.getElementById('evalCoordAssignArea');
  const evalSelectDocenteReemplazo = document.getElementById('evalSelectDocenteReemplazo');
  const evalErrorDocenteReemplazo = document.getElementById('evalErrorDocenteReemplazo');
  const evalDecisionFormArea = document.getElementById('evalDecisionFormArea');
  const evalTxtObservacion = document.getElementById('evalTxtObservacion');
  const evalErrorObservacion = document.getElementById('evalErrorObservacion');
  const evalObsMandatoryMarker = document.getElementById('evalObsMandatoryMarker');
  const evalActionButtonsGroup = document.getElementById('evalActionButtonsGroup');
  const btnModalEvalRechazar = document.getElementById('btnModalEvalRechazar');
  const btnModalEvalAprobar = document.getElementById('btnModalEvalAprobar');
  const btnModalEvalAprobarText = document.getElementById('btnModalEvalAprobarText');

  let currentEvaluatingId = null;

  // Modal Rechazo
  const modalRechazoBackdrop = document.getElementById('modalRechazoBackdrop');
  const btnCloseModalRechazo = document.getElementById('btnCloseModalRechazo');
  const btnCancelRechazo = document.getElementById('btnCancelRechazo');
  const btnConfirmRechazo = document.getElementById('btnConfirmRechazo');
  const rejectionInfoText = document.getElementById('rejectionInfoText');
  const txtMotivoRechazo = document.getElementById('txtMotivoRechazo');
  const errorMotivoRechazo = document.getElementById('errorMotivoRechazo');
  let pendingRejectionIds = [];

  // Modal Sustento
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
    }, 3600);
  }

  let selectedIds = new Set();

  // ==========================================================================
  // CAMBIO DE BANDEJA / PERFIL EVALUADOR (RRAA | COORDINADOR | DIRECTOR | ALL)
  // ==========================================================================
  function syncRoleHeaderAndBadges(allList) {
    const roleCfg = ADMIN_ROLES[currentAdminRole] || ADMIN_ROLES.RRAA;

    if (adminSidebarAvatar) {
      adminSidebarAvatar.textContent = roleCfg.initials;
      adminSidebarAvatar.style.background = roleCfg.avatarBg;
    }
    if (adminSidebarRole) adminSidebarRole.textContent = roleCfg.sidebarRole;
    if (adminSidebarName) {
      adminSidebarName.textContent = roleCfg.sidebarName;
      adminSidebarName.setAttribute('title', roleCfg.sidebarTitle);
    }
    if (adminSidebarCode) adminSidebarCode.textContent = roleCfg.sidebarCode;
    if (activeInboxBannerTitle) activeInboxBannerTitle.textContent = roleCfg.bannerTitle;

    inboxRoleButtons.forEach(btn => {
      const btnRole = btn.getAttribute('data-inbox-role');
      const isActive = btnRole === currentAdminRole;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    const list = allList || getSolicitudes();
    const pendingRRAA = list.filter(s => s.etapaActual === 'RRAA' && s.condicion === 'Solicitado').length;
    const pendingCoord = list.filter(s => s.etapaActual === 'COORDINADOR' && s.condicion === 'Pendiente Coordinador').length;
    const pendingDirector = list.filter(s => s.etapaActual === 'DIRECTOR' && s.condicion === 'Pendiente Director').length;

    if (badgeInboxRRAA) badgeInboxRRAA.textContent = String(pendingRRAA);
    if (badgeInboxCoord) badgeInboxCoord.textContent = String(pendingCoord);
    if (badgeInboxDirector) badgeInboxDirector.textContent = String(pendingDirector);
    if (badgeInboxAll) badgeInboxAll.textContent = String(list.length);
    if (notificationBadge) notificationBadge.textContent = String(pendingRRAA + pendingCoord + pendingDirector);
  }

  function setAdminRole(roleKey) {
    if (!ADMIN_ROLES[roleKey]) return;
    currentAdminRole = roleKey;
    selectedIds.clear();
    renderSolicitudesTable();
  }

  inboxRoleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const roleKey = btn.getAttribute('data-inbox-role');
      if (roleKey && roleKey !== currentAdminRole) {
        setAdminRole(roleKey);
      }
    });
  });

  // ==========================================================================
  // HELPERS DE ICONOS SVG PARA ESTADOS Y CONDICIONES
  // ==========================================================================
  function getAdminEstadoIconSvg(estado) {
    const base = 'width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if (estado === 'Inasistencia') {
      return `<svg ${base}><circle cx="12" cy="12" r="9.5"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }
    if (estado === 'Tardanza') {
      return `<svg ${base}><circle cx="12" cy="12" r="9.5"></circle><polyline points="12 7 12 12 15.5 14"></polyline></svg>`;
    }
    if (estado === 'Observado') {
      return `<svg ${base}><path d="M10.3 3.9 2.6 17.5a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><line x1="12" y1="9.5" x2="12" y2="13.5"></line><line x1="12" y1="16.8" x2="12.01" y2="16.8"></line></svg>`;
    }
    return `<svg ${base}><rect x="3.5" y="4.5" width="17" height="16" rx="2"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3.5" y1="10" x2="20.5" y2="10"></line></svg>`;
  }

  function getAdminCondicionIconSvg(condicion) {
    const base = 'width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if (condicion === 'Aprobado') {
      return `<svg ${base}><circle cx="12" cy="12" r="9.5"></circle><polyline points="8.5 12.2 11 14.7 16 9.5"></polyline></svg>`;
    }
    if (condicion === 'Rechazado') {
      return `<svg ${base}><circle cx="12" cy="12" r="9.5"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }
    if (condicion === 'Pendiente Coordinador') {
      return `<svg ${base}><circle cx="9.5" cy="7.5" r="3.2"></circle><path d="M3 19.5v-1a4 4 0 0 1 4-4h4.2a4 4 0 0 1 4 4v1"></path><line x1="19" y1="8.5" x2="19" y2="14"></line><line x1="16.2" y1="11.2" x2="21.8" y2="11.2"></line></svg>`;
    }
    if (condicion === 'Pendiente Director') {
      return `<svg ${base}><path d="M12 21s7-3.3 7-9V5.8L12 3.2 5 5.8V12c0 5.7 7 9 7 9z"></path></svg>`;
    }
    return `<svg ${base}><circle cx="12" cy="12" r="9.5"></circle><polyline points="12 7 12 12 15.5 14"></polyline></svg>`;
  }

  // ==========================================================================
  // RENDERIZADO PRINCIPAL TABLA DE SOLICITUDES
  // ==========================================================================
  function renderSolicitudesTable() {
    const list = getSolicitudes();
    syncRoleHeaderAndBadges(list);
    if (!solicitudesTableBody) return;

    const fCurso = filterCurso ? filterCurso.value : 'todos';
    const fTramite = filterSeccion ? filterSeccion.value : 'todos';
    const fDocente = filterDocente ? filterDocente.value : 'todos';
    const fPeriodo = filterPeriodo ? filterPeriodo.value : 'todos';
    const fCondicion = filterCondicion ? filterCondicion.value : 'todos';

    const roleScopedList = list.filter(item => belongsToInbox(item, currentAdminRole));

    const filtered = roleScopedList.filter(item => {
      const matchCurso = fCurso === 'todos' || normalizeTextKey(item.curso).includes(normalizeTextKey(fCurso));
      const matchTramite = fTramite === 'todos' || item.tramite === fTramite;
      const matchDocente = fDocente === 'todos'
        || normalizeTextKey(item.docente).includes(normalizeTextKey(fDocente))
        || normalizeTextKey(item.docenteReemplazo).includes(normalizeTextKey(fDocente));
      const matchPeriodo = fPeriodo === 'todos' || item.periodo === fPeriodo;
      const matchCondicion = fCondicion === 'todos' || normalizeTextKey(item.condicion) === normalizeTextKey(fCondicion);
      return matchCurso && matchTramite && matchDocente && matchPeriodo && matchCondicion;
    });

    const numPendientes = roleScopedList.filter(s => isPendingCondition(s.condicion)).length;
    const numAprobados = roleScopedList.filter(s => s.condicion === 'Aprobado').length;
    const numRechazados = roleScopedList.filter(s => s.condicion === 'Rechazado').length;

    if (countSolicitados) countSolicitados.textContent = `${numPendientes} Pendiente${numPendientes !== 1 ? 's' : ''}`;
    if (countAprobados) countAprobados.textContent = `${numAprobados} Aprobada${numAprobados !== 1 ? 's' : ''}`;
    if (countRechazados) countRechazados.textContent = `${numRechazados} Rechazada${numRechazados !== 1 ? 's' : ''}`;
    if (countTabSolicitudes) countTabSolicitudes.textContent = String(list.length);
    if (tableRowsCount) {
      tableRowsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> de ${roleScopedList.length} solicitudes en esta bandeja (${list.length} globales)`;
    }
    if (paginationInfoEl) {
      paginationInfoEl.textContent = filtered.length === 0
        ? 'Mostrando 0 de 0 registros'
        : `Mostrando registros del 1 al ${filtered.length} de ${filtered.length}`;
    }

    solicitudesTableBody.innerHTML = '';

    if (filtered.length === 0) {
      solicitudesTableBody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 40px; color: #64748B;">
            No hay solicitudes en esta bandeja con los filtros seleccionados.
          </td>
        </tr>
      `;
      updateBulkToolbar();
      return;
    }

    const now = Date.now();

    filtered.forEach(item => {
      const row = document.createElement('tr');
      const isChecked = selectedIds.has(item.id);
      if (isChecked) row.classList.add('is-selected');

      let estadoBadgeClass = 'badge-incidencia-observado';
      if (item.estadoOriginal === 'Inasistencia') estadoBadgeClass = 'badge-incidencia-inasistencia';
      if (item.estadoOriginal === 'Tardanza') estadoBadgeClass = 'badge-incidencia-tardanza';
      if (item.estadoOriginal === 'Sin Estado') estadoBadgeClass = 'badge-incidencia-sin-estado';

      let condicionBadgeClass = 'badge-condicion-solicitado';
      if (item.condicion === 'Pendiente Coordinador') condicionBadgeClass = 'badge-condicion-coordinador';
      if (item.condicion === 'Pendiente Director') condicionBadgeClass = 'badge-condicion-director';
      if (item.condicion === 'Aprobado') condicionBadgeClass = 'badge-condicion-aprobado';
      if (item.condicion === 'Rechazado') condicionBadgeClass = 'badge-condicion-rechazado';

      const hasTimer = item.decisionTimestamp && (now - item.decisionTimestamp < CINCO_MINUTOS_MS);
      const actionableHere = isPendingForRole(item, currentAdminRole);
      const isPendingElsewhere = isPendingCondition(item.condicion) && !actionableHere;

      let accionesHtml = '';

      if (hasTimer && (currentAdminRole === 'ALL' || !item.decisionActorRole || item.decisionActorRole === currentAdminRole)) {
        const remainingSeconds = Math.max(0, Math.floor((CINCO_MINUTOS_MS - (now - item.decisionTimestamp)) / 1000));
        const mins = Math.floor(remainingSeconds / 60);
        const secs = String(remainingSeconds % 60).padStart(2, '0');

        accionesHtml = `
          <div class="row-actions-group-modern">
            <button type="button" class="btn-rectify-countdown" data-id="${escapeHtml(item.id)}" title="Deshacer decisión dentro del plazo de 5 minutos">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 4.5 3 10 8.5 10"></polyline>
                <path d="M4 14.5a8.5 8.5 0 1 0 2-8.8L3 10"></path>
              </svg>
              <span>Rectificar (${mins}:${secs})</span>
            </button>
            <button type="button" class="btn-evaluar-solicitud btn-view-only" data-id="${escapeHtml(item.id)}" title="Ver ficha completa">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5z"></path>
                <circle cx="12" cy="12" r="2.8"></circle>
              </svg>
            </button>
          </div>
        `;
      } else if (actionableHere) {
        if (item.etapaActual === 'COORDINADOR') {
          accionesHtml = `
            <div class="row-actions-group-modern">
              <button type="button" class="btn-evaluar-solicitud" data-id="${escapeHtml(item.id)}" title="Asignar Docente (A Programar) y derivar al Director">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="9.2" cy="7.5" r="3.4"></circle>
                  <path d="M2.5 20v-1.2a4.5 4.5 0 0 1 4.5-4.5h4.4a4.5 4.5 0 0 1 4.5 4.5V20"></path>
                  <line x1="19" y1="8.5" x2="19" y2="14.5"></line>
                  <line x1="16" y1="11.5" x2="22" y2="11.5"></line>
                </svg>
                <span>Asignar</span>
              </button>
              <button type="button" class="btn-row-reject-sm" data-id="${escapeHtml(item.id)}" title="Rechazar solicitud">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          `;
        } else {
          accionesHtml = `
            <div class="row-actions-group-modern">
              <button type="button" class="btn-evaluar-solicitud" data-id="${escapeHtml(item.id)}" title="Evaluar y resolver solicitud">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5z"></path>
                  <circle cx="12" cy="12" r="2.8"></circle>
                </svg>
                <span>Evaluar</span>
              </button>
              <button type="button" class="btn-row-approve-sm" data-id="${escapeHtml(item.id)}" title="Aprobar rápidamente">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button type="button" class="btn-row-reject-sm" data-id="${escapeHtml(item.id)}" title="Rechazar con motivo obligatorio">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          `;
        }
      } else if (isPendingElsewhere) {
        accionesHtml = `
          <div class="row-actions-group-modern">
            <button type="button" class="btn-evaluar-solicitud btn-view-only" data-id="${escapeHtml(item.id)}" title="En bandeja de ${escapeHtml(getStageDisplayLabel(item.etapaActual))}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5z"></path>
                <circle cx="12" cy="12" r="2.8"></circle>
              </svg>
              <span>Ver (${escapeHtml(item.etapaActual)})</span>
            </button>
          </div>
        `;
      } else {
        accionesHtml = `
          <div class="row-actions-group-modern">
            <button type="button" class="btn-evaluar-solicitud btn-view-only" data-id="${escapeHtml(item.id)}" title="Ver expediente resuelto">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3.5" y="4.5" width="17" height="16" rx="2"></rect>
                <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
                <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
                <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
              </svg>
              <span>Ver Ficha</span>
            </button>
          </div>
        `;
      }

      const isReprog = item.tramite === 'REPROGRAMACION';
      const tramiteBadge = isReprog
        ? `<span class="tramite-mini-pill is-reprog"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16.5 3.5 20 7 16.5 10.5"></polyline><path d="M4 11V9.5A2.5 2.5 0 0 1 6.5 7H20"></path><polyline points="7.5 20.5 4 17 7.5 13.5"></polyline><path d="M20 13v1.5a2.5 2.5 0 0 1-2.5 2.5H4"></path></svg><span>Reprog. · ${escapeHtml(item.reprogTipoLabel || 'Clase')}</span></span>`
        : `<span class="tramite-mini-pill is-rectif"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8.5z"></path><polyline points="14 2.5 14 8.5 19.5 8.5"></polyline></svg><span>Rectificación</span></span>`;

      const reemplazoSub = isReprog && item.cambioDocente
        ? `<div class="reprog-cell-sub">${item.docenteReemplazo ? `Reemplazo: ${escapeHtml(item.docenteReemplazo)}` : 'Reemplazo por asignar'}</div>`
        : '';

      const nuevaFechaSub = isReprog && item.fechaNueva
        ? `<div class="reprog-cell-sub">Nueva: ${escapeHtml(item.fechaNueva)}</div>`
        : '';

      const nuevaHoraIniSub = isReprog && item.horaInicioNueva
        ? `<span class="reprog-cell-sub">${escapeHtml(item.horaInicioNueva)}</span>`
        : '';

      const nuevaHoraFinSub = isReprog && item.horaFinNueva
        ? `<span class="reprog-cell-sub">${escapeHtml(item.horaFinNueva)}</span>`
        : '';

      row.innerHTML = `
        <td class="col-check">
          <input type="checkbox" class="chk-row" data-id="${escapeHtml(item.id)}" ${isChecked ? 'checked' : ''} aria-label="Seleccionar ${escapeHtml(item.id)}">
        </td>
        <td class="col-ticket">
          <div>${escapeHtml(item.id)}</div>
          ${tramiteBadge}
        </td>
        <td class="col-docente">
          <div class="table-docente-name">${escapeHtml(item.docente)}</div>
          <div class="table-docente-sub">${escapeHtml(item.docenteCodigo || '—')} · ${escapeHtml(item.programa || 'Pregrado')}</div>
          ${reemplazoSub}
        </td>
        <td class="col-curso" title="${escapeHtml(item.curso)}">
          <div class="table-curso-name">${escapeHtml(item.curso)}</div>
          <div class="table-curso-sub">
            <span class="badge-seccion-tag">${escapeHtml(item.seccion)}</span>
            <span>${escapeHtml(item.sesion)}</span>
          </div>
        </td>
        <td class="col-fecha">
          <div class="table-fecha-main">${escapeHtml(item.fechaOriginal)}</div>
          ${nuevaFechaSub}
          <div class="table-fecha-sub">Sol: ${escapeHtml(item.fechaSolicitud)}</div>
        </td>
        <td class="col-time">
          <div>${escapeHtml(item.horarioProgInicio || '-')}</div>
          ${nuevaHoraIniSub}
        </td>
        <td class="col-time">
          <div>${escapeHtml(item.horarioProgFin || '-')}</div>
          ${nuevaHoraFinSub}
        </td>
        <td class="col-time ${item.horarioRegInicio === '00:00' ? 'time-omitted-cell' : ''}">${escapeHtml(item.horarioRegInicio || '—')}</td>
        <td class="col-time ${item.horarioRegFin === '00:00' ? 'time-omitted-cell' : ''}">${escapeHtml(item.horarioRegFin || '—')}</td>
        <td class="col-estado">
          <span class="badge-estado-incidencia ${estadoBadgeClass}">
            ${getAdminEstadoIconSvg(item.estadoOriginal)}
            <span>${escapeHtml(item.estadoOriginal)}</span>
          </span>
        </td>
        <td class="col-condicion">
          <span class="badge-condicion-tramite ${condicionBadgeClass}">
            ${getAdminCondicionIconSvg(item.condicion)}
            <span>${escapeHtml(item.condicion)}</span>
          </span>
          <span class="stage-owner-sub">${escapeHtml(item.aprobadorAsignado || '')}</span>
        </td>
        <td class="col-acciones">${accionesHtml}</td>
      `;

      row.style.cursor = 'pointer';
      row.addEventListener('click', (e) => {
        if (e.target.closest('input[type="checkbox"]') || e.target.closest('button')) return;
        abrirModalEvaluacion(item.id);
      });

      solicitudesTableBody.appendChild(row);
    });

    solicitudesTableBody.querySelectorAll('.chk-row').forEach(chk => {
      chk.addEventListener('change', () => {
        const t = chk.getAttribute('data-id');
        if (chk.checked) {
          selectedIds.add(t);
        } else {
          selectedIds.delete(t);
        }
        updateBulkToolbar();
        const tr = chk.closest('tr');
        if (tr) tr.classList.toggle('is-selected', chk.checked);
      });
    });

    solicitudesTableBody.querySelectorAll('.btn-evaluar-solicitud').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModalEvaluacion(btn.getAttribute('data-id'));
      });
    });

    solicitudesTableBody.querySelectorAll('.btn-row-approve-sm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        aprobarSolicitudes([btn.getAttribute('data-id')]);
      });
    });

    solicitudesTableBody.querySelectorAll('.btn-row-reject-sm').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModalRechazo([btn.getAttribute('data-id')]);
      });
    });

    solicitudesTableBody.querySelectorAll('.btn-rectify-countdown').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        rectificarDecision(btn.getAttribute('data-id'));
      });
    });

    updateBulkToolbar();
  }

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
  // ACCIONES MASIVAS
  // ==========================================================================
  function updateBulkToolbar() {
    if (!bulkActionsBar) return;
    const count = selectedIds.size;
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
        const t = chk.getAttribute('data-id');
        if (chkSelectAll.checked) {
          selectedIds.add(t);
        } else {
          selectedIds.delete(t);
        }
        const tr = chk.closest('tr');
        if (tr) tr.classList.toggle('is-selected', chkSelectAll.checked);
      });
      updateBulkToolbar();
    });
  }

  if (btnBulkClear) {
    btnBulkClear.addEventListener('click', () => {
      selectedIds.clear();
      renderSolicitudesTable();
    });
  }

  if (btnBulkApprove) {
    btnBulkApprove.addEventListener('click', () => {
      if (selectedIds.size === 0) return;
      const list = getSolicitudes();
      const chosen = list.filter(s => selectedIds.has(s.id));

      const hasCoordStage = chosen.some(s => s.etapaActual === 'COORDINADOR' && s.condicion === 'Pendiente Coordinador');
      if (hasCoordStage) {
        showToast('Las solicitudes en etapa Coordinador requieren asignar un Docente (A Programar) individualmente desde "Asignar".');
        return;
      }

      const eligible = chosen.filter(s => isPendingForRole(s, currentAdminRole) && s.etapaActual !== 'COORDINADOR');
      if (eligible.length === 0) {
        showToast('Ninguna solicitud seleccionada está pendiente de aprobación directa en esta bandeja.');
        return;
      }

      if (confirm(`¿Está seguro de aprobar las ${eligible.length} solicitudes pendientes seleccionadas?`)) {
        aprobarSolicitudes(eligible.map(e => e.id));
        selectedIds.clear();
      }
    });
  }

  if (btnBulkReject) {
    btnBulkReject.addEventListener('click', () => {
      if (selectedIds.size === 0) return;
      const list = getSolicitudes();
      const eligible = list.filter(s => selectedIds.has(s.id) && isPendingForRole(s, currentAdminRole));
      if (eligible.length === 0) {
        showToast('Las solicitudes seleccionadas ya están resueltas o pertenecen a otra bandeja.');
        return;
      }
      abrirModalRechazo(eligible.map(e => e.id));
    });
  }

  // ==========================================================================
  // TRANSICIONES DE APROBACIÓN / RECTIFICACIÓN (5 MIN)
  // ==========================================================================
  function saveUndoSnapshot(item, actingRole) {
    item.decisionPrevEtapa = item.etapaActual;
    item.decisionPrevCondicion = item.condicion;
    item.decisionPrevAprobador = item.aprobadorAsignado;
    item.decisionPrevComentario = item.comentarioEvaluador || '';
    item.decisionPrevRechazo = item.motivoRechazo || '';
    item.decisionPrevFechaResolucion = item.fechaResolucion || '';
    item.decisionPrevResolucionPor = item.resolucionPor || '';
    item.decisionPrevReemplazo = item.docenteReemplazo || '';
    item.decisionPrevReemplazoCod = item.docenteReemplazoCodigo || '';
    item.decisionActorRole = actingRole;
    item.decisionTimestamp = Date.now();
  }

  function resolveRoleForItem(item) {
    if (currentAdminRole === 'ALL') {
      return ADMIN_ROLES[item.etapaActual] || ADMIN_ROLES.RRAA;
    }
    return ADMIN_ROLES[currentAdminRole] || ADMIN_ROLES.RRAA;
  }

  function aprobarSolicitudes(ids) {
    const list = getSolicitudes();
    let approvedCount = 0;

    list.forEach(item => {
      if (!ids.includes(item.id)) return;
      if (!isPendingForRole(item, currentAdminRole) || item.etapaActual === 'COORDINADOR') return;

      const roleCfg = resolveRoleForItem(item);
      saveUndoSnapshot(item, roleCfg.key);

      item.etapaActual = 'COMPLETADO';
      item.condicion = 'Aprobado';
      item.aprobadorAsignado = roleCfg.approverString;
      item.resolucionPor = roleCfg.resolverLabel;
      item.fechaResolucion = formatNowDisplay();
      item.comentarioEvaluador = item.tramite === 'REPROGRAMACION'
        ? `Reprogramación (${item.reprogTipoLabel || 'Clase'}) aprobada por Dirección de Escuela.`
        : `Regularización aprobada por ${roleCfg.sidebarRole}.`;
      approvedCount++;
    });

    if (approvedCount === 0) return;
    saveSolicitudes(list);
    renderSolicitudesTable();
    renderReportesTable();
    checkAndRunTimerTicker();
    showToast(`${approvedCount === 1 ? 'Solicitud aprobada' : `${approvedCount} solicitudes aprobadas`} con éxito. Puedes rectificar durante 5 minutos.`);
  }

  function rectificarDecision(ticketId) {
    const list = getSolicitudes();
    const item = list.find(s => s.id === ticketId);
    if (!item) return;

    const targetCond = item.decisionPrevCondicion
      || (item.requiereCoordinador && !item.docenteReemplazo ? 'Pendiente Coordinador'
        : (item.tramite === 'REPROGRAMACION' || item.estadoOriginal === 'Inasistencia' ? 'Pendiente Director' : 'Solicitado'));

    if (!confirm(`¿Deseas rectificar la decisión sobre ${ticketId}? Volverá a estado '${targetCond}'.`)) {
      return;
    }

    item.etapaActual = item.decisionPrevEtapa || (targetCond === 'Pendiente Coordinador' ? 'COORDINADOR' : targetCond === 'Pendiente Director' ? 'DIRECTOR' : 'RRAA');
    item.condicion = targetCond;
    item.aprobadorAsignado = item.decisionPrevAprobador || (
      item.etapaActual === 'COORDINADOR' ? 'Coordinador - Lic. Denssy López'
        : item.etapaActual === 'DIRECTOR' ? 'Director de Escuela - Dr. Juan Carlos Mendoza'
          : 'RRAA - Lic. Carlos Silva'
    );
    item.comentarioEvaluador = item.decisionPrevComentario || '';
    item.motivoRechazo = item.decisionPrevRechazo || '';
    item.fechaResolucion = item.decisionPrevFechaResolucion || '';
    item.resolucionPor = item.decisionPrevResolucionPor || '';
    if (item.decisionPrevReemplazo !== undefined) {
      item.docenteReemplazo = item.decisionPrevReemplazo;
      item.docenteReemplazoCodigo = item.decisionPrevReemplazoCod || '';
    }
    item.decisionTimestamp = null;
    item.decisionActorRole = null;

    saveSolicitudes(list);
    renderSolicitudesTable();
    renderReportesTable();
    checkAndRunTimerTicker();
    showToast(`Decisión sobre ${ticketId} rectificada correctamente.`);
  }

  // ==========================================================================
  // MODAL INTEGRAL DE EVALUACIÓN Y ASIGNACIÓN (RRAA / COORD / DIRECTOR)
  // ==========================================================================
  function syncAdminDocenteSelectUI() {
    if (!evalSelectDocenteReemplazo) return;
    const wrap = evalSelectDocenteReemplazo.closest('.modal-select-wrapper-admin');
    if (!wrap) return;
    const container = wrap.querySelector('.custom-select-container');
    if (!container) return;
    const label = container.querySelector('.custom-select-label');
    const selectedOpt = evalSelectDocenteReemplazo.options[evalSelectDocenteReemplazo.selectedIndex];
    if (label && selectedOpt) {
      label.textContent = selectedOpt.textContent;
      label.classList.toggle('is-placeholder', !selectedOpt.value);
    }
    container.querySelectorAll('.custom-option').forEach(optEl => {
      const sel = optEl.getAttribute('data-value') === evalSelectDocenteReemplazo.value;
      optEl.classList.toggle('selected', sel);
      optEl.setAttribute('aria-selected', String(sel));
    });
  }

  function clearCoordValidation() {
    if (evalSelectDocenteReemplazo) evalSelectDocenteReemplazo.setAttribute('aria-invalid', 'false');
    const customTrigger = document.querySelector('.modal-select-wrapper-admin .custom-select-trigger');
    if (customTrigger) customTrigger.setAttribute('aria-invalid', 'false');
    if (evalErrorDocenteReemplazo) {
      evalErrorDocenteReemplazo.style.display = 'none';
      evalErrorDocenteReemplazo.classList.remove('show');
    }
  }

  function showCoordValidationError(msg) {
    if (evalSelectDocenteReemplazo) evalSelectDocenteReemplazo.setAttribute('aria-invalid', 'true');
    const customTrigger = document.querySelector('.modal-select-wrapper-admin .custom-select-trigger');
    if (customTrigger) customTrigger.setAttribute('aria-invalid', 'true');
    if (evalErrorDocenteReemplazo) {
      evalErrorDocenteReemplazo.textContent = msg;
      evalErrorDocenteReemplazo.style.display = 'block';
      evalErrorDocenteReemplazo.classList.add('show');
    }
  }

  function abrirModalEvaluacion(ticketId) {
    const list = getSolicitudes();
    const item = list.find(s => s.id === ticketId);
    if (!item || !modalEvaluacionBackdrop) return;
    currentEvaluatingId = item.id;

    if (evalModalTicketBadge) {
      evalModalTicketBadge.textContent = `${item.id} • ${item.condicion}`;
    }
    if (evalDocenteNombre) evalDocenteNombre.textContent = item.docente;
    if (evalDocenteCodigo) {
      const originLabel = item.solicitadoPorRol === 'Coordinador'
        ? `Registrado por Coordinador (${item.solicitadoPorNombre || 'Coordinación'})`
        : 'Solicitado por Docente';
      evalDocenteCodigo.textContent = `Código: ${item.docenteCodigo || '—'} · ${originLabel}`;
    }
    if (evalCursoNombre) evalCursoNombre.textContent = item.curso;
    if (evalCarrera) evalCarrera.textContent = `${item.programa || 'PREGRADO'} · ${item.facultad || 'Universidad Norbert Wiener'}`;
    if (evalSeccionSesion) evalSeccionSesion.textContent = `Sección: ${item.seccion} • Sesión: ${item.sesion} • Aula: ${item.aulaOriginal || '—'}`;
    if (evalPeriodo) evalPeriodo.textContent = `Periodo Académico: ${item.periodo || '2026-II'}`;
    if (evalFechaSesion) evalFechaSesion.textContent = `${item.fechaOriginal} · ${item.horarioProgInicio} – ${item.horarioProgFin}`;
    if (evalFechaSolicitud) evalFechaSolicitud.textContent = `Fecha de Solicitud: ${item.fechaSolicitud}`;

    // Badge incidencia
    let estadoBadgeClass = 'badge-incidencia-observado';
    if (item.estadoOriginal === 'Inasistencia') estadoBadgeClass = 'badge-incidencia-inasistencia';
    if (item.estadoOriginal === 'Tardanza') estadoBadgeClass = 'badge-incidencia-tardanza';
    if (item.estadoOriginal === 'Sin Estado') estadoBadgeClass = 'badge-incidencia-sin-estado';

    if (evalBadgeIncidencia) {
      evalBadgeIncidencia.className = `badge-estado-incidencia ${estadoBadgeClass}`;
      evalBadgeIncidencia.innerHTML = `${getAdminEstadoIconSvg(item.estadoOriginal)}<span>${escapeHtml(item.estadoOriginal)}${item.tardanzaMin && item.tardanzaMin !== '-' ? ` (${escapeHtml(item.tardanzaMin)} tardanza)` : ''}</span>`;
    }

    // Sección 2: Biometría vs Reprogramación
    if (item.tramite === 'REPROGRAMACION') {
      if (evalSection2Title) evalSection2Title.textContent = '2. Comparativa de Programación Original vs. Propuesta';
      if (evalBiometricCompareGrid) evalBiometricCompareGrid.style.display = 'none';
      if (evalReprogCompareContainer) evalReprogCompareContainer.style.display = 'block';

      if (evalReprogOrigFechaAula) {
        evalReprogOrigFechaAula.textContent = `${item.fechaOriginal} · Aula ${item.aulaOriginal || '—'}`;
      }
      if (evalReprogOrigHorario) {
        evalReprogOrigHorario.textContent = `${item.horarioProgInicio} – ${item.horarioProgFin}`;
      }
      if (evalReprogOrigDuracion) {
        evalReprogOrigDuracion.textContent = `Duración original: ${item.duracionOriginalMin || 45} min`;
      }
      if (evalReprogModalidadChip) {
        evalReprogModalidadChip.textContent = item.reprogTipoLabel || item.reprogTipo || 'Reprogramación';
      }
      if (evalReprogPropFechaAula) {
        evalReprogPropFechaAula.textContent = `${item.fechaNueva || item.fechaOriginal} · ${item.sedeNueva || 'Sede Principal'} · Aula ${item.aulaNueva || item.aulaOriginal || '—'}`;
      }
      if (evalReprogPropHorario) {
        evalReprogPropHorario.textContent = `${item.horaInicioNueva || item.horarioProgInicio} – ${item.horaFinNueva || item.horarioProgFin} (${item.duracionNuevaMin || item.duracionOriginalMin || 45} min)`;
      }
      if (evalReprogDocenteActual) {
        if (item.cambioDocente) {
          evalReprogDocenteActual.textContent = item.docenteReemplazo
            ? `Docente de reemplazo asignado: ${item.docenteReemplazo} (${item.docenteReemplazoCodigo || 'A Programar'})`
            : 'Pendiente: Coordinador debe asignar Docente (A Programar) activo distinto al titular.';
        } else {
          evalReprogDocenteActual.textContent = `Docente a cargo: ${item.docenteReemplazo || item.docente}`;
        }
      }
      if (evalPlanillaBanner) {
        const diffCut = item.cortePlanillaPago && item.cortePlanillaOriginal && item.cortePlanillaPago !== item.cortePlanillaOriginal;
        evalPlanillaBanner.className = `eval-planilla-banner${diffCut ? ' is-warning' : ''}`;
        const bannerText = item.notaPlanilla
          || `Corte de origen: ${item.cortePlanillaOriginal || '-'} • Pago programado: ${item.cortePlanillaPago || '-'}`;
        evalPlanillaBanner.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8.2" x2="12.01" y2="8.2"></line>
          </svg>
          <span>${escapeHtml(bannerText)}</span>
        `;
      }
    } else {
      if (evalSection2Title) evalSection2Title.textContent = '2. Comparativa de Marcación Biométrica vs. Horario Oficial';
      if (evalBiometricCompareGrid) evalBiometricCompareGrid.style.display = 'grid';
      if (evalReprogCompareContainer) evalReprogCompareContainer.style.display = 'none';

      if (evalHorarioInicio) evalHorarioInicio.textContent = item.horarioProgInicio;
      if (evalHorarioFin) evalHorarioFin.textContent = item.horarioProgFin;
      if (evalRegistroInicio) {
        evalRegistroInicio.textContent = item.horarioRegInicio === '00:00' ? '00:00 (Omitido)' : (item.horarioRegInicio || '—');
        evalRegistroInicio.className = `compare-time-val ${item.horarioRegInicio === '00:00' ? 'time-omitted' : ''}`;
      }
      if (evalRegistroFin) {
        evalRegistroFin.textContent = item.horarioRegFin === '00:00' ? '00:00 (Omitido)' : (item.horarioRegFin || '—');
        evalRegistroFin.className = `compare-time-val ${item.horarioRegFin === '00:00' ? 'time-omitted' : ''}`;
      }
      if (evalTardanzaObs) {
        if (item.estadoOriginal === 'Tardanza') {
          evalTardanzaObs.textContent = `Tardanza de ${item.tardanzaMin || ''} registrada. ${item.observacionOriginal || ''}`.trim();
        } else {
          evalTardanzaObs.textContent = `Incidencia: ${item.observacionOriginal || item.estadoOriginal}.`;
        }
      }
    }

    // Sección 3: Motivo y sustento
    if (evalSection3Title) {
      evalSection3Title.textContent = item.tramite === 'REPROGRAMACION'
        ? '3. Detalle y Justificación de la Reprogramación'
        : '3. Justificación del Docente y Documento de Sustento';
    }
    if (evalTipoSustento) {
      if (item.tramite === 'REPROGRAMACION') {
        evalTipoSustento.textContent = `Reprogramación · ${item.reprogTipoLabel || '-'}`;
      } else {
        const saludPart = item.detalleSalud ? ` (${item.detalleSalud})` : '';
        const dmPart = item.fechaInicioDM
          ? ` · Del ${formatIsoToDisplay(item.fechaInicioDM)} al ${formatIsoToDisplay(item.fechaFinDM || item.fechaInicioDM)}`
          : '';
        evalTipoSustento.textContent = `${item.tipoRegularizacion || 'Regularización'}${saludPart}${dmPart}`;
      }
    }
    if (evalJefeInmediato) evalJefeInmediato.textContent = item.aprobadorAsignado || '—';
    if (evalDocenteMotivoTexto) evalDocenteMotivoTexto.textContent = item.motivo || 'Sin detalle adicional registrado.';

    if (evalSustentoFileBox) {
      if (item.archivoNombre) {
        evalSustentoFileBox.style.display = 'flex';
        if (evalFileName) evalFileName.textContent = item.archivoNombre;
        if (evalFileSize) evalFileSize.textContent = 'Documento oficial adjuntado • PDF / Imagen';
      } else {
        evalSustentoFileBox.style.display = 'none';
      }
    }

    // Sección 4: Resolución y etapa activa
    clearCoordValidation();
    if (evalOtherInboxNotice) evalOtherInboxNotice.style.display = 'none';
    if (evalCoordAssignArea) evalCoordAssignArea.style.display = 'none';
    if (evalSection4Title) {
      evalSection4Title.textContent = `4. Resolución de la Solicitud (${getStageDisplayLabel(item.etapaActual === 'COMPLETADO' ? currentAdminRole : item.etapaActual)})`;
    }

    const canUndoHere = item.decisionTimestamp
      && (Date.now() - item.decisionTimestamp < CINCO_MINUTOS_MS)
      && (currentAdminRole === 'ALL' || !item.decisionActorRole || item.decisionActorRole === currentAdminRole);

    if (item.condicion === 'Aprobado' || item.condicion === 'Rechazado') {
      const isAppr = item.condicion === 'Aprobado';
      if (evalAuditStatusBox) {
        evalAuditStatusBox.style.display = 'block';
        evalAuditStatusBox.className = `eval-audit-box ${isAppr ? 'approved' : 'rejected'}`;
        evalAuditStatusBox.innerHTML = `
          <div class="eval-audit-header">
            ${getAdminCondicionIconSvg(item.condicion).replace('width="12" height="12"', 'width="16" height="16"')}
            <span>${isAppr ? 'Solicitud Aprobada' : 'Solicitud Rechazada'}</span>
          </div>
          <div>Resuelto por: <strong>${escapeHtml(item.resolucionPor || item.aprobadorAsignado || 'Administración')}</strong>${item.fechaResolucion ? ` el ${escapeHtml(item.fechaResolucion)}` : ''}</div>
          <div style="margin-top: 4px; font-size: 12px;">${isAppr ? 'Observación' : 'Motivo formal de rechazo'}: <em>${escapeHtml(isAppr ? (item.comentarioEvaluador || 'Procedente') : (item.motivoRechazo || item.comentarioEvaluador || 'No acreditado'))}</em></div>
          ${canUndoHere ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(15, 23, 42, 0.2); display: flex; justify-content: flex-end;">
              <button type="button" class="btn-rectify-countdown" id="btnModalRectify" style="padding: 6px 12px; font-size: 12px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 4.5 3 10 8.5 10"></polyline>
                  <path d="M4 14.5a8.5 8.5 0 1 0 2-8.8L3 10"></path>
                </svg>
                <span>Rectificar Decisión (Deshacer)</span>
              </button>
            </div>
          ` : ''}
        `;
        const btnModalRectify = document.getElementById('btnModalRectify');
        if (btnModalRectify) {
          btnModalRectify.addEventListener('click', () => {
            const targetId = item.id;
            cerrarModalEvaluacion();
            rectificarDecision(targetId);
          });
        }
      }
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'none';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'none';
    } else if (!isPendingForRole(item, currentAdminRole)) {
      // Pendiente en otra bandeja (e.g. Coordinador derivó a Director o usuario ve otra bandeja)
      if (evalAuditStatusBox) {
        evalAuditStatusBox.style.display = 'block';
        evalAuditStatusBox.className = 'eval-audit-box';
        evalAuditStatusBox.innerHTML = `
          <div class="eval-audit-header">
            ${getAdminCondicionIconSvg(item.condicion).replace('width="12" height="12"', 'width="16" height="16"')}
            <span>Estado actual: ${escapeHtml(item.condicion)}</span>
          </div>
          <div>Asignado a: <strong>${escapeHtml(item.aprobadorAsignado || getStageDisplayLabel(item.etapaActual))}</strong></div>
          ${item.docenteReemplazo && item.cambioDocente ? `<div style="margin-top: 4px; font-size: 12px;">Docente reemplazo asignado: <strong>${escapeHtml(item.docenteReemplazo)}</strong></div>` : ''}
          ${canUndoHere ? `
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(15, 23, 42, 0.2); display: flex; justify-content: flex-end;">
              <button type="button" class="btn-rectify-countdown" id="btnModalRectify" style="padding: 6px 12px; font-size: 12px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 4.5 3 10 8.5 10"></polyline>
                  <path d="M4 14.5a8.5 8.5 0 1 0 2-8.8L3 10"></path>
                </svg>
                <span>Rectificar Derivación (Deshacer)</span>
              </button>
            </div>
          ` : ''}
        `;
        const btnModalRectify = document.getElementById('btnModalRectify');
        if (btnModalRectify) {
          btnModalRectify.addEventListener('click', () => {
            const targetId = item.id;
            cerrarModalEvaluacion();
            rectificarDecision(targetId);
          });
        }
      }
      if (evalOtherInboxNotice) {
        evalOtherInboxNotice.style.display = 'flex';
        if (evalOtherInboxText) {
          evalOtherInboxText.textContent = `Esta solicitud requiere acción en la bandeja de ${getStageDisplayLabel(item.etapaActual)}.`;
        }
        if (btnSwitchInboxFromModal) {
          btnSwitchInboxFromModal.setAttribute('data-target-role', item.etapaActual);
        }
      }
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'none';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'none';
    } else {
      // Accionable en esta bandeja (o en vista ALL)
      if (evalAuditStatusBox) evalAuditStatusBox.style.display = 'none';
      if (evalDecisionFormArea) evalDecisionFormArea.style.display = 'block';
      if (evalActionButtonsGroup) evalActionButtonsGroup.style.display = 'flex';
      if (evalTxtObservacion) {
        evalTxtObservacion.value = '';
        evalTxtObservacion.classList.remove('has-error');
      }
      if (evalErrorObservacion) {
        evalErrorObservacion.style.display = 'none';
        evalErrorObservacion.classList.remove('show');
      }
      if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'none';

      if (item.etapaActual === 'COORDINADOR') {
        if (evalCoordAssignArea) evalCoordAssignArea.style.display = 'block';
        if (evalSelectDocenteReemplazo) {
          evalSelectDocenteReemplazo.value = item.docenteReemplazo || '';
          syncAdminDocenteSelectUI();
        }
        if (btnModalEvalAprobarText) {
          btnModalEvalAprobarText.textContent = 'Asignar Docente y Derivar al Director';
        }
      } else if (item.etapaActual === 'DIRECTOR') {
        if (btnModalEvalAprobarText) {
          btnModalEvalAprobarText.textContent = item.tramite === 'REPROGRAMACION'
            ? 'Aprobar Reprogramación (Director)'
            : 'Aprobar Inasistencia (Director)';
        }
      } else {
        if (btnModalEvalAprobarText) {
          btnModalEvalAprobarText.textContent = 'Aprobar Regularización (RRAA)';
        }
      }
    }

    modalEvaluacionBackdrop.classList.add('active');
  }

  function cerrarModalEvaluacion() {
    if (modalEvaluacionBackdrop) modalEvaluacionBackdrop.classList.remove('active');
    currentEvaluatingId = null;
    clearCoordValidation();
  }

  if (btnSwitchInboxFromModal) {
    btnSwitchInboxFromModal.addEventListener('click', () => {
      const targetRole = btnSwitchInboxFromModal.getAttribute('data-target-role');
      const targetId = currentEvaluatingId;
      if (targetRole && ADMIN_ROLES[targetRole]) {
        cerrarModalEvaluacion();
        setAdminRole(targetRole);
        if (targetId) abrirModalEvaluacion(targetId);
      }
    });
  }

  if (evalSelectDocenteReemplazo) {
    evalSelectDocenteReemplazo.addEventListener('change', () => {
      if (!currentEvaluatingId) {
        clearCoordValidation();
        return;
      }
      const list = getSolicitudes();
      const item = list.find(s => s.id === currentEvaluatingId);
      const selected = evalSelectDocenteReemplazo.value;
      if (item && selected && normalizeTextKey(selected) === normalizeTextKey(item.docente)) {
        showCoordValidationError(`No puedes asignar al mismo docente titular original (${item.docente}) en un reemplazo.`);
      } else {
        clearCoordValidation();
      }
    });
  }

  if (btnCloseModalEvaluacion) btnCloseModalEvaluacion.addEventListener('click', cerrarModalEvaluacion);
  if (btnCerrarModalEvaluacion) btnCerrarModalEvaluacion.addEventListener('click', cerrarModalEvaluacion);

  if (btnDescargarSustentoDoc) {
    btnDescargarSustentoDoc.addEventListener('click', () => {
      const filename = evalFileName ? evalFileName.textContent : 'sustento.pdf';
      showToast(`Descargando archivo adjunto: ${filename}`);
    });
  }

  // Aprobación / Derivación desde el Modal de Evaluación
  if (btnModalEvalAprobar) {
    btnModalEvalAprobar.addEventListener('click', () => {
      if (!currentEvaluatingId) return;
      const obs = evalTxtObservacion ? evalTxtObservacion.value.trim() : '';
      const list = getSolicitudes();
      const item = list.find(s => s.id === currentEvaluatingId);
      if (!item) return;

      const roleCfg = resolveRoleForItem(item);

      // Paso Coordinador: exigir Docente (A Programar) activo distinto al titular y derivar a Director
      if (item.etapaActual === 'COORDINADOR') {
        const selectedDoc = evalSelectDocenteReemplazo ? evalSelectDocenteReemplazo.value.trim() : '';
        if (!selectedDoc) {
          showCoordValidationError('Debes seleccionar un Docente (A Programar) activo antes de derivar al Director.');
          if (evalSelectDocenteReemplazo) evalSelectDocenteReemplazo.focus();
          return;
        }
        if (normalizeTextKey(selectedDoc) === normalizeTextKey(item.docente)) {
          showCoordValidationError(`No puedes asignar al mismo docente titular original (${item.docente}) en un reemplazo.`);
          if (evalSelectDocenteReemplazo) evalSelectDocenteReemplazo.focus();
          return;
        }

        saveUndoSnapshot(item, 'COORDINADOR');
        item.docenteReemplazo = selectedDoc;
        item.docenteReemplazoCodigo = DOCENTE_CODE_CATALOG[selectedDoc] || 'DOC-PROG';
        item.etapaActual = 'DIRECTOR';
        item.condicion = 'Pendiente Director';
        item.aprobadorAsignado = 'Director de Escuela - Dr. Juan Carlos Mendoza';
        item.observacionOriginal = `Reemplazo asignado: ${selectedDoc}`;
        item.comentarioEvaluador = obs || `Docente de reemplazo (${selectedDoc}) asignado por Coordinación; pendiente aprobación del Director.`;

        saveSolicitudes(list);
        const ticketMoved = item.id;
        cerrarModalEvaluacion();
        renderSolicitudesTable();
        renderReportesTable();
        checkAndRunTimerTicker();
        showToast(`Docente ${selectedDoc} asignado. ${ticketMoved} derivado a bandeja del Director.`);
        return;
      }

      // Aprobación final RRAA o Director
      saveUndoSnapshot(item, roleCfg.key);
      item.etapaActual = 'COMPLETADO';
      item.condicion = 'Aprobado';
      item.aprobadorAsignado = roleCfg.approverString;
      item.resolucionPor = roleCfg.resolverLabel;
      item.fechaResolucion = formatNowDisplay();
      item.comentarioEvaluador = obs || (
        item.tramite === 'REPROGRAMACION'
          ? `Reprogramación (${item.reprogTipoLabel || 'Clase'}) aprobada por Dirección.`
          : `Regularización aprobada por ${roleCfg.sidebarRole}.`
      );

      saveSolicitudes(list);
      const processedId = item.id;
      cerrarModalEvaluacion();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud ${processedId} aprobada con éxito. Puedes rectificar durante 5 minutos.`);
    });
  }

  // Rechazo desde el Modal de Evaluación
  if (btnModalEvalRechazar) {
    btnModalEvalRechazar.addEventListener('click', () => {
      if (!currentEvaluatingId) return;
      const motivo = evalTxtObservacion ? evalTxtObservacion.value.trim() : '';
      if (!motivo) {
        if (evalTxtObservacion) evalTxtObservacion.classList.add('has-error');
        if (evalErrorObservacion) {
          evalErrorObservacion.style.display = 'block';
          evalErrorObservacion.classList.add('show');
        }
        if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'inline';
        if (evalTxtObservacion) evalTxtObservacion.focus();
        return;
      }

      const list = getSolicitudes();
      const item = list.find(s => s.id === currentEvaluatingId);
      if (item) {
        const roleCfg = resolveRoleForItem(item);
        saveUndoSnapshot(item, roleCfg.key);
        item.etapaActual = 'COMPLETADO';
        item.condicion = 'Rechazado';
        item.motivoRechazo = motivo;
        item.comentarioEvaluador = motivo;
        item.aprobadorAsignado = roleCfg.approverString;
        item.resolucionPor = roleCfg.resolverLabel;
        item.fechaResolucion = formatNowDisplay();
      }

      saveSolicitudes(list);
      const rejectedId = currentEvaluatingId;
      cerrarModalEvaluacion();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud ${rejectedId} rechazada. Motivo formal registrado.`);
    });
  }

  if (evalTxtObservacion) {
    evalTxtObservacion.addEventListener('input', () => {
      if (evalTxtObservacion.value.trim()) {
        evalTxtObservacion.classList.remove('has-error');
        if (evalErrorObservacion) {
          evalErrorObservacion.style.display = 'none';
          evalErrorObservacion.classList.remove('show');
        }
        if (evalObsMandatoryMarker) evalObsMandatoryMarker.style.display = 'none';
      }
    });
  }

  // ==========================================================================
  // MODAL DE RECHAZO CON MOTIVO OBLIGATORIO
  // ==========================================================================
  function abrirModalRechazo(ids) {
    pendingRejectionIds = ids;
    if (txtMotivoRechazo) {
      txtMotivoRechazo.value = '';
      txtMotivoRechazo.classList.remove('has-error');
    }
    if (errorMotivoRechazo) errorMotivoRechazo.classList.remove('show');

    if (rejectionInfoText) {
      const detailTarget = document.getElementById('rejectionDetailText') || rejectionInfoText;
      if (ids.length === 1) {
        const item = getSolicitudes().find(s => s.id === ids[0]);
        detailTarget.innerHTML = `Está a punto de rechazar la solicitud <strong>${escapeHtml(ids[0])}</strong> (${escapeHtml(item ? item.curso : '')}). Este proceso requiere sustento formal.`;
      } else {
        detailTarget.innerHTML = `Está a punto de rechazar <strong>${ids.length} solicitudes</strong> en bloque. Este motivo se aplicará a todas las solicitudes seleccionadas.`;
      }
    }

    if (modalRechazoBackdrop) {
      modalRechazoBackdrop.classList.add('active');
      setTimeout(() => {
        if (txtMotivoRechazo) txtMotivoRechazo.focus();
      }, 80);
    }
  }

  function cerrarModalRechazo() {
    if (modalRechazoBackdrop) modalRechazoBackdrop.classList.remove('active');
    pendingRejectionIds = [];
  }

  if (btnCloseModalRechazo) btnCloseModalRechazo.addEventListener('click', cerrarModalRechazo);
  if (btnCancelRechazo) btnCancelRechazo.addEventListener('click', cerrarModalRechazo);

  if (btnConfirmRechazo) {
    btnConfirmRechazo.addEventListener('click', () => {
      const motivo = txtMotivoRechazo ? txtMotivoRechazo.value.trim() : '';
      if (!motivo) {
        if (txtMotivoRechazo) txtMotivoRechazo.classList.add('has-error');
        if (errorMotivoRechazo) errorMotivoRechazo.classList.add('show');
        if (txtMotivoRechazo) txtMotivoRechazo.focus();
        return;
      }

      const list = getSolicitudes();
      let count = 0;

      list.forEach(item => {
        if (pendingRejectionIds.includes(item.id)) {
          const roleCfg = resolveRoleForItem(item);
          saveUndoSnapshot(item, roleCfg.key);
          item.etapaActual = 'COMPLETADO';
          item.condicion = 'Rechazado';
          item.motivoRechazo = motivo;
          item.comentarioEvaluador = motivo;
          item.aprobadorAsignado = roleCfg.approverString;
          item.resolucionPor = roleCfg.resolverLabel;
          item.fechaResolucion = formatNowDisplay();
          count++;
        }
      });

      saveSolicitudes(list);
      cerrarModalRechazo();
      selectedIds.clear();
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
      showToast(`Solicitud${count > 1 ? 'es' : ''} rechazada${count > 1 ? 's' : ''}. Motivo registrado en el expediente.`);
    });
  }

  // ==========================================================================
  // MODAL VISOR DE SUSTENTO ADJUNTO
  // ==========================================================================
  function abrirModalSustento(ticketId) {
    const item = getSolicitudes().find(s => s.id === ticketId);
    if (!item || !modalSustentoBackdrop) return;

    if (sustModalTicket) sustModalTicket.textContent = item.id;
    if (sustModalDocente) sustModalDocente.textContent = item.docente;
    if (sustModalCurso) sustModalCurso.textContent = `${item.curso} (${item.seccion})`;
    if (sustModalFecha) sustModalFecha.textContent = item.fechaOriginal;
    if (sustModalTipo) sustModalTipo.textContent = item.tipoRegularizacion || item.reprogTipoLabel || 'Sustento';
    if (sustModalFileName) sustModalFileName.textContent = item.archivoNombre || 'Sin archivo adjunto';

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

  // Filtros de búsqueda
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
        <td style="font-weight: 700; text-align: center;">${escapeHtml(item.anio)}</td>
        <td style="font-weight: 600; color: #0F848F;">${escapeHtml(item.mes)}</td>
        <td style="text-align: center;">${escapeHtml(item.corteInicio)} al ${escapeHtml(item.corteFin)}</td>
        <td style="text-align: center; color: #DC2626; font-weight: 700;">${escapeHtml(item.fechaLimite)}</td>
        <td style="text-align: center; color: #7F1D1D; font-size: 11.5px;">Desde ${escapeHtml(item.fechaBloqueo)} (Bloqueo Total)</td>
        <td style="text-align: center;">${statusBadge}</td>
        <td style="text-align: center;">
          <button type="button" class="btn-row-action btn-toggle-crono" data-id="${item.id}" title="Alternar Estado">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
      const anio = cronoAnio ? cronoAnio.value : '2026';
      const mes = cronoMes ? cronoMes.value : 'Diciembre';
      const fInicio = cronoFechaCorteInicio ? cronoFechaCorteInicio.value : '12/10/2026';
      const fFin = cronoFechaCorteFin ? cronoFechaCorteFin.value : '11/11/2026';
      const fLimite = cronoFechaLimite ? cronoFechaLimite.value : fFin;

      const list = getCronogramas();
      const newId = list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1;

      list.push({
        id: newId,
        anio,
        mes,
        corteInicio: fInicio,
        corteFin: fFin,
        fechaLimite: fLimite,
        fechaBloqueo: addDaysDisplay(fLimite, 1),
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

    const countAll = list.length;
    const countAprob = list.filter(s => s.condicion === 'Aprobado').length;
    const countRech = list.filter(s => s.condicion === 'Rechazado').length;
    const countProc = list.filter(s => isPendingCondition(s.condicion)).length;

    const bAll = document.getElementById('repBadgeAll');
    const bAprob = document.getElementById('repBadgeAprobadas');
    const bRech = document.getElementById('repBadgeRechazadas');
    const bProc = document.getElementById('repBadgeProceso');

    if (bAll) bAll.textContent = String(countAll);
    if (bAprob) bAprob.textContent = String(countAprob);
    if (bRech) bRech.textContent = String(countRech);
    if (bProc) bProc.textContent = String(countProc);

    const filtered = list.filter(item => {
      let matchState = false;
      if (currentReportState === 'todos') {
        matchState = true;
      } else if (currentReportState === 'Solicitado') {
        matchState = isPendingCondition(item.condicion);
      } else {
        matchState = normalizeTextKey(item.condicion) === normalizeTextKey(currentReportState);
      }
      const matchCurso = fCurso === 'todos' || normalizeTextKey(item.curso).includes(normalizeTextKey(fCurso));
      const matchAprobador = fAprobador === 'todos'
        || normalizeTextKey(item.aprobadorAsignado).includes(normalizeTextKey(fAprobador))
        || normalizeTextKey(item.resolucionPor).includes(normalizeTextKey(fAprobador));
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
      let condBadge = `<span class="badge-status-pill badge-solicitado">${escapeHtml(item.condicion)}</span>`;
      if (item.condicion === 'Aprobado') condBadge = '<span class="badge-status-pill badge-procesado">Aprobado</span>';
      if (item.condicion === 'Rechazado') condBadge = '<span class="badge-status-pill badge-rechazado">Rechazado</span>';

      const obsTexto = item.comentarioEvaluador || item.motivoRechazo || item.motivo || '—';
      const tramiteTxt = item.tramite === 'REPROGRAMACION' ? `Reprog. (${item.reprogTipoLabel})` : 'Rectificación';

      row.innerHTML = `
        <td style="text-align: center; font-weight: 700; color: #64748B;">${idx + 1}</td>
        <td style="font-weight: 700; color: #0F848F;">${escapeHtml(item.docenteCodigo || '—')}</td>
        <td style="font-weight: 600; color: #1E293B;">
          <div>${escapeHtml(item.docente)}</div>
          ${item.docenteReemplazo && item.cambioDocente ? `<div style="font-size: 11px; color: #6B21A8;">Reemplazo: ${escapeHtml(item.docenteReemplazo)}</div>` : ''}
        </td>
        <td style="line-height: 1.3;">${escapeHtml(item.curso)}</td>
        <td style="text-align: center;">${escapeHtml(item.seccion)} / ${escapeHtml(item.sesion)} · ${escapeHtml(tramiteTxt)}</td>
        <td style="text-align: center;">${escapeHtml(item.fechaOriginal)}${item.fechaNueva ? `<div style="font-size: 11px; color: #0F848F;">-> ${escapeHtml(item.fechaNueva)}</div>` : ''}</td>
        <td style="text-align: center;">${escapeHtml(item.fechaSolicitud)}</td>
        <td style="text-align: center;">${condBadge}</td>
        <td style="font-size: 11px; color: #64748B;">${escapeHtml(obsTexto)}</td>
        <td style="font-size: 11.5px; font-weight: 600; color: #334155;">${escapeHtml(item.resolucionPor || item.aprobadorAsignado || 'Pendiente de Asignación')}</td>
      `;
      reportesTableBody.appendChild(row);
    });
  }

  if (filterReportCurso) filterReportCurso.addEventListener('change', renderReportesTable);
  if (filterReportAprobador) filterReportAprobador.addEventListener('change', renderReportesTable);

  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      const list = getSolicitudes();
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'N,Ticket,Tramite,Codigo Docente,Docente,Reemplazo,Curso,Seccion,Fecha Sesion,Fecha Reprogramada,Corte Pago,Fecha Solicitud,Estado,Observaciones,Evaluador Asignado\n';

      list.forEach((item, idx) => {
        const row = [
          idx + 1,
          `"${item.id}"`,
          `"${item.tramite === 'REPROGRAMACION' ? (item.reprogTipoLabel || 'Reprogramación') : 'Rectificación'}"`,
          `"${item.docenteCodigo || ''}"`,
          `"${item.docente}"`,
          `"${item.docenteReemplazo || '-'}"`,
          `"${item.curso}"`,
          `"${item.seccion} - ${item.sesion}"`,
          `"${item.fechaOriginal}"`,
          `"${item.fechaNueva || '-'}"`,
          `"${item.cortePlanillaPago || '-'}"`,
          `"${item.fechaSolicitud}"`,
          `"${item.condicion}"`,
          `"${(item.comentarioEvaluador || item.motivoRechazo || item.motivo || '').replace(/"/g, '""')}"`,
          `"${item.resolucionPor || item.aprobadorAsignado || 'Pendiente'}"`
        ];
        csvContent += row.join(',') + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Reporte_Asistencia_Reprogramacion_${SYSTEM_TODAY_ISO}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Reporte consolidado exportado a Excel exitosamente.');
    });
  }

  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // VISTA 4: PLANILLA MANUAL (20 COLUMNAS)
  // ==========================================================================
  const planillaTableBody = document.getElementById('planillaManualTableBody');
  const btnDescargarPlantillaVacia = document.getElementById('btnDescargarPlantillaVacia');
  const btnExportarConsolidadoPlanilla = document.getElementById('btnExportarConsolidadoPlanilla');
  const btnAbrirModalImportar = document.getElementById('btnAbrirModalImportar');

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
        <td style="text-align: center; font-weight: 700; color: #64748B;">${escapeHtml(item.num)}</td>
        <td>${escapeHtml(item.departamento)}</td>
        <td style="text-align: center;">${escapeHtml(item.codDpto)}</td>
        <td>${escapeHtml(item.tipoPrograma)}</td>
        <td><strong>${escapeHtml(item.carreraPrograma)}</strong></td>
        <td style="text-align: center;">${escapeHtml(item.codCarreraPrograma)}</td>
        <td><strong>${escapeHtml(item.apellidosNombres)}</strong></td>
        <td style="text-align: center; font-variant-numeric: tabular-nums;">${escapeHtml(item.dni)}</td>
        <td>${escapeHtml(item.regimen)}</td>
        <td>${escapeHtml(item.dedicacion)}</td>
        <td>${escapeHtml(item.tipoActividad)}</td>
        <td style="text-align: center; font-weight: 700; color: #0F848F;">${escapeHtml(item.horasRealizadas)}</td>
        <td style="text-align: right; font-weight: 700; color: #15803D;">${escapeHtml(item.importeTotal)}</td>
        <td title="${escapeHtml(item.motivo)}">${escapeHtml(item.motivo)}</td>
        <td>${escapeHtml(item.centroCosto)}</td>
        <td style="text-align: center;">${escapeHtml(item.codCentroCosto)}</td>
        <td>${escapeHtml(item.proyecto)}</td>
        <td style="text-align: center;">${escapeHtml(item.codProyecto)}</td>
        <td style="text-align: center; font-weight: 600;">${escapeHtml(item.mesRegularizacion)}</td>
        <td style="text-align: center; font-weight: 700; color: #DC2626;">${escapeHtml(item.fechaRegularizacionDocente)}</td>
      `;
      planillaTableBody.appendChild(row);
    });
  }

  if (btnDescargarPlantillaVacia) {
    btnDescargarPlantillaVacia.addEventListener('click', () => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'N,Departamento,Cod. Dpto.,Tipo de Programa,Carrera o Programa,Cod. Carrera o Programa,Apellidos y Nombres,N D.N.I.,Regimen,Dedicacion,Tipo de Actividad,Horas/Cantidad Realizada,Importe Total,Motivo,Nombre del Centro de Costo,Cod. Del Centro de Costo,Nombre del Cod. de Proyecto,Cod. Del Proyecto,Mes de Regularizacion,FECHA DE REGULARIZACION POR PARTE DEL DOCENTE\n';
      csvContent += '1,,,,,,,,,,,,,,,,,,,\n';
      csvContent += '2,,,,,,,,,,,,,,,,,,,\n';

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'Plantilla_Vacia_Planilla_Manual_Wiener.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Plantilla vacía de planilla manual descargada.');
    });
  }

  if (btnExportarConsolidadoPlanilla) {
    btnExportarConsolidadoPlanilla.addEventListener('click', () => {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'N,Departamento,Cod. Dpto.,Tipo de Programa,Carrera o Programa,Cod. Carrera o Programa,Apellidos y Nombres,N D.N.I.,Regimen,Dedicacion,Tipo de Actividad,Horas/Cantidad Realizada,Importe Total,Motivo,Nombre del Centro de Costo,Cod. Del Centro de Costo,Nombre del Cod. de Proyecto,Cod. Del Proyecto,Mes de Regularizacion,FECHA DE REGULARIZACION POR PARTE DEL DOCENTE\n';

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
        csvContent += row.join(',') + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Planilla_Manual_Consolidada_${SYSTEM_TODAY_ISO}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Planilla manual consolidada exportada exitosamente.');
    });
  }

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
        showToast('Seleccione un archivo de planilla validada (.xlsx o .csv).');
        return;
      }

      planillaData.push({
        num: planillaData.length + 1,
        departamento: 'Lima',
        codDpto: '1501',
        tipoPrograma: 'Pregrado Regular',
        carreraPrograma: 'Enfermería',
        codCarreraPrograma: 'ENF-01',
        apellidosNombres: 'VENTOCILLA AGUILAR, Dayana Nicole',
        dni: '44281088',
        regimen: 'Tiempo Parcial',
        dedicacion: '16 Horas',
        tipoActividad: 'Docencia Práctica Clínica',
        horasRealizadas: '3',
        importeTotal: 'S/ 210.00',
        motivo: 'Reemplazo dictado fuera de corte (pasa al corte 12/11/2026 – 11/12/2026)',
        centroCosto: 'Escuela Profesional de Enfermería',
        codCentroCosto: 'CC-ENF-2026',
        proyecto: 'Desarrollo Académico',
        codProyecto: 'PRY-2026-ENF',
        mesRegularizacion: 'Noviembre 2026',
        fechaRegularizacionDocente: '11/11/2026'
      });

      cerrarModalImportar();
      renderPlanillaTable();
      showToast('Planilla manual importada y consolidada con éxito.');
    });
  }

  // ==========================================================================
  // CIERRE SEGURO DE MODALES (ESC Y BACKDROP SIN ARRASTRE ACCIDENTAL)
  // ==========================================================================
  [
    { el: modalEvaluacionBackdrop, close: cerrarModalEvaluacion },
    { el: modalRechazoBackdrop, close: cerrarModalRechazo },
    { el: modalSustentoBackdrop, close: cerrarModalSustento },
    { el: modalImportarPlanillaBackdrop, close: cerrarModalImportar }
  ].forEach(({ el, close }) => {
    if (!el) return;
    let downOnBackdrop = false;
    el.addEventListener('pointerdown', (e) => {
      downOnBackdrop = e.target === el;
    });
    el.addEventListener('pointerup', (e) => {
      if (downOnBackdrop && e.target === el) close();
      downOnBackdrop = false;
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.custom-select-container.is-open, .custom-date-container.is-open')) {
      e.stopPropagation();
      closeAllCustomDropdowns(true);
      return;
    }
    if (modalRechazoBackdrop && modalRechazoBackdrop.classList.contains('active')) {
      cerrarModalRechazo();
    } else if (modalSustentoBackdrop && modalSustentoBackdrop.classList.contains('active')) {
      cerrarModalSustento();
    } else if (modalImportarPlanillaBackdrop && modalImportarPlanillaBackdrop.classList.contains('active')) {
      cerrarModalImportar();
    } else if (modalEvaluacionBackdrop && modalEvaluacionBackdrop.classList.contains('active')) {
      cerrarModalEvaluacion();
    }
  });

  // ==========================================================================
  // CUSTOM SELECTS Y DATEPICKERS
  // ==========================================================================
  function initCustomSelects() {
    const containers = document.querySelectorAll('.custom-select-container:not(.is-admin-modal)');

    containers.forEach(container => {
      const trigger = container.querySelector('.custom-select-trigger');
      const menu = container.querySelector('.custom-dropdown-menu');
      const label = container.querySelector('.custom-select-label');
      const hiddenInput = container.querySelector('input[type="hidden"]');
      const options = Array.from(container.querySelectorAll('.custom-option'));

      if (!trigger || !menu) return;

      function selectOption(opt) {
        options.forEach(o => {
          o.classList.remove('selected', 'is-highlighted');
          o.setAttribute('aria-selected', 'false');
        });
        opt.classList.add('selected');
        opt.setAttribute('aria-selected', 'true');

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
      }

      function openSelectMenu() {
        const isOpen = container.classList.contains('is-open');
        closeAllCustomDropdowns();

        if (!isOpen) {
          const triggerRect = trigger.getBoundingClientRect();
          const menuHeight = 230;
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
      }

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openSelectMenu();
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSelectMenu();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIdx = options.findIndex(o => o.classList.contains('selected'));
          const delta = e.key === 'ArrowDown' ? 1 : -1;
          const nextIdx = (currentIdx + delta + options.length) % options.length;
          if (options[nextIdx]) selectOption(options[nextIdx]);
        }
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          selectOption(opt);
        });
      });
    });
  }

  function initAdminDocenteSelect() {
    if (!evalSelectDocenteReemplazo) return;
    const supportsBaseSelect = typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('appearance', 'base-select');
    const wrap = evalSelectDocenteReemplazo.closest('.modal-select-wrapper-admin');
    if (!wrap) return;

    if (supportsBaseSelect) {
      evalSelectDocenteReemplazo.addEventListener('change', clearCoordValidation);
      return;
    }

    if (wrap.querySelector('.custom-select-container')) return;
    const icon = wrap.querySelector('.modal-select-icon-admin');
    if (icon) icon.style.display = 'none';

    evalSelectDocenteReemplazo.style.position = 'absolute';
    evalSelectDocenteReemplazo.style.width = '1px';
    evalSelectDocenteReemplazo.style.height = '1px';
    evalSelectDocenteReemplazo.style.opacity = '0';
    evalSelectDocenteReemplazo.style.pointerEvents = 'none';
    evalSelectDocenteReemplazo.tabIndex = -1;

    const container = document.createElement('div');
    container.className = 'custom-select-container is-admin-modal';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const labelSpan = document.createElement('span');
    labelSpan.className = 'custom-select-label';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2.2');
    arrowSvg.setAttribute('class', 'custom-select-arrow');
    arrowSvg.setAttribute('aria-hidden', 'true');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', '6 9 12 15 18 9');
    arrowSvg.appendChild(poly);

    trigger.appendChild(labelSpan);
    trigger.appendChild(arrowSvg);

    const menu = document.createElement('ul');
    menu.className = 'custom-dropdown-menu is-floating';
    menu.setAttribute('role', 'listbox');

    function rebuildOptions() {
      menu.innerHTML = '';
      Array.from(evalSelectDocenteReemplazo.options).forEach(opt => {
        const li = document.createElement('li');
        li.className = `custom-option${opt.selected ? ' selected' : ''}`;
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', opt.value);
        li.setAttribute('aria-selected', String(opt.selected));
        li.innerHTML = `
          <span>${opt.textContent}</span>
          <svg class="option-check" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        menu.appendChild(li);
      });
    }

    rebuildOptions();
    container.appendChild(trigger);
    container.appendChild(menu);
    wrap.appendChild(container);
    syncAdminDocenteSelectUI();

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = container.classList.contains('is-open');
      closeAllCustomDropdowns();
      if (wasOpen) return;

      rebuildOptions();
      const rect = trigger.getBoundingClientRect();
      const width = Math.max(rect.width, 280);
      const estHeight = 230;
      const spaceBelow = window.innerHeight - rect.bottom - 10;
      let top = rect.bottom + 6;
      if (spaceBelow < estHeight && rect.top > spaceBelow) {
        top = Math.max(8, rect.top - estHeight - 6);
      }
      menu.style.width = `${width}px`;
      menu.style.top = `${Math.round(top)}px`;
      menu.style.left = `${Math.round(Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)))}px`;
      container.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      const optEl = e.target.closest('.custom-option');
      if (!optEl) return;
      evalSelectDocenteReemplazo.value = optEl.getAttribute('data-value') || '';
      syncAdminDocenteSelectUI();
      evalSelectDocenteReemplazo.dispatchEvent(new Event('change', { bubbles: true }));
      closeAllCustomDropdowns(true);
    });
  }

  const mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function isDateInActiveCutoff(year, monthZeroIndexed, day) {
    const iso = `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return iso >= '2026-10-12' && iso <= '2026-11-11';
  }

  function isPrototypeToday(year, monthZeroIndexed, day) {
    return year === 2026 && monthZeroIndexed === 10 && day === 11;
  }

  function initDatePicker(containerId, inputId, defaultDateStr) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    const popup = container ? container.querySelector('.custom-calendar-popup') : null;
    const trigger = container ? container.querySelector('.custom-date-trigger') : null;

    if (!container || !input || !popup || !trigger) return;

    const parts = defaultDateStr.split('/');
    let curDay = parseInt(parts[0], 10) || 1;
    let curMonth = (parseInt(parts[1], 10) || 11) - 1;
    let curYear = parseInt(parts[2], 10) || 2026;

    let viewMonth = curMonth;
    let viewYear = curYear;

    function selectCalDate(d, m, y) {
      curDay = d;
      curMonth = m;
      curYear = y;
      viewMonth = m;
      viewYear = y;
      const dd = String(curDay).padStart(2, '0');
      const mm = String(curMonth + 1).padStart(2, '0');
      input.value = `${dd}/${mm}/${curYear}`;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      container.classList.remove('is-open');
    }

    function renderCalendar() {
      popup.innerHTML = `
        <div class="cal-header">
          <span class="cal-month-title">${mesesNombres[viewMonth]} ${viewYear}</span>
          <div class="cal-nav-group">
            <button type="button" class="cal-nav-btn prev-month" aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="cal-nav-btn next-month" aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
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
        <div class="cal-footer-bar">
          <span class="cal-cutoff-tag">Corte 12/10–11/11</span>
          <button type="button" class="cal-today-btn">Ir a hoy (11/11)</button>
        </div>
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

        if (isDateInActiveCutoff(viewYear, viewMonth, day)) {
          cell.classList.add('in-cutoff');
        }
        if (isPrototypeToday(viewYear, viewMonth, day)) {
          cell.classList.add('today');
        }
        if (day === curDay && viewMonth === curMonth && viewYear === curYear) {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCalDate(day, viewMonth, viewYear);
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

      const todayBtn = popup.querySelector('.cal-today-btn');
      if (todayBtn) {
        todayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectCalDate(11, 10, 2026);
        });
      }
    }

    function openDatePopup() {
      const isOpen = container.classList.contains('is-open');
      closeAllCustomDropdowns();

      if (!isOpen) {
        viewMonth = curMonth;
        viewYear = curYear;
        renderCalendar();
        const triggerRect = trigger.getBoundingClientRect();
        popup.classList.remove('popup-above', 'popup-below', 'align-right');
        if (window.innerHeight - triggerRect.bottom < 300 && triggerRect.top > 300) {
          popup.classList.add('popup-above');
        } else {
          popup.classList.add('popup-below');
        }
        if (window.innerWidth - triggerRect.left < 300) {
          popup.classList.add('align-right');
        }
        container.classList.add('is-open');
      }
    }

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      openDatePopup();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDatePopup();
      }
    });
  }

  function closeAllCustomDropdowns(restoreFocus = false) {
    document.querySelectorAll('.custom-select-container.is-open').forEach(c => {
      c.classList.remove('is-open');
      const t = c.querySelector('.custom-select-trigger');
      if (t) {
        t.setAttribute('aria-expanded', 'false');
        if (restoreFocus) t.focus();
      }
    });
    document.querySelectorAll('.custom-date-container.is-open').forEach(c => {
      c.classList.remove('is-open');
      const inp = c.querySelector('.date-display-input');
      if (restoreFocus && inp) inp.focus();
    });
  }

  document.addEventListener('click', () => {
    closeAllCustomDropdowns(false);
  });

  // Sincronización entre pestañas (Docente <-> Administrativos)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY_ASISTENCIA_SOLICITUDES) {
      renderSolicitudesTable();
      renderReportesTable();
      checkAndRunTimerTicker();
    }
    if (e.key === STORAGE_KEY_CRONOGRAMAS) {
      renderCronogramasTable();
    }
  });

  // Inicialización principal
  initCustomSelects();
  initAdminDocenteSelect();
  initDatePicker('dateContainerCorteInicio', 'cronoFechaCorteInicio', '12/10/2026');
  initDatePicker('dateContainerCorteFin', 'cronoFechaCorteFin', '11/11/2026');
  initDatePicker('dateContainerFechaLimite', 'cronoFechaLimite', '11/11/2026');

  renderSolicitudesTable();
  renderCronogramasTable();
  renderReportesTable();
  renderPlanillaTable();
  checkAndRunTimerTicker();

  const initialHash = window.location.hash.replace('#', '');
  if (['solicitudes', 'cronograma', 'reportes', 'planilla'].includes(initialHash)) {
    switchTab(initialHash);
  }
});
