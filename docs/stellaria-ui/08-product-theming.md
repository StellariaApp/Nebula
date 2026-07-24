# 08. Tematización de productos

## Objetivo

Crear personalidad sin duplicar componentes ni alterar la gramática visual de Stellaria.

## Proceso

### 1. Definir la tesis

Completar en una frase:

> Este producto ayuda a `[audiencia]` a `[resultado]` mediante `[mecanismo]`, y debe sentirse `[tres adjetivos]`.

### 2. Elegir el acento

Seleccionar:

- `brand.primary`.
- `brand.bright`.
- `brand.onPrimary`.
- Ángulo de gradiente.
- Intensidad del glow.

Validar contraste antes de aprobar.

### 3. Elegir un motivo propio

Solo uno:

- Borde orbital.
- Línea de datos.
- Pulso.
- Partículas.
- Forma geométrica.
- Tratamiento fotográfico.

### 4. Declarar el tono

Definir vocabulario permitido, prohibido, nivel técnico y forma de comunicar riesgo.

### 5. Aplicar componentes compartidos

Usar los mismos contratos de Header, Button, Card, SectionHeader, SegmentedControl, Notice y Footer. Personalizar mediante tema y slots.

### 6. Verificar parentesco

Ocultar logos y preguntar: ¿la interfaz todavía parece parte de Stellaria? Si la respuesta es no, probablemente se cambiaron demasiadas capas.

## Matriz 80/20

| Elemento | Stellaria | Producto |
| --- | --- | --- |
| Canvas y superficies | Sí | No |
| Tipografía y escala | Sí | Ajuste mínimo |
| Espaciado y radios | Sí | No |
| Grid y estrellas | Sí | Color de estrella destacada |
| Header flotante | Sí | Logo y status |
| Focus y estados | Sí | No |
| Color primario | No | Sí |
| Gradiente | Estructura | Colores |
| Motivo especial | Límite y motion | Sí |
| Copy | Principios | Vocabulario |
| Preview e imágenes | Calidad y formato | Sí |

## Reglas de color

- El producto declara dos colores de marca, no una paleta completa sin roles.
- El color primario debe distinguirse del success, warning y danger.
- Cyan/blue permanecen disponibles como sistema secundario.
- Una vista usa un acento dominante.
- Los derivados se generan, no se eligen uno a uno.

## Ejemplo: Rosette

| Campo | Valor |
| --- | --- |
| Personalidad | Cercana, premium, operativa |
| Primary | `#F43F5E` |
| Bright | `#FB7185` |
| Motivo | Borde orbital |
| Glow | Rosa, opacidad `.16` |
| Secundarios | Cyan para acciones especiales; verde para éxito |
| Narrativa | Conversación, control y escala |

## Ejemplo hipotético: producto analítico

- Mantener canvas, superficies, tipografía, grid, header y motion.
- Elegir primary índigo y bright azul eléctrico.
- Motivo propio: trazo de datos, no borde orbital.
- Mantener success verde y danger rojo.
- Usar mayor densidad, sin reducir mínimos tipográficos.

## Anti-patrones

- Copiar Rosette y reemplazar todos los rosas mediante buscar/reemplazar.
- Cambiar fondos base por el color de producto.
- Crear un set diferente de radios por marca.
- Usar el primary como success o danger.
- Introducir una nueva animación en cada sección.
- Diseñar componentes exclusivos cuando una variante o slot resuelve el caso.

## Aprobación de un nuevo tema

Un tema está listo cuando:

- Cumple contraste AA.
- Tiene light y dark o documenta por qué solo usa uno.
- Define primary, bright, onPrimary y derivados.
- Usa estados semánticos compartidos.
- Incluye un único motivo distintivo.
- Se prueba en Button, Input, Card, Header, Notice y data visualization.
- Se compara visualmente con al menos otro producto Stellaria.

