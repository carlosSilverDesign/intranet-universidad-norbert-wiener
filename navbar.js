document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const sidebar = document.getElementById('sidebarNavbar');
  const blurOverlay = document.getElementById('navbarBlurOverlay');
  const burgerBtn = document.getElementById('topBarBurgerBtn');
  const closeSidebarBtn = document.getElementById('sidebarCloseBtn');

  const desktopSearchInput = document.getElementById('desktopSearchInput');
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');
  const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
  const mobileSearchCloseBtn = document.getElementById('mobileSearchCloseBtn');
  const mobileSearchInput = document.getElementById('mobileSearchInput');

  const notificationBtn = document.getElementById('notificationBtn');
  const notificationBadge = document.getElementById('notificationBadge');
  const notificationsDrawer = document.getElementById('notificationsDrawer');
  const notificationsCloseBtn = document.getElementById('notificationsCloseBtn');
  const mailBtn = document.getElementById('mailBtn');

  // 1. Controladores del Menú Lateral Móvil (Drawer izquierdo)
  function openMobileMenu() {
    closeNotifications(); // Prevenir colisión
    if (sidebar) sidebar.classList.add('active');
    if (blurOverlay) blurOverlay.classList.add('active');
  }

  function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove('active');
    // Quitar la capa de blur solo si el panel de notificaciones tampoco está activo
    if (!notificationsDrawer || !notificationsDrawer.classList.contains('active')) {
      if (blurOverlay) blurOverlay.classList.remove('active');
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', openMobileMenu);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeMobileMenu);
  }

  if (blurOverlay) {
    blurOverlay.addEventListener('click', () => {
      closeMobileMenu();
      closeNotifications();
    });
  }

  // 2. Controladores del Buscador Desplegable en Móviles
  if (mobileSearchBtn && mobileSearchOverlay) {
    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchOverlay.classList.add('active');
      if (mobileSearchInput) {
        mobileSearchInput.focus();
      }
    });
  }

  if (mobileSearchCloseBtn && mobileSearchOverlay) {
    mobileSearchCloseBtn.addEventListener('click', () => {
      mobileSearchOverlay.classList.remove('active');
    });
  }

  // 3. Simulación de envío de búsquedas
  if (desktopSearchInput) {
    desktopSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        alert(`Buscando: "${desktopSearchInput.value}"`);
        desktopSearchInput.value = '';
      }
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        alert(`Buscando en móvil: "${mobileSearchInput.value}"`);
        mobileSearchInput.value = '';
        if (mobileSearchOverlay) {
          mobileSearchOverlay.classList.remove('active');
        }
      }
    });
  }

  // 4. Controladores del Panel de Notificaciones (Drawer derecho)
  function openNotifications() {
    closeMobileMenu(); // Prevenir colisión
    if (notificationsDrawer) notificationsDrawer.classList.add('active');
    if (blurOverlay) blurOverlay.classList.add('active');
    if (notificationBadge) {
      notificationBadge.style.display = 'none'; // Limpia el indicador visual
    }
  }

  function closeNotifications() {
    if (notificationsDrawer) notificationsDrawer.classList.remove('active');
    // Quitar la capa de blur solo si el menú lateral izquierdo tampoco está activo
    if (!sidebar || !sidebar.classList.contains('active')) {
      if (blurOverlay) blurOverlay.classList.remove('active');
    }
  }

  if (notificationBtn) {
    notificationBtn.addEventListener('click', openNotifications);
  }

  if (notificationsCloseBtn) {
    notificationsCloseBtn.addEventListener('click', closeNotifications);
  }

  // 5. Simulación de clic en correo institucional
  if (mailBtn) {
    mailBtn.addEventListener('click', () => {
      alert('Abriendo bandeja de entrada del Correo Institucional...');
    });
  }

  // 6. Resaltado interactivo de los enlaces del Navbar
  const menuLinks = document.querySelectorAll('.sidebar-menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Evitar redirigir por defecto en la maqueta
      const linkText = link.querySelector('.text').textContent;
      console.log(`Navegando a la sección: ${linkText}`);

      // Excluir el botón de salida del estado activo visual
      if (!link.classList.contains('sidebar-logout-btn')) {
        menuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Si la pantalla es móvil, cerrar el menú tras dar clic
        if (window.innerWidth <= 992) {
          closeMobileMenu();
        }
      }
    });
  });

  // 7. Alerta de confirmación de salida
  const logoutBtn = document.querySelector('.sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        alert('Sesión cerrada correctamente.');
      }
    });
  }
});


