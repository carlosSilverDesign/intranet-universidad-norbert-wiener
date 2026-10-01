/**
 * GESTIÓN DE RECTIFICACIÓN DE NOTAS (EAP) - LOGICA JS
 * Perfil: Directivo / Super Admin EAP (Director de Escuela)
 * Universidad Norbert Wiener
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Datos iniciales precargados (se sincronizan bidireccionalmente con Docente)
  const INITIAL_SOLICITUDES = [
    {
      id: 1,
      ticket: 'SOL-2026-089',
      fecha: '14/09/2026',
      periodo: '2026-I',
      carrera: 'ODONTOLOGÍA',
      docente: 'OBREGON FIGUEROA ANA DORILA',
      curso: 'FARMACOLOGÍA CLÍNICA',
      seccion: 'EN4M1',
      tipoSolicitud: 'RECTIFICACION',
      alumnosAfectados: [
        {
          id: 1,
          codigo: 'A20240102',
          nombre: 'QUISPE MENDOZA CARLOS DANIEL',
          evaluacion: 'Eval. Permanente 1 (UD1)',
          notaActual: '11',
          nuevaNota: '16',
          motivo: 'Error de digitación en la transcripción de la rúbrica de prácticas de laboratorio.',
          sustentoFile: 'Rubrica_Laboratorio_Quispe.pdf'
        }
      ],
      estado: 'SOLICITADO',
      eapDecision: null
    },
    {
      id: 2,
      ticket: 'SOL-2026-074',
      fecha: '12/09/2026',
      periodo: '2026-I',
      carrera: 'ODONTOLOGÍA',
      docente: 'RAMIREZ LOPEZ HERNAN',
      curso: 'ANATOMÍA APLICADA',
      seccion: 'OD2M1',
      tipoSolicitud: 'EXTEMPORANEA',
      alumnosAfectados: [
        {
          id: 2,
          codigo: 'A20240899',
          nombre: 'ALVAREZ HUAMAN DIANA LUCIA',
          evaluacion: 'Examen Parcial (E1)',
          notaActual: 'Sin Nota',
          nuevaNota: '15',
          motivo: 'Falta justificada aprobada por Dirección por motivo de salud acreditado.',
          sustentoFile: 'Certificado_Medico_Alvarez.pdf'
        }
      ],
      estado: 'PROCESADO',
      eapDecision: {
        fecha: '13/09/2026 10:15 am',
        sustento: 'Se valida la justificación médica emitida por Bienestar Universitario y se autoriza el registro extemporáneo en SIGU.',
        director: 'VERGARA PINTO BRENDA'
      }
    },
    {
      id: 3,
      ticket: 'SOL-2026-061',
      fecha: '10/09/2026',
      periodo: '2026-I',
      carrera: 'ODONTOLOGÍA',
      docente: 'SALAZAR ROJAS MARGARITA',
      curso: 'BIOÉTICA Y SALUD',
      seccion: 'OD1M1',
      tipoSolicitud: 'RECTIFICACION',
      alumnosAfectados: [
        {
          id: 3,
          codigo: 'A20240344',
          nombre: 'TORRES VEGA ANDRES FELIPE',
          evaluacion: 'Eval. Permanente 2 (UD2)',
          notaActual: '08',
          nuevaNota: '14',
          motivo: 'Revisión extemporánea de trabajo monográfico.',
          sustentoFile: 'Monografia_Torres.pdf'
        }
      ],
      estado: 'RECHAZADO',
      rejectionTimestamp: Date.now() - (5 * 60 * 1000), // Hace 5 min para probar deshacer
      eapDecision: {
        fecha: '10/09/2026 04:30 pm',
        sustento: 'El plazo reglamentario para solicitar revisión de la UD2 venció hace más de 15 días hábiles conforme al reglamento académico.',
        director: 'VERGARA PINTO BRENDA'
      }
    }
  ];

  const STORAGE_KEY = 'wiener_solicitudes_data';

  function getSolicitudes() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SOLICITUDES));
      return INITIAL_SOLICITUDES;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_SOLICITUDES;
    }
  }

  function saveSolicitudes(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // 2. Elementos DOM
  const tableBody = document.getElementById('eapRequestsTableBody');
  const countShownEl = document.getElementById('countShown');
  const countPendientesEl = document.getElementById('countPendientes');
  const countProcesadasEl = document.getElementById('countProcesadas');
  const countRechazadasEl = document.getElementById('countRechazadas');
  const pagCountEl = document.getElementById('pagCount');
  const pagTotalEl = document.getElementById('pagTotal');
  const headerStatsText = document.getElementById('headerStatsText');

  const filterPeriodo = document.getElementById('filterPeriodo');
  const filterCarrera = document.getElementById('filterCarrera');
  const filterTipoSolicitud = document.getElementById('filterTipoSolicitud');
  const filterEstado = document.getElementById('filterEstado');
  const btnClearFilters = document.getElementById('btnClearFilters');

  // Modal Evaluar
  const modalEvaluarBackdrop = document.getElementById('modalEvaluarBackdrop');
  const btnCloseModalEvaluar = document.getElementById('btnCloseModalEvaluar');
  const btnCancelModalEvaluar = document.getElementById('btnCancelModalEvaluar');
  const modalEvaluarTitle = document.getElementById('modalEvaluarTitle');
  const modalEvaluarTicketTag = document.getElementById('modalEvaluarTicketTag');

  const metaDocente = document.getElementById('metaDocente');
  const metaCurso = document.getElementById('metaCurso');
  const metaSeccionPeriodo = document.getElementById('metaSeccionPeriodo');
  const metaTipoSolicitud = document.getElementById('metaTipoSolicitud');
  const evalStudentsTableBody = document.getElementById('evalStudentsTableBody');
  const txtSustentoEap = document.getElementById('txtSustentoEap');
  const decisionSustentoBox = document.getElementById('decisionSustentoBox');
  const resolutionHistoryBox = document.getElementById('resolutionHistoryBox');
  const resolutionHistoryText = document.getElementById('resolutionHistoryText');
  const evalActionButtonsGroup = document.getElementById('evalActionButtonsGroup');

  const btnApproveRequest = document.getElementById('btnApproveRequest');
  const btnRejectRequest = document.getElementById('btnRejectRequest');

  // Modal Confirm
  const modalConfirmBackdrop = document.getElementById('modalConfirmBackdrop');
  const confirmTitleText = document.getElementById('confirmTitleText');
  const confirmDescText = document.getElementById('confirmDescText');
  const confirmIconCircle = document.getElementById('confirmIconCircle');
  const btnCancelConfirm = document.getElementById('btnCancelConfirm');
  const btnProceedConfirm = document.getElementById('btnProceedConfirm');

  // Undo Banner
  const undoBanner = document.getElementById('undoRejectionBanner');
  const undoTicketCode = document.getElementById('undoTicketCode');
  const undoCountdownTimer = document.getElementById('undoCountdownTimer');
  const btnUndoRejection = document.getElementById('btnUndoRejection');

  // Toast
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  let currentActiveRequest = null;
  let pendingActionType = null; // 'APPROVE' | 'REJECT'
  let undoCountdownInterval = null;
  let lastRejectedRequestId = null;

  // 3. Renderizar Tabla de Solicitudes
  function renderTable() {
    const list = getSolicitudes();
    const fPeriodo = filterPeriodo.value;
    const fCarrera = filterCarrera.value;
    const fTipo = filterTipoSolicitud.value;
    const fEstado = filterEstado.value;

    const filtered = list.filter(item => {
      const matchPeriodo = fPeriodo === 'todos' || item.periodo.replace(/\s+/g, '') === fPeriodo.replace(/\s+/g, '');
      const matchCarrera = fCarrera === 'todos' || item.carrera.toUpperCase() === fCarrera.toUpperCase();
      const matchTipo = fTipo === 'todos' || item.tipoSolicitud === fTipo;
      const matchEstado = fEstado === 'todos' || item.estado === fEstado;
      return matchPeriodo && matchCarrera && matchTipo && matchEstado;
    });

    // Contadores
    const pendientes = list.filter(x => x.estado === 'SOLICITADO').length;
    const procesadas = list.filter(x => x.estado === 'PROCESADO').length;
    const rechazadas = list.filter(x => x.estado === 'RECHAZADO').length;

    if (countShownEl) countShownEl.textContent = filtered.length;
    if (countPendientesEl) countPendientesEl.textContent = pendientes;
    if (countProcesadasEl) countProcesadasEl.textContent = procesadas;
    if (countRechazadasEl) countRechazadasEl.textContent = rechazadas;
    if (pagCountEl) pagCountEl.textContent = filtered.length;
    if (pagTotalEl) pagTotalEl.textContent = list.length;
    if (headerStatsText) headerStatsText.textContent = `${pendientes} solicitudes por evaluar`;

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 48px 16px; color: #64748B;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p style="font-weight: 700; color: #334155; font-size: 15px;">No se encontraron solicitudes con los filtros aplicados</p>
              <p style="font-size: 13px;">Prueba seleccionando otro estado o periodo académico.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item, index) => {
      const isSolicitado = item.estado === 'SOLICITADO';
      const isProcesado = item.estado === 'PROCESADO';
      const isRect = item.tipoSolicitud === 'RECTIFICACION';
      const cantAlumnos = item.alumnosAfectados ? item.alumnosAfectados.length : 0;

      let statusBadgeClass = 'solicitado';
      let statusLabel = 'Por Evaluar';
      if (isProcesado) {
        statusBadgeClass = 'procesado';
        statusLabel = 'Procesado';
      } else if (item.estado === 'RECHAZADO') {
        statusBadgeClass = 'rechazado';
        statusLabel = 'Rechazado';
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${index + 1}</td>
        <td><span class="ticket-tag">${item.ticket}</span></td>
        <td><span style="font-weight: 600;">${item.fecha}</span></td>
        <td>
          <div style="font-weight: 700; color: #0F172A;">${item.docente}</div>
          <div style="font-size: 11.5px; color: #64748B;">${item.carrera}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: #1E293B;">${item.curso}</div>
          <div style="font-size: 11.5px; color: #64748B;">Sección: ${item.seccion}</div>
        </td>
        <td>
          <span class="badge-tipo ${isRect ? 'rectificacion' : 'extemporanea'}">
            ${isRect ? 'Rectificación' : 'Extemporánea'}
          </span>
        </td>
        <td style="text-align: center;">
          <strong style="color: #0F848F;">${cantAlumnos}</strong> alumno${cantAlumnos !== 1 ? 's' : ''}
        </td>
        <td style="text-align: center;">
          <span class="status-badge ${statusBadgeClass}">
            <span class="dot"></span>
            ${statusLabel}
          </span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn-eval-action ${!isSolicitado ? 'view-only' : ''}" data-id="${item.id}">
            ${isSolicitado ? 'Evaluar' : 'Ver Detalle'}
          </button>
        </td>
      `;

      const btnEval = tr.querySelector('.btn-eval-action');
      btnEval.addEventListener('click', () => {
        openEvaluarModal(item);
      });

      tableBody.appendChild(tr);
    });

    checkRecentRejectionUndo();
  }

  // 4. Modal Evaluar
  function openEvaluarModal(item) {
    currentActiveRequest = item;
    modalEvaluarTicketTag.textContent = `Ticket: ${item.ticket}`;
    metaDocente.textContent = item.docente;
    metaCurso.textContent = `${item.curso}`;
    metaSeccionPeriodo.textContent = `${item.seccion} • ${item.periodo}`;
    metaTipoSolicitud.textContent = item.tipoSolicitud === 'RECTIFICACION' ? 'Rectificación de Nota' : 'Nota Extemporánea';

    // Rellenar tabla alumnos
    evalStudentsTableBody.innerHTML = '';
    item.alumnosAfectados.forEach((al, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td><span style="font-family: monospace; font-weight: 700; color: #0F848F;">${al.codigo}</span></td>
        <td><strong>${al.nombre}</strong></td>
        <td>${al.evaluacion}</td>
        <td><span class="grade-old">${al.notaActual}</span></td>
        <td><span class="grade-new">${al.nuevaNota}</span></td>
        <td><span style="font-size: 12px; color: #475569;">${al.motivo}</span></td>
        <td>
          <a href="#" class="link-sustento-btn" onclick="alert('Descargando archivo adjunto de sustento docente: ${al.sustentoFile}'); return false;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            ${al.sustentoFile || 'Sustento.pdf'}
          </a>
        </td>
      `;
      evalStudentsTableBody.appendChild(tr);
    });

    txtSustentoEap.value = '';

    if (item.estado === 'SOLICITADO') {
      decisionSustentoBox.style.display = 'flex';
      resolutionHistoryBox.style.display = 'none';
      evalActionButtonsGroup.style.display = 'flex';
    } else {
      // Ya resuelto
      decisionSustentoBox.style.display = 'none';
      resolutionHistoryBox.style.display = 'block';
      evalActionButtonsGroup.style.display = 'none';

      if (item.eapDecision) {
        resolutionHistoryText.innerHTML = `
          <strong>Dictamen (${item.estado}):</strong> ${item.eapDecision.sustento}<br>
          <small style="color: #64748B;">Resuelto por: ${item.eapDecision.director || 'Dirección de Escuela'} el ${item.eapDecision.fecha}</small>
        `;
      } else {
        resolutionHistoryText.textContent = `Esta solicitud fue marcada como ${item.estado}.`;
      }
    }

    modalEvaluarBackdrop.classList.add('active');
  }

  function closeEvaluarModal() {
    modalEvaluarBackdrop.classList.remove('active');
  }

  // 5. Confirmación Procesar / Rechazar
  function triggerApproval() {
    const sustento = txtSustentoEap.value.trim();
    if (!sustento) {
      alert('Por favor ingrese el sustento institucional de la Dirección de Escuela antes de procesar.');
      txtSustentoEap.focus();
      return;
    }

    pendingActionType = 'APPROVE';
    confirmIconCircle.className = 'confirm-icon-circle';
    confirmTitleText.textContent = '¿Confirmar Procesamiento en SIGU?';
    confirmDescText.textContent = `Al confirmar, la calificación de ${currentActiveRequest.alumnosAfectados.length} alumno(s) se actualizará automáticamente en el acta oficial de notas del sistema SIGU.`;
    btnProceedConfirm.className = 'btn-confirm-proceed';
    btnProceedConfirm.textContent = 'Sí, Procesar en SIGU';
    modalConfirmBackdrop.classList.add('active');
  }

  function triggerRejection() {
    const sustento = txtSustentoEap.value.trim();
    if (!sustento) {
      alert('Por favor ingrese el sustento o motivo institucional del rechazo de la solicitud.');
      txtSustentoEap.focus();
      return;
    }

    pendingActionType = 'REJECT';
    confirmIconCircle.className = 'confirm-icon-circle danger';
    confirmTitleText.textContent = '¿Rechazar Solicitud Docente?';
    confirmDescText.textContent = `La solicitud pasará a estado RECHAZADO y se notificará al docente con el sustento ingresado. Podrás deshacer la acción durante los próximos 15 minutos.`;
    btnProceedConfirm.className = 'btn-confirm-proceed danger';
    btnProceedConfirm.textContent = 'Sí, Rechazar Solicitud';
    modalConfirmBackdrop.classList.add('active');
  }

  function executeConfirmedAction() {
    if (!currentActiveRequest) return;
    const list = getSolicitudes();
    const idx = list.findIndex(x => x.id === currentActiveRequest.id);

    if (idx === -1) return;

    const fechaActual = new Date().toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

    if (pendingActionType === 'APPROVE') {
      list[idx].estado = 'PROCESADO';
      list[idx].eapDecision = {
        fecha: fechaActual,
        sustento: txtSustentoEap.value.trim(),
        director: 'VERGARA PINTO BRENDA'
      };
      saveSolicitudes(list);
      showToast('Solicitud PROCESADA con éxito en SIGU');
      hideUndoBanner();
    } else if (pendingActionType === 'REJECT') {
      list[idx].estado = 'RECHAZADO';
      list[idx].rejectionTimestamp = Date.now();
      list[idx].eapDecision = {
        fecha: fechaActual,
        sustento: txtSustentoEap.value.trim(),
        director: 'VERGARA PINTO BRENDA'
      };
      saveSolicitudes(list);
      showToast('Solicitud RECHAZADA. Puedes deshacer durante 15 min');
      lastRejectedRequestId = list[idx].id;
      startUndoTimer(list[idx]);
    }

    modalConfirmBackdrop.classList.remove('active');
    closeEvaluarModal();
    renderTable();
  }

  // 6. 15-Minute Undo Countdown
  function checkRecentRejectionUndo() {
    const list = getSolicitudes();
    const now = Date.now();
    const recent = list.find(x => x.estado === 'RECHAZADO' && x.rejectionTimestamp && (now - x.rejectionTimestamp < 15 * 60 * 1000));
    if (recent) {
      lastRejectedRequestId = recent.id;
      startUndoTimer(recent);
    }
  }

  function startUndoTimer(item) {
    if (undoCountdownInterval) clearInterval(undoCountdownInterval);

    undoTicketCode.textContent = item.ticket;
    undoBanner.style.display = 'flex';

    function update() {
      const now = Date.now();
      const elapsed = now - (item.rejectionTimestamp || now);
      const remainingMs = (15 * 60 * 1000) - elapsed;

      if (remainingMs <= 0) {
        clearInterval(undoCountdownInterval);
        hideUndoBanner();
        return;
      }

      const totalSec = Math.floor(remainingMs / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      undoCountdownTimer.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    update();
    undoCountdownInterval = setInterval(update, 1000);
  }

  function hideUndoBanner() {
    if (undoCountdownInterval) clearInterval(undoCountdownInterval);
    undoBanner.style.display = 'none';
  }

  function handleUndoRejection() {
    if (!lastRejectedRequestId) return;
    const list = getSolicitudes();
    const idx = list.findIndex(x => x.id === lastRejectedRequestId);
    if (idx !== -1) {
      list[idx].estado = 'SOLICITADO';
      list[idx].rejectionTimestamp = null;
      list[idx].eapDecision = null;
      saveSolicitudes(list);
      hideUndoBanner();
      showToast('Rechazo deshecho. La solicitud vuelve a estado SOLICITADO');
      renderTable();
    }
  }

  function showToast(msg) {
    toastText.textContent = msg;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 4000);
  }

  // 7. Event Listeners
  if (filterPeriodo) filterPeriodo.addEventListener('change', renderTable);
  if (filterCarrera) filterCarrera.addEventListener('change', renderTable);
  if (filterTipoSolicitud) filterTipoSolicitud.addEventListener('change', renderTable);
  if (filterEstado) filterEstado.addEventListener('change', renderTable);

  if (btnClearFilters) {
    btnClearFilters.addEventListener('click', () => {
      filterPeriodo.value = 'todos';
      filterCarrera.value = 'todos';
      filterTipoSolicitud.value = 'todos';
      filterEstado.value = 'todos';
      renderTable();
      showToast('Filtros restablecidos');
    });
  }

  if (btnCloseModalEvaluar) btnCloseModalEvaluar.addEventListener('click', closeEvaluarModal);
  if (btnCancelModalEvaluar) btnCancelModalEvaluar.addEventListener('click', closeEvaluarModal);
  if (btnApproveRequest) btnApproveRequest.addEventListener('click', triggerApproval);
  if (btnRejectRequest) btnRejectRequest.addEventListener('click', triggerRejection);

  if (btnCancelConfirm) btnCancelConfirm.addEventListener('click', () => modalConfirmBackdrop.classList.remove('active'));
  if (btnProceedConfirm) btnProceedConfirm.addEventListener('click', executeConfirmedAction);

  if (btnUndoRejection) btnUndoRejection.addEventListener('click', handleUndoRejection);

  if (modalEvaluarBackdrop) {
    modalEvaluarBackdrop.addEventListener('click', (e) => {
      if (e.target === modalEvaluarBackdrop) closeEvaluarModal();
    });
  }

  // Inicializar
  renderTable();
});
