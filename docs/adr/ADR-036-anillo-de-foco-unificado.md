# ADR-036 — Anillo de foco unificado por `outline` con offset

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: `vars.color.border.focus` se consume en 13 archivos `.css.ts`, cada uno reescribiendo
  el anillo de foco, y con dos geometrías incompatibles:

  - **outline exterior**, en 12 archivos: `outline: 2px solid ...` + `outlineOffset: 2px`
    (Accordion, ActionIcon, Anchor, Button, Card, Checkbox, NavLink, Pagination, Radio, Segment,
    Switch, UnstyledButton).
  - **anillo interior**, en `styles/field.css.ts`: `boxShadow: 0 0 0 2px ...`, que además cambia a
    `semantic.error` cuando el campo es inválido.

  Un formulario real alterna inputs y botones, de modo que las dos geometrías conviven en la misma
  vista. Además `outlineOffset` aparece con tres valores distintos —`2px`, `-2px` y sin declarar— sin
  regla que explique cuándo aplica cada uno.

  La review del 2026-07-21 propuso `packages/web/src/styles/focus.css.ts` como P2. No se creó, y la
  duplicación creció con W2.4 y W2.5.

## Decisión

1. **`packages/web/src/styles/focus.css.ts` es la única definición del anillo de foco.** Ningún
   componente vuelve a escribir `outline` ni `boxShadow` de foco por su cuenta. Pasa a ser punto del
   checklist de `docs/patterns/web-component-template.md` §6.

2. **La geometría es `outline` con `outline-offset`** en todo el catálogo. _(Regla reescrita el
   2026-07-28 al implementarla; ver la corrección en Consecuencias.)_

   ```
   outline: 2px solid <halo>;
   outline-offset: 4px;
   ```

   `outline` respeta el `border-radius` real del elemento —incluso con offset— en todos los
   navegadores objetivo, y su hueco **no se pinta**: deja ver la superficie que haya detrás, sea el
   canvas, una Card o la cabecera de un Modal.

3. **Un solo tono, en una var.** El anillo es un trazo del color de foco; `halo` es un `createVar()`
   con `fallbackVar` a `border.focus`. No hay separador: un hueco de offset no puede tener color
   propio sin dejar de ser un hueco.

4. **Un solo estado de disparo**: `data-focus-visible='true']`, alimentado por `useFocusRing` de React
   Aria. Se retiran los `:focus-within` y `:focus-visible` directos que hoy conviven con él.

5. **Variante de error.** El helper acepta el tono del halo, de modo que `field` conserva su anillo
   rojo en estado inválido sin duplicar la definición.

6. **Compatibilidad con modo de alto contraste**, sin regla adicional. En modo forzado de Windows el
   navegador repinta el `outline` con el color del sistema por sí solo. Esta regla existía para
   compensar que `box-shadow` se descarta en ese modo; al no usarlo, desaparece su motivo.

## Alternativas

- **Anillo de dos tonos por `box-shadow`** —un separador del color de la superficie y un halo del
  color de foco—: era la decisión original de este ADR y se **revierte** tras implementarla. El
  porqué está en Consecuencias.
- **Anillo por `box-shadow` sin fallback de `forced-colors`**: rechazada mientras la geometría fue
  `box-shadow`. Con `outline` la cuestión no se plantea.
- **Dejar dos geometrías, documentando cuál corresponde a cada familia**: rechazada. Formaliza una
  incoherencia visible en cualquier formulario en lugar de resolverla.

## Consecuencias

- **Cambio visual en 12 componentes**: el foco pasa de un trazo pegado al control a un trazo separado
  4 px y ajustado al radio. Es el cambio que más se percibe de esta tanda; el baseline de ADR-037 se
  genera después.
- **El anillo de foco convive con el `::after` del glow** de ADR-021. Son elementos distintos —el
  glow vive en el pseudo, el foco en el elemento— y no se pisan; el test de Button lo cubre.
- **El contraste del anillo se sigue verificando** con `pnpm check:contrast`, que ya cubre
  `border.focus` sobre las superficies del tema. El requisito de 3:1 no cambia.
- **`docs/03-a11y-motion-performance.md` §1** se actualiza con la geometría en el mismo PR.
- **Native**: no aplica. React Native no tiene el concepto; N1 mantiene su contrato de foco propio.
- **Corrección tras la implementación (2026-07-28)**: las reglas 2, 3 y 6 se reescriben. La decisión
  original —anillo de dos tonos por `box-shadow`— se sostenía sobre dos premisas y **ninguna resistió
  el contacto con la pantalla**:

  1. _«`outline` con offset no respeta el `border-radius`»_. Lo respeta, y ya lo hacía cuando se
     escribió este ADR: Chrome desde la 94, Firefox desde la 88 y Safari desde la 16.4. La premisa
     describía un navegador que ya no existe.
  2. _«`box-shadow` permite el anillo de dos tonos»_. Permite pintarlo, pero **no permite un hueco
     transparente**, que es lo que el anillo necesita de verdad. Un `box-shadow` con spread es una
     forma maciza: el hueco solo aparece si una capa interior **opaca** tapa el interior de la
     exterior, de modo que el separador está obligado a tener un color concreto. No hay ninguno
     correcto —`surface.base` pinta el canvas sobre una Card, `surface.overlay` pinta el overlay
     sobre el canvas— y se probaron las dos: el defecto se vio en el `ButtonClose` de la cabecera de
     un Modal, con un cerco de color ajeno al fondo.

  La regla 6 cae por consecuencia: existía para compensar que `box-shadow` se descarta en modo de
  alto contraste. Con `outline`, el sistema lo repinta solo.

  Lo que se pierde es la protección para un control cuyo fondo tenga el mismo tono que el foco. No
  se ha dado en el catálogo, y de darse la salida es la var `halo`, no una segunda geometría.
