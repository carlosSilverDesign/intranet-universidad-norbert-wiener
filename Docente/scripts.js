/**
 * ==========================================================================
 * SCRIPTS PRINCIPALES, CARRUSEL Y MOTOR DE MARCACIÓN - PERFIL DOCENTE
 * Universidad Norbert Wiener
 * Réplica fiel del comportamiento de scripts.js del perfil estudiante.
 * Todos los comentarios están redactados en español.
 * ==========================================================================
 */

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


  // ==========================================================================
  // 2. LÓGICA DEL CARRUSEL / HERO SLIDER (980x180 Centrado)
  // Idéntico al script de slider del perfil estudiante
  // ==========================================================================
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
  // 3. MOTOR DE MARCACIÓN DOCENTE UNIVERSITARIO
  // - Regla de habilitación 15 minutos antes del inicio de clase
  // - Lógica de empalme para clases consecutivas (salida A + entrada B)
  // - Detección y prevención de superposiciones o conflictos de horario
  // ==========================================================================

  // Datos de las materias asignadas al docente para el día de hoy
  const sesionesDocente = [
    {
      id: 'AD2N6',
      codigo: 'AD2N6',
      nombre: 'Estructura y Función del Cuerpo Humano',
      tipo: 'Teoría',
      aula: 'Aula T101, Piso 4 - Local 1',
      modalidad: 'Presencial',
      inicioMinutos: 8 * 60,       // 08:00 AM (480 min)
      finMinutos: 10 * 60,         // 10:00 AM (600 min)
      inicioStr: '08:00 AM',
      finStr: '10:00 AM',
      marcadoEntrada: null,
      marcadoSalida: null
    },
    {
      id: 'AF1M3',
      codigo: 'AF1M3',
      nombre: 'Sistema Circulatorio',
      tipo: 'Teoría',
      aula: 'Aula S103, Piso 5 - Local 1',
      modalidad: 'Presencial',
      inicioMinutos: 10 * 60,      // 10:00 AM (600 min) -> ¡Empalme consecutivo exacto con AD2N6!
      finMinutos: 12 * 60,         // 12:00 PM (720 min)
      inicioStr: '10:00 AM',
      finStr: '12:00 PM',
      marcadoEntrada: null,
      marcadoSalida: null
    },
    {
      id: 'BM2P1',
      codigo: 'BM2P1',
      nombre: 'Bioquímica Médica (Sesión Especial Práctica)',
      tipo: 'Práctica',
      aula: 'Laboratorio L204, Piso 2 - Local 1',
      modalidad: 'Presencial',
      inicioMinutos: 10 * 60 + 30,  // 10:30 AM (630 min) -> ¡Conflicto de superposición con AF1M3!
      finMinutos: 12 * 60 + 30,     // 12:30 PM (750 min)
      inicioStr: '10:30 AM',
      finStr: '12:30 PM',
      marcadoEntrada: null,
      marcadoSalida: null,
      esSuperposicion: true
    }
  ];

  const marcacionModalBackdrop = document.getElementById('marcacionModalBackdrop');
  const btnOpenMarcacionModal = document.getElementById('btnOpenMarcacionModal');
  const btnMarcacionModalClose = document.getElementById('btnMarcacionModalClose');
  const marcacionClasesList = document.getElementById('marcacionClasesList');
  const marcacionConflictAlert = document.getElementById('marcacionConflictAlert');
  const marcacionConflictText = document.getElementById('marcacionConflictText');
  const marcacionEmpalmeContainer = document.getElementById('marcacionEmpalmeContainer');
  const btnEmpalmeContinuo = document.getElementById('btnEmpalmeContinuo');

  function obtenerMinutosActuales() {
    if (modoSimulacionActivo) {
      return horaSimulada.horas * 60 + horaSimulada.minutos;
    }
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function formatearMinutosAHora(minutosTotales) {
    const h = Math.floor(minutosTotales / 60);
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

    // Detectar clase anterior consecutiva (ej: fin de clase A coincide con inicio de clase B)
    const claseAnteriorConsecutiva = sesionesDocente.find(s => s.finMinutos === sesion.inicioMinutos && s.id !== sesion.id);

    // Detectar superposición de horario con otra clase
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

    if (!marcacionClasesList) return;

    marcacionClasesList.innerHTML = '';
    let haySuperposicionActiva = false;
    let textoConflicto = '';
    let empalmeActivo = null;

    let hayClaseHabilitada = false;
    let claseHabilitadaCodigo = '';

    sesionesDocente.forEach(sesion => {
      const evalInfo = evaluarSesion(sesion, minutosActuales);

      let estadoTexto = '';
      let badgeColor = '#5B6E80';
      let badgeBg = '#F1F5F9';
      let puedeMarcarEntrada = false;
      let puedeMarcarSalida = false;

      // 1. Estado completado
      if (sesion.marcadoEntrada && sesion.marcadoSalida) {
        estadoTexto = 'Asistencia Completada';
        badgeColor = '#278B52';
        badgeBg = '#E7F8EF';
      }
      // 2. Estado en dictado
      else if (sesion.marcadoEntrada && !sesion.marcadoSalida) {
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
      // 3. Estado no marcado
      else {
        if (evalInfo.habilitadoPorVentana15Min && !evalInfo.yaFinalizo) {
          estadoTexto = evalInfo.yaInicio ? 'En Curso · Habilitado' : 'Habilitado (15 min antes)';
          badgeColor = '#0F848F';
          badgeBg = '#E6F3F4';
          puedeMarcarEntrada = true;
          hayClaseHabilitada = true;
          claseHabilitadaCodigo = sesion.codigo;
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

      // Detectar empalme consecutivo
      if (evalInfo.claseAnteriorConsecutiva && !sesion.marcadoEntrada) {
        const claseAnt = evalInfo.claseAnteriorConsecutiva;
        if (claseAnt.marcadoEntrada && !claseAnt.marcadoSalida && evalInfo.habilitadoPorVentana15Min) {
          empalmeActivo = { claseAnterior: claseAnt, claseSiguiente: sesion };
        }
      }

      // Detectar superposición
      if (sesion.esSuperposicion && evalInfo.hayConflictoSuperposicion && (puedeMarcarEntrada || sesion.marcadoEntrada)) {
        haySuperposicionActiva = true;
        textoConflicto = `Alerta de conflicto: La clase ${sesion.codigo} coincide en horario con ${evalInfo.clasesSuperpuestas.map(c => c.codigo).join(', ')}. El sistema bloquea duplicidad de horas.`;
      }

      // Renderizar tarjeta de clase
      const classCard = document.createElement('div');
      classCard.className = 'marcacion-class-card';
      classCard.innerHTML = `
        <div class="marcacion-class-header">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #0F848F; text-transform: uppercase;">
              ${sesion.codigo} · ${sesion.tipo} · ${sesion.modalidad}
            </div>
            <h4 class="marcacion-class-title">${sesion.nombre}</h4>
            <div class="marcacion-class-meta">${sesion.aula}</div>
          </div>
          <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; color: ${badgeColor}; background-color: ${badgeBg};">
            ${estadoTexto}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px;">
          <div>
            <span style="font-size: 11px; color: #5B6E80; display: block;">Horario</span>
            <strong style="font-size: 12.5px; color: #222;">${sesion.inicioStr} - ${sesion.finStr}</strong>
          </div>
          <div>
            <span style="font-size: 11px; color: #5B6E80; display: block;">Entrada</span>
            <strong style="font-size: 12.5px; color: ${sesion.marcadoEntrada ? '#278B52' : '#94A3B8'};">
              ${sesion.marcadoEntrada || 'Sin registrar'}
            </strong>
          </div>
          <div>
            <span style="font-size: 11px; color: #5B6E80; display: block;">Salida</span>
            <strong style="font-size: 12.5px; color: ${sesion.marcadoSalida ? '#278B52' : '#94A3B8'};">
              ${sesion.marcadoSalida || 'Sin registrar'}
            </strong>
          </div>
        </div>

        <div class="marcacion-class-footer">
          <span style="font-size: 12px; color: #5B6E80;">
            ${evalInfo.minutosParaInicio > 15 ? `Ventana habilitará 15 minutos antes (${formatearMinutosAHora(sesion.inicioMinutos - 15)})` : 'Ventana de marcación activa'}
          </span>
          <div>
            ${!sesion.marcadoEntrada ? `
              <button type="button" class="btn btn-primary" style="padding: 8px 16px; font-size: 13px;" ${!puedeMarcarEntrada ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} data-punch-action="entrada" data-punch-id="${sesion.id}">
                Marcar Entrada
              </button>
            ` : ''}

            ${sesion.marcadoEntrada && !sesion.marcadoSalida ? `
              <button type="button" class="btn btn-black" style="padding: 8px 16px; font-size: 13px;" data-punch-action="salida" data-punch-id="${sesion.id}">
                Marcar Salida
              </button>
            ` : ''}

            ${sesion.marcadoEntrada && sesion.marcadoSalida ? `
              <span style="color: #278B52; font-weight: 700; font-size: 12px;">✔ Marcación Concluida</span>
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
        btnEmpalmeContinuo.textContent = `⚡ Empalme Continuo: Salida de ${empalmeActivo.claseAnterior.codigo} y Entrada a ${empalmeActivo.claseSiguiente.codigo}`;
        btnEmpalmeContinuo.onclick = () => {
          ejecutarEmpalme(empalmeActivo.claseAnterior, empalmeActivo.claseSiguiente);
        };
      } else {
        marcacionEmpalmeContainer.style.display = 'none';
      }
    }

    // Actualizar indicador de la barra superior
    if (livePunchStatus) {
      const tieneClaseEnCurso = sesionesDocente.some(s => s.marcadoEntrada && !s.marcadoSalida);
      if (hayClaseHabilitada) {
        livePunchStatus.className = 'punch-status-pill success';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> Habilitado (${claseHabilitadaCodigo})`;
      } else if (tieneClaseEnCurso) {
        livePunchStatus.className = 'punch-status-pill success';
        livePunchStatus.innerHTML = `<span class="punch-status-dot"></span> Clase en curso`;
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
      mostrarToast(`Entrada registrada para ${sesion.codigo} a las ${horaTexto}`);
    } else if (accion === 'salida') {
      sesion.marcadoSalida = horaTexto;
      mostrarToast(`Salida registrada para ${sesion.codigo} a las ${horaTexto}`);
    }

    actualizarMotorMarcacion();
  }

  function ejecutarEmpalme(claseAnt, claseSig) {
    const horaTexto = formatearMinutosAHora(obtenerMinutosActuales());
    claseAnt.marcadoSalida = horaTexto;
    claseSig.marcadoEntrada = horaTexto;
    mostrarToast(`Empalme continuo registrado: Salida de ${claseAnt.codigo} y Entrada a ${claseSig.codigo} a las ${horaTexto}`);
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
      toast.style.backgroundColor = '#222222';
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
    }, 4000);
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
        b.style.backgroundColor = '';
        b.style.color = '';
        b.style.borderColor = '';
      });
      this.style.backgroundColor = '#0F848F';
      this.style.color = '#FFFFFF';
      this.style.borderColor = '#0F848F';

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

  // Inicializar estado de marcación
  actualizarMotorMarcacion();
});
