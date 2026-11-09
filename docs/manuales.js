/**
 * Script de la sección Manuales - Perfil Docente
 * Universidad Norbert Wiener
 * Simulación de descarga de PDFs institucionales y notificaciones Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  const downloadBtns = document.querySelectorAll('.btn-download-manual');
  const toast = document.getElementById('attendanceToast');
  const toastText = document.getElementById('attendanceToastText');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-title') || 'Manual';
      showToast(`Iniciando descarga: ${title} (PDF)...`);
    });
  });
});
