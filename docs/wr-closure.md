# Cierre de WR — Web Refine: auditoría visual del catálogo

> Verificación del gate de [`docs/05-roadmap.md`](05-roadmap.md) §WR. Fase ejecutada entre el
> 2026-07-28 y el 2026-08-01; **T5 se cerró el 2026-08-14** y con él este documento.
> Traspaso intermedio: [`docs/wr-estado-2026-08-01.md`](wr-estado-2026-08-01.md).
> Fases previas: `f0-closure.md`, `w1-closure.md`, `w2-closure.md`, `w3-closure.md`, `w4-closure.md`.

## Estado

**WR cerrada en sus entregables, con la mitad de su método sin ejecutar y dicho por escrito.** Esa
frase no es una reserva de cortesía: es la conclusión que el propio plan dejó anotada —«si WR4 ejecuta
este plan tal cual, cierra 16 causas medidas y deja la fase con la mitad de su método sin ejecutar.
Eso hay que decidirlo, no heredarlo»— y trece días después nadie la había decidido.

Este cierre la decide en un solo sentido: **lo que se midió está resuelto y verificado; lo que no se
midió sigue sin medir y queda escrito abajo, no dentro del gate**.

## Los tramos

| Tramo         | Contenido                               | Estado                                                                                                     |
| ------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **WR1.1**     | censo de cobertura contra el inventario | ✅ [`coverage-census-2026-07-31.md`](reviews/coverage-census-2026-07-31.md)                                |
| **WR1.2**     | baseline de Figma a disco               | ✅                                                                                                         |
| **WR1.2b**    | lo que solo da la API de Figma          | ⛔ **nunca se ejecutó** — la cuota volvía el 2026-08-02 y no se retomó                                     |
| **WR2.1–2.8** | auditoría visual por familia            | ✅ ocho informes en [`reviews/visual-audit/`](reviews/visual-audit/)                                       |
| **WR3.1**     | consolidación y plan                    | ✅ [consolidado](reviews/visual-audit-2026-08-01.md) + [plan](reviews/visual-alignment-plan-2026-08-01.md) |
| **WR4**       | ejecución de los tramos                 | ✅ T0, T1, T2, T4 el 2026-08-01 · **T3 vía B3 de WB** · **T5 el 2026-08-14**                               |

`T3` no se ejecutó en WR: lo absorbió el tramo `B3` de WB, que lo cerró el 2026-08-02 con ADR-065. El
prompt de WB lo anunciaba por escrito.

## T5, trece días después

Los tres puntos de código de T5 se midieron **abiertos** sobre `main` el 2026-08-14, y se cerraron
entonces:

| Punto             | Antes                                     | Ahora                                         |
| ----------------- | ----------------------------------------- | --------------------------------------------- |
| C11 · `FormField` | header `flex column` sin `gap` — **0 px** | `gap: space.xxs` — **2 px**, en los 27 campos |
| C11 · `Spoiler`   | `body3` (13 px), sin peso                 | `button` (14 px) + `semibold`                 |
| C14 · `Kanban`    | destino señalado solo con color           | `outline: 1px dashed` + `outlineOffset: -1`   |
| C14 · `Kanban`    | `data-over-limit` solo cambiaba `color`   | color **más** `fontWeight: semibold`          |

El de `Kanban` es el que justifica que esta fase existiera. Su hermano `DragDrop` ya hacía
exactamente lo que el plan pedía, así que la incoherencia estaba a la vista en el propio catálogo — y
sobrevivió trece días **con axe en verde**, porque señalar únicamente con color no lo detecta ninguna
herramienta automática. El criterio de aceptación era literal: que el destino se distinga en escala
de grises.

Los dos encargos de verificación de T5 salieron limpios y no hizo falta tocar nada:

- **Control→error ya tenía ritmo uniforme.** Lo gobierna el `gap: space.sm` de `styles/field.css.ts`,
  que alcanza también a los controles altos —`Textarea`, `Dropzone`, `Signature`—, así que no eran un
  caso aparte. El defecto vivía solo dentro del `header`.
- **El punto 4 estaba resuelto por ADR-063**, con `surface.disabled` en seis componentes.

## Gate verificable

| Criterio                                   | Resultado                                 |
| ------------------------------------------ | ----------------------------------------- |
| `pnpm turbo build typecheck lint`          | **34/34 tareas**                          |
| `pnpm turbo test`                          | **1310 tests, 142 suites — 0 fallos**     |
| `pnpm --filter @stellaria/nebula-web size` | **192 entradas · 0 excedidas**            |
| `pnpm check:contrast`                      | 165 pares · **0 FAIL**                    |
| `pnpm --filter playground-web a11y` (axe)  | **96 suites / 617 tests · 0 violaciones** |

## Lo que el gate del roadmap pide y este documento NO puede dar

`05-roadmap.md` §WR cierra con «**declaración explícita de que el aspecto está estable para capturar
el baseline de ADR-037**». Esa declaración es del propietario, no de una verificación: nadie puede
afirmar desde el código que un catálogo «se ve bien». Queda pendiente y **bloquea la captura del
baseline**, no el resto de W5.

Conviene tomarla sabiendo lo que la auditoría no cubrió, que es lo mismo que el plan dejó escrito:

- **El paso 1 del método —MIRAR— no se hizo en ninguna de las ocho familias.** Todas midieron el
  render; ninguna lo miró. Ritmo, alineación óptica y legibilidad de una composición siguen sin
  cubrir.
- **El paso 4 —Figma— tampoco** (WR1.2b), de ahí los cero hallazgos de la clase C. El cubo de
  especificación de T2 salió de huecos de `docs/06`, no del diseño.
- **~80 de 145 componentes sin medida de render**, concentrados en overlays (12), datos (25) y fechas
  (11).
- **`hover`, `active`, `focus-visible` y `loading` no se verificaron en ningún control.**

## Deuda declarada

- **WR no estaba marcada como abierta en ningún sitio.** `CLAUDE.md` la daba por cerrada desde antes
  de que T5 existiera resuelto, y el roadmap exigía este documento sin que nadie lo escribiera. La
  combinación es la que dejó un defecto de accesibilidad trece días en `main`.

- **`prompts/2.1-web-refine/CONTINUAR.md`** describe un estado anterior a este cierre.
