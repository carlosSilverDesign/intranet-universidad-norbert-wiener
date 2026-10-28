/**
 * Alumnos 3er Examen - Portal Docente Universidad Norbert Wiener
 * Lógica de Selects Flotantes con Flip Inteligente, Renderizado y Simulación de Volumen
 */

document.addEventListener('DOMContentLoaded', () => {
  // Base de datos de alumnos para 3er Examen (Promedios entre 10.4 y 11.5, asistencias del visual)
  const tercerExamenData = [
    { num: 1, iniciales: 'CA', avatarClass: 'avatar-sky', nombre: 'Arias Mendoza, Carla', codigo: '2026104373', correo: 'a2026104373@uwiener.edu.pe', promedio: '11.4', asistencia: '73%' },
    { num: 2, iniciales: 'RN', avatarClass: 'avatar-teal', nombre: 'Ramos Navarro, Renzo', codigo: '2026104374', correo: 'a2026104374@uwiener.edu.pe', promedio: '10.6', asistencia: '73%' },
    { num: 3, iniciales: 'BM', avatarClass: 'avatar-sky', nombre: 'Benites Morales, Valeria', codigo: '2026104375', correo: 'a2026104375@uwiener.edu.pe', promedio: '11.5', asistencia: '70%' },
    { num: 4, iniciales: 'CP', avatarClass: 'avatar-teal', nombre: 'Castro Paredes, Joaquín', codigo: '2026104376', correo: 'a2026104376@uwiener.edu.pe', promedio: '10.4', asistencia: '64%' },
    { num: 5, iniciales: 'DG', avatarClass: 'avatar-sky', nombre: 'Delgado Gutierrez, Luciana', codigo: '2026104377', correo: 'a2026104377@uwiener.edu.pe', promedio: '11.2', asistencia: '81%' },
    { num: 6, iniciales: 'ES', avatarClass: 'avatar-teal', nombre: 'Espinoza Sánchez, Mateo', codigo: '2026104378', correo: 'a2026104378@uwiener.edu.pe', promedio: '10.8', asistencia: '72%' },
    { num: 7, iniciales: 'FM', avatarClass: 'avatar-sky', nombre: 'Flores Medina, Camila', codigo: '2026104379', correo: 'a2026104379@uwiener.edu.pe', promedio: '11.0', asistencia: '75%' },
    { num: 8, iniciales: 'GV', avatarClass: 'avatar-teal', nombre: 'Gómez Vega, Sebastián', codigo: '2026104380', correo: 'a2026104380@uwiener.edu.pe', promedio: '10.5', asistencia: '68%' },
    // Casos para simulación de volumen hasta 35 alumnos
    { num: 9, iniciales: 'HP', avatarClass: 'avatar-sky', nombre: 'Herrera Palacios, Diego', codigo: '2026104381', correo: 'a2026104381@uwiener.edu.pe', promedio: '11.3', asistencia: '74%' },
    { num: 10, iniciales: 'IT', avatarClass: 'avatar-teal', nombre: 'Ibarra Torres, Gabriela', codigo: '2026104382', correo: 'a2026104382@uwiener.edu.pe', promedio: '10.9', asistencia: '76%' },
    { num: 11, iniciales: 'JL', avatarClass: 'avatar-sky', nombre: 'Jiménez López, Rodrigo', codigo: '2026104383', correo: 'a2026104383@uwiener.edu.pe', promedio: '11.1', asistencia: '69%' },
    { num: 12, iniciales: 'LR', avatarClass: 'avatar-teal', nombre: 'Lozano Ruiz, Andrea', codigo: '2026104384', correo: 'a2026104384@uwiener.edu.pe', promedio: '10.7', asistencia: '71%' },
    { num: 13, iniciales: 'MC', avatarClass: 'avatar-sky', nombre: 'Mendoza Castillo, Álvaro', codigo: '2026104385', correo: 'a2026104385@uwiener.edu.pe', promedio: '11.4', asistencia: '78%' },
    { num: 14, iniciales: 'NV', avatarClass: 'avatar-teal', nombre: 'Navarro Vargas, Claudia', codigo: '2026104386', correo: 'a2026104386@uwiener.edu.pe', promedio: '10.5', asistencia: '67%' },
    { num: 15, iniciales: 'OR', avatarClass: 'avatar-sky', nombre: 'Ortiz Ramírez, Manuel', codigo: '2026104387', correo: 'a2026104387@uwiener.edu.pe', promedio: '11.2', asistencia: '79%' },
    { num: 16, iniciales: 'PF', avatarClass: 'avatar-teal', nombre: 'Paredes Figueroa, Natalia', codigo: '2026104388', correo: 'a2026104388@uwiener.edu.pe', promedio: '10.6', asistencia: '65%' },
    { num: 17, iniciales: 'QC', avatarClass: 'avatar-sky', nombre: 'Quispe Castro, Fabricio', codigo: '2026104389', correo: 'a2026104389@uwiener.edu.pe', promedio: '11.3', asistencia: '77%' },
    { num: 18, iniciales: 'RS', avatarClass: 'avatar-teal', nombre: 'Ríos Silva, Daniela', codigo: '2026104390', correo: 'a2026104390@uwiener.edu.pe', promedio: '10.8', asistencia: '73%' },
    { num: 19, iniciales: 'SM', avatarClass: 'avatar-sky', nombre: 'Salazar Morales, Bruno', codigo: '2026104391', correo: 'a2026104391@uwiener.edu.pe', promedio: '11.0', asistencia: '70%' },
    { num: 20, iniciales: 'TC', avatarClass: 'avatar-teal', nombre: 'Torres Cárdenas, Adriana', codigo: '2026104392', correo: 'a2026104392@uwiener.edu.pe', promedio: '10.4', asistencia: '66%' },
    { num: 21, iniciales: 'UV', avatarClass: 'avatar-sky', nombre: 'Ugarte Vera, Leonardo', codigo: '2026104393', correo: 'a2026104393@uwiener.edu.pe', promedio: '11.5', asistencia: '80%' },
    { num: 22, iniciales: 'VP', avatarClass: 'avatar-teal', nombre: 'Vásquez Pinto, Mariana', codigo: '2026104394', correo: 'a2026104394@uwiener.edu.pe', promedio: '10.7', asistencia: '72%' },
    { num: 23, iniciales: 'WA', avatarClass: 'avatar-sky', nombre: 'Wong Alarcón, Kevin', codigo: '2026104395', correo: 'a2026104395@uwiener.edu.pe', promedio: '11.2', asistencia: '75%' },
    { num: 24, iniciales: 'YB', avatarClass: 'avatar-teal', nombre: 'Yáñez Bustamante, Patricia', codigo: '2026104396', correo: 'a2026104396@uwiener.edu.pe', promedio: '10.9', asistencia: '71%' },
    { num: 25, iniciales: 'ZC', avatarClass: 'avatar-sky', nombre: 'Zamora Cruz, Fernando', codigo: '2026104397', correo: 'a2026104397@uwiener.edu.pe', promedio: '11.1', asistencia: '74%' },
    { num: 26, iniciales: 'AR', avatarClass: 'avatar-teal', nombre: 'Aguilar Rojas, Sofía', codigo: '2026104398', correo: 'a2026104398@uwiener.edu.pe', promedio: '10.5', asistencia: '68%' },
    { num: 27, iniciales: 'BL', avatarClass: 'avatar-sky', nombre: 'Barrios Luna, Cristian', codigo: '2026104399', correo: 'a2026104399@uwiener.edu.pe', promedio: '11.4', asistencia: '77%' },
    { num: 28, iniciales: 'CM', avatarClass: 'avatar-teal', nombre: 'Cabrera Miranda, Lucía', codigo: '2026104400', correo: 'a2026104400@uwiener.edu.pe', promedio: '10.6', asistencia: '69%' },
    { num: 29, iniciales: 'DP', avatarClass: 'avatar-sky', nombre: 'Dávila Prado, Enrique', codigo: '2026104401', correo: 'a2026104401@uwiener.edu.pe', promedio: '11.0', asistencia: '73%' },
    { num: 30, iniciales: 'ES', avatarClass: 'avatar-teal', nombre: 'Escobar Soto, Jimena', codigo: '2026104402', correo: 'a2026104402@uwiener.edu.pe', promedio: '10.8', asistencia: '70%' },
    { num: 31, iniciales: 'FR', avatarClass: 'avatar-sky', nombre: 'Fuentes Rivas, Andrés', codigo: '2026104403', correo: 'a2026104403@uwiener.edu.pe', promedio: '11.3', asistencia: '78%' },
    { num: 32, iniciales: 'GT', avatarClass: 'avatar-teal', nombre: 'Guerrero Tejada, Brenda', codigo: '2026104404', correo: 'a2026104404@uwiener.edu.pe', promedio: '10.4', asistencia: '66%' },
    { num: 33, iniciales: 'HM', avatarClass: 'avatar-sky', nombre: 'Hidalgo Montoya, César', codigo: '2026104405', correo: 'a2026104405@uwiener.edu.pe', promedio: '11.2', asistencia: '75%' },
    { num: 34, iniciales: 'IP', avatarClass: 'avatar-teal', nombre: 'Infante Pinedo, Melissa', codigo: '2026104406', correo: 'a2026104406@uwiener.edu.pe', promedio: '10.7', asistencia: '72%' },
    { num: 35, iniciales: 'JV', avatarClass: 'avatar-sky', nombre: 'Juárez Valdivia, Daniel', codigo: '2026104407', correo: 'a2026104407@uwiener.edu.pe', promedio: '11.1', asistencia: '74%' }
  ];

  let currentLimit = 8;

  // Referencias DOM
  const tableBody = document.getElementById('tercerAlumnosBody');
  const countDisplay = document.getElementById('tercerCountDisplay');
  const tableInfoText = document.getElementById('tercerTableInfoText');
  const btnBuscar = document.getElementById('btnBuscarTercer');
  const demoScaleBtns = document.querySelectorAll('.demo-scale-btn');

  // =========================================================================
  // 1. SELECTS FLOTANTES CON ROTACIÓN Y FLIP
  // =========================================================================
  const selectContainers = document.querySelectorAll('.custom-select-container');

  function closeAllDropdowns() {
    selectContainers.forEach(container => {
      container.classList.remove('is-open');
      const trigger = container.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
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
        // Smart Flip (si no cabe abajo, abrir hacia arriba)
        const triggerRect = trigger.getBoundingClientRect();
        const menuHeight = 220;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
          menu.classList.add('dropdown-above');
        } else {
          menu.classList.add('dropdown-below');
        }

        if (window.innerWidth - triggerRect.left < 240) {
          menu.classList.add('align-right');
        }

        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        const text = opt.querySelector('span') ? opt.querySelector('span').textContent.trim() : opt.textContent.trim();
        const val = opt.getAttribute('data-value') || text;

        if (label) label.textContent = text;
        container.setAttribute('data-current-value', val);

        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');

        actualizarEncabezadoContextual();
      });
    });
  });

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

    tableInfoText.innerHTML = `Registro de alumnos del periodo <strong>${periodo}</strong>, Sección <strong>${seccion}</strong>, para el curso <strong>${curso}, 3er Examen.</strong>`;
  }

  // =========================================================================
  // 2. RENDERIZADO DE LA TABLA
  // =========================================================================
  function renderTabla(lista) {
    if (!tableBody) return;

    tableBody.innerHTML = '';

    lista.forEach(alumno => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${alumno.num}</td>
        <td class="td-alumno">
          <div class="tercer-alumno-wrapper">
            <div class="tercer-avatar ${alumno.avatarClass}">${alumno.iniciales}</div>
            <span class="tercer-nombre">${alumno.nombre}</span>
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

  if (btnBuscar) {
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllDropdowns();
      renderTabla(tercerExamenData.slice(0, currentLimit));
    });
  }

  // =========================================================================
  // 3. SELECTOR DE SIMULACIÓN DE ESCALA (8, 25, 35 ALUMNOS)
  // =========================================================================
  demoScaleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.getAttribute('data-count'), 10);
      if (!isNaN(count)) {
        currentLimit = count;
        demoScaleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTabla(tercerExamenData.slice(0, currentLimit));
      }
    });
  });

  // Render inicial
  actualizarEncabezadoContextual();
  renderTabla(tercerExamenData.slice(0, currentLimit));
});
