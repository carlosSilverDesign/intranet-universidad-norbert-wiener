
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initModals();
  updateContextCounters();
});

// Variables globales para el estado temporal de los modales
let currentActionState = {
  type: null, // 'approve' | 'delete'
  studentId: null,
  studentName: '',
  studentCode: '',
  photoUrl: '',
  photoDate: '',
  targetCardId: null
};

/* ==========================================================================
   1. GESTIÓN DE MODALES
   ========================================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Cierre al hacer click en el backdrop oscuro
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Cierre con la tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach((openModal) => {
        closeModal(openModal.id);
      });
    }
  });

  // Botón confirmar APROBACIÓN
  const btnConfirmApprove = document.getElementById('btnConfirmApproveAction');
  if (btnConfirmApprove) {
    btnConfirmApprove.addEventListener('click', executeApproval);
  }

  // Botón confirmar ELIMINACIÓN
  const btnConfirmDelete = document.getElementById('btnConfirmDeleteAction');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', executeDeletion);
  }
}

/* ==========================================================================
   2. FLUJO DE APROBACIÓN
   ========================================================================== */

window.triggerApproveModal = function (studentId, studentName, studentCode, photoUrl, photoDate, photoCardId) {
  currentActionState = {
    type: 'approve',
    studentId,
    studentName,
    studentCode,
    photoUrl,
    photoDate,
    targetCardId: photoCardId
  };

  // Asignar textos UX en el modal
  document.getElementById('approveStudentName').textContent = studentName;
  document.getElementById('approveStudentCode').textContent = studentCode;
  document.getElementById('approveImgElement').src = photoUrl;

  // Extraer miniatura previa de SIGU para comparar
  const siguCard = document.getElementById(`sigu-card-${studentId}`);
  const prevThumbBox = document.getElementById('approveThumbPrev');
  prevThumbBox.innerHTML = '';

  if (siguCard && !siguCard.classList.contains('empty-state')) {
    const existingImg = siguCard.querySelector('.photo-frame img');
    if (existingImg) {
      const cloneImg = document.createElement('img');
      cloneImg.src = existingImg.src;
      cloneImg.alt = 'Foto previa';
      prevThumbBox.appendChild(cloneImg);
    }
  } else {
    // Si no tenía foto previa, mostrar placeholder
    prevThumbBox.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background-color:#F8FAFC;color:#9AA6B2;font-size:10px;text-align:center;padding:4px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span>Sin foto</span>
      </div>
    `;
  }

  openModal('modalApproveBackdrop');
};

function executeApproval() {
  const { studentId, studentName, photoUrl, targetCardId } = currentActionState;

  // 1. Actualizar la columna SIGU con la foto aprobada
  const siguCard = document.getElementById(`sigu-card-${studentId}`);
  if (siguCard) {
    siguCard.classList.remove('empty-state');
    siguCard.innerHTML = `
      <span class="photo-badge-official">Foto Oficial Activa</span>
      <div class="photo-frame">
        <img src="${photoUrl}" alt="Foto Oficial SIGU - ${studentName}"
          onclick="openZoomModal('${photoUrl}', '${studentName} (Foto Oficial SIGU)', 'Actualizada hoy')">
      </div>
      <button type="button" class="btn-remove-sigu" title="Retirar foto oficial activa"
        onclick="triggerDeleteModal(${studentId}, '${studentName}', '', 'Foto Oficial', 'sigu-card-${studentId}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
  }

  // 2. Actualizar la tarjeta WEB aprobada
  const webCard = document.getElementById(targetCardId);
  if (webCard) {
    webCard.classList.remove('is-new');
    webCard.classList.add('is-history');
    const tag = webCard.querySelector('.photo-status-tag');
    if (tag) {
      tag.className = 'photo-status-tag approved-tag';
      tag.textContent = 'Aprobada';
    }

    const actionsRow = webCard.querySelector('.photo-actions-row');
    if (actionsRow) {
      actionsRow.innerHTML = `
        <span style="font-size: 11px; color: #278B52; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          Registrada en SIGU
        </span>
      `;
    }
  }

  // 3. Marcar la fila como aprobada si ya no le quedan fotos pendientes
  const row = document.getElementById(`row-student-${studentId}`);
  if (row) {
    const hasRemainingPending = row.querySelectorAll('.photo-card-web.is-new').length > 0;
    if (!hasRemainingPending) {
      row.dataset.status = 'aprobados';
    }
  }

  closeModal('modalApproveBackdrop');

  // 4. Feedback Toast
  showToast(`¡Foto oficial actualizada! La fotografía de ${studentName} ha sido registrada con éxito en el sistema SIGU.`, 'success');

  updateContextCounters();
}

