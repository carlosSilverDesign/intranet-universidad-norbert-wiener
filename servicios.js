document.addEventListener('DOMContentLoaded', () => {
  console.log('Sección Servicios cargada correctamente.');

  // Base de datos de servicios para Perfil Alumno
  const serviciosData = {
    "tramites": {
      "title": "Trámites",
      "subtitle": "Gestión de solicitudes académicas y administrativas en línea",
      "icon": "img/tramites.svg",
      "type": "list",
      "items": [
        {
          "title": "Trámites Académicos",
          "desc": "Solicitud de certificados de estudios, constancias de matrícula, récord de notas y rectificación de notas.",
          "link": "https://intranet.uwiener.edu.pe/",
          "linkText": "Iniciar Solicitud"
        },
        {
          "title": "Carné Universitario",
          "desc": "Conoce el estado del trámite y las fechas de entrega oficial del carné universitario expedido por SUNEDU.",
          "link": "https://www.uwiener.edu.pe/",
          "linkText": "Consultar Estado"
        },
        {
          "title": "Reserva y Retiro de Matrícula",
          "desc": "Gestiona la reserva temporal de tu matrícula o el retiro de asignaturas dentro de los plazos reglamentarios.",
          "link": "https://intranet.uwiener.edu.pe/",
          "linkText": "Ver Requisitos"
        }
      ]
    },
    "pae": {
      "title": "Plataforma de Atención al Estudiante (PAE)",
      "subtitle": "Canal centralizado de orientación, consultas y soporte al estudiante",
      "icon": "img/contacto.svg",
      "type": "list",
      "items": [
        {
          "title": "Atención al Estudiante en Línea",
          "desc": "Ingresa tus consultas y requerimientos mediante nuestro sistema de tickets para un seguimiento personalizado.",
          "link": "https://uwiener.pe/pae",
          "linkText": "Ingresar a PAE"
        },
        {
          "title": "Canales Digitales y WhatsApp",
          "desc": "Comunícate directamente con nuestros asesores de atención en línea para resolver tus dudas de manera ágil.",
          "link": "https://wa.me/51994612443",
          "linkText": "Chatear por WhatsApp"
        }
      ]
    },
    "biblioteca": {
      "title": "Biblioteca",
      "subtitle": "Acceso a colecciones físicas y recursos digitales de la universidad",
      "icon": "img/biblioteca.svg",
      "type": "list",
      "items": [
        {
          "title": "Catálogo en Línea y Préstamos",
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
          "title": "Cubículos de estudio",
          "desc": "Revisa los pasos a seguir para reservar y utilizar un cubículo para tus trabajos grupales.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=24",
          "linkText": "Guía de Reserva"
        },
        {
          "title": "Capacitaciones y Tutoriales",
          "desc": "Participa en talleres y revisa tutoriales diseñados para optimizar el uso de los recursos de investigación.",
          "link": "https://biblioteca.uwiener.edu.pe/cgi-bin/koha/opac-page.pl?page_id=15",
          "linkText": "Ver Talleres"
        }
      ]
    },
    "noticias": {
      "title": "Noticias y Eventos",
      "subtitle": "Entérate de las actividades institucionales, conferencias y vida universitaria",
      "icon": "img/noticias y eventos.svg",
      "type": "list",
      "items": [
        {
          "title": "Agenda y Eventos Académicos",
          "desc": "Revisa el calendario de congresos, conferencias magistrales, talleres y webinars disponibles este mes.",
          "link": "https://www.uwiener.edu.pe/eventos/",
          "linkText": "Ver Agenda"
        },
        {
          "title": "Noticias Wiener",
          "desc": "Descubre los logros de nuestra comunidad docente y estudiantil, convenios y comunicados institucionales.",
          "link": "https://www.uwiener.edu.pe/noticias/",
          "linkText": "Leer Noticias"
        }
      ]
    },
    "wiener-campus": {
      "title": "Wiener Campus",
      "subtitle": "Plataforma educativa y aula virtual de aprendizaje",
      "icon": "img/Wiener campus.svg",
      "type": "list",
      "items": [
        {
          "title": "Aula Virtual Blackboard Learn",
          "desc": "Accede a tus asignaturas matriculadas, materiales de clase, foros y entrega de tareas académicas.",
          "link": "https://uwiener.blackboard.com/",
          "linkText": "Ingresar a Blackboard"
        },
        {
          "title": "Manuales y Soporte de Campus",
          "desc": "Encuentra tutoriales de uso del entorno virtual y canales de asistencia técnica para estudiantes.",
          "link": "https://www.uwiener.edu.pe/",
          "linkText": "Guías de Soporte"
        }
      ]
    },
    "dbu": {
      "title": "Dirección de Bienestar Universitario",
      "subtitle": "Promoción de la salud integral, deportes, arte y acompañamiento psicopedagógico",
      "icon": "img/servicio social.svg",
      "type": "tabs",
      "tabs": [
        {
          "id": "medicos-sede",
          "title": "Servicios Médicos",
          "icon": "img/servicios medicos.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Contamos con un staff calificado de profesionales de la salud para la atención oportuna de urgencias y emergencias:</p>
              <ul class="bvu-list">
                <li>Médicos Emergencistas</li>
                <li>Licenciadas de Enfermería habilitadas</li>
                <li>Técnicos de enfermería entrenados en urgencias</li>
              </ul>
              
              <div class="bvu-info-block">
                <h4>Gestiones del área</h4>
                <p>Brindamos orientación en salud, prevención y seguimiento de casos, así como la orientación del seguro contra accidentes para estudiantes de pregrado.</p>
              </div>

              <div class="bvu-contact-box">
                <h4>Canales y Horarios</h4>
                <p><strong>Correo:</strong> servicios.medicos@uwiener.edu.pe</p>
                <p><strong>Atención:</strong> Lunes a Sábado de 7:00 a. m. a 11:00 p. m.</p>
              </div>
            </div>
          `
        },
        {
          "id": "cultura-sede",
          "title": "Cultura y Deportes",
          "icon": "img/talleres artisiticos y deprotivos.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Fomentamos el desarrollo artístico y la actividad física de nuestros estudiantes con inscripción gratuita:</p>
              <div class="bvu-info-block">
                <h4>Talleres y Elencos</h4>
                <p>Baile moderno, teatro, marinera, canto, futsal, vóley, ajedrez y tenis de mesa.</p>
              </div>
              <div class="bvu-contact-box">
                <h4>Contacto</h4>
                <p><strong>Correo:</strong> vida.wiener@uwiener.edu.pe</p>
                <p><strong>Atención:</strong> Lunes a Viernes de 9:00 a. m. a 6:00 p. m.</p>
              </div>
            </div>
          `
        },
        {
          "id": "psico-sede",
          "title": "Psicopedagogía",
          "icon": "img/servicio psicopedagogico.svg",
          "content": `
            <div class="bvu-section-content">
              <p class="bvu-intro">Brindamos orientación integral y consejería para potenciar tu salud mental y desempeño académico:</p>
              <div class="bvu-info-block">
                <h4>Servicios</h4>
                <ul class="bvu-list">
                  <li>Evaluación psicopedagógica y consejería psicológica individual.</li>
                  <li>Charlas preventivas y campañas de salud mental.</li>
                </ul>
              </div>
              <div class="bvu-contact-box">
                <h4>Contacto</h4>
                <p><strong>Correo:</strong> servicios.psicopedagogicos@uwiener.edu.pe</p>
              </div>
            </div>
          `
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
          "desc": "El Programa de Acompañamiento y Desarrollo Académico (PADE) te acompaña en tu adaptación a la vida universitaria y potencia tu rendimiento académico.",
          "link": null,
          "linkText": null
        },
        {
          "title": "Inscripción Taller de Nivelación",
          "desc": "Participa en las sesiones de nivelación y talleres complementarios en modalidad virtual para potenciar tus conocimientos básicos.",
          "link": "https://forms.cloud.microsoft/r/zeEtkx5n32",
          "linkText": "Registrarme en el Taller"
        },
        {
          "title": "Contacto de Acompañamiento",
          "desc": "Escríbenos para agendar una sesión con tu tutor asignado.",
          "link": "mailto:acompanamientoestudiantil@uwiener.edu.pe",
          "linkText": "Enviar Correo"
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
        }
      ]
    },
    "seguro-universitario": {
      "title": "Seguro Universitario",
      "subtitle": "Póliza contra accidentes, red de clínicas y trámite de exoneración",
      "icon": "img/servicios medicos.svg",
      "type": "custom",
      "content": `
        <div class="seguro-container">
          <div class="seguro-date">Lunes 14 de Septiembre del 2026, 02:38:32 pm</div>
          <p class="seguro-greeting">Estimado estudiante,</p>
          <p class="seguro-text">
            Le informamos que en conformidad a los artículos 126 y 128 de la Ley Universitaria N° 30220, <strong>TODOS LOS ESTUDIANTES DEBEN CONTAR CON UN SEGURO DE SALUD.</strong> La Universidad Norbert Wiener brinda la afiliación a un seguro universitario con un costo semestral de S/40 soles; pago que se divide en 4 cuotas y se realizará a partir de su segunda pensión.
          </p>

          <div class="seguro-docs-section">
            <h4 class="seguro-docs-title">DOCUMENTOS IMPORTANTES:</h4>
            <ul class="seguro-docs-list">
              <li>
                <a href="https://test-intranet.uwiener.edu.pe/Alumno/DSU/Seguro_Universitario_Condicionados_Clausulas_v3.pdf" target="_blank" class="seguro-pdf-link">
                  <span>Condicionados y Clausulas</span>
                  <svg class="seguro-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://test-intranet.uwiener.edu.pe/Alumno/DSU/Lista_de_asegurados_2025-1.pdf" target="_blank" class="seguro-pdf-link">
                  <span>Lista de Asegurados 2025 - I</span>
                  <svg class="seguro-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://test-intranet.uwiener.edu.pe/Alumno/DSU/Procedimiento_Red_de_clinicas_202604.pdf" target="_blank" class="seguro-pdf-link">
                  <span>Procedimiento y Red de Clínicas</span>
                  <svg class="seguro-pdf-icon" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <p class="seguro-text">
            Si cuentas con un seguro de salud (SIS, ESSALUD, EPS, FFAA), y no deseas el seguro complementario contra accidentes (seguro universitario) puede realizar su <strong>TRAMITE DE EXONERACIÓN</strong> en las fechas según <strong>EL CALENDARIO ACADÉMICO</strong>, cumpliendo con la declaración del seguro de salud con su respectivo sustento.
          </p>

          <div class="seguro-actions">
            <button type="button" class="btn-exonerar-aqui" id="btnExonerarme">EXONERARME AQUÍ</button>
            <button type="button" class="btn-omitir-seguro" id="btnOmitirSeguro">OMITIR</button>
          </div>

          <div class="seguro-informes">
            <h4>INFORMES</h4>
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span><strong>Correo:</strong> <a href="mailto:servicios.medicos@uwiener.edu.pe">servicios.medicos@uwiener.edu.pe</a></span>
            </p>
          </div>
        </div>
      `
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

  // Referencias del Modal
  const modalExoneracion = document.getElementById('modalExoneracion');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const formDeclaracionSeguro = document.getElementById('formDeclaracionSeguro');

  // Función para abrir el panel drawer
  function openDrawer(serviceKey) {
    const data = serviciosData[serviceKey];
    if (!data) return;

    // Configurar cabecera
    if (drawerTitle) drawerTitle.textContent = data.title;
    if (drawerHeaderIcon) {
      drawerHeaderIcon.src = data.icon;
      drawerHeaderIcon.alt = data.title;
      drawerHeaderIcon.style.display = data.icon ? 'block' : 'none';
    }

    // Generar cuerpo dinámico
    if (drawerBody) {
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
        // Estructura de pestañas
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
            tabsHeader.querySelectorAll('.tab-nav-btn').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');

            tabsContentWrapper.querySelectorAll('.tab-content-pane').forEach(pane => pane.classList.remove('active'));
            tabPane.classList.add('active');
          });

          tabsHeader.appendChild(tabBtn);
          tabsContentWrapper.appendChild(tabPane);
        });

        tabsWrapper.appendChild(tabsHeader);
        tabsWrapper.appendChild(tabsContentWrapper);
        drawerBody.appendChild(tabsWrapper);
      } else if (data.type === 'custom') {
        // Contenido personalizado HTML (Seguro Universitario)
        drawerBody.innerHTML = data.content;

        // Asignar eventos de los botones del Seguro
        const btnExonerarme = document.getElementById('btnExonerarme');
        const btnOmitirSeguro = document.getElementById('btnOmitirSeguro');

        if (btnExonerarme) {
          btnExonerarme.addEventListener('click', () => {
            openModalExoneracion();
          });
        }

        if (btnOmitirSeguro) {
          btnOmitirSeguro.addEventListener('click', () => {
            closeDrawer();
          });
        }
      }
    }

    // Activar cajón y overlay con animaciones CSS
    if (drawerOverlay && drawerContainer) {
      drawerOverlay.classList.add('active');
      drawerContainer.classList.add('active');
      document.body.style.overflow = 'hidden'; // Detener scroll en el fondo
    }
  }

  // Función para cerrar el panel
  function closeDrawer() {
    if (drawerOverlay && drawerContainer) {
      drawerOverlay.classList.remove('active');
      drawerContainer.classList.remove('active');
    }
    if (!modalExoneracion || !modalExoneracion.classList.contains('active')) {
      document.body.style.overflow = ''; // Restaurar scroll si no hay modal abierto
    }
  }

  // Funciones del Modal de Exoneración
  function openModalExoneracion() {
    if (!modalExoneracion) return;
    modalExoneracion.classList.add('active');
    modalExoneracion.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModalExoneracion() {
    if (!modalExoneracion) return;
    modalExoneracion.classList.remove('active');
    modalExoneracion.setAttribute('aria-hidden', 'true');
    if (!drawerOverlay || !drawerOverlay.classList.contains('active')) {
      document.body.style.overflow = '';
    }
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

  // Event Listeners de Cierre de Drawer
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        closeDrawer();
      }
    });
  }

  // Botón Cancelar del Modal de Exoneración
  const btnCancelExoneracion = document.getElementById('btnCancelExoneracion');
  if (btnCancelExoneracion) {
    btnCancelExoneracion.addEventListener('click', closeModalExoneracion);
  }

  // Reactividad en inputs de subida de archivos (DNI y Seguro)
  const fileDniDoc = document.getElementById('fileDniDoc');
  const dniFileStatus = document.getElementById('dniFileStatus');
  const cardUploadDni = document.getElementById('cardUploadDni');

  if (fileDniDoc && dniFileStatus) {
    fileDniDoc.addEventListener('change', () => {
      if (fileDniDoc.files && fileDniDoc.files.length > 0) {
        const file = fileDniDoc.files[0];
        const sizeKb = (file.size / 1024).toFixed(1);
        
        if (file.size > 250 * 1024) {
          alert(`El archivo seleccionado supera el límite permitido de 250 KB (tamaño actual: ${sizeKb} KB).`);
          fileDniDoc.value = '';
          dniFileStatus.textContent = 'Ningún archivo seleccionado';
          dniFileStatus.classList.remove('selected');
          if (cardUploadDni) cardUploadDni.classList.remove('has-file');
          return;
        }

        dniFileStatus.textContent = `✓ ${file.name} (${sizeKb} KB)`;
        dniFileStatus.classList.add('selected');
        if (cardUploadDni) cardUploadDni.classList.add('has-file');
      } else {
        dniFileStatus.textContent = 'Ningún archivo seleccionado';
        dniFileStatus.classList.remove('selected');
        if (cardUploadDni) cardUploadDni.classList.remove('has-file');
      }
    });
  }

  const fileSeguroDoc = document.getElementById('fileSeguroDoc');
  const seguroFileStatus = document.getElementById('seguroFileStatus');
  const cardUploadSeguro = document.getElementById('cardUploadSeguro');

  if (fileSeguroDoc && seguroFileStatus) {
    fileSeguroDoc.addEventListener('change', () => {
      if (fileSeguroDoc.files && fileSeguroDoc.files.length > 0) {
        const file = fileSeguroDoc.files[0];
        const sizeKb = (file.size / 1024).toFixed(1);
        
        if (file.size > 250 * 1024) {
          alert(`El archivo seleccionado supera el límite permitido de 250 KB (tamaño actual: ${sizeKb} KB).`);
          fileSeguroDoc.value = '';
          seguroFileStatus.textContent = 'Ningún archivo seleccionado';
          seguroFileStatus.classList.remove('selected');
          if (cardUploadSeguro) cardUploadSeguro.classList.remove('has-file');
          return;
        }

        seguroFileStatus.textContent = `✓ ${file.name} (${sizeKb} KB)`;
        seguroFileStatus.classList.add('selected');
        if (cardUploadSeguro) cardUploadSeguro.classList.add('has-file');
      } else {
        seguroFileStatus.textContent = 'Ningún archivo seleccionado';
        seguroFileStatus.classList.remove('selected');
        if (cardUploadSeguro) cardUploadSeguro.classList.remove('has-file');
      }
    });
  }

  // Event Listeners del Modal de Exoneración
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModalExoneracion);
  }

  if (modalExoneracion) {
    modalExoneracion.addEventListener('click', (e) => {
      if (e.target === modalExoneracion) {
        closeModalExoneracion();
      }
    });
  }

  // Envío del formulario de exoneración
  if (formDeclaracionSeguro) {
    formDeclaracionSeguro.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fileDni = document.getElementById('fileDniDoc');
      const fileSeguro = document.getElementById('fileSeguroDoc');
      const tipoSeguro = document.getElementById('selectTipoSeguro');
      const tel = document.getElementById('inputEmergenciaNumero');
      const parentesco = document.getElementById('inputEmergenciaParentesco');
      const nombres = document.getElementById('inputEmergenciaNombres');

      // Validaciones
      if (!fileDni.files.length) {
        alert('Por favor adjunte la copia de su DNI (dni.pdf).');
        fileDni.focus();
        return;
      }

      if (!fileSeguro.files.length) {
        alert('Por favor adjunte el documento que acredite contar con Seguro de Salud (seguro.pdf).');
        fileSeguro.focus();
        return;
      }

      if (!tipoSeguro.value) {
        alert('Por favor seleccione el Tipo de Seguro de Salud.');
        tipoSeguro.focus();
        return;
      }

      if (!tel.value.trim() || !parentesco.value.trim() || !nombres.value.trim()) {
        alert('Por favor complete todos los datos de contacto de emergencia.');
        return;
      }

      // Confirmación exitosa
      alert('¡SOLICITUD REGISTRADA EXITOSAMENTE!\n\nEstimado(a) estudiante, su Declaración Jurada de Exoneración de Seguro de Salud ha sido ingresada con éxito bajo el registro EX-2026-0941.\n\nSe ha enviado un correo con el comprobante de trámite a yajairacampos88@gmail.com.');

      formDeclaracionSeguro.reset();
      if (dniFileStatus) {
        dniFileStatus.textContent = 'Ningún archivo seleccionado';
        dniFileStatus.classList.remove('selected');
      }
      if (seguroFileStatus) {
        seguroFileStatus.textContent = 'Ningún archivo seleccionado';
        seguroFileStatus.classList.remove('selected');
      }
      if (cardUploadDni) cardUploadDni.classList.remove('has-file');
      if (cardUploadSeguro) cardUploadSeguro.classList.remove('has-file');

      closeModalExoneracion();
      closeDrawer();
    });
  }

  // Tecla Escape para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalExoneracion && modalExoneracion.classList.contains('active')) {
        closeModalExoneracion();
      } else if (drawerOverlay && drawerOverlay.classList.contains('active')) {
        closeDrawer();
      }
    }
  });
});
