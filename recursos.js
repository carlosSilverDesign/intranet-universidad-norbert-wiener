document.addEventListener('DOMContentLoaded', () => {
  console.log('Sección Recursos cargada correctamente.');

  const cards = document.querySelectorAll('.recursos-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const title = card.querySelector('.card-title').textContent;
      console.log(`Recurso seleccionado: ${title}`);
      
      // Simulación de interacción con micro-animación al dar clic
      card.style.transform = 'scale(0.98) translateY(0px)';
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
    });
  });
});
