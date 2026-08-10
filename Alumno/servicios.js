document.addEventListener('DOMContentLoaded', () => {
  console.log('Sección Servicios cargada correctamente.');

  const cards = document.querySelectorAll('.servicios-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const title = card.querySelector('.servicio-title').textContent;
      console.log(`Servicio seleccionado: ${title}`);
      
      // Simulación de interacción con micro-animación al dar clic
      card.style.transform = 'scale(0.98) translateY(0px)';
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
    });
  });
});
