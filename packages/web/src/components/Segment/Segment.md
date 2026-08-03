# Segment

Compound que agrupa un control de segmentos con sus paneles, siguiendo la forma del `Segment` de fonicredito (ADR-026). El valor vive en el contexto del root, así que el consumidor no cablea estado entre el control y el contenido.

```tsx
<Segment defaultValue="resumen">
  <Segment.Header>…</Segment.Header>
  <Segment.Control data={[{ value: "resumen", label: "Resumen" }, …]} />
  <Segment.Content>
    <Segment.Content.Item value="resumen">…</Segment.Content.Item>
  </Segment.Content>
  <Segment.Footer>…</Segment.Footer>
</Segment>
```

## Qué piezas del compound aceptan style props

Las cuatro que renderizan un elemento propio: `Segment` (la columna raíz), `Segment.Control` (la barra), `Segment.Content` (el viewport) y `Segment.Header` / `Segment.Footer`. Cada una las aplica a su propio nodo, así que `Segment.Control` puede llevar `maw` sin que la raíz cambie de ancho.

`Segment.Control.Item` y `Segment.Content.Item` **no** las aceptan: devuelven `null` y existen solo para declarar datos que lee el padre, como `Conditional` o `Portal`. La consecuencia práctica es que el panel de un `Content.Item` se sigue estilando por su `className`, que es lo que el padre le pasa al `div` del panel. Abrirlo exigiría que `SegmentContent` extrajese las style props de las props de cada hijo, y eso se decidirá con evidencia de uso.

## El rol ARIA depende de si hay paneles

`Segment.Control` emite `tablist` + `tab` + `aria-controls` **solo cuando el Segment tiene un `Segment.Content`**; sin paneles cae a `radiogroup` + `radio`. Un `tablist` cuyas pestañas no controlan nada es ARIA incorrecto, y ese es también el motivo de que `SegmentedControl` siga existiendo aparte: es el selector de valor suelto y siempre es un radiogroup.

El root descubre los paneles porque `Segment.Content` los registra en el contexto; hasta ese registro el control se comporta como radiogroup.

## Motion y gesto

El indicador y los paneles se mueven con `MotionValue` + `useSpring` usando `theme.motion.spring`, no con transiciones CSS. Se eligió el gesto `onPan` en vez de `drag` de motion porque `drag` mueve el elemento 1:1 con el puntero: alimentando el `MotionValue` a mano y leyendo su versión con spring, el arrastre sale suavizado en vez de lineal.

Al soltar, el destino se resuelve por **posición o velocidad**: si el gesto supera el umbral de flick se avanza un paso en su dirección; si no, gana el segmento cuyo centro queda más cerca. Los segmentos deshabilitados se saltan.

El arrastre está acotado por una banda elástica con resistencia asintótica (`utils/rubber.ts`): pasado el extremo el desplazamiento se comprime y **nunca supera el límite configurado**, en vez de crecer sin fin.

Todo el motion —animación y gesto— se apaga con `prefers-reduced-motion` y con `motion.tier: "minimal"`. Sin él, el control sigue siendo operable por click y teclado: el gesto es una mejora progresiva, nunca el único camino.

## Por qué el catálogo entero carga `domMax`

`domAnimation` **no incluye gestos de arrastre**, y aquí hacen falta: el indicador de `Segment.Control` y el viewport de `Segment.Content` se mueven con `onPan`, igual que `Switch` y `SegmentedControl`. Cuando cada componente montaba su propio `LazyMotion`, esos cuatro cargaban `domMax` y los otros once `domAnimation`, de modo que bastaba con juntar un Switch y un botón en la misma vista para descargar los dos paquetes.

Desde ADR-034 hay un solo `LazyMotion`, en `NebulaProvider`, y sus features son `domMax` precisamente porque este componente lo exige. El invariante lo vigila `src/__tests__/motion-provider.test.tsx`.

## Por qué el indicador es `surface.overlay` y no `surface.base`

Era `base`, y en `dark` eso es **exactamente el color del canvas** (`#080a12`) sobre una pista de `#06080f`: la píldora activa quedaba a 1.01 de su fondo, el mismo umbral que ADR-044 declaró como «no es un hover débil, es ninguno». En los temas light no se notaba porque allí `base` es blanco puro contra una pista gris.

`overlay` es la superficie más elevada del contrato, que es lo que la píldora es: la pieza que flota sobre la ranura. El cambio deja el paso en 1.14 en dark y **no toca los temas light**, donde `overlay` y `base` valen lo mismo.

| Tema        | antes | después |
| ----------- | ----: | ------: |
| dark        |  1.01 |    1.14 |
| sober-light |  1.11 |    1.20 |
| light       |  1.06 |    1.06 |
| playful     |  1.06 |    1.06 |

**Residual anotado**: la pista sigue en `surface.sunken`, que en dark está por debajo del canvas (1.01 contra él), así que el control no tiene contorno propio en ese tema — se lee por la píldora, no por la ranura. Corregirlo es el mismo problema de simetría entre esquemas que la calibración del 2026-07-28 dejó fuera a propósito: obligaría a recalibrar `sunken` u `overlay` globalmente. Se resuelve en el tramo de ADR-038, cuando Segment pase a resolver su superficie desde `variantMap`.

## La píldora activa sale del `variantMap`

`SegmentVariant` es `Extract<Variant, "filled" | "light">` y viaja por el contexto hasta
`Segment.Control`, que resuelve `indicatorColor` ← `resolved.background` e `indicatorFg` ←
`resolved.foreground` para el label del item activo. Sin `variant`, la píldora conserva la calibración
de `surface.overlay` documentada arriba: el cambio es aditivo.

**`ghost` se excluyó a propósito**, aunque ADR-038 lo listaba. Su fondo es transparente, de modo que la
píldora desaparecería y la selección quedaría expresada **solo** por el color del texto. Eso es
información de estado de un componente de UI, que WCAG 2.2 exige que sea perceptible con 3:1 (criterio
1.4.11), y dos labels que solo difieren en tono no lo garantizan. `Tabs`, que es un atajo sobre este
compound, hereda el mismo subconjunto.

## Por qué `size` empieza en `sm` y no en `xs` (ADR-047)

`docs/06` §4.1 fija que lo interactivo usa `sizes.control` **desplazada un peldaño**, y que por debajo
de `control.xs` no hay peldaño al que desplazarse. Un `radiogroup` o un `tablist` son objetivos
táctiles, así que la otra escala —`sizes.compact`— está vedada aquí: la propia sección dice que lo que
la consuma no puede ser interactivo, aunque sus valores (20–36) aterricen casi exactos sobre el diseño.

De ahí que `md` sea `control.sm` (36) y no `control.md` (42), y que `SegmentSize` no ofrezca `xs`. Es la
misma decisión que ya tomó `Pagination`, y por el mismo motivo: **un `Segment md` alinea con un input
`sm`**. `Tabs` lo hereda porque es un atajo sobre este compound.

## Los dos `4px` del contenedor son el mismo valor

`control` tiene `padding: space.xs` y el indicador tiene `top`/`bottom: space.xs`. **Deben leer el mismo
token**: el indicador se posiciona en absoluto dentro del contenedor, así que si el padding y sus insets
se separan, la píldora deja de encajar en el hueco. Antes eran dos literales `"3px"` sincronizados a
mano, que es exactamente lo que ADR-033 prohíbe y lo que el censo de los `.css.ts` no vio.

El radio del contenedor, del indicador y de cada tab es `full` en los tres, no `md`/`sm`: el control se
lee como conmutador y no como caja, que era el defecto reportado en dark.
