# ADR-036 — Anillo de foco unificado por `box-shadow`

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

2. **La geometría es `box-shadow`**, no `outline`, en todo el catálogo. El motivo es de precisión
   visual: `box-shadow` sigue el `border-radius` real del elemento, mientras que `outline` con offset
   positivo dibuja una forma cuyo radio no coincide con el del control en los radios grandes del tema
   (`lg` 14 · `xl` 20 · `xxl` 28). En un botón `radius="full"` la diferencia es evidente.

3. **Anillo de dos tonos.** El anillo se compone de un separador del color de la superficie y un halo
   del color de foco:

   ```
   0 0 0 2px <surface>, 0 0 0 4px <focus>
   ```

   El separador garantiza que el anillo se distinga incluso cuando el control se apoya sobre una
   superficie del mismo tono que el foco. Es la razón principal para preferir `box-shadow`: `outline`
   no puede expresarlo.

4. **Un solo estado de disparo**: `data-focus-visible='true']`, alimentado por `useFocusRing` de React
   Aria. Se retiran los `:focus-within` y `:focus-visible` directos que hoy conviven con él.

5. **Variante de error.** El helper acepta el tono del halo, de modo que `field` conserva su anillo
   rojo en estado inválido sin duplicar la definición.

6. **Compatibilidad con modo de alto contraste.** El helper emite además un `outline: 2px solid
transparent` dentro de `@media (forced-colors: active)`. En modo forzado de Windows, `box-shadow`
   se descarta y el `outline` transparente se repinta con el color del sistema, de modo que el foco
   nunca desaparece. Sin esta regla, migrar a `box-shadow` sería una regresión de accesibilidad.

## Alternativas

- **Unificar en `outline`** para todo, incluidos los fields: rechazada. Es lo que ya hacen 12 de 13
  archivos y resuelve el modo de alto contraste sin regla adicional, pero no admite el anillo de dos
  tonos y desalinea el radio en los peldaños altos del tema.
- **Anillo por `box-shadow` sin fallback de `forced-colors`**: rechazada. Es una regresión de a11y
  frente al estado actual y `docs/03` no la admite.
- **Dejar dos geometrías, documentando cuál corresponde a cada familia**: rechazada. Formaliza una
  incoherencia visible en cualquier formulario en lugar de resolverla.

## Consecuencias

- **Cambio visual en 12 componentes**: el foco pasa de un trazo exterior separado a un anillo de dos
  tonos ajustado al radio. Es el cambio que más se percibe de esta tanda; el baseline de ADR-037 se
  genera después.
- **`box-shadow` de foco convive con el `::after` del glow** de ADR-021. Son elementos distintos —el
  glow vive en el pseudo, el foco en el elemento— y no se pisan; el test de Button lo cubre.
- **El contraste del anillo se sigue verificando** con `pnpm check:contrast`, que ya cubre
  `border.focus` sobre las superficies del tema. El requisito de 3:1 no cambia.
- **`docs/03-a11y-motion-performance.md` §1** se actualiza con la geometría y el fallback de
  `forced-colors` en el mismo PR.
- **Native**: no aplica. React Native no tiene el concepto; N1 mantiene su contrato de foco propio.
