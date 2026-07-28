# ADR-034 — Capa de motion compartida

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: `packages/tokens/src/tokens/animation.ts` define una gramática de movimiento completa —
  duraciones, curvas, springs, transformadas nombradas, transiciones compuestas y keyframes. La
  auditoría del 2026-07-28 midió su adopción en `packages/web`:

  | Token                                                                |  Usos |
  | -------------------------------------------------------------------- | ----: |
  | `motion.transition.*` · `motion.transforms.*` · `motion.keyframes.*` | **0** |
  | `easing.emphasized` · `easing.accelerate`                            | **0** |
  | `duration.instant` · `duration.slow`                                 | **0** |
  | `easing.standard`                                                    |    26 |
  | `duration.fast`                                                      |    12 |

  En su lugar cada componente reescribe `transitionProperty` a mano — **13 listas distintas** en el
  catálogo — y cada uso de `motion/react` copia el mismo bloque `type: "spring"` con
  `{ stiffness, damping, mass }` y su ternario de reduced-motion: **13 bloques en 12 archivos**. Hay
  **15 `<LazyMotion>`** independientes, 13 con `domAnimation` y 2 con `domMax`, de modo que una vista
  que combine un Switch con un botón carga los dos paquetes de features. `prefers-reduced-motion`
  aparece en **13 de 76** hojas, con dos idiomas incompatibles (`transitionDuration: "0.01ms"` ×9 y
  `transitionProperty: "none"` ×3).

  El resultado no es un problema de peso sino de percepción. En `overlay-motion.tsx`,
  `exit={phase.from}` usa **el mismo spring que la entrada**, y los cinco overlays —Modal, Popover,
  Menu, Drawer, Tooltip— comparten `spring.default`: un tooltip y un modal se mueven con la misma
  física, y cerrar cuesta lo mismo que abrir cuando el usuario ya decidió. `staggerChildren` y
  `delayChildren` tienen **cero usos**; `type: "tween"`, también.

  Existe una gramática de movimiento escrita y no hay coreografía: hay cuarenta y siete decisiones
  locales que coinciden en duración.

## Decisión

1. **`packages/web/src/styles/motion.css.ts`** pasa a ser la única fuente de transiciones CSS. Expone
   las composiciones de `motion.transition.*` —`interaction`, `layout`, `overlay`— como estilos
   reutilizables. Ningún componente vuelve a escribir `transitionProperty` a mano; el checklist de
   `docs/patterns/web-component-template.md` §6 lo verifica.

2. **Asimetría entrada/salida.** Toda aparición y desaparición usa duraciones y curvas distintas: la
   entrada decelera (`easing.decelerate`, duración plena), la salida acelera (`easing.accelerate`, en
   torno a dos tercios de la duración de entrada). El principio es que una salida nunca dura más que su
   entrada.

3. **Física por tipo de superficie**, no una sola para todo. El `preset` de `OverlayMotion` deja de
   gobernar solo la transformada y pasa a gobernar también la física:

   | Superficie     | Tratamiento                                             |
   | -------------- | ------------------------------------------------------- |
   | Tooltip        | tween corto sobre opacidad; sin spring                  |
   | Popover · Menu | `spring.snappy` en entrada; salida por tween acelerado  |
   | Modal · Drawer | `spring.default` en entrada; salida por tween acelerado |
   | Toast          | `spring.gentle`; entra y sale por el eje de su posición |

4. **`easing.emphasized` entra en uso** en las confirmaciones de estado —selección, activación,
   aparición de indicador—, donde el ligero rebase comunica que la acción se registró. No se usa en
   hover ni en transiciones de color.

5. **Un solo `LazyMotion`**, montado en `NebulaProvider` con `strict`. Se elimina el wrapper de los 15
   componentes. Las features se unifican en **`domMax`**, porque `domMax` es requisito de los dos
   componentes con gesto (Switch y `Segment/Control`) y mantener dos conjuntos garantiza cargar ambos.

6. **Helper único de spring.** Una función traduce `theme.motion.spring[name]` a la `transition` de
   `motion/react` y resuelve en un solo sitio la degradación por `useReducedMotion()` y por
   `motion.tier === "minimal"`. Los 13 bloques copiados desaparecen.

7. **Un solo idioma de reduced-motion en CSS**: `transitionProperty: "none"` y `animationName: "none"`.
   Se retira `transitionDuration: "0.01ms"`, que es un truco para forzar el disparo de `transitionend`
   y que aquí no se necesita. Todo componente que anime lo declara; deja de ser opcional.

8. **Orquestación.** Las colecciones que aparecen como unidad —items de Menu y de `option-list`, pila
   de Toast, celdas de Grid en su entrada inicial— usan `staggerChildren` derivado de
   `duration.instant`, con tope de elementos animados para que una lista larga no encadene un retardo
   perceptible. El stagger se anula entero bajo reduced-motion y bajo `motion.tier: "minimal"`.

9. **Tween para lo que no tiene masa.** Las transiciones de opacidad pura usan `type: "tween"` con las
   curvas del tema. El spring se reserva a lo que se desplaza o escala.

## Alternativas

- **Solo unificar, sin recalibrar** —helper de spring, `LazyMotion` único e idioma único de
  reduced-motion, conservando duraciones y curvas: rechazada. Elimina la duplicación pero no cambia la
  percepción, que es el motivo por el que se abre este trabajo.
- **Mantener un `LazyMotion` por componente** para minimizar el bundle de las vistas que no animan:
  rechazada. El reparto actual ya carga los dos paquetes en cuanto coinciden dos componentes
  cualesquiera de familias distintas, de modo que el ahorro es teórico.
- **Unificar en `domAnimation` y reescribir los dos componentes con gesto**: rechazada. Sacrifica el
  gesto de arrastre de Switch y Segment, que es precisamente el detalle de calidad que se busca.
- **Firma de motion parametrizable por tema (`motion.signature`)**: pospuesta a W4, como ya mapeó la
  review de convergencia del 2026-07-27. Ampliaría `NebulaTheme` y no es requisito de esta capa.

## Consecuencias

- **`NebulaProvider` pasa a ser obligatorio** para cualquier componente animado, porque aloja el
  `LazyMotion`. Ya lo era de hecho para el theming; queda documentado de forma explícita y cubierto
  por un test.
- **`domMax` en lugar de `domAnimation`** aumenta el peso base de motion en las vistas que hoy solo
  cargaban `domAnimation`. Se compensa con la eliminación de 15 wrappers y se verifica con
  `size-limit`; el delta se anota en el PR.
- **Cambio de percepción en todo el catálogo.** Los overlays cierran más rápido, los tooltips dejan de
  tener física y las selecciones ganan rebase. Las capturas previas dejan de ser referencia: el
  baseline de ADR-037 se genera después de este tramo.
- **`docs/03-a11y-motion-performance.md` §2** se actualiza con el idioma único de reduced-motion y la
  regla de asimetría, y **`docs/06-visual-language.md` §6** con la física por superficie.
- **Paridad con native**: la asimetría, la física por superficie y el tope de stagger son reglas de
  contrato, no de implementación web. N1 las hereda con Reanimated.
