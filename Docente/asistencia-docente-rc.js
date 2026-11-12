document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'wiener_rraa_asistencia_solicitudes_v1';
  const SCHEMA_VERSION = 2;
  const SYSTEM_TODAY_ISO = '2026-11-11'; // Fecha actual del prototipo (día de cierre de planilla)
  const ACTIVE_CUTOFF_START = '2026-10-12';
  const ACTIVE_CUTOFF_END = '2026-11-11';
  const NEXT_CUTOFF_LABEL = '12/11/2026 – 11/12/2026';
  const ACTIVE_CUTOFF_LABEL = '12/10/2026 – 11/11/2026';

  const LOGGED_DOCENTE = {
    codigo: 'DOC-1042',
    nombre: 'Jonah Miguel Asensio Peña',
    rol: 'Docente',
    sub: 'Cod. DOC-1042',
    avatar: 'img/docente-avatar.jpg'
  };

  const COORDINADOR_PROFILE = {
    codigo: 'COORD-01',
    nombre: 'Lic. Denssy López',
    rol: 'Coordinador Académico',
    sub: 'Perfil: Solicitar por Docente',
    avatar: 'img/docente-avatar.jpg'
  };

  // Estado actual del perfil en el portal Docente (docente | coordinador)
  let currentSubmitRole = 'docente';
  let currentCoordinadorDocenteCode = 'DOC-1042';
  let currentCoordinadorSearchText = '';
  let currentActivePillFilter = 'todos';
  let currentSelectedRow = null;
  let pendingSubmissionPayload = null;
  let lastCreatedInasistenciaRow = null;
  let lastFocusedElement = null;
  let overlayPointerDownTarget = null;

  // ==========================================
  // 1. UTILIDADES DE FECHAS Y HORAS (SIN DESFASE UTC)
  // ==========================================
  const WEEKDAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  function parseIsoDateParts(iso) {
    if (!iso || typeof iso !== 'string') return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (!match) return null;
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3])
    };
  }

  function formatIsoToDisplay(iso) {
    const p = parseIsoDateParts(iso);
    if (!p) return '-';
    return `${String(p.day).padStart(2, '0')}/${String(p.month).padStart(2, '0')}/${p.year}`;
  }

  function getWeekdayShort(iso) {
    const p = parseIsoDateParts(iso);
    if (!p) return '';
    // Construcción explícita en calendario local (evita desfase UTC en new Date('YYYY-MM-DD'))
    const dt = new Date(p.year, p.month - 1, p.day);
    return WEEKDAYS_ES[dt.getDay()];
  }

  function shiftIsoDate(iso, deltaDays) {
    const p = parseIsoDateParts(iso);
    if (!p) return SYSTEM_TODAY_ISO;
    const dt = new Date(p.year, p.month - 1, p.day + deltaDays);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  }

  function compareIsoDates(a, b) {
    if (!a || !b) return 0;
    return a.localeCompare(b);
  }

  function timeToMinutes(hhmm) {
    if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime(totalMin) {
    const clamped = ((totalMin % 1440) + 1440) % 1440;
    const h = Math.floor(clamped / 60);
    const m = clamped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function formatDurationHM(mins) {
    const abs = Math.max(0, Math.round(mins));
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function formatAcademicHoursLabel(mins) {
    const blocks = mins / 45;
    if (Number.isInteger(blocks) && blocks > 0) {
      return `${blocks} h acad.`;
    }
    return `${mins} min`;
  }

  function getPayrollCutoffInfo(isoDate) {
    if (!isoDate) {
      return { status: 'closed', label: '-', startIso: '', endIso: '' };
    }
    if (compareIsoDates(isoDate, ACTIVE_CUTOFF_START) < 0) {
      return {
        status: 'closed',
        label: '12/09/2026 – 11/10/2026',
        startIso: '2026-09-12',
        endIso: '2026-10-11'
      };
    }
    if (compareIsoDates(isoDate, ACTIVE_CUTOFF_END) <= 0) {
      return {
        status: 'active',
        label: ACTIVE_CUTOFF_LABEL,
        startIso: ACTIVE_CUTOFF_START,
        endIso: ACTIVE_CUTOFF_END
      };
    }
    const p = parseIsoDateParts(isoDate);
    if (!p) {
      return { status: 'future', label: NEXT_CUTOFF_LABEL, startIso: '2026-11-12', endIso: '2026-12-11' };
    }
    let startM = p.day >= 12 ? p.month : p.month - 1;
    let startY = p.year;
    if (startM === 0) {
      startM = 12;
      startY -= 1;
    }
    let endM = startM + 1;
    let endY = startY;
    if (endM === 13) {
      endM = 1;
      endY += 1;
    }
    const startIso = `${startY}-${String(startM).padStart(2, '0')}-12`;
    const endIso = `${endY}-${String(endM).padStart(2, '0')}-11`;
    return {
      status: 'future',
      label: `${formatIsoToDisplay(startIso)} – ${formatIsoToDisplay(endIso)}`,
      startIso,
      endIso
    };
  }

  function getCurrentDateTimeFormatted() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${formatIsoToDisplay(SYSTEM_TODAY_ISO)} ${hours}:${minutes}`;
  }

  // ==========================================
  // 2. PROGRAMACIÓN COMPLETA DE DOCENTES (OCT – DIC 2026)
  // ==========================================
  const asistenciaData = [
    // --- DOCENTE PRINCIPAL: Jonah Miguel Asensio Peña (DOC-1042) ---
    {
      id: 101,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '05/10/2026',
      fechaIso: '2026-10-05',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '18:38',
      regFin: '19:15',
      tardanza: "8'",
      estado: 'Tardanza',
      observacion: 'Corte cerrado 11/10'
    },
    {
      id: 102,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '09/10/2026',
      fechaIso: '2026-10-09',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Cuidado de Enfermería en Salud Familiar - EN3022',
      periodo: '2026-II',
      seccion: 'EN4M2',
      sesion: 'Práct.',
      aulaOriginal: 'LAB-201',
      sedeOriginal: 'Sede Salud - Petit Thouars',
      progInicio: '19:15',
      progFin: '20:00',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Inasistencia',
      observacion: 'Corte cerrado 11/10'
    },
    {
      id: 103,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '19/10/2026',
      fechaIso: '2026-10-19',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '18:30',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Observado',
      observacion: 'Sin marcación de salida'
    },
    {
      id: 104,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '26/10/2026',
      fechaIso: '2026-10-26',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '19:15',
      progFin: '20:00',
      regInicio: '19:17',
      regFin: '20:00',
      tardanza: "2'",
      estado: 'Tardanza',
      observacion: 'Falla de red biométrico'
    },
    {
      id: 105,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '29/10/2026',
      fechaIso: '2026-10-29',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Cuidado de Enfermería en Salud Familiar - EN3022',
      periodo: '2026-II',
      seccion: 'EN4M2',
      sesion: 'Práct.',
      aulaOriginal: 'LAB-201',
      sedeOriginal: 'Sede Salud - Petit Thouars',
      progInicio: '18:30',
      progFin: '20:45',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Inasistencia',
      observacion: 'Bloque 3 h acad. (135 min)'
    },
    {
      id: 106,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '02/11/2026',
      fechaIso: '2026-11-02',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '20:00',
      progFin: '20:45',
      regInicio: '19:58',
      regFin: '20:45',
      tardanza: '-',
      estado: 'Asistió',
      observacion: '-'
    },
    {
      id: 107,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '04/11/2026',
      fechaIso: '2026-11-04',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Gestión del Cuidado en Enfermería - EN5011',
      periodo: '2026-II',
      seccion: 'EN5T1',
      sesion: 'Teor.',
      aulaOriginal: 'A-204',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Inasistencia',
      observacion: 'Permiso institucional'
    },
    {
      id: 108,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '09/11/2026',
      fechaIso: '2026-11-09',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Metodología de la Investigación Científica - PEIC205',
      periodo: '2026-II',
      seccion: 'PEIC2A1',
      sesion: 'Teor.',
      aulaOriginal: 'B-302',
      sedeOriginal: 'Campus Los Olivos (Norte)',
      progInicio: '20:45',
      progFin: '21:30',
      regInicio: '20:44',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Observado',
      observacion: 'Portal no registró salida'
    },
    {
      id: 109,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '11/11/2026',
      fechaIso: '2026-11-11',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '18:27',
      regFin: '19:15',
      tardanza: '-',
      estado: 'Asistió',
      observacion: 'Día de cierre de planilla'
    },
    {
      id: 110,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '13/11/2026',
      fechaIso: '2026-11-13',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Cuidado de Enfermería en Salud Familiar - EN3022',
      periodo: '2026-II',
      seccion: 'EN4M2',
      sesion: 'Práct.',
      aulaOriginal: 'LAB-201',
      sedeOriginal: 'Sede Salud - Petit Thouars',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Clase futura programada'
    },
    {
      id: 111,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '16/11/2026',
      fechaIso: '2026-11-16',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Gestión del Cuidado en Enfermería - EN5011',
      periodo: '2026-II',
      seccion: 'EN5T1',
      sesion: 'Teor.',
      aulaOriginal: 'A-204',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '20:45',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Bloque futuro 3 h acad. (135m)'
    },
    {
      id: 112,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '20/11/2026',
      fechaIso: '2026-11-20',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Metodología de la Investigación Científica - PEIC205',
      periodo: '2026-II',
      seccion: 'PEIC2A1',
      sesion: 'Teor.',
      aulaOriginal: 'B-302',
      sedeOriginal: 'Campus Los Olivos (Norte)',
      progInicio: '19:15',
      progFin: '20:00',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Programación regular'
    },
    {
      id: 113,
      docenteCodigo: 'DOC-1042',
      docente: 'Jonah Miguel Asensio Peña',
      fecha: '08/12/2026',
      fechaIso: '2026-12-08',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Estructura y Función Humana - EN2014',
      periodo: '2026-II',
      seccion: 'PEIC1D1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Feriado: Inmaculada Concepción'
    },

    // --- OTROS DOCENTES PARA MODO COORDINADOR ---
    {
      id: 201,
      docenteCodigo: 'DOC-1088',
      docente: 'Dayana Nicole Ventocilla Aguilar',
      fecha: '22/10/2026',
      fechaIso: '2026-10-22',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Validación de Instrumentos de Investigación - PEIC004',
      periodo: '2026-II',
      seccion: 'ND1M1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Inasistencia',
      observacion: 'Pendiente reemplazo docente'
    },
    {
      id: 202,
      docenteCodigo: 'DOC-1088',
      docente: 'Dayana Nicole Ventocilla Aguilar',
      fecha: '14/11/2026',
      fechaIso: '2026-11-14',
      programa: 'ENFERMERÍA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Validación de Instrumentos de Investigación - PEIC004',
      periodo: '2026-II',
      seccion: 'ND1M1',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '20:45',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Bloque 3 h acad. (135 min)'
    },
    {
      id: 301,
      docenteCodigo: 'DOC-1095',
      docente: 'Carlos Alberto Paredes Quispe',
      fecha: '15/10/2026',
      fechaIso: '2026-10-15',
      programa: 'FARMACIA Y BIOQUÍMICA',
      facultad: 'Facultad de Farmacia y Bioquímica',
      curso: 'Farmacología Clínica Aplicada - FC2M1',
      periodo: '2026-II',
      seccion: 'FC2M1',
      sesion: 'Teor.',
      aulaOriginal: 'A-204',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '19:15',
      progFin: '20:00',
      regInicio: '19:21',
      regFin: '20:00',
      tardanza: "6'",
      estado: 'Tardanza',
      observacion: 'Ingreso validado RRAA'
    },
    {
      id: 302,
      docenteCodigo: 'DOC-1095',
      docente: 'Carlos Alberto Paredes Quispe',
      fecha: '06/11/2026',
      fechaIso: '2026-11-06',
      programa: 'FARMACIA Y BIOQUÍMICA',
      facultad: 'Facultad de Farmacia y Bioquímica',
      curso: 'Farmacología Clínica Aplicada - FC2M1',
      periodo: '2026-II',
      seccion: 'FC2M1',
      sesion: 'Práct.',
      aulaOriginal: 'LAB-201',
      sedeOriginal: 'Sede Salud - Petit Thouars',
      progInicio: '18:30',
      progFin: '20:00',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Inasistencia',
      observacion: 'Bloque 2 h acad. (90 min)'
    },
    {
      id: 401,
      docenteCodigo: 'DOC-1103',
      docente: 'Mariela Sofía Roldán Torres',
      fecha: '10/11/2026',
      fechaIso: '2026-11-10',
      programa: 'NUTRICIÓN HUMANA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Nutrición y Dietoterapia Clínica - ND4054',
      periodo: '2026-II',
      seccion: 'ND5N2',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '18:30',
      progFin: '19:15',
      regInicio: '18:30',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Observado',
      observacion: 'Falta marcación de salida'
    },
    {
      id: 402,
      docenteCodigo: 'DOC-1103',
      docente: 'Mariela Sofía Roldán Torres',
      fecha: '18/11/2026',
      fechaIso: '2026-11-18',
      programa: 'NUTRICIÓN HUMANA',
      facultad: 'Facultad de Ciencias de la Salud',
      curso: 'Nutrición y Dietoterapia Clínica - ND4054',
      periodo: '2026-II',
      seccion: 'ND5N2',
      sesion: 'Teor.',
      aulaOriginal: 'A-101',
      sedeOriginal: 'Sede Principal - Av. Arequipa',
      progInicio: '19:15',
      progFin: '20:00',
      regInicio: '00:00',
      regFin: '00:00',
      tardanza: '-',
      estado: 'Sin Estado',
      observacion: 'Clase programada'
    }
  ];

  // ==========================================
  // 3. SEED Y SINCRONIZACIÓN LOCALSTORAGE V2
  // ==========================================
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

  function loadSolicitudes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => item.schemaVersion === SCHEMA_VERSION)) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    saveSolicitudes(SEED_SOLICITUDES_V2);
    return JSON.parse(JSON.stringify(SEED_SOLICITUDES_V2));
  }

  function saveSolicitudes(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore storage errors
    }
  }

  let solicitudesList = loadSolicitudes();

  // ==========================================
  // 4. REFERENCIAS AL DOM
  // ==========================================
  const sidebarUserRole = document.getElementById('sidebarUserRole');
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserCode = document.getElementById('sidebarUserCode');
  const btnRoleDocente = document.getElementById('btnRoleDocente');
  const btnRoleCoordinador = document.getElementById('btnRoleCoordinador');
  const roleModeHelperText = document.getElementById('roleModeHelperText');
  const labelFiltroPersonal = document.getElementById('labelFiltroPersonal');
  const docenteReadonlyWrapper = document.getElementById('docenteReadonlyWrapper');
  const coordDocentePicker = document.getElementById('coordDocentePicker');
  const filtroCoordinadorBusqueda = document.getElementById('filtroCoordinadorBusqueda');
  const filtroCoordinadorDocente = document.getElementById('filtroCoordinadorDocente');
  const filtroFechaDesde = document.getElementById('filtroFechaDesde');
  const filtroFechaHasta = document.getElementById('filtroFechaHasta');
  const btnBuscarAsistencia = document.getElementById('btnBuscarAsistencia');
  const btnExportarExcel = document.getElementById('btnExportarExcel');

  const asistenciaTableBody = document.getElementById('asistenciaTableBody');
  const asistenciaCounterText = document.getElementById('asistenciaCounterText');
  const paginationInfoText = document.querySelector('.pagination-info-text');
  const filterPills = document.querySelectorAll('.pill-filter-btn');
  const pendingRequestsCount = document.getElementById('pendingRequestsCount');

  // Modal 1: Rectificación
  const modalRegularizacion = document.getElementById('modalRegularizacion');
  const btnCloseModalReg = document.getElementById('btnCloseModalReg');
  const btnCancelarReg = document.getElementById('btnCancelarReg');
  const btnGuardarRegularizacion = document.getElementById('btnGuardarRegularizacion');
  const regSessionSummaryBox = document.getElementById('regSessionSummaryBox');
  const modalRegSubtitle = document.getElementById('modalRegSubtitle');
  const inasistenciaBridgeBanner = document.getElementById('inasistenciaBridgeBanner');
  const btnSwitchToReprogramacion = document.getElementById('btnSwitchToReprogramacion');
  const rectErrorSummary = document.getElementById('rectErrorSummary');
  const rectErrorSummaryText = document.getElementById('rectErrorSummaryText');

  const cardDescanso = document.getElementById('cardDescanso');
  const cardAcademico = document.getElementById('cardAcademico');
  const typeDescansoRadio = document.getElementById('typeDescanso');
  const typeAcademicoRadio = document.getElementById('typeAcademico');
  const formDescansoContainer = document.getElementById('formDescansoContainer');
  const formAcademicoContainer = document.getElementById('formAcademicoContainer');

  const regFechaInicioDM = document.getElementById('regFechaInicioDM');
  const regFechaFinDM = document.getElementById('regFechaFinDM');
  const regJefeInmediato = document.getElementById('regJefeInmediato');
  const regMotivoAcademicoTexto = document.getElementById('regMotivoAcademicoTexto');

  const fileDescansoInput = document.getElementById('fileDescansoInput');
  const dropzoneDescanso = document.getElementById('dropzoneDescanso');
  const filePillDescanso = document.getElementById('filePillDescanso');
  const fileNameDescanso = document.getElementById('fileNameDescanso');
  const btnRemoveFileDescanso = document.getElementById('btnRemoveFileDescanso');
  const errorMsgDescanso = document.getElementById('errorMsgDescanso');

  const fileAcademicoInput = document.getElementById('fileAcademicoInput');
  const dropzoneAcademico = document.getElementById('dropzoneAcademico');
  const filePillAcademico = document.getElementById('filePillAcademico');
  const fileNameAcademico = document.getElementById('fileNameAcademico');
  const btnRemoveFileAcademico = document.getElementById('btnRemoveFileAcademico');
  const errorMsgAcademico = document.getElementById('errorMsgAcademico');

  let attachedFileDescanso = null;
  let attachedFileAcademico = null;

  // Modal 2: Reprogramación
  const modalReprogramacion = document.getElementById('modalReprogramacion');
  const btnCloseModalReprog = document.getElementById('btnCloseModalReprog');
  const btnCancelarReprog = document.getElementById('btnCancelarReprog');
  const btnEnviarReprogramacion = document.getElementById('btnEnviarReprogramacion');
  const modalReprogSubtitle = document.getElementById('modalReprogSubtitle');
  const errorMsgReprogramacion = document.getElementById('errorMsgReprogramacion');
  const errorMsgReprogText = document.getElementById('errorMsgReprogText');
  const reprogModeRadios = document.querySelectorAll('input[name="reprogModalidad"]');
  const reprogModeRuleStrip = document.getElementById('reprogModeRuleStrip');

  const reprogInfoPeriodo = document.getElementById('reprogInfoPeriodo');
  const reprogInfoPrograma = document.getElementById('reprogInfoPrograma');
  const reprogInfoCurso = document.getElementById('reprogInfoCurso');
  const reprogInfoSeccion = document.getElementById('reprogInfoSeccion');
  const reprogInfoSesion = document.getElementById('reprogInfoSesion');
  const reprogInfoDocente = document.getElementById('reprogInfoDocente');

  const reprogCurrentFecha = document.getElementById('reprogCurrentFecha');
  const reprogCurrentHorario = document.getElementById('reprogCurrentHorario');
  const reprogCurrentDuracion = document.getElementById('reprogCurrentDuracion');
  const reprogCurrentAula = document.getElementById('reprogCurrentAula');

  const feriadoCambioDocenteWrap = document.getElementById('feriadoCambioDocenteWrap');
  const reprogFeriadoCambioDocente = document.getElementById('reprogFeriadoCambioDocente');
  const reprogDocenteDisplay = document.getElementById('reprogDocenteDisplay');
  const reprogDocenteStageTag = document.getElementById('reprogDocenteStageTag');
  const reprogDocenteHelper = document.getElementById('reprogDocenteHelper');
  const reprogSede = document.getElementById('reprogSede');
  const reprogAula = document.getElementById('reprogAula');
  const reprogFecha = document.getElementById('reprogFecha');
  const reprogHoraInicio = document.getElementById('reprogHoraInicio');
  const reprogHoraFin = document.getElementById('reprogHoraFin');
  const reprogDurationPill = document.getElementById('reprogDurationPill');
  const reprogDurationValue = document.getElementById('reprogDurationValue');
  const reprogDurationHint = document.getElementById('reprogDurationHint');
  const reprogPlanillaNotice = document.getElementById('reprogPlanillaNotice');
  const reprogMotivo = document.getElementById('reprogMotivo');
  const charCountReprogMotivo = document.getElementById('charCountReprogMotivo');

  // Confirmación, Puente, Historial, Vista y Toast
  const modalConfirmacionRegularizacion = document.getElementById('modalConfirmacionRegularizacion');
  const confirmSalutationText = document.getElementById('confirmSalutationText');
  const confirmBodyText = document.getElementById('confirmBodyText');
  const confirmRouteBadge = document.getElementById('confirmRouteBadge');
  const btnCancelarConfirmacion = document.getElementById('btnCancelarConfirmacion');
  const btnConformeConfirmacion = document.getElementById('btnConformeConfirmacion');

  const modalInasistenciaBridge = document.getElementById('modalInasistenciaBridge');
  const bridgeTicketCode = document.getElementById('bridgeTicketCode');
  const btnBridgeSoloRectificacion = document.getElementById('btnBridgeSoloRectificacion');
  const btnBridgeAbrirReprog = document.getElementById('btnBridgeAbrirReprog');

  const btnOpenHistorial = document.getElementById('btnOpenHistorial');
  const modalHistorialSolicitudes = document.getElementById('modalHistorialSolicitudes');
  const btnCloseModalHistorial = document.getElementById('btnCloseModalHistorial');
  const btnAceptarHistorial = document.getElementById('btnAceptarHistorial');
  const historialTableBody = document.getElementById('historialTableBody');

  const modalVistaSolicitud = document.getElementById('modalVistaSolicitud');
  const btnCloseModalVista = document.getElementById('btnCloseModalVista');
  const btnAceptarVista = document.getElementById('btnAceptarVista');
  const vistaTicketNumber = document.getElementById('vistaTicketNumber');
  const vistaEstadoBadge = document.getElementById('vistaEstadoBadge');
  const vistaSolicitudDetails = document.getElementById('vistaSolicitudDetails');

  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // ==========================================
  // 5. CONTROL DE MODALES ACCESIBLE Y CIERRE DE POPUPS FLOTANTES
  // ==========================================
  function closeAllFloatingPopups(restoreFocus = false) {
    document.querySelectorAll('.custom-date-container.open').forEach(container => {
      container.classList.remove('open');
      const displayInput = container.querySelector('.date-display-input');
      const popup = container.querySelector('.custom-calendar-popup');
      if (popup) popup.classList.remove('open');
      if (displayInput) {
        displayInput.setAttribute('aria-expanded', 'false');
        if (restoreFocus) displayInput.focus();
      }
    });

    document.querySelectorAll('.custom-select-container.open').forEach(container => {
      container.classList.remove('open');
      const trigger = container.querySelector('.custom-select-trigger');
      const menu = container.querySelector('.custom-dropdown-menu');
      if (menu) menu.classList.remove('open');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        if (restoreFocus) trigger.focus();
      }
    });

    const activeTimePopover = document.getElementById('docenteTimePopover');
    if (activeTimePopover && activeTimePopover.classList.contains('open')) {
      const targetId = activeTimePopover.getAttribute('data-active-trigger');
      activeTimePopover.classList.remove('open');
      document.querySelectorAll('.time-preset-trigger[aria-expanded="true"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        if (restoreFocus && targetId && btn.getAttribute('data-time-target') === targetId) {
          btn.focus();
        }
      });
    }
  }

  function hasOpenFloatingPopup() {
    return Boolean(
      document.querySelector('.custom-date-container.open') ||
      document.querySelector('.custom-select-container.open') ||
      document.querySelector('#docenteTimePopover.open')
    );
  }

  function openModal(modalEl, initialFocusEl) {
    if (!modalEl) return;
    closeAllFloatingPopups(false);
    lastFocusedElement = document.activeElement;
    modalEl.classList.add('active');
    if (initialFocusEl) {
      setTimeout(() => initialFocusEl.focus(), 30);
    }
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    closeAllFloatingPopups(false);
    modalEl.classList.remove('active');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('pointerdown', (e) => {
      overlayPointerDownTarget = e.target;
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && overlayPointerDownTarget === overlay) {
        closeModal(overlay);
      }
      overlayPointerDownTarget = null;
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (hasOpenFloatingPopup()) {
        e.stopPropagation();
        closeAllFloatingPopups(true);
        return;
      }
      const opened = document.querySelectorAll('.modal-overlay.active');
      opened.forEach(m => closeModal(m));
    }
  });

  // ==========================================
  // 6. PERFIL DE INGRESO (DOCENTE vs COORDINADOR EN ZONA DE FILTROS)
  // ==========================================
  function setSubmitRoleMode(role) {
    currentSubmitRole = role;
    const isCoord = role === 'coordinador';

    btnRoleDocente.classList.toggle('active', !isCoord);
    btnRoleDocente.setAttribute('aria-checked', String(!isCoord));
    btnRoleCoordinador.classList.toggle('active', isCoord);
    btnRoleCoordinador.setAttribute('aria-checked', String(isCoord));

    docenteReadonlyWrapper.style.display = isCoord ? 'none' : 'flex';
    coordDocentePicker.style.display = isCoord ? 'block' : 'none';
    labelFiltroPersonal.textContent = isCoord ? 'Buscar Docente:' : 'Personal:';
    roleModeHelperText.textContent = isCoord
      ? 'Modo Coordinador: busca un docente, filtra sus fechas y genera solicitudes en su nombre.'
      : 'Visualizando la programación completa del docente autenticado.';

    const profile = isCoord ? COORDINADOR_PROFILE : LOGGED_DOCENTE;
    if (sidebarUserRole) sidebarUserRole.textContent = profile.rol;
    if (sidebarUserName) {
      sidebarUserName.textContent = profile.nombre;
      sidebarUserName.title = profile.nombre;
    }
    if (sidebarUserCode) sidebarUserCode.textContent = profile.sub;

    renderTable(currentActivePillFilter);
  }

  if (btnRoleDocente) {
    btnRoleDocente.addEventListener('click', () => setSubmitRoleMode('docente'));
  }
  if (btnRoleCoordinador) {
    btnRoleCoordinador.addEventListener('click', () => {
      setSubmitRoleMode('coordinador');
      if (filtroCoordinadorBusqueda) filtroCoordinadorBusqueda.focus();
    });
  }

  if (filtroCoordinadorDocente) {
    filtroCoordinadorDocente.addEventListener('change', () => {
      currentCoordinadorDocenteCode = filtroCoordinadorDocente.value;
      renderTable(currentActivePillFilter);
    });
  }

  if (filtroCoordinadorBusqueda) {
    filtroCoordinadorBusqueda.addEventListener('input', () => {
      currentCoordinadorSearchText = filtroCoordinadorBusqueda.value.trim().toLowerCase();
      // Si el texto coincide exactamente o parcialmente con un único docente en el select, facilitar visibilidad
      if (currentCoordinadorSearchText.length > 0 && currentCoordinadorDocenteCode !== 'todos') {
        const currentSelectedOpt = Array.from(filtroCoordinadorDocente.options).find(o => o.value === currentCoordinadorDocenteCode);
        if (currentSelectedOpt && !currentSelectedOpt.textContent.toLowerCase().includes(currentCoordinadorSearchText) && !currentSelectedOpt.value.toLowerCase().includes(currentCoordinadorSearchText)) {
          filtroCoordinadorDocente.value = 'todos';
          currentCoordinadorDocenteCode = 'todos';
          if (typeof syncSelectUI === 'function') syncSelectUI(filtroCoordinadorDocente);
        }
      }
      renderTable(currentActivePillFilter);
    });
  }

  // ==========================================
  // 7. HELPERS DE SOLICITUDES POR FILA Y CORTE
  // ==========================================
  function getLatestSolicitudForRow(asistenciaId, tramite) {
    return solicitudesList.find(s => Number(s.asistenciaId) === Number(asistenciaId) && s.tramite === tramite) || null;
  }

  function getStatusMetaForBadge(solicitud) {
    if (!solicitud) return null;
    switch (solicitud.condicion) {
      case 'Aprobado':
        return { cls: 'status-aceptado', label: 'Aprobado', stageHint: 'Aprobado' };
      case 'Rechazado':
        return { cls: 'status-rechazado', label: 'Rechazado', stageHint: 'Rechazado' };
      case 'Pendiente Coordinador':
        return { cls: 'status-coordinador', label: 'Pend. Coord.', stageHint: 'Coordinador' };
      case 'Pendiente Director':
        return { cls: 'status-director', label: 'Pend. Director', stageHint: 'Director' };
      default:
        return { cls: 'status-solicitado', label: 'Solicitado', stageHint: 'RRAA' };
    }
  }

  function isRowWithinActiveCutoff(row) {
    return compareIsoDates(row.fechaIso, ACTIVE_CUTOFF_START) >= 0 && compareIsoDates(row.fechaIso, ACTIVE_CUTOFF_END) <= 0;
  }

  function isRowClosedCutoff(row) {
    return compareIsoDates(row.fechaIso, ACTIVE_CUTOFF_START) < 0;
  }

  // Matriz de 5 estados: Asistió | Tardanza | Observado | Inasistencia | Sin Estado
  function canRectificarRow(row) {
    return row.estado === 'Tardanza' || row.estado === 'Observado' || row.estado === 'Inasistencia';
  }

  function canReprogramarRow(row) {
    return row.estado === 'Inasistencia' || row.estado === 'Sin Estado';
  }

  // ==========================================
  // 8. FILTRADO Y RENDERIZADO DE TABLA PRINCIPAL (16 COLUMNAS)
  // ==========================================
  function getBaseFilteredRows() {
    const desde = filtroFechaDesde ? filtroFechaDesde.value : '';
    const hasta = filtroFechaHasta ? filtroFechaHasta.value : '';

    return asistenciaData.filter(row => {
      // Filtro de docente según perfil activo
      if (currentSubmitRole === 'docente') {
        if (row.docenteCodigo !== LOGGED_DOCENTE.codigo) return false;
      } else {
        if (currentCoordinadorDocenteCode !== 'todos' && row.docenteCodigo !== currentCoordinadorDocenteCode) {
          return false;
        }
        if (currentCoordinadorSearchText) {
          const haystack = `${row.docente} ${row.docenteCodigo} ${row.curso}`.toLowerCase();
          if (!haystack.includes(currentCoordinadorSearchText)) return false;
        }
      }

      if (desde && compareIsoDates(row.fechaIso, desde) < 0) return false;
      if (hasta && compareIsoDates(row.fechaIso, hasta) > 0) return false;
      return true;
    }).sort((a, b) => compareIsoDates(a.fechaIso, b.fechaIso) || a.progInicio.localeCompare(b.progInicio));
  }

  function normalizeEstadoSlug(estado) {
    return estado.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  }

  function updateSummaryCounters(baseRows, shownCount) {
    const counts = {
      todos: baseRows.length,
      observado: 0,
      inasistencia: 0,
      tardanza: 0,
      asistio: 0,
      'sin-estado': 0
    };
    baseRows.forEach(r => {
      const slug = normalizeEstadoSlug(r.estado);
      if (counts[slug] !== undefined) counts[slug] += 1;
    });

    filterPills.forEach(pill => {
      const key = pill.getAttribute('data-estado');
      const countEl = pill.querySelector('.count-tag');
      if (countEl && counts[key] !== undefined) {
        countEl.textContent = counts[key];
      }
    });

    if (asistenciaCounterText) {
      asistenciaCounterText.innerHTML = shownCount > 0
        ? `Mostrando <strong>1 - ${shownCount}</strong> de ${baseRows.length} entradas`
        : `Mostrando <strong>0</strong> de ${baseRows.length} entradas`;
    }
    if (paginationInfoText) {
      paginationInfoText.textContent = shownCount > 0
        ? `Mostrando 1 – ${shownCount} de ${baseRows.length} entradas`
        : 'Mostrando 0 entradas';
    }

    const pendingTotal = solicitudesList.filter(s => s.condicion !== 'Aprobado' && s.condicion !== 'Rechazado').length;
    if (pendingRequestsCount) {
      pendingRequestsCount.textContent = pendingTotal;
    }
  }

  function getDocenteEstadoIconSvg(estado) {
    const slug = normalizeEstadoSlug(estado);
    if (slug === 'observado') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="12" y1="8.2" x2="12" y2="12.5"></line><line x1="12" y1="15.8" x2="12.01" y2="15.8"></line></svg>';
    }
    if (slug === 'inasistencia') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="14.8" y1="9.2" x2="9.2" y2="14.8"></line><line x1="9.2" y1="9.2" x2="14.8" y2="14.8"></line></svg>';
    }
    if (slug === 'tardanza') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="12 7.5 12 12 15 13.8"></polyline></svg>';
    }
    if (slug === 'asistio') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="8.5 12.2 10.8 14.5 15.5 9.8"></polyline></svg>';
    }
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="8.5" y1="12" x2="15.5" y2="12"></line></svg>';
  }

  function getDocenteStatusBadgeIconSvg(metaCls) {
    if (metaCls === 'is-approved') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="8.5 12.2 10.8 14.5 15.5 9.8"></polyline></svg>';
    }
    if (metaCls === 'is-rejected') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="14.8" y1="9.2" x2="9.2" y2="14.8"></line><line x1="9.2" y1="9.2" x2="14.8" y2="14.8"></line></svg>';
    }
    if (metaCls === 'is-pending-coord') {
      return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20.5v-2a3.6 3.6 0 0 0-3.6-3.6H6.8a3.6 3.6 0 0 0-3.6 3.6v2"></path><circle cx="9.6" cy="7.6" r="3.6"></circle><line x1="19" y1="8.5" x2="19" y2="14.5"></line><line x1="16" y1="11.5" x2="22" y2="11.5"></line></svg>';
    }
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="12 7.5 12 12 15 13.8"></polyline></svg>';
  }

  function renderActionCellRectificacion(row, rectSol, reprogSol) {
    if (!canRectificarRow(row)) {
      return '<span class="text-no-solicitud" aria-label="No aplica">—</span>';
    }
    if (rectSol) {
      const meta = getStatusMetaForBadge(rectSol);
      return `
        <button type="button" class="btn-ver-solicitud-badge ${meta.cls}" data-action="view-solicitud" data-solicitud-id="${rectSol.id}" title="Ver detalle de rectificación (${rectSol.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2.5 14 8 19.5 8"></polyline>
          </svg>
          <span>${meta.label}</span>
        </button>
        <span class="stage-mini-note">${meta.stageHint}</span>
      `;
    }
    // Si la inasistencia ya tiene una Reprogramación aprobada, ya no requiere rectificar marcación
    if (row.estado === 'Inasistencia' && reprogSol && reprogSol.condicion === 'Aprobado') {
      return '<span class="text-no-solicitud" title="Sesión atendida mediante Reprogramación aprobada">—</span>';
    }
    if (isRowClosedCutoff(row)) {
      return `
        <span class="badge-fuera-corte" title="Fuera de corte de planilla (cierre: 11/10/2026). Solicitudes pasadas deben gestionarse por Planilla Manual RRAA.">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" ry="2"></rect>
            <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"></path>
          </svg>
          <span>Fuera de corte</span>
        </span>
      `;
    }
    if (!isRowWithinActiveCutoff(row)) {
      return '<span class="text-no-solicitud" title="Sesión fuera de corte vigente">—</span>';
    }
    const targetRoute = row.estado === 'Inasistencia' ? 'Director' : 'RRAA';
    return `
      <button type="button" class="btn-solicitud-ingresa" data-action="open-rectificacion" data-row-id="${row.id}"
        title="Solicitar rectificación de asistencia (Evaluador: ${targetRoute})">
        <span>Ingresar</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;
  }

  function renderActionCellReprogramacion(row, reprogSol, rectSol) {
    if (!canReprogramarRow(row)) {
      return '<span class="text-no-solicitud" aria-label="No aplica">—</span>';
    }
    if (reprogSol) {
      const meta = getStatusMetaForBadge(reprogSol);
      return `
        <button type="button" class="btn-ver-solicitud-badge ${meta.cls}" data-action="view-solicitud" data-solicitud-id="${reprogSol.id}" title="Ver detalle de reprogramación (${reprogSol.id})">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect>
            <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
            <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
            <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
          </svg>
          <span>${meta.label}</span>
        </button>
        <span class="stage-mini-note">${reprogSol.reprogTipoLabel || meta.stageHint}</span>
      `;
    }
    if (row.estado === 'Inasistencia' && rectSol && rectSol.condicion === 'Aprobado') {
      return '<span class="text-no-solicitud" title="Asistencia justificada vía Rectificación aprobada">—</span>';
    }
    if (isRowClosedCutoff(row)) {
      return `
        <span class="badge-fuera-corte" title="Sesión perteneciente al corte ya cerrado (hasta 11/10/2026).">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="2" ry="2"></rect>
            <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"></path>
          </svg>
          <span>Fuera de corte</span>
        </span>
      `;
    }
    return `
      <button type="button" class="btn-solicitud-ingresa btn-reprog-ingresa" data-action="open-reprogramacion" data-row-id="${row.id}"
        title="Registrar solicitud de reprogramación de clases (Aprobación: Director)">
        <span>Ingresar</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;
  }

  function renderTable(filterEstado = currentActivePillFilter) {
    currentActivePillFilter = filterEstado;
    solicitudesList = loadSolicitudes();
    const baseRows = getBaseFilteredRows();

    const filteredRows = filterEstado === 'todos'
      ? baseRows
      : baseRows.filter(row => normalizeEstadoSlug(row.estado) === filterEstado);

    updateSummaryCounters(baseRows, filteredRows.length);
    asistenciaTableBody.innerHTML = '';

    if (filteredRows.length === 0) {
      asistenciaTableBody.innerHTML = `
        <tr>
          <td colspan="16" style="padding: 36px 20px; text-align: center; color: #64748B; font-size: 13.5px;">
            No se encontraron sesiones programadas para los filtros y rango de fechas seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    filteredRows.forEach((row, index) => {
      const rectSol = getLatestSolicitudForRow(row.id, 'RECTIFICACION');
      const reprogSol = getLatestSolicitudForRow(row.id, 'REPROGRAMACION');
      const estadoSlug = normalizeEstadoSlug(row.estado);
      const isZeroInicio = row.regInicio === '00:00';
      const isZeroFin = row.regFin === '00:00';
      const durMin = (timeToMinutes(row.progFin) || 0) - (timeToMinutes(row.progInicio) || 0);
      const showDocenteTag = currentSubmitRole === 'coordinador' && currentCoordinadorDocenteCode === 'todos';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${index + 1}</td>
        <td class="td-fecha">
          ${row.fecha}
          <span class="td-fecha-sub">${getWeekdayShort(row.fechaIso)} • ${formatAcademicHoursLabel(durMin)}</span>
        </td>
        <td class="td-area">${row.programa}</td>
        <td class="td-curso" title="${row.curso} (${row.docente})">
          <span class="curso-title-clamp">${row.curso}</span>
          ${showDocenteTag ? `<span class="curso-docente-tag">${row.docente}</span>` : ''}
        </td>
        <td class="td-periodo">${row.periodo}</td>
        <td class="td-seccion">${row.seccion}</td>
        <td class="td-sesion">${row.sesion}</td>
        <td class="td-time-prog">${row.progInicio}</td>
        <td class="td-time-prog">${row.progFin}</td>
        <td class="td-time-reg ${isZeroInicio ? 'is-zero' : ''}">${row.regInicio}</td>
        <td class="td-time-reg ${isZeroFin ? 'is-zero' : ''}">${row.regFin}</td>
        <td class="${row.tardanza !== '-' ? 'td-tarda-val' : ''}">${row.tardanza}</td>
        <td>
          <span class="badge-estado estado-${estadoSlug}">${row.estado}</span>
        </td>
        <td>
          ${renderActionCellRectificacion(row, rectSol, reprogSol)}
        </td>
        <td>
          ${renderActionCellReprogramacion(row, reprogSol, rectSol)}
        </td>
        <td class="td-obs">${row.observacion}</td>
      `;
      asistenciaTableBody.appendChild(tr);
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const estado = pill.getAttribute('data-estado');
      renderTable(estado);
    });
  });

  // Delegación de eventos sobre filas de la tabla principal
  asistenciaTableBody.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');
    if (action === 'open-rectificacion') {
      const rowId = Number(actionEl.getAttribute('data-row-id'));
      const row = asistenciaData.find(r => r.id === rowId);
      if (row) openRectificacionModal(row);
    } else if (action === 'open-reprogramacion') {
      const rowId = Number(actionEl.getAttribute('data-row-id'));
      const row = asistenciaData.find(r => r.id === rowId);
      if (row) openReprogramacionModal(row);
    } else if (action === 'view-solicitud') {
      const solId = actionEl.getAttribute('data-solicitud-id');
      if (solId) openVistaSolicitudModal(solId);
    }
  });

  // ==========================================
  // 9. MODAL 1: RECTIFICACIÓN DE ASISTENCIA (INDEPENDIENTE)
  // ==========================================
  function clearRectErrors() {
    if (rectErrorSummary) rectErrorSummary.style.display = 'none';
    if (errorMsgDescanso) errorMsgDescanso.style.display = 'none';
    if (errorMsgAcademico) errorMsgAcademico.style.display = 'none';
    if (dropzoneDescanso) dropzoneDescanso.classList.remove('dropzone-error');
    if (dropzoneAcademico) dropzoneAcademico.classList.remove('dropzone-error');
    if (regMotivoAcademicoTexto) regMotivoAcademicoTexto.removeAttribute('aria-invalid');
  }

  function showRectError(msg, invalidControl) {
    if (rectErrorSummaryText) rectErrorSummaryText.textContent = msg;
    if (rectErrorSummary) {
      rectErrorSummary.style.display = 'flex';
      rectErrorSummary.focus();
    }
    const visibleEl = resolveVisibleControl(invalidControl);
    if (visibleEl) {
      visibleEl.setAttribute('aria-invalid', 'true');
    } else if (invalidControl) {
      invalidControl.setAttribute('aria-invalid', 'true');
    }
  }

  function openRectificacionModal(row) {
    currentSelectedRow = row;
    clearRectErrors();

    const approverLabel = row.estado === 'Inasistencia'
      ? 'Director de Escuela'
      : 'Registros Académicos (RRAA)';

    if (modalRegSubtitle) {
      modalRegSubtitle.textContent = `Corte vigente: ${ACTIVE_CUTOFF_LABEL} • Evaluador asignado: ${approverLabel}`;
    }

    // Seleccionar evaluador por defecto coherente en el select
    if (regJefeInmediato) {
      if (row.estado === 'Inasistencia') {
        regJefeInmediato.value = 'Dr. Juan Carlos Mendoza - Director de Escuela';
      } else {
        regJefeInmediato.value = 'Lic. Carlos Silva - Registros Académicos (RRAA)';
      }
      if (typeof syncSelectUI === 'function') syncSelectUI(regJefeInmediato);
    }

    const estadoSlug = normalizeEstadoSlug(row.estado);
    regSessionSummaryBox.innerHTML = `
      <div class="session-summary-header">
        <span class="session-summary-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect>
            <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
            <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
            <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
          </svg>
          <span>Datos de la sesión seleccionada</span>
        </span>
        <span class="badge-estado estado-${estadoSlug} session-summary-badge">${getDocenteEstadoIconSvg(row.estado)}<span>${row.estado}</span></span>
      </div>
      <div class="session-summary-grid">
        <div class="session-info-item span-2">
          <span class="info-label">Curso / Asignatura</span>
          <span class="info-val">${row.curso}</span>
        </div>
        <div class="session-info-item">
          <span class="info-label">Periodo / Sección</span>
          <span class="info-val">${row.periodo} • ${row.seccion} (${row.sesion})</span>
        </div>
        <div class="session-info-item">
          <span class="info-label">Docente Titular</span>
          <span class="info-val">${row.docente}</span>
        </div>
        <div class="session-info-item">
          <span class="info-label">Fecha Programada</span>
          <span class="info-val">${row.fecha} (${getWeekdayShort(row.fechaIso)})</span>
        </div>
        <div class="session-info-item ${row.estado === 'Inasistencia' ? 'is-highlight' : ''}">
          <span class="info-label">Horario Prog. / Marcado</span>
          <span class="info-val">${row.progInicio}–${row.progFin} (Reg: ${row.regInicio}–${row.regFin})</span>
        </div>
      </div>
    `;

    // Puente contextual si es Inasistencia y no tiene Reprogramación todavía
    const existingReprog = getLatestSolicitudForRow(row.id, 'REPROGRAMACION');
    if (inasistenciaBridgeBanner) {
      inasistenciaBridgeBanner.style.display = (row.estado === 'Inasistencia' && !existingReprog) ? 'flex' : 'none';
    }

    // Resetear tipo y campos
    const defaultType = row.estado === 'Inasistencia' ? 'academico' : 'descanso';
    selectRegularizacionType(defaultType);
    setCustomDateValue(regFechaInicioDM, row.fechaIso, false);
    setCustomDateValue(regFechaFinDM, shiftIsoDate(row.fechaIso, 1), false);
    if (regMotivoAcademicoTexto) regMotivoAcademicoTexto.value = '';
    resetDropzone('descanso');
    resetDropzone('academico');

    openModal(modalRegularizacion, btnCloseModalReg);
  }

  function selectRegularizacionType(type) {
    clearRectErrors();
    if (type === 'descanso') {
      typeDescansoRadio.checked = true;
      cardDescanso.classList.add('selected');
      cardAcademico.classList.remove('selected');
      formDescansoContainer.style.display = 'flex';
      formAcademicoContainer.style.display = 'none';
    } else {
      typeAcademicoRadio.checked = true;
      cardAcademico.classList.add('selected');
      cardDescanso.classList.remove('selected');
      formDescansoContainer.style.display = 'none';
      formAcademicoContainer.style.display = 'flex';
    }
  }

  if (cardDescanso) cardDescanso.addEventListener('click', () => selectRegularizacionType('descanso'));
  if (cardAcademico) cardAcademico.addEventListener('click', () => selectRegularizacionType('academico'));

  const healthRadioItems = document.querySelectorAll('.health-radio-item');
  healthRadioItems.forEach(item => {
    item.addEventListener('click', () => {
      healthRadioItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      const r = item.querySelector('input[type="radio"]');
      if (r) r.checked = true;
    });
  });

  if (btnSwitchToReprogramacion) {
    btnSwitchToReprogramacion.addEventListener('click', () => {
      const row = currentSelectedRow;
      closeModal(modalRegularizacion);
      if (row) openReprogramacionModal(row);
    });
  }

  // Dropzones
  function resetDropzone(type) {
    if (type === 'descanso') {
      attachedFileDescanso = null;
      if (fileDescansoInput) fileDescansoInput.value = '';
      if (dropzoneDescanso) {
        dropzoneDescanso.classList.remove('has-file', 'dropzone-error');
      }
      if (errorMsgDescanso) errorMsgDescanso.style.display = 'none';
    } else {
      attachedFileAcademico = null;
      if (fileAcademicoInput) fileAcademicoInput.value = '';
      if (dropzoneAcademico) {
        dropzoneAcademico.classList.remove('has-file', 'dropzone-error');
      }
      if (errorMsgAcademico) errorMsgAcademico.style.display = 'none';
    }
  }

  function handleFileSelection(file, type) {
    if (!file) return;
    if (type === 'descanso') {
      attachedFileDescanso = file;
      if (fileNameDescanso) fileNameDescanso.textContent = file.name;
      if (dropzoneDescanso) {
        dropzoneDescanso.classList.add('has-file');
        dropzoneDescanso.classList.remove('dropzone-error');
      }
      if (errorMsgDescanso) errorMsgDescanso.style.display = 'none';
    } else {
      attachedFileAcademico = file;
      if (fileNameAcademico) fileNameAcademico.textContent = file.name;
      if (dropzoneAcademico) {
        dropzoneAcademico.classList.add('has-file');
        dropzoneAcademico.classList.remove('dropzone-error');
      }
      if (errorMsgAcademico) errorMsgAcademico.style.display = 'none';
    }
  }

  function setupDropzone(dropzoneEl, inputEl, removeBtn, type) {
    if (!dropzoneEl || !inputEl) return;
    dropzoneEl.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-attached-file')) return;
      inputEl.click();
    });
    dropzoneEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inputEl.click();
      }
    });
    dropzoneEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzoneEl.classList.add('dragover');
    });
    dropzoneEl.addEventListener('dragleave', () => dropzoneEl.classList.remove('dragover'));
    dropzoneEl.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzoneEl.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0], type);
      }
    });
    inputEl.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0], type);
      }
    });
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetDropzone(type);
      });
    }
  }

  setupDropzone(dropzoneDescanso, fileDescansoInput, btnRemoveFileDescanso, 'descanso');
  setupDropzone(dropzoneAcademico, fileAcademicoInput, btnRemoveFileAcademico, 'academico');

  if (btnCloseModalReg) btnCloseModalReg.addEventListener('click', () => closeModal(modalRegularizacion));
  if (btnCancelarReg) btnCancelarReg.addEventListener('click', () => closeModal(modalRegularizacion));

  if (btnGuardarRegularizacion) {
    btnGuardarRegularizacion.addEventListener('click', () => {
      if (!currentSelectedRow) return;
      clearRectErrors();

      const isDescanso = typeDescansoRadio.checked;
      let motivo = '';
      let archivo = '';
      let detalleSalud = '';
      let fechaInicioDM = '';
      let fechaFinDM = '';

      if (isDescanso) {
        fechaInicioDM = regFechaInicioDM.value;
        fechaFinDM = regFechaFinDM.value;
        if (!fechaInicioDM || !fechaFinDM || compareIsoDates(fechaFinDM, fechaInicioDM) < 0) {
          showRectError('La fecha fin del descanso médico no puede ser anterior a la fecha de inicio.', regFechaFinDM);
          return;
        }
        if (!attachedFileDescanso) {
          dropzoneDescanso.classList.add('dropzone-error');
          errorMsgDescanso.style.display = 'flex';
          showRectError('Debe adjuntar el certificado médico / sustento correspondiente.', null);
          return;
        }
        const saludChecked = document.querySelector('input[name="tipoSalud"]:checked');
        detalleSalud = saludChecked ? saludChecked.value : 'EsSalud';
        motivo = `Descanso médico (${detalleSalud}) del ${formatIsoToDisplay(fechaInicioDM)} al ${formatIsoToDisplay(fechaFinDM)}.`;
        archivo = attachedFileDescanso.name;
      } else {
        motivo = regMotivoAcademicoTexto.value.trim();
        if (!motivo) {
          showRectError('Ingrese el detalle o justificación de la rectificación de asistencia.', regMotivoAcademicoTexto);
          regMotivoAcademicoTexto.focus();
          return;
        }
        if (!attachedFileAcademico) {
          dropzoneAcademico.classList.add('dropzone-error');
          errorMsgAcademico.style.display = 'flex';
          showRectError('Debe adjuntar el documento de sustento para validar la rectificación.', null);
          return;
        }
        archivo = attachedFileAcademico.name;
      }

      const goesToDirector = currentSelectedRow.estado === 'Inasistencia';
      const etapaActual = goesToDirector ? 'DIRECTOR' : 'RRAA';
      const condicion = goesToDirector ? 'Pendiente Director' : 'Solicitado';
      const aprobadorAsignado = goesToDirector
        ? 'Director de Escuela - Dr. Juan Carlos Mendoza'
        : 'RRAA - Lic. Carlos Silva';

      const durMin = (timeToMinutes(currentSelectedRow.progFin) || 0) - (timeToMinutes(currentSelectedRow.progInicio) || 0);
      const cutoffOriginal = getPayrollCutoffInfo(currentSelectedRow.fechaIso);

      pendingSubmissionPayload = {
        id: `REG-2026-${100 + solicitudesList.length + 1}`,
        schemaVersion: SCHEMA_VERSION,
        asistenciaId: currentSelectedRow.id,
        tramite: 'RECTIFICACION',
        docenteCodigo: currentSelectedRow.docenteCodigo,
        docente: currentSelectedRow.docente,
        solicitadoPorRol: currentSubmitRole === 'coordinador' ? 'Coordinador' : 'Docente',
        solicitadoPorNombre: currentSubmitRole === 'coordinador' ? COORDINADOR_PROFILE.nombre : currentSelectedRow.docente,
        periodo: currentSelectedRow.periodo,
        programa: currentSelectedRow.programa,
        facultad: currentSelectedRow.facultad,
        curso: currentSelectedRow.curso,
        seccion: currentSelectedRow.seccion,
        sesion: currentSelectedRow.sesion,
        aulaOriginal: currentSelectedRow.aulaOriginal,
        fechaOriginalIso: currentSelectedRow.fechaIso,
        fechaOriginal: currentSelectedRow.fecha,
        horarioProgInicio: currentSelectedRow.progInicio,
        horarioProgFin: currentSelectedRow.progFin,
        duracionOriginalMin: durMin,
        horarioRegInicio: currentSelectedRow.regInicio,
        horarioRegFin: currentSelectedRow.regFin,
        estadoOriginal: currentSelectedRow.estado,
        tardanzaMin: currentSelectedRow.tardanza,
        observacionOriginal: currentSelectedRow.observacion,
        tipoRegularizacion: isDescanso ? 'Descanso Médico' : 'Motivo Académico',
        detalleSalud,
        fechaInicioDM,
        fechaFinDM,
        motivo,
        archivoNombre: archivo,
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
        cortePlanillaOriginal: cutoffOriginal.label,
        cortePlanillaPago: cutoffOriginal.label,
        notaPlanilla: `Rectificación ingresada dentro del corte vigente (${cutoffOriginal.label}).`,
        requiereCoordinador: false,
        etapaActual,
        condicion,
        aprobadorAsignado,
        fechaSolicitudIso: SYSTEM_TODAY_ISO,
        fechaSolicitud: getCurrentDateTimeFormatted(),
        comentarioEvaluador: '',
        motivoRechazo: '',
        fechaResolucion: '',
        resolucionPor: ''
      };

      openConfirmacionModal(
        'Confirmar envío de Rectificación',
        `Se registrará la solicitud de rectificación para ${currentSelectedRow.curso} (${currentSelectedRow.fecha}) con sustento "${archivo}".`,
        `Ruta de aprobación: ${aprobadorAsignado}`
      );
    });
  }

  // ==========================================
  // 10. MODAL 2: REPROGRAMACIÓN DE CLASES (INDEPENDIENTE)
  // ==========================================
  const MODE_META = {
    recuperacion_normal: {
      label: 'Recuperación normal',
      ruleText: 'Programa una fecha igual o posterior a la clase original manteniendo exactamente su duración académica.',
      routeText: 'Aprobación directa: Director de Escuela'
    },
    adelanto: {
      label: 'Adelanto',
      ruleText: 'Programa la sesión en una fecha anterior a la clase original con exactamente la misma duración.',
      routeText: 'Aprobación directa: Director de Escuela'
    },
    reemplazo: {
      label: 'Reemplazo',
      ruleText: 'El Coordinador asignará un "Docente (A Programar) activo" distinto al titular antes de pasar al Director.',
      routeText: 'Flujo: Coordinador Académico → Director de Escuela'
    },
    recuperacion_feriado: {
      label: 'Recuperación por feriados',
      ruleText: 'Permite ajustar fecha/aula por feriado y opcionalmente solicitar cambio de docente.',
      routeText: 'Aprobación: Director (o Coord. → Director si cambia docente)'
    }
  };

  function getSelectedReprogMode() {
    const checked = document.querySelector('input[name="reprogModalidad"]:checked');
    return checked ? checked.value : 'recuperacion_normal';
  }

  function getOriginalDurationMinutes() {
    if (!currentSelectedRow) return 45;
    const start = timeToMinutes(currentSelectedRow.progInicio) || 0;
    const end = timeToMinutes(currentSelectedRow.progFin) || 0;
    return Math.max(15, end - start);
  }

  function resolveVisibleControl(el) {
    if (!el) return null;
    if (el.type === 'hidden') {
      const display = document.getElementById(`${el.id}Display`);
      if (display) return display;
    }
    if (el.tagName === 'SELECT') {
      const wrap = el.closest('.modal-select-wrapper');
      if (wrap) {
        const customTrigger = wrap.querySelector('.custom-select-trigger');
        if (customTrigger) return customTrigger;
      }
    }
    return el;
  }

  function clearReprogErrors() {
    if (errorMsgReprogramacion) errorMsgReprogramacion.style.display = 'none';
    [reprogSede, reprogAula, reprogFecha, reprogHoraInicio, reprogHoraFin, reprogMotivo].forEach(el => {
      const visibleEl = resolveVisibleControl(el);
      if (visibleEl) visibleEl.removeAttribute('aria-invalid');
      if (el) el.removeAttribute('aria-invalid');
    });
  }

  function showReprogError(message, focusTarget) {
    if (errorMsgReprogText) errorMsgReprogText.textContent = message;
    if (errorMsgReprogramacion) {
      errorMsgReprogramacion.style.display = 'flex';
      errorMsgReprogramacion.focus();
    }
    const visibleTarget = resolveVisibleControl(focusTarget);
    if (visibleTarget) {
      visibleTarget.setAttribute('aria-invalid', 'true');
    }
  }

  function updateReprogLiveUI() {
    if (!currentSelectedRow) return;
    const mode = getSelectedReprogMode();
    const meta = MODE_META[mode];
    const origDur = getOriginalDurationMinutes();
    const needsCoord = mode === 'reemplazo' || (mode === 'recuperacion_feriado' && reprogFeriadoCambioDocente.checked);

    // Resaltar tarjetas activas
    document.querySelectorAll('.reprog-mode-card').forEach(card => {
      const r = card.querySelector('input[type="radio"]');
      card.classList.toggle('active', Boolean(r && r.checked));
    });

    if (feriadoCambioDocenteWrap) {
      feriadoCambioDocenteWrap.style.display = mode === 'recuperacion_feriado' ? 'inline-flex' : 'none';
    }

    if (reprogModeRuleStrip) {
      reprogModeRuleStrip.innerHTML = `
        <span><strong>Regla:</strong> ${meta.ruleText}</span>
        <span style="color: #0F848F; font-weight: 700;">${needsCoord ? 'Flujo: Coordinador → Director' : meta.routeText}</span>
      `;
    }

    if (needsCoord) {
      if (reprogDocenteDisplay) {
        reprogDocenteDisplay.textContent = 'Pendiente de asignación por Coordinación';
        reprogDocenteDisplay.classList.add('is-reemplazo');
      }
      reprogDocenteStageTag.textContent = 'Por Asignar (Coord.)';
      reprogDocenteStageTag.className = 'badge-role-tag role-reemplazo';
      reprogDocenteHelper.textContent = 'El Coordinador Académico asignará al Docente (A Programar) activo antes de enviar al Director.';
    } else {
      if (reprogDocenteDisplay) {
        reprogDocenteDisplay.textContent = `${currentSelectedRow.docente} (Titular)`;
        reprogDocenteDisplay.classList.remove('is-reemplazo');
      }
      reprogDocenteStageTag.textContent = 'Titular';
      reprogDocenteStageTag.className = 'badge-role-tag role-titular';
      reprogDocenteHelper.textContent = 'El docente titular dictará la sesión en la nueva programación.';
    }

    // Cálculo en tiempo real de Duración
    const startMin = timeToMinutes(reprogHoraInicio.value);
    const endMin = timeToMinutes(reprogHoraFin.value);
    if (startMin === null || endMin === null || endMin <= startMin) {
      reprogDurationPill.className = 'reprog-duration-pill mismatch';
      reprogDurationValue.textContent = '--:--';
      reprogDurationHint.textContent = 'Horario inválido';
    } else {
      const diff = endMin - startMin;
      reprogDurationValue.textContent = formatDurationHM(diff);
      if (diff === origDur) {
        reprogDurationPill.className = 'reprog-duration-pill match';
        reprogDurationHint.textContent = `${formatAcademicHoursLabel(diff)} • Exacta`;
      } else if (diff < origDur) {
        reprogDurationPill.className = 'reprog-duration-pill mismatch';
        reprogDurationHint.textContent = `Menor a ${formatDurationHM(origDur)}`;
      } else {
        reprogDurationPill.className = 'reprog-duration-pill mismatch';
        reprogDurationHint.textContent = `Mayor a ${formatDurationHM(origDur)}`;
      }
    }

    // Nota de corte de planilla
    const fechaProp = reprogFecha.value;
    const cutoff = getPayrollCutoffInfo(fechaProp);
    let noticeClass = 'notice-current';
    let noticeText = '';
    if (mode === 'adelanto') {
      noticeClass = cutoff.status === 'future' ? 'notice-next' : 'notice-current';
      noticeText = `Política de planilla (Adelanto): El pago corresponde al corte ${cutoff.label} solo después de dictarse efectivamente la sesión (no se pagan clases no dictadas).`;
    } else if (cutoff.status === 'future') {
      noticeClass = 'notice-next';
      noticeText = `Aviso de corte de planilla: Al dictarse fuera del cierre del 11/11/2026, el pago correspondiente pasará al siguiente corte (${cutoff.label}).`;
    } else {
      noticeClass = 'notice-current';
      noticeText = `Dentro del corte de planilla vigente (${cutoff.label}). El pago aplica al cierre del 11/11/2026 una vez dictada la clase.`;
    }
    if (reprogPlanillaNotice) {
      reprogPlanillaNotice.className = `reprog-planilla-notice ${noticeClass}`;
      reprogPlanillaNotice.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;" aria-hidden="true">
          <circle cx="12" cy="12" r="9.2"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8.2" x2="12.01" y2="8.2"></line>
        </svg>
        <span>${noticeText}</span>
      `;
    }
  }

  function applySuggestedDateForMode(mode) {
    if (!currentSelectedRow) return;
    let targetIso = '';
    if (mode === 'adelanto') {
      // Sugerir 2 días antes de la fecha original, sin retroceder antes de hoy
      const candidate = shiftIsoDate(currentSelectedRow.fechaIso, -2);
      targetIso = compareIsoDates(candidate, SYSTEM_TODAY_ISO) >= 0 ? candidate : SYSTEM_TODAY_ISO;
    } else {
      const base = compareIsoDates(currentSelectedRow.fechaIso, SYSTEM_TODAY_ISO) >= 0
        ? currentSelectedRow.fechaIso
        : SYSTEM_TODAY_ISO;
      targetIso = shiftIsoDate(base, 2);
    }
    setCustomDateValue(reprogFecha, targetIso, false);
  }

  function openReprogramacionModal(row) {
    currentSelectedRow = row;
    clearReprogErrors();

    const origDur = getOriginalDurationMinutes();
    if (modalReprogSubtitle) {
      modalReprogSubtitle.textContent = `Sesión: ${row.fecha} (${row.progInicio} – ${row.progFin}) • Duración obligatoria: ${formatDurationHM(origDur)} (${formatAcademicHoursLabel(origDur)})`;
    }

    // Paso 1: Información del curso (elementos de lectura sin focus ni apariencia editable)
    if (reprogInfoPeriodo) reprogInfoPeriodo.textContent = row.periodo;
    if (reprogInfoPrograma) reprogInfoPrograma.textContent = row.programa;
    if (reprogInfoCurso) reprogInfoCurso.textContent = row.curso;
    if (reprogInfoSeccion) reprogInfoSeccion.textContent = row.seccion;
    if (reprogInfoSesion) reprogInfoSesion.textContent = row.sesion;
    if (reprogInfoDocente) reprogInfoDocente.textContent = row.docente;

    // Paso 2: Horario actual
    reprogCurrentFecha.textContent = `${row.fecha} (${getWeekdayShort(row.fechaIso)})`;
    reprogCurrentHorario.textContent = `${row.progInicio} – ${row.progFin}`;
    reprogCurrentDuracion.textContent = `${formatDurationHM(origDur)} (${formatAcademicHoursLabel(origDur)})`;
    reprogCurrentAula.textContent = row.aulaOriginal || 'A-101';

    // Modalidad inicial inteligente según estado/fecha
    let defaultMode = 'recuperacion_normal';
    if (row.estado === 'Sin Estado') {
      defaultMode = row.observacion.toLowerCase().includes('feriado') ? 'recuperacion_feriado' : 'adelanto';
    }
    const radioToSelect = document.querySelector(`input[name="reprogModalidad"][value="${defaultMode}"]`);
    if (radioToSelect) radioToSelect.checked = true;
    if (reprogFeriadoCambioDocente) reprogFeriadoCambioDocente.checked = false;

    // Paso 3 defaults (Hora fin automática basada en duración original, editable!)
    reprogSede.value = row.sedeOriginal || 'Sede Principal - Av. Arequipa';
    reprogAula.value = row.aulaOriginal || 'A-101';
    if (typeof syncSelectUI === 'function') {
      syncSelectUI(reprogSede);
      syncSelectUI(reprogAula);
    }
    applySuggestedDateForMode(defaultMode);
    reprogHoraInicio.value = row.progInicio;
    reprogHoraFin.value = minutesToTime((timeToMinutes(row.progInicio) || 0) + origDur);

    reprogMotivo.value = '';
    if (charCountReprogMotivo) charCountReprogMotivo.textContent = '0';

    updateReprogLiveUI();
    openModal(modalReprogramacion, btnCloseModalReprog);
  }

  reprogModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      clearReprogErrors();
      applySuggestedDateForMode(radio.value);
      updateReprogLiveUI();
    });
  });

  if (reprogFeriadoCambioDocente) {
    reprogFeriadoCambioDocente.addEventListener('change', () => {
      clearReprogErrors();
      updateReprogLiveUI();
    });
  }

  // Autocalcular Hora Fin cuando cambia Hora Inicio (pero manteniendo Hora Fin editable!)
  if (reprogHoraInicio) {
    reprogHoraInicio.addEventListener('change', () => {
      const startMin = timeToMinutes(reprogHoraInicio.value);
      if (startMin !== null) {
        reprogHoraFin.value = minutesToTime(startMin + getOriginalDurationMinutes());
      }
      clearReprogErrors();
      updateReprogLiveUI();
    });
  }

  if (reprogHoraFin) {
    reprogHoraFin.addEventListener('change', () => {
      clearReprogErrors();
      updateReprogLiveUI();
    });
  }

  if (reprogFecha) {
    reprogFecha.addEventListener('change', () => {
      clearReprogErrors();
      updateReprogLiveUI();
    });
  }

  if (reprogMotivo && charCountReprogMotivo) {
    reprogMotivo.addEventListener('input', () => {
      charCountReprogMotivo.textContent = reprogMotivo.value.length;
      if (reprogMotivo.hasAttribute('aria-invalid')) {
        reprogMotivo.removeAttribute('aria-invalid');
      }
    });
  }

  if (btnCloseModalReprog) btnCloseModalReprog.addEventListener('click', () => closeModal(modalReprogramacion));
  if (btnCancelarReprog) btnCancelarReprog.addEventListener('click', () => closeModal(modalReprogramacion));

  if (btnEnviarReprogramacion) {
    btnEnviarReprogramacion.addEventListener('click', () => {
      if (!currentSelectedRow) return;
      clearReprogErrors();

      const mode = getSelectedReprogMode();
      const meta = MODE_META[mode];
      const sede = reprogSede.value;
      const aula = reprogAula.value;
      const fechaProp = reprogFecha.value;
      const hInicio = reprogHoraInicio.value;
      const hFin = reprogHoraFin.value;
      const motivo = reprogMotivo.value.trim();

      if (!sede) {
        showReprogError('Seleccione la sede donde se dictará la clase reprogramada.', reprogSede);
        return;
      }
      if (!aula) {
        showReprogError('Seleccione el aula para la nueva programación.', reprogAula);
        return;
      }
      if (!fechaProp) {
        showReprogError('Seleccione el día propuesto para la reprogramación.', reprogFecha);
        return;
      }
      const startMin = timeToMinutes(hInicio);
      const endMin = timeToMinutes(hFin);
      if (startMin === null || endMin === null || endMin <= startMin) {
        showReprogError('La hora de fin debe ser posterior a la hora de inicio.', reprogHoraFin);
        return;
      }

      const origDur = getOriginalDurationMinutes();
      const newDur = endMin - startMin;

      // Validaciones de fecha y rango horario según modalidad
      if (mode === 'recuperacion_normal') {
        if (compareIsoDates(fechaProp, currentSelectedRow.fechaIso) < 0) {
          showReprogError(`En Recuperación normal la nueva fecha (${formatIsoToDisplay(fechaProp)}) no puede ser anterior a la clase original (${currentSelectedRow.fecha}). Si deseas dictarla antes, elige "Adelanto".`, reprogFecha);
          return;
        }
        if (compareIsoDates(fechaProp, SYSTEM_TODAY_ISO) < 0) {
          showReprogError('La fecha de recuperación no puede ubicarse en días pasados anteriores a hoy (11/11/2026).', reprogFecha);
          return;
        }
        if (newDur < origDur) {
          showReprogError(`El rango horario elegido (${formatDurationHM(newDur)}) es menor al de la clase original (${formatDurationHM(origDur)} / ${formatAcademicHoursLabel(origDur)}). No se puede guardar la reprogramación.`, reprogHoraFin);
          return;
        }
        if (newDur > origDur) {
          showReprogError(`La recuperación normal debe respetar exactamente la duración original de ${formatDurationHM(origDur)} (${formatAcademicHoursLabel(origDur)}).`, reprogHoraFin);
          return;
        }
      } else if (mode === 'adelanto') {
        if (compareIsoDates(fechaProp, currentSelectedRow.fechaIso) >= 0) {
          showReprogError(`Un Adelanto solo puede programarse para una fecha anterior a la clase original (${currentSelectedRow.fecha}). Si será después, selecciona "Recuperación normal".`, reprogFecha);
          return;
        }
        if (compareIsoDates(fechaProp, SYSTEM_TODAY_ISO) < 0) {
          showReprogError(`No se puede adelantar una sesión hacia una fecha pasada (${formatIsoToDisplay(fechaProp)}) anterior a hoy (11/11/2026).`, reprogFecha);
          return;
        }
        if (newDur > origDur) {
          showReprogError(`El rango horario elegido (${formatDurationHM(newDur)}) es mayor al de la clase original (${formatDurationHM(origDur)}). No se puede guardar el adelanto.`, reprogHoraFin);
          return;
        }
        if (newDur < origDur) {
          showReprogError(`El adelanto debe mantener exactamente la misma duración original de ${formatDurationHM(origDur)} (${formatAcademicHoursLabel(origDur)}).`, reprogHoraFin);
          return;
        }
      } else {
        if (compareIsoDates(fechaProp, SYSTEM_TODAY_ISO) < 0) {
          showReprogError('La fecha propuesta debe ser igual o posterior a hoy (11/11/2026).', reprogFecha);
          return;
        }
        if (newDur !== origDur) {
          showReprogError(`La sesión reprogramada debe mantener exactamente la duración original de ${formatDurationHM(origDur)} (${formatAcademicHoursLabel(origDur)}).`, reprogHoraFin);
          return;
        }
      }

      if (!motivo) {
        showReprogError('Ingrese el motivo académico o institucional de la reprogramación.', reprogMotivo);
        reprogMotivo.focus();
        return;
      }

      const cambioDocente = mode === 'reemplazo' || (mode === 'recuperacion_feriado' && reprogFeriadoCambioDocente.checked);
      const etapaActual = cambioDocente ? 'COORDINADOR' : 'DIRECTOR';
      const condicion = cambioDocente ? 'Pendiente Coordinador' : 'Pendiente Director';
      const aprobadorAsignado = cambioDocente
        ? 'Coordinador - Lic. Denssy López'
        : 'Director de Escuela - Dr. Juan Carlos Mendoza';

      const cutoffOrig = getPayrollCutoffInfo(currentSelectedRow.fechaIso);
      const cutoffPago = getPayrollCutoffInfo(fechaProp);
      let notaPlanilla = '';
      if (mode === 'adelanto') {
        notaPlanilla = `Adelanto sujeto a dictado efectivo en el corte ${cutoffPago.label} (no se pagan clases antes de dictarlas).`;
      } else if (cutoffPago.status === 'future') {
        notaPlanilla = `Programada después del cierre del 11/11/2026: el pago se procesará en el corte ${cutoffPago.label} tras el dictado.`;
      } else {
        notaPlanilla = `Programada dentro del corte vigente (${cutoffPago.label}).`;
      }

      pendingSubmissionPayload = {
        id: `REPROG-2026-${100 + solicitudesList.length + 1}`,
        schemaVersion: SCHEMA_VERSION,
        asistenciaId: currentSelectedRow.id,
        tramite: 'REPROGRAMACION',
        docenteCodigo: currentSelectedRow.docenteCodigo,
        docente: currentSelectedRow.docente,
        solicitadoPorRol: currentSubmitRole === 'coordinador' ? 'Coordinador' : 'Docente',
        solicitadoPorNombre: currentSubmitRole === 'coordinador' ? COORDINADOR_PROFILE.nombre : currentSelectedRow.docente,
        periodo: currentSelectedRow.periodo,
        programa: currentSelectedRow.programa,
        facultad: currentSelectedRow.facultad,
        curso: currentSelectedRow.curso,
        seccion: currentSelectedRow.seccion,
        sesion: currentSelectedRow.sesion,
        aulaOriginal: currentSelectedRow.aulaOriginal,
        fechaOriginalIso: currentSelectedRow.fechaIso,
        fechaOriginal: currentSelectedRow.fecha,
        horarioProgInicio: currentSelectedRow.progInicio,
        horarioProgFin: currentSelectedRow.progFin,
        duracionOriginalMin: origDur,
        horarioRegInicio: currentSelectedRow.regInicio,
        horarioRegFin: currentSelectedRow.regFin,
        estadoOriginal: currentSelectedRow.estado,
        tardanzaMin: currentSelectedRow.tardanza,
        observacionOriginal: currentSelectedRow.observacion,
        tipoRegularizacion: null,
        detalleSalud: '',
        motivo,
        archivoNombre: '',
        reprogTipo: mode,
        reprogTipoLabel: meta.label,
        cambioDocente,
        docenteReemplazoCodigo: '',
        docenteReemplazo: cambioDocente ? '' : currentSelectedRow.docente,
        sedeNueva: sede,
        aulaNueva: aula,
        fechaNuevaIso: fechaProp,
        fechaNueva: formatIsoToDisplay(fechaProp),
        horaInicioNueva: hInicio,
        horaFinNueva: hFin,
        duracionNuevaMin: newDur,
        cortePlanillaOriginal: cutoffOrig.label,
        cortePlanillaPago: cutoffPago.label,
        notaPlanilla,
        requiereCoordinador: cambioDocente,
        etapaActual,
        condicion,
        aprobadorAsignado,
        fechaSolicitudIso: SYSTEM_TODAY_ISO,
        fechaSolicitud: getCurrentDateTimeFormatted(),
        comentarioEvaluador: '',
        motivoRechazo: '',
        fechaResolucion: '',
        resolucionPor: ''
      };

      const flowDesc = cambioDocente
        ? '1° Coordinador (asigna Docente A Programar activo) → 2° Director de Escuela'
        : 'Director de Escuela (Dr. Juan Carlos Mendoza)';

      openConfirmacionModal(
        `Confirmar ${meta.label}`,
        `Se enviará la reprogramación para el ${formatIsoToDisplay(fechaProp)} (${hInicio} – ${hFin}) en ${sede}, Aula ${aula}.`,
        `Flujo: ${flowDesc}`
      );
    });
  }

  // ==========================================
  // 11. CONFIRMACIÓN Y PUENTE POST-RECTIFICACIÓN INASISTENCIA
  // ==========================================
  function openConfirmacionModal(titleText, bodyText, routeText) {
    const titleEl = document.getElementById('modalConfirmTitle');
    if (titleEl) titleEl.textContent = titleText;
    if (confirmSalutationText) {
      confirmSalutationText.textContent = currentSubmitRole === 'coordinador'
        ? `Coordinador (${COORDINADOR_PROFILE.nombre}):`
        : 'Estimado docente,';
    }
    if (confirmBodyText) confirmBodyText.textContent = bodyText;
    if (confirmRouteBadge) {
      if (routeText) {
        confirmRouteBadge.textContent = routeText;
        confirmRouteBadge.style.display = 'inline-block';
      } else {
        confirmRouteBadge.style.display = 'none';
      }
    }
    openModal(modalConfirmacionRegularizacion, btnConformeConfirmacion);
  }

  if (btnCancelarConfirmacion) {
    btnCancelarConfirmacion.addEventListener('click', () => {
      pendingSubmissionPayload = null;
      closeModal(modalConfirmacionRegularizacion);
    });
  }

  if (btnConformeConfirmacion) {
    btnConformeConfirmacion.addEventListener('click', () => {
      if (!pendingSubmissionPayload) return;

      const created = pendingSubmissionPayload;
      pendingSubmissionPayload = null;

      solicitudesList.unshift(created);
      saveSolicitudes(solicitudesList);

      closeModal(modalConfirmacionRegularizacion);
      closeModal(modalRegularizacion);
      closeModal(modalReprogramacion);

      renderTable(currentActivePillFilter);

      // Si acaba de rectificar una Inasistencia y no tiene Reprogramación aún, ofrecer puente amigable
      const hasReprog = getLatestSolicitudForRow(created.asistenciaId, 'REPROGRAMACION');
      if (created.tramite === 'RECTIFICACION' && created.estadoOriginal === 'Inasistencia' && !hasReprog && modalInasistenciaBridge) {
        lastCreatedInasistenciaRow = asistenciaData.find(r => r.id === created.asistenciaId) || null;
        if (bridgeTicketCode) bridgeTicketCode.textContent = created.id;
        openModal(modalInasistenciaBridge, btnBridgeSoloRectificacion);
      } else {
        showToast(`Solicitud ${created.id} enviada correctamente a ${created.aprobadorAsignado}.`);
      }
    });
  }

  if (btnBridgeSoloRectificacion) {
    btnBridgeSoloRectificacion.addEventListener('click', () => {
      closeModal(modalInasistenciaBridge);
      showToast('Rectificación de Inasistencia derivada al Director de Escuela.');
    });
  }

  if (btnBridgeAbrirReprog) {
    btnBridgeAbrirReprog.addEventListener('click', () => {
      closeModal(modalInasistenciaBridge);
      if (lastCreatedInasistenciaRow) {
        openReprogramacionModal(lastCreatedInasistenciaRow);
      }
    });
  }

  // ==========================================
  // 12. VISTA DETALLADA DE SOLICITUD E HISTORIAL
  // ==========================================
  function getVistaStepIconSvg(kind) {
    if (kind === 'done') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12.5 9.8 17.2 19 8"></polyline></svg>';
    }
    if (kind === 'rejected') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="12" y1="8" x2="12" y2="12.4"></line><line x1="12" y1="15.8" x2="12.01" y2="15.8"></line></svg>';
    }
    if (kind === 'skipped') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="12" x2="18" y2="12"></line></svg>';
    }
    if (kind === 'coord') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20v-1.8a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 18.2V20"></path><circle cx="10" cy="7.5" r="3.4"></circle><line x1="19" y1="8.5" x2="19" y2="14.5"></line><line x1="16" y1="11.5" x2="22" y2="11.5"></line></svg>';
    }
    if (kind === 'director' || kind === 'shield') {
      return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8l7.2 3v5.4c0 4.6-3 8.5-7.2 9.8-4.2-1.3-7.2-5.2-7.2-9.8V5.8l7.2-3z"></path><polyline points="9 12 11 14 15.2 9.8"></polyline></svg>';
    }
    return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="12 7.5 12 12 15 13.8"></polyline></svg>';
  }

  function buildVistaStepperHtml(sol) {
    const isReprog = sol.tramite === 'REPROGRAMACION';
    const isAprob = sol.condicion === 'Aprobado';
    const isRechaz = sol.condicion === 'Rechazado';
    const isPendCoord = sol.condicion === 'Pendiente Coordinador';
    const isPendDir = sol.condicion === 'Pendiente Director' || sol.condicion === 'Solicitado';

    const step1 = {
      cls: 'is-done',
      icon: getVistaStepIconSvg('done'),
      name: 'Solicitud ingresada',
      sub: `${sol.solicitadoPorRol} (${sol.fechaSolicitud})`
    };

    let step2 = { cls: 'is-skipped', icon: getVistaStepIconSvg('skipped'), name: 'Coordinación', sub: 'Flujo directo' };
    let step3 = { cls: '', icon: getVistaStepIconSvg('director'), name: isReprog ? 'Director de Escuela' : (sol.estadoAsistenciaOriginal === 'Inasistencia' ? 'Director de Escuela' : 'Registros Acad. / Dir.'), sub: 'En espera' };

    if (isReprog && sol.cambioDocente) {
      step2 = isPendCoord
        ? { cls: 'is-current', icon: getVistaStepIconSvg('coord'), name: 'Coordinación Acad.', sub: 'Asignando reemplazo' }
        : { cls: 'is-done', icon: getVistaStepIconSvg('done'), name: 'Coordinación Acad.', sub: sol.docenteReemplazo ? 'Docente asignado' : 'Validado' };
      if (isPendDir) {
        step3 = { cls: 'is-current', icon: getVistaStepIconSvg('director'), name: 'Director de Escuela', sub: 'En evaluación' };
      } else if (isAprob) {
        step3 = { cls: 'is-done', icon: getVistaStepIconSvg('done'), name: 'Director de Escuela', sub: 'Aprobado' };
      } else if (isRechaz) {
        step3 = { cls: 'is-rejected', icon: getVistaStepIconSvg('rejected'), name: 'Resolución final', sub: 'Observado / Rechazado' };
      }
    } else if (isReprog) {
      step2 = { cls: 'is-skipped', icon: getVistaStepIconSvg('skipped'), name: 'Coordinación Acad.', sub: 'No requerida' };
      if (isPendDir) {
        step3 = { cls: 'is-current', icon: getVistaStepIconSvg('director'), name: 'Director de Escuela', sub: 'En evaluación' };
      } else if (isAprob) {
        step3 = { cls: 'is-done', icon: getVistaStepIconSvg('done'), name: 'Director de Escuela', sub: 'Aprobado' };
      } else if (isRechaz) {
        step3 = { cls: 'is-rejected', icon: getVistaStepIconSvg('rejected'), name: 'Director de Escuela', sub: 'Rechazado' };
      }
    } else {
      const esDir = (sol.aprobadorAsignado || '').toLowerCase().includes('director');
      step2 = {
        cls: isAprob ? 'is-done' : isRechaz ? 'is-rejected' : 'is-current',
        icon: isAprob ? getVistaStepIconSvg('done') : isRechaz ? getVistaStepIconSvg('rejected') : getVistaStepIconSvg('wait'),
        name: esDir ? 'Director de Escuela' : 'Registros Acad. (RRAA)',
        sub: isAprob ? 'Validado' : isRechaz ? 'Rechazado' : 'En revisión'
      };
      step3 = {
        cls: isAprob ? 'is-done' : isRechaz ? 'is-rejected' : '',
        icon: isAprob ? getVistaStepIconSvg('done') : isRechaz ? getVistaStepIconSvg('rejected') : getVistaStepIconSvg('shield'),
        name: 'Cierre y Planilla',
        sub: isAprob ? 'Regularizado' : isRechaz ? 'Cerrado' : 'Pendiente'
      };
    }

    return `
      <div class="vista-stepper" aria-label="Flujo de aprobación">
        ${[step1, step2, step3].map(st => `
          <div class="vista-step-item ${st.cls}">
            <span class="vista-step-dot" aria-hidden="true">${st.icon}</span>
            <div class="vista-step-copy">
              <span class="vista-step-name">${st.name}</span>
              <span class="vista-step-status">${st.sub}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function openVistaSolicitudModal(solicitudId) {
    solicitudesList = loadSolicitudes();
    const sol = solicitudesList.find(s => s.id === solicitudId);
    if (!sol) return;

    const meta = getStatusMetaForBadge(sol);
    const isReprog = sol.tramite === 'REPROGRAMACION';
    vistaTicketNumber.textContent = `${sol.id} • ${isReprog ? `Reprogramación (${sol.reprogTipoLabel})` : `Rectificación (${sol.tipoRegularizacion})`}`;
    vistaEstadoBadge.className = `btn-ver-solicitud-badge ${meta.cls}`;
    vistaEstadoBadge.innerHTML = `${getDocenteStatusBadgeIconSvg(meta.cls)}<span>${sol.condicion} – ${sol.aprobadorAsignado}</span>`;

    const heroHtml = `
      <div class="vista-hero-card">
        <div class="vista-hero-top">
          <span class="vista-hero-kicker">${isReprog ? `Reprogramación de Clases • ${sol.reprogTipoLabel}` : `Rectificación de Asistencia • ${sol.tipoRegularizacion}`}</span>
          <span class="hist-tramite-pill ${isReprog ? 'reprogramacion' : 'rectificacion'}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect>
              <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
              <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
              <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
            </svg>
            <span>${sol.periodo || '2026-II'}</span>
          </span>
        </div>
        <h4 class="vista-hero-course">${sol.curso}</h4>
        <div class="vista-hero-sub">
          <span><strong>Sección:</strong> ${sol.seccion}</span>
          <span>•</span>
          <span><strong>Sesión:</strong> ${sol.sesion}</span>
          <span>•</span>
          <span><strong>Estado origen:</strong> ${sol.estadoAsistenciaOriginal || '—'}</span>
        </div>
      </div>
    `;

    const stepperHtml = buildVistaStepperHtml(sol);

    const iconUser12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 20.5v-2a3.8 3.8 0 0 0-3.8-3.8H8.8A3.8 3.8 0 0 0 5 18.5v2"></path><circle cx="12" cy="7.5" r="3.8"></circle></svg>';
    const iconUserCheck12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20.5v-2a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.5v2"></path><circle cx="9.5" cy="7.5" r="3.5"></circle><polyline points="16.5 11.5 18.5 13.5 22 9.5"></polyline></svg>';
    const iconShield12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8l7.2 3v5.4c0 4.6-3 8.5-7.2 9.8-4.2-1.3-7.2-5.2-7.2-9.8V5.8l7.2-3z"></path></svg>';
    const iconCal12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3.5" y1="10" x2="20.5" y2="10"></line></svg>';
    const iconClock12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="12 7.2 12 12 15.2 13.8"></polyline></svg>';
    const iconTag12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 13.2l-6.8 6.8a2 2 0 0 1-2.8 0L3.5 13V4.5a1 1 0 0 1 1-1H13l7.2 7.2a1.8 1.8 0 0 1 0 2.5z"></path><circle cx="8" cy="8" r="1.2"></circle></svg>';
    const iconClip12 = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.2l-8.4 8.4a5.2 5.2 0 0 1-7.4-7.4l8.4-8.4a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.6 1.6 0 0 1-2.3-2.3l7.6-7.6"></path></svg>';

    let mainSectionHtml = '';
    if (isReprog) {
      const origDurLabel = formatAcademicHoursLabel(sol.duracionOriginalMin || 45);
      const newDurLabel = formatAcademicHoursLabel(sol.duracionNuevaMin || sol.duracionOriginalMin || 45);
      const docenteMostrar = sol.cambioDocente
        ? (sol.docenteReemplazo ? `${sol.docenteReemplazo} (Asignado por Coord.)` : 'Pendiente de asignación por Coordinación')
        : `${sol.docente} (Titular)`;
      const isFutureCutoff = sol.cortePlanillaPago && !sol.cortePlanillaPago.includes('11/11');

      mainSectionHtml = `
        <div class="vista-compare-grid">
          <div class="vista-compare-card is-original">
            <div class="vista-compare-header">
              <span class="vista-compare-title-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect>
                  <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
                  <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
                  <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
                </svg>
                <span>Horario Original Programado</span>
              </span>
              <span>${origDurLabel}</span>
            </div>
            <div class="vista-kv-pair-row">
              <div>
                <span class="vista-kv-label">Fecha original</span>
                <span class="vista-kv-value">${sol.fechaOriginal}</span>
              </div>
              <div>
                <span class="vista-kv-label">Horario programado</span>
                <span class="vista-kv-value">${sol.horarioProgInicio} – ${sol.horarioProgFin}</span>
              </div>
            </div>
            <div class="vista-compare-foot">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M19 20.5v-2a3.8 3.8 0 0 0-3.8-3.8H8.8A3.8 3.8 0 0 0 5 18.5v2"></path>
                <circle cx="12" cy="7.5" r="3.8"></circle>
              </svg>
              <span>Titular: ${sol.docente}</span>
            </div>
          </div>

          <div class="vista-compare-card is-proposed">
            <div class="vista-compare-header">
              <span class="vista-compare-title-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3.5" y="4.5" width="17" height="16" rx="2" ry="2"></rect>
                  <line x1="16" y1="2.5" x2="16" y2="6.5"></line>
                  <line x1="8" y1="2.5" x2="8" y2="6.5"></line>
                  <line x1="3.5" y1="10" x2="20.5" y2="10"></line>
                  <polyline points="9 15.5 11.2 17.7 15.5 13.5"></polyline>
                </svg>
                <span>Nueva Programación Propuesta</span>
              </span>
              <span>${newDurLabel}</span>
            </div>
            <div class="vista-kv-pair-row">
              <div>
                <span class="vista-kv-label">Día propuesto</span>
                <span class="vista-kv-value is-teal">${sol.fechaNueva}</span>
              </div>
              <div>
                <span class="vista-kv-label">Nuevo horario</span>
                <span class="vista-kv-value is-teal">${sol.horaInicioNueva} – ${sol.horaFinNueva}</span>
              </div>
            </div>
            <div class="vista-compare-foot">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10.5c0 5.4-8 10.7-8 10.7s-8-5.3-8-10.7a8 8 0 1 1 16 0z"></path>
                <circle cx="12" cy="10.5" r="2.8"></circle>
              </svg>
              <span>${sol.sedeNueva} • Aula ${sol.aulaNueva} • Cargo: ${docenteMostrar}</span>
            </div>
          </div>
        </div>

        <div class="reprog-planilla-notice ${isFutureCutoff ? 'notice-next' : 'notice-current'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8.2" x2="12.01" y2="8.2"></line>
          </svg>
          <span><strong>Impacto en Planilla:</strong> ${sol.notaPlanilla || `Corte ${sol.cortePlanillaPago || '12/10/2026 – 11/11/2026'}`}</span>
        </div>

        <div class="vista-meta-grid">
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconUser12}<span>Docente Titular</span></span>
            <span class="vista-meta-val">${sol.docente} (${sol.docenteCodigo})</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconUserCheck12}<span>Ingresado Por</span></span>
            <span class="vista-meta-val">${sol.solicitadoPorRol} – ${sol.solicitadoPorNombre}</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconShield12}<span>Bandeja Actual</span></span>
            <span class="vista-meta-val">${sol.aprobadorAsignado}</span>
          </div>
        </div>
      `;
    } else {
      mainSectionHtml = `
        <div class="vista-meta-grid">
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconUser12}<span>Docente Titular</span></span>
            <span class="vista-meta-val">${sol.docente} (${sol.docenteCodigo})</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconCal12}<span>Fecha de Sesión</span></span>
            <span class="vista-meta-val">${sol.fechaOriginal}</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconClock12}<span>Horario Prog. / Marcado</span></span>
            <span class="vista-meta-val">${sol.horarioProgInicio}–${sol.horarioProgFin} (Reg: ${sol.horarioRegInicio}–${sol.horarioRegFin})</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconTag12}<span>Tipo de Justificación</span></span>
            <span class="vista-meta-val">${sol.tipoRegularizacion}${sol.detalleSalud ? ` (${sol.detalleSalud})` : ''}</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconUserCheck12}<span>Ingresado Por</span></span>
            <span class="vista-meta-val">${sol.solicitadoPorRol} – ${sol.solicitadoPorNombre}</span>
          </div>
          <div class="vista-meta-cell">
            <span class="vista-meta-label">${iconClip12}<span>Documento Adjunto</span></span>
            <span class="vista-meta-val">
              <span class="detail-file-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2.5 14 8 19.5 8"></polyline>
                </svg>
                <span>${sol.archivoNombre || 'sustento.pdf'}</span>
              </span>
            </span>
          </div>
        </div>
      `;
    }

    const motivoHtml = `
      <div class="vista-motivo-quote">
        <span class="vista-motivo-quote-title">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.5 14.5a2 2 0 0 1-2 2H7.5L4 20V5.5a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Motivo / Sustento registrado</span>
        </span>
        <div>${sol.motivo}</div>
      </div>
    `;

    let resolutionHtml = '';
    if (sol.condicion === 'Aprobado' || sol.condicion === 'Rechazado') {
      const isRej = sol.condicion === 'Rechazado';
      const auditIconSvg = isRej
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><line x1="14.8" y1="9.2" x2="9.2" y2="14.8"></line><line x1="9.2" y1="9.2" x2="14.8" y2="14.8"></line></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"></circle><polyline points="8.5 12.2 10.8 14.5 15.5 9.8"></polyline></svg>';
      resolutionHtml = `
        <div class="vista-audit-card ${isRej ? 'is-rejected' : 'is-approved'}">
          <span class="vista-audit-icon">${auditIconSvg}</span>
          <div class="vista-audit-body">
            <strong>Resolución (${sol.condicion}):</strong> ${sol.resolucionPor || sol.aprobadorAsignado} • ${sol.fechaResolucion || sol.fechaSolicitud}
            <div style="margin-top: 4px;">${sol.motivoRechazo || sol.comentarioEvaluador || 'Solicitud validada y aplicada al reporte de asistencia.'}</div>
          </div>
        </div>
      `;
    } else {
      resolutionHtml = `
        <div class="vista-audit-card is-pending">
          <span class="vista-audit-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9.2"></circle>
              <polyline points="12 7.5 12 12 15 13.8"></polyline>
            </svg>
          </span>
          <div class="vista-audit-body">
            <strong>Estado del flujo:</strong> En espera de atención en bandeja de <strong>${sol.aprobadorAsignado}</strong> (enviada el ${sol.fechaSolicitud}).
          </div>
        </div>
      `;
    }

    vistaSolicitudDetails.innerHTML = `
      ${heroHtml}
      ${stepperHtml}
      ${mainSectionHtml}
      ${motivoHtml}
      ${resolutionHtml}
    `;

    openModal(modalVistaSolicitud, btnAceptarVista);
  }

  function renderHistorialTable(filterState = 'todas') {
    if (!historialTableBody) return;
    solicitudesList = loadSolicitudes();
    historialTableBody.innerHTML = '';

    const filtered = solicitudesList.filter(s => {
      if (currentSubmitRole === 'docente' && s.docenteCodigo !== LOGGED_DOCENTE.codigo) {
        return false;
      }
      if (filterState === 'todas') return true;
      if (filterState === 'pendiente') return s.condicion !== 'Aprobado' && s.condicion !== 'Rechazado';
      if (filterState === 'aprobado') return s.condicion === 'Aprobado';
      if (filterState === 'rechazado') return s.condicion === 'Rechazado';
      return true;
    });

    if (filtered.length === 0) {
      historialTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="padding: 28px; text-align: center; color: #64748B;">
            No hay solicitudes registradas en este estado.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(sol => {
      const meta = getStatusMetaForBadge(sol);
      const isReprog = sol.tramite === 'REPROGRAMACION';
      const tramiteLabel = isReprog ? 'Reprogramación' : 'Rectificación';
      const tramiteSub = isReprog ? sol.reprogTipoLabel : sol.tipoRegularizacion;
      const tramiteIconSvg = isReprog
        ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 2.5 21 6.5 17 10.5"></polyline><path d="M3 11.5v-1a4 4 0 0 1 4-4h14"></path><polyline points="7 21.5 3 17.5 7 13.5"></polyline><path d="M21 12.5v1a4 4 0 0 1-4 4H3"></path></svg>'
        : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z"></path><polyline points="14 2.5 14 8 19.5 8"></polyline></svg>';
      let stageClass = 'stage-dir';
      let stageIconSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8l7.2 3v5.4c0 4.6-3 8.5-7.2 9.8-4.2-1.3-7.2-5.2-7.2-9.8V5.8l7.2-3z"></path></svg>';
      if (sol.condicion === 'Pendiente Coordinador') {
        stageClass = 'stage-coord';
        stageIconSvg = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20v-1.8a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 18.2V20"></path><circle cx="10" cy="7.5" r="3.4"></circle><line x1="19" y1="8.5" x2="19" y2="14.5"></line><line x1="16" y1="11.5" x2="22" y2="11.5"></line></svg>';
      } else if (sol.condicion === 'Aprobado' || sol.condicion === 'Rechazado') {
        stageClass = 'stage-done';
        stageIconSvg = getDocenteStatusBadgeIconSvg(sol.condicion === 'Aprobado' ? 'is-approved' : 'is-rejected');
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 800; color: #0F848F; white-space: nowrap;">${sol.id}</td>
        <td style="white-space: nowrap;">${sol.fechaSolicitud}</td>
        <td style="white-space: nowrap;">${sol.fechaOriginal}</td>
        <td style="text-align: left; font-weight: 600; color: #0F172A;">${sol.curso}</td>
        <td style="white-space: nowrap;">${sol.seccion}</td>
        <td>
          <span class="hist-tramite-pill ${isReprog ? 'reprogramacion' : 'rectificacion'}">${tramiteIconSvg}<span>${tramiteLabel}</span></span>
          <span class="hist-tramite-sub">${tramiteSub}</span>
        </td>
        <td><span class="hist-stage-pill ${stageClass}">${stageIconSvg}<span>${sol.aprobadorAsignado}</span></span></td>
        <td class="td-sol-estado"><span class="btn-ver-solicitud-badge ${meta.cls}">${getDocenteStatusBadgeIconSvg(meta.cls)}<span>${sol.condicion}</span></span></td>
        <td class="td-sol-action">
          <button type="button" class="btn-ver-hist-row" data-view-sol-id="${sol.id}" aria-label="Ver detalle de ${sol.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5-9.5-6.5-9.5-6.5z"></path>
              <circle cx="12" cy="12" r="2.8"></circle>
            </svg>
            <span>Detalle</span>
          </button>
        </td>
      `;
      historialTableBody.appendChild(tr);
    });
  }

  if (btnOpenHistorial) {
    btnOpenHistorial.addEventListener('click', () => {
      const tabs = document.querySelectorAll('.history-tab-btn');
      tabs.forEach(t => t.classList.remove('active'));
      if (tabs[0]) tabs[0].classList.add('active');
      renderHistorialTable('todas');
      openModal(modalHistorialSolicitudes, btnAceptarHistorial);
    });
  }

  if (historialTableBody) {
    historialTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view-sol-id]');
      if (!btn) return;
      const solId = btn.getAttribute('data-view-sol-id');
      closeModal(modalHistorialSolicitudes);
      openVistaSolicitudModal(solId);
    });
  }

  document.querySelectorAll('.history-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.history-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderHistorialTable(tab.getAttribute('data-state-filter'));
    });
  });

  if (btnCloseModalHistorial) btnCloseModalHistorial.addEventListener('click', () => closeModal(modalHistorialSolicitudes));
  if (btnAceptarHistorial) btnAceptarHistorial.addEventListener('click', () => closeModal(modalHistorialSolicitudes));
  if (btnCloseModalVista) btnCloseModalVista.addEventListener('click', () => closeModal(modalVistaSolicitud));
  if (btnAceptarVista) btnAceptarVista.addEventListener('click', () => closeModal(modalVistaSolicitud));

  // ==========================================
  // 13. DATE PICKERS, SELECTS PERSONALIZADOS, HORARIOS Y SYNC
  // ==========================================
  const CAL_MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const CAL_WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  const ACADEMIC_TIME_SLOTS = [
    '07:00', '07:45', '08:30', '09:15',
    '10:00', '10:45', '11:30', '12:15',
    '13:00', '14:00', '14:45', '15:30',
    '16:15', '17:00', '17:45', '18:30',
    '19:15', '20:00', '20:45', '21:30',
    '22:15', '23:00'
  ];

  function parseIsoParts(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const [y, m, d] = iso.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  }

  function toIsoDate(year, monthZeroIndexed, day) {
    return `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function positionFloatingElement(triggerEl, popupEl, preferredWidth) {
    if (!triggerEl || !popupEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = preferredWidth || Math.max(rect.width, 220);

    popupEl.style.width = `${width}px`;
    const estimatedHeight = popupEl.offsetHeight || 295;
    const spaceBelow = vh - rect.bottom - 10;
    const spaceAbove = rect.top - 10;

    let top = rect.bottom + 6;
    let originY = 'top';
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      top = Math.max(8, rect.top - estimatedHeight - 6);
      originY = 'bottom';
    } else if (top + estimatedHeight > vh - 8) {
      top = Math.max(8, vh - estimatedHeight - 8);
    }

    let left = rect.left;
    if (left + width > vw - 8) {
      left = Math.max(8, vw - width - 8);
    }
    if (left < 8) left = 8;

    popupEl.style.position = 'fixed';
    popupEl.style.top = `${Math.round(top)}px`;
    popupEl.style.left = `${Math.round(left)}px`;
    popupEl.style.transformOrigin = `${originY} left`;
  }

  function setCustomDateValue(hiddenInput, isoVal, triggerChange = false) {
    if (!hiddenInput) return;
    hiddenInput.value = isoVal || '';
    const displayEl = document.getElementById(`${hiddenInput.id}Display`);
    if (displayEl) {
      displayEl.value = isoVal ? formatIsoToDisplay(isoVal) : '';
      displayEl.removeAttribute('aria-invalid');
    }
    const container = hiddenInput.closest('.custom-date-container');
    if (container && typeof container._syncCalendarView === 'function') {
      container._syncCalendarView(isoVal);
    }
    if (triggerChange) {
      hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function syncSelectUI(selectEl) {
    if (!selectEl) return;
    const wrap = selectEl.closest('.modal-select-wrapper');
    if (!wrap) return;
    const container = wrap.querySelector('.custom-select-container');
    if (!container) return;

    const triggerLabel = container.querySelector('.custom-select-label');
    const selectedOpt = selectEl.options[selectEl.selectedIndex];
    if (triggerLabel && selectedOpt) {
      triggerLabel.textContent = selectedOpt.textContent;
      triggerLabel.classList.toggle('is-placeholder', !selectedOpt.value);
    }
    container.querySelectorAll('.custom-option').forEach(optEl => {
      const isSelected = optEl.getAttribute('data-value') === selectEl.value;
      optEl.classList.toggle('selected', isSelected);
      optEl.setAttribute('aria-selected', String(isSelected));
    });
  }

  function initDocenteDatePickers() {
    document.querySelectorAll('.custom-date-container').forEach(container => {
      const hiddenId = container.getAttribute('data-date-input');
      const hiddenInput = hiddenId ? document.getElementById(hiddenId) : container.querySelector('input[type="hidden"]');
      const triggerWrap = container.querySelector('.custom-date-trigger');
      const displayInput = container.querySelector('.date-display-input');
      const popup = container.querySelector('.custom-calendar-popup');
      if (!hiddenInput || !triggerWrap || !displayInput || !popup) return;

      const isFloatingModal = container.classList.contains('is-modal-datepicker');
      if (isFloatingModal) popup.classList.add('is-floating');

      const initialParts = parseIsoParts(hiddenInput.value) || parseIsoParts(SYSTEM_TODAY_ISO);
      let viewYear = initialParts.year;
      let viewMonth = initialParts.month;

      function renderCalendar() {
        const selectedIso = hiddenInput.value || '';
        const firstDay = new Date(viewYear, viewMonth, 1);
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const startOffset = (firstDay.getDay() + 6) % 7; // Lunes = 0
        const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

        let daysHtml = '';
        for (let i = startOffset - 1; i >= 0; i--) {
          const dayNum = prevMonthDays - i;
          daysHtml += `<button type="button" class="cal-day-btn other-month" tabindex="-1" disabled>${dayNum}</button>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
          const iso = toIsoDate(viewYear, viewMonth, d);
          const inCutoff = compareIsoDates(iso, ACTIVE_CUTOFF_START) >= 0 && compareIsoDates(iso, ACTIVE_CUTOFF_END) <= 0;
          const isToday = iso === SYSTEM_TODAY_ISO;
          const isSelected = iso === selectedIso;
          const cls = [
            'cal-day-btn',
            inCutoff ? 'in-cutoff' : '',
            isToday ? 'is-today' : '',
            isSelected ? 'selected' : ''
          ].filter(Boolean).join(' ');

          daysHtml += `<button type="button" class="${cls}" data-cal-iso="${iso}" aria-pressed="${isSelected}">${d}</button>`;
        }

        const totalCells = startOffset + daysInMonth;
        const remainder = (7 - (totalCells % 7)) % 7;
        for (let nxt = 1; nxt <= remainder; nxt++) {
          daysHtml += `<button type="button" class="cal-day-btn other-month" tabindex="-1" disabled>${nxt}</button>`;
        }

        popup.innerHTML = `
          <div class="cal-header">
            <button type="button" class="cal-nav-btn" data-cal-nav="-1" aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span class="cal-month-label">${CAL_MONTH_NAMES[viewMonth]} ${viewYear}</span>
            <button type="button" class="cal-nav-btn" data-cal-nav="1" aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div class="cal-weekdays-grid">
            ${CAL_WEEKDAYS.map(w => `<span class="cal-weekday">${w}</span>`).join('')}
          </div>
          <div class="cal-days-grid">${daysHtml}</div>
          <div class="cal-footer-bar">
            <span class="cal-cutoff-tag">Corte 12/10–11/11</span>
            <button type="button" class="cal-today-btn" data-cal-today="true">Ir a hoy (11/11)</button>
          </div>
        `;
      }

      container._syncCalendarView = function (isoVal) {
        const parts = parseIsoParts(isoVal) || parseIsoParts(SYSTEM_TODAY_ISO);
        if (parts) {
          viewYear = parts.year;
          viewMonth = parts.month;
        }
        if (container.classList.contains('open')) {
          renderCalendar();
        }
      };

      function openCalendar() {
        const wasOpen = container.classList.contains('open');
        closeAllFloatingPopups(false);
        if (wasOpen) return;

        const parts = parseIsoParts(hiddenInput.value) || parseIsoParts(SYSTEM_TODAY_ISO);
        viewYear = parts.year;
        viewMonth = parts.month;
        renderCalendar();

        container.classList.add('open');
        popup.classList.add('open');
        displayInput.setAttribute('aria-expanded', 'true');

        if (isFloatingModal) {
          positionFloatingElement(triggerWrap, popup, 288);
        } else {
          // Para filtros superiores, ajustar si desborda a la derecha
          const rect = triggerWrap.getBoundingClientRect();
          if (rect.left + 288 > window.innerWidth - 10) {
            popup.style.left = 'auto';
            popup.style.right = '0';
          } else {
            popup.style.left = '0';
            popup.style.right = 'auto';
          }
        }
      }

      triggerWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        openCalendar();
      });

      displayInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          openCalendar();
        }
      });

      popup.addEventListener('click', (e) => {
        e.stopPropagation();
        const navBtn = e.target.closest('[data-cal-nav]');
        if (navBtn) {
          const delta = Number(navBtn.getAttribute('data-cal-nav'));
          viewMonth += delta;
          if (viewMonth < 0) {
            viewMonth = 11;
            viewYear -= 1;
          } else if (viewMonth > 11) {
            viewMonth = 0;
            viewYear += 1;
          }
          renderCalendar();
          if (isFloatingModal) positionFloatingElement(triggerWrap, popup, 288);
          return;
        }

        const todayBtn = e.target.closest('[data-cal-today]');
        if (todayBtn) {
          setCustomDateValue(hiddenInput, SYSTEM_TODAY_ISO, true);
          closeAllFloatingPopups(true);
          return;
        }

        const dayBtn = e.target.closest('[data-cal-iso]');
        if (dayBtn) {
          const iso = dayBtn.getAttribute('data-cal-iso');
          setCustomDateValue(hiddenInput, iso, true);
          closeAllFloatingPopups(true);
        }
      });

      // Inicializar formato display
      if (hiddenInput.value) {
        displayInput.value = formatIsoToDisplay(hiddenInput.value);
      }
    });
  }

  function initEnhancedSelects() {
    const supportsBaseSelect = typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('appearance', 'base-select');

    document.querySelectorAll('.modal-select-wrapper select').forEach(selectEl => {
      const wrap = selectEl.closest('.modal-select-wrapper');
      if (!wrap) return;

      if (supportsBaseSelect) {
        selectEl.addEventListener('change', () => {
          selectEl.removeAttribute('aria-invalid');
        });
        return;
      }

      // Fallback progresivo completo cuando appearance: base-select no está disponible
      if (wrap.querySelector('.custom-select-container')) return;

      const isInsideModal = Boolean(wrap.closest('.modal-overlay'));
      const nativeIcon = wrap.querySelector('.modal-select-icon');
      if (nativeIcon) nativeIcon.style.display = 'none';

      selectEl.style.position = 'absolute';
      selectEl.style.width = '1px';
      selectEl.style.height = '1px';
      selectEl.style.opacity = '0';
      selectEl.style.pointerEvents = 'none';
      selectEl.tabIndex = -1;

      const container = document.createElement('div');
      container.className = 'custom-select-container';

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
      menu.className = `custom-dropdown-menu${isInsideModal ? ' is-floating' : ''}`;
      menu.setAttribute('role', 'listbox');

      function populateOptions() {
        menu.innerHTML = '';
        Array.from(selectEl.options).forEach(opt => {
          const li = document.createElement('li');
          li.className = `custom-option${opt.selected ? ' selected' : ''}`;
          li.setAttribute('role', 'option');
          li.setAttribute('data-value', opt.value);
          li.setAttribute('aria-selected', String(opt.selected));
          li.innerHTML = `
            <span>${opt.textContent}</span>
            <svg class="custom-option-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          menu.appendChild(li);
        });
      }

      populateOptions();
      container.appendChild(trigger);
      container.appendChild(menu);
      wrap.appendChild(container);

      syncSelectUI(selectEl);

      function openMenu() {
        const wasOpen = container.classList.contains('open');
        closeAllFloatingPopups(false);
        if (wasOpen) return;

        populateOptions();
        container.classList.add('open');
        menu.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');

        if (isInsideModal) {
          positionFloatingElement(trigger, menu, Math.max(trigger.getBoundingClientRect().width, 220));
        }
      }

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const opts = Array.from(selectEl.options);
          const dir = e.key === 'ArrowDown' ? 1 : -1;
          const nextIdx = (selectEl.selectedIndex + dir + opts.length) % opts.length;
          selectEl.selectedIndex = nextIdx;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
          syncSelectUI(selectEl);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMenu();
        }
      });

      menu.addEventListener('click', (e) => {
        e.stopPropagation();
        const optEl = e.target.closest('.custom-option');
        if (!optEl) return;
        const val = optEl.getAttribute('data-value');
        selectEl.value = val;
        trigger.removeAttribute('aria-invalid');
        syncSelectUI(selectEl);
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        closeAllFloatingPopups(true);
      });

      selectEl.addEventListener('change', () => syncSelectUI(selectEl));
    });
  }

  function initTimePresets() {
    let popover = document.getElementById('docenteTimePopover');
    if (!popover) {
      popover = document.createElement('div');
      popover.id = 'docenteTimePopover';
      popover.className = 'custom-time-popover';
      popover.setAttribute('role', 'dialog');
      popover.setAttribute('aria-label', 'Horarios académicos sugeridos');
      document.body.appendChild(popover);
    }

    document.querySelectorAll('.time-preset-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-time-target');
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;

        const isSameOpen = popover.classList.contains('open') && popover.getAttribute('data-active-trigger') === targetId;
        closeAllFloatingPopups(false);
        if (isSameOpen) return;

        const currentVal = targetInput.value;
        popover.setAttribute('data-active-trigger', targetId);
        popover.innerHTML = `
          <div class="time-popover-head">Bloques académicos (45 min)</div>
          <div class="time-preset-grid">
            ${ACADEMIC_TIME_SLOTS.map(slot => `
              <button type="button" class="time-preset-item ${slot === currentVal ? 'selected' : ''}" data-time-slot="${slot}">
                ${slot}
              </button>
            `).join('')}
          </div>
        `;

        btn.setAttribute('aria-expanded', 'true');
        popover.classList.add('open');
        const wrapper = targetInput.closest('.time-picker-wrapper') || btn;
        positionFloatingElement(wrapper, popover, 224);
      });
    });

    popover.addEventListener('click', (e) => {
      e.stopPropagation();
      const slotBtn = e.target.closest('[data-time-slot]');
      if (!slotBtn) return;
      const targetId = popover.getAttribute('data-active-trigger');
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;
      targetInput.value = slotBtn.getAttribute('data-time-slot');
      targetInput.removeAttribute('aria-invalid');
      targetInput.dispatchEvent(new Event('input', { bubbles: true }));
      targetInput.dispatchEvent(new Event('change', { bubbles: true }));
      closeAllFloatingPopups(false);
      targetInput.focus();
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-date-container') &&
        !e.target.closest('.custom-select-container') &&
        !e.target.closest('.time-picker-wrapper') &&
        !e.target.closest('#docenteTimePopover')) {
      closeAllFloatingPopups(false);
    }
  });

  window.addEventListener('resize', () => closeAllFloatingPopups(false));
  document.querySelectorAll('.modal-body-rect').forEach(body => {
    body.addEventListener('scroll', () => closeAllFloatingPopups(false), { passive: true });
  });

  initDocenteDatePickers();
  initEnhancedSelects();
  initTimePresets();

  if (filtroFechaDesde) filtroFechaDesde.addEventListener('change', () => renderTable(currentActivePillFilter));
  if (filtroFechaHasta) filtroFechaHasta.addEventListener('change', () => renderTable(currentActivePillFilter));

  if (btnBuscarAsistencia) {
    btnBuscarAsistencia.addEventListener('click', () => {
      renderTable(currentActivePillFilter);
      showToast('Reporte actualizado según criterios de búsqueda y fechas.');
    });
  }

  if (btnExportarExcel) {
    btnExportarExcel.addEventListener('click', () => {
      showToast('Generando reporte Excel de programación, rectificaciones y reprogramaciones...');
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      renderTable(currentActivePillFilter);
    }
  });

  let toastTimer = null;
  function showToast(message) {
    if (!toastMessage) return;
    if (toastText) toastText.textContent = message;
    toastMessage.classList.add('active');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('active');
    }, 4200);
  }

  // Inicializar tabla
  renderTable('todos');
});
