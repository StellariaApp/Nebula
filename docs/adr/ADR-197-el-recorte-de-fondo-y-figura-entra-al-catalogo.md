# ADR-197 — El recorte de fondo y figura entra al catálogo

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `Cutout` en el core.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/Cutout/` (nuevo), `src/index.ts`, `.size-limit.js`.
- Es el hallazgo #3 de C2 y `docs/07` §11.

## Contexto

El visual de **toda** la landing de Rosette —hero, cierre, «yours»— y de sus láminas es
`cutout.tsx`: un fondo que cubre la caja y una figura recortada superpuesta, colocada con
`figurePosition { top, bottom, left, right, translate, rotate }` y escalada con `figureSize`. Son
81 líneas y no existen en Nebula en ninguna forma. Su único acoplamiento es `next/image` para el
fondo (`fill`, `sizes`, `priority`); la figura ya es un `<img>` con `?q=medium` de Cosmos pegado.

## Decisión

```tsx
<Cutout
  background={<Image src fill sizes priority alt="" />}
  figure="/figura.png"
  figureAlt
  figureSize={0.9}
  figurePosition={{ bottom: 0, right: -24, translate: { y: "4%" }, rotate: { z: "-6deg" } }}
  r="xl"
>
  {children}
</Cutout>
```

- `background` es una **ranura** (`ReactNode`): el producto pone `next/image`, `Image` de Nebula o
  un `<img>`. `Cutout` le da la caja (`position: relative; overflow: hidden; border-radius` de `r`)
  y nada más. Así no hay dependencia de Next ni de un CDN.
- `figure` es una `src` y se pinta como `<img>` absoluto con `figureProps` como ranura; sin el
  `?q=medium`, que es de Cosmos y lo añade quien llama.
- `figureSize` es la fracción del ancho de la caja; `figurePosition` mapea a `inset` y a un
  `transform` compuesto. Lo que hoy es `style` en línea pasa a vars (`--cutout-*`) con
  `assignInlineVars`.
- Componente de servidor: no tiene estado.

## Alternativas

- **`BackgroundImage` + `Image` a mano en cada sitio**: es lo que había antes de `cutout.tsx`, con
  la figura colocada distinto en cada hero.
- **`Image` de Nebula como fondo obligatorio**: `next/image` es lo que hace que el LCP de la landing
  salga en verde; la ranura lo respeta.

## Consecuencias

- `cutout.tsx` de Rosette se sustituye por un import y una línea por el `?q=medium`.
- Primitivo temable ≤12 kB. Story `Cutout` con el hero de `docs/07` §5.3 como `Composition`.
