
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. RELOJ EN TIEMPO REAL Y FECHA EN ESPAÑOL
  // ==========================================================================
  const liveClockHour = document.getElementById('liveClockHour');
  const liveClockSec = document.getElementById('liveClockSec');
  const liveClockDate = document.getElementById('liveClockDate');
  const modalCurrentEvalTime = document.getElementById('modalCurrentEvalTime');
  const modalCurrentEvalDate = document.getElementById('modalCurrentEvalDate');
  const livePunchStatus = document.getElementById('livePunchStatus');

  // Modo de simulación interactiva para pruebas del requerimiento de 15 minutos
  let modoSimulacionActivo = false;
  let horaSimulada = { horas: 8, minutos: 0, segundos: 0 };

  function formatearFechaEspanol(fecha) {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const diaNombre = dias[fecha.getDay()];
    const diaNumero = fecha.getDate();
    const mesNombre = meses[fecha.getMonth()];
    return `${diaNombre}, ${diaNumero} ${mesNombre}`;
  }

  function formatearFechaCompleta(fecha) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  function actualizarReloj() {
    let horas, minutos, segundos;

    if (modoSimulacionActivo) {
      horas = horaSimulada.horas;
      minutos = horaSimulada.minutos;
      segundos = horaSimulada.segundos;

      // Incremento de segundos en simulación
      horaSimulada.segundos = (horaSimulada.segundos + 1) % 60;
      if (horaSimulada.segundos === 0) {
        horaSimulada.minutos = (horaSimulada.minutos + 1) % 60;
        if (horaSimulada.minutos === 0) {
          horaSimulada.horas = (horaSimulada.horas + 1) % 24;
        }
        actualizarMotorMarcacion();
      }
    } else {
      const ahora = new Date();
      horas = ahora.getHours();
      minutos = ahora.getMinutes();
      segundos = ahora.getSeconds();

      if (liveClockDate) {
        liveClockDate.textContent = formatearFechaEspanol(ahora);
      }
      if (modalCurrentEvalDate) {
        modalCurrentEvalDate.textContent = formatearFechaCompleta(ahora);
      }
    }

    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;
    const horasStr = String(horas12).padStart(2, '0');
    const minutosStr = String(minutos).padStart(2, '0');
    const segundosStr = String(segundos).padStart(2, '0');

    if (liveClockHour) {
      liveClockHour.textContent = `${horasStr}:${minutosStr} ${periodo}`;
    }
    if (liveClockSec) {
      liveClockSec.textContent = `:${segundosStr}`;
    }
    if (modalCurrentEvalTime) {
      modalCurrentEvalTime.textContent = `${horasStr}:${minutosStr} ${periodo}`;
    }
  }

  actualizarReloj();
  setInterval(actualizarReloj, 1000);


  // 2. LÓGICA DEL CARRUSEL / HERO SLIDER (980x180 Centrado)

  const heroSlider = document.getElementById('heroSlider');
  const sliderWrapper = heroSlider ? heroSlider.querySelector('.slider-wrapper') : null;
  const heroSlides = heroSlider ? heroSlider.querySelectorAll('.hero-slide') : [];
  const sliderDots = document.querySelectorAll('#sliderDotsContainer .dot');
  const btnSliderPrev = document.getElementById('btnSliderPrev');
  const btnSliderNext = document.getElementById('btnSliderNext');

  if (heroSlider && sliderWrapper && heroSlides.length > 0) {
    let currentSlideIndex = 0;
    const totalSlides = heroSlides.length;
    let autoSlideInterval;
    const autoSlideSpeed = 6000;

    function goToSlide(index) {
      currentSlideIndex = index;
      sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      sliderDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    }

    function nextSlide() {
      const nextIndex = (currentSlideIndex + 1) % totalSlides;
      goToSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      goToSlide(prevIndex);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoSlideInterval = setInterval(nextSlide, autoSlideSpeed);
    }

    function stopAutoPlay() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }

    if (btnSliderNext) {
      btnSliderNext.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (btnSliderPrev) {
      btnSliderPrev.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    sliderDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
        if (!isNaN(slideIndex)) {
          goToSlide(slideIndex);
          startAutoPlay();
        }
      });
    });

    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }


  // ==========================================================================
  // 3. MOTOR DE MARCACIÓN DOCENTE UNIVERSITARIO (WIENER - PKG_MARCADOR)
  // - Soporte de 4 Tipos Reales:
  //     * HOR: Horario Lectivo Regular (Aulas / Labs en campus)
  //     * HNL: Horas No Lectivas (Asesoría / Preparación / Investigación)
  //     * HOS: Campo Clínico / Hospital (Sede Externa y Validación HOS)
  //     * VIR: Clases Virtuales / Remotas (Aula sincrónica online)
  // - Regla de habilitación de 15 minutos previos al inicio
  // - Detección de Empalme Continuo para actividades consecutivas
  // - Detección de Superposición / Conflicto de horarios
  // - Soporte de Personal No Fiscalizable (sf_personal_no_fiscalizable)
  // - Conexión de red / Origen IP (ps_ip / CONEXION_ABR)
  // ==========================================================================

  // Estado de configuración y pruebas
  let esDocenteNoFiscalizable = false;
  let superposicionActiva = false;

  // Catálogo base de sesiones representativas del docente para el día de hoy
  const sesionesBase = [
    {
      id: 'HOS-MH3083',
      tipo: 'HOS',
      tipoEtiqueta: 'CAMPO CLÍNICO · HOSPITAL',
      carrera: 'MEDICINA HUMANA',
      seccion: 'MD8M9',
      cursoCodigo: 'MH3083',
      nombre: 'Pediatría I',
      sede: 'Sede Externa - Hospitales',
      aula: 'Hospital Externo (Docente Madre Niño)',
      modalidad: 'Hospitalaria',
      inicioMinutos: 7 * 60,       // 07:00 AM (420 min)
      finMinutos: 13 * 60,        // 01:00 PM (780 min)
      inicioStr: '07:00 AM',
      finStr: '01:00 PM',
      bloqueInicio: '0700',
      bloqueFin: '1300',
      marcadoEntrada: '06:48 AM',  // Entrada real registrada según respuesta del SP
      marcadoSalida: null,
      fechaMarcacionHospital: '13/11/2026 06:48 AM', // Validación hospitalaria en nodo HOS
      conexion: 'Acceso Externo',
      institucion: '51'
    },
    {
      id: 'HNL-B6',
      tipo: 'HNL',
      tipoEtiqueta: 'HORA NO LECTIVA (HNL)',
      carrera: 'ENFERMERÍA',
      seccion: 'HNL-01',
      cursoCodigo: 'B6',
      nombre: 'Preparación de Clases y Asesoría Académica',
      sede: 'Local 1 - Sede Central',
      aula: 'Sin Aula (Carga No Lectiva)',
      modalidad: 'No Lectiva',
      inicioMinutos: 13 * 60,       // 01:00 PM (780 min)
      finMinutos: 13 * 60 + 45,    // 01:45 PM (825 min) -> Empalma con clase presencial WL611
      inicioStr: '01:00 PM',
      finStr: '01:45 PM',
      bloqueInicio: '1300',
      bloqueFin: '1345',
      marcadoEntrada: null,
      marcadoSalida: null,
      fechaMarcacionHospital: null,
      conexion: 'Red Campus Wiener',
      institucion: '51'
    },
    {
      id: 'HOR-EN7021',
      tipo: 'HOR',
      tipoEtiqueta: 'LECTIVA PRESENCIAL',
      carrera: 'ENFERMERÍA',
      seccion: 'EN2M5',
      cursoCodigo: 'EN7021',
      nombre: 'Sistema Musculoesquelético',
      sede: 'Local 1 - Sede Central',
      aula: 'Aula WL611, Piso 6',
      modalidad: 'Presencial',
      inicioMinutos: 13 * 60 + 45,  // 01:45 PM (825 min) -> Empalme exacto con HNL
      finMinutos: 15 * 60 + 15,    // 03:15 PM (915 min)
      inicioStr: '01:45 PM',
      finStr: '03:15 PM',
      bloqueInicio: '1345',
      bloqueFin: '1515',
      marcadoEntrada: null,
      marcadoSalida: null,
      fechaMarcacionHospital: null,
      conexion: 'Red Campus Wiener',
      institucion: '51'
    },
    {
      id: 'VIR-MH2012',
      tipo: 'VIR',
      tipoEtiqueta: 'CLASE VIRTUAL / REMOTA',
      carrera: 'MEDICINA HUMANA',
      seccion: 'MD4V1',
      cursoCodigo: 'MH2012',
      nombre: 'Epidemiología Clínica y Salud Pública',
      sede: 'Campus Virtual Wiener',
      aula: 'Sala Sincrónica Blackboard / Teams',
      modalidad: 'Virtual Sincrónica',
      inicioMinutos: 17 * 60,      // 05:00 PM (1020 min)
      finMinutos: 18 * 60 + 30,    // 06:30 PM (1110 min)
      inicioStr: '05:00 PM',
      finStr: '06:30 PM',
      bloqueInicio: '1700',
      bloqueFin: '1830',
      marcadoEntrada: null,
      marcadoSalida: null,
      fechaMarcacionHospital: null,
      conexion: 'Acceso Externo',
      urlVirtual: 'https://campusvirtual.uwiener.edu.pe',
      institucion: '51'
    }
  ];

  // Sesión opcional para simular y validar superposición / conflicto de horario
  const sesionConflicto = {
    id: 'HOR-TALL033',
    tipo: 'HOR',
    tipoEtiqueta: 'LECTIVA PRESENCIAL (TALLER)',
    carrera: 'TALLERES ARTÍSTICOS',
    seccion: 'TALLT10',
    cursoCodigo: 'TALL033',
    nombre: 'Guitarra Acústica',
    sede: 'Local 2 - Av. Arequipa',
    aula: 'Aula WT1002, Piso 10',
    modalidad: 'Presencial',
    inicioMinutos: 17 * 60 + 30, // 05:30 PM (1050 min) -> Coincide con VIR-MH2012 (05:00 - 06:30 PM)
    finMinutos: 19 * 60,         // 07:00 PM (1140 min)
    inicioStr: '05:30 PM',
    finStr: '07:00 PM',
    bloqueInicio: '1730',
    bloqueFin: '1900',
    marcadoEntrada: null,
    marcadoSalida: null,
    fechaMarcacionHospital: null,
    conexion: 'Red Campus Wiener',
    institucion: '51',
    esSuperposicion: true
  };

  // Arreglo reactivo en memoria
  let sesionesDocente = JSON.parse(JSON.stringify(sesionesBase));

  // Referencias a elementos del DOM
  const marcacionModalBackdrop = document.getElementById('marcacionModalBackdrop');
  const btnOpenMarcacionModal = document.getElementById('btnOpenMarcacionModal');
  const btnMarcacionModalClose = document.getElementById('btnMarcacionModalClose');
  const marcacionClasesList = document.getElementById('marcacionClasesList');
  const marcacionConflictAlert = document.getElementById('marcacionConflictAlert');
  const marcacionConflictText = document.getElementById('marcacionConflictText');
  const marcacionEmpalmeContainer = document.getElementById('marcacionEmpalmeContainer');
  const btnEmpalmeContinuo = document.getElementById('btnEmpalmeContinuo');
  const modalNetworkChip = document.getElementById('modalNetworkChip');
  const modalNetworkText = document.getElementById('modalNetworkText');
  const modalRegimenBadge = document.getElementById('modalRegimenBadge');
  const marcacionNoFiscalizableAlert = document.getElementById('marcacionNoFiscalizableAlert');
  const btnToggleFiscalizable = document.getElementById('btnToggleFiscalizable');
  const btnToggleSuperposicion = document.getElementById('btnToggleSuperposicion');
  const btnResetMarcaciones = document.getElementById('btnResetMarcaciones');

  function obtenerMinutosActuales() {
    if (modoSimulacionActivo) {
      return horaSimulada.horas * 60 + horaSimulada.minutos;
    }
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function formatearMinutosAHora(minutosTotales) {
    const h = Math.floor(minutosTotales / 60) % 24;
    const m = minutosTotales % 60;
    const p = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`;
  }

  function evaluarSesion(sesion, minutosActuales) {
    const minutosParaInicio = sesion.inicioMinutos - minutosActuales;
    const yaInicio = minutosActuales >= sesion.inicioMinutos;
    const yaFinalizo = minutosActuales >= sesion.finMinutos;

    // Regla de 15 minutos: habilitar si faltan 15 minutos o menos
    const habilitadoPorVentana15Min = minutosParaInicio <= 15;

    // Detectar si hay una clase inmediatamente previa consecutiva
    const claseAnteriorConsecutiva = sesionesDocente.find(s => s.finMinutos === sesion.inicioMinutos && s.id !== sesion.id);

    // Detectar superposición de horario con otra clase simultánea
    const clasesSuperpuestas = sesionesDocente.filter(s => {
      if (s.id === sesion.id) return false;
      return Math.max(s.inicioMinutos, sesion.inicioMinutos) < Math.min(s.finMinutos, sesion.finMinutos);
    });

    return {
      minutosParaInicio,
      habilitadoPorVentana15Min,
      yaInicio,
      yaFinalizo,
      claseAnteriorConsecutiva,
      hayConflictoSuperposicion: clasesSuperpuestas.length > 0,
      clasesSuperpuestas
    };
  }

  function actualizarMotorMarcacion() {
    const minutosActuales = obtenerMinutosActuales();
    const horaActualStr = formatearMinutosAHora(minutosActuales);

    if (modalCurrentEvalTime) {
      modalCurrentEvalTime.textContent = horaActualStr;
    }

    // Actualizar estado de régimen no fiscalizable en UI
    if (modalRegimenBadge) {
      if (esDocenteNoFiscalizable) {
        modalRegimenBadge.textContent = 'Régimen: No Fiscalizable';
        modalRegimenBadge.className = 'badge-regimen-chip no-fiscalizable';
      } else {
        modalRegimenBadge.textContent = 'Régimen: Docente Regular';
        modalRegimenBadge.className = 'badge-regimen-chip';
      }
    }

    if (marcacionNoFiscalizableAlert) {
      marcacionNoFiscalizableAlert.style.display = esDocenteNoFiscalizable ? 'flex' : 'none';
    }

    if (!marcacionClasesList) return;

    marcacionClasesList.innerHTML = '';
    let haySuperposicionActiva = false;
    let textoConflicto = '';
    let empalmeActivo = null;

    let hayClaseHabilitada = false;
    let claseHabilitadaCodigo = '';
    let claseEnCursoCodigo = '';

    sesionesDocente.forEach(sesion => {
      const evalInfo = evaluarSesion(sesion, minutosActuales);

      let estadoTexto = '';
      let badgeColor = '#5B6E80';
      let badgeBg = '#F1F5F9';
      let puedeMarcarEntrada = false;
      let puedeMarcarSalida = false;

      // 1. Estado completado (Entrada y Salida registradas)
      if (sesion.marcadoEntrada && sesion.marcadoSalida) {
        estadoTexto = 'Asistencia Completada';
        badgeColor = '#166A74';
        badgeBg = '#E6F3F4';
      }
      // 2. Estado en dictado / en curso (Entrada registrada, salida pendiente)
      else if (sesion.marcadoEntrada && !sesion.marcadoSalida) {
        claseEnCursoCodigo = sesion.cursoCodigo;
        if (evalInfo.yaFinalizo) {
          estadoTexto = 'Pendiente de Salida (Hora cumplida)';
          badgeColor = '#BA7517';
          badgeBg = '#FEF3C7';
        } else {
          estadoTexto = 'En Curso · Entrada Registrada';
          badgeColor = '#0F848F';
          badgeBg = '#E6F3F4';
        }
        puedeMarcarSalida = true;
      }
      // 3. Estado no marcado aún
      else {
        if (evalInfo.habilitadoPorVentana15Min && !evalInfo.yaFinalizo) {
          estadoTexto = evalInfo.yaInicio ? 'En Curso · Habilitado' : 'Habilitado (15 min antes)';
          badgeColor = '#0F848F';
          badgeBg = '#E6F3F4';
          puedeMarcarEntrada = true;
          hayClaseHabilitada = true;
          claseHabilitadaCodigo = sesion.cursoCodigo;
        } else if (!evalInfo.habilitadoPorVentana15Min) {
          estadoTexto = `Pendiente (Habilita a las ${formatearMinutosAHora(sesion.inicioMinutos - 15)})`;
          badgeColor = '#64748B';
          badgeBg = '#F8FAFC';
        } else {
          estadoTexto = 'Sesión Finalizada';
          badgeColor = '#94A3B8';
          badgeBg = '#F1F5F9';
        }
      }

      // Si es no fiscalizable, siempre puede registrar de forma referencial
      if (esDocenteNoFiscalizable && !sesion.marcadoEntrada && !evalInfo.yaFinalizo) {
        puedeMarcarEntrada = true;
      }

      // Detectar empalme consecutivo (ej. HNL termina a las 01:45 PM y HOR inicia a las 01:45 PM)
      if (evalInfo.claseAnteriorConsecutiva && !sesion.marcadoEntrada) {
        const claseAnt = evalInfo.claseAnteriorConsecutiva;
        if (claseAnt.marcadoEntrada && !claseAnt.marcadoSalida && evalInfo.habilitadoPorVentana15Min) {
          empalmeActivo = { claseAnterior: claseAnt, claseSiguiente: sesion };
        }
      }

      // Detectar superposición conflictiva
      if (sesion.esSuperposicion && evalInfo.hayConflictoSuperposicion && (puedeMarcarEntrada || sesion.marcadoEntrada)) {
        haySuperposicionActiva = true;
        textoConflicto = `Alerta de conflicto detectada: La sesión ${sesion.cursoCodigo} coincide en horario con ${evalInfo.clasesSuperpuestas.map(c => c.cursoCodigo).join(', ')}. El sistema institucional bloquea duplicidad de horas simultáneas.`;
      }

      // Etiquetas y estilos para badges según Tipo de Marcación
      let badgeTipoClase = 'badge-tipo-hor';
      let badgeTipoIcono = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>';

      if (sesion.tipo === 'HNL') {
        badgeTipoClase = 'badge-tipo-hnl';
        badgeTipoIcono = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
      } else if (sesion.tipo === 'HOS') {
        badgeTipoClase = 'badge-tipo-hos';
        badgeTipoIcono = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16px" width="16px" fill="#047857"><path d="M10.88,13.12v2.5q0,0.47 0.33,0.8T12,16.75t0.8-0.33t0.33-0.8v-2.5h2.5q0.47,0 0.8-0.33T16.75,12t-0.33-0.8t-0.8-0.33h-2.5V8.37q0-0.47-0.33-0.8T12,7.25T11.2,7.58t-0.33,0.8v2.5H8.37q-0.47,0-0.8,0.33T7.25,12t0.33,0.8t0.8,0.33h2.5ZM5.31,20.5q-0.76,0-1.28-0.52T3.5,18.69V5.31q0-0.76 0.52-1.28T5.31,3.5H18.69q0.76,0 1.28,0.52T20.5,5.31V18.69q0,0.76-0.52,1.28T18.69,20.5H5.31Zm0-1.5H18.69q0.12,0 0.21-0.1T19,18.69V5.31q0-0.12-0.1-0.21T18.69,5H5.31Q5.19,5 5.1,5.1T5,5.31V18.69q0,0.12 0.1,0.21T5.31,19ZM5,5Q5,5 5,5.09T5,5.31V18.69q0,0.13 0,0.22T5,19q0,0 0-0.09t0-0.22V5.31Q5,5.17 5,5.09T5,5Z"/></svg>';
      } else if (sesion.tipo === 'VIR') {
        badgeTipoClase = 'badge-tipo-vir';
        badgeTipoIcono = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
      }

      // Textos dinámicos para los botones de acción según casuística
      let labelBotonEntrada = 'Marcar Entrada';
      let labelBotonSalida = 'Marcar Salida';

      if (sesion.tipo === 'HOS') {
        labelBotonEntrada = 'Marcar Entrada Hospital';
        labelBotonSalida = 'Marcar Salida Hospital';
      } else if (sesion.tipo === 'HNL') {
        labelBotonEntrada = 'Marcar Inicio No Lectivas';
        labelBotonSalida = 'Marcar Fin No Lectivas';
      } else if (sesion.tipo === 'VIR') {
        labelBotonEntrada = 'Marcar Entrada Virtual';
        labelBotonSalida = 'Marcar Salida Virtual';
      }

      if (esDocenteNoFiscalizable && !evalInfo.habilitadoPorVentana15Min && !sesion.marcadoEntrada) {
        labelBotonEntrada += ' (Referencial)';
      }

      // Texto explicativo de la ventana de marcación
      let textoVentana = 'Ventana de marcación activa';
      if (evalInfo.minutosParaInicio > 15) {
        textoVentana = `Ventana habilitará 15 min antes (${formatearMinutosAHora(sesion.inicioMinutos - 15)})`;
      } else if (evalInfo.yaFinalizo) {
        textoVentana = 'Horario programado concluido';
      }

      // Renderizar tarjeta de sesión académica con clara jerarquía visual
      const classCard = document.createElement('div');
      classCard.className = 'marcacion-class-card';
      classCard.id = `card-${sesion.id}`;
      classCard.innerHTML = `
        <!-- Cabecera de la Tarjeta: Micro-Badges y Título -->
        <div class="marcacion-class-header">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px;">
              <span class="badge-tipo-marcacion ${badgeTipoClase}">
                ${badgeTipoIcono}
                ${sesion.tipoEtiqueta}
              </span>
              <span style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">
                ${sesion.carrera}
              </span>
              <span style="font-size: 10px; font-weight: 600; color: #64748B; background: #F1F5F9; border: 1px solid #E2E8F0; padding: 1px 5px; border-radius: 4px;">
                SECC. ${sesion.seccion}
              </span>
            </div>
            
            <h4 class="marcacion-class-title">${sesion.cursoCodigo} · ${sesion.nombre}</h4>
            
            <div class="marcacion-class-meta">
              <span style="display: inline-flex; align-items: center; gap: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <strong>${sesion.sede}</strong> · ${sesion.aula}
              </span>
            </div>

            ${sesion.fechaMarcacionHospital ? `
              <div class="badge-hospital-validation">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Validación Hospitalaria Registrada: ${sesion.fechaMarcacionHospital}</span>
              </div>
            ` : ''}
          </div>

          <span style="display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 10.5px; font-weight: 600; color: ${badgeColor}; background-color: ${badgeBg}; white-space: nowrap;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background-color: ${badgeColor};"></span>
            ${estadoTexto}
          </span>
        </div>

        <!-- Grilla de Horario, Entrada y Salida -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px;">
          <div>
            <span style="font-size: 10px; color: #64748B; font-weight: 700; display: block; text-transform: uppercase; letter-spacing: 0.4px;">Horario Prog.</span>
            <strong style="font-size: 13px; color: #1E293B; font-weight: 700;">${sesion.inicioStr} - ${sesion.finStr}</strong>
          </div>
          <div>
            <span style="font-size: 10px; color: #64748B; font-weight: 700; display: block; text-transform: uppercase; letter-spacing: 0.4px;">Entrada Real</span>
            <strong style="font-size: 13px; color: ${sesion.marcadoEntrada ? '#166A74' : '#94A3B8'}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              ${sesion.marcadoEntrada ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${sesion.marcadoEntrada}` : 'Sin registrar'}
            </strong>
          </div>
          <div>
            <span style="font-size: 10px; color: #64748B; font-weight: 700; display: block; text-transform: uppercase; letter-spacing: 0.4px;">Salida Real</span>
            <strong style="font-size: 13px; color: ${sesion.marcadoSalida ? '#166A74' : '#94A3B8'}; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
              ${sesion.marcadoSalida ? `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F848F" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${sesion.marcadoSalida}` : 'Sin registrar'}
            </strong>
          </div>
        </div>

        <!-- Pie de la Tarjeta: Red permitida y Botones de Acción (min-height: 44px) -->
        <div class="marcacion-class-footer">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-size: 11.5px; color: #5B6E80; font-weight: 500;">
              ${textoVentana}
            </span>
            <span style="font-size: 11px; color: #64748B; display: inline-flex; align-items: center; gap: 4px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Red permitida: <strong>${sesion.conexion}</strong>
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            ${sesion.tipo === 'VIR' ? `
              <a href="${sesion.urlVirtual}" target="_blank" class="btn-punch-action outline-virtual" title="Abrir Blackboard / Teams">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Aula Virtual
              </a>
            ` : ''}

            ${!sesion.marcadoEntrada ? `
              <button type="button" class="btn-punch-action primary" ${!puedeMarcarEntrada ? 'disabled' : ''} data-punch-action="entrada" data-punch-id="${sesion.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                ${labelBotonEntrada}
              </button>
            ` : ''}

            ${sesion.marcadoEntrada && !sesion.marcadoSalida ? `
              <button type="button" class="btn-punch-action secondary-black" data-punch-action="salida" data-punch-id="${sesion.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                ${labelBotonSalida}
              </button>
            ` : ''}

            ${sesion.marcadoEntrada && sesion.marcadoSalida ? `
              <div class="btn-punch-concluded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>Marcación Concluida</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      marcacionClasesList.appendChild(classCard);
    });

    // Control de alerta de conflicto
    if (marcacionConflictAlert && marcacionConflictText) {
      if (haySuperposicionActiva) {
        marcacionConflictAlert.style.display = 'flex';
        marcacionConflictText.textContent = textoConflicto;
      } else {
        marcacionConflictAlert.style.display = 'none';
      }
    }

    // Control del botón de Empalme Continuo
    if (marcacionEmpalmeContainer && btnEmpalmeContinuo) {
      if (empalmeActivo) {
        marcacionEmpalmeContainer.style.display = 'block';
        btnEmpalmeContinuo.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span>Empalme Continuo: Registrar Salida de ${empalmeActivo.claseAnterior.cursoCodigo} y Entrada a ${empalmeActivo.claseSiguiente.cursoCodigo}</span>
        `;
        btnEmpalmeContinuo.onclick = () => {
          ejecutarEmpalme(empalmeActivo.claseAnterior, empalmeActivo.claseSiguiente);
        };
      } else {
        marcacionEmpalmeContainer.style.display = 'none';
      }
    }

    // Actualizar indicador de la barra superior del dashboard
    if (livePunchStatus) {
      const tieneEnCurso = sesionesDocente.some(s => s.marcadoEntrada && !s.marcadoSalida);
      const todosCompletos = sesionesDocente.length > 0 && sesionesDocente.every(s => s.marcadoEntrada && s.marcadoSalida);

      if (hayClaseHabilitada) {
        livePunchStatus.className = 'punch-status-pill success';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> Habilitado (${claseHabilitadaCodigo})`;
      } else if (tieneEnCurso) {
        livePunchStatus.className = 'punch-status-pill success';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> En curso (${claseEnCursoCodigo})`;
      } else if (todosCompletos) {
        livePunchStatus.className = 'punch-status-pill success';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> Jornada completada`;
      } else {
        livePunchStatus.className = 'punch-status-pill';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> Sin marcar hoy`;
      }
    }

    // Delegar clics de marcación
    const actionBtns = marcacionClasesList.querySelectorAll('[data-punch-action]');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.getAttribute('data-punch-id');
        const accion = this.getAttribute('data-punch-action');
        ejecutarMarcacionSimple(id, accion);
      });
    });
  }

  function ejecutarMarcacionSimple(id, accion) {
    const sesion = sesionesDocente.find(s => s.id === id);
    if (!sesion) return;

    const horaTexto = formatearMinutosAHora(obtenerMinutosActuales());

    if (accion === 'entrada') {
      sesion.marcadoEntrada = horaTexto;

      // Si es hospital, también registramos la fecha y hora de validación hospitalaria
      if (sesion.tipo === 'HOS') {
        sesion.fechaMarcacionHospital = `13/11/2026 ${horaTexto}`;
        mostrarToast(`Entrada hospitalaria registrada para ${sesion.cursoCodigo} a las ${horaTexto} (Validación HOS activa).`);
      } else if (sesion.tipo === 'HNL') {
        mostrarToast(`Inicio de Horas No Lectivas registrado para ${sesion.cursoCodigo} a las ${horaTexto}.`);
      } else if (sesion.tipo === 'VIR') {
        mostrarToast(`Entrada a Clase Virtual registrada para ${sesion.cursoCodigo} a las ${horaTexto}.`);
      } else {
        mostrarToast(`Entrada presencial registrada para ${sesion.cursoCodigo} a las ${horaTexto}.`);
      }
    } else if (accion === 'salida') {
      sesion.marcadoSalida = horaTexto;
      mostrarToast(`Salida registrada para ${sesion.cursoCodigo} a las ${horaTexto}.`);
    }

    actualizarMotorMarcacion();
  }

  function ejecutarEmpalme(claseAnt, claseSig) {
    const horaTexto = formatearMinutosAHora(obtenerMinutosActuales());
    claseAnt.marcadoSalida = horaTexto;
    claseSig.marcadoEntrada = horaTexto;
    mostrarToast(`Empalme continuo registrado: Salida de ${claseAnt.cursoCodigo} y Entrada a ${claseSig.cursoCodigo} a las ${horaTexto}.`);
    actualizarMotorMarcacion();
  }

  // Toast flotante no intrusivo
  function mostrarToast(mensaje) {
    let toast = document.getElementById('docenteToastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'docenteToastNotification';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.backgroundColor = '#1E293B';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      toast.style.fontSize = '13.5px';
      toast.style.fontWeight = '500';
      toast.style.zIndex = '400';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 4500);
  }

  // Apertura y cierre del modal
  if (btnOpenMarcacionModal && marcacionModalBackdrop) {
    btnOpenMarcacionModal.addEventListener('click', () => {
      marcacionModalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      actualizarMotorMarcacion();
    });
  }

  if (btnMarcacionModalClose && marcacionModalBackdrop) {
    btnMarcacionModalClose.addEventListener('click', () => {
      marcacionModalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (marcacionModalBackdrop) {
    marcacionModalBackdrop.addEventListener('click', (e) => {
      if (e.target === marcacionModalBackdrop) {
        marcacionModalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // 4. BOTONERA DEL SIMULADOR PARA PRUEBAS RÁPIDAS
  // ==========================================================================
  const simulatorBtns = document.querySelectorAll('.btn-sim');
  simulatorBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      simulatorBtns.forEach(b => {
        b.classList.remove('active');
      });
      this.classList.add('active');

      const timeVal = this.getAttribute('data-time');

      if (timeVal === 'real') {
        modoSimulacionActivo = false;
        mostrarToast('Simulador desactivado: regresando a hora real del sistema.');
      } else {
        modoSimulacionActivo = true;
        const [h, m] = timeVal.split(':').map(Number);
        horaSimulada = { horas: h, minutos: m, segundos: 0 };
        mostrarToast(`Simulador ajustado a las ${formatearMinutosAHora(h * 60 + m)}.`);
      }

      actualizarReloj();
      actualizarMotorMarcacion();
    });
  });

  // Control para alternar entre Régimen Docente Regular y Personal No Fiscalizable
  if (btnToggleFiscalizable) {
    btnToggleFiscalizable.addEventListener('click', () => {
      esDocenteNoFiscalizable = !esDocenteNoFiscalizable;
      btnToggleFiscalizable.textContent = esDocenteNoFiscalizable ? 'Régimen: No Fiscalizable (Activo)' : 'Régimen: Docente Regular';
      btnToggleFiscalizable.classList.toggle('active', esDocenteNoFiscalizable);
      mostrarToast(`Régimen cambiado a: ${esDocenteNoFiscalizable ? 'Personal No Fiscalizable (Art. 43 D.Leg 728)' : 'Docente Regular'}.`);
      actualizarMotorMarcacion();
    });
  }

  // Control para alternar el caso de Superposición de Horarios (Conflicto)
  if (btnToggleSuperposicion) {
    btnToggleSuperposicion.addEventListener('click', () => {
      superposicionActiva = !superposicionActiva;
      btnToggleSuperposicion.textContent = superposicionActiva ? 'Superposición: Activada (TALL033)' : 'Superposición: Desactivada';
      btnToggleSuperposicion.classList.toggle('active', superposicionActiva);

      if (superposicionActiva) {
        const existe = sesionesDocente.some(s => s.id === sesionConflicto.id);
        if (!existe) {
          sesionesDocente.push(JSON.parse(JSON.stringify(sesionConflicto)));
        }
        mostrarToast('Caso Superposición activado: Se incorporó Guitarra Acústica (17:30 - 19:00) en conflicto con Clase Virtual.');
      } else {
        sesionesDocente = sesionesDocente.filter(s => s.id !== sesionConflicto.id);
        mostrarToast('Caso Superposición desactivado.');
      }
      actualizarMotorMarcacion();
    });
  }

  // Control para restablecer marcaciones al estado inicial de demo
  if (btnResetMarcaciones) {
    btnResetMarcaciones.addEventListener('click', () => {
      sesionesDocente = JSON.parse(JSON.stringify(sesionesBase));
      if (superposicionActiva) {
        sesionesDocente.push(JSON.parse(JSON.stringify(sesionConflicto)));
      }
      mostrarToast('Marcaciones restablecidas al estado inicial de prueba.');
      actualizarMotorMarcacion();
    });
  }

  // Inicializar estado de marcación al cargar la página
  actualizarMotorMarcacion();
});
