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

  // 6. Interactive Card state simulation in the Portal Grid
  const portalGrid = document.querySelector('.encuesta-grid');
  if (portalGrid) {
    portalGrid.addEventListener('click', (e) => {
      const startBtn = e.target.closest('.encuesta-btn-start');
      if (!startBtn) return;

      e.preventDefault();
      const card = startBtn.closest('.portal-card');
      if (card) {
        // Find the active body and answered warning body in the card
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
    });
  }
});
