# ADR-116 — `Button` es polimórfico

- **Estado**: aceptada · 2026-08-08 (decisión del propietario al revisar la portada) · **DS2 · W5**
- **Cambia API pública**: sí, y **solo añade**. Ninguna prop actual cambia de tipo ni de significado.
- Lo destapó construir el sitio con Nebula, que es el **principio 1** de la fase DS: cada página es
  una prueba de producción del catálogo.

## Contexto

`Button` era **el único control del catálogo que no puede cambiar su elemento**. `Box`, `Text`,
`Anchor`, `Title` y `Blockquote` aceptan `component?: ElementType` desde ADR-104; `Button` no acepta
ni `component` ni `href`.

La consecuencia se vio al escribir la portada del sitio público: **no se puede hacer un CTA primario
que navegue**, que es literalmente el primer elemento de cualquier landing. Las salidas que quedaban
eran las tres malas:

- **`Anchor` con style props**: obliga a reimplementar a mano la receta de variante del botón, que es
  justo lo que un design system no debe pedirle a nadie.
- **`Button` dentro de un `<a>`**: anida dos elementos interactivos. Falla a11y y el foco se duplica.
- **`onPress` con `router.push`**: rompe abrir en pestaña nueva, el clic con rueda, el menú
  contextual y el rastreo del enlace. Un botón que navega no es un enlace.

## Decisión

**`Button` acepta `component?: ElementType`, por defecto `"button"`.**

- `useButton` de React Aria recibe `elementType`, así que sobre un elemento sin semántica de botón
  —un `span`— **añade él mismo `role="button"`, el `tabIndex` y el manejo de Espacio y Enter**. El
  contrato de teclado no se degrada al cambiar la etiqueta.
- **Un `<a>` con `href` es la excepción, y es a propósito.** Medido: `useButton` le ponía
  `role="button"` y `tabIndex="0"`, y eso lo saca de la lista de enlaces del lector de pantalla y lo
  anuncia como botón cuando lo que hace es navegar. Sobre un ancla con `href` se descartan `role`,
  `tabIndex` y los manejadores de teclado, de modo que **se queda con su semántica nativa de
  enlace**: Enter navega por el navegador —así que `onPress` tampoco se pierde, porque llega por el
  `click`— y Espacio vuelve a desplazar la página, que es lo que un enlace debe hacer.
- El componente de motion se crea con `m.create()` **memoizado por `component`**: crearlo en cada
  render remontaría el nodo y perdería el foco.
- **`type` solo se escribe cuando el elemento es un `button`.** Un `<a type="button">` es HTML
  inválido, y era lo que salía de pasar el `type` incondicionalmente.

```tsx
<Button component="a" href="/docs/installation">
  Get started
</Button>
```

## Alternativas descartadas

**Una prop `href` en vez de `component`.** Resuelve el caso del enlace y nada más, y deja a `Button`
fuera de la convención que ADR-104 fijó para todo el catálogo. Con `component` funcionan además el
`Link` de Next, el de un router y un `label` para un input de fichero.

**`asChild` al estilo Radix.** Requiere `Slot` y clonar el hijo, no encaja con el `mergeProps` de
React Aria que el componente ya usa, y es un segundo patrón de composición en un catálogo que ya
tiene uno.

## Consecuencias

- **Aditivo**: quien no pase `component` no nota nada. El defecto sigue siendo `button`.
- **`ButtonProps` deja de extender `ComponentPropsWithoutRef<"button">` a secas**: pasa a ser
  polimórfico como `TextProps`, con `ButtonSlotProps` para las ranuras que lo pintan, siguiendo la
  distinción que ADR-104 §«Por qué `TextSlotProps` y no `TextProps`» ya dejó escrita.
- **`ActionIcon` queda fuera de este ADR** y sigue sin `component`. Tiene el mismo problema y se
  abordará con el mismo patrón cuando aparezca su caso de uso.
- **Cuatro tests nuevos** fijan lo que decide este ADR: que el ancla es un `link` y no un `button`,
  que no lleva `type`, que sin `component` nada cambia, y que sobre un `span` sí aparecen el rol y el
  foco que pone React Aria.
- **El presupuesto de `Button` no se mueve**: 40,38 kB brotli contra un tope de 42,25. `m.create` es
  la misma fábrica que `m.button` ya usaba por dentro, así que el cambio no añade código nuevo al
  bundle; lo que se añade es la memoización por `component`.
