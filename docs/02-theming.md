# 02 — Sistema de temas dual (Web + Native)

> Decisiones: TS-first + temas JSON (C2-Q2), escala 50–950 (C2-Q4), Geist como tipografía default, indigo/violet como tema default, glass/blur/gradients como tokens con guardrails.
> **Identidad (ADR-020, enmendada por ADR-028)**: el eje cromático de Nebula es `#3F37C9 → #9D4EDD` (semillas de `indigo` y `violet` en `tools/palette-gen/src/seeds.ts`) y el scheme por defecto es oscuro. El canvas oscuro deriva del mismo eje: la semilla `dark` es `#161821` (tono OKLCH 275, el de `indigo`), no un neutro puro.

## 1. Modelo mental

```
@stellaria/nebula-tokens                      @stellaria/nebula-themes                 consumo
┌──────────────────────┐   valida   ┌──────────────────┐   build/runtime
│ contrato NebulaTheme │◄───Zod─────│ temas oficiales  │──┬─► web: CSS vars (VE)
│ (types TS + schema)  │            │ (JSON) + presets │  └─► native: Unistyles themes
│ tokens base (TS)     │            └──────────────────┘
└──────────────────────┘                    ▲
                                            │ export JSON
                                    apps/theme-creator
```

- **El contrato es TS** (type-safety total, cero runtime): `NebulaTheme` define la forma exacta de un tema en `@stellaria/nebula-tokens` (que mantiene **cero dependencias**). El **Zod schema** derivado (`themeSchema`) vive en `@stellaria/nebula-themes`, que sí depende de zod, y valida los temas cargados en runtime.
- **Los temas son datos (JSON)**: un objeto serializable que cumple `NebulaTheme`. Esto permite que el Theme Creator exporte temas, que un tenant cargue el suyo sin recompilar, y que web y native consuman EXACTAMENTE el mismo artefacto.
- **Un solo tema alimenta ambas plataformas**:
  - **Web**: `createThemeContract` de Vanilla Extract define el contrato de CSS vars una sola vez; cada tema se materializa con `createTheme(contract, themeJson)` en build (temas oficiales) o con `assignInlineVars`/inyección de vars en runtime (temas dinámicos del Theme Creator). Cambiar tema = cambiar una clase en `<html>` — cero recomputación JS.
  - **Native**: los temas se registran en `StyleSheet.configure({ themes })` de Unistyles 3; cambiar tema = `UnistylesRuntime.setTheme(name)` — el core C++ re-resuelve estilos sin re-render masivo. Temas dinámicos: `updateTheme(name, themeJson)`.

## 2. Contrato `NebulaTheme`

Secciones del tema (todas obligatorias — un tema incompleto no valida):

```ts
type NebulaTheme = {
  meta: { name: string; scheme: "light" | "dark"; version: string }

  // 1. COLOR — escalas 50–950 (11 pasos, C2-Q4) + roles semánticos
  palettes: Record<PaletteName, Scale11>        // indigo, violet, green, … (16 base, extensibles)
  colors: {
    primary: Scale11; accent: Scale11; gray: Scale11
    semantic: { success; warning; error; info }: Scale11
    surface:  { base; raised; overlay; sunken     // superficies por elevación
                hover; active                    // superficies por interacción (ADR-044)
                disabled }                       // estado deshabilitado (ADR-048)
    text:     { primary; secondary; muted; inverted; onPrimary
                placeholder                      // solo sobre el fondo de un campo (ADR-052)
                disabled }                       // estado deshabilitado (ADR-048)
    border:   { subtle; default; strong; focus; disabled }
  }

  // 2. TIPOGRAFÍA — familia + escala + pesos (Geist Sans/Mono default)
  font: { family: { sans; mono }; size: {...h1–h6, body1–3, button, caption}
          weight; lineHeight; letterSpacing }

  // 3. GEOMETRÍA Y DENSIDAD
  radius:  { xxs:0, xs:4, sm:8, md:12, lg:16, xl:20, xxl:28, full }  // múltiplos de 4 (ADR-046)
  spacing: { unit: number; scale: {...} }        // densidad: compact (unit 3) ↔ comfortable (unit 5)
           // tallas para layout: none xxs xs sm md lg xl xxl xxxl
           // múltiplos para densidad de control: u1_5 u2_5 u3 u3_5 u5 (ADR-045)
           // los u* NO se exponen como style props — ver ADR-045 §5
  sizes:   { control: { xs:30, sm:36, md:42, lg:50, xl:60 },   // heights compartidas W/N
             compact: { xs:20, sm:24, md:28, lg:32, xl:36 } }  // metadata y navegación compacta

  // 4. MOTION — tokens que los componentes consumen SIEMPRE vía theme
  motion: {
    tier: "minimal" | "standard" | "expressive"  // reconfigura globalmente la intensidad
    duration: { instant; fast; base; slow; expressive }
    easing:   { standard; emphasized; decelerate; accelerate }  // beziers
    spring:   { gentle; default; snappy }        // {stiffness, damping, mass}
  }

  // 5. EFECTOS — glass/blur/gradients CON GUARDRAILS (tokens, no valores libres)
  effects: {
    blur:  { none…xxl }
    glass: { surface: { subtle; default; strong }; noiseOpacity; enabled: boolean }
    shadows: { xxs…xxl }                          // por plataforma: box-shadow vs elevation map
    gradients: { brand; accent; surface }         // ⚠️ NUEVOS — hoy no existen en Stellaria (gap detectado)
  }

  // 6. VARIANTES — mapa variant→receta de color (cómo se pinta filled/outline/light/glass/ghost/glow/gradient)
  variantMap: Record<Variant, VariantRecipe>

  // 7. Z-INDEX y BREAKPOINTS
  zIndex: {...}; breakpoints: {...}
}
```

