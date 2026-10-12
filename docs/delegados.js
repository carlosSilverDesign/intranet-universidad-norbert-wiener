
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.attendance-table') || document.querySelector('.delegados-table');
  const btnSaveDelegado = document.getElementById('btnRegistrarDelegado');
  const btnBuscarFiltros = document.getElementById('btnBuscarFiltros') || document.getElementById('btnMostrarFiltros');
  const toastNotification = document.getElementById('attendanceToast') || document.getElementById('delegadosToast');
  const toastText = document.getElementById('attendanceToastText') || document.getElementById('delegadosToastText');
  const chipDelegado = document.getElementById('chipDelegado');
  const chipSubdelegado = document.getElementById('chipSubdelegado');

  let toastTimeout = null;

  /**
   * MUESTRA LA NOTIFICACIÓN TOAST
   */
  function showToast(message, isWarning = false) {
    if (!toastNotification || !toastText) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastText.textContent = message;

    const icon = toastNotification.querySelector('.attendance-toast-icon');
    if (isWarning) {
      toastNotification.classList.add('is-warning');
      if (icon) {
        icon.innerHTML = `
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        `;
      }
    } else {
      toastNotification.classList.remove('is-warning');
      if (icon) {
        icon.innerHTML = `
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        `;
      }
    }

    toastNotification.classList.add('show');

    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3800);
  }

  /**
   * ACTUALIZA LOS RESÚMENES Y CLASES DE FILAS SEGÚN LA SELECCIÓN ACTUAL
   */
  function updateSelectionsState() {
    if (!table) return;

    let selectedDelegadoName = null;
    let selectedSubdelegadoName = null;

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const delInput = row.querySelector('.input-delegado');
      const subInput = row.querySelector('.input-subdelegado');

      const isDel = delInput && delInput.checked;
      const isSub = subInput && subInput.checked;

      row.classList.toggle('is-delegado-row', isDel);
      row.classList.toggle('is-subdelegado-row', isSub);

      const studentNameElem = row.querySelector('.td-student');
      const studentName = studentNameElem ? studentNameElem.textContent.trim() : '';

      if (isDel) {
        selectedDelegadoName = studentName;
      }
      if (isSub) {
        selectedSubdelegadoName = studentName;
      }
    });

    // Actualizar chip de Delegado
    if (chipDelegado) {
      if (selectedDelegadoName) {
        chipDelegado.classList.add('has-selection-del');
        chipDelegado.innerHTML = `<span class="chip-dot"></span> Delegado: <strong>${selectedDelegadoName}</strong>`;
      } else {
        chipDelegado.classList.remove('has-selection-del');
        chipDelegado.innerHTML = `<span class="chip-dot"></span> Delegado: <em>Sin asignar</em>`;
      }
    }

    // Actualizar chip de Sub-delegado
    if (chipSubdelegado) {
      if (selectedSubdelegadoName) {
        chipSubdelegado.classList.add('has-selection-sub');
        chipSubdelegado.innerHTML = `<span class="chip-dot"></span> Sub-delegado: <strong>${selectedSubdelegadoName}</strong>`;
      } else if (selectedDelegadoName) {
        chipSubdelegado.classList.remove('has-selection-sub');
        chipSubdelegado.innerHTML = `<span class="chip-dot"></span> Sub-delegado: <em>Sin asignar</em>`;
      } else {
        chipSubdelegado.classList.remove('has-selection-sub');
        chipSubdelegado.innerHTML = `<span class="chip-dot"></span> Sub-delegado: <em>Requiere Delegado previo</em>`;
      }
    }
  }

  /**
   * INTERACTIVIDAD DE SELECCIÓN EXCLUSIVA (DELEGADO / SUB-DELEGADO)
   */
  if (table) {
    table.addEventListener('change', (e) => {
      const target = e.target;

      // Selección de DELEGADO
      if (target.classList.contains('input-delegado')) {
        const currentRow = target.closest('tr');

        if (target.checked) {
          // Desmarcar cualquier otro delegado en la tabla
          table.querySelectorAll('.input-delegado').forEach(input => {
            if (input !== target) input.checked = false;
          });

          // Un alumno no puede ser Delegado y Sub-delegado a la vez
          const currentSub = currentRow.querySelector('.input-subdelegado');
          if (currentSub && currentSub.checked) {
            currentSub.checked = false;
          }
        } else {
          // Si se desmarca el delegado y había un sub-delegado seleccionado, retirarlo y mostrar aviso
          const activeSub = table.querySelector('.input-subdelegado:checked');
          if (activeSub) {
            activeSub.checked = false;
            showToast('Se retiró el Sub-delegado ya que no puede registrarse sin un Delegado asignado previamente.', true);
          }
        }

        updateSelectionsState();
      }

      // Selección de SUB-DELEGADO
      if (target.classList.contains('input-subdelegado')) {
        const currentRow = target.closest('tr');

        if (target.checked) {
          // Validar que exista un Delegado registrado/seleccionado previamente
          const checkedDel = table.querySelector('.input-delegado:checked');
          if (!checkedDel) {
            target.checked = false;
            showToast('No es posible registrar un Sub-delegado si no hay un Delegado registrado previamente.', true);
            updateSelectionsState();
            return;
          }

          // Validar que no sea el mismo alumno que ya está marcado como Delegado
          const currentDel = currentRow.querySelector('.input-delegado');
          if (currentDel && currentDel.checked) {
            target.checked = false;
            showToast('Este alumno ya está asignado como Delegado. Seleccione a otro alumno como Sub-delegado.', true);
            updateSelectionsState();
            return;
          }

          // Desmarcar cualquier otro sub-delegado en la tabla
          table.querySelectorAll('.input-subdelegado').forEach(input => {
            if (input !== target) input.checked = false;
          });
        }

        updateSelectionsState();
      }
    });
  }

  /**
   * BOTÓN REGISTRAR DELEGADO
   */
  if (btnSaveDelegado) {
    btnSaveDelegado.addEventListener('click', () => {
      const checkedDel = table ? table.querySelector('.input-delegado:checked') : null;
      const checkedSub = table ? table.querySelector('.input-subdelegado:checked') : null;

      if (!checkedDel && checkedSub) {
        showToast('No es posible registrar un Sub-delegado si no hay un Delegado registrado previamente.', true);
        return;
      }

      if (!checkedDel && !checkedSub) {
        showToast('Por favor, seleccione un Delegado antes de registrar.', true);
        return;
      }

      const delName = checkedDel.closest('tr').querySelector('.td-student').textContent.trim();
      const subName = checkedSub ? checkedSub.closest('tr').querySelector('.td-student').textContent.trim() : null;

      let msg = `Delegado (${delName}) registrado con éxito.`;
      if (subName) {
        msg = `Delegado (${delName}) y Sub-delegado (${subName}) registrados con éxito.`;
      }

      showToast(msg, false);
    });
  }

  /**
   * BOTÓN BUSCAR FILTROS
   */
  if (btnBuscarFiltros) {
    btnBuscarFiltros.addEventListener('click', () => {
      const carrera = document.getElementById('filtroCarrera');
      const seccion = document.getElementById('filtroSeccion');

      const carreraText = carrera ? carrera.options[carrera.selectedIndex].text : '';
      const seccionText = seccion ? seccion.value : '';

      showToast(`Mostrando alumnos para sección ${seccionText} de ${carreraText}.`, false);
    });
  }

  // Inicializar estado de resumen al cargar
  updateSelectionsState();
});
