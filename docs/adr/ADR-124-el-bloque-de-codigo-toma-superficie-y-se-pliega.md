# ADR-124 — El bloque de código toma superficie del `variantMap` y se pliega

- **Estado**: aceptada · 2026-08-10 (petición del propietario mirando los docs de Mantine) · **WN**
- **Cambia API pública**: sí, y es **aditivo**: `variant`, `glass`, `expandable` y `collapsedHeight`
  en `CodeHighlightProps`. Sin ninguna de ellas el componente se ve exactamente igual que hoy.

## Contexto

`CodeHighlight` pinta su superficie a mano: `surface.sunken` con un filo de `border.subtle`, fijo en
la hoja. Es el **único bloque grande del sitio que no puede vestirse**, y se nota justo donde más se
usa —las guías y el hero—, donde alrededor todo es glass.

El propietario lo pidió mirando los docs de Mantine, que además pliegan los bloques largos con un
«Expand code». Nuestras guías tienen bloques de 25 líneas que empujan el resto de la página fuera de
la vista.

## Decisión

### 1. La superficie sale del `variantMap`, no de una lista propia

`variant?: "filled" | "light" | "outline" | "glass"`, resuelto con `ResolveVariant` y volcado a
variables CSS, que es lo que ya hacen `Card`, `Paper` y `Alert` desde ADR-038. Con `glass` viaja
también `glass?: GlassLevel`, igual que en `Card`.

**Sin `variant` no cambia nada**: la calibración de `surface.sunken` + `border.subtle` se conserva tal
cual como caso por defecto. Es aditivo por construcción, y por eso no toca las 26 llamadas del sitio.

Se excluyen `gradient`, `glow` y `ghost`. Los dos primeros por `docs/06` §6 —«no son fondo dominante
en lectura larga», y un bloque de código son treinta líneas de lectura—; `ghost` porque un bloque sin
superficie ni filo deja de leerse como bloque.

### 2. El plegado no esconde nada

`expandable` con `collapsedHeight` (240 px por defecto) recorta el bloque y añade un botón. Lo
importante es lo que **no** hace: el `pre` conserva su `tabIndex` y su scroll propio, así que **el
código plegado sigue siendo alcanzable con rueda y con teclado**, y el botón es una comodidad, no la
única vía. Sin JavaScript el bloque nace plegado y se sigue pudiendo recorrer.

Esa es la diferencia con un `<details>`, que era la alternativa obvia: `details` cerrado saca el
contenido del árbol de accesibilidad y del buscador de la página (`Ctrl+F`), y aquí el contenido es
justo lo que la gente busca.

El degradado de desvanecido se apaga con `motion.tier: "minimal"`, no por motion —no anima— sino
porque es el mismo interruptor con el que un tema pide sobriedad.

## Alternativas descartadas

**Una prop `surface` con su propia lista.** Es lo que hacía el componente antes de ADR-038 en otros
sitios, y produjo el censo de `docs/reviews/variantes-cobertura-2026-07-28.md`: recetas cromáticas a
mano que divergen del contrato y entre sí.

**Plegar con `max-height` sin botón, confiando en el scroll.** Es lo que hay hoy con `maxHeight`, y no
resuelve el problema: un bloque de 240 px con scroll interno atrapa la rueda del ratón cuando lo que
querías era seguir bajando por la página.

## Consecuencias

- `CodeHighlightTabs` hereda las cuatro props por su `tabs`, que ya es `Omit<CodeHighlightProps, …>`.
- Dos textos nuevos en `CODE_HIGHLIGHT_LABELS` —`expand` y `collapse`—, en inglés por ADR-120.
- El presupuesto de `CodeHighlight` sube por `ResolveVariant`, que ya viajaba en el bundle de quien
  usa `Card` o `Button`: es coste compartido, no nuevo.
