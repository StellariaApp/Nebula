# ADR-193 — El dock de preferencias es un componente y se recoge solo

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `Dock` en el core.
- **Toca**: `packages/web/src/components/Dock/` (nuevo), `packages/web/src/index.ts`.
- Es el hallazgo #9 de C2 y `docs/07` §4.3.

## Contexto

Rosette, Stellaria, Polaris e Iris tienen cada uno su `dock.tsx`: un `Affix` abajo a la derecha con
un `GlassSurface level="strong" r="lg"` en fila para escritorio y, bajo `phone`, otro `GlassSurface`
con un `ActionIcon` que abre un `Popover placement="top end" width={220}` con los mismos controles
apilados. Los controles cambian (idioma, moneda, tema; Polaris no tiene moneda) y **la caja no
cambia nunca**. Cuatro copias, con `data-floating="dock"` y las mismas cuatro medidas.

Lo que hace que sea un componente y no una receta es el pliegue: los tres controles miden 307 px en
fila y un teléfono tiene 390, así que bajo `phone` la fila se recoge en un botón. Eso lo decide la
caja, no los controles, y los controles tienen que saber si van en fila o en columna (`stacked`).

## Decisión

```tsx
<Dock aria-label={dock.aria} compactBelow="phone" trigger={<Icon name="settings" />} width={220}>
  {(stacked) => <>…los controles, en fila o apilados…</>}
</Dock>
```

- `Dock` monta el `Affix` (posición por defecto `{ bottom: 24, right: 24 }`, sobreescribible con
  `position`), las dos superficies con `data-floating="dock"` y el `Popover` del pliegue.
- `children` es un nodo o una función `(stacked: boolean) => ReactNode`. Con la función, el
  consumidor pinta la misma cosa dos veces sin duplicar el fichero.
- `compactBelow` es un punto de ruptura (`"phone"` por defecto) o `false` para no plegarse nunca.
- Ranuras: `surfaceProps`, `compactProps`, `popoverProps`, `triggerProps` (ADR-098).

## Alternativas

- **Story `Composition` en `Affix.md`** que fije la receta: más barato, pero deja cuatro copias que
  ya divergen (Polaris usa `Tooltip` de otra forma, Iris no lleva `aria-label` en la caja).
- **Meter los controles en Nebula** (`Dock.Language`, `Dock.Currency`, `Dock.Theme`): los datos y
  las acciones (cookies, `router.replace`) son del producto. Solo la caja es de Nebula.

## Consecuencias

- Cuatro `dock.tsx` se quedan con sus controles y pierden la caja. `DockSettings` de Rosette pasa de
  70 líneas a 25.
- `Dock` es un patrón (≤70 kB) que compone `Affix`, `GlassSurface`, `Popover` y `ActionIcon`; se
  mide y va en `composite_layer`.
- `PopoverUser` (el usuario del pie del carril) **no** es un `Dock`: vive en `Sidebar.Footer` y no
  flota. Se queda en el producto.
