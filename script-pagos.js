
//Listado de Obligaciones
document.addEventListener("DOMContentLoaded", function () {
  const headerCheckbox = document.querySelector('.header-checkbox');
  // Convertimos a array para facilitar la manipulación por índice.
  const rowCheckboxes = Array.from(document.querySelectorAll('.row-checkbox'));
  const summaryBar = document.querySelector('.summary-bar');
  const selectedCount = document.getElementById('selected-count');
  const totalAmount = document.getElementById('total-amount');

  // --- NUEVO: Inicialización de estados de los checkboxes ---
  // Solo el primer checkbox se habilita, el resto se deshabilitan.
  rowCheckboxes.forEach((checkbox, index) => {
    checkbox.disabled = (index !== 0);
    if (checkbox.disabled) {
      checkbox.closest('.table-row').classList.add('disabled');
    }
  });

  // --- NUEVO: Lógica de Pestañas (Tabs) ---
  const tabs = document.querySelectorAll('.tab');
  const tableContainers = document.querySelectorAll('.table-container');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remover clase active de todas las tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Ocultar todos los contenedores de tablas
      tableContainers.forEach(tc => tc.style.display = 'none');

      // Activar la tab clickeada y mostrar su contenedor asociado
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      if (targetId) {
        const targetContainer = document.getElementById(targetId);
        if (targetContainer) {
          targetContainer.style.display = 'block';
        }
      }
    });
  });

  // Función para actualizar la barra de resumen (sin cambios)
  function updateSummary() {
    let count = 0;
    let total = 0;

    rowCheckboxes.forEach(checkbox => {
      const row = checkbox.closest('.table-row');
      if (checkbox.checked) {
        count++;
        row.classList.add('selected'); // Aplica estilos cuando está marcado
        const priceElement = row.querySelector('.price');
        if (priceElement) {
          const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
          total += price;
        }
      } else {
        row.classList.remove('selected'); // Remueve estilos si se desmarca
      }
    });

    if (count > 0) {
      summaryBar.classList.add('visible');
      selectedCount.textContent = `${count} pagos seleccionados`;
      totalAmount.textContent = `S/ ${total.toFixed(2)}`;
    } else {
      summaryBar.classList.remove('visible');
    }
  }

  // --- Modificación en el listener del header checkbox ---
  if (headerCheckbox) {
    headerCheckbox.addEventListener('change', function () {
      if (headerCheckbox.checked) {
        // Si se marca el header, se habilitan y marcan TODAS las filas.
        rowCheckboxes.forEach(checkbox => {
          checkbox.disabled = false; // Habilita todas
          checkbox.checked = true;
          checkbox.closest('.table-row').classList.remove('disabled');
          checkbox.closest('.table-row').classList.add('selected');
        });
      } else {
        // Si se desmarca, se desmarcan TODAS las filas y se restaura la secuencia:
        // solo el primer checkbox permanece habilitado.
        rowCheckboxes.forEach((checkbox, index) => {
          checkbox.checked = false;
          checkbox.closest('.table-row').classList.remove('selected');
          checkbox.disabled = (index !== 0);
          if (checkbox.disabled) {
            checkbox.closest('.table-row').classList.add('disabled');
          } else {
            checkbox.closest('.table-row').classList.remove('disabled');
          }
        });
      }
      updateSummary();
    });
  }

  // --- Modificación en el listener de cada checkbox de fila ---
  rowCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      // Si se desmarca un checkbox, se deshabilitan y desmarcan los posteriores.
      if (!checkbox.checked) {
        for (let i = index + 1; i < rowCheckboxes.length; i++) {
          rowCheckboxes[i].checked = false;
          rowCheckboxes[i].disabled = true;
          rowCheckboxes[i].closest('.table-row').classList.remove('selected');
          rowCheckboxes[i].closest('.table-row').classList.add('disabled');
        }
      } else {
        // Al marcar, se habilita el siguiente checkbox si existe.
        if (index + 1 < rowCheckboxes.length) {
          rowCheckboxes[index + 1].disabled = false;
          rowCheckboxes[index + 1].closest('.table-row').classList.remove('disabled');
        }
      }

      // Actualiza el estado del header checkbox si todos los rowCheckbox están marcados.
      headerCheckbox.checked = rowCheckboxes.every(chk => chk.checked);
      updateSummary();
    });
  });

  // --- NUEVO: Control del tag 'En proceso' y checkboxes de las obligaciones ---
  const tagProceso = document.querySelector('.tag-proceso');
  if (tagProceso) {
    const docCol = tagProceso.closest('.documento-col');
    if (docCol) {
      // Si no venimos de medio-pago.html, empezamos limpio sin la etiqueta activa
      const cameFromMedioPago = document.referrer.includes('medio-pago.html');
      if (!cameFromMedioPago) {
        localStorage.removeItem('tagProcesoActive');
        localStorage.removeItem('selectedPaymentMethod');
      }

      const updateTagState = () => {
        const isProcesoActive = localStorage.getItem('tagProcesoActive') === 'true';
        if (isProcesoActive) {
          tagProceso.classList.add('active');
        } else {
          tagProceso.classList.remove('active');
        }

        // Habilitar/deshabilitar los checkboxes según el estado del tag 'En proceso'
        rowCheckboxes.forEach((checkbox, index) => {
          if (isProcesoActive) {
            if (index === 0) {
              checkbox.disabled = true;
              checkbox.checked = false;
            } else if (index === 1) {
              // Si la primera cuota está en proceso, habilitamos la segunda para continuar
              checkbox.disabled = false;
            } else {
              checkbox.disabled = true;
              checkbox.checked = false;
            }
          } else {
            checkbox.disabled = (index !== 0);
            if (index !== 0) {
              checkbox.checked = false;
            }
          }
          const row = checkbox.closest('.table-row');
          if (row) {
            if (checkbox.disabled) {
              row.classList.add('disabled');
            } else {
              row.classList.remove('disabled');
            }
            if (!checkbox.checked) {
              row.classList.remove('selected');
            }
          }
        });

        // Habilitar/deshabilitar el checkbox de cabecera
        if (headerCheckbox) {
          headerCheckbox.checked = false;
          headerCheckbox.disabled = isProcesoActive;
        }

        updateSummary();
      };

      // Inicializar el estado de la etiqueta y checkboxes al cargar la página
      updateTagState();

      // Permitir activar/desactivar haciendo click en la columna (el código del documento o el tag)
      docCol.style.cursor = 'pointer';
      docCol.addEventListener('click', function () {
        const isCurrentlyActive = tagProceso.classList.contains('active');
        const newState = !isCurrentlyActive;
        localStorage.setItem('tagProcesoActive', newState ? 'true' : 'false');
        if (newState) {
          localStorage.setItem('selectedPaymentMethod', 'flywire');
        } else {
          localStorage.removeItem('selectedPaymentMethod');
        }
        updateTagState();
      });
    }
  }

  // --- NUEVO: Control del botón Siguiente en medio-pago.html ---
  const isMedioPagoPage = document.querySelector('.payment-methods-list') !== null;
  if (isMedioPagoPage) {
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
      nextButton.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedRadio = document.querySelector('.payment-method input[type="radio"]:checked');
        if (selectedRadio) {
          const method = selectedRadio.value;
          localStorage.setItem('selectedPaymentMethod', method);
          
          if (method === 'flywire') {
            // Flywire: Activar el tag 'En proceso' y volver al listado de obligaciones
            localStorage.setItem('tagProcesoActive', 'true');
            window.location.href = 'pagos-pasarela.html';
          } else {
            // Niubiz: Desactivar el tag (o pago inmediato) e ir a la constancia
            localStorage.setItem('tagProcesoActive', 'false');
            window.location.href = 'summary-pasarela.html';
          }
        } else {
          alert('Por favor, selecciona un medio de pago.');
        }
      });
    }
  }
});

// --- NUEVO: Estilo seleccionado para métodos de pago ---
const paymentRadios = document.querySelectorAll('.payment-method input[type="radio"]');

paymentRadios.forEach(radio => {
  radio.addEventListener('change', function () {
    // Remueve la clase 'selected' de todos los métodos de pago
    paymentRadios.forEach(r => {
      r.closest('.payment-method').classList.remove('selected');
    });

    // Agrega la clase 'selected' al método de pago actualmente marcado
    if (this.checked) {
      this.closest('.payment-method').classList.add('selected');
    }
  });
});
