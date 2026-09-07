

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  let totalSteps = 5;
  let isWorkingStudent = true;

  const wizardSteps = document.querySelectorAll('.wizard-step');
  const btnPrev = document.getElementById('btnWizardPrev');
  const btnNext = document.getElementById('btnWizardNext');
  const btnSubmit = document.getElementById('btnWizardSubmit');
  const stepperLabel = document.getElementById('stepperLabel');
  const stepperPercentage = document.getElementById('stepperPercentage');
  const stepperBarFill = document.getElementById('stepperBarFill');
  const modalSuccessOverlay = document.getElementById('modalSuccessOverlay');
  const btnSuccessFinish = document.getElementById('btnSuccessFinish');

  setupUbigeoSelectors('depResidencia', 'provResidencia', 'distResidencia');
  setupUbigeoSelectors('depTrabajo', 'provTrabajo', 'distTrabajo');

  function setupUbigeoSelectors(depId, provId, distId) {
    const depSelect = document.getElementById(depId);
    const provSelect = document.getElementById(provId);
    const distSelect = document.getElementById(distId);

    if (!depSelect) return;

    const departamentos = [
      "Lima", "Callao", "Arequipa", "La Libertad", "Piura", "Cusco", "Junín",
      "Lambayeque", "Áncash", "Ica", "Cajamarca", "Puno", "Huánuco", "Loreto",
      "San Martín", "Ayacucho", "Ucayali", "Tacna", "Apurímac", "Huancavelica",
      "Moquegua", "Pasco", "Tumbes", "Amazonas", "Madre de Dios", "Fuera del Perú"
    ];

    departamentos.forEach(dep => {
      const opt = document.createElement('option');
      opt.value = dep;
      opt.textContent = dep;
      depSelect.appendChild(opt);
    });

    depSelect.addEventListener('change', () => {
      const val = depSelect.value;
      provSelect.innerHTML = '<option value="">-- Seleccionar Provincia --</option>';
      distSelect.innerHTML = '<option value="">-- Seleccionar Distrito --</option>';

      if (!val) return;

      if (val === 'Lima') {
        ['Lima', 'Barranca', 'Canta', 'Cañete', 'Huaral', 'Huarochirí', 'Huaura', 'Oyón', 'Yauyos'].forEach(p => {
          provSelect.appendChild(new Option(p, p));
        });
      } else if (val === 'Callao') {
        provSelect.appendChild(new Option('Prov. Const. del Callao', 'Callao'));
      } else if (val === 'Fuera del Perú') {
        provSelect.appendChild(new Option('Exterior', 'Exterior'));
        distSelect.appendChild(new Option('Exterior', 'Exterior'));
      } else {
        provSelect.appendChild(new Option(val + ' (Capital)', val + ' (Capital)'));
      }
    });

    provSelect.addEventListener('change', () => {
      const val = provSelect.value;
      distSelect.innerHTML = '<option value="">-- Seleccionar Distrito --</option>';

      if (!val) return;

      if (val === 'Lima') {
        [
          "Jesús María", "Miraflores", "San Isidro", "Santiago de Surco", "San Borja",
          "La Molina", "Lince", "Magdalena del Mar", "Pueblo Libre", "San Miguel",
          "Los Olivos", "San Martín de Porres", "Comas", "Independencia", "Ate",
          "San Juan de Lurigancho", "San Juan de Miraflores", "Surquillo", "Chorrillos",
          "Villa El Salvador", "Villa María del Triunfo", "Santa Anita", "Carabayllo", "Otro Distrito"
        ].sort().forEach(d => {
          distSelect.appendChild(new Option(d, d));
        });
      } else if (val === 'Callao') {
        ["Callao Bellavista", "La Perla", "La Punta", "Carmen de la Legua", "Ventanilla", "Mi Perú"].forEach(d => {
          distSelect.appendChild(new Option(d, d));
        });
      } else {
        distSelect.appendChild(new Option('Distrito Principal', 'Distrito Principal'));
      }
    });
  }

  document.addEventListener('change', (e) => {
    if (e.target.matches('.option-card input[type="radio"]')) {
      const name = e.target.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        const card = radio.closest('.option-card');
        if (card) card.classList.remove('selected');
      });
      const card = e.target.closest('.option-card');
      if (card) card.classList.add('selected');
    }

    if (e.target.matches('.option-card input[type="checkbox"]')) {
      const card = e.target.closest('.option-card');
      if (card) {
        if (e.target.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      }
    }
  });

  const radioActividad = document.querySelectorAll('input[name="q2_actividad"]');
  const condDependiente = document.getElementById('condDependiente');
  const condIndependiente = document.getElementById('condIndependiente');
  const condNegocio = document.getElementById('condNegocio');
  const bloqueDetalleLaboral = document.getElementById('bloqueDetalleLaboral');

  radioActividad.forEach(radio => {
    radio.addEventListener('change', () => {
      const val = radio.value;

      if (condDependiente) condDependiente.style.display = 'none';
      if (condIndependiente) condIndependiente.style.display = 'none';
      if (condNegocio) condNegocio.style.display = 'none';

      if (val === 'dependiente') {
        if (condDependiente) condDependiente.style.display = 'block';
        if (bloqueDetalleLaboral) bloqueDetalleLaboral.style.display = 'block';
        isWorkingStudent = true;
      } else if (val === 'independiente') {
        if (condIndependiente) condIndependiente.style.display = 'block';
        if (bloqueDetalleLaboral) bloqueDetalleLaboral.style.display = 'block';
        isWorkingStudent = true;
      } else if (val === 'negocio') {
        if (condNegocio) condNegocio.style.display = 'block';
        if (bloqueDetalleLaboral) bloqueDetalleLaboral.style.display = 'block';
        isWorkingStudent = true;
      } else if (val === 'sin_actividad') {
        if (bloqueDetalleLaboral) bloqueDetalleLaboral.style.display = 'none';
        isWorkingStudent = false;
      } else {
        // Practicas, internado, voluntariado, otro
        if (bloqueDetalleLaboral) bloqueDetalleLaboral.style.display = 'block';
        isWorkingStudent = true;
      }
    });
  });

  const radioModalidad = document.querySelectorAll('input[name="q6_modalidad"]');
  const condUbicacionTrabajo = document.getElementById('condUbicacionTrabajo');
  radioModalidad.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'presencial' || radio.value === 'hibrida') {
        if (condUbicacionTrabajo) condUbicacionTrabajo.style.display = 'block';
      } else {
        if (condUbicacionTrabajo) condUbicacionTrabajo.style.display = 'none';
      }
    });
  });

  const radioBusqueda = document.querySelectorAll('input[name="qc3_busqueda"]');
  const condDetalleBusqueda = document.getElementById('condDetalleBusqueda');
  radioBusqueda.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'buscando_activamente') {
        if (condDetalleBusqueda) condDetalleBusqueda.style.display = 'block';
      } else {
        if (condDetalleBusqueda) condDetalleBusqueda.style.display = 'none';
      }
    });
  });

  const radioBolsaUso = document.querySelectorAll('input[name="qe5_bolsa"]');
  const condBolsaFacilidad = document.getElementById('condBolsaFacilidad');
  const condBolsaDificultad = document.getElementById('condBolsaDificultad');

  radioBolsaUso.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'usado') {
        if (condBolsaFacilidad) condBolsaFacilidad.style.display = 'block';
      } else {
        if (condBolsaFacilidad) condBolsaFacilidad.style.display = 'none';
        if (condBolsaDificultad) condBolsaDificultad.style.display = 'none';
      }
    });
  });

  const radioBolsaDificultad = document.querySelectorAll('input[name="qe5_1_facilidad"]');
  radioBolsaDificultad.forEach(radio => {
    radio.addEventListener('change', () => {
      const val = parseInt(radio.value);
      if (val === 1 || val === 2) {
        if (condBolsaDificultad) condBolsaDificultad.style.display = 'block';
      } else {
        if (condBolsaDificultad) condBolsaDificultad.style.display = 'none';
      }
    });
  });

  const competenciasCheckboxes = document.querySelectorAll('input[name="qd2_competencias"]');
  const competenciasBadge = document.getElementById('competenciasCounterBadge');

  competenciasCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedCount = document.querySelectorAll('input[name="qd2_competencias"]:checked').length;

      if (checkedCount > 3) {
        cb.checked = false;
        const card = cb.closest('.option-card');
        if (card) card.classList.remove('selected');
        alert('Solo puedes seleccionar un máximo de 3 competencias a fortalecer.');
        return;
      }

      if (competenciasBadge) {
        competenciasBadge.textContent = `Seleccionadas: ${document.querySelectorAll('input[name="qd2_competencias"]:checked').length}/3`;
      }
    });
  });

  function updateStepView() {
    wizardSteps.forEach((step, index) => {
      const stepNum = index + 1;

      if (stepNum === 3) {
        if (!isWorkingStudent) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
        return;
      }

      if (stepNum === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    const progressPercent = Math.round((currentStep / totalSteps) * 100);
    if (stepperLabel) stepperLabel.textContent = `Paso ${currentStep} de ${totalSteps}`;
    if (stepperPercentage) stepperPercentage.textContent = `${progressPercent}% completado`;
    if (stepperBarFill) stepperBarFill.style.width = `${progressPercent}%`;

    if (btnPrev) btnPrev.disabled = (currentStep === 1);

    if (currentStep === totalSteps) {
      if (btnNext) btnNext.style.display = 'none';
      if (btnSubmit) btnSubmit.style.display = 'inline-flex';
    } else {
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnSubmit) btnSubmit.style.display = 'none';
    }

    if (currentStep === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const stepperEl = document.querySelector('.caracterizacion-stepper');
      if (stepperEl) {
        const headerOffset = 80;
        const elementPosition = stepperEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!validateStep(currentStep)) {
        alert('Por favor, completa todas las preguntas requeridas antes de continuar.');
        return;
      }

      if (currentStep === 2) {
        if (!isWorkingStudent) {
          currentStep = 3;
        } else {
          currentStep = 4;
        }
      } else if (currentStep === 3) {
        currentStep = 4;
      } else if (currentStep < totalSteps) {
        currentStep++;
      }

      updateStepView();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep === 4 && !isWorkingStudent) {
        currentStep = 3;
      } else if (currentStep === 4 && isWorkingStudent) {
        currentStep = 2;
      } else if (currentStep > 1) {
        currentStep--;
      }

      updateStepView();
    });
  }

  function validateStep(step) {
    const activeStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (!activeStepEl) return true;

    const requiredRadioGroups = new Set();
    activeStepEl.querySelectorAll('input[type="radio"][required]').forEach(r => requiredRadioGroups.add(r.name));

    for (let name of requiredRadioGroups) {
      if (!activeStepEl.querySelector(`input[name="${name}"]:checked`)) {
        return false;
      }
    }

    return true;
  }

  const form = document.getElementById('caracterizacionForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (modalSuccessOverlay) {
        modalSuccessOverlay.classList.add('active');
      }
    });
  }

  if (btnSuccessFinish) {
    btnSuccessFinish.addEventListener('click', () => {
      if (modalSuccessOverlay) {
        modalSuccessOverlay.classList.remove('active');
      }
      if (window.opener) {
        window.close();
      }
    });
  }

  updateStepView();
});
