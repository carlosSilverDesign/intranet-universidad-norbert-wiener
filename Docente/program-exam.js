/**
 * Programación de Exámenes - Portal Docente Universidad Norbert Wiener
 * Lógica de Tapbar (Examen Parcial / Final), Renderizado de Tabla y Selector de Periodo
 */

document.addEventListener('DOMContentLoaded', () => {
  // Datos del Rol de Exámenes Parciales (Fiel al visual adjunto)
  const examenesParciales = [
    {
      dia: 'Lunes 11 mayo',
      hora: '18:45 - 20:15',
      curso: 'AC4062 - Investigación e Innovación',
      seccion: 'AC6N1',
      aula: 'WA207',
      sede: '05',
      docente: 'Enciso Soto, R.',
      docenteApoyo: 'Silva Sanchez C.'
    },
    {
      dia: 'Lunes 11 mayo',
      hora: '18:45 - 20:15',
      curso: 'AC4062 - Investigación e Innovación',
      seccion: 'AC6N1',
      aula: 'WA207',
      sede: '01',
      docente: 'Enciso Soto, R.',
      docenteApoyo: 'Silva Sanchez C.'
    },
    {
      dia: 'Lunes 11 mayo',
      hora: '18:45 - 20:15',
      curso: 'AC4062 - Investigación e Innovación',
      seccion: 'AC6N1',
      aula: 'WA207',
      sede: '01',
      docente: 'Enciso Soto, R.',
      docenteApoyo: 'Silva Sanchez C.'
    }
  ];

  // Datos del Rol de Exámenes Finales
  const examenesFinales = [
    {
      dia: 'Lunes 06 julio',
      hora: '18:45 - 20:15',
      curso: 'AC4062 - Investigación e Innovación',
      seccion: 'AC6N1',
      aula: 'WA207',
      sede: '05',
      docente: 'Enciso Soto, R.',
      docenteApoyo: 'Silva Sanchez C.'
    },
    {
      dia: 'Lunes 06 julio',
      hora: '18:45 - 20:15',
      curso: 'AC4062 - Investigación e Innovación',
      seccion: 'AC6N1',
      aula: 'WA207',
      sede: '01',
      docente: 'Enciso Soto, R.',
      docenteApoyo: 'Silva Sanchez C.'
    },
    {
      dia: 'Miércoles 08 julio',
      hora: '20:15 - 21:45',
      curso: 'AD8021 - Informática para la Toma de Decisiones',
      seccion: 'AD2N4',
      aula: 'SVIR',
      sede: 'SVIR',
      docente: 'Asensio Peña, J.',
      docenteApoyo: 'Mendoza Castillo, A.'
    }
  ];

  // Referencias DOM
  const tableBody = document.getElementById('programExamsBody');
  const tabParcial = document.getElementById('tabParcial');
  const tabFinal = document.getElementById('tabFinal');
  const tabButtons = document.querySelectorAll('.program-tab-btn');

  let currentTab = 'parcial';

  // =========================================================================
  // 1. RENDERIZADO DE TABLA
  // =========================================================================
  function renderTabla(tipo) {
    if (!tableBody) return;

    const data = tipo === 'parcial' ? examenesParciales : examenesFinales;

    // Animación suave de transición
    tableBody.style.opacity = '0';

    setTimeout(() => {
      tableBody.innerHTML = '';

      if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td colspan="8">
            <div class="program-empty-state">
              <p>No se encontraron evaluaciones programadas para este periodo.</p>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      } else {
        data.forEach(item => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="td-dia">${item.dia}</td>
            <td class="td-hora">${item.hora}</td>
            <td class="td-curso">${item.curso}</td>
            <td class="td-seccion">${item.seccion}</td>
            <td class="td-aula">${item.aula}</td>
            <td class="td-sede">${item.sede}</td>
            <td class="td-docente">${item.docente}</td>
            <td class="td-apoyo">${item.docenteApoyo}</td>
          `;
          tableBody.appendChild(tr);
        });
      }

      tableBody.style.transition = 'opacity 0.2s ease-in-out';
      tableBody.style.opacity = '1';
    }, 120);
  }

  // =========================================================================
  // 2. TAPBAR / ALTERNAR PARCIAL Y FINAL
  // =========================================================================
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      if (type === currentTab) return;

      currentTab = type;
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderTabla(currentTab);
    });
  });

  // =========================================================================
  // 3. SELECTOR DE PERIODO FLOTANTE CON ROTACIÓN Y SMART FLIP
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
        const menuHeight = 200;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        menu.classList.remove('dropdown-above', 'dropdown-below', 'align-right');

        if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
          menu.classList.add('dropdown-above');
        } else {
          menu.classList.add('dropdown-below');
        }

        if (window.innerWidth - triggerRect.left < 160) {
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

        // Al cambiar de periodo refrescar datos
        renderTabla(currentTab);
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

  // Render inicial
  renderTabla('parcial');
});
