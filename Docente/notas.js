/**
 * ==========================================================================
 * REGISTRO DE NOTAS - PORTAL DOCENTE UNW
 * Lógica interactiva:
 * - 10 alumnos con datos de referencia
 * - Selector flotante de 2 Casuísticas (Default UD1 vs. Completo con Condición)
 * - Cronograma desplegable
 * - Validación de notas completas (0-20 o NP)
 * - Modal de coordenadas de seguridad (3 intentos)
 * - Modal de tarjeta bloqueada 24h con cuenta regresiva
 * - Modal de confirmación y guardado
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- DATOS MAESTROS DE LOS 10 ALUMNOS ---
  const STUDENTS_DATA = [
    {
      num: 1,
      code: "2026104373",
      name: "CUBAS GUERRA, Rubí",
      ed: 12,
      // Fase 1
      ud1: 16,
      ud2: 15,
      pep1: 15.4,
      e1: 14,
      pf1: 15,
      // Fase 2
      ud3: 17,
      ud4: 16,
      pep2: 16.6,
      e2: 15,
      pf2: 16.1,
      // Cierre
      e3: "—",
      pf: 16,
      condicion: "Aprobado"
    },
    {
      num: 2,
      code: "2025103274",
      name: "DIAZ SALAS, Franchesco",
      ed: 13,
      // Fase 1
      ud1: 16,
      ud2: 15,
      pep1: 15.4,
      e1: 14,
      pf1: 15,
      // Fase 2
      ud3: 17,
      ud4: 16,
      pep2: 16.6,
      e2: 16,
      pf2: 16.3,
      // Cierre
      e3: "—",
      pf: 16,
      condicion: "Aprobado"
    },
    {
      num: 3,
      code: "2024100600",
      name: "LINARES PALOMINO, Farid",
      ed: 15,
      // Fase 1
      ud1: 14,
      ud2: 13,
      pep1: 13.6,
      e1: 12,
      pf1: 13.1,
      // Fase 2
      ud3: 15,
      ud4: 14,
      pep2: 14.6,
      e2: 13,
      pf2: 14,
      // Cierre
      e3: "—",
      pf: 14,
      condicion: "Aprobado"
    },
    {
      num: 4,
      code: "2025108892",
      name: "ALVAREZ HUAMAN, Stefany Nicole",
      ed: 14,
      // Fase 1
      ud1: 17,
      ud2: 18,
      pep1: 17.5,
      e1: 16,
      pf1: 17.1,
      // Fase 2
      ud3: 18,
      ud4: 17,
      pep2: 17.5,
      e2: 18,
      pf2: 17.7,
      // Cierre
      e3: "—",
      pf: 17,
      condicion: "Aprobado"
    },
    {
      num: 5,
      code: "2026102144",
      name: "CASTILLO MENDOZA, Rodrigo André",
      ed: 10,
      // Fase 1
      ud1: "08",
      ud2: "09",
      pep1: 8.5,
      e1: "07",
      pf1: 8.1,
      // Fase 2
      ud3: 10,
      ud4: "09",
      pep2: 9.5,
      e2: "08",
      pf2: 9.1,
      // Cierre
      e3: 11,
      pf: 10,
      condicion: "Desaprobado"
    },
    {
      num: 6,
      code: "2024204519",
      name: "ESPINOZA QUISPE, Valeria Sofia",
      ed: 16,
      // Fase 1
      ud1: 18,
      ud2: 19,
      pep1: 18.5,
      e1: 17,
      pf1: 18.1,
      // Fase 2
      ud3: 19,
      ud4: 18,
      pep2: 18.5,
      e2: 18,
      pf2: 18.4,
      // Cierre
      e3: "—",
      pf: 18,
      condicion: "Aprobado"
    },
    {
      num: 7,
      code: "2025203381",
      name: "MAMANI GUTIERREZ, Christian Paul",
      ed: "08",
      // Fase 1
      ud1: "07",
      ud2: "08",
      pep1: 7.5,
      e1: "06",
      pf1: 7.1,
      // Fase 2
      ud3: "08",
      ud4: "07",
      pep2: 7.5,
      e2: "07",
      pf2: 7.4,
      // Cierre
      e3: "09",
      pf: "08",
      condicion: "Desaprobado"
    },
    {
      num: 8,
      code: "2026109920",
      name: "PALACIOS TORRES, Camila Alessandra",
      ed: 13,
      // Fase 1
      ud1: 15,
      ud2: 14,
      pep1: 14.5,
      e1: 13,
      pf1: 14.1,
      // Fase 2
      ud3: 16,
      ud4: 15,
      pep2: 15.5,
      e2: 14,
      pf2: 15.1,
      // Cierre
      e3: "—",
      pf: 15,
      condicion: "Aprobado"
    },
    {
      num: 9,
      code: "2023107890",
      name: "RODRIGUEZ PAREDES, Diego Alonso",
      ed: 11,
      // Fase 1
      ud1: 12,
      ud2: 13,
      pep1: 12.5,
      e1: 11,
      pf1: 12.1,
      // Fase 2
      ud3: 13,
      ud4: 12,
      pep2: 12.5,
      e2: 12,
      pf2: 12.4,
      // Cierre
      e3: "—",
      pf: 12,
      condicion: "Desaprobado"
    },
    {
      num: 10,
      code: "2026207711",
      name: "FERNANDEZ CASTRO, Luciana Nicole",
      ed: 15,
      // Fase 1
      ud1: 19,
      ud2: 18,
      pep1: 18.5,
      e1: 18,
      pf1: 18.4,
      // Fase 2
      ud3: 18,
      ud4: 19,
      pep2: 18.5,
      e2: 19,
      pf2: 18.7,
      // Cierre
      e3: "—",
      pf: 19,
      condicion: "Aprobado"
    }
  ];

  // Estado global de la aplicación
  let currentScenario = 'default'; // 'default' (UD1 activo) o 'complete' (todos con condición)
  let securityAttempts = 1;
  const MAX_ATTEMPTS = 3;
  const VALID_COORDINATE_VALUE = "84"; // Valor correcto para el demo
  const TARGET_COORDINATE = "E4";
  let isCardLocked = false;
  let countdownInterval = null;

  // Elementos DOM
  const tableBody = document.getElementById('notesTableBody');
  const btnSaveNotes = document.getElementById('btnGrabarNotas');
  const btnExportExcel = document.getElementById('btnDescargarExcel');
  const scheduleCard = document.getElementById('scheduleCard');
  const scheduleToggleBtn = document.getElementById('scheduleToggleBtn');
  const scheduleCardHeader = document.getElementById('scheduleCardHeader');

  // Modales
  const modalSecurity = document.getElementById('modalSecurity');
  const modalLocked = document.getElementById('modalLocked');
  const modalConfirm = document.getElementById('modalConfirm');

  // Campos Modal Seguridad
  const coordinateInput = document.getElementById('coordinateInput');
  const coordinateAttemptText = document.getElementById('coordinateAttemptText');
  const coordinateErrorMsg = document.getElementById('coordinateErrorMsg');
  const btnValidateCoordinate = document.getElementById('btnValidateCoordinate');
  const btnCloseSecurityModal = document.getElementById('btnCloseSecurityModal');

  // Campos Modal Bloqueo
  const btnCloseLockedModal = document.getElementById('btnCloseLockedModal');
  const countdownDisplay = document.getElementById('countdownDisplay');
  const btnResetLockDemo = document.getElementById('btnResetLockDemo');

  // Campos Modal Confirmación
  const btnAcceptSave = document.getElementById('btnAcceptSave');
  const btnCancelConfirm = document.getElementById('btnCancelConfirm');

  // Toast
  const toastNotification = document.getElementById('attendanceToast');
  const toastText = document.getElementById('attendanceToastText');

  // Switcher flotante
  const btnScenarioDefault = document.getElementById('btnScenarioDefault');
  const btnScenarioComplete = document.getElementById('btnScenarioComplete');


  /**
   * RENDERIZAR LA TABLA DE NOTAS SEGÚN EL ESCENARIO ACTIVO
   */
  function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    STUDENTS_DATA.forEach((student) => {
      const row = document.createElement('div');
      row.className = 'notes-table-row';
      row.setAttribute('data-student-id', student.code);

      if (currentScenario === 'default') {
        // ESCENARIO 1 (Por Defecto): UD1 es input editable, UD2..PF son "—"
        row.innerHTML = `
          <!-- Sticky 1: N° -->
          <div class="td-cell sticky-td-1">${student.num}</div>
          <!-- Sticky 2: CÓDIGO -->
          <div class="td-cell sticky-td-2">${student.code}</div>
          <!-- Sticky 3: APELLIDOS Y NOMBRES -->
          <div class="td-cell sticky-td-3" title="${student.name}">${student.name}</div>

          <!-- ED (Evaluación de entrada) -->
          <div class="td-cell td-ed">${student.ed}</div>

          <!-- (PF1) Primera Fase 40% -->
          <!-- UD1 Editable -->
          <div class="td-cell td-fase1">
            <input type="text" 
                   class="note-input input-ud1" 
                   value="${student.ud1}" 
                   maxlength="2" 
                   data-index="${student.num}"
                   aria-label="Nota UD1 para ${student.name}">
          </div>
          <!-- UD2 -->
          <div class="td-cell td-fase1 td-ud2">—</div>
          <!-- PEP -->
          <div class="td-cell td-fase1 td-avg td-pep1">—</div>
          <!-- E1 -->
          <div class="td-cell td-fase1 td-e1">—</div>
          <!-- PF1 -->
          <div class="td-cell td-fase1 td-avg td-pf1">—</div>

          <!-- (PF2) Segunda Fase 60% -->
          <!-- UD3 -->
          <div class="td-cell td-fase2 td-ud3">—</div>
          <!-- UD4 -->
          <div class="td-cell td-fase2 td-ud4">—</div>
          <!-- PEP -->
          <div class="td-cell td-fase2 td-avg td-pep2">—</div>
          <!-- E2 -->
          <div class="td-cell td-fase2 td-e2">—</div>
          <!-- PF2 -->
          <div class="td-cell td-fase2 td-avg td-pf2">—</div>

          <!-- Cierre -->
          <!-- E3 -->
          <div class="td-cell td-e3">—</div>
          <!-- PF -->
          <div class="td-cell td-pf">—</div>
          <!-- CONDICIÓN -->
          <div class="td-cell td-condicion">
            <span class="tag-condition pendiente">—</span>
          </div>
        `;
      } else {
        // ESCENARIO 2 (Completo con Condición): Todas las notas cargadas y tags de condición
        const isAprobado = student.condicion === 'Aprobado';
        const tagClass = isAprobado ? 'aprobado' : 'desaprobado';

        row.innerHTML = `
          <!-- Sticky 1: N° -->
          <div class="td-cell sticky-td-1">${student.num}</div>
          <!-- Sticky 2: CÓDIGO -->
          <div class="td-cell sticky-td-2">${student.code}</div>
          <!-- Sticky 3: APELLIDOS Y NOMBRES -->
          <div class="td-cell sticky-td-3" title="${student.name}">${student.name}</div>

          <!-- ED (Evaluación de entrada) -->
          <div class="td-cell td-ed">${student.ed}</div>

          <!-- (PF1) Primera Fase 40% -->
          <div class="td-cell td-fase1">${student.ud1}</div>
          <div class="td-cell td-fase1">${student.ud2}</div>
          <div class="td-cell td-fase1 td-avg">${student.pep1}</div>
          <div class="td-cell td-fase1">${student.e1}</div>
          <div class="td-cell td-fase1 td-avg">${student.pf1}</div>

          <!-- (PF2) Segunda Fase 60% -->
          <div class="td-cell td-fase2">${student.ud3}</div>
          <div class="td-cell td-fase2">${student.ud4}</div>
          <div class="td-cell td-fase2 td-avg">${student.pep2}</div>
          <div class="td-cell td-fase2">${student.e2}</div>
          <div class="td-cell td-fase2 td-avg">${student.pf2}</div>

          <!-- Cierre -->
          <div class="td-cell td-e3">${student.e3}</div>
          <div class="td-cell td-pf">${student.pf}</div>
          <div class="td-cell td-condicion">
            <span class="tag-condition ${tagClass}">${student.condicion}</span>
          </div>
        `;
      }

      tableBody.appendChild(row);
    });

    attachInputEvents();
  }

  /**
   * ATAR EVENTOS A LOS INPUTS DE NOTA (Validación 0-20 o NP y navegación teclado)
   */
  function attachInputEvents() {
    const inputs = tableBody.querySelectorAll('.note-input');
    inputs.forEach((input, idx) => {
      // Limpiar error al tipear
      input.addEventListener('input', (e) => {
        let val = e.target.value.trim().toUpperCase();
        e.target.value = val;
        e.target.classList.remove('input-error');

        // Permitir números o "NP"
        if (val !== 'NP' && val !== 'N' && !/^\d*$/.test(val)) {
          e.target.value = val.replace(/[^\dNP]/g, '');
        }

        // Si es número y mayor a 20, limitar a 20
        if (/^\d+$/.test(val)) {
          const num = parseInt(val, 10);
          if (num > 20) {
            e.target.value = '20';
          }
        }

        // Auto-avanzar al escribir 2 dígitos numéricos o "NP"
        if (e.target.value.length === 2) {
          if (inputs[idx + 1]) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
          }
        }
      });

      // Navegación con teclado (Flechas y Enter)
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter') {
          e.preventDefault();
          if (inputs[idx + 1]) {
            inputs[idx + 1].focus();
            inputs[idx + 1].select();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (inputs[idx - 1]) {
            inputs[idx - 1].focus();
            inputs[idx - 1].select();
          }
        }
      });

      // Formato al salir (on blur): si puso 1 dígito (ej: 8), formatear a "08"
      input.addEventListener('blur', (e) => {
        let val = e.target.value.trim().toUpperCase();
        if (/^\d{1}$/.test(val)) {
          e.target.value = '0' + val;
        }
      });
    });
  }


  /**
   * VALIDACIÓN ANTES DE GRABAR
   * En evaluaciones normales debe completar la nota de todos los alumnos (o 0 / NP).
   */
  function validateInputsBeforeSave() {
    if (currentScenario === 'complete') {
      return true; // Ya están todas completas
    }

    const inputs = tableBody.querySelectorAll('.note-input.input-ud1');
    let hasEmpty = false;
    let firstEmpty = null;

    inputs.forEach((input) => {
      const val = input.value.trim();
      if (!val) {
        hasEmpty = true;
        input.classList.add('input-error');
        if (!firstEmpty) firstEmpty = input;
      } else {
        input.classList.remove('input-error');
      }
    });

    if (hasEmpty) {
      showToast('Debe completar la nota de todos los alumnos antes de grabar (ingrese 0 o NP si no se presentó).', true);
      if (firstEmpty) {
        firstEmpty.focus();
      }
      return false;
    }

    return true;
  }


  /**
   * GESTIÓN DE MODALES
   */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-active');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-active');
  }

  function closeAllModals() {
    closeModal(modalSecurity);
    closeModal(modalLocked);
    closeModal(modalConfirm);
  }

  // Cerrar al presionar Escape o clic en backdrop
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  [modalSecurity, modalLocked, modalConfirm].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });


  /**
   * BOTÓN GRABAR -> INICIA EL FLUJO
   */
  if (btnSaveNotes) {
    btnSaveNotes.addEventListener('click', () => {
      if (isCardLocked) {
        openModal(modalLocked);
        return;
      }

      // 1. Validar completitud
      const isValid = validateInputsBeforeSave();
      if (!isValid) return;

      // 2. Abrir Modal 1: Validación de Coordenada de Seguridad
      coordinateInput.value = '';
      coordinateErrorMsg.classList.remove('is-visible');
      coordinateAttemptText.textContent = `Intento Nro. ${securityAttempts} de 3`;
      openModal(modalSecurity);
      setTimeout(() => coordinateInput.focus(), 150);
    });
  }


  /**
   * VALIDAR COORDENADA (Modal 1)
   */
  if (btnValidateCoordinate) {
    btnValidateCoordinate.addEventListener('click', handleCoordinateValidation);
  }

  if (coordinateInput) {
    coordinateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCoordinateValidation();
      }
    });
  }

  function setCoordinateError(msg) {
    if (!coordinateErrorMsg) return;
    const span = coordinateErrorMsg.querySelector('span');
    if (span) {
      span.textContent = msg;
    } else {
      coordinateErrorMsg.textContent = msg;
    }
    coordinateErrorMsg.classList.add('is-visible');
  }

  function handleCoordinateValidation() {
    const val = coordinateInput.value.trim();

    // Caso 1: Vacío
    if (!val) {
      setCoordinateError('Por favor, ingrese los números de la coordenada.');
      coordinateInput.focus();
      return;
    }

    // Caso 2: Coordenada Correcta ("84")
    if (val === VALID_COORDINATE_VALUE) {
      closeModal(modalSecurity);
      // Pasa al Modal de Confirmación
      setTimeout(() => {
        openModal(modalConfirm);
      }, 200);
      return;
    }

    // Caso 3: Coordenada Incorrecta
    securityAttempts++;

    if (securityAttempts > MAX_ATTEMPTS) {
      // 3 Intentos fallidos -> Bloquear tarjeta 24 horas
      closeModal(modalSecurity);
      isCardLocked = true;
      startLockCountdown(23 * 3600 + 59 * 60 + 56);
      setTimeout(() => {
        openModal(modalLocked);
      }, 200);
    } else {
      coordinateAttemptText.textContent = `Intento Nro. ${securityAttempts} de 3`;
      const intentosRestantes = (MAX_ATTEMPTS - securityAttempts + 1);
      setCoordinateError(`Coordenada no válida. Le queda(n) ${intentosRestantes} intento(s).`);
      coordinateInput.value = '';
      coordinateInput.focus();
    }
  }

  if (btnCloseSecurityModal) {
    btnCloseSecurityModal.addEventListener('click', () => {
      closeModal(modalSecurity);
    });
  }


  /**
   * CUENTA REGRESIVA DE TARJETA BLOQUEADA (24 Horas)
   */
  function startLockCountdown(totalSeconds) {
    if (countdownInterval) clearInterval(countdownInterval);

    let remaining = totalSeconds;

    function update() {
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        isCardLocked = false;
        securityAttempts = 1;
        countdownDisplay.textContent = '00hrs. 00 min. 00 seg.';
        return;
      }

      const hrs = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const secs = remaining % 60;

      const hrsStr = hrs < 10 ? `0${hrs}` : hrs;
      const minsStr = mins < 10 ? `0${mins}` : mins;
      const secsStr = secs < 10 ? `0${secs}` : secs;

      countdownDisplay.textContent = `${hrsStr}hrs. ${minsStr} min. ${secsStr} seg.`;
      remaining--;
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  if (btnCloseLockedModal) {
    btnCloseLockedModal.addEventListener('click', () => {
      closeModal(modalLocked);
    });
  }

  // Enlace para resetear bloqueo en pruebas
  if (btnResetLockDemo) {
    btnResetLockDemo.addEventListener('click', () => {
      isCardLocked = false;
      securityAttempts = 1;
      if (countdownInterval) clearInterval(countdownInterval);
      closeModal(modalLocked);
      showToast('Tarjeta de coordenadas desbloqueada para continuar las pruebas.');
    });
  }


  /**
   * CONFIRMACIÓN Y GRABADO FINAL (Modal 3)
   */
  if (btnCancelConfirm) {
    btnCancelConfirm.addEventListener('click', () => {
      closeModal(modalConfirm);
    });
  }

  if (btnAcceptSave) {
    btnAcceptSave.addEventListener('click', () => {
      closeModal(modalConfirm);

      // Simulación de procesamiento de promedios
      // Actualizar valores en la tabla para reflejar notas grabadas
      const inputs = tableBody.querySelectorAll('.note-input.input-ud1');
      inputs.forEach((input, index) => {
        const student = STUDENTS_DATA[index];
        if (student) {
          student.ud1 = input.value.trim();
        }
      });

      // Emite toast de éxito
      showToast('¡Notas grabadas correctamente! Los promedios fueron procesados por OSARC.');
    });
  }


  /**
   * TOAST FLOTANTE DE NOTIFICACIÓN
   */
  let toastTimer = null;
  function showToast(message, isWarning = false) {
    if (!toastNotification || !toastText) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastText.textContent = message;
    toastNotification.style.backgroundColor = isWarning ? '#D32F2F' : '#0F848F';
    toastNotification.classList.add('is-visible');

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('is-visible');
    }, 4500);
  }


  /**
   * TOGGLE COLAPSAR/EXPANDIR CRONOGRAMA
   */
  function toggleSchedule() {
    if (!scheduleCard) return;
    scheduleCard.classList.toggle('is-collapsed');
    const isCollapsed = scheduleCard.classList.contains('is-collapsed');
    const toggleText = scheduleToggleBtn.querySelector('.schedule-toggle-text');
    if (toggleText) {
      toggleText.textContent = isCollapsed ? 'Ver Cronograma' : 'Ocultar Cronograma';
    }
  }

  if (scheduleToggleBtn) {
    scheduleToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSchedule();
    });
  }

  if (scheduleCardHeader) {
    scheduleCardHeader.addEventListener('click', () => {
      toggleSchedule();
    });
  }


  /**
   * SELECTOR FLOTANTE DE CASUÍSTICAS (DEMO SWITCHER)
   */
  if (btnScenarioDefault && btnScenarioComplete) {
    btnScenarioDefault.addEventListener('click', () => {
      if (currentScenario === 'default') return;
      currentScenario = 'default';
      btnScenarioDefault.classList.add('is-selected');
      btnScenarioComplete.classList.remove('is-selected');
      renderTable();
      showToast('Cambiado a Escenario 1: Por Defecto (UD1 activo para registro).');
    });

    btnScenarioComplete.addEventListener('click', () => {
      if (currentScenario === 'complete') return;
      currentScenario = 'complete';
      btnScenarioComplete.classList.add('is-selected');
      btnScenarioDefault.classList.remove('is-selected');
      renderTable();
      showToast('Cambiado a Escenario 2: Completo (todas las notas y condición).');
    });
  }


  /**
   * DESCARGAR EXCEL SIMULADO
   */
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      showToast('Generando reporte en Excel de la sección AD2N4...');
    });
  }


  // --- INICIALIZACIÓN ---
  renderTable();

});
