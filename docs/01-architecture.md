# 01 — Arquitectura de Nebula

> Estado: decisiones cerradas en Checkpoints 1 y 2 (2026-07-14). Las versiones citadas fueron verificadas contra npm registry el 2026-07-14.

## 1. Visión

Nebula es una librería UI universal **Web + React Native** con API unificada por componente: los contratos de props viven en un paquete compartido y cada plataforma implementa solo la capa visual. La personalización entre productos radicalmente distintos (fintech mobile, e-commerce web, dashboard enterprise, POS) se logra **exclusivamente vía sistema de temas** — nunca con forks.

Principios no negociables (heredados del brief + Stellaria):

1. API unificada Web/Native (types compartidos).
2. Theming dual con tokens semánticos que reconfiguran TODO (color, radius, densidad, motion, glass, tipografía).
3. WCAG 2.2 AA estricto.
4. Motion alto controlado (solo `transform`/`opacity` en hot paths, reduced-motion siempre).
5. Zero-runtime styling en web; Unistyles 3 en native.
6. Tree-shaking real por componente; bundle budgets en CI.
7. Núcleo libre de dominio; dominios como paquetes premium comercializables (C1-Q1).

## 2. Monorepo

**Tooling**: Turborepo 2.10 + pnpm 11 (workspace). TypeScript **7.0** desde el inicio (C2-Q8 — ver ADR-012 y su plan de contingencia). ESLint 9 + Prettier.

```
nebula/
├─ packages/
│  ├─ tokens/            @stellaria/nebula-tokens        — tokens base + types de contratos (cero dependencias)
│  ├─ hooks/             @stellaria/nebula-hooks         — hooks cross-platform sin UI
│  ├─ themes/            @stellaria/nebula-themes        — temas oficiales (JSON) + Zod schema del theme + presets
│  ├─ icons/             @stellaria/nebula-icons         — Icon component + registry (lucide base) (C2-Q3)
│  ├─ web/               @stellaria/nebula-web           — componentes web (VE + React Aria + motion)
│  ├─ native/            @stellaria/nebula-native        — componentes RN (Unistyles 3 + Reanimated 4 + Skia)
│  ├─ native-camera/     @stellaria/nebula-native-camera — captura básica (C1-Q2)
│  └─ domains/                                  — PREMIUM (licencia separada, registry privado)
│     ├─ commerce/       @stellaria/nebula-commerce      — ProductCard, PriceTag, StockIndicator, Cart*
│     ├─ sales/          @stellaria/nebula-sales         — OrderCard, Receipt*, Invoice*, NumPad, Scanner, Shipment*
│     ├─ payments/       @stellaria/nebula-payments      — suscripciones/planes, checkout, payment status
│     ├─ people/         @stellaria/nebula-people        — UserCard, ContactCard, Activity/NotificationItem
│     └─ maps/           @stellaria/nebula-maps          — Map + geocoding→fields
├─ apps/
│  ├─ playground-web/    Storybook 10.5 (addon-a11y, theming toolbar, viewport)   (C2-Q1)
│  ├─ playground-native/ Expo SDK 57 + @storybook/react-native 10.5               (C2-Q1)
│  └─ theme-creator/     Next 16 — editor de temas (spec en 02-theming.md)
├─ tools/                scripts (contrast-check, bundle-budget, palette-gen)
└─ .claude/skills/       gobernanza (migradas/adaptadas de Stellaria — §9)
```

### Grafo de dependencias (dirección única, sin ciclos)

Todos los paquetes viven bajo el scope npm de la organización **`stellaria`** con prefijo `nebula-` (ADR-013). En el grafo se usan nombres cortos:

