const pueblosIndigenas = [
    "Ninguno", "Achuar", "Aimara", "Amahuaca", "Arabela", "Ashaninka", "Asheninka", "Awajún", "Bora", 
    "Cashinahua", "Chamicuro", "Chapra", "Chitonahua", "Ese Eja", "Harakbut", "Ikitu", 
    "Iñapari", "Iskonawa", "Jaqaru", "Jíbaro", "Kakataibo", "Kakinte", "Kandozi", "Kapanawa", 
    "Kichwa", "Kukama Kukamiria", "Madija", "Maijuna", "Marinahua", "Mashco Piro", 
    "Mastanahua", "Matsés", "Matsigenka", "Muniche", "Murui-Muinani", "Nahua", "Nanti", 
    "Nomatsigenga", "Ocaina", "Omagua", "Quechuas", "Resígaro", "Secoya", "Sharanahua", 
    "Shawi", "Shipibo- Konibo", "Shiwilu", "Ticuna", "Urarina", "Uro", "Vacacocha", 
    "Wampis", "Yagua", "Yaminahua", "Yanesha", "Yine"
];

const lenguasEtnicas = [
    "Ninguno", "Achuar", "Aimara", "Amahuaca", "Arabela", "Ashaninka", "Asheninka", "Awajún", "Bora", 
    "Cashinahua", "Chamikuro", "Ese Eja", "Harakbut", "Ikitu", "Iñapari", "Iskonawa", 
    "Jaqaru", "Kakataibo", "Kakinte", "Kandozi-Chapra", "Kapanawa", "Kawki", "Kukama Kukamiria", 
    "Madija", "Maijiki", "Matsés", "Matsigenka", "Matsigenka Montetokunirira", "Munichi", 
    "Murui-Muinani", "Nahua", "Nomatsigenga", "Ocaina", "Omagua", "Quechua", "Resígaro", 
    "Secoya", "Sharanahua", "Shawi", "Shipibo-Konibo", "Shiwilu", "Taushiro", "Ticuna", 
    "Urarina", "Wampis", "Yagua", "Yaminahua", "Yanesha", "Yine"
];

const paises = [
    "Ninguno", "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", 
    "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán", 
    "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", 
    "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", 
    "Burkina Faso", "Burundi", "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", 
    "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", 
    "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba", 
    "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", 
    "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía", 
    "Filipinas", "Finlandia", "Fiyi", "Francia", "Gabón", "Gambia", "Georgia", "Ghana", 
    "Granada", "Grecia", "Guatemala", "Guinea", "Guinea Ecuatorial", "Guinea-Bisáu", 
    "Guyana", "Haití", "Honduras", "Hungría", "India", "Indonesia", "Irak", "Irán", 
    "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia", "Jamaica", 
    "Japón", "Jordania", "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait", "Laos", 
    "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", 
    "Luxemburgo", "Macedonia del Norte", "Madagascar", "Malasia", "Malaui", "Maldivas", 
    "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", 
    "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique", "Namibia", "Nauru", 
    "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda", "Omán", 
    "Países Bajos", "Pakistán", "Palaos", "Palestina", "Panamá", "Papúa Nueva Guinea", 
    "Paraguay", "Perú", "Polonia", "Portugal", "Reino Unido", "República Centroafricana", 
    "República Checa", "República del Congo", "República Democrática del Congo", 
    "República Dominicana", "Ruanda", "Rumania", "Rusia", "Samoa", "San Cristóbal y Nieves", 
    "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", 
    "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", 
    "Sri Lanka", "Suazilandia", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", 
    "Surinam", "Tailandia", "Taiwán", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", 
    "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu", "Ucrania", 
    "Uganda", "Uruguay", "Uzbekistán", "Vanuatu", "Venezuela", "Vietnam", "Yemen", 
    "Yibuti", "Zambia", "Zimbabue"
];

