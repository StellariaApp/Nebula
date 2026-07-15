# 04 — Mapa de migración

> Decisión C3 (2026-07-14): **primero se construye Nebula completa; las migraciones de fonicredito y tfv se ejecutan al final** como codemod/migración total (§5), y su plan detallado se elaborará cuando la librería esté lista. La única migración activa desde el día 1 es **Stellaria → Nebula** (el código semilla).

## 1. `Stellaria/src/ui/tokens` → `@stellaria/nebula-tokens`

| Archivo | Acción | Detalle |
|---|---|---|
| `src/tokens/colors.ts` | **Regenerar** | Escala 100–900 → **50–950** con `tools/palette-gen` (ADR-009); 16 paletas se conservan como identidad + roles semánticos nuevos (02 §2) |
| `src/tokens/typography.ts` | Migrar | Geist Sans/Mono, escala y pesos tal cual; revisar `caption: 8` (posible fallo AA de legibilidad → subir en calibración) |
| `src/tokens/animation.ts` | Migrar + extender | duration/easing se conservan; añadir `spring` presets y `motion.tier` (02 §2.4); `keyframes/transforms` se revisan (parte era CSS-only) |
| `src/tokens/effects.ts` | Migrar + extender | blur/glass/shadows tal cual; **añadir `gradients`** (gap detectado — no existen); shadows duales (CSS string web / elevation map native) |
| `src/tokens/layout.ts` | Migrar | breakpoints/zIndex |
| `src/types/*.ts` (10 módulos) | **Migrar casi tal cual** | El sistema `<Cat>Props` + `Keys<Cat>` + `BaseProps/KeysBase` es la base del contrato compartido; fix conocido: `KeysBase` no incluye keys de effects (bug) |
| `src/types/variants.ts` | Migrar + reconciliar | Set real (`filled\|outline\|light\|glass\|ghost\|glow\|gradient\|unstyled`) prevalece sobre el set del doc de arquitectura; se añade `variantMap` temable |
| `src/theme/index.ts` | **Refactorizar** | De `themes={dark,light}` con semánticos planos → contrato `NebulaTheme` completo (roles surface/text/border, motion, variantMap) + Zod schema (ADR-006) |
| — (nuevo) | Crear | `types/fields.ts` (`NebulaField<T>`, ADR-005) y `schema/theme.ts` (Zod) |

## 2. `Stellaria/src/ui/native` → `@stellaria/nebula-native`

### Infraestructura

| Origen | Acción | Destino / detalle |
|---|---|---|
| `src/hooks/{useDebounce,useDisclosure,useUncontrolled}` | Migrar | → `@stellaria/nebula-hooks` (cross-platform) |
| `src/hooks/useTheme` | Refactorizar | → `@stellaria/nebula-hooks/useTheme` sobre el runtime dual (02 §4) |
| `src/utils/animated.ts (CreateAnimated)` | Migrar | Mantiene los 4 `any` de frontera documentados |
| `src/utils/styles.ts`, `src/utils/haptic.ts (triggerHaptic)` | Migrar | — |
| `src/store/theme.ts` + `provider/StellProvider.tsx` | Refactorizar | → `NebulaProvider` (Unistyles configure + storage inyectable) |
| `src/config`, `src/styles` | Revisar en scaffold | Contenido menor; se absorbe donde corresponda |

### Componentes (39) — evaluación individual

**Migrar tal cual** (cambios solo de naming/tokens):

| Categoría | Componentes |
|---|---|
| Layout | AspectRatio, Box, Center, Column, Container, Divider, Flex, Grid (+Col/Simple), Group, Paper, Pressable, Row, SafeArea, Scroll, Space |
| Typography | Anchor, Blockquote, Code, Highlight, List, Mark, Text (+Glass/Gradient), Title |
| Actions | Button (+Group/ripple/variants), Action→**ActionIcon** (rename), ButtonClose, ButtonCopy, ButtonFloating |
| Feedback | Loader (Circular/Dot/Dots) |

**Migrar con refactor puntual** (gaps verificados en anexo C):

| Componente | Refactor requerido |
|---|---|
| TextInput | **Añadir contrato a11y completo** (accessibilityLabel vinculado a FormField, value, error live-region) — gap crítico detectado |
| Textarea | Ídem a11y + **fix dark mode** (bug documentado en stellaria-input-components-plan) |
| Chip | **Fix ChipGroup sin selección** (bug documentado) |
| Checkbox, Switch, PasswordInput, SegmentedControl | Migrar; alinear con FormField y `NebulaField` |
| Header (Layout) | Se divide: parte field-header → **FormField**; parte screen-header → **Header/TopBar** (decisión de matriz §4.17) |
| ThemeSwitch | Migrar → categoría Micro-interactions (`AnimatedThemeToggle`) |
| LiquidGlass | Migrar completo (shaders, 8 hooks, store, presets, quality) y **continuar el plan v2** (estrategia de captura A, blur gaussiano, dispersión) como backlog Tier 3; `useGlassQuality` se generaliza a `useDeviceTier` en `@stellaria/nebula-hooks` |