```
                      ┌────────────┐
                      │   tokens   │  (0 deps)
                      └─┬────┬───┬─┘
              ┌─────────┘    │   └──────────┐
        ┌─────▼─────┐  ┌─────▼────┐  ┌──────▼─────┐
        │   hooks   │  │  themes  │  │   icons    │
        └─────┬─────┘  └────┬─────┘  └──────┬─────┘
              └───────┬─────┴──────┬────────┘
                ┌─────▼────┐ ┌─────▼──────┐
                │   web    │ │   native   │
                └─────┬────┘ └─────┬──────┘
                      │            ├─ native-camera
                ┌─────▼────────────▼────┐
                │  dominios premium     │  (commerce, sales, payments…)
                └─────┬─────────────────┘
                      │
        apps/ (playgrounds, theme-creator)  +  apps consumidoras externas
```

Reglas: `tokens` no depende de nada; `web`/`native` nunca se importan entre sí; los dominios premium solo dependen de core+hooks+icons; las apps consumen lo que necesiten. Un dominio premium se crea cuando su primer módulo se implementa, no antes.

### Distribución y licencias

- Core (`tokens/hooks/themes/icons/web/native`): registry npm estándar del proyecto.
- **Dominios premium**: registry privado con acceso por licencia (npm private packages o Verdaccio/registry propio — decidir en Etapa 2 al montar CI de publicación). El código premium vive en el mismo monorepo con `publishConfig` separada.
- `@stellaria/nebula-web` con EditorImage: **Pintura es peer-dependency opcional** (C1-Q6) — el wrapper se publica, la licencia la aporta el consumidor; el componente lanza error claro en runtime/type-level si el peer no está.

## 3. Stack verificado (npm, 2026-07-14)

| Capa                | Elección                                     | Versión                                      | Decisión                                            |
| ------------------- | -------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Monorepo            | Turborepo / pnpm                             | 2.10.5 / 11.13                               | ADR-001                                             |
| Lenguaje            | TypeScript                                   | **7.0.2**                                    | C2-Q8 / ADR-012                                     |
| Web styling         | Vanilla Extract (css/recipes/sprinkles)      | 1.21 / 0.5.7 / 1.7                           | ADR-002                                             |
| Web behavior/a11y   | **React Aria (hooks)**                       | react-aria 3.50 / react-aria-components 1.19 | ADR-003 (supersede "sin Radix")                     |
| Web motion          | **motion**                                   | 12.42                                        | C2-Q5 / ADR-004                                     |
| Web posicionamiento | Floating UI                                  | 0.27                                         | (React Aria lo integra; directo solo si hace falta) |
| Native runtime      | Expo SDK / React Native                      | 57 / 0.86                                    | ADR-002                                             |
| Native styling      | Unistyles                                    | 3.3                                          | ADR-002                                             |
| Native motion       | Reanimated / Gesture Handler                 | 4.5 / 3.0                                    | ADR-004                                             |
| Native efectos      | @shopify/react-native-skia                   | 2.8                                          | —                                                   |
| Estado compuestos   | Jotai (interno)                              | 2.20                                         | ADR-010                                             |
| Forms               | form-atoms (peer opcional, duck-typed) + Zod | 3.3.3 / 4.4                                  | C2-Q6 / ADR-005                                     |
| Iconos              | lucide-react / lucide-react-native           | 1.24 / 1.24                                  | C2-Q3 / ADR-008                                     |
| Charts              | Recharts (web) / victory-native XL           | 3.9 / 41.26                                  | C2-Q7 / ADR-011                                     |
| Data grid           | @tanstack/react-table + react-virtual        | 8.21 / 3.14                                  | —                                                   |
| DnD                 | @dnd-kit/core                                | 6.3                                          | —                                                   |
| Rich text           | TipTap (web)                                 | (fijar en Etapa 2)                           | —                                                   |
| Command             | cmdk                                         | 1.1                                          | —                                                   |
| Carousel web        | embla-carousel-react                         | 8.6                                          | —                                                   |
| Playgrounds         | Storybook + @storybook/react-native          | 10.5 / 10.5                                  | C2-Q1 / ADR-007                                     |
| Theme Creator       | Next.js                                      | 16.2                                         | —                                                   |

## 4. Anatomía de componente

### Contratos compartidos (`@stellaria/nebula-tokens/types`)

Evolución del sistema ya implementado en Stellaria (`BaseProps` + `Keys*` runtime):

