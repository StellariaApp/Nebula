# Paper

Superficie temada: fondo `surface.raised`, `shadow`, `radius` y `withBorder` (borde `border.default`).

## `variant` es opcional, y su ausencia no cuesta nada visualmente

Sin `variant`, Paper pinta exactamente lo de siempre. Con `variant`, `ResolveVariant` sobrescribe
fondo, primer plano y borde contra `theme.variantMap` (ADR-038). El mecanismo es `fallbackVar`: el
recipe declara `background: fallbackVar(bg, vars.color.surface.raised)`, de modo que la var local solo
existe cuando hay variante y ningún uso previo se mueve un píxel.

`withBorder` y la variante conviven: el borde se dibuja si el consumidor lo pide **o** si la receta
resuelta trae uno (`outline`). No se le resta al consumidor una decisión que ya tomaba.

## Por qué Paper dejó de ser server-safe

`ResolveVariant` lee el `variantMap` del objeto `theme` en runtime, así que necesita `useTheme()` y con
él `"use client"`. Paper era uno de los tres presentacionales del catálogo que renderizaban en servidor
—con Badge y Progress— y los tres lo pierden al adoptar variantes.

ADR-038 no había pesado ese coste; el propietario lo aceptó en el checkpoint de V4. La alternativa
evaluada era excluir a Paper del subconjunto, conservando RSC a cambio de que su superficie no fuera
tematizable por receta.

**El hook se llama siempre, también sin `variant`**, porque los hooks no pueden ser condicionales. La
consecuencia práctica es que Paper ahora exige `NebulaProvider` incluso en su forma más simple: sus
tests pasaron de `@testing-library/react` al helper compartido de `__tests__/render.tsx`.

## `glow` se aplica como sombra, no como pseudo animado

La plantilla (`docs/patterns/web-component-template.md` §3.1) sitúa el halo en un `::after` que anima
`opacity`. Eso es para controles interactivos. Paper es una superficie: su glow es estático y va a
`boxShadow` por la variante `glowing` del recipe, que gana a `shadow`. `docs/06` §6 lo respalda —«las
sombras no animan»— y evita traer motion a un primitivo que no lo tenía.

El fondo, color y borde base viven en `baseLayer` para que las style props de Box los puedan pisar (`<Paper bg="surface.sunken">`, `<Paper c="text.secondary">`): sin la capa, la clase base ganaría a la clase atómica de sprinkles y la style prop se ignoraría en silencio (misma trampa que documenta la plantilla en §2).

`radius` acepta un nombre de token o un número (px libre, resuelto a estilo inline que gana al recipe). `shadow`/`radius`/`withBorder` no colisionan con las shorthands de Box (`shadow` de Box es `boxShadow`, pero aquí se consume antes de llegar a Box; `r` y `bdc` usan otros nombres).
