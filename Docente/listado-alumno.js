/**
 * Listado de Alumnos - Portal Docente Universidad Norbert Wiener
 * Componentes Personalizados: Selects Flotantes con Flip Inteligente,
 * Datepickers Flotantes con paleta Wiener, Búsqueda y Tabla Escalable.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Base de datos de alumnos (8 alumnos para la demo principal, escalable hasta 35)
  const alumnosData = [
    { num: 1, iniciales: 'CA', avatarClass: 'avatar-sky', nombre: 'Arias Mendoza, Carla', codigo: '2026104373', correo: 'a2026104373@uwiener.edu.pe', promedio: '16.4', asistencia: '92%' },
    { num: 2, iniciales: 'RN', avatarClass: 'avatar-teal', nombre: 'Ramos Navarro, Renzo', codigo: '2026104374', correo: 'a2026104374@uwiener.edu.pe', promedio: '15.8', asistencia: '95%' },
    { num: 3, iniciales: 'BM', avatarClass: 'avatar-sky', nombre: 'Benites Morales, Valeria', codigo: '2026104375', correo: 'a2026104375@uwiener.edu.pe', promedio: '17.2', asistencia: '100%' },
    { num: 4, iniciales: 'CP', avatarClass: 'avatar-teal', nombre: 'Castro Paredes, Joaquín', codigo: '2026104376', correo: 'a2026104376@uwiener.edu.pe', promedio: '14.5', asistencia: '88%' },
    { num: 5, iniciales: 'DG', avatarClass: 'avatar-sky', nombre: 'Delgado Gutierrez, Luciana', codigo: '2026104377', correo: 'a2026104377@uwiener.edu.pe', promedio: '18.0', asistencia: '96%' },
    { num: 6, iniciales: 'ES', avatarClass: 'avatar-teal', nombre: 'Espinoza Sánchez, Mateo', codigo: '2026104378', correo: 'a2026104378@uwiener.edu.pe', promedio: '13.9', asistencia: '82%' },
    { num: 7, iniciales: 'FM', avatarClass: 'avatar-sky', nombre: 'Flores Medina, Camila', codigo: '2026104379', correo: 'a2026104379@uwiener.edu.pe', promedio: '16.8', asistencia: '92%' },
    { num: 8, iniciales: 'GV', avatarClass: 'avatar-teal', nombre: 'Gómez Vega, Sebastián', codigo: '2026104380', correo: 'a2026104380@uwiener.edu.pe', promedio: '15.2', asistencia: '90%' },
    // Alumnos adicionales para pruebas de carga real (hasta 35)
    { num: 9, iniciales: 'HP', avatarClass: 'avatar-sky', nombre: 'Herrera Palacios, Diego', codigo: '2026104381', correo: 'a2026104381@uwiener.edu.pe', promedio: '16.1', asistencia: '94%' },
    { num: 10, iniciales: 'IT', avatarClass: 'avatar-teal', nombre: 'Ibarra Torres, Gabriela', codigo: '2026104382', correo: 'a2026104382@uwiener.edu.pe', promedio: '17.5', asistencia: '98%' },
    { num: 11, iniciales: 'JL', avatarClass: 'avatar-sky', nombre: 'Jiménez López, Rodrigo', codigo: '2026104383', correo: 'a2026104383@uwiener.edu.pe', promedio: '14.8', asistencia: '86%' },
    { num: 12, iniciales: 'LR', avatarClass: 'avatar-teal', nombre: 'Lozano Ruiz, Andrea', codigo: '2026104384', correo: 'a2026104384@uwiener.edu.pe', promedio: '15.5', asistencia: '91%' },
    { num: 13, iniciales: 'MC', avatarClass: 'avatar-sky', nombre: 'Mendoza Castillo, Álvaro', codigo: '2026104385', correo: 'a2026104385@uwiener.edu.pe', promedio: '16.7', asistencia: '93%' },
    { num: 14, iniciales: 'NV', avatarClass: 'avatar-teal', nombre: 'Navarro Vargas, Claudia', codigo: '2026104386', correo: 'a2026104386@uwiener.edu.pe', promedio: '18.2', asistencia: '100%' },
    { num: 15, iniciales: 'OR', avatarClass: 'avatar-sky', nombre: 'Ortiz Ramírez, Manuel', codigo: '2026104387', correo: 'a2026104387@uwiener.edu.pe', promedio: '13.5', asistencia: '80%' },
    { num: 16, iniciales: 'PF', avatarClass: 'avatar-teal', nombre: 'Paredes Figueroa, Natalia', codigo: '2026104388', correo: 'a2026104388@uwiener.edu.pe', promedio: '15.9', asistencia: '92%' },
    { num: 17, iniciales: 'QC', avatarClass: 'avatar-sky', nombre: 'Quispe Castro, Fabricio', codigo: '2026104389', correo: 'a2026104389@uwiener.edu.pe', promedio: '16.3', asistencia: '95%' },
    { num: 18, iniciales: 'RS', avatarClass: 'avatar-teal', nombre: 'Ríos Silva, Daniela', codigo: '2026104390', correo: 'a2026104390@uwiener.edu.pe', promedio: '17.0', asistencia: '96%' },
    { num: 19, iniciales: 'SM', avatarClass: 'avatar-sky', nombre: 'Salazar Morales, Bruno', codigo: '2026104391', correo: 'a2026104391@uwiener.edu.pe', promedio: '14.2', asistencia: '85%' },
    { num: 20, iniciales: 'TC', avatarClass: 'avatar-teal', nombre: 'Torres Cárdenas, Adriana', codigo: '2026104392', correo: 'a2026104392@uwiener.edu.pe', promedio: '16.6', asistencia: '94%' },
    { num: 21, iniciales: 'UV', avatarClass: 'avatar-sky', nombre: 'Ugarte Vera, Leonardo', codigo: '2026104393', correo: 'a2026104393@uwiener.edu.pe', promedio: '15.0', asistencia: '89%' },
    { num: 22, iniciales: 'VP', avatarClass: 'avatar-teal', nombre: 'Vásquez Pinto, Mariana', codigo: '2026104394', correo: 'a2026104394@uwiener.edu.pe', promedio: '17.8', asistencia: '97%' },
    { num: 23, iniciales: 'WA', avatarClass: 'avatar-sky', nombre: 'Wong Alarcón, Kevin', codigo: '2026104395', correo: 'a2026104395@uwiener.edu.pe', promedio: '13.8', asistencia: '84%' },
    { num: 24, iniciales: 'YB', avatarClass: 'avatar-teal', nombre: 'Yáñez Bustamante, Patricia', codigo: '2026104396', correo: 'a2026104396@uwiener.edu.pe', promedio: '16.2', asistencia: '93%' },
    { num: 25, iniciales: 'ZC', avatarClass: 'avatar-sky', nombre: 'Zamora Cruz, Fernando', codigo: '2026104397', correo: 'a2026104397@uwiener.edu.pe', promedio: '15.7', asistencia: '91%' },
    { num: 26, iniciales: 'AR', avatarClass: 'avatar-teal', nombre: 'Aguilar Rojas, Sofía', codigo: '2026104398', correo: 'a2026104398@uwiener.edu.pe', promedio: '17.4', asistencia: '98%' },
    { num: 27, iniciales: 'BL', avatarClass: 'avatar-sky', nombre: 'Barrios Luna, Cristian', codigo: '2026104399', correo: 'a2026104399@uwiener.edu.pe', promedio: '14.6', asistencia: '87%' },
    { num: 28, iniciales: 'CM', avatarClass: 'avatar-teal', nombre: 'Cabrera Miranda, Lucía', codigo: '2026104400', correo: 'a2026104400@uwiener.edu.pe', promedio: '16.9', asistencia: '95%' },
    { num: 29, iniciales: 'DP', avatarClass: 'avatar-sky', nombre: 'Dávila Prado, Enrique', codigo: '2026104401', correo: 'a2026104401@uwiener.edu.pe', promedio: '15.4', asistencia: '90%' },
    { num: 30, iniciales: 'ES', avatarClass: 'avatar-teal', nombre: 'Escobar Soto, Jimena', codigo: '2026104402', correo: 'a2026104402@uwiener.edu.pe', promedio: '18.4', asistencia: '100%' },
    { num: 31, iniciales: 'FR', avatarClass: 'avatar-sky', nombre: 'Fuentes Rivas, Andrés', codigo: '2026104403', correo: 'a2026104403@uwiener.edu.pe', promedio: '13.7', asistencia: '81%' },
    { num: 32, iniciales: 'GT', avatarClass: 'avatar-teal', nombre: 'Guerrero Tejada, Brenda', codigo: '2026104404', correo: 'a2026104404@uwiener.edu.pe', promedio: '16.0', asistencia: '92%' },
    { num: 33, iniciales: 'HM', avatarClass: 'avatar-sky', nombre: 'Hidalgo Montoya, César', codigo: '2026104405', correo: 'a2026104405@uwiener.edu.pe', promedio: '17.1', asistencia: '96%' },
    { num: 34, iniciales: 'IP', avatarClass: 'avatar-teal', nombre: 'Infante Pinedo, Melissa', codigo: '2026104406', correo: 'a2026104406@uwiener.edu.pe', promedio: '15.3', asistencia: '89%' },
    { num: 35, iniciales: 'JV', avatarClass: 'avatar-sky', nombre: 'Juárez Valdivia, Daniel', codigo: '2026104407', correo: 'a2026104407@uwiener.edu.pe', promedio: '16.5', asistencia: '94%' }
  ];

  let currentLimit = 8; // Límite inicial de la demo

  // Referencias DOM
  const tableBody = document.getElementById('listadoAlumnosBody');
  const countDisplay = document.getElementById('listadoCountDisplay');
  const tableInfoText = document.getElementById('listadoTableInfoText');
  const searchInput = document.getElementById('filtroAlumno');
  const btnBuscar = document.getElementById('btnBuscarAlumnos');
  const demoScaleBtns = document.querySelectorAll('.demo-scale-btn');

  // =========================================================================
  // 1. GESTIÓN DE CUSTOM SELECTS FLOTANTES CON SMART POSITIONING
  // =========================================================================
  const selectContainers = document.querySelectorAll('.custom-select-container');

  function closeAllDropdowns() {
    selectContainers.forEach(container => {
      container.classList.remove('is-open');
      const trigger = container.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    // Cerrar también datepickers y buscador si están abiertos
    document.querySelectorAll('.custom-date-container').forEach(c => c.classList.remove('is-open'));
    const searchContainer = document.querySelector('.custom-search-container');
    if (searchContainer) searchContainer.classList.remove('is-open');
  }

  selectContainers.forEach(container => {
    const trigger = container.querySelector('.custom-select-trigger');
    const menu = container.querySelector('.custom-dropdown-menu');
    const label = container.querySelector('.custom-select-label');
    const options = container.querySelectorAll('.custom-option');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        // Calcular posicionamiento inteligente (Flip vertical si no cabe abajo)
        const triggerRect = trigger.getBoundingClientRect();
        const menuHeight = 220; // Estimado máximo de altura del dropdown
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        // Limpiar clases de orientación previa
        menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
          menu.classList.add('dropdown-above');
        } else {
          menu.classList.add('dropdown-below');
        }

        // Si se sale por el borde derecho de la pantalla
        const spaceRight = window.innerWidth - triggerRect.left;
        if (spaceRight < 240) {
          menu.classList.add('align-right');
        }

        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Selección de opción dentro del dropdown personalizado
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        const text = opt.querySelector('span') ? opt.querySelector('span').textContent.trim() : opt.textContent.trim();
        const val = opt.getAttribute('data-value') || text;

        if (label) label.textContent = text;
        container.setAttribute('data-current-value', val);

        // Cerrar y regresar la flecha a su rotación original
        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');

        // Actualizar el encabezado informativo de la tabla
        actualizarEncabezadoContextual();
      });
    });
  });

  // Cerrar al dar click fuera o presionar Escape
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  function actualizarEncabezadoContextual() {
    if (!tableInfoText) return;

    const periodoCont = document.querySelector('[data-filter="periodo"]');
    const seccionCont = document.querySelector('[data-filter="seccion"]');
    const cursoCont = document.querySelector('[data-filter="curso"]');

    const periodo = periodoCont ? periodoCont.querySelector('.custom-select-label').textContent.trim() : '2027-I';
    const seccion = seccionCont ? seccionCont.querySelector('.custom-select-label').textContent.trim() : 'AD2N4';
    const curso = cursoCont ? cursoCont.querySelector('.custom-select-label').textContent.trim() : 'AD8021 - Informática para la Toma de Decisiones';

    tableInfoText.innerHTML = `Registro de alumnos del periodo <strong>${periodo}</strong>, Sección <strong>${seccion}</strong>, para el curso <strong>${curso}</strong>`;
  }

  // =========================================================================
  // 2. DATEPICKER PERSONALIZADO WIENER (CALENDARIOS FLOTANTES)
  // =========================================================================
  const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function initDatePicker(containerId, inputId, defaultDateStr) {
    const container = document.getElementById(containerId);
    const input = document.getElementById(inputId);
    const popup = container ? container.querySelector('.custom-calendar-popup') : null;

    if (!container || !input || !popup) return;

    // Parsear fecha inicial (DD/MM/AAAA)
    let parts = defaultDateStr.split('/');
    let curDay = parseInt(parts[0], 10) || 2;
    let curMonth = (parseInt(parts[1], 10) || 5) - 1; // 0-based
    let curYear = parseInt(parts[2], 10) || 2026;

    let viewMonth = curMonth;
    let viewYear = curYear;

    function renderCalendar() {
      popup.innerHTML = `
        <div class="cal-header">
          <span class="cal-month-title">${mesesNombres[viewMonth]} ${viewYear}</span>
          <div class="cal-nav-group">
            <button type="button" class="cal-nav-btn prev-month" aria-label="Mes anterior">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="cal-nav-btn next-month" aria-label="Mes siguiente">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
        <div class="cal-weekdays-grid">
          <span class="cal-weekday">DO</span>
          <span class="cal-weekday">LU</span>
          <span class="cal-weekday">MA</span>
          <span class="cal-weekday">MI</span>
          <span class="cal-weekday">JU</span>
          <span class="cal-weekday">VI</span>
          <span class="cal-weekday">SÁ</span>
        </div>
        <div class="cal-days-grid" id="calDaysGrid_${inputId}"></div>
      `;

      const grid = popup.querySelector(`#calDaysGrid_${inputId}`);
      const firstDay = new Date(viewYear, viewMonth, 1).getDay();
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

      // Días previos del mes anterior
      for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell other-month';
        cell.textContent = d;
        grid.appendChild(cell);
      }

      // Días del mes actual
      for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        cell.textContent = day;

        if (day === curDay && viewMonth === curMonth && viewYear === curYear) {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          curDay = day;
          curMonth = viewMonth;
          curYear = viewYear;

          const dd = String(curDay).padStart(2, '0');
          const mm = String(curMonth + 1).padStart(2, '0');
          input.value = `${dd}/${mm}/${curYear}`;

          container.classList.remove('is-open');
        });

        grid.appendChild(cell);
      }

      // Listeners de navegación de mes
      popup.querySelector('.prev-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) {
          viewMonth = 11;
          viewYear--;
        }
        renderCalendar();
      });

      popup.querySelector('.next-month').addEventListener('click', (e) => {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) {
          viewMonth = 0;
          viewYear++;
        }
        renderCalendar();
      });
    }

    renderCalendar();

    // Abrir/cerrar Datepicker con posicionamiento inteligente
    container.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        const triggerRect = input.getBoundingClientRect();
        const popupHeight = 280;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        popup.classList.remove('popup-above', 'popup-below', 'align-right');

        if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
          popup.classList.add('popup-above');
        } else {
          popup.classList.add('popup-below');
        }

        if (window.innerWidth - triggerRect.left < 290) {
          popup.classList.add('align-right');
        }

        container.classList.add('is-open');
      }
    });
  }

  // Inicializar los dos datepickers con las fechas de la imagen
  initDatePicker('dateContainerInicio', 'filtroFechaInicio', '02/05/2026');
  initDatePicker('dateContainerFin', 'filtroFechaFin', '05/01/2027');

  // =========================================================================
  // 3. CAMPO BÚSQUEDA DE ALUMNO CON DROPDOWN DE SUGERENCIAS
  // =========================================================================
  const searchContainer = document.querySelector('.custom-search-container');
  const searchArrow = document.getElementById('searchToggleArrow');
  const searchDropdown = document.getElementById('searchDropdownMenu');

  if (searchContainer && searchArrow && searchDropdown) {
    searchArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = searchContainer.classList.contains('is-open');

      closeAllDropdowns();

      if (!isOpen) {
        // Llenar sugerencias rápidas con alumnos de la sección
        renderSearchSuggestions();

        const triggerRect = searchInput.getBoundingClientRect();
        searchDropdown.classList.remove('dropdown-above', 'dropdown-below');

        if (window.innerHeight - triggerRect.bottom < 220 && triggerRect.top > 220) {
          searchDropdown.classList.add('dropdown-above');
        } else {
          searchDropdown.classList.add('dropdown-below');
        }

        searchContainer.classList.add('is-open');
      }
    });

    function renderSearchSuggestions() {
      searchDropdown.innerHTML = '';
      const pool = alumnosData.slice(0, currentLimit);

      pool.forEach(al => {
        const item = document.createElement('div');
        item.className = 'custom-option';
        item.innerHTML = `<span><strong>${al.codigo}</strong> - ${al.nombre}</span>`;

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          if (searchInput) searchInput.value = al.nombre;
          searchContainer.classList.remove('is-open');
          filtrarAlumnos();
        });

        searchDropdown.appendChild(item);
      });
    }
  }

  // =========================================================================
  // 4. RENDERIZADO Y FILTRADO DE LA TABLA DE ALUMNOS
  // =========================================================================
  function renderTabla(lista) {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (lista.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="6">
          <div class="listado-empty-state">
            <svg class="listado-empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3 class="listado-empty-title">No se encontraron alumnos</h3>
            <p class="listado-empty-desc">No hay coincidencias para el criterio de búsqueda ingresado.</p>
            <button type="button" class="btn-clear-filter" id="btnClearSearch">Restablecer filtro</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);

      const btnClear = document.getElementById('btnClearSearch');
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          filtrarAlumnos();
        });
      }

      if (countDisplay) {
        countDisplay.innerHTML = 'Mostrando <strong>0</strong> alumnos';
      }
      return;
    }

    lista.forEach(alumno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${alumno.num}</td>
        <td class="td-alumno">
          <div class="alumno-cell-wrapper">
            <div class="alumno-avatar ${alumno.avatarClass}">${alumno.iniciales}</div>
            <span class="alumno-nombre">${alumno.nombre}</span>
          </div>
        </td>
        <td class="td-codigo">${alumno.codigo}</td>
        <td class="td-correo">${alumno.correo}</td>
        <td class="td-promedio">${alumno.promedio}</td>
        <td class="td-asistencia">${alumno.asistencia}</td>
      `;
      tableBody.appendChild(tr);
    });

    if (countDisplay) {
      countDisplay.innerHTML = `Mostrando <strong>${lista.length}</strong> de <strong>${lista.length}</strong> alumnos registrados`;
    }
  }

  function filtrarAlumnos() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const pool = alumnosData.slice(0, currentLimit);

    if (!query) {
      renderTabla(pool);
      return;
    }

    const filtrados = pool.filter(al =>
      al.nombre.toLowerCase().includes(query) ||
      al.codigo.toLowerCase().includes(query) ||
      al.correo.toLowerCase().includes(query)
    );

    renderTabla(filtrados);
  }

  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDropdowns();
      filtrarAlumnos();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filtrarAlumnos();
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        closeAllDropdowns();
        filtrarAlumnos();
      }
    });
  }

  // =========================================================================
  // 5. SELECTOR DE SIMULACIÓN DE CARGA (8, 25 O 35 ALUMNOS)
  // =========================================================================
  demoScaleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.getAttribute('data-count'), 10);
      if (!isNaN(count)) {
        currentLimit = count;
        demoScaleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtrarAlumnos();
      }
    });
  });

  // Render inicial
  actualizarEncabezadoContextual();
  renderTabla(alumnosData.slice(0, currentLimit));
});
