# Prompts de ejecución de Nebula

> Organizados en 5 carpetas-etapa (decisión del propietario, 2026-07-15). Cada archivo contiene prompts secuenciales autocontenidos para sesiones de **Claude Opus** — copiar el bloque completo, en orden estricto. Cada fase termina escribiendo su `docs/<código>-closure.md`, que es el prerequisito verificable de la siguiente. Fuente de verdad: [docs/05-roadmap.md](../docs/05-roadmap.md).

## Estructura

```
prompts/
├─ 1-fundaciones/      F0  — scaffold + spike TS7 ✅ + tokens + tools + gobernanza
├─ 1.5-docs-site/      DS  — la web pública (pista paralela; documenta web, native y premium)
├─ 2-web/              W1–W6 — desarrollo → publicación 🚀 → premium (superficie web)
├─ 2.1-web-refine/    WR  — auditoría visual del catálogo + plan de alineación (entre W4 y W5)
├─ 2.2-brand-align/    WB  — afinamiento de marca contra la identidad de Stellaria
├─ 2.3-web-normalize/  WN  — normalización de la anatomía de los 158 (última puerta antes de W5)
├─ 2.4-rosette-product/RP  — la maqueta de Rosette en el playground (pista paralela)
├─ 3-theme-creator/    TC  — pista paralela (arranca al cerrar W1)
├─ 4-native/           N1–N5 — desarrollo → publicación 🚀 → premium (superficie native)
└─ 5-review/           R   — re-verificación de matriz + planes/codemods de migración
```

## Índice

| Etapa             | Fase | Archivo                                                                                    | Contenido                                                                          | Prompts |
| ----------------- | ---- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------- |
| 1. Fundaciones    | F0   | [1-fundaciones/F0-prompts.md](1-fundaciones/F0-prompts.md)                                 | Scaffold + spike TS7 _(✅ 2026-07-15)_ + tokens + tools + gobernanza               | 4       |
| 1.5 Docs Site     | DS1  | [1.5-docs-site/DS1-prompts.md](1.5-docs-site/DS1-prompts.md)                               | Spike Next 16 + chasis bilingüe + los 3 generadores                                | 3       |
|                   | DS2  | [1.5-docs-site/DS2-prompts.md](1.5-docs-site/DS2-prompts.md)                               | `packages/demos` + landing + las 10 guías                                          | 3       |
|                   | DS3  | [1.5-docs-site/DS3-prompts.md](1.5-docs-site/DS3-prompts.md)                               | Plantilla + piloto de 8 y barrido de las 158 (**8 lotes**)                         | 2 + 8   |
|                   | DS4  | [1.5-docs-site/DS4-prompts.md](1.5-docs-site/DS4-prompts.md)                               | Gates del sitio + despliegue público + `docs/ds-closure.md`                        | 2       |
| 2. Web            | W1   | [2-web/W1-prompts.md](2-web/W1-prompts.md)                                                 | Themes + runtime web + playground + piloto de anatomía                             | 4       |
|                   | W2   | [2-web/W2-prompts.md](2-web/W2-prompts.md)                                                 | Tier 1 (foundation → nav core)                                                     | 5       |
|                   | W3   | [2-web/W3-prompts.md](2-web/W3-prompts.md)                                                 | Tier 2 (inputs completos, patterns, DataGrid, charts, CardComplex ⚠️checkpoint)    | 5       |
|                   | W4   | [2-web/W4-prompts.md](2-web/W4-prompts.md)                                                 | Tier 3 (effects, DnD, rich content)                                                | 4       |
| 2.1 Web Refine    | WR1  | [2.1-web-refine/WR1-prompts.md](2.1-web-refine/WR1-prompts.md)                             | Censo de cobertura + baseline de Figma a disco                                     | 2       |
|                   | WR2  | [2.1-web-refine/WR2-prompts.md](2.1-web-refine/WR2-prompts.md)                             | Auditoría visual por familia (**8 agentes en paralelo**)                           | 8       |
|                   | WR3  | [2.1-web-refine/WR3-prompts.md](2.1-web-refine/WR3-prompts.md)                             | Consolidación por causa + plan de alineación                                       | 1       |
|                   | WR4  | [2.1-web-refine/WR4-prompts.md](2.1-web-refine/WR4-prompts.md)                             | Ejecución de los tramos + cierre `docs/wr-closure.md`                              | 1 + N   |
| 2.2 Brand Align   | WB   | [2.2-brand-align/README.md](2.2-brand-align/README.md)                                     | Afinamiento de marca _(cerrada)_                                                   | 1       |
| 2.3 Web Normalize | WN   | [2.3-web-normalize/README.md](2.3-web-normalize/README.md)                                 | Anatomía de los 158: hojas, vars, compound y props de ranura _(cerrada)_           | 1 + N   |
| 2.4 Rosette       | RP   | [2.4-rosette-product/README.md](2.4-rosette-product/README.md)                             | Maqueta del producto Rosette en el playground _(paralela)_                         | 1       |
| 2. Web            | W5.0 | [2-web/W5.0-antes-de-publicar.md](2-web/W5.0-antes-de-publicar.md)                         | Los dos gates sin correr (a11y, visual) + JSDoc del contrato + el sitio            | 1       |
|                   | W5   | [2-web/W5-prompts.md](2-web/W5-prompts.md)                                                 | **Publicación web v1** 🚀 (⚠️ confirmar licencia/visibilidad)                      | 2       |
|                   | W6   | [2-web/W6-prompts.md](2-web/W6-prompts.md)                                                 | Premium web: registry privado + commerce/sales/payments/people/maps                | 3       |
| 3. Theme Creator  | TC   | [3-theme-creator/TC-prompts.md](3-theme-creator/TC-prompts.md)                             | MVP → AA en vivo → catálogo completo + temas fonicredito/tfv-gold                  | 3       |
| 4. Native         | N1   | [4-native/N1-prompts.md](4-native/N1-prompts.md)                                           | Runtime native + migración 39 de Stellaria + Tier 1 + lint de paridad              | 4       |
|                   | N2   | [4-native/N2-prompts.md](4-native/N2-prompts.md)                                           | Tier 2 + TabBar adapter + native-camera                                            | 3       |
|                   | N3   | [4-native/N3-prompts.md](4-native/N3-prompts.md)                                           | Tier 3 (LiquidGlass v2, shaders, charts)                                           | 3       |
|                   | N4   | [4-native/N4-prompts.md](4-native/N4-prompts.md)                                           | **Publicación native v1** 🚀                                                       | 1       |
|                   | N5   | [4-native/N5-prompts.md](4-native/N5-prompts.md)                                           | Premium native (paridad con W6) + cierre premium                                   | 2       |
| 5. Review         | R    | [5-review/R-prompts.md](5-review/R-prompts.md)                                             | Gate de migración: re-verificación + planes/codemods fonicredito y tfv             | 2       |
| 5. Review         | RV   | [5-review/RV-revision-visual-contra-figma.md](5-review/RV-revision-visual-contra-figma.md) | Calibración visual del catálogo web contra Figma (suelto, tras T6 de la auditoría) | 1       |

