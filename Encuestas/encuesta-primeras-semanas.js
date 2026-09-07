
document.addEventListener('DOMContentLoaded', () => {
  // Estado local reactivo de la encuesta
  const surveyState = {
    dni: '',
    fullName: '',
    npsScore: null,
    npsReason: '',
    aspects: {
      docentes: null,
      consultas: null,
      ambientes: null
    },
    improvements: ''
  };

  const TOTAL_REQUIRED_QUESTIONS = 5;

  // Elementos DOM
  const inputDni = document.getElementById('inputDni');
  const inputFullName = document.getElementById('inputFullName');
  const inputNpsReason = document.getElementById('inputNpsReason');
  const inputImprovements = document.getElementById('inputImprovements');
  const npsButtons = document.querySelectorAll('.nps-btn');
  const aspectItems = document.querySelectorAll('.survey-aspect-item');
  const btnSubmit = document.getElementById('btnSurveySubmit');
  const progressCount = document.getElementById('surveyProgressCount');
  const progressFill = document.getElementById('surveyProgressFill');
  const unansweredText = document.getElementById('surveyUnansweredText');
  const modalCloseBtn = document.getElementById('surveyModalClose');
  const successModal = document.getElementById('modalSurveySuccess');
  const btnCloseSuccess = document.getElementById('btnCloseSuccess');

  // ==========================================
  // 1. Interacción Escala NPS (0 al 10)
  // ==========================================
  npsButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      surveyState.npsScore = val;

      // Actualizar estilos activos de la escala NPS
      npsButtons.forEach((b) => {
        const bVal = parseInt(b.getAttribute('data-value'), 10);
        b.classList.remove('nps-highlighted', 'nps-selected');
        if (bVal < val) {
          b.classList.add('nps-highlighted');
        } else if (bVal === val) {
          b.classList.add('nps-selected');
        }
      });

      calculateProgress();
    });
  });

  // ==========================================
  // 2. Interacción Pregunta 5 (Aspectos con Caritas)
  // ==========================================
  aspectItems.forEach((aspectItem) => {
    const aspectName = aspectItem.getAttribute('data-aspect');
    const optionBtns = aspectItem.querySelectorAll('.emoji-option-btn');

    optionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const score = btn.getAttribute('data-score');
        surveyState.aspects[aspectName] = score;

        // Limpiar estados activos previos en el grupo de aspecto
        optionBtns.forEach((b) => {
          b.classList.remove('active-1', 'active-2', 'active-3', 'active-4', 'active-5', 'active-na');
        });

        // Activar color correspondiente según puntaje
        btn.classList.add(`active-${score}`);

        calculateProgress();
      });
    });
  });

  // ==========================================
  // 3. Listeners de Inputs de Texto
  // ==========================================
  if (inputDni) {
    inputDni.addEventListener('input', (e) => {
      surveyState.dni = e.target.value.trim();
      calculateProgress();
    });
  }

  if (inputFullName) {
    inputFullName.addEventListener('input', (e) => {
      surveyState.fullName = e.target.value.trim();
      calculateProgress();
    });
  }

  if (inputNpsReason) {
    inputNpsReason.addEventListener('input', (e) => {
      surveyState.npsReason = e.target.value.trim();
      calculateProgress();
    });
  }

  if (inputImprovements) {
    inputImprovements.addEventListener('input', (e) => {
      surveyState.improvements = e.target.value.trim();
    });
  }

  // ==========================================
  // 4. Cálculo de Progreso y Actualización de UI
  // ==========================================
  function calculateProgress() {
    let completedCount = 0;

    // 1. DNI (al menos 6 caracteres)
    if (surveyState.dni.length >= 6) completedCount++;

    // 2. Nombres completos (al menos 3 caracteres)
    if (surveyState.fullName.length >= 3) completedCount++;

    // 3. Calificación NPS seleccionada
    if (surveyState.npsScore !== null) completedCount++;

    // 4. Motivo / Razón de calificación
    if (surveyState.npsReason.length >= 2) completedCount++;

    // 5. Los 3 aspectos con caritas respondidos
    const { docentes, consultas, ambientes } = surveyState.aspects;
    if (docentes && consultas && ambientes) completedCount++;

    // Actualizar Barra de Carga / Progreso superior
    const percentage = Math.round((completedCount / TOTAL_REQUIRED_QUESTIONS) * 100);
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (progressCount) {
      progressCount.textContent = `${completedCount}/${TOTAL_REQUIRED_QUESTIONS}`;
    }

    // Actualizar Contador de Preguntas sin responder en el Footer
    const remaining = TOTAL_REQUIRED_QUESTIONS - completedCount;
    if (unansweredText) {
      if (remaining === 0) {
        unansweredText.textContent = '0 preguntas sin responder';
      } else if (remaining === 1) {
        unansweredText.textContent = '1 pregunta sin responder';
      } else {
        unansweredText.textContent = `${remaining} preguntas sin responder`;
      }
    }

    // Habilitar / Deshabilitar Botón de Envío
    if (btnSubmit) {
      if (completedCount === TOTAL_REQUIRED_QUESTIONS) {
        btnSubmit.removeAttribute('disabled');
      } else {
        btnSubmit.setAttribute('disabled', 'true');
      }
    }
  }

  // ==========================================
  // 5. Envío y Callback para Blazor
  // ==========================================
  if (btnSubmit) {
    btnSubmit.addEventListener('click', (e) => {
      e.preventDefault();

      if (btnSubmit.hasAttribute('disabled')) return;

      console.log('Datos enviados de Encuesta Primeras Semanas:', surveyState);

      // Si el entorno Blazor tiene un DotNetObjectReference registrado:
      if (window.DotNet && window.dotNetSurveyHelper) {
        window.dotNetSurveyHelper.invokeMethodAsync('OnSurveyCompleted', JSON.stringify(surveyState));
      }

      // Mostrar Modal de Éxito
      if (successModal) {
        successModal.showModal();
      }
    });
  }

  // ==========================================
  // 6. Botones de Cierre y Modal de Éxito
  // ==========================================
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      const modal = document.getElementById('modalPrimerasSemanas');
      if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        modal.style.transition = 'all 0.25s ease';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 250);
      }
    });
  }

  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', () => {
      if (successModal) {
        successModal.close();
      }
      const mainModal = document.getElementById('modalPrimerasSemanas');
      if (mainModal) {
        mainModal.style.display = 'none';
      }
    });
  }

  // Inicializar estado en 0
  calculateProgress();
});
