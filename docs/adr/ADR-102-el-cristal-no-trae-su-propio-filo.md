# ADR-102 — El cristal no trae su propio filo

- **Estado**: **aceptada** · 2026-08-05 — a petición del propietario
- **Enmienda**: `GlassSurfaceRecipe` de `@stellaria/nebula-tokens` y `colors.border` de los cuatro
  temas oficiales.
- **Rompe**: `GlassSurfaceRecipe.border` y `vars.glass.<nivel>.borderColor`.

## Contexto

Había **dos sistemas de borde** conviviendo. Uno semántico —`colors.border` con cinco roles— y otro
por nivel de cristal —un `border` dentro de cada `glass.surface.*`, con alfa propio—. Un componente
con cristal tomaba el segundo; el resto del catálogo, el primero. Nada decía cuál usar.

El desequilibrio era grande: **7 usos** del de cristal contra **133** del semántico. Y el de cristal
nunca se validó, porque el gate de contraste no lo mira.

## Decisión

### `GlassSurfaceRecipe` pierde `border`

Se queda con `background` y `backdropFilter`, que es lo que define un cristal. `GlassRecipe()` en
`theme-vars` desaparece: existía solo para extraer el color del shorthand `1px solid …`.

Los 7 sitios pasan a `vars.color.border.*`, y con ellos tres consumidores que el recuento inicial no
vio y encontró el `typecheck`: `resolve-variant` los usaba en `borderColor` y `glassBorder` de la
variante `glass`, y `GlassSurface` en su `borderRule`.

### `colors.border` se recalibra contra el filo de cristal que sustituye

El valor de referencia es el **nivel `default`** del cristal —el que usaba el cromado—, compuesto
sobre `base`:

| tema  | alfa | compuesto | peldaño elegido |
| ----- | ---- | --------- | --------------- |
| light | 0.06 | `#ededed` | `light.500`     |
| dark  | 0.07 | `#2b2e36` | `dark.900`      |

Y de ahí el propietario lo atenuó sobre la lámina hasta el punto actual: `subtle`/`default` en
`light.400`/`light.500` para claro y `dark.700` para los dos en oscuro. `strong` no se toca: tiene
suelo duro de ≥3:1 contra toda superficie por WCAG 1.4.11.

### Por qué sólido y no alfa

El primer diseño mantenía el filo translúcido, que es lo que hace que un borde funcione sobre
cualquier fondo. Se descartó al medir el gate: **culori ignora el alfa en `wcagContrast`**, así que
un `rgba(255,255,255,0.09)` sobre `#1b1e27` se reporta como **16.65** cuando el compuesto real es
**1.10**. Con bordes translúcidos el gate daría verde a cualquier cosa, y es la red que esta misma
semana pilló dos fallos reales.

Queda anotado como deuda: **enseñar a `tools/contrast-check` a componer el alfa** antes de medir. El
mismo punto ciego afectaba ya a los `glass.*.border` de hoy, que nadie validó nunca.

## Consecuencias

- Un solo sistema de borde. Un componente con cristal usa los mismos roles que el resto.
- **Tres temas tienen `subtle` y `default` en el mismo valor** tras la atenuación —`sober-light`,
  `playful` y `dark`—, porque su `base` deja poco recorrido de rampa por encima. El rol `subtle`
  pierde contenido propio ahí; si se quiere recuperar, hay que mover `base`, no el borde.
- Gates en verde: contraste 116/116 en 5 temas, 1188 tests, a11y 86 suites y 594 tests, `size` sin
  excesos.
