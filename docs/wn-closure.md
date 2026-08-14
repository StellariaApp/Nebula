# Cierre de WN — Normalización del catálogo web

> Verificación de los seis tramos de `prompts/2.3-web-normalize/README.md`. Fecha de cierre:
> 2026-08-14. Fases previas: `docs/f0-closure.md`, `w1-closure.md`, `w2-closure.md`,
> `w3-closure.md`, `w4-closure.md`.

## Estado

**WN cerrada.** Las cinco convenciones que W1–W4 habían adoptado a medias están aplicadas al
catálogo entero —158 componentes— y **dos de ellas tienen ahora un gate propio que las sostiene**,
que es la diferencia entre una convención aplicada y una convención que se mantiene. Los siete gates
de CI están en verde.

Los números de este documento están **medidos sobre el repo el 2026-08-14**, no estimados, y son
comparables con los que abrieron la fase el 2026-08-05.

## Los tramos contra su estado de apertura

| Tramo  | Al abrir (2026-08-05)                               | Al cerrar (2026-08-14)                        | Estado |
| ------ | --------------------------------------------------- | --------------------------------------------- | ------ |
| **N0** | ~181 símbolos camelCase en 64 hojas; AppShell mixto | **0 violaciones** — ADR-094                   | ✅     |
| **N1** | 18 componentes con `createVar()` en el `.css.ts`    | **0**; 75 `.vars.css.ts` — ADR-096            | ✅     |
| **N2** | 9 compounds de 158, en **tres** idiomas             | **11 compounds**, un idioma — ADR-097/111     | ✅     |
| **N3** | ningún componente con la forma canónica             | **113 filas, 0 pendientes** — ADR-098/103–106 | ✅     |
| **N4** | `surface.hoverActive` sin repartir                  | cerrado el 2026-08-05 — ADR-095               | ✅     |
| **N5** | —                                                   | cuaderno con sus causas convertidas en ADR    | ✅     |

Sobre N0: las únicas siete constantes que no son `snake_case` en un `.css.ts` son `UPPER_CASE`
(`ROLE_COLORS`, `TOKEN_VALUES`, `BREAKPOINT_ORDER`, `OPEN_CLASS`, `PROGRESS`…), que es exactamente lo
que ADR-094 permite para tablas de constantes. No son deuda.

## Gate verificable

| Criterio                                   | Resultado                                                          |
| ------------------------------------------ | ------------------------------------------------------------------ |
| `pnpm turbo build typecheck lint`          | **34/34 tareas**                                                   |
| `pnpm turbo test`                          | **1310 tests, 142 suites — 0 fallos**                              |
| `pnpm --filter @stellaria/nebula-web size` | **192 entradas · 0 excedidas**                                     |
| `pnpm check:contrast`                      | 3 temas · 165 pares cada uno · **0 FAIL**                          |
| `pnpm check:slots`                         | 279 componentes · 158 contratos · **0 problemas**                  |
| `pnpm check:layers`                        | declaración alineada · nada fuera de capa · consumidores cableados |
| `pnpm --filter playground-web a11y` (axe)  | **96 suites / 617 tests · 0 violaciones**                          |
| Catálogo                                   | 158 componentes · 96 stories · 141 previews · 7 subpaths           |

## Lo que WN dejó que no estaba en su plan

**Dos gates nuevos que antes no existían.** WN no solo aplicó convenciones: dejó puesto lo que impide
que se deshagan.

- `check:slots` (ADR-106) — orden del esparcido y ranuras muertas. Ninguna de las dos la ve `tsc` ni
  el lint, porque en ambas **el tipo es correcto** y lo que está mal es dónde acaba el valor.
- `check:layers` (ADR-142) — declaración de capas alineada, ninguna regla fuera de capa, y todo
  consumidor importando `@stellaria/nebula-web/styles.css`.

**El contrato de cascada, que WN no sabía que estaba roto.** ADR-119 cerró la relación
Nebula↔consumidor con una sola capa y dejó sin resolver la relación Nebula↔Nebula: dentro de un único
`@layer`, el desempate entre dos componentes lo decidía el orden del bundler. Se descubrió porque el
`xl` de un `Hero` no se aplicaba. ADR-142 lo cierra con cinco capas ordenadas por composición, y el
reparto —1 reset, 51 primitivas, 36 componentes, 45 composites, 2 utils— sale del grafo de imports,
no de un juicio a mano.

