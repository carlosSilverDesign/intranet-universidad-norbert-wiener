/**
 * Script de la sección Encuesta Delegado - Perfil Docente
 * Universidad Norbert Wiener
 * Selects personalizados con Smart Flip y animación 180°,
 * tabla interactiva con los 20 delegados y modal de evaluación Likert (UI Alumno).
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. INICIALIZACIÓN DE CUSTOM SELECTS WIENER
  // ==========================================================================
  const selectContainers = document.querySelectorAll('.custom-select-container');

  function closeAllDropdowns() {
    selectContainers.forEach(container => {
      container.classList.remove('is-open');
      const trigger = container.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  selectContainers.forEach(container => {
    const trigger = container.querySelector('.custom-select-trigger');
    const menu = container.querySelector('.custom-dropdown-menu');
    const label = container.querySelector('.custom-select-label');
    const options = container.querySelectorAll('.custom-option');
    const hiddenInput = container.querySelector('input[type="hidden"]');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        // Smart Flip (si no cabe abajo, abrir hacia arriba)
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

        if (window.innerWidth - triggerRect.left < 280) {
          menu.classList.add('align-right');
        }

        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const textSpan = option.querySelector('span');
        const text = textSpan ? textSpan.textContent.trim() : value;

        if (label) label.textContent = text;
        if (hiddenInput) hiddenInput.value = value;

        options.forEach(opt => opt.classList.remove('is-selected'));
        option.classList.add('is-selected');

        closeAllDropdowns();
      });
    });
  });

  // Cerrar al hacer clic fuera o presionar Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-container')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeSurveyModal();
      closeSuccessModal();
    }
  });

  // ==========================================================================
  // 2. DATOS DE LOS 20 DELEGADOS (REFERENCIA EXACTA IMAGEN 2)
  // ==========================================================================
  const delegadosData = [
    { id: 1, code: '2022200833', name: 'ABAD PACHECO, GIANELLA DANNIA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 2, code: '2025202624', name: 'BERNILLA DE LA CRUZ, ZUCETTY ELIZABETH', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 3, code: '2023200116', name: 'CHIRINOS LOPEZ, JUSSAN SHEYLA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 4, code: '2023201450', name: 'CORDOVA GARCIA, DANITZA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 5, code: '2025104183', name: 'DAVILA ROMERO, SHULEYKA YERALDINI', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 6, code: '2024104180', name: 'DE LA CRUZ TENORIO, ISAAC JHOEL', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 7, code: '2024104194', name: 'FALCON ZEVALLOS, JHINA MARIA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 8, code: '2024200641', name: 'GABI MAMANI, JESELI LEOMARIS', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 9, code: '2022200772', name: 'GAMARRA MOYA, MARICELA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 10, code: '2023102191', name: 'HUANCA MATOS, GISELA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 11, code: '2025102851', name: 'HUZCO CHAVEZ, JOHANA NICOLL', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 12, code: '2021102819', name: 'MUÑICO CENTENO, MYRIAM CAROL', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 13, code: '2024106423', name: 'ORTIZ COTRINA, MELANIA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 14, code: '2023201251', name: 'QUILIANO GALARZA, JAMES RENATO', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 15, code: '2025103582', name: 'QUINTANA FLORES, JIMENA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 16, code: '2025103623', name: 'QUIROZ CALSINA, ADELY JOHANA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 17, code: '2026101018', name: 'RIVAS OLIVA, LUIS', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 18, code: '2024103699', name: 'ROCA COTRINA, YAMILE JESENIA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 19, code: '2024105233', name: 'RODRIGUEZ HERRADA, JOMAYRA ALEXANDRA', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} },
    { id: 20, code: '2025200386', name: 'SULCA CHUCO, AARON ISRAEL', section: 'AD2N2', course: 'AD8021 - INFORMÁTICA PARA LOS NEGOCIOS', evaluated: false, answers: {} }
  ];

  // Elementos DOM
  const tableBody = document.getElementById('surveyTableBody');
  const btnMostrar = document.getElementById('btnMostrar');
  const quickSearchInput = document.getElementById('quickSearchInput');
  const totalCountSpan = document.getElementById('totalCountSpan');
  const evaluatedCountSpan = document.getElementById('evaluatedCountSpan');
  const pendingCountSpan = document.getElementById('pendingCountSpan');

  // Modal de Evaluación
  const modalBackdrop = document.getElementById('modalEncuestaDelegado');
  const modalCloseBtn = document.getElementById('surveyModalClose');
  const modalStudentTitle = document.getElementById('modalStudentTitle');
  const modalStudentSubtitle = document.getElementById('modalStudentSubtitle');
  const surveyProgressText = document.getElementById('surveyProgressText');
  const surveyProgressFill = document.getElementById('surveyProgressFill');
  const btnGrabar = document.getElementById('btnGrabarEvaluacion');

  // Modal de Éxito
  const modalSuccess = document.getElementById('modalSurveySuccess');
  const btnSuccessClose = document.getElementById('btnSuccessClose');
  const successStudentName = document.getElementById('successStudentName');

  let currentDelegateId = null;
  let currentAnswers = {};

  // Renderizar filas de la tabla
  function renderTable(data = delegadosData) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 36px 16px; color: #64748B;">
            <p style="margin: 0; font-size: 14px;">No se encontraron delegados para los filtros seleccionados.</p>
          </td>
        </tr>
      `;
      return;
    }

    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.id = `row-delegate-${item.id}`;
      tr.innerHTML = `
        <td class="td-num">${index + 1}</td>
        <td class="td-student">
          <strong>${item.code}</strong> - ${item.name}
        </td>
        <td class="td-section">${item.section}</td>
        <td class="td-course">${item.course}</td>
        <td class="td-status">
          <span class="status-pill ${item.evaluated ? 'evaluated' : 'pending'}" id="status-badge-${item.id}">
            ${item.evaluated ? 'Evaluado' : 'Pendiente'}
          </span>
        </td>
        <td class="td-action">
          <button type="button" class="btn-evaluar-action ${item.evaluated ? 'is-evaluated' : ''}" data-id="${item.id}" id="btn-eval-${item.id}">
            ${item.evaluated ? 'Modificar' : 'Evaluar'}
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    updateCounters();
    bindEvalButtons();
  }

  function updateCounters() {
    const total = delegadosData.length;
    const evaluated = delegadosData.filter(d => d.evaluated).length;
    const pending = total - evaluated;

    if (totalCountSpan) totalCountSpan.textContent = total;
    if (evaluatedCountSpan) evaluatedCountSpan.textContent = evaluated;
    if (pendingCountSpan) pendingCountSpan.textContent = pending;
  }

  function bindEvalButtons() {
    const buttons = document.querySelectorAll('.btn-evaluar-action');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        openSurveyModal(id);
      });
    });
  }

  // ==========================================================================
  // 3. CONTROL DEL MODAL DE EVALUACIÓN
  // ==========================================================================
  function openSurveyModal(delegateId) {
    const delegate = delegadosData.find(d => d.id === delegateId);
    if (!delegate) return;

    currentDelegateId = delegateId;
    currentAnswers = { ...(delegate.answers || {}) };

    if (modalStudentTitle) {
      modalStudentTitle.textContent = `${delegate.code} - ${delegate.name}`;
    }
    if (modalStudentSubtitle) {
      modalStudentSubtitle.textContent = `Sección: ${delegate.section} • Curso: ${delegate.course}`;
    }

    // Resetear o cargar respuestas previas en la escala Likert
    for (let q = 1; q <= 4; q++) {
      const radioInputs = document.querySelectorAll(`input[name="q${q}"]`);
      radioInputs.forEach(input => {
        const isChecked = currentAnswers[q] === input.value;
        input.checked = isChecked;
        const parentLabel = input.closest('.likert-option-label');
        if (parentLabel) {
          if (isChecked) {
            parentLabel.classList.add('is-selected');
          } else {
            parentLabel.classList.remove('is-selected');
          }
        }
      });

      const questionItem = document.getElementById(`questionItem${q}`);
      if (questionItem) {
        if (currentAnswers[q]) {
          questionItem.classList.add('has-answer');
        } else {
          questionItem.classList.remove('has-answer');
        }
      }
    }

    updateModalProgress();

    if (modalBackdrop) {
      modalBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSurveyModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    currentDelegateId = null;
  }

  function closeSuccessModal() {
    if (modalSuccess) {
      modalSuccess.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSurveyModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSurveyModal();
    });
  }

  if (btnSuccessClose) btnSuccessClose.addEventListener('click', closeSuccessModal);
  if (modalSuccess) {
    modalSuccess.addEventListener('click', (e) => {
      if (e.target === modalSuccess) closeSuccessModal();
    });
  }

  // Selección de respuestas Likert
  const likertLabels = document.querySelectorAll('.likert-option-label');
  likertLabels.forEach(label => {
    label.addEventListener('click', () => {
      const input = label.querySelector('input[type="radio"]');
      if (!input) return;

      const qNum = input.name.replace('q', '');
      const val = input.value;

      currentAnswers[qNum] = val;

      // Resaltar etiqueta seleccionada en el grupo
      const siblings = label.closest('.likert-scale-grid').querySelectorAll('.likert-option-label');
      siblings.forEach(s => s.classList.remove('is-selected'));
      label.classList.add('is-selected');

      const questionItem = document.getElementById(`questionItem${qNum}`);
      if (questionItem) questionItem.classList.add('has-answer');

      updateModalProgress();
    });
  });

  function updateModalProgress() {
    const answeredCount = Object.keys(currentAnswers).length;
    const totalQuestions = 4;
    const percentage = Math.round((answeredCount / totalQuestions) * 100);

    if (surveyProgressText) {
      surveyProgressText.textContent = `${answeredCount} de ${totalQuestions} respondidas (${percentage}%)`;
    }
    if (surveyProgressFill) {
      surveyProgressFill.style.width = `${percentage}%`;
    }
  }

  // Guardar Evaluación (Botón GRABAR)
  if (btnGrabar) {
    btnGrabar.addEventListener('click', (e) => {
      e.preventDefault();

      const answeredCount = Object.keys(currentAnswers).length;
      if (answeredCount < 4) {
        alert('Por favor responde las 4 preguntas de la encuesta antes de grabar.');
        return;
      }

      const delegate = delegadosData.find(d => d.id === currentDelegateId);
      if (delegate) {
        delegate.evaluated = true;
        delegate.answers = { ...currentAnswers };

        // Actualizar fila visualmente
        const statusBadge = document.getElementById(`status-badge-${delegate.id}`);
        const actionBtn = document.getElementById(`btn-eval-${delegate.id}`);

        if (statusBadge) {
          statusBadge.className = 'status-pill evaluated';
          statusBadge.textContent = 'Evaluado';
        }
        if (actionBtn) {
          actionBtn.className = 'btn-evaluar-action is-evaluated';
          actionBtn.textContent = 'Modificar';
        }

        updateCounters();

        closeSurveyModal();

        // Mostrar confirmación
        if (successStudentName) {
          successStudentName.textContent = delegate.name;
        }
        if (modalSuccess) {
          modalSuccess.classList.add('is-open');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  }

  // Búsqueda Rápida en tabla
  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = delegadosData.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.course.toLowerCase().includes(q)
      );
      renderTable(filtered);
    });
  }

  // Botón Mostrar
  if (btnMostrar) {
    btnMostrar.addEventListener('click', () => {
      if (quickSearchInput) quickSearchInput.value = '';
      renderTable(delegadosData);
    });
  }

  // Render inicial
  renderTable();
});
