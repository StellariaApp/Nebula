# Group

Fila horizontal con gap del tema. Equivalente web del Group de `@stellaria/nebula-native`, con la misma API (`gap`, `grow`, `preventGrowOverflow`) pero **distinta mecánica**: donde el native usa un store Jotai para inyectar `grow` a cada hijo, la web lo resuelve con un selector CSS de hijos (`& > *`), sin estado ni `"use client"`. Queda como server component (docs/03 §4).

## grow y preventGrowOverflow

- `grow` reparte el espacio: cada hijo recibe `flex-grow: 1; flex-basis: 0`, quedando anchos iguales.
- `preventGrowOverflow` (on por defecto) evita que un hijo con contenido largo desborde su reparto: fija `max-width` a `(100% - (n-1)·gap) / n`, con `n` = número de hijos, publicado como var local (`--group-count`) desde `Children.count`. Sin él, un hijo ancho robaría espacio a los demás pese a `flex-basis: 0`.

El conteo se hace en render (API `Children`, válida en server components); no requiere cliente.
