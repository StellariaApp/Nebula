# Prompts W1 — Theming web + playground web

> 4 prompts secuenciales para sesiones de Opus. Requiere F0 cerrado (ver `docs/f0-closure.md`). No pasar al siguiente sin el anterior en verde.

---

## Prompt W1.1 — `@stellaria/nebula-themes`: schema + temas oficiales

```
Actúa como arquitecto del design system Nebula en C:\Users\Skr13\Documents\GitHub\Nebula.
F0 está cerrado: @stellaria/nebula-tokens contiene el contrato NebulaTheme y las 16 paletas 50–950.

LEE ANTES (vinculante): docs\02-theming.md (§2 contrato, §3 temas oficiales), docs\adr\ADR-006-theme-format.md,
docs\adr\ADR-009-escala-cromatica-50-950.md, packages\tokens\src (el contrato real), tools\ (contrast-check).

MISIÓN — implementar packages/themes (@stellaria/nebula-themes):
1. `themeSchema` (Zod 4) derivado de NebulaTheme — zod es dependencia SOLO de este paquete (ADR-014).
2. Temas oficiales COMPLETOS como JSON tipado (`satisfies NebulaTheme`): `nebula-light` y `nebula-dark`
   (enterprise vibrante, indigo/violet primary, Geist, motion tier standard, glass on — decisión Stellaria).
   Mapear roles semánticos (surface/text/border/semantic) a pasos concretos de las paletas.
3. Borradores de presets demostrativos `sober` (radius mínimo, densidad compacta, motion minimal, glass off)
   y `playful` (radius full, gradients, motion expressive) — aprobados por el propietario; valores iniciales
   razonables, se calibran visualmente en W1.3/W1.4.
4. `loadTheme(json: unknown): NebulaTheme` — valida con themeSchema y lanza errores legibles.
5. Tests: los 4 temas validan contra el schema; `pnpm check:contrast` en verde para los 4 (o reporte
   de pares corregidos).

RESTRICCIONES: política de preguntas del propietario (nunca asumir en silencio: contradicción u
opción abierta → pregunta con opciones + recomendación). No portar valores legacy 1:1.

ACEPTACIÓN: build/typecheck/lint/test verdes en el paquete; contrast-check verde en los 4 temas.
REPORTE: mapa rol→paso de paleta elegido por tema, y fallos AA corregidos con su ajuste.
```

---

## Prompt W1.2 — Runtime de theming web + hooks base

```
Actúa como ingeniero senior de plataforma web en C:\Users\Skr13\Documents\GitHub\Nebula.
Estado: F0 cerrado; W1.1 entregó @stellaria/nebula-themes con 4 temas validados.

LEE ANTES: docs\02-theming.md §1 y §4 (runtime dual — implementas SOLO la mitad web),
docs\01-architecture.md §4 (anatomía web), docs\adr\ADR-002-styling-engines.md, docs\adr\ADR-012 (TS: lint en 5.9.3).
CÓDIGO FUENTE de hooks a migrar: C:\Users\Skr13\Documents\GitHub\Stellaria-Frontend\src\ui\native\src\hooks\
(useDebounce, useDisclosure, useUncontrolled — son platform-agnostic).

MISIÓN:
1. En packages/web: `createThemeContract` de Vanilla Extract con la forma de NebulaTheme;
   materialización de los 4 temas oficiales en build (`createTheme`) → una clase CSS por tema;
   inyección runtime de temas dinámicos (vars sobre el contract) para `loadTheme` de W1.1.
2. `NebulaProvider` (web): aplica clase de tema, expone contexto {theme, setTheme, scheme};
   `ColorSchemeScript` anti-flash SSR (Next 16 compatible); persistencia inyectable (localStorage default).
3. En packages/hooks: `useTheme()` con la API de docs\02 §4; migrar useDebounce/useDisclosure/
   useUncontrolled desde Stellaria (cross-platform, sin imports de react-native ni de DOM).
4. Tests: cambiar tema actualiza las CSS vars; SSR no revienta (sin window en render); hooks con RTL.

RESTRICCIONES: cero CSS runtime fuera de la inyección de vars; nebula-hooks solo depende de React;
política de preguntas del propietario.

ACEPTACIÓN: build/typecheck/lint/test verdes; demo mínima (html estático o test) demostrando
switch light↔dark↔sober↔playful solo cambiando la clase.
REPORTE: decisiones de implementación del contract (naming de vars) y dudas para W1.3.
```

