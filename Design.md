# Design System - Intranet Universidad Norbert Wiener

## 1. Tipografía
- **Títulos y Encabezados**: `Lato`, sans-serif (Weights: 400, 700, 900)
- **Cuerpo de texto e inputs**: `Roboto`, sans-serif (Weights: 400, 500, 700)

## 2. Paleta de Colores

### Colores Principales
- **Primary Teal (Principal)**: `#0F848F`
- **Primary Hover**: `#0b6770` o `#09A5B1`
- **Black (Secundario/Botones)**: `#222222`
- **Background Body**: `#F4F6F8` (Fondo general de la intranet)
- **Background Content**: `#FFFFFF` (Fondo de tarjetas y contenedores)

### Textos
- **Text Dark (Títulos principales)**: `#222222` o `#000000`
- **Text Gray (Descripciones y etiquetas)**: `#5B6E80` o `#404040`
- **Text Light (Placeholder/Inactivo)**: `#9AA6B2`

### Bordes y Divisores
- **Border Default**: `#C6CFD7`
- **Border Light**: `#E6F3F4`

### Estados y Semántica
- **Success / Asistencias**:
  - Texto/Icono: `#278B52` o `#33B56B`
  - Fondo claro: `#E7F8EF` o `#E6F3F4` (Para bloques de asistencias)
- **Warning / Inasistencias**:
  - Texto/Icono: `#F59E0B` o `#FBBF24`
  - Fondo claro: `#FFF3E0`
- **Danger / Error**:
  - Texto/Icono: `#D32F2F` o `#E22731`
  - Fondo claro: `#FFEBEE`

## 3. Tags de Modalidad
Se usan para identificar la modalidad de un curso, con un border-radius tipo pill (`16px` o `64px`):
- **Presencial**: Fondo `#0F848F`, Texto `#FFFFFF`
- **Virtual En vivo**: Fondo `#0EA5E9`, Texto `#FFFFFF`
- **Virtual 24/7**: Fondo `#F97316`, Texto `#FFFFFF`

## 4. Botones
- **Radius general**: `6px`
- **Padding general**: `12px 24px`
- `.btn-primary`: Fondo `#0F848F`, Texto `#FFFFFF`
- `.btn-black`: Fondo `#222222`, Texto `#FFFFFF`
- `.btn-outline`: Borde `#C6CFD7`, Fondo transparente, Texto `#0F848F`

## 5. Espaciado y Estructura
- **Contenedor Principal (`.main-content`)**: `max-width: 1082px`, margin auto.
- **Tarjetas (`.card`)**: 
  - `background-color: #FFFFFF;`
  - `border: 1px solid #C6CFD7;`
  - `border-radius: 8px` (o `16px` para contenedores más grandes)
  - `padding: 24px` o `32px`
- **Sombras**: Las interacciones (hover) suelen tener un `box-shadow: 0 4px 12px rgba(0,0,0,0.05);` y un leve `transform: translateY(-2px);`.