/* ==========================================================================
   3. FLUJO DE ELIMINACIÓN
   ========================================================================== */

window.triggerDeleteModal = function (studentId, studentName, studentCode, photoDate, targetElementId) {
  currentActionState = {
    type: 'delete',
    studentId,
    studentName,
    studentCode,
    photoDate,
    targetCardId: targetElementId
  };

  document.getElementById('deleteStudentName').textContent = studentName;
  document.getElementById('deleteStudentCode').textContent = studentCode || '';
  document.getElementById('deletePhotoDate').textContent = photoDate;

  openModal('modalDeleteBackdrop');
};

function executeDeletion() {
  const { studentId, studentName, targetCardId } = currentActionState;
  const target = document.getElementById(targetCardId);

  if (target) {
    // Si era la foto oficial de SIGU
    if (targetCardId.startsWith('sigu-card')) {
      target.classList.add('empty-state');
      target.innerHTML = `
        <div class="empty-photo-placeholder" title="Sin fotografía oficial">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9AA6B2" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span class="empty-photo-text">Sin foto oficial</span>
        </div>
      `;
      showToast(`Se retiró la fotografía oficial de SIGU para ${studentName}.`, 'danger');
    } else {
      // Si era una tarjeta de foto WEB
      target.style.transition = 'all 0.3s ease';
      target.style.opacity = '0';
      target.style.transform = 'scale(0.8)';
      setTimeout(() => {
        target.remove();
        // Verificar si la fila queda sin fotos web
        const row = document.getElementById(`row-student-${studentId}`);
        if (row) {
          const remainingPhotos = row.querySelectorAll('.photo-card-web');
          if (remainingPhotos.length === 0) {
            const webContainer = row.querySelector('.web-photos-container');
            if (webContainer) {
              webContainer.innerHTML = `<span style="font-size: 12px; color: #5B6E80; font-style: italic;">Sin fotos pendientes en el historial</span>`;
            }
          }
        }
        updateContextCounters();
      }, 300);

      showToast(`Fotografía eliminada correctamente del registro de ${studentName}.`, 'danger');
    }
  }

  closeModal('modalDeleteBackdrop');
  updateContextCounters();
}

/* ==========================================================================
   4. MODAL DE ZOOM / LIGHTBOX
   ========================================================================== */

window.openZoomModal = function (photoUrl, title, subtitle) {
  document.getElementById('zoomModalImg').src = photoUrl;
  document.getElementById('modalZoomTitle').textContent = title;
  document.getElementById('zoomSubtitle').textContent = subtitle || 'Inspección de calidad fotográfica';
  openModal('modalZoomBackdrop');
};

/* ==========================================================================
   5. FILTRADO Y ACTUALIZACIÓN DE LISTADO
   ========================================================================== */

