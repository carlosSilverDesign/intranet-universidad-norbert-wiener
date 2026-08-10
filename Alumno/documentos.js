document.addEventListener('DOMContentLoaded', () => {
  console.log('Sección Documentos cargada correctamente.');

  const searchInput = document.getElementById('docSearchInput');
  const cards = document.querySelectorAll('.category-card');
  const noResultsMessage = document.getElementById('noResultsMessage');

  function cleanText(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Lógica del Buscador en tiempo real
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = cleanText(searchInput.value);
      let totalVisibleCards = 0;

      cards.forEach(card => {
        const categoryTitle = cleanText(card.querySelector('.category-title').textContent);
        const docItems = card.querySelectorAll('.document-item');
        let visibleDocsInCard = 0;

        docItems.forEach(item => {
          const docName = cleanText(item.querySelector('.document-name').textContent);
          
          // Si el query está vacío, o coincide con el nombre del documento, o coincide con la categoría
          if (query === '' || docName.includes(query) || categoryTitle.includes(query)) {
            item.closest('li').style.display = 'block';
            visibleDocsInCard++;
          } else {
            item.closest('li').style.display = 'none';
          }
        });

        // Si la categoría coincide en su totalidad o tiene documentos visibles, se muestra la tarjeta
        if (visibleDocsInCard > 0 || (query !== '' && categoryTitle.includes(query))) {
          card.style.display = 'flex';
          totalVisibleCards++;
          
          // Si la categoría coincidió por completo, aseguramos mostrar todos sus documentos
          if (query !== '' && categoryTitle.includes(query)) {
            docItems.forEach(item => {
              item.closest('li').style.display = 'block';
            });
          }
        } else {
          card.style.display = 'none';
        }
      });

      // Mostrar mensaje sin resultados
      if (totalVisibleCards === 0 && query !== '') {
        noResultsMessage.style.display = 'block';
      } else {
        noResultsMessage.style.display = 'none';
      }
    });
  }

  // Micro-interacción al hacer clic en un documento
  const documentLinks = document.querySelectorAll('.document-item');
  documentLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Previene la recarga/redirección en la maqueta
      const docName = link.querySelector('.document-name').textContent;
      console.log(`Descargando documento: ${docName}`);
      
      // Feedback visual rápido
      link.style.transform = 'scale(0.99)';
      setTimeout(() => {
        link.style.transform = '';
      }, 80);
    });
  });
});
