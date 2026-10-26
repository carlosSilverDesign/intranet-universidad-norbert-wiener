/**
 * RECTIFICACIÓN DE NOTAS - VISTA ADMINISTRATIVO (INICIO)
 * Complemento interactivo para subnavegación superior
 */
document.addEventListener('DOMContentLoaded', () => {
  // Manejo de clicks en enlaces de subnavegación que aún no tienen página definida (href="#")
  const subnavLinks = document.querySelectorAll('.admin-subnav-link');
  subnavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const text = link.textContent.trim();
        const toast = document.getElementById('toastMessage');
        const toastText = document.getElementById('toastText');
        if (toast && toastText) {
          toastText.textContent = `Sección "${text}" en proceso de implementación`;
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3500);
        }
      });
    }
  });
});
