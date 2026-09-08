# Plan de Implementación y Control de Cambios: Perfil Docente

Este documento sirve como el plan de ruta activo y el registro de control de cambios para la implementación modular del perfil **Docente** en la Intranet. Se irá actualizando y marcando a medida que cada vista sea desarrollada, evaluada y aprobada.

---

## 📋 Control de Estados y Avance General

- [x] **Paso 1: Estructura Base y Navegación (Sidebar / Topbar)**
  - Estado: Completado (2026-09-03)
  - Archivos: `Docente/navbar.html`, `Docente/navbar.css`, `Docente/navbar.js`
- [x] **Paso 2: Dashboard Principal (Home) y Componente de Marcación**
  - Estado: Completado (2026-09-03)
  - Archivos: `Docente/index.html`, `Docente/styles.css`, `Docente/scripts.js`
- [ ] **Paso 3: Mis Datos (Perfil Docente)**
  - Estado: Pendiente
  - Archivos: `Docente/mis-datos.html`, `Docente/mis-datos.css`, `Docente/mis-datos.js`
- [ ] **Paso 4: Horario de Clases**
  - Estado: Pendiente
  - Archivos: `Docente/horario.html`, `Docente/horario.css`, `Docente/horario.js`
- [ ] **Paso 5: Alumnos y Cursos Asignados**
  - Estado: Pendiente
  - Archivos: `Docente/alumnos.html`, `Docente/alumnos.css`, `Docente/alumnos.js`
- [ ] **Paso 6: Registro de Notas**
  - Estado: Pendiente
  - Archivos: `Docente/notas.html`, `Docente/notas.css`, `Docente/notas.js`
- [x] **Paso 7: Control y Registro de Asistencias (Estudiantes)**
  - Estado: Completado (2026-09-07)
  - Archivos: `Docente/asistencia-alumno.html`, `Docente/asistencia-alumno.css`, `Docente/asistencia-alumno.js`, `Docente/componentes/section-header.html`
- [ ] **Paso 8: Avance Académico, Asistencia Docente y Reglamentos**
  - Estado: Pendiente
  - Archivos: `Docente/avance.html`, `Docente/asistencia-docente.html`, `Docente/reglamentos.html`
- [ ] **Paso 9: Gestión Docente (DGDD) y Evaluación (MIDE / ESD)**
  - Estado: Pendiente
  - Archivos: `Docente/dgdd.html`, `Docente/dgdd.css`, `Docente/dgdd.js`

---

## 🛠️ Detalle de las Vistas e Implementación

### Paso 1: Estructura Base y Navegación (Sidebar / Topbar)
*Objetivo*: Crear el marco del contenedor principal, la barra lateral izquierda y la barra superior de búsqueda/notificaciones específicas para el perfil Docente.
- **`Docente/navbar.css`**: Estilos de la barra lateral, colores del tema teal (`#07C8CC`), menús interactivos colapsables y adaptación móvil.
- **`Docente/navbar.js`**: Lógica JS para contraer/desplegar categorías del menú lateral y abrir la barra en pantallas pequeñas.

### Paso 2: Dashboard Principal (Home)
*Objetivo*: Pantalla inicial del docente que consolida las métricas del ciclo activo, accesos rápidos y notificaciones institucionales.
- **`Docente/index.html`**: HTML estructurado con la integración de la barra lateral y superior. Contiene la sección de bienvenida, grid de estadísticas (`g4`) y bloques de anuncios/trámites en grid triple (`g3`).
- **`Docente/index.css`**: Diseño responsivo y animaciones de tarjetas.
- **`Docente/index.js`**: Inicialización del reloj y redireccionamientos rápidos.

### Paso 3: Mis Datos (Perfil Docente)
*Objetivo*: Formulario interactivo donde el docente visualiza y gestiona sus datos personales, académicos y profesionales.
- **`Docente/mis-datos.html`**: Estructura de pestañas (Tabs) con validación WCAG 2.1 AA.
- **`Docente/mis-datos.css`** y **`Docente/mis-datos.js`**: Estilos de inputs flotantes, selectores y autocompletados personalizados, con la respectiva lógica de validación de campos.

### Paso 4: Horario de Clases
*Objetivo*: Calendario interactivo semanal y listado de horarios de dictado de clases y tutorías.
- **`Docente/horario.html`**: Grilla semanal estructurada por horas y días.

