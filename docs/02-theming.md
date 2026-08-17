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

  // 0. TINTA — hasta dónde aguanta la letra clara antes de ceder a la oscura (ADR-132)
  ink: { floor: number }         // 0 = clara siempre · 2 = el de los oficiales · 4.5 = AA estricto

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
  radius:  { none:0, xxs:0, xs:4, sm:9, md:12, lg:16, xl:20, xxl:32, full }  // ADR-046, re-fasado por ADR-072
  spacing: { unit: number; scale: {...} }        // densidad: compact (unit 3) ↔ comfortable (unit 5)
           // tallas para layout: none xxs xs sm md lg xl xxl xxxl
           // múltiplos para densidad de control: u1_5 u2_5 u3 u3_5 u5 (ADR-045)
           // los u* NO se exponen como style props — ver ADR-045 §5
  sizes:   { control: { xxs:24, xs:28, sm:36, md:44, lg:52, xl:60, xxl:68 },  // ADR-099; xxs por ADR-162
             compact: { xxs:16, xs:20, sm:24, md:28, lg:32, xl:36, xxl:40 } } // metadata compacta
           // llaveadas por SizeName (xxs…xxl), NO por Size (xs…xl) — ancla en md (ADR-099)

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
    glass: { surface: Record<GlassLevel, { background; backdropFilter; borderColor }>; noiseOpacity; enabled: boolean }
            // 6 niveles (ADR-078 + `veil`). El filo es del material, y va plano porque el velo es opaco
            // —0.78 a 0.90— (ADR-118). Lo que separa un nivel de otro es el desenfoque, no el velo.
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
2. **`motion.tier` y `effects.glass.enabled`** son interruptores de tema: un tema "enterprise sobrio" apagaría glass y bajaría motion; un tema "vibrant" los subiría. Los componentes consultan el tier, no hardcodean intensidades. **Alcance de `glass.enabled` ([ADR-059](adr/ADR-059-alcance-de-glass-enabled-y-degradacion-de-gradientes.md))**: gobierna solo los materiales de compositor —glass, blur y ruido—. Los gradientes no lo consultan: se neutralizan por sus propios tokens (un tema sobrio define `brand`/`accent` monocromos) y su animación la gobierna `motion.tier`.
3. **`variantMap`** hace que hasta el significado visual de `variant="filled"` sea temable (p.ej. un tema puede hacer que `filled` use `gradient.brand`). Esta afirmación fue **falsa entre W2 y el tramo V2**: solo Button y ActionIcon leían el mapa, mientras Alert y Badge reimplementaban las recetas a mano y divergían del contrato y entre sí. ADR-038 la restablece; el censo está en `docs/reviews/variantes-cobertura-2026-07-28.md` §0.
4. Escala **50–950** (C2-Q4): regenerar las 16 paletas de Stellaria es mecánico; `tools/palette-gen` (OKLCH) lo automatiza y el Theme Creator lo expone.
5. **Las variantes se resuelven una vez por tema, no una vez por render** ([ADR-150](adr/ADR-150-las-variantes-se-resuelven-una-vez-por-tema.md)). El tema publica su matriz —7 variantes × 7 escalas × 8 valores, unas 392 propiedades CSS— al crearse, y los componentes la referencian en vez de calcularla. Lo que antes obligaba a leer el tema por contexto de React en cada render, y con ello a declararse de cliente, pasa a ser una clase.

### 2.1 El color arbitrario cuesta hidratación, el semántico no

Consecuencia de ADR-150 que **estrecha este contrato**, y por eso se dice aquí y no solo en el ADR.

Hasta ahora `ColorExtended` era uniforme en coste: daba igual pasar `color="primary"`, `color="pink.300"` o `color="#ff0066"`. Deja de serlo:

| Lo que se pasa                                  | Cómo se resuelve                            | Coste                            |
| ----------------------------------------------- | ------------------------------------------- | -------------------------------- |
| Las **7 escalas semánticas** del contrato       | matriz precalculada, una clase              | ninguno — componente de servidor |
| Las **19 paletas semilla**, con peldaño y alpha | valores cerrados, precalculables igual      | ninguno                          |
| **`#hex` literal** con `variant="filled"`       | luminancia contra `ink.floor`, en el render | **obliga a cliente**             |

