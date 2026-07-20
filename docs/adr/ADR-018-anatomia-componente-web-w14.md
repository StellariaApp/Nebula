# ADR-018 — Anatomía canónica del componente web: motion, polimorfismo y variantes temables (W1.4)

- **Estado**: aceptada · 2026-07-20 (checkpoint W1.4 con el propietario)
- **Contexto**: W1.4 implementa los tres primeros componentes de `@stellaria/nebula-web` (Box, Text, Button) como **plantilla canónica de los ~210 restantes**. Tres puntos quedaban abiertos y condicionan toda la librería: (1) qué motor anima las interacciones simples, (2) qué API expone el polimorfismo, y (3) cómo se implementa un `variantMap` **temable en runtime** (docs/02 §2.6) cuando el `recipe()` de Vanilla Extract se resuelve en build y ADR-016 dejó el `variantMap` fuera de la proyección CSS (es data no-CSS del objeto `theme` en JS).

## Decisión

### 1. Motion: `motion` v12 con los springs del theme

Los componentes de interacción usan `motion` (v12.42, ADR-004) con `theme.motion.spring.*` — física real, **mismos números que alimentan Reanimated en native** (paridad W/N exacta, que es el pilar de la API unificada).

- Se importa siempre vía `LazyMotion` + `domAnimation` + el componente `m.*` (no `motion.*`), para cargar solo el subconjunto necesario (~5 kB) en vez del motor completo (~30 kB).
- `useReducedMotion()` de motion decide el fallback; con reduced-motion activo la animación se desactiva (no se "acorta").
- Regla de hot paths de docs/03 §2 intacta: solo `transform`/`opacity`.
- Se descartó CSS transitions puras (opción por defecto de docs/01 §4 para "componentes simples"): el propietario priorizó la paridad de física W/N sobre el ahorro de bundle. Los budgets de docs/03 §3 se revisan con la medición real (ver Consecuencias).

### 2. Polimorfismo: prop `component`

`<Box component="section">`, `<Anchor component={NextLink}>`. Coherente con docs/01 §7 (que ya fijaba `component`/render-prop para Anchor/Link), con Stellaria (código semilla) y con Mantine (lo que usa tfv hoy) — el codemod de migración de tfv queda prácticamente 1:1. Se descartó `as` (Chakra/Radix/Ark) por romper esa continuidad en ~117 wrappers.

### 3. Variantes temables: recipe de estructura + CSS vars locales de color

El patrón que resuelve la tensión build-time/runtime:

- **`recipe()` de VE** define lo **estructural** por `size`/`variant`: alturas (`sizes.control`), padding, radius, borde, tipografía, transición. Es estático, tree-shakeable y zero-runtime.
- **El color NO se hornea en el recipe**: el recipe consume CSS vars **locales** del componente (`createVar()`: `--btn-bg`, `--btn-fg`, `--btn-border`…).
- Un **resolver compartido** (`resolveVariantRecipe`, en `src/theme/`) traduce en runtime la `VariantRecipe` del theme activo (`scale.600`, `scale.500.12`, `surface.overlay`, `gradient.brand`…) a valores CSS, y los asigna con `assignInlineVars` — el mismo mecanismo que ya usa `NebulaProvider` para temas dinámicos.
- Referencias a escala se resuelven a **`var(...)` del contrato** (no a hex), así el repintado por cambio de clase de tema sigue siendo puro CSS; el alpha (`scale.500.12`) usa `color-mix(in srgb, var(--x) 12%, transparent)`.
- Guardrails del theme respetados en el resolver: `effects.glass.enabled` off degrada la variante `glass` a superficie sólida; `motion.tier: "minimal"` desactiva el spring.

Consecuencia de diseño: **ningún componente lee paletas crudas ni hex**; el significado visual de `variant="filled"` lo decide el tema, no el componente.

## Dependencias introducidas en `packages/web` (ADR-014 regla 6)

| Dependencia                  | Versión | Tipo     | Justificación                                                          |
| ---------------------------- | ------- | -------- | ---------------------------------------------------------------------- |
| `react-aria`                 | ^3.50   | runtime  | Capa de comportamiento/a11y (ADR-003); import por-hook, tree-shakeable |
| `motion`                     | ^12.42  | runtime  | Capa de motion (ADR-004), vía `LazyMotion`/`m`                         |
| `@vanilla-extract/recipes`   | ^0.5.7  | runtime¹ | `recipe()` de variantes (stack de docs/01 §3)                          |
| `@vanilla-extract/sprinkles` | ^1.7    | runtime¹ | Style props atómicas de Box (equivalente web del Collector)            |

¹ CSS generado en build; el runtime que queda es la función de resolución de clases (~1 kB cada una).

Todas figuran ya en la tabla de docs/01 §8 y en ADR-002/003/004 — este ADR registra su alta efectiva y las versiones.

## Consecuencias

- La anatomía resultante se documenta en `docs/patterns/web-component-template.md` y es **vinculante para W2–W4**.
- **Budgets — medición real y revisión (2026-07-20)**: al cerrar W1.4 se midió el coste efectivo, y resultó muy superior a la estimación con la que se tomó la decisión (~5 kB):

  | Pieza                                                                            | brotli         | Nota                                                                                                                                                    |
  | -------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `motion` (`LazyMotion` + `domAnimation` + `m`)                                   | **27,7 kB**    | `domMin` no ahorra (25,8 kB); cargar las features con `import()` perezoso EMPEORA el total (el chunk dinámico arrastra el módulo `motion/react` entero) |
  | `react-aria` (`useButton`+`useHover`+`useFocusRing`+`mergeProps`+`useObjectRef`) | 9,75 kB        |                                                                                                                                                         |
  | Button completo (CSS + recipe + código propio)                                   | **45,1 kB**    |                                                                                                                                                         |
  | Box / Text (primitivos)                                                          | 8,46 / 8,76 kB | domina el mapa de clases atómicas de sprinkles                                                                                                          |

  Presentada la medición, el propietario **ratificó mantener `motion` en toda la librería** (la paridad exacta de física W/N pesa más que el bundle) y **elevar los budgets** de docs/03 §3: primitivos ≤9 kB · compuestos ≤48 kB · patterns ≤70 kB, medidos en **brotli y por módulo**. Alternativas descartadas en ese checkpoint: híbrido CSS-para-controles/motion-para-overlays (Button ~16 kB) y CSS en toda la librería.

- `LazyMotion` debe montarse una sola vez por árbol: el patrón lo coloca dentro de cada componente animado con `strict`, y W2 evaluará subirlo a `NebulaProvider` si aparece anidamiento redundante.
- Los primitivos sin interacción (Box, Text) NO importan motion: quien usa solo `Box` no paga el motor.