## Prompts transversales

No pertenecen a una fase: auditan lo ya construido y producen informe + ADRs, sin implementar. Se
ejecutan entre fases, cuando su hallazgo abarataría el trabajo de la siguiente.

| Código | Archivo                                                                                                | Contenido                                                                                       | Requiere   |
| ------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------- |
| WV     | [2-web/WV-variantes-y-cobertura-de-tematizacion.md](2-web/WV-variantes-y-cobertura-de-tematizacion.md) | Qué componentes deben aceptar `variant` y con qué coste de contrato, bundle, paridad W/N y a11y | W2 cerrado |

## Reglas de uso

1. **Orden**: F0 → W1…W4 → **WR** → **WB** → **WN** → **W5.0** → W5 → W6 → N1…N4 → N5 → R. **WR va entre W4 y W5** y no es opcional: publicar un catálogo cuya calibración visual no se ha auditado convierte cada defecto en una incidencia de terceros, y el baseline de ADR-037 no puede capturarse sobre defectos conocidos (ver [2.1-web-refine/README.md](2.1-web-refine/README.md)). Flexibilidades permitidas: **TC** corre en paralelo desde el cierre de W1 (hitos: TC.1 tras W1, TC.2 tras W2, TC.3 tras W4); **DS** corre en paralelo desde ya (DS1 y DS2 no dependen de nada; **DS3 requiere WN cerrada** porque escribe 158 páginas contra la API que WN está normalizando); **W6** puede solaparse con el arranque de N1 (el core native solo necesita W5); **N5** requiere N4 + W6.
2. Cada fase escribe su `docs/<código>-closure.md` con el gate verificado antes de abrir la siguiente.
3. `docs/` es la fuente de verdad: si cambias una decisión, actualiza el doc/ADR **antes** del siguiente prompt.
4. Los prompts marcan dónde **preguntar al propietario** (CardComplex W3.5, licencia/visibilidad W5.1, registry premium W6.1, motores con trade-offs). Las respuestas se registran en docs/ADRs.
5. Si una sesión se corta, el mismo prompt es re-ejecutable: todos empiezan leyendo el estado real del repo.
