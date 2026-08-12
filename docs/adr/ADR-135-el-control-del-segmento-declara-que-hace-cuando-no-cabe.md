# ADR-135 — El control del segmento declara qué hace cuando no cabe

- **Estado**: **aceptada** · 2026-08-12 (checkpoint del propietario: prop nueva, sin default nuevo) ·
  **WN**
- **Cambia API pública**: sí, y es **aditivo**: `overflowMode` en `SegmentProps`, y por herencia en
  `TabsProps`. Ninguna llamada existente cambia de comportamiento.
- **Depende de**:
  [ADR-123](ADR-123-el-contenido-del-segmento-mide-su-alto-y-da-la-vuelta.md) (la geometría del
  carril y del indicador) y [ADR-047](ADR-047-segment-en-escala-desplazada.md) (la escala de `size`)
- Lo destapó el propietario mirando el sitio en un móvil: la barra de secciones de `/guides` se sale
  de la pantalla.

## Contexto

`Segment.Control` es un `inline-flex` sin `flex-wrap` cuyos tabs llevan `white-space: nowrap`. Mide
lo que sumen sus items y **no tiene ni envoltura ni scroll**: cuando no cabe, desborda a su padre y
se lleva por delante el ancho de la página.

Se ve en el sitio, en `apps/web/src/islands/guides-nav.tsx`: son las **seis secciones** que fijó
[ADR-127](ADR-127-las-guias-se-parten-en-seis-secciones.md) —`getting-started`, `components`,
`theming-styles`, `hooks`, `form`, `native`—. Con `size="sm"`, cada tab paga `paddingInline: md` (32
px) más su rótulo, y el control pide ~580 px. En un viewport de 360-390 px eso son ~200 px de
desborde horizontal en **todas** las páginas de guías.

No es un defecto del sitio: es que el componente no tiene respuesta para el caso. Cualquier consumidor
con más de tres o cuatro tabs y un móvil delante se lo encuentra igual.

### Por qué `flex-wrap: wrap` no era la respuesta obvia

El indicador es **unidimensional**. `use-segment-indicator.ts` mide solo `x` y `width`
(`box.left - base`), y `Segment.css.ts` fija `top`, `bottom` y `height` en la píldora. Con el control
envuelto en dos filas, la píldora aterriza en la `x` correcta **de la primera fila**: queda flotando
sobre el tab equivocado. El arrastre tiene el mismo techo — `Rubber(origen + offset.x, 0, max)` acota
un eje.

Envolver, entonces, no es una línea de CSS: es pasar el indicador a dos ejes.

## Decisión

### 1. Una prop en la raíz, con tres modos, y el de hoy por defecto

```ts
export type SegmentOverflowMode = "visible" | "scroll" | "wrap";

overflowMode?: SegmentOverflowMode | undefined;   // default: "visible"
```

Vive en `SegmentProps` y viaja por el contexto, como ya hacen `size`, `fullWidth` y `draggable`: el
consumidor lo declara una vez en la raíz y `Segment.Control` lo lee. `Tabs`, que es un atajo sobre
este compound, lo hereda sin trabajo.

`"visible"` es **exactamente el comportamiento de hoy** —el control desborda—, y es el default. Un
catálogo a punto de congelarse no cambia por debajo lo que ya renderizan 158 fichas y dos apps; quien
quiera otra cosa lo pide.

El nombre no es `overflow` porque **ya existe**: `overflow`, `overflowX` y `wrap` están entre las 129
style props de `utils/style-registry.ts`, y `SegmentProps extends StyleProps`. Declarar `overflow`
aquí chocaría de tipos con la style prop del mismo nombre, que es la que gobierna el `div` del
control. `overflowMode` no colisiona y dice lo que es.

### 2. `"scroll"`: el carril se desliza, y la matemática del indicador no se entera

El control gana `overflow-x: auto` con la barra oculta (`scrollbar-width: none` y el
pseudo-elemento de WebKit) y `max-width: 100%`.

**El indicador no cambia**, y esa es la razón de que este sea el modo recomendado: `Measure()` toma
`base` del `getBoundingClientRect().left` del contenedor y cada item de su propio `left`. Al
desplazar el scroll, los dos se mueven lo mismo, así que `box.left - base` sigue siendo la posición
en coordenadas de contenido. La píldora, que es un absoluto dentro del contenedor de scroll, se
desplaza con el contenido por la misma razón.

**El arrastre se apaga en este modo.** El gesto `onPan` del indicador y el scroll táctil compiten por
el mismo dedo en el mismo eje, y el que debe ganar es el del sistema: es el que trae inercia,
rebote y la barra de desplazamiento del navegador. `draggable` sigue existiendo y sigue mandando en
los otros dos modos.

**El tab activo se trae a la vista.** Sin eso, mover la selección con el teclado deja el foco fuera
de la ventana visible, que es un fallo de 2.4.7 (Focus Visible). Se hace con
`scrollIntoView({ inline: "nearest", block: "nearest" })` sobre el tab activo, y **solo cuando ya hay
geometría**, para no pelearse con la restauración de scroll del navegador en la hidratación.

### 3. `"wrap"`: el indicador pasa a dos ejes