### Paso 5: Alumnos y Cursos Asignados
*Objetivo*: Panel de administración para visualizar el listado de estudiantes inscritos en las materias que dicta el profesor.
- **`Docente/alumnos.html`**: Lista dinámica con buscador en tiempo real y exportación de datos.

### Paso 6: Registro de Notas
*Objetivo*: Interfaz interactiva para el ingreso y edición de notas de evaluaciones parciales, continuas y finales.
- **`Docente/notas.html`**: Matriz interactiva de calificaciones.

### Paso 7: Control y Registro de Asistencias (Estudiantes)
*Objetivo*: Checklist de control diario de asistencias para las clases programadas del día.
- **`Docente/asistencia.html`**: Lista interactiva rápida (Presente / Tardanza / Falta) con estados de color semánticos.

### Paso 8: Avance Académico, Asistencia Docente y Reglamentos
*Objetivo*: Registro de syllabus cubierto, marcaciones del profesor y centro de descargas normativas.

### Paso 9: Gestión Docente (DGDD) y Evaluación
*Objetivo*: Vista de inducción, capacitaciones de formación continua, acompañamiento pedagógico, resultados MIDE y encuestas de satisfacción docente (ESD).

---

## 🪵 Registro Histórico de Cambios (Changelog)
*(Las actualizaciones de las tareas completadas se documentarán en esta sección).*

- **2026-08-09**: Creación de la estructura de carpetas `Alumno/` y `Docente/`. Reorganización de las vistas originales de Alumno y corrección de rutas relativas. Inicialización del archivo de plan de ruta `Docente/PLAN.md`.
- **2026-09-03**: Maquetación modular completa de la Home Docente y sistema de navegación inicial.
- **2026-09-04**: Unificación rigurosa de estilos con el perfil Estudiante y alineación con el diseño de referencia (`index.html`, `navbar.html`, `navbar.css`, `styles.css`):
  - Carrusel de 4 banners de texto (980x180 px) con comentarios de reemplazo para imágenes y 4 puntos de paginación.
  - Fila unificada horizontal: Tarjeta de marcación horaria en una sola línea (icono, hora, segundos, fecha, estado y botón) alineada con los 4 botones de acceso rápido (`Fotocheck`, `Mi Perfil`, `Mesa Ayuda`, `Capacitación`).
  - Ajuste de proporciones en `docente-metrics-grid` (4 columnas con tipografía y tags estandarizados).
  - Distribución central 50/50 (`docente-middle-grid`) con el mismo ancho para la tarjeta de horario y los accesos rápidos.
  - Estandarización de estilos para las clases `AHORA` y `SIGUIENTE CLASE` en `card-next-class` (mismas tipografías y dimensiones, diferenciadas únicamente por los tags).
  - Navbar lateral ampliado a 240px con enlaces de 14px en una sola línea, padding compacto, flechas de 18x18px y submenús internos sin icono con sangría.
  - Eliminación de márgenes inferiores sobrantes para corte limpio sobre el pie de página.
  - Cero variables CSS y comentarios técnicos redactados en español.
- **2026-09-07**: Maquetación modular completa de la vista **Registro de Asistencia Alumnos** (`Docente/asistencia-alumno.html`, `Docente/asistencia.html`, `Docente/asistencia-alumno.css`, `Docente/asistencia-alumno.js`):
  - Extracción y creación de la plantilla reutilizable de cabecera de sección institucional (`Docente/componentes/section-header.html`) con soporte para icono/placeholder y selector opcional de periodo a la derecha.
  - Formulario de filtros institucional de dos filas con todos los selectores de la maqueta (`Periodo`, `Periodo Mes`, `Carrera`, `Sección`, `Curso`, `Tipo Sesión`, `Mes`) y botón de búsqueda.
  - Subheader con fecha del sistema, leyenda semántica de colores y botón outline para exportar a Excel.
  - Matriz interactiva de 17 sesiones de clase con casillas clickeables (Asistió ✓ / Faltó F / Vacío) y recálculo dinámico en tiempo real de asistencias acumuladas y porcentajes por fila.
  - Botón verde institucional para registrar/grabar asistencias con feedback mediante notificación Toast flotante.
  - Adaptabilidad responsive completa para dispositivos móviles y tablets con scroll horizontal táctil y columnas fijas.
