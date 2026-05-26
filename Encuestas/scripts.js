document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const floatingCard = document.getElementById('encuestaFloatingCard');
  const bodyState1 = document.getElementById('encuestaBodyState1');
  const bodyState2 = document.getElementById('encuestaBodyState2');
  const closeCardBtn = document.getElementById('encuestaCloseCard');
  const entendidoBtn = document.getElementById('encuestaBtnEntendido');
  const modal = document.getElementById('encuestaModal');
  const modalCloseBtn = document.getElementById('encuestaModalClose');
  const comenzarHomeBtns = document.querySelectorAll('#encuestaFloatingCard .encuesta-btn-start, #encuestaModal .encuesta-btn-start');
  
  // New Portal Elements
  const portal = document.getElementById('encuestaPortal');
  const portalBackBtn = document.getElementById('btnPortalBack');
  const indicatorBanner = document.querySelector('.encuesta-indicator-banner');
  const profileEncuestasBtn = document.getElementById('btnPerfilEncuesta');

  let currentCardState = 1; // 1 = Normal, 2 = Omitted Warning
  let activeSurveyCardId = null;
  const emojiAnswers = {}; // Local state storing: question index (1-8) -> score (1-5)
  let npsScore = null;

  // 1. Slide-in entry with delay on page load for floating card
  setTimeout(() => {
    if (floatingCard) {
      floatingCard.classList.add('visible');
    }
  }, 1000);

  // 2. Handle close/omit click on the floating card
  if (closeCardBtn) {
    closeCardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCardClose();
    });
  }

  // 3. Handle "Entendido" button click in State 2
  if (entendidoBtn) {
    entendidoBtn.addEventListener('click', () => {
      transitionCardToModal();
    });
  }

  // Handle Close event on State 2 (clicking X on State 2 acts as closing/omitting State 2)
  function handleCardClose() {
    if (currentCardState === 1) {
      // Transition from State 1 to State 2
      bodyState1.style.display = 'none';
      bodyState2.style.display = 'flex';
      currentCardState = 2;
    } else if (currentCardState === 2) {
      // Closing from State 2 leads immediately to showing the mandatory Modal (State 3)
      transitionCardToModal();
    }
  }

  // Transition from Floating Card to Mandatory Modal
  function transitionCardToModal() {
    // Hide floating card
    if (floatingCard) {
      floatingCard.classList.remove('visible');
      setTimeout(() => {
        floatingCard.style.display = 'none';
      }, 500);
    }

    // Open mandatory modal dialog with delay for smooth transition
    setTimeout(() => {
      if (modal) {
        modal.showModal();
      }
    }, 400);
  }

  // 4. Mandatory Modal Interaction Logic (State 3)
  if (modal) {
    // Prevent closing the modal via the Escape key (Esc)
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      triggerModalShake();
    });

    // Handle backdrop click to trigger shake effect
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        triggerModalShake();
      }
    });
  }

  // Handle X button click on mandatory modal (triggers shake)
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      triggerModalShake();
    });
  }

  // Trigger visual shake warning
  function triggerModalShake() {
    if (modal) {
      modal.classList.remove('shake');
      void modal.offsetWidth; // Force CSS reflow to restart animation
      modal.classList.add('shake');
      console.log('Esta encuesta es obligatoria y no puede ser omitida.');
    }
  }

  // 5. Open Survey Portal Overlay Triggers
  function openPortal() {
    if (portal) {
      portal.classList.add('active');
      document.body.classList.add('portal-active-scroll');
      
      // Auto close/dismiss home widgets once the survey view is open
      if (floatingCard) {
        floatingCard.classList.remove('visible');
        floatingCard.style.display = 'none';
      }
      if (modal && modal.open) {
        modal.close();
      }
    }
  }

  // Close Survey Portal Overlay
  function closePortal() {
    if (portal) {
      portal.classList.remove('active');
      document.body.classList.remove('portal-active-scroll');
    }
  }

  // Wire up home buttons to open portal
  comenzarHomeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openPortal();
    });
  });

  if (indicatorBanner) {
    indicatorBanner.style.cursor = 'pointer';
    indicatorBanner.addEventListener('click', () => {
      openPortal();
    });
  }

  if (profileEncuestasBtn) {
    profileEncuestasBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPortal();
    });
  }

  if (portalBackBtn) {
    portalBackBtn.addEventListener('click', () => {
      closePortal();
    });
  }

  // ==========================================
  // NPS Survey Dialog Interactivity (Popup 1)
  // ==========================================
  const npsButtons = document.querySelectorAll('#modalNpsSurvey .nps-btn');
  const npsConditionalArea = document.getElementById('npsConditionalArea');
  const npsConditionalText = document.getElementById('npsConditionalQuestionText');
  const btnNpsSubmit = document.getElementById('btnNpsSubmit');
  const npsProgressCount = document.getElementById('npsProgressCount');
  const npsProgressFill = document.getElementById('npsProgressFill');
  const npsUnansweredText = document.getElementById('npsUnansweredText');

  npsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'));
      npsScore = val;
      
      // Update NPS scale button highlight selection
      npsButtons.forEach(b => {
        const bVal = parseInt(b.getAttribute('data-value'));
        b.classList.remove('nps-highlighted', 'nps-selected');
        if (bVal < val) {
          b.classList.add('nps-highlighted');
        } else if (bVal === val) {
          b.classList.add('nps-selected');
        }
      });

      // Update progress indicators
      if (npsProgressFill) npsProgressFill.style.width = '100%';
      if (npsProgressCount) npsProgressCount.textContent = '1/1';
      if (npsUnansweredText) npsUnansweredText.textContent = '0 preguntas sin responder';

      // Toggle visible conditional textarea matching score category
      if (npsConditionalArea) {
        npsConditionalArea.style.display = 'block';
      }
      if (npsConditionalText) {
        if (val >= 0 && val <= 6) {
          npsConditionalText.textContent = '¿En qué te hemos fallado?';
        } else if (val >= 7 && val <= 8) {
          npsConditionalText.textContent = '¿En qué podemos mejorar?';
        } else if (val >= 9 && val <= 10) {
          npsConditionalText.textContent = '¿Qué es lo que más valoras de la UNW?';
        }
      }

      // Enable submission button
      if (btnNpsSubmit) {
        btnNpsSubmit.removeAttribute('disabled');
      }
    });
  });

  if (btnNpsSubmit) {
    btnNpsSubmit.addEventListener('click', () => {
      closeSurveyModal('modalNpsSurvey');
      const successModal = document.getElementById('modalSurveySuccess');
      if (successModal) {
        successModal.showModal();
      }
    });
  }

  // ==========================================
  // Emoji Satisfaction Interactivity (Popup 2)
  // ==========================================
  const emojiOptionBtns = document.querySelectorAll('#modalEmojiSurvey .emoji-option-btn');
  const btnEmojiSubmit = document.getElementById('btnEmojiSubmit');
  const emojiProgressCount = document.getElementById('emojiProgressCount');
  const emojiProgressFill = document.getElementById('emojiProgressFill');
  const emojiUnansweredText = document.getElementById('emojiUnansweredText');

  emojiOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionItem = btn.closest('.survey-question-item');
      if (!questionItem) return;
      const qIndex = questionItem.getAttribute('data-q-index');
      const score = btn.getAttribute('data-score');
      
      // Store value in temporary local state
      emojiAnswers[qIndex] = score;

      // Update highlight colors inside this question row
      const siblings = questionItem.querySelectorAll('.emoji-option-btn');
      siblings.forEach(sib => {
        sib.classList.remove('active-1', 'active-2', 'active-3', 'active-4', 'active-5');
      });
      btn.classList.add('active-' + score);

      // Recalculate responses
      const answeredCount = Object.keys(emojiAnswers).length;
      const unansweredCount = 8 - answeredCount;

      // Update progress bar
      if (emojiProgressFill) {
        emojiProgressFill.style.width = ((answeredCount / 8) * 100) + '%';
      }
      if (emojiProgressCount) {
        emojiProgressCount.textContent = answeredCount + '/8';
      }

      // Update unanswered helper text
      if (emojiUnansweredText) {
        if (unansweredCount === 1) {
          emojiUnansweredText.textContent = '1 pregunta sin responder';
        } else {
          emojiUnansweredText.textContent = unansweredCount + ' preguntas sin responder';
        }
      }

      // Toggle footer button: active, and change label to Enviar if fully completed
      if (btnEmojiSubmit) {
        btnEmojiSubmit.removeAttribute('disabled');
        if (answeredCount === 8) {
          btnEmojiSubmit.innerHTML = `Enviar encuesta <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin-left: 2px;"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
        } else {
          btnEmojiSubmit.innerHTML = 'Guardar';
        }
      }
    });
  });

  if (btnEmojiSubmit) {
    btnEmojiSubmit.addEventListener('click', () => {
      const answeredCount = Object.keys(emojiAnswers).length;
      
      if (answeredCount === 8) {
        closeSurveyModal('modalEmojiSurvey');
        const successModal = document.getElementById('modalSurveySuccess');
        if (successModal) {
          successModal.showModal();
        }
      } else {
        // Partial answers save progress locally and close dialog
        closeSurveyModal('modalEmojiSurvey');
      }
    });
  }

  // Expose global closing functions on window to support inline onclick hooks
  window.closeSurveyModal = function(modalId) {
    const dialog = document.getElementById(modalId);
    if (dialog) {
      dialog.close();
    }
  };

  window.closeSuccessModal = function() {
    const successDialog = document.getElementById('modalSurveySuccess');
    if (successDialog) {
      successDialog.close();
    }
    
    // Transition the grid card that triggered this survey
    if (activeSurveyCardId) {
      transitionCardToAnswered(activeSurveyCardId);
      activeSurveyCardId = null;
    }
  };

  // Helper function to animate card transitioning to green answered state
  function transitionCardToAnswered(cardId) {
    const card = document.querySelector(`.portal-card[data-card-id="${cardId}"]`);
    if (!card) return;

    const activeBody = card.querySelector('.encuesta-card-body');
    const answeredBody = card.querySelector('.answered-body-template');
    
    if (activeBody && answeredBody) {
      // Transition: Fade out first
      activeBody.style.transition = 'opacity 0.25s ease';
      activeBody.style.opacity = '0';
      
      setTimeout(() => {
        activeBody.style.display = 'none';
        
        // Switch body elements
        answeredBody.style.display = 'flex';
        answeredBody.style.opacity = '0';
        // Add card answered styles
        card.classList.add('answered');
        
        // Force reflow and fade in
        void answeredBody.offsetWidth;
        answeredBody.style.transition = 'opacity 0.25s ease';
        answeredBody.style.opacity = '1';
      }, 250);
    }
  }

  // ==========================================
  // Portal Grid Click Routing
  // ==========================================
  const portalGrid = document.querySelector('.encuesta-grid');
  if (portalGrid) {
    portalGrid.addEventListener('click', (e) => {
      const startBtn = e.target.closest('.encuesta-btn-start');
      if (!startBtn) return;

      e.preventDefault();
      const card = startBtn.closest('.portal-card');
      if (card) {
        const surveyType = card.getAttribute('data-survey-type');
        const cardId = card.getAttribute('data-card-id');
        
        if (surveyType === 'nps') {
          activeSurveyCardId = cardId;
          const npsModal = document.getElementById('modalNpsSurvey');
          if (npsModal) {
            npsModal.showModal();
          }
        } else if (surveyType === 'satisfaction') {
          activeSurveyCardId = cardId;
          const emojiModal = document.getElementById('modalEmojiSurvey');
          if (emojiModal) {
            emojiModal.showModal();
          }
        } else {
          // Fallback simulation for cards without detailed popup implementations
          const activeBody = card.querySelector('.encuesta-card-body');
          const answeredBody = card.querySelector('.answered-body-template');
          
          if (activeBody && answeredBody) {
            activeBody.style.transition = 'opacity 0.25s ease';
            activeBody.style.opacity = '0';
            
            setTimeout(() => {
              activeBody.style.display = 'none';
              answeredBody.style.display = 'flex';
              answeredBody.style.opacity = '0';
              card.classList.add('answered');
              void answeredBody.offsetWidth;
              answeredBody.style.transition = 'opacity 0.25s ease';
              answeredBody.style.opacity = '1';
            }, 250);
          }
        }
      }
    });
  }
});
