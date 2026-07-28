# Convergencia visual Stellaria UI → Nebula

**Fecha**: 2026-07-27
**Alcance auditado**: `@stellaria/nebula-tokens`, `-themes`, `-icons`, `-hooks`, `-web` (W1 → cierre de W2)
y `apps/playground-web`.
**Fuente importada**: `docs/stellaria-ui/` (11 documentos).
**Naturaleza**: review. No declara decisiones cerradas ni sustituye a `docs/06-visual-language.md`.

## 0. Corrección del estado asumido

El encargo asume "W2.1–W2.3 implementados, W2.4 es el siguiente tramo". **No es el estado real.**

| Asunción del encargo | Estado verificado                                                                    | Evidencia                                                             |
| -------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| W2.4 es lo siguiente | W2 está **cerrada**; lo siguiente es **W3**                                          | `docs/w2-closure.md`, `docs/05-roadmap.md` §W2 marcada _(cerrada)_    |
| Alcance hasta W2.3   | 68 componentes: overlays, colecciones, feedback, data display y navegación incluidos | `packages/web/src/components/` (68 dirs), commits `d9aebf0`→`3c246fc` |
| Temas oficiales: 4   | Correcto                                                                             | `packages/themes/src/themes/official.ts`                              |

Por tanto la auditoría cubre **todo el Tier 1 web**, no un subconjunto. La conclusión de §5 se refiere a la
apertura de **W3**, no de W2.4.

## 1. Estado de los gates al abrir la sesión

| Gate                                   | Resultado        | Nota                                                                                                                                   |
| -------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm turbo build typecheck lint test` | **27/29 · rojo** | `@stellaria/nebula-web#test`: 306/307. Falla `Modal.test.tsx` "el cierre diferido por la animación de salida termina"                  |
| El mismo test aislado                  | verde (7/7)      | **Es intermitente**, no una regresión de código: `waitFor` por defecto (1 s) contra una salida por spring bajo carga de suite completa |
| `pnpm check:contrast`                  | verde            | 28 pares × 5 temas · 0 FAIL                                                                                                            |

`docs/w2-closure.md` reporta "307 tests" en verde. La suite completa no reproduce ese resultado de forma
estable; la deuda #3 de ese mismo documento ("las aserciones de desmontaje necesitan `waitFor`") es
exactamente esta causa, y no se cerró.

## 2. Matriz de convergencia

### 2.1 Tokens y temas

