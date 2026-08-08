# ADR-020 — Identidad visual propia de Nebula (eje `#3F37C9 → #9D4EDD`)

- **Estado**: aceptada · 2026-07-20 (decisión del propietario) · Actualiza `docs/02-theming.md` §3 y las semillas de ADR-009
- **Enmendada por [ADR-028](ADR-028-elevacion-y-materiales-dark.md)** (2026-07-27): la identidad
  incluye ahora también el **tinte del canvas**. La semilla `dark` pasa de `#1c1c1c` (neutro puro) a
  `#161821`, cuyo tono OKLCH (275) es el mismo eje que `indigo #3F37C9`. Cambiar la semilla `dark`
  vuelve a requerir ADR, igual que las de acento.
- **Contexto**: los temas oficiales heredaban las semillas cromáticas de Stellaria (`indigo #6366f1`, `violet #8b5cf6`), que a su vez venían del set de Tailwind/Mantine. Nebula necesita identidad propia, alineada con el sistema visual de la marca Stellaria (dark-first, superficies muy oscuras, tipografía grande, acentos de color sobre fondo neutro) pero con su propio eje cromático.

## Decisión

1. **Semillas nuevas**: `indigo` → `#3F37C9` y `violet` → `#9D4EDD` en `tools/palette-gen/src/seeds.ts`. Las 16 paletas se regeneran con `pnpm gen:palette regen` (OKLCH, ADR-009): las semillas orientan hue y carácter, la curva de luminancia la sigue definiendo el generador, así que la consistencia entre paletas se mantiene.

2. **Se conservan los nombres `indigo`/`violet`** en vez de crear paletas nuevas. Los temas ya apuntan `primary: palettes.indigo` y `accent: palettes.violet`, así que la identidad se propaga a los 4 temas, al `variantMap` y a los gradientes sin tocar más código, y `PaletteName` no crece.

3. **Dark-first**: `nebula-dark` pasa a ser el tema por defecto del `NebulaProvider` y del playground, como la landing de Stellaria. Las stories `Dark` pasan a fijar `nebula-light` para seguir cubriendo ambos schemes en el gate a11y.

4. **`effects.gradients.brand`** se define en el eje nuevo (linear 135°, de `primary.600` a `accent.600`).

## Verificación de contraste (previa a la decisión)

Regenerando con las semillas nuevas, los pasos que usa el `variantMap` mantienen WCAG AA:

| Paso         | Color     | Contraste sobre blanco |
| ------------ | --------- | ---------------------- |
| `indigo.600` | `#5555f3` | 5,28:1                 |
| `indigo.700` | `#4541d3` | 7,12:1                 |
| `violet.600` | `#9141d0` | 5,43:1                 |
| `violet.700` | `#7b2eb3` | 7,28:1                 |

El gate `pnpm check:contrast` (5 temas × 28 pares) es el juez definitivo y debe quedar en verde tras la regeneración.

## Alternativas

- **Paletas nuevas** (`nebula-primary`/`nebula-accent`) dejando el catálogo intacto: rechazada — `PaletteName` crecería a 18 con dos escalas indigo-ish conviviendo y sin uso claro para la vieja.
- **Aplicar el eje solo a `gradients.brand`**: rechazada — la identidad solo se vería en superficies con gradiente, no en botones ni acentos.

## Consecuencias

- `packages/tokens/src/tokens/palettes.ts` se regenera (archivo generado, no editable a mano).
- Los temas oficiales cambian de color sin cambios estructurales: solo heredan las paletas regeneradas.
- `docs/02-theming.md` §3 se actualiza con las semillas y con el default dark.
- Cualquier captura o material de marketing anterior queda desalineado; se regenera al montar el Theme Creator (F5).
