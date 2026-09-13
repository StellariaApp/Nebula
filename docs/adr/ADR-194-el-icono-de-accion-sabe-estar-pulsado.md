# ADR-194 — El icono de acción sabe estar pulsado, y lo dice con el relleno

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `pressed` y `pressedVariant` en `ActionIcon`.
- **Toca**: `packages/web/src/components/ActionIcon/`.
- Es el hallazgo #12 de C2 y `docs/07` §12.

## Contexto

Guardar, me gusta, silenciar, pantalla completa: un `ActionIcon` que conmuta. Rosette lo escribió
tres veces de tres maneras hasta fijar `piece-action.tsx`: `aria-pressed={on}` y
`variant={on ? "filled" : "glass"}`, porque **el estado se pinta con el relleno y no con el color
del trazo** —un icono rosa sobre cristal se lee como «este botón es de marca», no como «esto ya
está guardado»—. `video-player.tsx` hace lo mismo con `light`/`ghost` para el silencio.

`ActionIcon` publica `data-pressed` mientras se mantiene el botón (React Aria `isPressed`), que es
otra cosa: el instante del clic, no el estado.

## Decisión

```tsx
<ActionIcon pressed={on} pressedVariant="filled" variant="glass" aria-label={on ? quitar : poner} />
```

- `pressed` pone `aria-pressed` y `data-toggled="true"`, y **cambia la variante** a `pressedVariant`
  (`"filled"` por defecto). Sin `pressed` el componente es el de siempre.
- No añade un `onToggle`: `onPress` con el booleano fuera es lo que ya hace cualquier conmutador del
  catálogo (`Switch`, `Chip`).
- La regla queda escrita en `ActionIcon.md`: el estado va en el relleno, no en el trazo.

## Alternativas

- **Solo documentar la receta**: es una línea, pero la regla («relleno, no trazo») no se impone
  sola y los tres botones de Rosette lo demuestran.
- **`variant="toggle"`**: mezcla estado y receta de color; no encaja con el `variantMap`.

## Consecuencias

- `piece-action.tsx` de Rosette se reduce al `stopPropagation` del clic dentro de una tarjeta-enlace,
  o desaparece si `MediaCard` (ADR-198) lo hace por él.
- Test: `pressed` anuncia `aria-pressed` y conserva el nombre; la variante cambia y vuelve.
