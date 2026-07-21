# Paper

Superficie temada: fondo `surface.raised`, `shadow`, `radius` y `withBorder` (borde `border.default`). Presentacional y server-safe.

El fondo, color y borde base viven en `baseLayer` para que las style props de Box los puedan pisar (`<Paper bg="surface.sunken">`, `<Paper c="text.secondary">`): sin la capa, la clase base ganaría a la clase atómica de sprinkles y la style prop se ignoraría en silencio (misma trampa que documenta la plantilla en §2).

`radius` acepta un nombre de token o un número (px libre, resuelto a estilo inline que gana al recipe). `shadow`/`radius`/`withBorder` no colisionan con las shorthands de Box (`shadow` de Box es `boxShadow`, pero aquí se consume antes de llegar a Box; `r` y `bdc` usan otros nombres).
