# Anexo C — Estado real de Stellaria (`src/ui/*`) como fuente de migración

> Verificado el 2026-07-14 con `ls`/lecturas sobre `C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend`.
> A diferencia de los anexos A/B (consumidores a reemplazar), este anexo documenta la **base de código a migrar**: anatomía, calidad y gaps — no props exhaustivas.

## 1. `src/ui/tokens` — `@stellaria/tokens`

```
src/tokens/  animation.ts  colors.ts  effects.ts  layout.ts  typography.ts
src/theme/   index.ts      (themes = { dark, light } + semánticos)
src/types/   animations, base, border, colors, dimensions, effects,
             layouts, spacing, typography, variants
```

- **Formato**: TypeScript puro (`as const`), sin JSON. Sin dependencias.
- **Colores**: escalas **100–900** (indigo, violet, green, yellow, red, blue, orange, teal, pink, cyan, lime, grape, rose, gold, light, dark; `gray` con sub-escalas `.light`/`.dark`). ⚠️ Los docs especifican 50–950 — divergencia a resolver (ADR).
- **Tipografía**: Geist Sans/Mono; `size` con button/h1–h6/body1–3/caption; `lineHeight` 1.2/1.45/1.65; weights 100–900.
- **Animation**: `duration` (instant/fast/base/slow/expressive), `easing` (beziers), `transforms`, `transition`, `keyframes`.
- **Effects**: `blur` (none–xxl), `glass.surface.{subtle,default,strong}` + `noiseOpacity`, `shadows` (xxs–xxl como strings CSS). ⚠️ **No existen tokens `gradient.*`** pese a que los catálogos los asumen.
- **Contrato de types**: cada módulo exporta `<Cat>Props` (type) + `Keys<Cat>` (array runtime `as const`) → `base.ts` compone `BaseProps` y `KeysBase` que alimentan el Collector. `variants.ts`: `Size = xs–xl`, `Variant = filled|outline|light|glass|ghost|glow|gradient|unstyled` (difiere del set del doc de arquitectura), `InteractionProps = {disabled, loading}`.

## 2. `src/ui/native` — `@stellaria/ui-native` — 39 componentes (ls verificado)

| Categoría          | Componentes                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Layout** (16)    | AspectRatio, Box, Center, Column, Container, Divider, Flex, Grid (Col/Simple, store Jotai), Group (store Jotai), Header (BackButton/StatusError), Paper, Pressable, Row, SafeArea, Scroll, Space |
| **Typography** (8) | Anchor, Blockquote, Code (Block/Inline, refractor), Highlight, List (store Jotai), Mark, Text (TextGlass/TextGradient), Title                                                                    |
| **Actions** (6)    | Action, Button (+Group, useRipple/useButtonPressable, variants.ts), ButtonClose, ButtonCopy, ButtonFloating, ThemeSwitch (Skia + store)                                                          |
| **Inputs** (7)     | Checkbox, Chip, PasswordInput, SegmentedControl, Switch, TextInput, Textarea                                                                                                                     |
| **Feedback** (1)   | Loader (Circular/Dot/Dots)                                                                                                                                                                       |
| **Effects** (1)    | LiquidGlass (shaders SKSL, 8 hooks, store Jotai, Provider/Target/Backdrop, presets, quality tiers)                                                                                               |

**No existen aún** (pese a catálogos phase-2): Overlays, DataDisplay, Navigation, Charts, Carousels, AnimatedText, Micro-interactions, Domain.

### Anatomía estándar (patrón consolidado)

```
Component/
  Component.tsx          # forwardRef + displayName + CreateAnimated
  Component.types.ts     # Props = AnimatedProps<Element<"view">> & Omit<BaseProps,...> & propias
  Component.styles.ts    # Unistyles StyleSheet.create((theme) => ...) + useVariants
  Component.collector.ts # filtra props tokenizadas via Keys*
  components/…           # sub-componentes (Content, Ripple, Blur, …)
  hook/…                 # hooks propios (useRipple, useButtonPressable)
  index.ts
```

- **Compound components**: `Object.assign(Root, { Sub })` + estado compartido con **Jotai `Provider` + `createStore()`** (no Context) — Grid, Group, List, ThemeSwitch, LiquidGlass.
- **Todo animado por defecto**: `CreateAnimated(View)` (no opt-in).
- **Hooks compartidos** (`src/hooks/`): `useDebounce`, `useDisclosure`, `useTheme`, `useUncontrolled` (debounce/disclosure aún sin consumidores). Util `triggerHaptic` en `src/utils/haptic.ts`.

### Calidad verificada (exploración 2026-07-14)