Puntos clave:

1. **Los componentes solo leen roles semánticos** (`colors.surface.raised`, `colors.text.muted`, `sizes.control.md`, `motion.spring.default`) — nunca paletas crudas ni hex. Por eso un tema con valores radicalmente distintos (radius 0, densidad compacta, motion minimal, sin glass, tipografía serif) reconfigura TODOS los componentes sin tocar código.
2. **`motion.tier` y `effects.glass.enabled`** son interruptores de tema: el tema "enterprise sobrio" apaga glass y baja motion; el tema "vibrant" los sube. Los componentes consultan el tier, no hardcodean intensidades. **Alcance de `glass.enabled` ([ADR-059](adr/ADR-059-alcance-de-glass-enabled-y-degradacion-de-gradientes.md))**: gobierna solo los materiales de compositor —glass, blur y ruido—. Los gradientes no lo consultan: se neutralizan por sus propios tokens (sober define `brand`/`accent` monocromos) y su animación la gobierna `motion.tier`.
3. **`variantMap`** hace que hasta el significado visual de `variant="filled"` sea temable (p.ej. `playful` hace que `filled` use `gradient.brand`). Esta afirmación fue **falsa entre W2 y el tramo V2**: solo Button y ActionIcon leían el mapa, mientras Alert y Badge reimplementaban las recetas a mano y divergían del contrato y entre sí. ADR-038 la restablece; el censo está en `docs/reviews/variantes-cobertura-2026-07-28.md` §0.
4. Escala **50–950** (C2-Q4): regenerar las 16 paletas de Stellaria es mecánico; `tools/palette-gen` (OKLCH) lo automatiza y el Theme Creator lo expone.

## 3. Temas oficiales (`@stellaria/nebula-themes`)

| Tema                                       | Propósito                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `light` / `dark`                           | Default: enterprise vibrante, indigo/violet, Geist, motion standard, glass on. **`dark` es el tema por defecto** y la identidad son las semillas `#3F37C9`/`#9D4EDD` (ADR-020) |
| `sober-light` / `sober-dark`               | Demostración: radius mínimo, densidad compacta, motion minimal, sin glass — banca/enterprise                                                                                   |
| `playful`                                  | Demostración: radius full, densidad comfortable, motion expressive, gradients agresivos                                                                                        |
| (por consumidor) `fonicredito`, `tfv-gold` | Se crean en la migración con el Theme Creator (no portar valores legacy 1:1 — decisión Stellaria)                                                                              |

Los tres presets demostrativos son parte del criterio de aceptación del theming: si un componente se ve "roto" en alguno, está leyendo algo fuera del theme.

## 4. Runtime

- **Web** (implementado en W1.2, ADR-016): `<NebulaProvider defaultTheme="dark">` aplica la clase del tema oficial a un contenedor (`createTheme` → una clase por tema) y marca `data-nebula-theme`/`data-scheme`; `<ColorSchemeScript>` en el `<head>` evita el flash SSR fijando `color-scheme` en `<html>` pre-hidratación. Persistencia inyectable (`storage`/`storageKey`, `localStorage` por defecto). Temas custom/tenant: se pasa el `NebulaTheme` (ya validado por `loadTheme`) como `defaultTheme` y se inyecta con `assignInlineVars` sobre el contract. La proyección CSS del contract cubre solo las hojas materializables como var; la data no-CSS (variantMap, spring, tier, glass.enabled, gradients, palettes) se lee del objeto `theme` vía contexto.
- **Native**: `NebulaProvider` configura Unistyles (`themes` + `settings.initialTheme`/`adaptiveThemes`); persistencia del tema elegido vía storage inyectable (MMKV recomendado, no impuesto).
- **Ambos**: `useTheme()` en `@stellaria/nebula-hooks` expone `{ theme, setTheme, scheme, systemScheme }` con la misma API.

## 5. Theme Creator (`apps/theme-creator`) — spec funcional

1. **Editor de tokens en vivo**: panel por sección del contrato (color/tipografía/geometría/motion/efectos); edición de paletas por color semilla → generación 50–950 en OKLCH (`tools/palette-gen`); sliders de densidad/radius/motion tier.
2. **Preview**: galería de componentes reales de `@stellaria/nebula-web` renderizados con el tema en edición (via inyección runtime de vars), en light/dark y con reduced-motion toggle. Fase 2 del creator: preview native vía Expo web o snapshots.
3. **Validación AA en vivo**: cada par rol-de-texto/superficie del contrato se verifica contra WCAG 2.2 AA (4.5:1 texto, 3:1 UI); los fallos se marcan en el editor con sugerencia de corrección automática (ajuste de L en OKLCH). Mismo motor que `tools/contrast-check` de CI.
4. **Export**: JSON `NebulaTheme` validado (consumible por web y native tal cual) + snippet TS opcional (`satisfies NebulaTheme`) para quien prefiera compilarlo.
5. **Import**: cargar un JSON existente para editarlo (round-trip completo).

## 6. Gaps a resolver en la migración (desde Stellaria)

| Gap                                                     | Acción                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| No existen tokens `gradient.*` (docs los asumen)        | Crear `effects.gradients` en el contrato (ver §2)                                               |
| `glass.border`/`glass.noise` inconsistentes docs↔código | Contrato final: `glass.surface.* + noiseOpacity` (lo real) + `border` dentro de la receta glass |
| Escala 100–900 implementada                             | Regenerar a 50–950 con palette-gen                                                              |
| Web theme = clases VE vacías                            | Implementar `createThemeContract` + materialización de temas                                    |
| Colores semánticos planos (`success = green`)           | Roles semánticos completos (§2.1) con sub-roles de superficie/texto/borde                       |