---

## Prompt W1.3 — Playground web (Storybook 10.5) + gates de CI

```
Actúa como ingeniero de DX en C:\Users\Skr13\Documents\GitHub\Nebula.
Estado: W1.1 y W1.2 cerrados (temas + runtime web funcionando).

LEE ANTES: docs\adr\ADR-007-playgrounds-storybook.md, docs\03-a11y-motion-performance.md §4 (gates),
docs\adr\ADR-015-testing-stack.md, apps\playground-web\ (placeholder de F0).

MISIÓN — montar apps/playground-web:
1. Storybook 10.5 (framework react-vite) consumiendo @stellaria/nebula-web con los temas reales.
2. Toolbar global: selector de tema (nebula-light/dark/sober/playful), toggle prefers-reduced-motion,
   viewport presets. Decorator que envuelve toda story en NebulaProvider.
3. addon-a11y (axe) activo + test-runner configurado para ejecutar axe sobre TODAS las stories en CI
   (task turbo `a11y`); fallo = exit code ≠ 0.
4. size-limit configurado por entry de @stellaria/nebula-web (budgets provisionales de docs\03 §3:
   primitivos ≤5kB, compuestos ≤15kB, patterns ≤35kB gzip) como task turbo `size`.
5. Plantilla de stories obligatorias por componente (Default/Variants/Sizes/States/Dark/ReducedMotion
   + play function de teclado donde aplique) documentada en apps\playground-web\STORIES-TEMPLATE.md.

RESTRICCIONES: TS 7 para build/typecheck, lint parsea con 5.9.3 (ya configurado — no lo toques);
política de preguntas del propietario.

ACEPTACIÓN: `pnpm turbo build a11y size --filter=playground-web...` verde; storybook dev arranca y la
toolbar cambia tema/motion en vivo.
REPORTE: estado de los gates y cualquier fricción de Storybook 10 encontrada.
```

---

## Prompt W1.4 — Piloto de anatomía: Box, Text y Button (plantilla canónica)

```
Actúa como el autor del primer componente de Nebula (define el patrón que seguirán ~200 más) en
C:\Users\Skr13\Documents\GitHub\Nebula. Estado: W1.1–W1.3 cerrados.

LEE ANTES (vinculante): docs\01-architecture.md §4 (anatomía web de 3 capas: React Aria + VE recipe/
sprinkles + motion), docs\03-a11y-motion-performance.md §1-§2 (contrato a11y y motion), docs\02 §2.6
(variantMap temable), docs\adr\ADR-003 y ADR-004, packages\tokens\src\types (BaseProps/Keys*/variants),
apps\playground-web\STORIES-TEMPLATE.md.

MISIÓN — implementar 3 componentes COMPLETOS en packages/web como plantilla canónica:
1. **Box**: primitivo polimórfico con sprinkles (equivalente web del Collector: SpaceProps/SizeProps/
   ColorsProps desde los Keys* de tokens).
2. **Text**: tipográfico sobre Box (fz/fw/c/ta/lh/truncate; polimórfico p/span).
3. **Button**: las 3 capas completas — useButton (React Aria), recipe con TODAS las variantes del
   variantMap (filled/outline/light/glass/ghost/glow/gradient/unstyled) × sizes xs–xl (heights de
   sizes.control) × estados, loading/disabled, leftSection/rightSection, motion press con tokens
   spring, focus visible con colors.border.focus.
4. Testing contract completo de los 3 (ADR-015): render de variantes, interacción, a11y (roles,
   teclado Enter/Space, axe), reduced-motion.
5. Stories según plantilla, en los 4 temas.
6. Documenta el patrón resultante en docs\patterns\web-component-template.md (estructura de archivos,
   qué va en cada capa, cómo se consume el theme) — será la referencia de W2–W4.

RESTRICCIONES: los componentes SOLO leen roles semánticos del theme (nunca paletas crudas ni hex);
Button debe verse coherente (no "roto") en sober y playful — es el gate del theming. Política de
preguntas del propietario.

ACEPTACIÓN (gate de W1 completo — docs\05-roadmap.md): cambiar tema reconfigura los 3 pilotos sin
tocar código; axe y size-limit verdes; testing contract de Button al 100%.
REPORTE: cierre de W1 en docs\w1-closure.md (checklist del gate) + aprendizajes para escalar en W2.
```
