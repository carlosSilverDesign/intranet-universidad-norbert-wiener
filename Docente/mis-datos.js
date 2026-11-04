/**
 * Portal Docente - Mi Perfil (Mis Datos)
 * Lógica para edición inline de datos, buscador/filtrado de capacitaciones y modales.
 * Universidad Norbert Wiener - 2026
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. GESTIÓN DE CAMPOS EDITABLES EN LÍNEA (INLINE EDIT)
  // =========================================================================
  const inlineFields = document.querySelectorAll('.inline-field');
  const profileToast = document.getElementById('profileToast');
  const toastText = document.getElementById('profileToastText');
  let toastTimeout = null;

  function showToast(message = 'Dato actualizado correctamente') {
    if (!profileToast) return;
    if (toastText) toastText.textContent = message;
    
    profileToast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
      profileToast.classList.remove('show');
    }, 3200);
  }

  inlineFields.forEach(field => {
    const toggleBtn = field.querySelector('.btn-toggle-edit');
    const saveBtn = field.querySelector('.btn-save');
    const cancelBtn = field.querySelector('.btn-cancel-inline');
    const valueDisplay = field.querySelector('.field-value');
    const inputCtrl = field.querySelector('.field-input');

    // Guardar valor inicial para poder restaurar en caso de cancelar
    let initialValue = inputCtrl ? inputCtrl.value : '';

    function enterEditState() {
      field.setAttribute('data-state', 'edit');
      if (toggleBtn) {
        toggleBtn.textContent = 'Cancelar';
        toggleBtn.classList.add('is-cancel');
      }
      if (inputCtrl) {
        initialValue = inputCtrl.value;
        inputCtrl.focus();
      }
    }

    function exitEditState(saved = false) {
      field.setAttribute('data-state', 'view');
      if (toggleBtn) {
        toggleBtn.textContent = 'Editar';
        toggleBtn.classList.remove('is-cancel');
      }
      if (!saved && inputCtrl) {
        inputCtrl.value = initialValue;
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isEditing = field.getAttribute('data-state') === 'edit';
        if (isEditing) {
          exitEditState(false);
        } else {
          enterEditState();
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        exitEditState(false);
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!inputCtrl) return;

        let displayVal = '';
        if (inputCtrl.tagName === 'SELECT') {
          displayVal = inputCtrl.options[inputCtrl.selectedIndex] ? inputCtrl.options[inputCtrl.selectedIndex].text : '';
        } else {
          displayVal = inputCtrl.value.trim();
        }

        const placeholder = inputCtrl.getAttribute('placeholder') || 'Sin especificar';

        if (displayVal && displayVal !== 'Seleccionar') {
          if (valueDisplay) {
            valueDisplay.textContent = displayVal;
            valueDisplay.classList.remove('text-muted');
          }
        } else {
          if (valueDisplay) {
            valueDisplay.textContent = placeholder;
            valueDisplay.classList.add('text-muted');
          }
        }

        exitEditState(true);

        const fieldLabel = field.querySelector('.form-label');
        const fieldName = fieldLabel ? fieldLabel.textContent.trim() : 'Campo';
        showToast(`${fieldName} guardado correctamente`);
      });
    }

    // Guardar al presionar Enter en inputs de texto
    if (inputCtrl && inputCtrl.tagName === 'INPUT') {
      inputCtrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (saveBtn) saveBtn.click();
        }
      });
    }
  });

  // =========================================================================
  // 2. BUSCADOR Y FILTRADO DE CAPACITACIONES
  // =========================================================================
  const searchInput = document.getElementById('searchCapacitaciones');
  const yearSelect = document.getElementById('filterCapacitacionesYear');
  const tableRows = document.querySelectorAll('#capacitacionesTableBody tr');
  const mobileCards = document.querySelectorAll('#capacitacionesMobileCards .cap-mobile-card');
  const totalHoursCell = document.getElementById('totalHorasCapacitacion');
  const statTotalCursos = document.getElementById('statTotalCursos');
  const statTotalHoras = document.getElementById('statTotalHoras');

  function filterCapacitaciones() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedYear = yearSelect ? yearSelect.value : 'all';

    let visibleCount = 0;
    let visibleHours = 0;

    // Filtrar filas de tabla de escritorio
    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowYear = row.getAttribute('data-year');
      const rowHours = parseFloat(row.getAttribute('data-hours') || '0');

      const matchesQuery = query === '' || text.includes(query);
      const matchesYear = selectedYear === 'all' || rowYear === selectedYear;

      if (matchesQuery && matchesYear) {
        row.style.display = '';
        visibleCount++;
        visibleHours += rowHours;
      } else {
        row.style.display = 'none';
      }
    });

    // Filtrar tarjetas móviles
    mobileCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const cardYear = card.getAttribute('data-year');

      const matchesQuery = query === '' || text.includes(query);
      const matchesYear = selectedYear === 'all' || cardYear === selectedYear;

      if (matchesQuery && matchesYear) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    // Actualizar total de horas visible formateado
    if (totalHoursCell) {
      // Formatear decimales en español: si tiene decimal usa coma, si no es entero
      const formatted = visibleHours % 1 === 0 ? visibleHours.toString() : visibleHours.toFixed(1).replace('.', ',');
      totalHoursCell.textContent = `${formatted} hrs`;
    }

    if (statTotalHoras && (query !== '' || selectedYear !== 'all')) {
      const formatted = visibleHours % 1 === 0 ? visibleHours.toString() : visibleHours.toFixed(1).replace('.', ',');
      statTotalHoras.textContent = `${formatted} hrs`;
    } else if (statTotalHoras) {
      statTotalHoras.textContent = '48 hrs';
    }

    if (statTotalCursos && (query !== '' || selectedYear !== 'all')) {
      statTotalCursos.textContent = `${visibleCount} cursos`;
    } else if (statTotalCursos) {
      statTotalCursos.textContent = '20 cursos';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCapacitaciones);
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', filterCapacitaciones);
  }

  // =========================================================================
  // 3. MODALES (FOTOCHECK DIGITAL & ACTUALIZAR FOTO)
  // =========================================================================
  const btnVerFotocheck = document.getElementById('btnVerFotocheck');
  const modalFotocheck = document.getElementById('modalFotocheck');
  const closeFotocheckBtn = document.getElementById('closeFotocheckBtn');
  const closeFotocheckFooter = document.getElementById('closeFotocheckFooter');

  const btnActualizarFoto = document.getElementById('btnActualizarFoto');
  const modalActualizarFoto = document.getElementById('modalActualizarFoto');
  const closeFotoBtn = document.getElementById('closeFotoBtn');
  const closeFotoFooter = document.getElementById('closeFotoFooter');
  const photoFileInput = document.getElementById('photoFileInput');
  const photoPreview = document.getElementById('photoPreview');
  const btnGuardarFoto = document.getElementById('btnGuardarFoto');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Modal Fotocheck
  if (btnVerFotocheck) {
    btnVerFotocheck.addEventListener('click', () => openModal(modalFotocheck));
  }
  if (closeFotocheckBtn) {
    closeFotocheckBtn.addEventListener('click', () => closeModal(modalFotocheck));
  }
  if (closeFotocheckFooter) {
    closeFotocheckFooter.addEventListener('click', () => closeModal(modalFotocheck));
  }

  // Modal Actualizar Foto
  if (btnActualizarFoto) {
    btnActualizarFoto.addEventListener('click', () => openModal(modalActualizarFoto));
  }
  if (closeFotoBtn) {
    closeFotoBtn.addEventListener('click', () => closeModal(modalActualizarFoto));
  }
  if (closeFotoFooter) {
    closeFotoFooter.addEventListener('click', () => closeModal(modalActualizarFoto));
  }

  // Vista previa de nueva foto
  if (photoFileInput && photoPreview) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          photoPreview.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnGuardarFoto) {
    btnGuardarFoto.addEventListener('click', () => {
      if (photoFileInput && photoFileInput.files.length > 0) {
        const mainAvatar = document.querySelector('.teacher-avatar');
        if (mainAvatar && photoPreview) {
          mainAvatar.src = photoPreview.src;
        }
        closeModal(modalActualizarFoto);
        showToast('Foto de perfil actualizada correctamente');
      } else {
        alert('Por favor selecciona una imagen para subir.');
      }
    });
  }

  // Cerrar al hacer clic en el backdrop
  [modalFotocheck, modalActualizarFoto].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(modalFotocheck);
      closeModal(modalActualizarFoto);
    }
  });

});
