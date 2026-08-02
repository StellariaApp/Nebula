# ADR-048 — `surface.disabled`, `text.disabled` y `border.disabled`

- **Estado**: **aceptada** · 2026-07-29 (checkpoint de G1.10; decisión del propietario)
- **Análisis de origen**: `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §7.

## Contexto

El censo del catálogo encontró **cinco recetas distintas** para el mismo estado entre los 13
componentes que lo estilan:

| Receta                                 | Componentes                                |
| -------------------------------------- | ------------------------------------------ |
| `background` + `opacity`               | ActionIcon · Button                        |
| `opacity` sola                         | Checkbox · Radio · Switch · UnstyledButton |
| `color` solo                           | Accordion · Menu · Pagination · Segment    |
| `background` + `color`                 | NavLink                                    |
| `background` + `borderColor` + `color` | `field`                                    |

Un `Button` deshabilitado se atenúa entero; un `Pagination` deshabilitado solo apaga el texto y conserva
su fondo a plena intensidad. No parecen el mismo estado porque no se expresan igual.

El archivo de diseño usa **una sola receta**, verificada en `Pagination Item`, `Pill` y `Nav Tab Item`:
fill sólido —`#E6ECF3` en light, `#1B2540` en dark— y texto al 40 % de opacidad sobre él. No atenúa el
elemento entero: cambia la superficie y apaga solo la llamada a la acción.

Ningún gate lo detecta. `check:contrast` **exime `disabled` explícitamente** por WCAG 1.4.3, y axe
tampoco lo mira.

## Decisión

1. **Tres roles nuevos**, uno por eje del contrato:

   ```ts
   colors.surface.disabled   colors.text.disabled   colors.border.disabled
   ```

2. **Se retira la opacidad de la receta.** El estado deja de expresarse con `opacity` y pasa a
   expresarse con la **relación entre `text.disabled` y `surface.disabled`**, que son colores sólidos.

   La opacidad es un truco de render: compone mal cuando el elemento se apila sobre otra superficie,
   arrastra a los hijos —iconos, bordes, sombras— y **ningún tema puede recalibrarla**. Una relación
   entre dos roles sí es temable y, sobre todo, **medible**.

3. **La calibración reproduce lo que el 40 % del diseño producía realmente.** Compuesto sobre su fill,
   ese 40 % da 1.82 en light y 2.16 en dark. Objetivos: **texto/superficie ≈ 2.0** y
   **superficie/canvas ≈ 1.2**.

   | Tema         | `surface.disabled` | /canvas | `text.disabled` | /surface | `border.disabled` | /surface |
   | ------------ | ------------------ | ------: | --------------- | -------: | ----------------- | -------: |
   | nebula-dark  | `dark.600`         |    1.19 | `gray.800`      |     1.89 | `gray.900`        |     1.47 |
   | nebula-light | `light.600`        |    1.20 | `gray.400`      |     2.07 | `gray.300`        |     1.44 |
   | playful      | `light.600`        |    1.20 | `gray.400`      |     2.07 | `gray.300`        |     1.44 |
   | sober-light  | `light.700`        |    1.17 | `gray.400`      |     1.97 | `gray.300`        |     1.38 |

   En los dos esquemas el borde queda **entre** la superficie y el texto, de modo que la caja se
   delimita sin competir con su contenido.

4. **Dos recetas, no una**, porque no todo control tiene superficie propia:

   - **Con superficie** (Button, ActionIcon, Pagination, Segment, NavLink, Menu, Accordion, `field`,
     FileButton): `background: surface.disabled`, `color: text.disabled`, y `borderColor:
border.disabled` donde ya hubiera borde.
   - **Sin superficie** (Checkbox, Radio, Switch, UnstyledButton): el glifo y su borde toman
     `border.disabled` y la etiqueta `text.disabled`. Pintarles un fondo no significa nada: su caja
     **es** el glifo.

5. **El gate gana un suelo, no un mínimo AA.** Se añade el par `text.disabled / surface.disabled` con
   **min 1.5**, deliberadamente por debajo de AA: WCAG 1.4.3 exime el estado, pero un tema que dejara
   el texto invisible sería un defecto y hoy nada lo vería.

## Alternativas

- **Una sola receta para todo el catálogo**, como el diseño: más simple de explicar, pero obliga a
  pintar un fondo a Checkbox, Radio y Switch, cuyo control **es** el glifo y no tiene superficie donde
  aplicarlo. Rechazada por el propietario en el checkpoint.
- **Conservar el 40 % de opacidad** y añadir solo `surface.disabled`: menos roles, y reproduce el
  diseño literalmente. Rechazada: la opacidad no es temable, arrastra a los hijos y no se puede medir,
  que son los tres motivos por los que el estado está hoy sin gobernar.
- **Un único rol `disabled` con la terna resuelta en el componente**: amplía el contrato en un campo en
  vez de tres, pero devuelve al `.css.ts` la decisión de qué relación guardan superficie, texto y
  borde. Rechazada por el mismo motivo que ADR-033 retiró las alturas.

## Consecuencias

- **Ampliación aditiva del contrato en tres ejes.** `SurfaceRole` pasa a 7 miembros, `TextRole` a 6 y
  `BorderRole` a 5. El schema de Zod deriva de los enums, así que se propaga sin editarlo.
- **14 componentes cambian de aspecto** al normalizarse —los 13 del censo más FileButton, el único
  hueco real de cobertura—. Es el objetivo, no un efecto colateral.
- **Los que hoy usan `opacity` cambian más que el resto**: Button, ActionIcon, Checkbox, Radio, Switch
  y UnstyledButton dejan de atenuarse enteros. Sus iconos y bordes recuperan intensidad propia y pasan
  a declarar su estado por color.
- **Precede al baseline de ADR-037.** Capturar antes obligaría a regenerar 14 componentes.
- **Rebase de dos presupuestos de `size-limit`.** El contrato de Vanilla Extract viaja en cada módulo,
  de modo que cada entrada nueva cuesta en los 71 budgets a la vez. Entre ADR-044 (2 superficies),
  ADR-045 (5 peldaños) y este ADR (3 roles) se han añadido **10 entradas** sin que los presupuestos se
  revisaran, y los dos más ajustados cruzaron: `Card` (22,04 / 22 kB) y `NavLink`, que quedaba a 0,06
  kB. Suben a 23 y 22 kB respectivamente. Es un rebase por crecimiento del contrato, no una concesión
  a un componente: ninguno de los dos ganó código.
- **Paridad native sin coste hoy**: `packages/native/src` no consume roles de color todavía.
- **La ejecución va en dos tiempos**: este ADR entrega el contrato y la calibración de los cuatro temas;
  la normalización componente a componente es G1.10, al final del tramo de geometría, por decisión del
  propietario. Los roles van primero porque 14 componentes van a escribir recetas contra ellos.
