# ADR-033 — Escala de tamaños para elementos no-control

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: `ThemeSizes` declara una sola escala, `control: Record<Size, number>`, con
  `xs 30 · sm 36 · md 42 · lg 50 · xl 60`. La consumen Button, ActionIcon, Segment y `styles/field.css.ts`.

  Dos componentes no la usan y **definen la suya en literales `rem` dentro del `.css.ts`**:

  | Componente |  xs |  sm |  md |  lg |  xl |
  | ---------- | --: | --: | --: | --: | --: |
  | Badge      |  16 |  20 |  24 |  28 |  32 |
  | Pagination |  24 |  28 |  32 |  40 |  48 |

  Que un badge sea más bajo que un control es correcto: no es un objetivo táctil y `docs/06` §4 reserva
  `sizes.control` para expresar densidad de control. El problema es doble y ninguna de las dos mitades
  es estética:

  1. **El mismo nombre entrega tres alturas.** `size="md"` vale 42 px en Button, 32 px en Pagination y
     24 px en Badge. Una barra de paginación junto a un botón, ambos `md`, no comparte eje.
  2. **Están fuera del contrato.** Al estar horneados en `rem` en la hoja de estilos, ningún tema puede
     recalibrarlos. Es una fuga del principio de `docs/02`: la personalización entre productos ocurre
     exclusivamente vía `NebulaTheme`. Un tema denso puede hoy comprimir los controles y no los badges.

  Pagination es además un caso mixto: sus items **sí** son objetivos táctiles y `docs/06` §4 exige
  WCAG 2.2, 24 px CSS mínimo. Su `xs` de 24 px está justo en el límite.

## Decisión

1. **`ThemeSizes` se amplía con una segunda escala**, para elementos que muestran metadata o
   navegación compacta y no son controles de formulario:

   ```ts
   export interface ThemeSizes {
     control: Record<Size, number>;
     compact: Record<Size, number>;
   }
   ```

2. **Baseline de `compact`**: `xs 20 · sm 24 · md 28 · lg 32 · xl 36`. Se elige sobre la rejilla de 4 px
   de `docs/06` §3 y de modo que `compact.md` (28) y `control.md` (42) mantengan una relación estable
   de 2:3 en los cinco peldaños.

3. **Badge migra a `compact`.** Sus alturas pasan de 16/20/24/28/32 a 20/24/28/32/36. El `xs` de 16 px
   desaparece: era demasiado bajo para alojar `caption` (12 px) con aire vertical legible.

4. **Pagination migra a `control`, desplazada un peldaño.** Sus items son objetivos táctiles: `md`
   consume `control.sm` (36) y el resto se desplaza en consecuencia. Así toda la escala queda por
   encima del mínimo de 24 px de WCAG 2.2 y una paginación `md` alinea con un input `sm`, que es la
   composición real.

5. **`vars.size` se proyecta a CSS con ambas escalas.** El contrato web pasa a exponer
   `vars.size.control.*` y `vars.size.compact.*`. Los usos actuales de `vars.size.md` se reescriben
   como `vars.size.control.md`; no hay ambigüedad silenciosa.

6. **Ningún componente vuelve a declarar alturas en literales.** Pasa a ser punto del checklist de
   `docs/patterns/web-component-template.md` §6, junto al de "cero hex".

## Alternativas

- **Reusar `sizes.control` con nombres desplazados**, sin tocar el contrato: rechazada. No cambia el
  tema y resuelve la alineación, pero deja una relación implícita —"el `md` de Badge es el `xs` de
  control"— que nada verifica y que se rompe en cuanto un tema recalibre `control`. Es la variante que
  sí se aplica a Pagination, donde el desplazamiento tiene una razón propia: sus items son controles.
- **Solo tokenizar sin unificar**, moviendo los valores actuales a vars locales: rechazada. Corrige el
  hardcode y devuelve la tematización, pero conserva la desalineación entre Button `md` y Pagination
  `md`, que es la mitad visible del problema.
- **Una sola escala para todo, con más peldaños**: rechazada. Fuerza a elegir entre nombres que no
  significan lo mismo en un badge y en un botón, y `docs/06` §4 ya define `sizes.control` como
  expresión de densidad de control, no de tamaño genérico.

## Consecuencias

- **Cambio del contrato `NebulaTheme`**: `ThemeSizes` gana una clave obligatoria. Los cuatro temas
  oficiales y el fixture Rosette la declaran en el mismo PR. Es cambio incompatible para cualquier tema
  externo; no existe ninguno.
- **Cambio visual deliberado**: los badges suben entre 4 y 8 px y la paginación baja un peldaño. Las
  capturas previas de esos dos componentes dejan de ser referencia, y el baseline de screenshots de
  ADR-037 debe generarse después de este tramo.
- **`vars.size.*` cambia de forma** en el contrato CSS. Afecta a Button, ActionIcon, Segment y
  `field.css.ts`; es una reescritura mecánica y la verifica `typecheck`.
- **Paridad con native**: N1 hereda las dos escalas. `docs/06` §4 mantiene el mínimo de 44 pt para
  objetivos táctiles en native, que `compact` no satisface por definición — de ahí que Badge no sea
  interactivo y Pagination use `control`.
- `docs/02-theming.md` §2 y `docs/06-visual-language.md` §4 se actualizan en el mismo PR.