El dato que valida la taxonomía: de los **151 pares** en los que un componente resobrescribe a otro
por `className`, **ninguno queda en la misma capa**.

**Una duplicación que la falta de capas estaba causando.** `Section.Title` reimplementaba a mano la
tipografía que `Title` ya sabía pintar, porque no había forma de sobrescribirla desde fuera. Hoy
compone `Title` y declara solo lo que cambia.

## Deuda declarada

- ~~**Dos números de ADR duplicados**~~ — **resuelto el 2026-08-14**. `ADR-124` y `ADR-138` estaban
  cada uno en dos archivos. En ambos pares conserva el número el documento cuyas referencias son
  **texto suelto**, porque son las que se quedan mal sin avisar; el otro se renumera y sus referencias
  eran enlaces con nombre completo, que se ven al romperse. Así, «el bloque de código» mantiene 124 y
  «el cuerpo de la sección» pasa a **ADR-143**; «recalibración de los springs» mantiene 138 —además se
  creó antes, 11:30 frente a 12:59— y «la sección monta su cuerpo» pasa a **ADR-144**. Cada
  renumerado lleva dentro de qué número viene, porque **los mensajes de commit son inmutables** y los
  anteriores a esa fecha siguen citando el número viejo.

  `ADR-087` es un hueco limpio, sin referencias ni archivo, y se deja como está: rellenarlo con un ADR
  de otra época confunde más que el hueco.

- **Un enlace muerto en los docs semilla**: `docs/stellaria-ui/README.md` §12 apunta a
  `PROMPT-refine-ui-library.md`, que no existe ni ha existido nunca en el repo. Se deja por si es una
  entrada pendiente de escribir y no un descuido.

- **`CONTINUAR-barrido-ranuras.md` está obsoleto**: habla de «tanda 18 de unas 40» con fecha del
  2026-08-07, y el cuaderno del barrido cerró sus 113 filas. No sirve como prompt de arranque.

- **WR y WB están dadas por cerradas sin documento de cierre.** `CLAUDE.md` las da por cerradas y
  `05-roadmap.md` §WR exige explícitamente `docs/wr-closure.md`, que no existe; WB (`2.2-brand-align`)
  ni siquiera aparece en el roadmap. Este cierre añade la entrada de WN al roadmap, pero no inventa
  las dos anteriores: cerrarlas exige medir lo que hicieron, y eso es trabajo, no trámite.

## Lo que WN NO hizo

No tocó color, ritmo, radio ni tipografía —eso lo cerró WB—. No añadió componentes al catálogo: sigue
en 158. No migró a los consumidores. Los huecos de catálogo que aparecieron se anotaron en el
cuaderno de N5 y se decidieron fuera de la fase.

## La revisión previa a W5 ya está hecha

`REVISION-final-antes-de-W5.md` se ejecutó el 2026-08-08 y su resultado vive en
[`docs/reviews/revision-previa-w5-2026-08-08.md`](reviews/revision-previa-w5-2026-08-08.md): los nueve
puntos de riesgo recorridos, con `check:docs` reparado —no podía fallar, hasheaba un conjunto vacío—,
el generador pasando de 158 a 216 componentes documentados y axe corrido por primera vez.

Su único punto diferido es deliberado: **el vocabulario de las ranuras se congela** con trece nombres
incoherentes entre hermanos. Renombrar una ranura es breaking y esa era la última ventana; la decisión
está tomada y anotada para que sea consciente, no un olvido.

**Reverificado el 2026-08-14 sobre este HEAD**, unos cuarenta commits después: el riesgo nº 1 —las
conversiones a `Box`/`Text` que pudieran haber cambiado la etiqueta— sigue limpio. Se midió con un
método distinto al de agosto, censando la población de etiquetas por directorio de componente en vez
de emparejar secuencias, para que la corroboración fuese independiente: **153 directorios, 0 etiquetas
semánticas perdidas**. El detector se validó inyectando una regresión a mano y comprobando que
dispara.

## Siguiente

W5, la publicación de la v1 web.
