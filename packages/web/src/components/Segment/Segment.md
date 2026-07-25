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

## El rol ARIA depende de si hay paneles

`Segment.Control` emite `tablist` + `tab` + `aria-controls` **solo cuando el Segment tiene un `Segment.Content`**; sin paneles cae a `radiogroup` + `radio`. Un `tablist` cuyas pestañas no controlan nada es ARIA incorrecto, y ese es también el motivo de que `SegmentedControl` siga existiendo aparte: es el selector de valor suelto y siempre es un radiogroup.

El root descubre los paneles porque `Segment.Content` los registra en el contexto; hasta ese registro el control se comporta como radiogroup.

## Motion y gesto

El indicador y los paneles se mueven con `MotionValue` + `useSpring` usando `theme.motion.spring`, no con transiciones CSS. Se eligió el gesto `onPan` en vez de `drag` de motion porque `drag` mueve el elemento 1:1 con el puntero: alimentando el `MotionValue` a mano y leyendo su versión con spring, el arrastre sale suavizado en vez de lineal.

Al soltar, el destino se resuelve por **posición o velocidad**: si el gesto supera el umbral de flick se avanza un paso en su dirección; si no, gana el segmento cuyo centro queda más cerca. Los segmentos deshabilitados se saltan.

El arrastre está acotado por una banda elástica con resistencia asintótica (`utils/rubber.ts`): pasado el extremo el desplazamiento se comprime y **nunca supera el límite configurado**, en vez de crecer sin fin.

Todo el motion —animación y gesto— se apaga con `prefers-reduced-motion` y con `motion.tier: "minimal"`. Sin él, el control sigue siendo operable por click y teclado: el gesto es una mejora progresiva, nunca el único camino.

## Por qué `domMax` y no `domAnimation`

El resto del sistema carga `domAnimation`, que **no incluye gestos de arrastre**. Los componentes con pan (`Switch`, `Segment.Control`, `Segment.Content`, `SegmentedControl`) cargan `domMax`. Es la razón de que sus budgets suban de banda.