| Regla o área                                               | Evidencia actual                                                                                                                        | Brecha                                                                                                                         | Tratamiento                                       | Prio   | Archivos previstos                                                         |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| Tres niveles de token (primitivo / semántico / componente) | `tokens/palettes.ts` → `theme/theme.ts` roles → `X.vars.css.ts` por componente                                                          | ninguna                                                                                                                        | cubierto                                          | —      | —                                                                          |
| Componentes no consumen primitivos                         | `ResolveVariant` traduce a `var()` del contract; cero hex en componentes                                                                | ninguna                                                                                                                        | cubierto                                          | —      | —                                                                          |
| Success/warning/danger/info independientes del acento      | `colors.semantic` = green/yellow/red/blue en los 4 temas                                                                                | ninguna                                                                                                                        | cubierto                                          | —      | —                                                                          |
| Un único contrato de tema                                  | `NebulaTheme` es el único; `ProductTheme` de la guía §09 es un subconjunto expresable                                                   | la guía propone un esquema paralelo                                                                                            | conflicto resuelto a favor de Nebula              | —      | —                                                                          |
| Escalera de elevación utilizable                           | `shadows.xxs`, `.xs` y `.sm` tienen **el mismo valor web** (`0 1px 2px rgba(9,9,11,.05)`)                                               | 3 peldaños colapsados de 7                                                                                                     | refinar ahora                                     | **P0** | `packages/tokens/src/tokens/effects.ts`                                    |
| Sombra calibrada por esquema                               | los **4** temas importan el mismo `shadows` de tokens (`nebula-dark.ts:85`, `nebula-light.ts:64`, `sober-light.ts:63`, `playful.ts:63`) | en dark, negro al 5–24 % sobre `#0b0b0b` es invisible                                                                          | refinar ahora                                     | **P0** | `packages/themes/src/themes/shadows.ts` (nuevo, interno), `nebula-dark.ts` |
| Superficies distinguibles en dark (docs/06 §5)             | base `#0b0b0b` · raised `#111111` · overlay `#151515` · sunken `#080808`                                                                | ΔL ≈ 2 % entre peldaños; sin sombra ni rim, la escalera es plana                                                               | refinar ahora                                     | **P0** | `packages/themes/src/themes/nebula-dark.ts`                                |
| Canvas "negro azulado, no negro puro" (guía §01)           | semilla `dark: #1c1c1c`, neutra pura; el texto sí es frío (`gray` de `#868e96`)                                                         | superficie neutra + texto frío; la guía pide `#07080D`/`#10121A`                                                               | conflicto/ADR                                     | P1     | `tools/palette-gen/src/seeds.ts`, ADR-020                                  |
| Tracking de titulares                                      | `letterSpacing.tight = -0.16`, proyectado en **px** (`theme-vars.ts:40`)                                                                | −0.16 px sobre un h1 de 48 px ≈ −0.003 em: el token es un **no-op visual**; docs/06 §2 lo reserva a h1–h3 con intención óptica | conflicto/ADR                                     | P1     | `tokens/typography.ts`, `web/src/theme/theme-vars.ts`                      |
| Blur premium (guía: 18–24 px, sat. ≤145 %)                 | `blur.sm/md/lg` = 4/8/12 px y glass los consume en ese orden                                                                            | docs/06 §6 **fija** glass en `sm/md`; la guía pide 2–3× más                                                                    | conflicto/ADR                                     | P2     | `tokens/effects.ts`, docs/06 §6                                            |
| Escala de espaciado                                        | Nebula: rejilla de 4 px (0/2/4/8/16/24/32/48/64)                                                                                        | la guía propone 2/4/6/8/10/12/16/20/24/28/32/36/48/64/80/96/120                                                                | conflicto resuelto a favor de Nebula (ADR-024 §4) | —      | —                                                                          |
| Radios                                                     | Nebula `lg 14 · xl 20 · xxl 28`; guía `lg 18 · xl 22 · 2xl 28`                                                                          | diferencia de calibración, no de contrato                                                                                      | tema                                              | P3     | —                                                                          |
| Z-index                                                    | Nebula 1000–1600 vs guía 0–300                                                                                                          | mismo orden, distinta magnitud; es dato de tema                                                                                | cubierto                                          | —      | —                                                                          |
| Ritmo de sección 90/120 px                                 | máximo `xxxl` = 64 px                                                                                                                   | ritmo de landing, no de primitivo                                                                                              | no aplica al core                                 | —      | —                                                                          |
| `palettes.ts` generado                                     | no editado a mano                                                                                                                       | ninguna                                                                                                                        | cubierto                                          | —      | —                                                                          |

### 2.2 Componentes existentes

