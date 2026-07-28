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
