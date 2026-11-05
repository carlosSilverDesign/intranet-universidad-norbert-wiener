/**
 * Script de la sección Reglamentos - Perfil Docente
 * Universidad Norbert Wiener
 * Manejo de micro-interacciones de descarga y feedback al usuario.
 */
document.addEventListener('DOMContentLoaded', () => {
  const documentLinks = document.querySelectorAll('.document-item');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  documentLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const docName = link.querySelector('.document-name')?.textContent.trim() || 'Documento';
      console.log(`[Descarga Iniciada]: ${docName}`);

      // Micro-interacción visual
      link.style.transform = 'scale(0.98)';
      setTimeout(() => {
        link.style.transform = '';
      }, 100);

      showToast(`Descargando: ${docName}`);
    });
  });
});