El control gana `flex-wrap: wrap` y `Rect` pasa de `{ x, width }` a `{ x, y, width, height }`: `y`
se mide como `box.top - base_top` con el mismo `base` que ya se usaba para la horizontal, y `height`
de la propia caja. Hay dos `MotionValue` más con su muelle, y la píldora suelta el `top` y el
`height` del CSS en este modo —los sigue llevando en los otros dos, donde son correctos y no cuestan
una medida—.

La medida pasa a tomarse desde el **cuadro de relleno** y en coordenadas de contenido —
`getBoundingClientRect() + clientLeft/clientTop − scrollLeft/scrollTop`— y no desde el cuadro de
borde. Hacen falta las dos correcciones: el borde de 1 px del control porque el indicador es un
absoluto cuyo bloque contenedor es el cuadro de relleno, y el desplazamiento porque ese bloque
contenedor **se desplaza con el contenido** mientras que `getBoundingClientRect` devuelve la posición
visual. Sin lo segundo, la píldora se quedaba atrás en cuanto la barra se movía.

Tiene un efecto medible fuera de los modos nuevos: la píldora venía saliendo **1 px a la derecha** de
su tab, porque la posición se medía desde el borde y se aplicaba desde el relleno. En `"visible"` se
mueve ese píxel, hacia donde debía estar. El `top: calc(space.u2_5 - 1px)` del indicador **no** es lo
mismo y se queda: ahí el `-1px` compensa el borde a propósito para que la píldora encaje en el hueco,
y en `"wrap"` no hace falta porque la posición vertical ya viene medida.

**El arrastre también se apaga aquí**, y por un motivo distinto: `Rubber` acota un eje y un gesto
que cruza filas no es un arrastre de segmento, es otra cosa. Con teclado y click el control sigue
completo, que es lo que exige el contrato de a11y; el gesto siempre fue mejora progresiva.

La consecuencia a tener presente es que **el alto del control deja de ser estable**: pasa de una fila
a dos según el ancho disponible y el rótulo. Es aceptable en una barra de navegación y es malo dentro
de una fila de altura fija, y por eso no es el default.

### 4. `fullWidth` aprende a encoger de verdad

Aparte de los tres modos, `fullWidth` tenía un defecto propio: los tabs son `flex: 1` **sin
`min-width: 0`**, y un flex item con `min-width: auto` no baja de su ancho de contenido. Con los
rótulos en `nowrap`, el `width: 100%` que promete `fullWidth` es una promesa que el contenido rompe.

Los tabs ganan `min-width: 0` y `overflow: hidden` **solo en la variante `fullWidth`**. Fuera de
ella el control se dimensiona por su contenido y no hay presión que encoja nada, así que aplicarlo a
la base sería cambiar el modo `"visible"` por la puerta de atrás — justamente lo que este ADR se
compromete a no hacer.

El recorte es duro, sin puntos suspensivos: `text-overflow: ellipsis` no se aplica a un contenedor
flex, y el rótulo de un item es `ReactNode` —`ProductSurface` le pasa un `ColorSwatch` con un
`Text`—, así que envolverlo en un bloque propio para ganar la elipsis le cambiaría la caja a todo el
que hoy le pasa un nodo. Con tres o cuatro tabs cortos, que es para lo que sirve `fullWidth`, el
recorte no llega a verse; quien tenga rótulos largos tiene `"scroll"`.

## Alternativas descartadas

**Envolver por defecto.** Es lo que pide el caso del sitio y lo que pidió el propietario en primera
lectura. Se descarta porque cambia el alto de un componente que hoy mide una fila en 158 fichas, dos
playgrounds y el theme creator, y porque ADR-123 fijó la estabilidad de la caja como propiedad
deseable del compound. Un default que salta de alto según el ancho del padre es exactamente lo que
ese ADR evitó en el otro eje.

**Un breakpoint dentro del componente** —envolver por debajo de `tablet`—. Nebula no tiene
componentes que decidan por su cuenta a qué ancho cambian de forma: los breakpoints son del
consumidor, vía style props responsivas. Meter uno aquí abriría la puerta a que cada componente
traiga el suyo.

**`Scroll` en vez de `overflow-x`.** El componente `Scroll` del catálogo trae momentum y barras
propias, y usarlo aquí metería un compound dentro de otro por una barra que precisamente queremos
invisible. El coste de `overflow-x: auto` es una declaración.

## Consecuencias

- `guides-nav.tsx` pasa a `overflowMode="scroll"`, que es el caso que destapó esto. El desborde
  horizontal de las páginas de guías en móvil desaparece sin que la barra cambie de alto.
- Los cuatro `Segment` de `theme-panel.tsx` **no cambian**: se midieron y caben en los 368 px del
  panel. El `min-width: 0` de `fullWidth` los cubre si algún día un idioma alarga los rótulos.
- El gesto de arrastre deja de estar disponible en dos de los tres modos. Queda anotado en
  `Segment.md` junto al resto del contrato de motion.
- `SegmentedControl`, que es el selector suelto y comparte la barra, **no** recibe la prop en este
  ADR: no se ha medido un caso que la pida y añadir superficie sin caso es lo que WN está quitando.
