# ADR-191 — El carril encogido conserva el nombre accesible de sus enlaces

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: **no**. Es corrección: el rótulo del enlace se esconde con la receta de
  `VisuallyHidden` en vez de `display: none`, y `NavLink` reenvía `aria-label`.
- **Toca**: `packages/web/src/components/AppShell/AppShell.css.ts`,
  `packages/web/src/components/NavLink/NavLink.tsx`.
- Es `Rosette/docs/refactor-a-nebula.md` §6.3, verificado **abierto** en 1.1.13.

## Contexto

Con el carril encogido, `AppShell.css.ts` pone `display: none` al `label` del enlace
(`[data-sidebar-collapsed='true'] &`, línea 228) y por debajo de `laptop` (línea 231). El
`leftSection` es `aria-hidden` porque es un icono. El resultado es un `<a>` sin nombre accesible en
**toda** app Nebula por debajo de `laptop`, barra inferior del móvil incluida: `link-name`, serio,
en axe. Ningún gate lo caza porque las stories de `AppShell` corren a ancho de escritorio.

El rodeo de Rosette es colgar un `VisuallyHidden` de `rightSection`, único hueco que sobrevive.
`NavLink` tampoco deja pasar un `aria-label`: `ExtractStyleProps(style_rest)` devuelve `className` y
`style` y descarta el resto, así que el atributo no llega al `<a>`.

## Decisión

1. El `label` encogido pasa a la receta de `VisuallyHidden` (`position: absolute; width: 1px;
clip…`) en vez de `display: none`. Sigue sin verse y sin ocupar sitio; el nombre se queda.
2. `NavLink` reenvía `aria-label` y `aria-current` al `<a>` (y a `component`). Es lo que
   ADR-098 exige de toda ranura que se pinta cruda.
3. La story `AppShell/Rail` gana un viewport de `tablet` y otro de `phone`, y el gate `a11y` los
   corre.

## Alternativas

- **`aria-label` derivado del texto del `Label`**: duplica el nombre cuando el rótulo se ve, y
  `Label` puede llevar dos textos (corto y largo, como en Rosette).
- **Dejar el rodeo**: es un `VisuallyHidden` en un `rightSection` que ya lleva un contador. Y es un
  fallo de la librería, no del producto.

## Consecuencias

- Rosette quita el `VisuallyHidden` de `Rail`. Polaris no tenía rodeo, así que hoy incumple.
- La barra inferior (ADR-183) muestra el rótulo corto de todos modos; el cambio le afecta solo al
  estado `collapsed` del carril mini.