function initFilters() {
  const btnActualizar = document.getElementById('btnActualizarListado');
  const filtroInstitucion = document.getElementById('filtroInstitucion');
  const filtroTipo = document.getElementById('filtroTipo');

  if (btnActualizar) {
    btnActualizar.addEventListener('click', applyFilters);
  }

  // Filtrado reactivo al cambiar selectores
  if (filtroInstitucion) {
    filtroInstitucion.addEventListener('change', applyFilters);
  }

  if (filtroTipo) {
    filtroTipo.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  const btnActualizar = document.getElementById('btnActualizarListado');
  if (btnActualizar) {
    btnActualizar.classList.add('loading');
    setTimeout(() => {
      btnActualizar.classList.remove('loading');
    }, 450);
  }

  const selectedInst = document.getElementById('filtroInstitucion').value;
  const selectedTipo = document.getElementById('filtroTipo').value;

  const rows = document.querySelectorAll('.table-list .table-row');
  let visibleCount = 0;

  rows.forEach((row) => {
    const rowInst = row.dataset.institution;
    const rowStatus = row.dataset.status;

    let matchesInst = (selectedInst === 'todas' || rowInst === selectedInst);
    let matchesTipo = (selectedTipo === 'todos' || rowStatus === selectedTipo);

    if (matchesInst && matchesTipo) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  // Mostrar estado vacío si no hay filas
  const emptyState = document.getElementById('tableEmptyState');
  if (emptyState) {
    if (visibleCount === 0) {
      emptyState.classList.add('visible');
    } else {
      emptyState.classList.remove('visible');
    }
  }

  updateContextCounters(visibleCount);
}

function updateContextCounters(overrideCount = null) {
  const allRows = document.querySelectorAll('.table-list .table-row');
  let countShown = 0;
  let countPending = 0;
  let countApproved = 0;

  allRows.forEach((row) => {
    if (row.style.display !== 'none') {
      countShown++;
      if (row.dataset.status === 'pendientes') {
        countPending++;
      } else if (row.dataset.status === 'aprobados') {
        countApproved++;
      }
    }
  });

  if (overrideCount !== null) {
    countShown = overrideCount;
  }

  // Actualizar indicadores numéricos
  const countShownEl = document.getElementById('countShown');
  const countPendingEl = document.getElementById('countPending');
  const statsBadgeText = document.getElementById('statsBadgeText');
  const pillPending = document.getElementById('pillPending');
  const pillApproved = document.getElementById('pillApproved');

  if (countShownEl) countShownEl.textContent = countShown;
  if (countPendingEl) countPendingEl.textContent = countPending;
  if (statsBadgeText) statsBadgeText.textContent = `${countPending} solicitudes por revisar`;
  if (pillPending) pillPending.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    ${countPending} Por aprobar
  `;
  if (pillApproved) pillApproved.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
    ${countApproved} Aprobado${countApproved === 1 ? '' : 's'}
  `;
}

/* ==========================================================================
   6. SISTEMA DE TOASTS NOTIFICACIONES
   ========================================================================== */

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  const iconSvg = type === 'success'
    ? '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#278B52"><path d="m423.23-394.15-92.92-92.93q-8.31-8.3-20.89-8.5-12.57-.19-21.27 8.5-8.69 8.7-8.69 21.08 0 12.38 8.69 21.08l109.77 109.77q10.85 10.84 25.31 10.84 14.46 0 25.31-10.84l222.54-222.54q8.3-8.31 8.5-20.89.19-12.57-8.5-21.27-8.7-8.69-21.08-8.69-12.38 0-21.08 8.69l-205.69 205.7ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Zm-.07-60q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D32F2F"><path d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-10q-12.77 0-21.38-8.62Q180-737.23 180-750t8.62-21.38Q197.23-780 210-780h150q0-14.69 10.35-25.04 10.34-10.34 25.03-10.34h169.24q14.69 0 25.03 10.34Q600-794.69 600-780h150q12.77 0 21.38 8.62Q780-762.77 780-750t-8.62 21.38Q762.77-720 750-720h-10v507.69q0 29.92-21.19 51.12Q697.61-140 667.69-140H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q5.39 0 8.85-3.46t3.46-8.85V-720Zm-400 0v520-520Zm200 302.15 82.92 82.93q8.31 8.3 20.89 8.5 12.57.19 21.27-8.5 8.69-8.7 8.69-21.08 0-12.38-8.69-21.08L522.15-460l82.93-82.92q8.3-8.31 8.5-20.89.19-12.57-8.5-21.27-8.7-8.69-21.08-8.69-12.38 0-21.08 8.69L480-502.15l-82.92-82.93q-8.31-8.3-20.89-8.5-12.57-.19-21.27 8.5-8.69 8.7-8.69 21.08 0 12.38 8.69 21.08L437.85-460l-82.93 82.92q-8.3 8.31-8.5 20.89-.19 12.57 8.5 21.27 8.7 8.69 21.08 8.69 12.38 0 21.08-8.69L480-417.85Z"/></svg>';

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Animación de entrada
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto descartar a los 4.5 segundos
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
}
