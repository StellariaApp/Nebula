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

## El alias `-webkit-` NO se escribe a mano

La hoja declara **solo `backdropFilter`**. El alias `-webkit-backdrop-filter` lo añade el build —se
comprueba en el CSS emitido: `Button`, que nunca lo escribió, sale con las dos propiedades y en el
orden correcto—, así que Safari anterior a la 18 queda cubierto sin ponerlo.

Escribir las dos en la misma regla **borra la estándar**: de `backdropFilter` y `WebkitBackdropFilter`
sobrevive la última, y como el alias iba después, el CSS emitido era

```css
.GlassSurface_glass_surface__1duyvnb0{ …; -webkit-backdrop-filter: var(--backdrop) }
```

Medido en Chromium 149 sobre esa regla, `getComputedStyle(...).backdropFilter` devuelve `none`: el
panel pintaba su fondo translúcido y **el desenfoque no existía** en Chrome, Edge ni Firefox. Es el
mismo defecto que ADR-070 §19 documentó en `Nav` dentro de un bloque `selectors`; lo que ese ADR da
por bueno —que `GlassSurface` y `BlurOverlay` se salvan por declararlo al nivel raíz del estilo— no lo
era: la colisión no depende de la anidación.

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

Va **con alfa, y el alfa sube con el nivel** —de 0.05 a 0.12 en blanco sobre oscuro, de 0.07 a 0.10
en negro sobre claro— porque el velo es fino. ADR-118 lo puso plano cuando subió el velo a 0.78–0.90,
y dejó escrito el trato: si el velo vuelve a adelgazar, el filo vuelve a llevar alfa. Es lo que hace
[ADR-178](../../../../../docs/adr/ADR-178-el-velo-vuelve-a-ser-cristal-y-la-intensidad-es-un-eje.md).

Un filo plano sobre un velo fino no compone con lo que tiene detrás: se pega encima y se lee como una
línea muerta —medido, 3.6 sobre un degradado—. Con alfa compone, así que su ratio deja de oscilar con
la superficie; el plano oscilaba entre 1.13 y 1.21 y tres de sus pares se caían por debajo del suelo
de 1.15 al bajar el velo.

Que el alfa acompañe al nivel es lo que evita el mismo defecto en pequeño: `strong` aguanta un canto
definido porque su relleno ya define el panel, y `veil` no, porque ahí el filo sería lo único opaco de
una superficie que casi no está. **El claro tiene menos margen que el oscuro**: negro sobre velo claro
contrasta más por unidad de alfa, así que su rampa arranca en 0.07 —un 0.06 mide 1.14 y no pasa el
gate— y sube menos.

De ahí que el componente exponga `borderColor` como var propia en vez de la regla entera: las cinco
regiones de `AppShell` pintan su filo con `borderBlockEnd`/`borderInlineEnd` —longhands que un
shorthand no puede alimentar— y la leen con `fallbackVar`. Así el filo **sigue al `level` de la
instancia** en vez de quedar clavado en la hoja: `<AppShell.Nav level="strong">` pinta velo `strong` y
filo `strong`.
