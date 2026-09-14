# ADR-200 — La cifra puede pintar el rótulo en caja normal

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo 3 de C3 en Polaris (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7).
- **Cambia API pública**: sí, y **solo añade**: `Stat uppercase` (por defecto `true`).
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/Stat/` (`Stat.tsx`, `Stat.css.ts`, `Stat.types.ts`,
  `Stat.md`, `__tests__/`), la story `Data Display/Collections › Stats · Caja normal`,
  `docs/07-recetas-de-producto.md` §10.

## Contexto

`Stat` pinta el rótulo en versalitas con tracking ancho (`textTransform: uppercase` +
`letterSpacing.wide`) y no ofrece otra cosa. `docs/07` §10 dice desde C2 que Rosette **descartó**
las versalitas —«`Stat` con etiqueta en caja normal y cifra en mono»— porque no existen en ninguna
otra pantalla del producto; Polaris, al aplicar la receta, se encontró con que el catálogo y la
norma se contradicen y no había forma limpia de seguir la norma.

Había una forma sucia: `labelProps={{ tt: "none", ls: "normal" }}`. Funciona porque las style props
son sprinkles y viven en la capa `util`, que manda sobre `component`. Pero es anular desde fuera
una decisión visual que el componente no ha ofrecido cambiar, y obliga a saber que son dos
propiedades y no una: quitar la caja sin quitar el tracking deja un texto en minúscula con letras
separadas, que es peor que cualquiera de las dos opciones.

## Decisión

```tsx
<Stat label="Ingresos" value="68 700" uppercase={false} valueProps={{ ff: "mono" }} />
```

- `StatProps` gana `uppercase?: boolean`, **`true` por defecto**: el catálogo no cambia de aspecto
  y ninguna lámina del gate visual se mueve.
- Con `false` el rótulo va en caja normal **y sin tracking**: son una sola decisión, porque el
  tracking ancho sólo tiene sentido sobre versalitas.
- Se implementa como clase condicional (`label_uppercase`) sobre la base del rótulo, no como
  variante de recipe: es un solo booleano y `Stat.css.ts` ya va por `style` y `styleVariants`.
- El rótulo lleva `data-uppercase="true"` mientras va en versalitas, para que una prueba o un
  consumidor lo distinga sin depender de una clase con hash.
- `docs/07` §10 pasa a decir **cómo** se consigue la receta: `uppercase={false}` para el rótulo y
  `valueProps={{ ff: "mono" }}` para la cifra.

## Alternativas

- **Cambiar la norma** y dejar las versalitas: el propietario ya había elegido en Rosette, y
  Polaris llegó a la misma conclusión por su cuenta.
- **Cambiar el defecto** a caja normal: mueve el aspecto de cada `Stat` del catálogo y de los tres
  productos que ya lo usan sin pedirlo, y la story `AllThemes` del gate visual.
- **Dejarlo en `labelProps`** y documentarlo: la anulación por capas es un detalle de
  implementación que el consumidor no tiene por qué conocer, y no expresa que caja y tracking van
  juntos.

## Consecuencias

- Polaris y Rosette retiran el `labelProps` de anulación, si lo tenían, y escriben la receta como
  la dice `docs/07`.
- `Stat` gana su primer `Stat.md`: hasta hoy no tenía nada que explicar.
- Sin coste medible en `Stat.js`: una clase más en la hoja y una condición en el `cx`.