El caso lento es solo el último, y solo con `filled`, que es donde hay que elegir tinta legible. El resto de un hex —fondo, borde, hover— se resuelve sin el tema.

**Por qué existe ese caso**: el servidor no sabe qué tema está activo —lo elige el navegador según la preferencia del usuario (§4)—, así que la respuesta tiene que viajar en una forma que resuelva el navegador. Un hex arbitrario no se puede precalcular, y su tinta legible depende del tema.

Sigue siendo una escotilla de escape declarada, en la línea de lo que [ADR-021](adr/ADR-021-button-color-extended-gradient-prop.md) ya decía del modo plano: no se adapta entre temas. Lo nuevo es que además cuesta.

## 3. Temas oficiales (`@stellaria/nebula-themes`)

| Tema                                       | Propósito                                                                                                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `light` / `dark`                           | Default: enterprise vibrante, indigo/violet, Geist, motion standard, glass on. **`dark` es el tema por defecto** y la identidad son las semillas `#3F37C9`/`#9D4EDD` (ADR-020) |
| (por consumidor) `fonicredito`, `tfv-gold` | Se crean en la migración con el Theme Creator (no portar valores legacy 1:1 — decisión Stellaria)                                                                              |

**v1 publica estos dos y solo estos dos** ([ADR-132](adr/ADR-132-los-temas-de-v1-y-el-suelo-de-la-tinta.md)). Los nueve temas de producto de `packages/demos` —`rosette`, `stellaria`, `polaris`, `lagrange`, `aurora`, `nova`, `eclipse`, `cosmos`, `star`, cada uno en dark y light— son la demostración del argumento de la librería, no contrato: viven en un paquete no publicable y no pasan por `check:contrast`. Promover uno después de v1 es una minor; quitar o renombrar uno publicado sería breaking, y por eso la lista se cierra corta.

Los temas de producto son parte del criterio de aceptación del theming: si un componente se ve "roto" en alguno, está leyendo algo fuera del theme.

## 4. Runtime

- **Web** (implementado en W1.2, ADR-016): `<NebulaProvider defaultTheme="dark">` aplica la clase del tema oficial a un contenedor (`createTheme` → una clase por tema) y marca `data-theme`/`data-scheme`; `<ThemeScript>` en el `<head>` evita el flash SSR fijando `color-scheme` en `<html>` pre-hidratación. Persistencia inyectable (`storage`/`storageKey`, `localStorage` por defecto). Temas custom/tenant: se pasa el `NebulaTheme` (ya validado por `loadTheme`) como `defaultTheme` y se inyecta con `assignInlineVars` sobre el contract. La proyección CSS del contract cubre solo las hojas materializables como var; la data no-CSS (variantMap, spring, tier, glass.enabled, gradients, palettes) se lee del objeto `theme` vía contexto.
- **Los dos ejes** ([ADR-166](adr/ADR-166-la-identidad-del-tema-y-su-esquema-son-ejes-distintos.md)): `meta.name` es **la identidad** y `meta.scheme` es **el esquema**. Los dos temas oficiales se llaman los dos `nebula`; su clave en `officialThemes` y en `themeClass` es el esquema. Por eso `setTheme("light")` conserva la identidad y sólo cambia el esquema —lo que un conmutador claro/oscuro de producto necesita— y `setTheme({ theme, scheme })` cambia las dos. En el DOM salen separados: `data-theme="nebula" data-scheme="dark"`. Cada eje se guarda en su propia clave —`nebula-theme` y `nebula-scheme` por defecto, renombrables una a una con `storageKeys` (ADR-167)— y se restaura con su propia guarda: una identidad que nadie reconoce cae en los oficiales **sin llevarse el esquema por delante**.

