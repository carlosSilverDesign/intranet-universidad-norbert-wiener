document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos todos los contenedores de edición en línea
    const inlineFields = document.querySelectorAll('.inline-field');

    inlineFields.forEach(field => {
        const toggleBtn = field.querySelector('.btn-toggle-edit');
        const saveBtn = field.querySelector('.btn-save');
        const valueDisplay = field.querySelector('.field-value');
        const inputCtrl = field.querySelector('.field-input');

        // Lógica del botón Editar / Cancelar
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isEditing = field.getAttribute('data-state') === 'edit';
                
                if (isEditing) {
                    // Si estaba editando, cancelamos (Volver a view)
                    field.setAttribute('data-state', 'view');
                    toggleBtn.textContent = 'Editar';
                    toggleBtn.classList.remove('is-cancel');
                } else {
                    // Si estaba en vista, pasamos a editar
                    field.setAttribute('data-state', 'edit');
                    toggleBtn.textContent = 'Cancelar';
                    toggleBtn.classList.add('is-cancel');
                    // Opcional: hacer focus en el input
                    inputCtrl.focus();
                }
            });
        }

        // Lógica del botón Guardar (debajo del input)
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                
                // Actualizar el valor visual dependiendo del tipo de input
                let newValue = '';
                if (inputCtrl.tagName === 'SELECT') {
                    // Si es select, agarramos el texto de la opción elegida, no su value interno
                    newValue = inputCtrl.options[inputCtrl.selectedIndex].text;
                } else {
                    newValue = inputCtrl.value;
                }

                // Seteamos el texto y quitamos la clase muted si la tenía (ej: cuando estaba vacío)
                valueDisplay.textContent = newValue || 'Sin dato';
                if (newValue) valueDisplay.classList.remove('text-muted');

                // Retornar al estado original
                field.setAttribute('data-state', 'view');
                toggleBtn.textContent = 'Editar';
                toggleBtn.classList.remove('is-cancel');

                // Nota Arquitectura: Aquí el equipo de Blazor enviará la petición (fetch/C#)
                // para persistir este único dato en la base de datos.
            });
        }
    });

});