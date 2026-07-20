# Cierre de W1 — Theming web + playground

> Verificado el 2026-07-20 sobre `main`. Requisito previo: F0 cerrado (`docs/f0-closure.md`).

## Entregables por prompt

| Prompt | Entregable                                                                              | Estado |
| ------ | --------------------------------------------------------------------------------------- | ------ |
| W1.1   | `@stellaria/nebula-themes`: schema Zod, 4 temas oficiales, `loadTheme`                  | ✅     |
| W1.2   | Runtime web (`createThemeContract`, `NebulaProvider`, `ColorSchemeScript`) + hooks base | ✅     |
| W1.3   | Playground Storybook 10.5 + gates `a11y` y `size`                                       | ✅     |
| W1.4   | Pilotos Box, Text y Button + patrón canónico                                            | ✅     |

## Gate de W1 (docs/05-roadmap.md)

| Criterio                                                      | Resultado                                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Cambiar tema reconfigura los componentes **sin tocar código** | ✅ Verificado en test (`Button` resuelve vars distintas en los 4 temas) y en la story `AllThemes` |
| axe en verde                                                  | ✅ **29/29 stories, 0 violaciones** (`turbo a11y`)                                                |
| size-limit en verde                                           | ✅ 5/5 entries dentro de budget                                                                   |
| Testing contract de los pilotos                               | ✅ 39 tests en `nebula-web` (7 archivos)                                                          |
| Pipeline completa                                             | ✅ **29/29 tareas** (`turbo build typecheck test lint size --force`)                              |
| Contraste de los temas                                        | ✅ **5 temas × 28 pares, 0 fallos** (`pnpm check:contrast`)                                       |

**Veredicto: GATE DE W1 EN VERDE.**

## Medidas reales de bundle (brotli, por módulo)

| Entry              | Tamaño   | Budget |
| ------------------ | -------- | ------ |
| Box (primitivo)    | 8,46 kB  | 9 kB   |
| Text (primitivo)   | 8,76 kB  | 9 kB   |
| Button (compuesto) | 45,1 kB  | 48 kB  |
| NebulaProvider     | 12,55 kB | 15 kB  |
| useTheme           | 6,73 kB  | 9 kB   |

Los budgets de docs/03 §3 se **elevaron** en este cierre (5/15/35 kB gzip → 9/48/70 kB brotli) tras medir el coste real de la anatomía decidida: `motion` + `domAnimation` cuesta 27,7 kB y `react-aria` 9,75 kB. El propietario ratificó mantener `motion` en toda la librería priorizando la paridad exacta de física con Reanimated (ADR-018).

## Hallazgos del gate a11y (bugs reales corregidos)

El gate axe encontró dos defectos que la revisión de código no habría visto:

1. **La clase base de `Text` pisaba las style props**: su `color` ganaba a la clase atómica de `c="…"`, dejando texto ilegible sobre superficies de color. Corregido con **`@layer nebula.base`** — regla ahora obligatoria para todo componente con estilos base (ver patrón §2).
2. **`loading` dejaba el botón sin nombre accesible**: `visibility: hidden` sobre el label lo saca del árbol de accesibilidad (violación `button-name`, crítica). Corregido con `opacity: 0`.

También se corrigió un falso negativo del propio playground: el canvas no pintaba la superficie del tema, así que las stories en oscuro se evaluaban contra el blanco de Storybook.

## Cambios de contrato en este cierre

- **`ThemeColors` incluye ahora las 16 paletas por nombre** (`colors.teal`, `colors.grape`…) además de los roles semánticos, a petición del propietario. Los cuatro temas oficiales las derraman; en temas dark **no se invierten** (son identidad, no roles). El Zod schema las valida. El bug que traía el borrador (`[key in keyof PaletteName]`, que producía `charAt`/`toString`) quedó corregido a `[K in PaletteName]`.
- Sigue vigente el guardrail de docs/02 §2.1: **los componentes leen roles**, no paletas crudas. Las paletas en `colors` son para composiciones puntuales del consumidor.

## Pendientes y decisiones abiertas para W2

1. **`primary` de `nebula-light`**: apareció un cambio a `palettes.blue` sin commitear que contradecía docs/02 §3 (indigo/violet, decisión cerrada) y descuadraba light↔dark. Se restauró **indigo**; si se quiere blue, requiere ADR y actualizar docs/02 §3 y `nebula-dark` a la vez.
2. **Paletas como CSS vars**: `colors.<paleta>` es accesible desde JS, pero NO se emite como CSS var ni se expone en las style props de `Box` (`bg="teal.500"` no existe). Añadirlas supondría ~176 vars por tema y duplicar el CSS de sprinkles; decidir en W2 si compensa.
3. **`LazyMotion` por componente**: hoy cada componente animado monta el suyo. Evaluar en W2 subirlo a `NebulaProvider` si aparece anidamiento redundante.
4. Calibraciones heredadas de F0 aún abiertas: springs, sombras native, `caption: 8px`, luminosidad de `yellow`.

## Arranque recomendado de W2 (Tier 1)

`docs/patterns/web-component-template.md` es la referencia obligatoria. Orden sugerido: completar Foundation/Typography (Title, Anchor, Divider, Paper) reutilizando Box/Text, después Actions (ActionIcon, ButtonGroup) que ya heredan todo el patrón de Button, y solo entonces abrir inputs — donde entra `NebulaField` y el contrato a11y más exigente (docs/03 §1).
