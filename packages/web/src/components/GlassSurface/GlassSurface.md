# GlassSurface

Primer consumidor real de `effects.glass` del contrato. Hasta W3 la receta glass solo se alcanzaba a
través de `variantMap.glass` en `ResolveVariant`; aquí el material es el componente.

## Dónde SÍ y dónde NO (el guardrail)

La regla viene de `docs/06` §6 y de la investigación de estilo de Stellaria §4.5, y está repetida en el
JSDoc de `GlassSurfaceOwnProps` porque es la parte del contrato que no se puede verificar por tipos:

- **SÍ**: top bars, cards destacadas, paneles resumen, empty states, onboarding, command palette,
  drawers premium.
- **NO**: tablas densas, celdas de data grid, formularios críticos largos, tickets POS y vistas
  financieras de precisión.

No es una preferencia estética. `backdrop-filter` obliga al compositor a releer y desenfocar la región
que hay detrás **en cada repintado**; en una tabla que scrollea, eso es un blur por frame sobre un área
grande. Y el material resta contraste efectivo justo donde el usuario compara cifras.

**No se anida.** Dos capas de `backdrop-filter` encadenadas suman coste y dejan de leerse como
material: la segunda desenfoca un fondo ya desenfocado y el resultado es una superficie lechosa. Si
necesitas jerarquía dentro de un glass, usa `Paper` o un borde, no otro `GlassSurface`.

## Las tres degradaciones

1. **`effects.glass.enabled === false`** — el componente pinta `colors.surface[fallbackSurface]`
   con borde `border.default` y `backdrop-filter: none`. Se decide en JS porque `glass.enabled` es data
   no-CSS del tema (`docs/02` §4): no existe como var del contract. El atributo `data-glass="off"` deja
   la degradación observable en tests y en el inspector.
2. **Sin soporte de `backdrop-filter`** — `@supports not ((backdrop-filter: blur(1px)) or
(-webkit-backdrop-filter: blur(1px)))` sustituye el fondo translúcido por la var `solidBg` **y el filo
   translúcido por `solidBorderColor`**. Sin esa rama la superficie quedaría semitransparente sin
   desenfoque, que es el peor de los dos mundos: se ve el contenido de detrás **nítido** a través del
   panel. Y sin la mitad del filo quedaría un relleno opaco con un borde que compone contra algo que
   ya no está.
3. **Forced colors** — `background: Canvas` y `backdrop-filter: none`. La capa de grano se oculta con
   `display: none` desde `styles/noise.css.ts`.

## Por qué el grano va con `z-index: -1`

La capa de ruido es un `<span>` absoluto. En el orden de pintado de CSS, un elemento posicionado con
`z-index: auto` o `0` se pinta **después** del contenido en flujo, así que el grano taparía el texto.
Con `z-index: -1` cae al paso 3 —debajo del contenido, encima del fondo del contexto de apilamiento— y
el `isolation: isolate` de la raíz impide que se escape al contexto del padre. Es el mismo mecanismo
que el `::after` del glow de `Button` (ADR-021).

El `mixBlendMode: overlay` del grano necesita ese contexto aislado; sin `isolation` mezclaría con lo
que haya detrás del panel, no con el propio panel.

## El filo es un color, y por eso `AppShell` puede seguirlo

`effects.glass.surface.*.borderColor` es un color, nunca la regla completa
([ADR-118](../../../../../docs/adr/ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md)). El ancho
lo pone el consumidor; del material es el color. Un shorthand obligaría a parsear el token en runtime,
que fue lo que llevó a sacar el filo del contrato en ADR-102.

Va **plano, sin alfa**, y eso solo es válido porque el velo pasó a ser opaco en el mismo ADR: con un
velo del 2 % un filo opaco se pega encima del fondo en vez de teñirse con él —medido, 3.6 sobre un
degradado—; con el velo al 78–90 % no queda casi nada detrás con lo que componer, y el mismo filo
plano baja a 1.01–1.11. Las dos decisiones son una sola: **si algún día el velo vuelve a adelgazar,
el filo tiene que volver a llevar alfa.**

De ahí que el componente exponga `borderColor` como var propia en vez de la regla entera: las cinco
regiones de `AppShell` pintan su filo con `borderBlockEnd`/`borderInlineEnd` —longhands que un
shorthand no puede alimentar— y la leen con `fallbackVar`. Así el filo **sigue al `level` de la
instancia** en vez de quedar clavado en la hoja: `<AppShell.Nav level="strong">` pinta velo `strong` y
filo `strong`.