```
tokens/src/types/
  base.ts        BaseProps (composición de todos los *Props) + KeysBase
  spacing.ts     SpacingProps + KeysSpacing        (p, px, py, m, gap…)
  dimensions.ts  DimensionsProps + KeysDimensions  (w, h, miw, mah…)
  colors.ts      ColorsProps + KeysColors          (c, bg, bc…)  → tokens semánticos
  typography.ts  TypographyProps + KeysTypography  (ff, fz, fw, lh, ta…)
  border.ts      BorderProps + KeysBorder          (r, bw, bc por lado)
  effects.ts     EffectsProps + KeysEffects        (blur, glass, shadow, gradient)
  layouts.ts     LayoutsProps + KeysLayouts        (position, zIndex, overflow)
  animations.ts  AnimationsProps + KeysAnimations
  variants.ts    Size (xs–xl) · Variant (filled|outline|light|glass|ghost|glow|gradient|unstyled)
                 InteractionProps ({disabled, loading}) · DataProps
  fields.ts      NebulaField<T> — contrato duck-typed de forms (ADR-005)
```

Cada componente define `XxxProps` en un `types.ts` **compartido entre plataformas** (importado por `@stellaria/nebula-web` y `@stellaria/nebula-native`); solo difieren las props de plataforma (eventos DOM vs gesture), que se añaden por intersección local.

### Native (`@stellaria/nebula-native`) — patrón consolidado de Stellaria

```
components/<Name>/
  <Name>.tsx           forwardRef + displayName; CreateAnimated por defecto
  <Name>.types.ts      re-exporta/extiende el contrato compartido
  <Name>.styles.ts     Unistyles StyleSheet.create((theme) => …) + useVariants
  <Name>.collector.ts  filtra props tokenizadas vía Keys* (Collector pattern)
  components/…         sub-componentes
  hook/…               use<Name> (lógica)
  <Nombre>.md           (opcional) el porqué de lo no evidente — ADR-019
  index.ts
```

- A11y: `accessibilityRole/Label/State/Value` obligatorios en el contrato (03-a11y).
- Haptics vía `triggerHaptic` en interacciones primarias; `ReduceMotion.System` en todos los springs.

### Web (`@stellaria/nebula-web`) — nuevo, tres capas

```
components/<Name>/
  <Name>.tsx           forwardRef; hooks de React Aria (behavior+a11y) + motion
  <Name>.types.ts      mismo contrato compartido
  <Name>.css.ts        Vanilla Extract recipe() para variantes/sizes (solo estructura)
  <Name>.vars.css.ts   CSS vars locales — el color lo resuelve el variantMap del tema
  use<Name>.ts         lógica (opcional)
  <Nombre>.md           (opcional) el porqué de lo no evidente — ADR-019
  index.ts
```

> **Estructura plana** (ADR-019): sin carpeta de categoría. La plantilla completa y vinculante está en `docs/patterns/web-component-template.md`.

1. **Capa de comportamiento**: hooks de React Aria (`useButton`, `useDialog`, `useComboBox`, `useMenu`…) — focus management, keyboard nav, ARIA correcto (ADR-003). HTML nativo donde baste (`<dialog>`, `<details>`).
2. **Capa visual**: VE `recipe()` (variant × size × state) + `sprinkles` para style props (equivalente web del Collector). Desde ADR-032 las acepta **todo el catálogo**, no solo los primitivos de layout, con condiciones responsive por los cinco breakpoints del tema; quedan fuera solo los componentes que no renderizan un elemento propio. `baseLayer` en los estilos base deja de ser opcional: es lo que garantiza que la style prop del consumidor gane a la decisión interna.
3. **Capa de motion**: `motion` v12 con motion tokens; degradación a CSS transitions en componentes simples.

**Build (ADR-016)**: `nebula-web` **precompila** su CSS de Vanilla Extract con Vite en modo librería (`preserveModules` + CSS por módulo vía `vite-plugin-lib-inject-css`); las `.d.ts` las emite `tsc` (TS 7). Los consumidores importan CSS ya extraído sin ejecutar el pipeline de VE (evita minutos de compilación VE por app). `sideEffects: ["*.css"]`; `typecheck` sigue en `tsc --noEmit`.