- **Las tres vías para materializar un tema**, de menos a más runtime:

  | Vía                                                            | Cuándo                                               | Coste                     |
  | -------------------------------------------------------------- | ---------------------------------------------------- | ------------------------- |
  | `createTheme(vars, ThemeToVars(t))` en el build del consumidor  | el tema se conoce al compilar — un producto           | un nombre de clase        |
  | `CompileTheme(t)` en `@stellaria/nebula-web/theme-runtime`      | el tema llega de un backend, por tenant, o se edita   | una regla en un `<style>` |
  | `assignInlineVars` (lo que hace el provider con un `NebulaTheme`) | un árbol pequeño, un tema que no cambia            | 627 vars en el `style`    |

  Las dos primeras producen un `MaterializedTheme` (`{ theme, className }`), que entra en `defaultTheme` o en el registro `themes` del provider ([ADR-163](adr/ADR-163-el-provider-acepta-un-tema-ya-materializado-como-clase.md), [ADR-164](adr/ADR-164-compile-theme-materializa-en-caliente.md)). El provider **no inyecta nada** para ellas: sólo lleva el objeto para los componentes que leen `useTheme`. Registrar es lo que hace que el tema sobreviva al refresco; deriva el mapa del script con `ThemeScriptMap(themes)` para que las dos listas no puedan discrepar.

- **Cambiar de tema en caliente** ([ADR-121](adr/ADR-121-set-theme-acepta-un-tema-entero.md)): `setTheme` acepta un esquema, un `ThemeChoice` o un `NebulaTheme` completo, así que un tenant o un producto se retiñe entero sin remontar nada. Con un objeto se aplica por vars inline y cambian las dos mitades a la vez: las vars CSS y la data no-CSS del contexto, que es lo que hace de `motion.tier` y `effects.glass.enabled` interruptores en caliente. **Un tema aplicado por vars inline no se persiste**, porque no se puede reconstruir desde un nombre guardado; se persiste su `meta.scheme` y al recargar se cae al tema oficial del mismo esquema. Uno registrado sí: se guardan sus dos ejes y vuelve entero.
- **Native**: `NebulaProvider` configura Unistyles (`themes` + `settings.initialTheme`/`adaptiveThemes`); persistencia del tema elegido vía storage inyectable (MMKV recomendado, no impuesto).
- **Ambos**: `useTheme()` en `@stellaria/nebula-hooks` expone `{ theme, setTheme, scheme, systemScheme }` con la misma API. `setTheme` admite un tema entero en las dos plataformas: en native es `updateTheme(name, themeJson)` de Unistyles; en web, ADR-121.

## 5. Theme Creator (`apps/theme-creator`) — spec funcional

1. **Editor de tokens en vivo**: panel por sección del contrato (color/tipografía/geometría/motion/efectos); edición de paletas por color semilla → generación 50–950 en OKLCH (`tools/palette-gen`); sliders de densidad/radius/motion tier.
2. **Preview**: galería de componentes reales de `@stellaria/nebula-web` renderizados con el tema en edición (via inyección runtime de vars), en light/dark y con reduced-motion toggle. Fase 2 del creator: preview native vía Expo web o snapshots.
3. **Validación AA en vivo**: cada par rol-de-texto/superficie del contrato se verifica contra WCAG 2.2 AA (4.5:1 texto, 3:1 UI); los fallos se marcan en el editor con sugerencia de corrección automática (ajuste de L en OKLCH). Mismo motor que `tools/contrast-check` de CI.
4. **Export**: JSON `NebulaTheme` validado (consumible por web y native tal cual) + snippet TS opcional (`satisfies NebulaTheme`) para quien prefiera compilarlo.
5. **Import**: cargar un JSON existente para editarlo (round-trip completo).

## 6. Gaps a resolver en la migración (desde Stellaria)

| Gap                                                     | Acción                                                                                                                                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No existen tokens `gradient.*` (docs los asumen)        | Crear `effects.gradients` en el contrato (ver §2)                                                                                                                                                  |
| `glass.border`/`glass.noise` inconsistentes docs↔código | **Cerrado**: `glass.surface.<nivel>` = `{ background, backdropFilter, borderColor }` + `noiseOpacity`. El filo salió del contrato en ADR-102 y volvió con alfa, y con gate que lo mide, en ADR-118 |
| Escala 100–900 implementada                             | Regenerar a 50–950 con palette-gen                                                                                                                                                                 |
| Web theme = clases VE vacías                            | Implementar `createThemeContract` + materialización de temas                                                                                                                                       |
| Colores semánticos planos (`success = green`)           | Roles semánticos completos (§2.1) con sub-roles de superficie/texto/borde                                                                                                                          |
