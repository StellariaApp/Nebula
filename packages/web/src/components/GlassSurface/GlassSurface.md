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

1. **`effects.glass.enabled === false`** (sober) — el componente pinta `colors.surface[fallbackSurface]`
   con borde `border.subtle` y `backdrop-filter: none`. Se decide en JS porque `glass.enabled` es data
   no-CSS del tema (`docs/02` §4): no existe como var del contract. El atributo `data-glass="off"` deja
   la degradación observable en tests y en el inspector.
2. **Sin soporte de `backdrop-filter`** — `@supports not ((backdrop-filter: blur(1px)) or
   (-webkit-backdrop-filter: blur(1px)))` sustituye el fondo translúcido por la var `solidBg`. Sin esa
   rama la superficie quedaría semitransparente sin desenfoque, que es el peor de los dos mundos: se
   ve el contenido de detrás **nítido** a través del panel.
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

## `border` es un shorthand, no un color

`effects.glass.surface.*.border` del tema es la regla completa (`"1px solid rgba(255,255,255,0.12)"`),
no un color. Por eso el recipe aplica `border: <var>` en la variante `withBorder` en vez de componer
`borderWidth`/`borderStyle`/`borderColor` como hace `Paper`: intentar separarla obligaría a parsear el
token en runtime.
