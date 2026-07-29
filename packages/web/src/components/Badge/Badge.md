# Badge

## El color sale del `variantMap`

`BadgeVariant` es `Extract<Variant, "filled" | "outline" | "light" | "ghost" | "gradient">` y lo
resuelve `ResolveVariant` contra `theme.variantMap` (ADR-038). Se retiró la función `Palette()` local,
que reimplementaba las recetas con valores que ya habían derivado del contrato —`light` al 14 % aquí,
12 % en el contrato y en Alert—.

`gradient` entra en el subconjunto porque `docs/06` §6 admite el gradiente como «acento de marca en
CTA, badge, header o hero», y el badge se nombra explícitamente. `glow` y `glass` quedan fuera: un
badge aparece en colecciones, y el glow «no se aplica a listas completas».

## `dot` dejó de ser una variante

Era el cuarto miembro de la unión local, y no era una receta cromática sino una **forma**: añadía un
punto de color al contenido. Ahora es `dot?: boolean`, ortogonal a `variant`, y publica `data-dot`.

La equivalencia no es exacta y conviene saberlo al migrar. El antiguo `variant="dot"` traía además su
propio cromatismo —`surface.raised` + `text.primary` + `border.default`, es decir, una superficie
neutra— que ninguna receta del contrato reproduce tal cual. Lo más cercano es
`<Badge dot variant="outline" color="gray">`. Se prefirió la composición explícita a conservar un
miembro que mezclaba forma y color en un mismo nombre, que es justo lo que ADR-041 retiró del catálogo.

## Altura

`compact`, no `control`: un badge muestra metadata y no es objetivo táctil (ADR-033, `docs/06` §4.1).
