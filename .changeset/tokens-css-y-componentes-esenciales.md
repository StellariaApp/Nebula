---
"@stellaria/nebula-tokens": minor
"@stellaria/nebula-web": minor
---

Tokens como CSS y cierre de los componentes esenciales (ADR-208).

- `@stellaria/nebula-tokens/css`: custom properties `--nebula-*` (color, tipografía, espacio, radios,
  sombras, movimiento y capas) con tema claro y oscuro por `prefers-color-scheme` y `[data-theme]`, y
  `prefers-reduced-motion` que apaga las duraciones. Se usa sin React con `import
'@stellaria/nebula-tokens/css'` o con un `<link>`. Nuevos exports: `BuildTokensCss`, `LIGHT_SCHEME`,
  `DARK_SCHEME`.
- `Table.Row` con `onPress` conserva el rol `row` (antes `role="button"`, que sacaba la fila de la tabla)
  y sigue activándose con Enter y Espacio.
- `Select`: el `listbox` abierto lleva el nombre de la etiqueta del campo.
- `Menu`: las filas respetan `prefers-reduced-motion`.
- Suites de accesibilidad (axe, teclado, foco, motion) para los componentes esenciales, historias propias
  para `Alert`, `Avatar`, `Badge`, `Card`, `Dialog`, `Skeleton`, `Table`, `Tabs` y `Toast`, e inventario en
  `docs/inventario-componentes.md`.