- **`any`**: 8 ocurrencias en 3 archivos, todas en fronteras de framework (`utils/animated.ts` ×4, `utils/styles.ts` ×2, `Layout/Box/utils/blur.tsx` ×2).
- **A11y**: 19 usos en 16 archivos (Button, Action, ButtonClose, Checkbox, Chip, Switch, SegmentedControl, PasswordInput, Anchor, Blockquote, List, LiquidGlass, Pressable, BackButton, ThemeSwitch, Code). ⚠️ **Gap: TextInput y Textarea sin props de a11y** (sin `accessibilityLabel`, label no vinculado) — incumple el contrato a11y del propio doc de arquitectura.
- **Tests/stories**: 0 archivos (`*.test|spec|stories` = 0).
- **Deps reales** (package.json): react 19.1.0, react-native 0.81.5, reanimated ~4.1.1 (**v4**), unistyles ^3.0.24, gesture-handler ^2.30, worklets ^0.7.1, safe-area-context ^5.6, mmkv ^4.1, **skia ^2.4.21**, jotai ^2.18 + jotai-family, expo-* ^55.0.8 (blur/haptics/sensors/clipboard/linear-gradient), @expo/vector-icons ^15, @expo-google-fonts/geist ^0.4.1, masked-view ^0.3.2, fast-deep-equal, refractor ^5.
- Referencias representativas evaluadas: `Button` (sin `any`, a11y completa, GestureDetector + ripple), `TextInput` (forwardRef, controlled+uncontrolled, status `idle|validating|valid|invalid` — pero sin a11y), `Header` (implementa fielmente el spec de stellaria-input-components-plan), `LiquidGlass` (gleam/quality/presets/gyro ya implementados del plan v2).

## 3. `src/ui/web` — `@stellaria/ui-web` — stub vacío

`index.ts` → `src/theme.ts` → `runtime.ts` (`applyWebThemeClass()`) + `theme.css.ts` con `themeLightClass = style({})` y `themeDarkClass = style({})` **ambas vacías**. Única dep: `@vanilla-extract/css ^1.17.4`. **La librería web no está iniciada** — no hay componentes, recipes, sprinkles ni CSS vars reales.

## 4. `.claude/skills` — 17 skills + README (gobernanza)

| Skill                             | Propósito                                | Relevancia para Nebula                             |
| --------------------------------- | ---------------------------------------- | -------------------------------------------------- |
| 00-project-guardrails             | Reglas del monorepo Stellaria            | Adaptar (reescribir guardrails para Nebula)        |
| 10-monorepo-workspace             | Crear/mover módulos sin romper pipelines | Adaptar                                            |
| 11-typescript-strict              | Type-safety extremo                      | Migrar casi tal cual                               |
| 20-ui-web-patterns                | Patrones componentes web                 | Adaptar (React Aria + VE)                          |
| 21-ui-native-patterns             | Patrones componentes native              | Migrar (base sólida)                               |
| 22-style-system-tokens-governance | Gobernanza de tokens                     | Migrar                                             |
| 23-theme-a11y-motion              | Theming/contraste/motion AA              | Migrar                                             |
| 24-effects-glass-blur-gradients   | Materiales visuales con guardrails       | Migrar                                             |
| 30-services-domain-patterns       | Servicios de dominio                     | No aplica (fuera de UI lib)                        |
| 31-api-query-websocket            | Fetching/caching                         | No aplica                                          |
| 32-enterprise-multi-tenant        | Multi-tenant                             | No aplica                                          |
| 33-permissions-frontend-mirror    | Espejo de permisos                       | Adaptar (permission gating es requisito de Nebula) |
| 40-pos-offline-first              | POS offline                              | No aplica                                          |
| 50-architecture-decisions         | ADR-lite                                 | Migrar                                             |
| 90-quality-gates                  | Gates por cambio                         | Migrar + ampliar (a11y CI, bundle budget)          |
| 91-git-pr-conventions             | Convenciones git                         | Migrar                                             |
| 99-custom-skills-roadmap          | Skills futuras                           | Revisar                                            |

## 5. Contradicciones docs ↔ código detectadas (a resolver en ADRs / checkpoint)

1. Motion web: `frontend-development-plan.md` dice "VE + **Emotion**"; `component-architecture.md` y phase-3 dicen "VE + **Framer Motion**". (tfv ya usa `motion` v12.)
2. Orden de fases 2/3 invertido entre narrativa y tabla del plan maestro.
3. Rutas de skills `.codex/` vs reales `.claude/`.
4. Escala de alcance: "~30 native / ~35 web" (plan) vs catálogos de **177/204**.
5. Escala cromática 50–950 (docs) vs **100–900** (código).
6. Tokens `gradient.*` asumidos por docs; inexistentes en `effects.ts`.
7. `glass.border`/`glass.noise` (docs) vs `glass.surface.* + noiseOpacity` (real).
8. `style-system-research.md §11` afirma que existe `native/src/theme.ts`; el theme real vive en `src/store/theme.ts` + `provider/StellProvider.tsx`.
9. `ui-native-components-progress.md` marca Actions/Inputs/Feedback como pendientes; están implementados. No existe la carpeta `Interactions/` que menciona.
10. Forms: `component-architecture.md` define `FieldAtom` propio; `stellaria-input-components-plan.md` decide usar la librería `form-atoms` (que ambos consumidores ya usan).
11. `@stellaria/hooks` descrito como paquete; los hooks reales viven dentro de ui-native.
12. Reanimated "v3" en docs; **v4** en package.json.
