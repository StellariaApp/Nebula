# Prompts de ejecución de Nebula

> Organizados en 5 carpetas-etapa (decisión del propietario, 2026-07-15). Cada archivo contiene prompts secuenciales autocontenidos para sesiones de **Claude Opus** — copiar el bloque completo, en orden estricto. Cada fase termina escribiendo su `docs/<código>-closure.md`, que es el prerequisito verificable de la siguiente. Fuente de verdad: [docs/05-roadmap.md](../docs/05-roadmap.md).

## Estructura

```
prompts/
├─ 1-fundaciones/      F0  — scaffold + spike TS7 ✅ + tokens + tools + gobernanza
├─ 2-web/              W1–W6 — desarrollo → publicación 🚀 → premium (superficie web)
├─ 3-theme-creator/    TC  — pista paralela (arranca al cerrar W1)
├─ 4-native/           N1–N5 — desarrollo → publicación 🚀 → premium (superficie native)
└─ 5-review/           R   — re-verificación de matriz + planes/codemods de migración
```

## Índice

| Etapa            | Fase | Archivo                                                        | Contenido                                                                       | Prompts |
| ---------------- | ---- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------- |
| 1. Fundaciones   | F0   | [1-fundaciones/F0-prompts.md](1-fundaciones/F0-prompts.md)     | Scaffold + spike TS7 _(✅ 2026-07-15)_ + tokens + tools + gobernanza            | 4       |
| 2. Web           | W1   | [2-web/W1-prompts.md](2-web/W1-prompts.md)                     | Themes + runtime web + playground + piloto de anatomía                          | 4       |
|                  | W2   | [2-web/W2-prompts.md](2-web/W2-prompts.md)                     | Tier 1 (foundation → nav core)                                                  | 5       |
|                  | W3   | [2-web/W3-prompts.md](2-web/W3-prompts.md)                     | Tier 2 (inputs completos, patterns, DataGrid, charts, CardComplex ⚠️checkpoint) | 5       |
|                  | W4   | [2-web/W4-prompts.md](2-web/W4-prompts.md)                     | Tier 3 (effects, DnD, rich content)                                             | 4       |
|                  | W5   | [2-web/W5-prompts.md](2-web/W5-prompts.md)                     | **Publicación web v1** 🚀 (⚠️ confirmar licencia/visibilidad)                   | 2       |
|                  | W6   | [2-web/W6-prompts.md](2-web/W6-prompts.md)                     | Premium web: registry privado + commerce/sales/payments/people/maps             | 3       |
| 3. Theme Creator | TC   | [3-theme-creator/TC-prompts.md](3-theme-creator/TC-prompts.md) | MVP → AA en vivo → catálogo completo + temas fonicredito/tfv-gold               | 3       |
| 4. Native        | N1   | [4-native/N1-prompts.md](4-native/N1-prompts.md)               | Runtime native + migración 39 de Stellaria + Tier 1 + lint de paridad           | 4       |
|                  | N2   | [4-native/N2-prompts.md](4-native/N2-prompts.md)               | Tier 2 + TabBar adapter + native-camera                                         | 3       |
|                  | N3   | [4-native/N3-prompts.md](4-native/N3-prompts.md)               | Tier 3 (LiquidGlass v2, shaders, charts)                                        | 3       |
|                  | N4   | [4-native/N4-prompts.md](4-native/N4-prompts.md)               | **Publicación native v1** 🚀                                                    | 1       |
|                  | N5   | [4-native/N5-prompts.md](4-native/N5-prompts.md)               | Premium native (paridad con W6) + cierre premium                                | 2       |
| 5. Review        | R    | [5-review/R-prompts.md](5-review/R-prompts.md)                 | Gate de migración: re-verificación + planes/codemods fonicredito y tfv          | 2       |

## Prompts transversales

No pertenecen a una fase: auditan lo ya construido y producen informe + ADRs, sin implementar. Se
ejecutan entre fases, cuando su hallazgo abarataría el trabajo de la siguiente.

| Código | Archivo                                                                                                | Contenido                                                                                     | Requiere  |
| ------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------- |
| WV     | [2-web/WV-variantes-y-cobertura-de-tematizacion.md](2-web/WV-variantes-y-cobertura-de-tematizacion.md) | Qué componentes deben aceptar `variant` y con qué coste de contrato, bundle, paridad W/N y a11y | W2 cerrado |

## Reglas de uso

1. **Orden**: F0 → W1…W5 → W6 → N1…N4 → N5 → R. Flexibilidades permitidas: **TC** corre en paralelo desde el cierre de W1 (hitos: TC.1 tras W1, TC.2 tras W2, TC.3 tras W4); **W6** puede solaparse con el arranque de N1 (el core native solo necesita W5); **N5** requiere N4 + W6.
2. Cada fase escribe su `docs/<código>-closure.md` con el gate verificado antes de abrir la siguiente.
3. `docs/` es la fuente de verdad: si cambias una decisión, actualiza el doc/ADR **antes** del siguiente prompt.
4. Los prompts marcan dónde **preguntar al propietario** (CardComplex W3.5, licencia/visibilidad W5.1, registry premium W6.1, motores con trade-offs). Las respuestas se registran en docs/ADRs.
5. Si una sesión se corta, el mismo prompt es re-ejecutable: todos empiezan leyendo el estado real del repo.
