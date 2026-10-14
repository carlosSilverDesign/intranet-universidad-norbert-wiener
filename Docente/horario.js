/**
 * HORARIO DE CLASES - PORTAL DOCENTE UNIVERSIDAD NORBERT WIENER
 * Controladores e interacción dinámica para la vista de Horario (Desktop & Mobile)
 * Look & feel institucional con arquitectura de calendario vivo estilo Teams.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias Desktop
  const btnDateDropdown = document.getElementById('btnDateRangeDropdown');
  const miniCalPopup = document.getElementById('miniCalendarPopup');
  const btnPrevWeek = document.getElementById('btnPrevWeek');
  const btnNextWeek = document.getElementById('btnNextWeek');
  const btnToday = document.getElementById('btnToday');
  const labelDateRange = document.getElementById('labelDateRange');

  const btnViewWeek = document.getElementById('btnViewWeek');
  const btnViewMonth = document.getElementById('btnViewMonth');
  const scheduleWeeklyView = document.getElementById('scheduleWeeklyView');
  const scheduleMonthlyView = document.getElementById('scheduleMonthlyView');

  const filterBtns = document.querySelectorAll('.cal-filter-btn');
  const scheduleCards = document.querySelectorAll('.schedule-card');
  const monthlyChips = document.querySelectorAll('.monthly-event-chip');

  // Referencias Mobile (Según captura adjunta de Teams Mobile)
  const btnMobileAgenda = document.getElementById('btnMobileAgenda');
  const btnMobileDia = document.getElementById('btnMobileDia');
  const mobileDayTimelineWrap = document.getElementById('mobileDayTimelineWrap');
  const mobileAgendaList = document.getElementById('mobileAgendaList');
  const mobileStripDays = document.querySelectorAll('.mobile-strip-day');
  const mobileCardsLayer = document.getElementById('mobileCardsLayer');
  const mobileAllDayText = document.getElementById('mobileAllDayText');

  // Referencias Modal de Detalle
  const modalBackdrop = document.getElementById('scheduleModalBackdrop');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnModalCancel = document.getElementById('btnModalCancel');
  const btnModalAction = document.getElementById('btnModalAction');

  const modalTypeBadge = document.getElementById('modalTypeBadge');
  const modalCourseTitle = document.getElementById('modalCourseTitle');
  const modalCodeSubtitle = document.getElementById('modalCodeSubtitle');
  const modalAula = document.getElementById('modalAula');
  const modalSede = document.getElementById('modalSede');
  const modalHorario = document.getElementById('modalHorario');
  const modalTipoSesion = document.getElementById('modalTipoSesion');
  const modalModalidad = document.getElementById('modalModalidad');
  const modalMatriculados = document.getElementById('modalMatriculados');
  const modalAlertConflict = document.getElementById('modalAlertConflict');

  const btnResolveConflictBanner = document.getElementById('btnResolveConflictBanner');
  const liveTimeIndicator = document.getElementById('liveTimeIndicator');

  // Estado activo
  let currentWeekOffset = 0;
  let activeMobileDay = 'martes'; // Día inicial activo: Martes 13

  // =========================================================================
  // 1. CONTROL DEL SELECTOR DESPLEGABLE DE FECHA (MINI CALENDARIO DESKTOP)
  // =========================================================================
  if (btnDateDropdown && miniCalPopup) {
    btnDateDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = miniCalPopup.classList.contains('show');
      if (isOpen) {
        miniCalPopup.classList.remove('show');
        btnDateDropdown.classList.remove('active');
      } else {
        miniCalPopup.classList.add('show');
        btnDateDropdown.classList.add('active');
      }
    });

    document.addEventListener('click', (e) => {
      if (!miniCalPopup.contains(e.target) && !btnDateDropdown.contains(e.target)) {
        miniCalPopup.classList.remove('show');
        btnDateDropdown.classList.remove('active');
      }
    });
  }

  const miniCalDays = document.querySelectorAll('.mini-cal-day-cell');
  miniCalDays.forEach(day => {
    day.addEventListener('click', () => {
      miniCalDays.forEach(d => d.classList.remove('today-live'));
      day.classList.add('today-live');
      const dayNum = day.textContent.trim();
      if (labelDateRange) {
        labelDateRange.textContent = `${dayNum} de Octubre de 2026`;
      }
      if (miniCalPopup) {
        miniCalPopup.classList.remove('show');
        btnDateDropdown.classList.remove('active');
      }
    });
  });

  const miniCalMonths = document.querySelectorAll('.mini-cal-month-pill');
  miniCalMonths.forEach(m => {
    m.addEventListener('click', () => {
      miniCalMonths.forEach(el => el.classList.remove('active'));
      m.classList.add('active');
      const monthTitle = document.querySelector('.mini-cal-month-title');
      if (monthTitle) {
        monthTitle.textContent = `${m.textContent} 2026`;
      }
    });
  });

  const btnQuickToday = document.getElementById('btnQuickToday');
  if (btnQuickToday) {
    btnQuickToday.addEventListener('click', () => {
      resetToCurrentWeek();
      if (miniCalPopup) {
        miniCalPopup.classList.remove('show');
        btnDateDropdown.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 2. NAVEGACIÓN DE SEMANAS DESKTOP
  // =========================================================================
  function updateWeekLabel() {
    if (!labelDateRange) return;
    if (currentWeekOffset === 0) {
      labelDateRange.textContent = '12–18 de Octubre de 2026';
    } else if (currentWeekOffset === 1) {
      labelDateRange.textContent = '19–25 de Octubre de 2026';
    } else if (currentWeekOffset === -1) {
      labelDateRange.textContent = '05–11 de Octubre de 2026';
    } else {
      labelDateRange.textContent = `Semana ${currentWeekOffset > 0 ? '+' : ''}${currentWeekOffset} · Ciclo 2026-II`;
    }
  }

  function resetToCurrentWeek() {
    currentWeekOffset = 0;
    updateWeekLabel();
    miniCalDays.forEach(d => {
      if (d.textContent.trim() === '13') {
        d.classList.add('today-live');
      } else {
        d.classList.remove('today-live');
      }
    });
    // Sincronizar mobile a Martes 13
    selectMobileDay('martes');
  }

  if (btnPrevWeek) {
    btnPrevWeek.addEventListener('click', () => {
      currentWeekOffset--;
      updateWeekLabel();
    });
  }

  if (btnNextWeek) {
    btnNextWeek.addEventListener('click', () => {
      currentWeekOffset++;
      updateWeekLabel();
    });
  }

  if (btnToday) {
    btnToday.addEventListener('click', () => {
      resetToCurrentWeek();
    });
  }

  // =========================================================================
  // 3. CONMUTADOR DE VISTAS DESKTOP: SEMANA VS MES
  // =========================================================================
  if (btnViewWeek && btnViewMonth) {
    btnViewWeek.addEventListener('click', () => {
      btnViewWeek.classList.add('active');
      btnViewMonth.classList.remove('active');
      if (scheduleWeeklyView) scheduleWeeklyView.style.display = 'block';
      if (scheduleMonthlyView) scheduleMonthlyView.classList.remove('active');
    });

    btnViewMonth.addEventListener('click', () => {
      btnViewMonth.classList.add('active');
      btnViewWeek.classList.remove('active');
      if (scheduleWeeklyView) scheduleWeeklyView.style.display = 'none';
      if (scheduleMonthlyView) scheduleMonthlyView.classList.add('active');
    });
  }

  // =========================================================================
  // 4. FILTROS RÁPIDOS DESKTOP
  // =========================================================================
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      scheduleCards.forEach(card => {
        const type = card.getAttribute('data-type');
        const isConflict = card.classList.contains('overlap-left') || card.classList.contains('overlap-right');

        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'classes') {
          card.style.display = (type === 'clase') ? 'flex' : 'none';
        } else if (filter === 'events') {
          card.style.display = (type === 'evento' || type === 'capacitacion') ? 'flex' : 'none';
        } else if (filter === 'conflicts') {
          card.style.display = isConflict ? 'flex' : 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. VERSIÓN MOBILE ESPECÍFICA (TEAMS MOBILE SEGÚN CAPTURA ADJUNTA)
  // =========================================================================
  function renderMobileDayCards(dayName) {
    if (!mobileCardsLayer || !mobileAgendaList) return;

    // Obtener los cards de ese día desde la columna desktop correspondiente
    const desktopCol = document.querySelector(`.schedule-day-column[data-day="${dayName}"]`);
    const dayCards = desktopCol ? desktopCol.querySelectorAll('.schedule-card') : [];

    mobileCardsLayer.innerHTML = '';
    mobileAgendaList.innerHTML = '';

    // Actualizar texto de todo el día para ese día
    if (mobileAllDayText) {
      if (dayName === 'martes') {
        mobileAllDayText.textContent = 'Hito: Cierre de Registro de Notas Parciales';
      } else {
        mobileAllDayText.textContent = 'No hay ningún evento de todo el día';
      }
    }

    if (dayCards.length === 0) {
      mobileAgendaList.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: #5B6E80; font-family: 'Roboto', sans-serif;">
          <p style="font-size: 14px; margin-bottom: 4px;">Sin actividades programadas para este día.</p>
          <span style="font-size: 12px; color: #9AA6B2;">Disfruta tu jornada docente o prepara materiales.</span>
        </div>
      `;
      return;
    }

    // Clonar los cards en la capa móvil
    dayCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.addEventListener('click', () => {
        triggerCardClick(card);
      });
      mobileCardsLayer.appendChild(clone);

      // Crear tarjeta para vista Agenda
      const isDGDD = card.getAttribute('data-type') === 'capacitacion';
      const isConflict = card.hasAttribute('data-conflict');
      const agendaItem = document.createElement('div');
      agendaItem.className = `agenda-card-item ${isDGDD ? 'item-dgdd' : ''} ${isConflict ? 'item-conflict' : ''}`;
      agendaItem.innerHTML = `
        <div class="agenda-card-time">${card.getAttribute('data-horario')}</div>
        <div class="agenda-card-title">${card.getAttribute('data-title')}</div>
        <div class="agenda-card-meta">${card.getAttribute('data-aula')} · ${card.getAttribute('data-sede')}</div>
        <div style="display: flex; gap: 6px;">
          <span class="pill-session-type">${card.getAttribute('data-sesion')}</span>
          <span class="pill-modality-presencial" style="background-color: ${isDGDD ? '#7C3AED' : '#0F848F'};">
            ${card.getAttribute('data-modalidad')}
          </span>
        </div>
      `;
      agendaItem.addEventListener('click', () => {
        triggerCardClick(card);
      });
      mobileAgendaList.appendChild(agendaItem);
    });
  }

  function selectMobileDay(dayName) {
    activeMobileDay = dayName;
    mobileStripDays.forEach(d => {
      if (d.getAttribute('data-day') === dayName) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
    renderMobileDayCards(dayName);
  }

  mobileStripDays.forEach(stripDay => {
    stripDay.addEventListener('click', () => {
      const day = stripDay.getAttribute('data-day');
      selectMobileDay(day);
    });
  });

  // Switcher Mobile: Agenda vs Día
  if (btnMobileAgenda && btnMobileDia) {
    btnMobileAgenda.addEventListener('click', () => {
      btnMobileAgenda.classList.add('active');
      btnMobileDia.classList.remove('active');
      if (mobileDayTimelineWrap) mobileDayTimelineWrap.style.display = 'none';
      if (mobileAgendaList) mobileAgendaList.classList.add('active');
    });

    btnMobileDia.addEventListener('click', () => {
      btnMobileDia.classList.add('active');
      btnMobileAgenda.classList.remove('active');
      if (mobileDayTimelineWrap) mobileDayTimelineWrap.style.display = 'block';
      if (mobileAgendaList) mobileAgendaList.classList.remove('active');
    });
  }

  // Inicializar día móvil activo (Martes 13)
  selectMobileDay('martes');

  // =========================================================================
  // 6. APERTURA DE MODAL DE DETALLE
  // =========================================================================
  function triggerCardClick(card) {
    const cardData = {
      title: card.getAttribute('data-title'),
      subtitle: card.getAttribute('data-subtitle'),
      aula: card.getAttribute('data-aula'),
      sede: card.getAttribute('data-sede'),
      horario: card.getAttribute('data-horario'),
      tipoSesion: card.getAttribute('data-sesion'),
      modalidad: card.getAttribute('data-modalidad'),
      matriculados: card.getAttribute('data-matriculados'),
      badgeText: card.getAttribute('data-badgetext'),
      badgeClass: card.getAttribute('data-badgeclass'),
      hasConflict: card.hasAttribute('data-conflict'),
      isVirtual: card.getAttribute('data-modalidad') === 'Virtual En vivo',
      isTraining: card.getAttribute('data-type') === 'capacitacion'
    };
    openCardDetails(cardData);
  }

  function openCardDetails(cardData) {
    if (!modalBackdrop) return;

    if (modalTypeBadge) {
      modalTypeBadge.textContent = cardData.badgeText || 'Clase Regular';
      modalTypeBadge.className = 'modal-header-badge ' + (cardData.badgeClass || 'badge-medicina');
    }
    if (modalCourseTitle) modalCourseTitle.textContent = cardData.title || '';
    if (modalCodeSubtitle) modalCodeSubtitle.textContent = cardData.subtitle || '';
    if (modalAula) modalAula.textContent = cardData.aula || 'No asignada';
    if (modalSede) modalSede.textContent = cardData.sede || 'Campus Lima Centro';
    if (modalHorario) modalHorario.textContent = cardData.horario || '';
    if (modalTipoSesion) modalTipoSesion.textContent = cardData.tipoSesion || 'Teoría';
    if (modalModalidad) modalModalidad.textContent = cardData.modalidad || 'Presencial';
    if (modalMatriculados) modalMatriculados.textContent = cardData.matriculados || '32 alumnos';

    if (modalAlertConflict) {
      modalAlertConflict.style.display = cardData.hasConflict ? 'flex' : 'none';
    }

    if (btnModalAction) {
      if (cardData.isVirtual) {
        btnModalAction.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
          Unirse a Teams`;
        btnModalAction.onclick = () => {
          alert(`Redirigiendo a Microsoft Teams para: ${cardData.title}`);
        };
      } else if (cardData.isTraining) {
        btnModalAction.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          Materiales DGDD`;
        btnModalAction.onclick = () => {
          alert(`Abriendo materiales de la capacitación: ${cardData.title}`);
        };
      } else {
        btnModalAction.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          Tomar Asistencia`;
        btnModalAction.onclick = () => {
          window.location.href = 'asistencia-alumno.html';
        };
      }
    }

    modalBackdrop.classList.add('open');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  scheduleCards.forEach(card => {
    card.addEventListener('click', () => {
      triggerCardClick(card);
    });
  });

  monthlyChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const chipData = {
        title: chip.getAttribute('data-title'),
        subtitle: chip.getAttribute('data-subtitle') || 'Medicina Humana',
        aula: chip.getAttribute('data-aula') || 'WT101',
        sede: chip.getAttribute('data-sede') || 'Campus Lima Centro',
        horario: chip.getAttribute('data-horario'),
        tipoSesion: chip.getAttribute('data-sesion') || 'Teoría',
        modalidad: chip.getAttribute('data-modalidad') || 'Presencial',
        matriculados: '36 alumnos',
        badgeText: chip.classList.contains('chip-training') ? 'Capacitación DGDD' : 'Medicina Humana',
        badgeClass: chip.classList.contains('chip-training') ? 'badge-training' : 'badge-medicina',
        hasConflict: chip.classList.contains('chip-conflict'),
        isVirtual: false,
        isTraining: chip.classList.contains('chip-training')
      };
      openCardDetails(chipData);
    });
  });

  if (btnResolveConflictBanner) {
    btnResolveConflictBanner.addEventListener('click', () => {
      const conflictCard = document.querySelector('.schedule-card[data-conflict]');
      if (conflictCard) {
        triggerCardClick(conflictCard);
      }
    });
  }

  // 7. Línea de hora en vivo desktop
  function updateLiveTimePosition() {
    if (!liveTimeIndicator) return;
    const hour = 11;
    const minutes = 40;
    const startHour = 7;
    const slotHeight = 64;

    if (hour >= startHour && hour <= 23) {
      const topPx = (hour - startHour + minutes / 60) * slotHeight;
      liveTimeIndicator.style.top = `${topPx}px`;
    }
  }

  updateLiveTimePosition();
});