**Deuda transversal al migrar**: cero tests → cada componente migrado entra con su testing contract (ADR-15); los `Keys*` colectores se auditan contra el contrato nuevo; `refractor` (Code) se revisa como subpath por peso.

## 3. `Stellaria/src/ui/web` → `@stellaria/nebula-web`

| Archivo | Acción |
|---|---|
| `index.ts`, `src/theme.ts`, `src/runtime.ts` (`applyWebThemeClass`), `src/theme.css.ts` (clases vacías) | **Descartar** — stub sin contenido real; `@stellaria/nebula-web` se construye desde cero según 01 §4 (React Aria + VE + motion) con el contrato de theme de 02 |

## 4. Gobernanza

`.claude/skills` de Stellaria → Nebula según tabla de [anexo C §4](api/stellaria-native.md) y 01 §9 (7 migrar, 5 adaptar, 4 no aplican, 1 revisar).

## 5. Adopción futura en las apps (documentado; se ejecuta al completar la librería — C3-Q3)

> Ambas migraciones se planificarán en detalle (doc propio + orden de pantallas/rutas) cuando Nebula esté lista. Lo siguiente queda documentado como estrategia acordada.

### 5.1 fonicredito-app — codemod directo (C3-Q1)

- **Mecánica**: codemod (jscodeshift) que reescribe `@/src/services/shared/components/*` → `@stellaria/nebula-native` + renombres de props, y elimina `shared/components` al final. La tabla de mapeo componente→canónico es [00-inventory §4](00-inventory.md); el codemod se genera desde ella.
- **Renombres principales previstos**: `View→Box/Flex` (según uso de props flex), `Action→ActionIcon`, `Toggle→Switch`, `Currency→CurrencyDisplay`, `Sheet→BottomSheet`, `Segment.Control→SegmentedControl` / `Segment.Content→Tabs`, `Refresh→PullToRefresh`, `Header→FormField|Header` (desambiguación asistida: si tiene `field/error/status` → FormField), `Camera→@stellaria/nebula-native-camera` (la detección KYC permanece en la app envolviendo la captura).
- **Prerrequisitos verificables**: paridad de props confirmada por typecheck del codemod en seco; tema `fonicredito` creado con Theme Creator (no portar valores 1:1); los [B]/[I] de la matriz (Bell, HeaderUser, Splash, Update*, Logs, Notifications, ScreenError, Tabs) se reconstruyen manualmente sobre Nebula — el codemod no los toca.
- **Riesgo bajo**: mismo stack (Unistyles 3/Reanimated 4/Jotai/form-atoms); las APIs de Nebula descienden de las de FC en la mayoría de inputs.

### 5.2 tfv-frontend — migración total (C3-Q2)

- **Mecánica**: migración completa Mantine→Nebula al terminar la librería. Aunque sea "total", se ejecutará en una secuencia corta por grupos de rutas (auth → dashboard → sites públicos) dentro de una ventana única, porque los 117 wrappers son passthrough de Mantine y no admiten adapter 1:1 (se descartó el adapter layer).
- **Elementos del plan futuro**: tema `tfv-gold` con Theme Creator; codemod parcial para los casos mecánicos (imports, `Flex/Grid/Paper/Badge/Button` con mapeo directo); reconstrucción manual de patterns (Card→CardComplex con props reorganizadas, Tooltip→Menu, Container→Section); registro de los SVG propios en el registry de `@stellaria/nebula-icons`; **gate final**: `pnpm remove @mantine/*` + build verde = migración completa.
- **Los [B] de la matriz** (Cart, Product, Login…, ~30 componentes) se reconstruyen en la app sobre Nebula — están fuera del codemod.

### 5.3 Criterios de "librería lista para migrar" (gate de C3-Q3)

1. 100% de los canónicos requeridos por la app en cuestión implementados con testing contract completo (cobertura verificable contra 00-inventory §4/§5).
2. Temas de la app creados y validados AA en el Theme Creator.
3. Playgrounds mostrando todos esos componentes en los 3 presets + dark/light + reduced motion.
4. Bundle budgets en verde.