| Regla o área                                                              | Evidencia actual                                                                                              | Brecha                                                                               | Tratamiento                                  | Prio   | Archivos previstos                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------- | ------ | ---------------------------------------------------------- |
| Variantes semánticas, nunca cromáticas                                    | `Variant` = filled/outline/light/glass/ghost/glow/gradient/unstyled; `color` toma nombres de escala semántica | ninguna                                                                              | cubierto                                     | —      | —                                                          |
| Foco visible consistente                                                  | `2px solid vars.color.border.focus` + `outlineOffset 2px` en 11 componentes; contraste ≥3:1 verificado        | duplicación literal, sin helper compartido                                           | refinar ahora                                | P2     | `packages/web/src/styles/focus.css.ts` (nuevo)             |
| Ningún texto < 12 px                                                      | `caption = 12`, `body3 = 13` (ADR-024)                                                                        | la guía admite 9–11 px                                                               | conflicto resuelto a favor de Nebula         | —      | —                                                          |
| Motion por tokens, sin valores libres                                     | Button: `calc(duration.expressive * 12)`, `* 6`, springs del tema, `::after` solo `opacity`                   | ninguna — la deuda del review de 2026-07-21 sí se cerró                              | cubierto                                     | —      | —                                                          |
| Reduced motion                                                            | `useReducedMotion()` + `motion.tier === "minimal"` en Button, Card, overlays; `@media` en CSS                 | ninguna                                                                              | cubierto                                     | —      | —                                                          |
| Estado no depende solo del color                                          | Alert acepta `icon`; Badge tiene variante `dot`; Progress con `aria-valuenow`                                 | ninguna en el core                                                                   | cubierto                                     | —      | —                                                          |
| Card: sangrado de secciones                                               | `sectionInset` usa `-space.md` **fijo**; `padding` puede ser `sm`/`md`/`lg`                                   | con `padding="lg"` la imagen deja 8 px de aire a cada lado: **defecto**, no estética | refinar ahora                                | **P1** | `packages/web/src/components/Card/Card.css.ts`, `Card.tsx` |
| Card: padding `md` compacto / `lg` default / `xl` prominente (docs/06 §3) | variantes `none/sm/md/lg`, default `md`; no existe `xl`                                                       | la escala está desplazada un peldaño respecto a docs/06                              | conflicto/API                                | P1     | `Card.types.ts`, `Card.css.ts`                             |
| Hover de card interactiva                                                 | lift `-2 px` por spring + `whileTap`                                                                          | sin refuerzo de borde/elevación; la guía admite hasta 7 px                           | refinar ahora                                | P2     | `Card.tsx`, `Card.css.ts`                                  |
| Eyebrow mono/uppercase/tracking                                           | `Box` expone `ff`, `tt`, `ls` como style props                                                                | el patrón es expresable por composición; el componente `SectionHeader` es W3         | cubierto (patrón) / fase futura (componente) | —      | —                                                          |
| Testing contract por componente (ADR-015)                                 | 62 de 68 con `__tests__`                                                                                      | **sin tests**: Avatar, Badge, EmptyState, Image, Loader, Tabs                        | refinar ahora                                | **P1** | `packages/web/src/components/*/__tests__/`                 |
| Suite estable                                                             | `Modal.test.tsx` intermitente                                                                                 | `waitFor` de 1 s contra salida por spring                                            | refinar ahora                                | **P1** | `Modal/__tests__/Modal.test.tsx`                           |
| `<Nombre>.md` contiguo                                                    | 30 de 68 lo tienen                                                                                            | la plantilla lo marca **opcional**                                                   | no aplica                                    | P3     | —                                                          |

### 2.3 Playground y evidencia visual

