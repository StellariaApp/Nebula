# ADR-038 — Variantes de superficie por subconjunto declarado de `Variant`

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la auditoría WV; primer lote ejecutado en el
  tramo V2 — Alert y Badge. Card, Paper, Avatar, Toast, Progress, Segment, Tabs, NavLink y Pagination
  quedan para V4 y V5)
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §0, §1.1 y §2.A.

## Contexto

`docs/02-theming.md` §2 punto 3 afirma que «`variantMap` hace que hasta el significado visual de
`variant="filled"` sea temable». La auditoría WV midió que eso es cierto para **2 de los 68**
componentes del catálogo web: `grep -rln ResolveVariant` sobre `packages/web/src/components` devuelve
solo `Button/Button.tsx` y `ActionIcon/ActionIcon.tsx`.

Otros cuatro componentes declaran un prop **llamado** `variant` que no lee `theme.variantMap`, y sobre
tres ejes semánticos distintos: Alert (`light|filled|outline`) y Badge (`light|filled|outline|dot`) son
recetas cromáticas escritas a mano, `Divider` (`solid|dashed|dotted`) es `borderStyle` y `Loader`
(`spinner|dots|bars`) es forma de animación.

La duplicación ya produjo deriva verificable. La receta `light` existe hoy en tres definiciones
incompatibles:

| Origen                                        | background          | foreground     | border             |
| --------------------------------------------- | ------------------- | -------------- | ------------------ |
| `themes/nebula-dark.ts:116` (contrato)        | `scale.500.12`      | `scale.800`    | `none`             |
| `components/Alert/Alert.tsx:41-46`            | `scale.500` @ 12 %  | `text.primary` | `scale.500` @ 28 % |
| `components/Badge/Badge.tsx:30-34`            | `scale.500` @ **14 %** | `scale.700` | `transparent`      |

Ningún gate lo detecta. Y la consecuencia es funcional, no estética: `playful` remapea `filled` a
`gradient.brand` (`packages/themes/src/__tests__/official-themes.test.ts:49`); ese remapeo llega a
Button y ActionIcon y **no** llega a Alert ni a Badge.

W3 entrega Chip, Banner, StatusBadge, Stepper y CardComplex, cinco componentes que necesitan receta
cromática. Sin patrón fijado, W3 los escribe a mano y la deriva pasa de dos componentes a siete.

## Decisión

1. **Un componente de superficie declara `variant` sobre un subconjunto explícito de `Variant`**, no
   sobre la unión entera y no sobre una unión propia. El subconjunto se expresa en el tipo con
   `Extract<Variant, …>`, de modo que sigue siendo el mismo vocabulario y el compilador impide que un
   componente invente un miembro:

   ```ts
   export type BadgeVariant = Extract<Variant, "filled" | "outline" | "light" | "ghost" | "gradient">;
   ```

2. **La receta la resuelve `ResolveVariant` contra `theme.variantMap`.** Se retiran las funciones
   `Palette()` locales de `Alert.tsx` y `Badge.tsx`. El componente consume el resultado por vars
   locales, según `docs/patterns/web-component-template.md` §2 capa 2.

3. **El subconjunto lo decide el effects budget de `docs/06` §6, no la comodidad.** Reglas aplicadas:

   - `glow` «no se aplica a listas completas»: se admite donde el componente es una excepción única
     (Card) y se excluye de todo lo que aparezca en colección (Badge, Chip, NavLink, Pagination,
     Segment).
   - `gradient` «no es fondo dominante en tablas, formularios ni lectura larga» y «nunca pinta texto
     principal»: se excluye de Alert, que sostiene párrafo, y de todo overlay.
   - `glass` «nunca se anida»: solo donde el componente es raíz de su región (Card, Paper, Toast,
     Banner).
   - `unstyled` no se propaga: el caso está resuelto estructuralmente por `UnstyledButton`.

   | Componente        | Subconjunto                                          |
   | ----------------- | ---------------------------------------------------- |
   | Card · Paper      | `filled · outline · light · glass · glow · gradient` |
   | Alert · Banner    | `filled · outline · light · glass`                   |
   | Badge · Chip      | `filled · outline · light · ghost · gradient`        |
   | Toast             | `filled · light · glass`                             |
   | Segment · Tabs    | `filled · light · ghost`                             |
   | NavLink           | `filled · light · ghost`                             |
   | Pagination        | `filled · outline · light · ghost`                   |
   | Avatar            | `filled · outline · light`                           |
   | Progress          | `filled · light`                                     |

