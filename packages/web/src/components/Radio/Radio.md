# Radio

## El punto deriva de `sizes.control`

`styles.size` fija `variables.size` en `calc(vars.size.control.<size> / 2)`, igual que Checkbox y Switch, de
modo que los tres comparten altura al mismo `size`. La justificación completa —por qué `control / 2` y
no una escala nueva— está en `Checkbox.md`; aquí solo cambia la forma del indicador, no su tamaño.

Antes existía `SIZE_PX = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 }` en el `.tsx`. Lo retiró la causa
(c) de `docs/reviews/visual-calibration-2026-07-28.md`, que es aplicación de ADR-033 punto 6.

`variables.color` sigue inyectándose con `assignInlineVars` porque depende de la prop `color`; el tamaño no
lo necesita, porque `size` es un conjunto cerrado y `styleVariants` lo resuelve en build.
