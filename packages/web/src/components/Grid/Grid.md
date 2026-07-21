# Grid / Grid.Col

Rejilla de 12 columnas (configurable) donde **la config viaja de `Grid` a `Grid.Col` por CSS custom properties que heredan por cascada** — no por contexto ni store. Es la plantilla acordada (checkpoint W2) para los compuestos de layout web: cero estado, cero deps, server component (RSC), frente al store Jotai que el native necesita (ADR-010 se reserva para compuestos de estado dinámico como Accordion/Tabs).

## Cómo comparte la config

`Grid` publica `--grid-columns`, `--grid-gutter` y `--grid-grow` en su nodo. Como las custom properties heredan, cualquier `Grid.Col` descendiente las lee sin saber nada de su padre. `Grid.Col` solo publica lo suyo (`--col-span`, `--col-offset`) y el recipe calcula el ancho:

```
ancho(span) = span · U + (span − 1) · gutter,  con  U = (100% − (columns − 1)·gutter) / columns
```

`U` es el ancho de una columna contando los `gutter` intermedios; la fórmula es exacta para cualquier combinación de spans que sume `columns` (verificado en los tests de theming). El `gutter` se aplica como `gap` del contenedor.

## span

- número → ancho de N columnas (`flex-grow` = `--grid-grow`, 0 salvo que el Grid tenga `grow`).
- `"auto"` (default) → llena el espacio restante a partes iguales (`flex: 1 1 0`).
- `"content"` → se ajusta a su contenido (`flex: 0 0 auto`).

`Grid.Col` no lanza error fuera de un `Grid`: sin ancestro que fije `--grid-columns`, `flex-basis` degrada de forma inocua. La validación estructural se deja al consumidor (no hay coste de runtime por comprobarlo).