| Regla o área                                                                    | Evidencia actual                                                 | Brecha                                                                                                                                      | Tratamiento   | Prio   | Archivos previstos                                            |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------------------------------------------------------------- |
| Láminas `Foundations/Visual QA` (Typography, Spacing, Surfaces, Actions, Forms) | **no existen**: ningún story `title` empieza por `Foundations`   | es un entregable **explícito del gate de W2** (`docs/05` §W2) y de ADR-024 §7; W2 se cerró sin él y el propio cierre lo reconoce (deuda #5) | refinar ahora | **P0** | `apps/playground-web/src/stories/Foundations*.stories.tsx`    |
| `Composition` por componente visual                                             | 15 de 50 stories                                                 | faltan en la base: Text, Title, Paper, Button, Inputs, Toggles, Icon                                                                        | refinar ahora | **P1** | `apps/playground-web/src/stories/`                            |
| `AllThemes` por componente visual                                               | 14 de 50 stories                                                 | ídem                                                                                                                                        | refinar ahora | **P1** | ídem                                                          |
| Prueba de tematización con un acento ajeno                                      | los 4 temas oficiales comparten el eje indigo/violet o derivados | sin un tema de producto real, los hardcodes de acento no se detectan                                                                        | refinar ahora | **P1** | fixture Rosette en el playground (no en `officialThemeNames`) |
| Stories en es + en                                                              | contenido inyectado en español; sin par en inglés                | la guía §09 lo pide en la matriz mínima                                                                                                     | refinar ahora | P2     | láminas nuevas                                                |
| Visual regression automatizado                                                  | no existe                                                        | docs/06 §8 lo condiciona a un ADR de herramienta                                                                                            | fase futura   | P2     | —                                                             |

### 2.4 Componentes y patrones de la guía que no pertenecen a esta fase

| Elemento de la guía                                                           | Fase destino                                                | Motivo                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `Header` de producto (flotante, compactación en scroll, indicador deslizante) | W3 (AppShell/Section)                                       | shell de aplicación, no primitivo                            |
| `SectionHeader` (eyebrow/title/description/aside)                             | W3 (`Section`)                                              | composición editorial                                        |
| `FeatureCard`, `ProductCard`, `AddOnCard`                                     | W3 (`CardComplex` — checkpoint del propietario, supuesto 8) | grupos de props aún sin decidir                              |
| `Range`/`Slider` con ticks                                                    | W3 (inputs completos)                                       | ya inventariado                                              |
| `Chip`, `Status`                                                              | W3 (data display extendido)                                 | `Badge` cubre metadata; filtro y estado son piezas distintas |
| `ProductPreview` (perspectiva, borde orbital)                                 | W4 (Rich content / Effects)                                 | efecto de marca                                              |
| `PricingEstimator` / `Configurator`                                           | W3–W4 (patterns)                                            | patrón de negocio compuesto                                  |
| `Notice` / `CookieBanner`                                                     | app consumidora                                             | copy y consentimiento legal                                  |
| `PreferencesDock`                                                             | app consumidora                                             | preferencia global de producto                               |
| Grid + estrellas + ambient glows de fondo                                     | W4 (`Glass/Effects`, tokens `gradients`)                    | firma ambiental parametrizable y presupuestada               |
| Gesto distintivo por producto (`motion.signature`)                            | W4 + ADR                                                    | ampliaría `NebulaTheme`                                      |
| i18n, divisa, cookies                                                         | fuera del core                                              | `docs/01` §1: núcleo libre de dominio                        |

## 3. Conflictos que requieren decisión del propietario

Ninguno se implementa sin respuesta.

1. **Unidad de `letterSpacing`.** Hoy es `number` proyectado a **px**, así que `tight` no produce efecto
   óptico en h1–h3. Corregirlo con semántica `em` da el resultado tipográfico correcto en web, pero React
   Native solo acepta px, de modo que native tendría que derivar `px = valor × fontSize`. Cambia el
   _significado_ de un token compartido → ADR.
2. **Tinte del canvas dark.** La semilla `dark: #1c1c1c` es neutra pura; la guía y ADR-020 (eje
   indigo/violet) apuntan a un negro azulado. Regenerar la paleta con una semilla fría afecta la identidad
   de los 4 temas → enmienda de ADR-020.
3. **Calibración del glass.** `docs/06` §6 fija glass en `blur.sm/md` (4/8 px); la guía pide 18–24 px con
   saturación. Subirlo contradice un documento cerrado → ADR o enmienda de docs/06 §6.
4. **Escala de padding de `Card`.** `docs/06` §3 pide `md` compacto / `lg` default / `xl` prominente;
   `Card` ofrece `none/sm/md/lg` con default `md`. Alinearlo amplía una unión pública → ADR.

## 4. Trabajo ejecutado en esta sesión

El propietario resolvió los cuatro conflictos de §3 en el checkpoint; los cuatro se implementaron.

### 4.1 Tokens y temas

| Cambio                                                                                             | Archivos                                                                           | ADR                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------- |
| Los 7 peldaños de `shadows` dejan de repetirse; `xxs/xs/sm` eran idénticos                         | `packages/tokens/src/tokens/effects.ts`                                            | ADR-028                       |
| `darkShadows`: oclusión (0,40–0,72 sobre negro) + rim `inset 0 1px 0`, consumido por `nebula-dark` | `packages/themes/src/themes/shadows.ts` (nuevo, interno) + `shadows.md`            | ADR-028                       |
| `surface.overlay` de `nebula-dark` sube de `dark.400` a `dark.500`                                 | `packages/themes/src/themes/nebula-dark.ts`                                        | ADR-028                       |
| Semilla `dark`: `#1c1c1c` → `#161821` (OKLCH H 275, el eje de `indigo`); paletas regeneradas       | `tools/palette-gen/src/seeds.ts`, `packages/tokens/src/tokens/palettes.ts`         | ADR-028 (enmienda ADR-020)    |
| Glass remapeado a `blur.md/xl/xxl` + `saturate(130–140%)`; la escala `blur` no cambia              | `packages/tokens/src/tokens/effects.ts`, `nebula-dark.ts`                          | ADR-028 (enmienda docs/06 §6) |
| `letterSpacing` pasa a semántica `em`; baseline `-0.03 / 0 / 0.08`                                 | `packages/tokens/src/tokens/typography.ts`, `packages/web/src/theme/theme-vars.ts` | ADR-027                       |

Solo cambió la escala `dark` al regenerar: las otras 15 paletas y `gray` quedaron intactas.

### 4.2 Componentes

| Cambio                                                                                                                                                                         | Archivos                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **Defecto**: `sectionInset` restaba `-space.md` fijo; con `padding="lg"` la sección dejaba 8 px de aire. El padding se publica en la var `pad` y el sangrado se deriva de ella | `Card.vars.css.ts` (nuevo), `Card.css.ts`, `Card.md` (nuevo) |
| Escala de padding a `none/md/lg/xl`, default `lg` (ADR-029)                                                                                                                    | `Card.types.ts`, `Card.tsx`, `Card.css.ts`                   |
| Hover de card interactiva refuerza el borde a `border.strong`, con fallback de reduced motion                                                                                  | `Card.css.ts`                                                |
| **Defecto**: `AvatarGroup` pasaba `"+2"` por `name`, e `Initials` lo reducía a `"+"`. El contador se renderiza ahora explícito, con nombre accesible                           | `Avatar/Group.tsx`                                           |
| Test intermitente de la animación de salida del Modal (`waitFor` de 1 s contra un spring)                                                                                      | `Modal/__tests__/Modal.test.tsx`                             |

### 4.3 Testing contract

Los 6 componentes sin tests pasan a tenerlo: **Avatar** (14), **Badge** (6), **EmptyState** (6),
**Image** (9), **Loader** (5), **Tabs** (8). El defecto de `AvatarGroup` lo encontró justamente
escribir su test.

### 4.4 Playground

| Cambio                                                                                                                                                                        | Archivos                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Las cinco láminas `Foundations/Visual QA` del gate de W2 — Typography, Spacing, Surfaces, Actions y Forms — con `Composition`, `AllThemes`, `Dark` y `ReducedMotion` cada una | `FoundationsTypography` · `FoundationsSpacing` · `FoundationsSurfaces` · `FoundationsActions` · `FoundationsForms` `.stories.tsx` |
| `ThemeMatrix`: los 4 temas oficiales **lado a lado** en la misma vista, más temas extra. Las `AllThemes` previas solo fijaban un tema en la toolbar                           | `src/fixtures/themes.tsx` (nuevo)                                                                                                 |
| Fixture **Rosette** (`#F43F5E → #FB7185`) como tema de producto. Expresado sin tocar el contrato y **fuera de `officialThemeNames`**                                          | `src/fixtures/themes.tsx`                                                                                                         |
| `Composition` y/o `AllThemes` en Text, Title, Paper y Button                                                                                                                  | stories correspondientes                                                                                                          |
| Story bilingüe es/en con contenido inyectado, sin copy de negocio en el core                                                                                                  | `FoundationsTypography.stories.tsx`                                                                                               |

El fixture Rosette justificó su existencia de inmediato: la primera versión usaba la escala `rose` **sin
voltear** en un tema oscuro y el gate axe lo detectó como contraste insuficiente en `filled`, `outline` y
`ghost`. Es exactamente el tipo de error que un tema de producto ajeno al eje indigo/violet expone y que
los cuatro temas oficiales no podían exponer.

El mismo gate encontró otros dos defectos de las stories nuevas, ambos reales:

1. `ThemePanel` fijaba `bg` pero no `c`, de modo que `variant="unstyled"` (que resuelve a
   `currentColor`) heredaba el color de texto del tema **exterior**. Corregido con `c="text.primary"`.
2. La `Composition` de Title saltaba de `h1` a `h3` a `h5`. Reescrita conservando la secuencia
   semántica con `component`, que es justo lo que pide `docs/06` §2: `order` es escala visual, el nivel
   de heading es semántica.

### 4.5 Gates

| Gate                                       | Antes de la sesión                    | Después                           |
| ------------------------------------------ | ------------------------------------- | --------------------------------- |
| `pnpm turbo build typecheck lint test`     | 27/29 · **rojo** (Modal intermitente) | **29/29 · 355 tests**             |
| `pnpm --filter playground-web a11y` (axe)  | 294 stories · 0 violaciones           | **338 stories · 0 violaciones**   |
| `pnpm check:contrast`                      | verde                                 | **verde** · 28 pares × 5 temas    |
| `pnpm --filter @stellaria/nebula-web size` | verde                                 | **verde**, sin recalibrar budgets |

## 5. Conclusión

**Nebula está lista para abrir W3.** El gate de W2 quedó realmente cerrado: las láminas
`Foundations/Visual QA` que faltaban existen, la suite es estable y verde, y las cuatro deudas visuales
que `docs/06` §9 arrastraba desde la apertura de W2.V están resueltas o acotadas.

Lo que la convergencia con `docs/stellaria-ui/` aportó de fondo no fue estética añadida sino **una
escalera de elevación que antes no existía en dark**: tres peldaños de sombra idénticos, sombras de
light reutilizadas sobre canvas oscuro y superficies separadas por un 2 % de luminosidad producían una
interfaz plana que ningún gate automático detectaba. Ese era el motivo real de la sensación de que
"faltaba algo", y es la clase de defecto que solo una lámina de referencia humana revela.

Deuda que sale de esta sesión:

1. **`Composition`/`AllThemes` no cubren todo el catálogo.** Están la base (Text, Title, Paper, Button),
   las cinco láminas y los componentes de W2.4–W2.5. Faltan inputs y toggles individuales, cubiertos
   hoy solo por la lámina de Forms.
2. **`letterSpacing` en native (ADR-027).** React Native no admite `em`; N1 debe derivar
   `px = valor × fontSize` y el lint de paridad W/N debe cubrirlo.
3. **Rim de elevación en native (ADR-028).** `darkShadows.native` solo lleva la oclusión; el rim se
   resolverá con borde al aterrizar N1.
4. **Visual regression sigue sin automatizar.** `docs/06` §8 lo condiciona a un ADR de herramienta; las
   láminas dan por fin un baseline estable contra el que compararía.
5. **Los `AllThemes` de W2.4–W2.5 siguen fijando un solo tema** en la toolbar en lugar de usar
   `ThemeMatrix`. Migrarlos es mecánico y conviene hacerlo antes de que W3 multiplique el patrón.
6. **Deuda heredada de W2 no tocada aquí**: budgets de la clase colección (Select/Combobox/MultiSelect,
   75–82 kB), `domMax` vs `domAnimation` en componentes con gesto, y decidir si `Tabs` sobrevive como
   envoltorio de `Segment`.

Los elementos de `docs/stellaria-ui/` que no pertenecen a esta fase quedan mapeados en §2.4 y no se
adelantaron: Header de producto, SectionHeader, FeatureCard, ProductPreview, PricingConfigurator,
PreferencesDock, CookieBanner y el fondo ambiental de grid/estrellas/glows.