**RSC**: los componentes interactivos son client components (`"use client"` en el boundary del paquete); los puramente presentacionales (Text, Title, Divider, Paper…) se mantienen server-safe. Regla en 03-performance.

### Compound components (ADR-010)

`Object.assign(Root, { Sub })` + estado compartido con **Jotai `Provider` + `createStore()`** (patrón validado en Stellaria: Grid, Group, List, ThemeSwitch, LiquidGlass). Jotai es dependencia **interna** de web/native — el consumidor no necesita usar Jotai en su app.

### Card dual (C1-Q4)

`Card` compound (Card.Section/Image/Badges/Actions/Meta) es la base; `CardComplex` (alto nivel, prop-driven) se implementa **sobre** los compounds con las ~90 props de tfv reorganizadas en grupos tipados:

```ts
type CardComplexProps = {
  media?: { image?; images?; height?; component?; autoHide?; preview? };
  badges?: { title?; main?; footer?; grow?; wrap? };
  actions?: { add?; action?; download?; preview? }; // cada una: { onClick, icon, color, permission, disabled }
  meta?: { createdAt?; updatedAt?; responsible? };
  // + title/description/href/isSelected/animated… planos
};
```

El diseño fino de estos grupos se cierra en Etapa 2 con la migración de tfv como banco de pruebas.

## 5. Sistema de forms (ADR-005)

- Contrato `NebulaField<T>` duck-typed en `@stellaria/nebula-tokens/types/fields.ts`: lo que Nebula necesita leer/escribir de un campo (value, setValue, status `idle|validating|valid|invalid`, error, touched).
- Todos los inputs aceptan `field?: NebulaField<T>`; `@stellaria/nebula-hooks` publica `useFieldProps(field)` que conecta con **form-atoms v3** cuando está presente (peer opcional) — sin importarlo en el core.
- `FormField` (evolución del Header de Stellaria/FC/TFV) lee `status`/`error` del field automáticamente.
- Validación: Zod 4 como recomendación documentada (ambos consumidores ya la usan); Nebula no la impone.
- `Form` (orquestador), `useStepper` (wizard) y `ModalDelete/FormDelete` completan el sistema.

## 6. Permission gating

- `@stellaria/nebula-hooks`: `PermissionProvider` (recibe un `resolver: (key: string) => boolean` de la app) + `usePermission(key)`.
- `PermissionGate` (componente core) y props `permission` en acciones de `CardComplex`/`Menu`/`Button` consumen ese provider.
- Espejo del patrón de tfv (`PermissionsKeys`) y de la skill 33 de Stellaria, pero con las keys tipadas por la app vía generics (`PermissionProvider<K extends string>`).

## 7. Adapters de navegación

Nebula no depende de ningún router:

- `Anchor/Link`: prop `component`/render-prop para inyectar `next/link` o `expo-router` Link.
- `TabBar` (C1-Q3): contrato declarativo `items: { key, icon, label, active, onPress }[]`; adapter `@stellaria/nebula-native/adapters/react-navigation` traduce `BottomTabBarProps`.
- `Pagination`, `Breadcrumbs`, `NavLink`: declarativos (`onNavigate`/`href` string); el wiring de router queda en la app.

## 8. Política de dependencias externas

Regla: cada dependencia de runtime del core requiere justificación en tabla + alternativa evaluada + coste. Presupuesto: **cero dependencias en `@stellaria/nebula-tokens`**; mínimas en hooks; las pesadas (charts, dnd, tiptap, pintura) se aíslan en subpaths tree-shakeables o peers opcionales para no castigar al consumidor que no las usa.

