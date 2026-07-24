# 04. Contratos visuales de componentes

## Convención común

Cada componente debe especificar:

- Anatomía.
- Variantes.
- Tamaños.
- Estados.
- Slots.
- Comportamiento responsive.
- Accesibilidad.
- Tokens consumidos.

Los nombres siguientes describen contratos, no una implementación concreta.

## Button

### Variantes

- `primary`: gradiente del producto, acción principal.
- `secondary`: superficie translúcida y borde suave.
- `ghost`: sin superficie hasta hover.
- `danger`: token semántico de error, nunca color de producto.
- `glass`: para acciones sobre superficies editoriales.

### Tamaños

- `sm`: 36px de alto.
- `md`: 44px.
- `lg`: 48px.
- Icon-only: área mínima de `40×40px`.

### Estados

Default, hover, pressed, focus-visible, loading y disabled. Loading conserva el ancho. Disabled reduce contraste, pero mantiene legibilidad.

## Surface / Card

### Variantes

- `plain`: agrupación sin caja.
- `surface`: borde y gradiente casi neutro.
- `editorial`: mayor profundidad y espacio.
- `featured`: tinte suave del producto.
- `interactive`: lift máximo de `7px` y borde de producto en hover.

### Reglas

- No usar `Card` para cada agrupación.
- El glow se aplica con pseudo-elemento y opacidad progresiva.
- La card interactiva completa debe tener foco y semántica de enlace o botón.

## SectionHeader

Slots: `eyebrow`, `title`, `description`, `aside`.

- `title` controla los cortes; no insertar saltos por estilo dentro de traducciones.
- `aside` puede contener evidencia, nota o CTA secundaria.
- En mobile, `aside` baja después de la descripción.

## Badge / Chip / Status

- `Badge`: clasificación o metadata breve.
- `Chip`: filtro o selección interactiva.
- `Status`: estado con icono/dot y texto.

Nunca expresar estado solo mediante color. Máximo recomendado: cinco chips visibles por bloque.

## Header

### Desktop

- Tres zonas: marca, navegación y estado/acción.
- Altura base: `76px`.
- Al hacer scroll: `64px`, ancho máximo `1180px`, top `12px`, radio `18px`.
- Blur `24px` y z-index `100`.

### Navegación

- Contenedor pill.
- Indicador activo flotante, no fondos independientes por enlace.
- Movimiento con easing expresivo y duración `380–480ms`.
- `aria-current` en el enlace activo.

### Mobile

- Navegación principal colapsada o sustituida por menú accesible.
- Marca y acción primaria permanecen visibles.

## ProductPreview

- Superficie oscura, radio `22px`, borde fino y sombra amplia.
- Desktop puede usar perspectiva máxima de `4deg`.
- Borde orbital con gradiente del producto.
- Mobile elimina perspectiva y usa flotación vertical leve.
- La imagen debe ser realista, legible y representar un estado usable.

## FeatureCard

Anatomía: icono, índice, badge opcional, título y descripción.

- Icono a la izquierda; índice y badge alineados a la derecha.
- El icono usa `brand.soft` y `brand.border`.
- Título de `24px`; copy de `12–13px`.
- Featured usa tinte del producto, no un nuevo color.

## ProductCard / AddOnCard

Anatomía: icono, índice, categoría, nombre, capacidad, precio y señal de color.

- Cada card puede declarar `tone`, pero ese tono debe venir de un conjunto controlado.
- El icono ocupa una columna equivalente al bloque de texto para evitar vacío vertical.
- La señal inferior es decorativa y no sustituye información.
- Precio siempre incluye divisa, periodo y alcance.

## SegmentedControl

- Altura mínima `36px`.
- Opción activa con `brand.soft` y borde interno.
- Incentivos como “2 meses gratis” viven dentro de la opción relevante.
- Usa botones con `aria-pressed` o radiogroup.
- En mobile ocupa todo el ancho.

## Input, Select y Range

### Input

- Label visible o accessible name inequívoco.
- Altura mínima `40px`.
- Texto funcional mínimo `12px`; datos protagonistas pueden ser mayores.

### Select

- Toda el área visual abre el control, no solo el texto.
- Icono, label, valor y chevron centrados verticalmente.
- No ocultar el control nativo a tecnologías de asistencia.

### Range

- Track mínimo `5px` y thumb visual de `23px`.
- Debe operar con teclado.
- Mostrar valor exacto en un input complementario cuando la precisión importe.
- Ticks son ayuda visual; solo el tick más cercano se resalta.

## PricingEstimator / Configurator

Patrón reusable para precios, capacidad o escenarios.

Anatomía:

1. Título y resumen de configuración.
2. Selector de modalidad.
3. Rango o controles.
4. Resultado dominante.
5. Comparación y ahorro integrados.
6. Beneficios sin exceso de cajas.
7. Caso personalizado.
8. Notas y procedencia.

Reglas:

- Una sola cifra debe dominar.
- Precio anterior es secundario y puede tacharse.
- Ahorro aparece junto al precio principal, no como tercera cifra competidora.
- Los cálculos deben separar precio, periodo, impuestos, descuento y consumo.
- Si el anual ofrece meses gratis, el equivalente mensual es `total anual ÷ meses de servicio`.
- Cambios de valor se anuncian con `aria-live="polite"` solo en el resultado.

## Notice / CookieBanner

- Ubicación desktop: esquina inferior izquierda.
- Mobile: encima de controles flotantes y safe area.
- Copy breve y específico sobre lo que se guarda.
- Acción primaria clara y cierre con accessible name.
- No usar dark patterns ni preselecciones engañosas.

## PreferencesDock

- Control flotante para idioma, divisa u otras preferencias globales.
- Blur premium, radio `17px`, z-index `60`.
- Labels pueden ocultarse en mobile, pero el accessible name permanece.
- La preferencia se persiste sin ensuciar la URL cuando la estrategia del producto lo requiera.

## Empty, Loading y Error

- `Empty`: explicar qué falta y ofrecer una acción.
- `Loading`: skeleton con geometría del contenido; evitar spinners de página completa.
- `Error`: mensaje humano, detalle opcional y recuperación.
- Los estados usan tokens semánticos compartidos, no el acento del producto.

## Modal, Drawer y Toast

- Modal: foco atrapado, cierre con Escape, retorno de foco.
- Drawer: preferido en mobile para controles secundarios.
- Toast: mensajes breves, máximo una acción y duración pausada al hover/foco.
- Z-index según la escala compartida.

