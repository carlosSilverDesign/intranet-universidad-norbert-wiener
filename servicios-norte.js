document.addEventListener('DOMContentLoaded', () => {
  console.log('Sección Servicios Lima Norte cargada correctamente.');

  // Base de datos de sub-secciones de Servicios Lima Norte
  const serviciosData = {
    "biblioteca": {
      "title": "Biblioteca",
      "subtitle": "Acceso a colecciones físicas y recursos digitales de la universidad",
      "icon": "img/biblioteca.svg",
      "type": "list",
      "items": [
        {
          "title": "Libros y préstamos",
          "desc": "Busca libros físicos en el Catálogo en Línea. Inicia sesión y realiza tus préstamos en línea.",
          "link": "https://biblioteca.uwiener.edu.pe/",
          "linkText": "Catálogo en Línea"
        },
        {
          "title": "Biblioteca Virtual",
          "desc": "Accede a libros electrónicos, bases de datos y recursos académicos especializados desde cualquier lugar.",
          "link": "https://uwiener.basedatos.metaproxy.org/subjects/databases.php",
          "linkText": "Acceder a Biblioteca Virtual"
        },
        {
          "title": "Cubículos de estudios",
          "desc": "Revisa los pasos a seguir para reservar y utilizar un cubículo para tus trabajos grupales.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=24",
          "linkText": "Guía de Reserva"
        },
        {
          "title": "Uso de computadoras",
          "desc": "Consulta la disponibilidad de equipos tecnológicos y salas en la biblioteca de la sede.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=20",
          "linkText": "Consultar Disponibilidad"
        },
        {
          "title": "Libros nuevos",
          "desc": "Descubre las últimas adquisiciones bibliográficas y nuevos recursos integrados a la colección.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=21",
          "linkText": "Nuevas Adquisiciones"
        },
        {
          "title": "Capacitaciones y Tutoriales",
          "desc": "Participa en talleres y revisa tutoriales diseñados para optimizar el uso de los recursos de investigación.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=15",
          "linkText": "Ver Talleres"
        },
        {
          "title": "Biblioteca y contacto",
          "desc": "Conoce los horarios de atención y la ubicación exacta de la biblioteca de nuestra sede.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=17",
          "linkText": "Ubicación y Horarios"
        }
      ]
    },
    "tutorias": {
      "title": "Tutorías y Acompañamiento",
      "subtitle": "Apoyo académico y tutorías personalizadas para tu adaptación estudiantil",
      "icon": "img/tutoria.svg",
      "type": "list",
      "items": [
        {
          "title": "Conócenos (Programa PADE)",
          "desc": "El Programa de Acompañamiento y Desarrollo Académico (PADE) te acompaña en tu adaptación a la vida universitaria y potencia tu rendimiento académico. Con él podrás:<br><br>• Recibir guía personalizada de tu tutor designado.<br>• Fortalecer tus estrategias de organización y hábitos de estudio.<br>• Identificar oportunidades de mejora académica.<br>• Conocer los recursos de apoyo institucional.<br>• Tener un seguimiento oportuno ante dificultades.",
          "link": null,
          "linkText": null
        },
        {
          "title": "Inscripción Taller de Nivelación (Virtual)",
          "desc": "Participa en las sesiones de nivelación y talleres complementarios en modalidad virtual para potenciar tus conocimientos básicos.",
          "link": "https://forms.cloud.microsoft/r/zeEtkx5n32",
          "linkText": "Registrarme en el Taller"
        },
        {
          "title": "Contáctanos",
          "desc": "Estamos aquí para guiarte en todo momento. Comunícate a través de nuestros canales:<br><br>• <strong>Correo:</strong> acompanamientoestudiantil@uwiener.edu.pe<br>• <strong>Presencial:</strong> Oficina de Acompañamiento Estudiantil (📍 Sede Lima Norte: 2.º piso, al costado de PAE).<br>• <strong>Horario:</strong> Lunes a viernes de 9:00 a. m. a 6:00 p. m.",
          "link": "mailto:acompanamientoestudiantil@uwiener.edu.pe",
          "linkText": "Enviar Correo"
        }
      ]
    },
    "bvu": {
      "title": "Bienestar y Vida Universitaria",
      "subtitle": "Dirección dedicada a promover la salud, el arte, el deporte y el bienestar mental",
      "icon": "img/servicio social.svg",
      "type": "tabs",
      "tabs": [
        {
          "id": "medicos",
          "title": "Servicios Médicos",
          "icon": "img/servicios medicos.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Contamos con un staff calificado de profesionales de la salud para la atención oportuna de urgencias y emergencias:</p>
              <ul class="bvu-list">
                <li>Médicos Emergencistas</li>
                <li>Licenciadas de Enfermería habilitadas (con certificación en Soporte Vital Básico)</li>
                <li>Técnicos de enfermería entrenados en urgencias</li>
              </ul>
              
              <div class="bvu-info-block">
                <h4>Gestiones del área</h4>
                <p>Brindamos orientación en salud, prevención y seguimiento de casos, así como la gestión y orientación del seguro contra accidentes personales para estudiantes de pregrado.</p>
              </div>

              <div class="bvu-contact-box">
                <h4>Canales y Horarios</h4>
                <p><strong>Correo:</strong> servicios.medicos@uwiener.edu.pe</p>
                <p><strong>Ubicación:</strong> Tópico Sede Lima Norte (Local 6) – Piso 1</p>
                <p><strong>Atención:</strong> Lunes a Sábado de 7:00 a. m. a 11:00 p. m.</p>
              </div>
            </div>
          `
        },
        {
          "id": "cultura",
          "title": "Cultura y Talleres",
          "icon": "img/talleres artisiticos y deprotivos.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Fomentamos el desarrollo artístico de nuestros estudiantes de manera opcional e inscripción gratuita:</p>
              
              <div class="bvu-info-block">
                <h4>Talleres Artísticos (Sede Lima Norte - Local 6)</h4>
                <ul class="bvu-list">
                  <li><strong>Expresión Corporal:</strong> Baile moderno, clown, caporales, danzas afroperuanas, danzas folclóricas y teatro.</li>
                  <li><strong>Expresión Musical:</strong> Canto.</li>
                </ul>
              </div>

              <div class="bvu-info-block">
                <h4>Programas y Eventos</h4>
                <ul class="bvu-list">
                  <li><strong>Break Time:</strong> Actividades de integración (Baila conmigo, cine, karaoke, etc.).</li>
                  <li><strong>Semana Universitaria:</strong> Campeonatos, barras, gincanas y concurso de danzas.</li>
                  <li><strong>Red de Elencos (REAW):</strong> Participa en elencos como Cajón Peruano, Marinera, Teatro, Tuna, Música y Danzas.</li>
                </ul>
              </div>

              <div class="bvu-contact-box">
                <h4>Canales y Contacto</h4>
                <p><strong>Correo:</strong> vida.wiener@uwiener.edu.pe</p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/51994612443" target="_blank">994 612 443</a></p>
                <p><strong>Ubicación:</strong> Torre A, Piso 2 - Dentro de PAE (Lima Norte)</p>
                <p><strong>Atención:</strong> Lunes a Viernes de 9:00 a. m. a 6:00 p. m.</p>
              </div>
            </div>
          `
        },
        {
          "id": "deporte",
          "title": "Deportes",
          "icon": "img/talleres artisiticos y deprotivos.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Promovemos la integración y los hábitos de vida saludable en la comunidad estudiantil:</p>
              
              <div class="bvu-info-block">
                <h4>Talleres Deportivos (Sede Lima Norte - Local 6)</h4>
                <p>Futsal (damas y varones), karate, tenis de mesa, voleibol mixto y ajedrez.</p>
              </div>

              <div class="bvu-info-block">
                <h4>Selecciones Oficiales</h4>
                <p>Convocatorias para representar a la universidad en: básquetbol, futsal, karate, taekwondo, tenis de mesa, voleibol, judo y ajedrez.</p>
              </div>

              <div class="bvu-info-block">
                <h4>Competiciones</h4>
                <p>Participa en el Campeonato Intercachimbos, Interfacultades y en la FEDUP Liga Universitaria.</p>
              </div>

              <div class="bvu-contact-box">
                <h4>Canales y Contacto</h4>
                <p><strong>Correo:</strong> deportes@uwiener.edu.pe</p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/51920335396" target="_blank">920 335 396</a></p>
                <p><strong>Ubicación:</strong> Torre A, Piso 2 - Dentro de PAE (Lima Norte)</p>
                <p><strong>Atención:</strong> Lunes a Viernes de 9:00 a. m. a 6:00 p. m.</p>
              </div>
            </div>
          `
        },
        {
          "id": "psicologia",
          "title": "Psicopedagogía",
          "icon": "img/servicio psicopedagogico.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Brindamos orientación integral individual y grupal para potenciar tu salud mental y desempeño académico:</p>
              
              <div class="bvu-info-block">
                <h4>Servicios Disponibles</h4>
                <ul class="bvu-list">
                  <li>Evaluación psicopedagógica y consejería psicológica individual.</li>
                  <li>Charlas preventivas y campañas de salud mental.</li>
                  <li>Acompañamiento psicopedagógico grupal.</li>
                </ul>
              </div>

              <div class="bvu-contact-box">
                <h4>Canales y Contacto</h4>
                <p><strong>Correo:</strong> servicios.psicopedagogicos@uwiener.edu.pe</p>
                <p><strong>Contacto:</strong> 937 648 479 / 937 648 075</p>
                <p><strong>Atención Lima Norte:</strong> Martes y Jueves de 10:00 a. m. a 6:00 p. m., y Sábados de 8:00 a. m. a 1:00 p. m. (Modalidad Virtual)</p>
              </div>
            </div>
          `
        }
      ]
    },
    "empleabilidad": {
      "title": "Empleabilidad y Alumni",
      "subtitle": "Impulsa tu desarrollo laboral, postula a vacantes e inicia tus trámites de prácticas",
      "icon": "img/empleabilidad.svg",
      "type": "list",
      "items": [
        {
          "title": "Bolsa Laboral Wiener",
          "desc": "Accede al portal institucional para buscar y postular a ofertas de prácticas y empleo alineadas a tu perfil.",
          "link": "https://bolsalaboral.uwiener.edu.pe/",
          "linkText": "Ingresar a la Bolsa Laboral"
        },
        {
          "title": "CV y Asesoría Laboral",
          "desc": "Solicita orientación personalizada para estructurar tu currículum vitae y prepararte para entrevistas laborales exitosas.",
          "link": "https://forms.gle/Xo7JzBnJCT7c42QKA",
          "linkText": "Agendar Asesoría"
        },
        {
          "title": "Trámite para prácticas",
          "desc": "Inicia la gestión de convenios, cartas de presentación y acreditaciones de tus prácticas pre-profesionales y profesionales.",
          "link": "https://forms.gle/czrpWjEtbtNeTEHC7",
          "linkText": "Iniciar Trámite"
        },
        {
          "title": "Agenda de Actividades",
          "desc": "Participa en las ferias laborales, talleres prácticos de empleabilidad y webinars de desarrollo corporativo.",
          "link": "https://bolsalaboral.uwiener.edu.pe/agenda/eventos",
          "linkText": "Ver Calendario"
        },
        {
          "title": "Ceremonia de Egresados y Comunidad Alumni",
          "desc": "Conéctate con la red de egresados de la universidad y entérate de las actividades institucionales dedicadas a nuestra comunidad alumni.",
          "link": "https://forms.gle/NusZLpieJA9Dqte99",
          "linkText": "Registrarme en la Comunidad"
        },
        {
          "title": "Contáctanos",
          "desc": "Escríbenos directamente a través de WhatsApp para recibir orientación rápida sobre bolsa laboral o prácticas.",
          "link": "https://wa.link/1wcues",
          "linkText": "WhatsApp Empleabilidad"
        }
      ]
    }
  };

  // Referencias a elementos del DOM
  const cards = document.querySelectorAll('.servicios-card');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerContainer = document.getElementById('drawerContainer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerHeaderIcon = document.getElementById('drawerHeaderIcon');
  const drawerBody = document.getElementById('drawerBody');

  // Función para abrir el panel
  function openDrawer(serviceKey) {
    const data = serviciosData[serviceKey];
    if (!data) return;

    // Configurar cabecera
    drawerTitle.textContent = data.title;
    drawerHeaderIcon.src = data.icon;
    drawerHeaderIcon.alt = data.title;
    drawerHeaderIcon.style.display = data.icon ? 'block' : 'none';

    // Generar cuerpo dinámico
    drawerBody.innerHTML = '';
    
    if (data.type === 'list') {
      const listWrapper = document.createElement('div');
      listWrapper.className = 'drawer-list-wrapper';

      data.items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'drawer-sub-card';
        
        let linkHTML = '';
        if (item.link) {
          linkHTML = `
            <a href="${item.link}" target="_blank" class="drawer-action-btn">
              <span>${item.linkText || 'Ir al sitio'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          `;
        }

        itemCard.innerHTML = `
          <div class="sub-card-header">
            <h4 class="sub-card-title">${item.title}</h4>
          </div>
          <p class="sub-card-desc">${item.desc}</p>
          ${linkHTML}
        `;
        listWrapper.appendChild(itemCard);
      });
      drawerBody.appendChild(listWrapper);
    } else if (data.type === 'tabs') {
      // Estructura de pestañas para Bienestar y Vida Universitaria
      const tabsWrapper = document.createElement('div');
      tabsWrapper.className = 'drawer-tabs-wrapper';

      // Header de pestañas (scrollable horizontal)
      const tabsHeader = document.createElement('div');
      tabsHeader.className = 'drawer-tabs-header';
      
      // Contenedor de contenido
      const tabsContentWrapper = document.createElement('div');
      tabsContentWrapper.className = 'drawer-tabs-content-wrapper';

      data.tabs.forEach((tab, index) => {
        // Botón de pestaña
        const tabBtn = document.createElement('button');
        tabBtn.className = `tab-nav-btn ${index === 0 ? 'active' : ''}`;
        tabBtn.setAttribute('data-tab-id', tab.id);
        tabBtn.innerHTML = `
          <img src="${tab.icon}" class="tab-btn-icon" alt="${tab.title}">
          <span>${tab.title}</span>
        `;

        // Pane de contenido de pestaña
        const tabPane = document.createElement('div');
        tabPane.className = `tab-content-pane ${index === 0 ? 'active' : ''}`;
        tabPane.id = `pane-${tab.id}`;
        tabPane.innerHTML = tab.content;

        // Añadir listeners de click a las pestañas
        tabBtn.addEventListener('click', () => {
          // Desactivar todos los botones e indicar activo el actual
          tabsHeader.querySelectorAll('.tab-nav-btn').forEach(btn => btn.classList.remove('active'));
          tabBtn.classList.add('active');

          // Desactivar todos los paneles de contenido y activar el actual
          tabsContentWrapper.querySelectorAll('.tab-content-pane').forEach(pane => pane.classList.remove('active'));
          tabPane.classList.add('active');
        });

        tabsHeader.appendChild(tabBtn);
        tabsContentWrapper.appendChild(tabPane);
      });

      tabsWrapper.appendChild(tabsHeader);
      tabsWrapper.appendChild(tabsContentWrapper);
      drawerBody.appendChild(tabsWrapper);
    }

    // Activar cajón y overlay con animaciones CSS
    drawerOverlay.classList.add('active');
    drawerContainer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Detener scroll en el fondo
  }

  // Función para cerrar el panel
  function closeDrawer() {
    drawerOverlay.classList.remove('active');
    drawerContainer.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
  }

  // Event Listeners para las tarjetas de servicios principales
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = card.getAttribute('data-service-key');
      
      // Aplicar micro-animación de click
      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.style.transform = '';
        if (serviceKey) {
          openDrawer(serviceKey);
        }
      }, 120);
    });
  });

  // Event Listeners de Cierre
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      // Cerrar solo si hace click directo en la máscara/fondo exterior
      if (e.target === drawerOverlay) {
        closeDrawer();
      }
    });
  }

  // Tecla Escape para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerOverlay.classList.contains('active')) {
      closeDrawer();
    }
  });
});