4. **La unión `Variant` no se amplía.** Los ocho miembros ya tienen receta en los cuatro temas
   oficiales, de modo que esta decisión tiene coste de contrato **cero**. Los dos candidatos que
   aparecen en los repos de referencia y no están en la unión no la necesitan: `subtle` de fonicredito
   (21 usos, `Badge/styles.ts:50-54`) es `variant="light" color="gray"`, y `flat` de tfv
   (`Badge/index.tsx:76-82`) es `ghost` con `p={0}`. `link` de fonicredito (11 usos) sí queda fuera,
   pero su diferencia con `ghost` es **geométrica** —colapsa la caja del control— y `VariantRecipe`
   solo expresa color; su destino es `Anchor` o la prop `href` de ADR-035.

5. **Los cinco overlays quedan fuera.** Modal, Drawer, Popover, Menu y Tooltip no reciben `variant`:
   su superficie **es** su nivel de elevación (`docs/06` §5, ADR-028) y su física deriva de esa
   superficie (ADR-034). Tooltip conserva `color: "neutral" | "inverted"`, que es el caso legítimo.

6. **Los componentes de W3 nacen con su subconjunto.** Chip, Banner, StatusBadge, Stepper y
   CardComplex no se escriben con recetas locales. Es la razón de que este ADR preceda a W3.

## Alternativas

- **Variantes zero-runtime** con `recipe()` de VE resuelto en build: cuesta 0 kB y no toca ningún
  budget, pero pierde `variantMap` —un tema no podría remapear `filled` como hace `playful`—, que es
  exactamente el defecto que este ADR corrige. Rechazada: resuelve el bundle reintroduciendo el
  problema.
- **Dejarlo como está**, cada componente con su receta local: 0 kB y 0 ADRs, pero obliga a retirar de
  `docs/02` §2.3 la promesa de que `variant` es temable, hoy falsa para 4 de los 6 componentes que lo
  exponen. Rechazada por el propietario en el checkpoint.
- **Las 8 variantes en todos los componentes de superficie**: API uniforme y sin tabla de subconjuntos
  que mantener, a cambio de habilitar `Card variant="unstyled"`, `Pagination variant="glow"` y
  `Alert variant="gradient"`, que `docs/06` §6 prohíbe. Rechazada.
- **Solo unificar Alert y Badge** sin extender a los otros nueve: corrige la deriva medida sin ampliar
  API, pero deja a W3 sin patrón y Badge rompe budget igualmente. Rechazada por el propietario.

## Consecuencias

- **Ampliación de API pública en 11 componentes** (Alert y Badge cambian de unión local a subconjunto
  del contrato; Card, Paper, Avatar, Segment, Tabs, NavLink, Pagination, Toast y Progress ganan
  `variant`), más 5 de W3 que nacen con ella. Es aditiva y los paquetes siguen `private: true`.
- **`BadgeVariant` pierde `dot`**, que no es una receta cromática sino una forma. Se conserva como prop
  propio (`dot?: boolean`) en el mismo PR; los consumidores migran `variant="dot"` a `dot`.
- **Coste de bundle de +2,07–2,21 kB brotli por componente**, medido en Badge, Avatar y Paper
  (`docs/reviews/variantes-cobertura-2026-07-28.md` §3.2). Seis primitivos se salen de su budget; lo
  resuelve **ADR-039**, que es precondición de este.
- **Coste de paridad W/N**: 13 componentes que N1/N2 implementan con el mismo subconjunto, cubierto por
  el lint de paridad. La unión no crece, así que la semilla Stellaria
  (`src/ui/tokens/src/types/variants.ts:6`, idéntica) ya la implementa.
- **El gate de contraste no cubre esto**: `BuildPairs` no lee `variantMap` y cubre 1 de las 56
  combinaciones variante×escala. **ADR-040** lo corrige y debe ir antes de propagar el patrón.
- `docs/02-theming.md` §2 punto 3 deja de ser una promesa incumplida.
  `docs/patterns/web-component-template.md` §2 gana la forma canónica del subconjunto, y
  `docs/00-inventory.md` refleja la nueva API de los componentes afectados, todo en el mismo PR.
