# Omit / Valid

Dos componentes de lógica pura (server-safe) que conservan la API pública de FC/TFV:

- `Omit`: no renderiza nada si `omit` es `true` (inverso de un guard); si no, `children`.
- `Valid`: renderiza `children` si `valid`, si no `invalid` (fallback semántico de "no válido").

Se mantienen los nombres de props originales (`omit`, `valid`/`invalid`) porque son el contrato ya usado por los consumidores y el mapa de migración los preserva 1:1. El nombre `Omit` colisiona en espacio de tipos con la utilidad `Omit<>` de TS, pero solo en el espacio de valores del módulo que lo importe; es el nombre canónico del inventario.