| Dependencia                                 | Paquete                     | Justificación                                                   | Alternativa evaluada                                                  | Coste aprox.                                   |
| ------------------------------------------- | --------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| react-aria (hooks por componente)           | web                         | a11y APG completa sin DOM impuesto                              | headless propio (riesgo AA alto), Base UI (más joven, DOM propio)     | por-hook, tree-shakeable                       |
| react-stately                               | web                         | capa de estado que los hooks de aria exigen como argumento (colección, selección, foco); ADR-025 | capa propia (reescribe SelectionManager + collection builder + keyboard delegate) | por-hook, tree-shakeable; ya transitivo de react-aria |
| motion                                      | web                         | springs/layout anims/gestures                                   | framer-motion (legacy name), CSS puro (insuficiente para motion alto) | ~5-30 kB según features usadas                 |
| @vanilla-extract/*                          | web (build)                 | zero-runtime, theming por CSS vars                              | Panda CSS, StyleX (menos maduro para theme runtime dual)              | 0 runtime                                      |
| floating-ui                                 | web                         | posicionamiento (vía React Aria)                                | Popper v2 (legacy)                                                    | incluido en aria hooks                         |
| unistyles 3                                 | native                      | styling con themes runtime, C++ core                            | StyleSheet plano (sin theming), tamagui (opinado)                     | nativo, sin JS runtime extra                   |
| reanimated 4 + gesture-handler 3 + worklets | native                      | motion en UI thread                                             | Animated core (limitado)                                              | estándar del ecosistema                        |
| skia                                        | native                      | LiquidGlass/shaders/charts                                      | — (único motor viable)                                                | grande → lazy-load en Tier 3                   |
| jotai                                       | web+native (interno)        | compound state probado en ST; ya presente en ambos consumidores | Context (re-render cascades), zustand (no atómico)                    | ~4 kB                                          |
| lucide-react(-native)                       | icons                       | paridad exacta W/N, tree-shaking                                | set propio (proyecto entero), vector-icons (solo native)              | por-icono                                      |
| recharts / victory-native                   | web/native (subpath charts) | catálogos + consumidores                                        | skia puro (meses)                                                     | aislado en `@stellaria/nebula-web/charts` etc. |
| @tanstack/react-table + virtual             | web (subpath datagrid)      | DataGrid enterprise                                             | AG Grid (licencia)                                                    | aislado                                        |
| dnd-kit                                     | web (subpath dnd)           | catálogo DnD/Kanban                                             | pragmatic-dnd (evaluar en Etapa 2)                                    | aislado                                        |
| cmdk                                        | web (subpath command)       | CommandPalette                                                  | propio sobre Combobox (evaluar)                                       | ~6 kB                                          |
| embla                                       | web (subpath carousel)      | Carousel                                                        | keen-slider                                                           | aislado                                        |
| tiptap                                      | web (subpath editor)        | RichTextEditor                                                  | lexical (evaluar en Etapa 2, ADR)                                     | aislado                                        |
| form-atoms                                  | **peer opcional**           | contrato field de ambos consumidores                            | —                                                                     | 0 si no se usa                                 |
| pintura                                     | **peer opcional**           | EditorImage (C1-Q6)                                             | filerobot/open-source (futuro ADR)                                    | 0 si no se usa                                 |

## 9. Gobernanza (skills)

Se migran/adaptan desde `.claude/skills` de Stellaria (detalle en [anexo C §4](api/stellaria-native.md)): typescript-strict, tokens-governance, theme-a11y-motion, effects-guardrails, architecture-decisions (ADR-lite), quality-gates (ampliada con a11y CI + bundle budget + contrast check), git-pr-conventions, monorepo-workspace, ui-web-patterns (reescrita para React Aria+VE), ui-native-patterns, permissions-mirror (como spec de PermissionGate). Las skills de servicios/multi-tenant/POS no aplican a Nebula.

## 10. Testing (ver 03 para gates)

- Unit/interaction: React Testing Library (web) + RNTL (native); runner Vitest (web) / Jest (native, por Metro). Los 3 repos fuente tienen **cero tests** — Nebula nace con testing contract por componente.
- Stories CSF compartidas = fixture base para interaction tests de Storybook.
- E2E: Playwright (playground web) + Maestro (playground native) en flujos críticos.
- A11y: addon-a11y (axe) en CI sobre todas las stories + contrast-check de tokens (tools/).