// Función reutilizable para configurar campos de búsqueda autocompletables
function setupSearchableField(fieldId, selectId, containerId, searchInputId, clearBtnId, resultsDropdownId, optionsList, savePrefixPattern, saveFormatFn) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const selectEl = document.getElementById(selectId);
    const searchContainer = document.getElementById(containerId);
    const searchInput = document.getElementById(searchInputId);
    const clearSearchBtn = document.getElementById(clearBtnId);
    const resultsDropdown = document.getElementById(resultsDropdownId);

    // Función para renderizar los resultados de búsqueda
    function renderResults(query) {
        if (!resultsDropdown) return;
        resultsDropdown.innerHTML = '';
        const filtered = optionsList.filter(p => 
            p.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
            filtered.forEach(p => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.textContent = p;
                item.addEventListener('click', () => {
                    if (p === 'Ninguno') {
                        if (selectEl) selectEl.value = '';
                        if (searchContainer) searchContainer.style.display = 'none';
                        if (searchInput) {
                            searchInput.value = '';
                            searchInput.style.borderColor = '';
                        }
                        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
                        if (resultsDropdown) resultsDropdown.style.display = 'none';
                        clearValidationError();
                    } else {
                        if (searchInput) searchInput.value = p;
                        resultsDropdown.style.display = 'none';
                        if (clearSearchBtn) clearSearchBtn.style.display = 'block';
                        clearValidationError();
                    }
                });
                resultsDropdown.appendChild(item);
            });
            resultsDropdown.style.display = 'block';
        } else {
            const noResultsItem = document.createElement('div');
            noResultsItem.className = 'search-result-item no-results';
            noResultsItem.textContent = 'No se encontraron resultados';
            resultsDropdown.appendChild(noResultsItem);
            resultsDropdown.style.display = 'block';
        }
    }

    // Limpiar errores de validación
    function clearValidationError() {
        if (searchInput) searchInput.style.borderColor = '';
        const errorEl = field.querySelector('.validation-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // Mostrar / ocultar buscador basado en la selección
    if (selectEl) {
        selectEl.addEventListener('change', () => {
            clearValidationError();
            if (selectEl.value === '1') {
                if (searchContainer) searchContainer.style.display = 'block';
                if (searchInput) searchInput.focus();
            } else {
                if (searchContainer) searchContainer.style.display = 'none';
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.style.display = 'none';
                if (resultsDropdown) resultsDropdown.style.display = 'none';
            }
        });
    }

    // Eventos del buscador
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearValidationError();
            if (query.length > 0) {
                if (clearSearchBtn) clearSearchBtn.style.display = 'block';
                renderResults(query);
            } else {
                if (clearSearchBtn) clearSearchBtn.style.display = 'none';
                renderResults('');
            }
        });

        searchInput.addEventListener('focus', () => {
            renderResults(searchInput.value.trim());
        });
    }

    // Limpiar buscador
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            clearSearchBtn.style.display = 'none';
            clearValidationError();
            renderResults('');
        });
    }

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (searchContainer && !searchContainer.contains(e.target) && resultsDropdown) {
            resultsDropdown.style.display = 'none';
        }
    });

    // Métodos para ser llamados en el botón Editar/Cancelar y Guardar
    field.customEditSetup = function(savedText) {
        clearValidationError();
        if (savePrefixPattern.test(savedText)) {
            if (selectEl) selectEl.value = '1';
            if (searchContainer) searchContainer.style.display = 'block';
            
            // Extraer valor de entre paréntesis
            const match = savedText.match(/\(([^)]+)\)/);
            if (match && match[1]) {
                const groupName = match[1];
                if (searchInput) {
                    searchInput.value = groupName;
                }
                if (clearSearchBtn) clearSearchBtn.style.display = 'block';
            } else {
                if (searchInput) searchInput.value = '';
                if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            }
        } else if (savedText === 'Seleccionar' || savedText === '') {
            if (selectEl) selectEl.value = '';
            if (searchContainer) searchContainer.style.display = 'none';
            if (searchInput) searchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        } else {
            let found = false;
            if (selectEl) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].text === savedText) {
                        selectEl.value = selectEl.options[i].value;
                        found = true;
                        break;
                    }
                }
                if (!found) selectEl.value = '';
            }
            if (searchContainer) searchContainer.style.display = 'none';
            if (searchInput) searchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        }
    };

    field.customReset = function() {
        if (searchContainer) searchContainer.style.display = 'none';
        if (searchInput) {
            searchInput.value = '';
            searchInput.style.borderColor = '';
        }
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (resultsDropdown) resultsDropdown.style.display = 'none';
        clearValidationError();
    };

    field.customSave = function() {
        if (!selectEl) return '';
        if (selectEl.value === '1') {
            const typedVal = searchInput ? searchInput.value.trim() : '';
            const matchedGroup = optionsList.find(p => 
                p.toLowerCase() === typedVal.toLowerCase()
            );
            
            if (!matchedGroup) {
                if (searchInput) searchInput.style.borderColor = '#d93025';
                let errorEl = field.querySelector('.validation-error');
                if (!errorEl) {
                    errorEl = document.createElement('span');
                    errorEl.className = 'validation-error';
                    errorEl.style.color = '#d93025';
                    errorEl.style.fontSize = '12px';
                    errorEl.style.marginTop = '4px';
                    errorEl.style.display = 'block';
                    if (searchInput) searchInput.parentNode.appendChild(errorEl);
                }
                errorEl.textContent = 'Por favor, selecciona una opción válida de la lista.';
                return null; // Error de validación
            }

            if (matchedGroup === 'Ninguno') {
                if (selectEl) selectEl.value = '';
                if (searchContainer) searchContainer.style.display = 'none';
                if (searchInput) searchInput.value = '';
                return '';
            }
            
            return saveFormatFn(matchedGroup);
        } else {
            if (selectEl.selectedIndex >= 0 && selectEl.value !== "") {
                return selectEl.options[selectEl.selectedIndex].text;
            } else {
                return '';
            }
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {

    // Simulación de carga con Skeleton Loader
    const skeletonLoader = document.getElementById('skeletonLoader');
    const profileContent = document.getElementById('profileContent');

    if (skeletonLoader && profileContent) {
        setTimeout(() => {
            skeletonLoader.style.display = 'none';
            profileContent.style.display = 'flex';
            console.log('Skeleton ocultado y Perfil real visible.');
        }, 2000); // Carga simulada de 2 segundos
    }

    // Inicializar Origen Étnico
    setupSearchableField(
        'origen-etnico-field',
        'origen-etnico-select',
        'pueblo-indigena-search-container',
        'pueblo-indigena-search',
        'clear-pueblo-search',
        'pueblo-indigena-results',
        pueblosIndigenas,
        /^Un pueblo indígena u originario/,
        (group) => `Un pueblo indígena u originario (${group})`
    );

    // Inicializar Lengua Étnica
    setupSearchableField(
        'lengua-etnica-field',
        'lengua-etnica-select',
        'lengua-etnica-search-container',
        'lengua-etnica-search',
        'clear-lengua-search',
        'lengua-etnica-results',
        lenguasEtnicas,
        /^Sí/,
        (lang) => `Sí (${lang})`
    );

    // Inicializar Doble Nacionalidad
    setupSearchableField(
        'doble-nacionalidad-field',
        'doble-nacionalidad-select',
        'doble-nacionalidad-search-container',
        'doble-nacionalidad-search',
        'clear-nacionalidad-search',
        'doble-nacionalidad-results',
        paises,
        /^Sí/,
        (pais) => `Sí (${pais})`
    );

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

                    if (typeof field.customReset === 'function') {
                        field.customReset();
                    }
                } else {
                    // Si estaba en vista, pasamos a editar
                    field.setAttribute('data-state', 'edit');
                    toggleBtn.textContent = 'Cancelar';
                    toggleBtn.classList.add('is-cancel');

                    if (typeof field.customEditSetup === 'function') {
                        field.customEditSetup(valueDisplay ? valueDisplay.textContent.trim() : '');
                    } else {
                        // Opcional: hacer focus en el input
                        if (inputCtrl) inputCtrl.focus();
                    }
                }
            });
        }

        // Lógica del botón Guardar (debajo del input)
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                
                let newValue = '';
                
                if (typeof field.customSave === 'function') {
                    const savedVal = field.customSave();
                    if (savedVal === null) {
                        return; // Detener guardado por error de validación
                    }
                    newValue = savedVal;
                } else {
                    // Actualizar el valor visual dependiendo del tipo de input
                    if (inputCtrl) {
                        if (inputCtrl.tagName === 'SELECT') {
                            newValue = inputCtrl.options[inputCtrl.selectedIndex].text;
                        } else {
                            newValue = inputCtrl.value;
                        }
                    }
                }

                // Obtener el marcador de posición por defecto
                let placeholderText = 'Sin dato';
                if (inputCtrl) {
                    if (inputCtrl.tagName === 'SELECT') {
                        placeholderText = 'Seleccionar';
                    } else if (inputCtrl.placeholder) {
                        placeholderText = inputCtrl.placeholder;
                    }
                } else if (field.id === 'origen-etnico-field' || field.id === 'lengua-etnica-field' || field.id === 'doble-nacionalidad-field') {
                    placeholderText = 'Seleccionar';
                }

                // Seteamos el texto y quitamos/ponemos la clase muted
                if (valueDisplay) {
                    valueDisplay.textContent = newValue || placeholderText;
                    if (newValue) {
                        valueDisplay.classList.remove('text-muted');
                    } else {
                        valueDisplay.classList.add('text-muted');
                    }
                }

                // Retornar al estado original
                field.setAttribute('data-state', 'view');
                if (toggleBtn) {
                    toggleBtn.textContent = 'Editar';
                    toggleBtn.classList.remove('is-cancel');
                }
            });
        }
    });

});