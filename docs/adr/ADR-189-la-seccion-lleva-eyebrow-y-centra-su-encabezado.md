# ADR-189 — La sección lleva `eyebrow` y centra su encabezado

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**: `eyebrow` y `align` en `Section`, y
  `Section.Eyebrow` como parte.
- **Toca**: `packages/web/src/components/Section/`.
- Es el hallazgo #8 de C2 y el «hallazgo abierto» de `docs/07` §5.1.

## Contexto

Rosette, Stellaria e Iris llevan cada uno una copia de `band.tsx` + `band.css.ts`. Las tres hacen
lo mismo sobre `Section`: meter una insignia encima del título (`<Badge variant="light"
ml={-10}>`), y **centrar el encabezado** cuando la sección va centrada. Lo segundo no sale con props:
`Section.css.ts` fija `head` como `flex` con `justifyContent: space-between` y `heading` como
columna, y ninguna de las dos escucha `align`. `band.css.ts` lo arregla con un `globalStyle` sobre
`> div > div:first-child`, que es exactamente el selector interno que ADR-019 y `docs/07` §1.1
prohíben escribir en un producto.

Una landing de Stellaria tiene siete secciones; todas abren con eyebrow → título → descripción. Es
la forma de **toda** sección de landing de la familia, no una de Rosette.

## Decisión

```tsx
<Section eyebrow="Cómo funciona" title description align="center" | "start">
```

- `eyebrow` pinta `Section.Eyebrow` **antes** del título dentro de `heading`: un `Badge
variant="light" size="sm"` por defecto, y cualquier nodo si se pasa un elemento. `eyebrowProps`
  como ranura (ADR-098). En `align="start"` lleva el `ml` negativo que compensa el relleno de la
  insignia para que su texto alinee con el título, como hoy en `band.tsx`.
- `align="center"` centra `head`, `heading` y `description` (`align-items: center`,
  `text-align: center`) y coloca `actions`/`aside` debajo del encabezado en vez de a su derecha.
  `"start"` es el defecto y no cambia nada de lo que hoy se pinta.
- `Section.Eyebrow` existe como parte para el montaje por hijos (ADR-111), como `Section.Title`.

## Alternativas

- **Dejar `title` como ranura libre** (lo que hace `band.tsx`): el consumidor mete la insignia en
  `title` y el `aria-labelledby` de la región pasa a incluir el texto de la insignia. Es lo que
  pasa hoy: la región se llama «Cómo funciona Paso a paso».
- **`Section.Header` propio en cada producto**: obliga a reescribir `title`, `description`,
  `actions` y `aside`, que `Section` ya resuelve.

## Consecuencias

- Las tres copias de `band.tsx` desaparecen; `Band` de Rosette pasa a ser
  `<Section eyebrow align reveal py="xxxl" glass>` y se retira.
- El nombre accesible de la región vuelve a ser el título solo.
- `Hero` no cambia: su `hiper` ya es la ranura equivalente (ADR-156 los coordina sin contexto).
- Story `Section/Eyebrow` y `Section/Centered`, en los dos esquemas.
