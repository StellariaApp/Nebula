# Cierre de F0 — Scaffold y fundaciones

> Verificado el 2026-07-16 sobre `main`. Toda la evidencia es de ejecuciones sin caché (`--force`) en Windows 11, Node 26.2, pnpm 11.13.

## Checklist de entregables (docs/05-roadmap.md · F0)

- [x] **Monorepo Turborepo 2.10 + pnpm 11** con paquetes core y pipelines (`build`/`typecheck`/`lint`/`test`/`size` + `check:contrast`/`gen:palette`) — F0.1.
- [x] **Spike TS 7** validando la cadena completa (tsc puro, Vanilla Extract + vite, Expo SDK 57 + Metro, Storybook 10.5, eslint) — veredicto escrito en ADR-012 §"Resultado del spike": 4/5 eslabones verdes con `typescript@7.0.2`; typed-linting ROJO → **contingencia aplicada**: `typescript@5.9.3` SOLO en la raíz para la cadena de lint. Regla derivada: sin features TS7-only en código de librería.
- [x] **`@stellaria/nebula-tokens`**: contrato `NebulaTheme` completo (02 §2), 10 módulos de types migrados con los fixes obligatorios (KeysBase+effects, KeysVariants+data, variantes reales + `VariantRecipe`), `NebulaField` (ADR-005), tokens base no cromáticos, y **16 paletas 50–950 + gray integradas** — F0.2/F0.3.
- [~] **Zod schema del theme**: DIFERIDO a F1 deliberadamente. ADR-006/ADR-014 lo ubican en `@stellaria/nebula-themes` (único paquete con dep de zod; tokens mantiene cero deps), y ese paquete se monta con los temas oficiales en F1. El roadmap lo listaba dentro del ítem de tokens — queda registrado aquí como desviación consciente, no como olvido.
- [x] **`tools/palette-gen`** (OKLCH 50–950, curva L compartida + perfiles de superficie; modos `regen` y `from <hex>`) y **`tools/contrast-check`** (pares AA + estados + sugerencia de corrección por ajuste de L) funcionando e integrados como tasks de turbo — F0.3.
- [x] **Skills de gobernanza instaladas** (`.claude/skills/`): 7 migradas + 5 adaptadas (ui-web reescrita para React Aria+VE; quality-gates ampliada con 03 §4; permissions como spec de PermissionGate) + veredicto de la revisada en el README de skills — F0.4.
- [x] **CLAUDE.md** raíz para sesiones nuevas sin contexto — F0.4.

## Gate verificado comando por comando

| Comando                                      | Resultado               | Evidencia                                                                                                                                 |
| -------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                               | ✅ limpio               | lockfile estable, sin peer errors bloqueantes; pnpm self-managed a 11.13.0                                                                |
| `pnpm turbo build typecheck lint --force`    | ✅ **22/22 tareas**     | 6 paquetes core (build+typecheck+lint) + 2 tools (typecheck+lint), 9.6s sin caché                                                         |
| `pnpm turbo check:contrast --force`          | ✅ **28/28 pares PASS** | texto/superficies 4.5:1, semánticos 700, hover filled, focus ≥3:1 ×4 superficies; camino negativo verificado (FAIL → sugerencia + exit 1) |
| `pnpm gen:palette from "#0ea5e9" --name sky` | ✅                      | demo documentada en tools/README.md                                                                                                       |
| Contingencia TS                              | ✅ documentada          | ADR-012: tsc 7.0.2 por paquete / lint 5.9.3 raíz, verificado con regla tipada disparando                                                  |

**Veredicto: GATE DE F0 EN VERDE.** F1 puede abrirse.

## Estado real (matices que F1 debe conocer)

1. **Contingencia ADR-012 activa**: revisar trimestralmente si typescript-eslint ya soporta TS 7 para retirar el pin 5.9.3.
2. **Valores provisionales pendientes de calibración** (F1/F2): springs de motion, equivalencias
   native de las sombras duales y la luminosidad de `yellow` en pasos medios. `caption: 8px` quedó
   resuelto posteriormente en ADR-024/W2.V con `caption=12`.
3. **Gray canónico único** full-range (en lugar del par legacy light/dark): si el scheme dark de F1 necesita su propio gray, `palette-gen` lo genera en una línea.
4. Paquetes `private: true` hasta decidir publicación (changesets + registry premium — mini-ADR pendiente, supuesto 5 del roadmap).
5. El tema de humo de `tools/contrast-check` es la semilla natural de `nebula-light`.

## Pendientes que abre F1 (theming dual + playgrounds — docs/05)

- `@stellaria/nebula-themes`: **Zod schema** del contrato + temas oficiales `nebula-light`/`nebula-dark` completos.
- Runtime dual: `NebulaProvider` web (createThemeContract + CSS vars + `ColorSchemeScript`) y native (Unistyles configure + storage inyectable); `useTheme()` en hooks.
- Ambos playgrounds arrancando (Storybook 10.5 web + Expo/SB-RN) con toolbar tema/scheme/reduced-motion.
- Primeros primitivos demo (Box, Text, Button) en ambas plataformas.
- Gates nuevos: axe CI sobre stories + size-limit por entry conectados.
