# ADR-136 — El cristal de los accionables es un velo, no una superficie

- **Estado**: **aceptada** · 2026-08-12 (checkpoint del propietario: nivel nuevo, no recalibrar) ·
  **WN**
- **Cambia API pública**: sí, y es **rompedor para temas propios**: `GlassLevel` gana `veil` y el
  contrato es `Record<GlassLevel, GlassSurfaceRecipe>`, así que un tema que no lo defina deja de
  compilar. Aditivo para quien solo consume componentes.
- **Amplía**: [ADR-078](ADR-078-el-cristal-es-una-receta-por-clase-de-superficie.md), que fijó que la
  clase la decide el componente. Este ADR añade la clase que le faltaba a esa tabla.
- **Añade**: `glass` a `QuickActionProps`, y default `veil` en `Button`, `ActionIcon` y `QuickAction`.

## Contexto

`Button` era el único de su clase que no pasaba clase de cristal a `ResolveVariant`, así que caía en
`recipe.glass` del `variantMap` —`control`—. Al cablearlo se le puso `subtle` por defecto, copiado de
`Card`, y eso lo movía a la receta de **superficie**: exactamente el defecto que ADR-078 existía para
arreglar, y exactamente el intento que ese ADR ya había probado y descartado («quitó fuerza pero no
resolvió el fondo»).

Corregirlo destapó la pregunta de verdad: la receta de `control` en el tema —velo al 0,81 con
`blur(2px)`— **no es la que ADR-078 escribió**. Ese ADR describe «velo muy tenue con borde marcado y
desenfoque corto», `rgba(255,255,255,0.05)` con borde al 10 %, y razona que **a 48 px de alto lo que
separa el control del fondo es el borde, no el tinte**. El tema derivó al tinte y apagó el borde.

## Decisión

### 1. Un nivel nuevo, `veil`, y no una recalibración de `control`

Medido sobre el catálogo: de los 24 componentes que resuelven variante, **22 caen en `control`** —solo
`Card` y `CodeHighlight` declaran `subtle`—, y `NavLink.css.ts` además lo lee directo. Recalibrar
`control` no habría sido un cambio del botón: habría repintado el cristal de `Paper`, `Hero`, `Toast`,
`Alert` y otros dieciocho, que no son controles de 48 px.

`veil` es el escalón más transparente de la escala:

| tema  | fondo                       | desenfoque                 | borde     |
| ----- | --------------------------- | -------------------------- | --------- |
| dark  | `rgba(255, 255, 255, 0.05)` | `blur(1px) saturate(120%)` | `#3f4249` |
| light | `rgba(255, 255, 255, 0.30)` | `blur(1px) saturate(120%)` | `#dedede` |

**En dark el velo aclara en vez de oscurecer**, y esa es la diferencia que se ve: un velo oscuro sobre
un fondo oscuro no separa nada, solo apaga. Pintado sobre `surface.base` la píldora pasa de `#171a23`
—que es prácticamente el propio canvas— a `#262932`. Es, literalmente, la receta que ADR-078 escribió
para dark y que el tema nunca llegó a tener: `rgba(255, 255, 255, 0.05)`.

### 2. El borde es la palanca, y por eso el velo puede bajar tanto

Con el borde de `control` (`#23252c` en dark), bajar el velo rompe el suelo del gate: el filo cae por
debajo del mínimo a partir de **α ≈ 0,68** contra `surface.sunken`.

| velo | filo dark (peor caso) | filo light (peor caso) |
| ---: | --------------------: | ---------------------: |
| 0,81 |                 1,186 |                  1,190 |
| 0,70 |                 1,158 |                  1,177 |
| 0,65 |             **1,145** |                  1,170 |

Subiendo el borde, el velo puede bajar y **el filo sube** en vez de caer. `check:contrast` da **165
pares · 165 PASS · 0 FAIL** en los tres temas, con el filo de `veil` entre 1,25 y 1,60 en dark y entre
1,26 y 1,35 en light — por encima del 1,18 que daba `control`, siendo mucho más transparente.

Es el mismo razonamiento de ADR-078 —el borde separa, no el tinte— aplicado al revés: allí justificaba
un velo tenue, aquí permite bajarlo más.

### 3. Solo tres componentes lo toman por defecto, porque solo tres pueden

De los accionables del catálogo, la mayoría **no admite `variant="glass"`**: `Chip`, `NavLink`,
`Pagination`, `Slider`, `Stepper`, `Tag` y `Segment` estrechan `Variant` sin incluirlo. Los que
admiten cristal y son accionables son **`Button`, `ActionIcon` y `QuickAction`**, y los tres pasan a
`veil` por defecto. `QuickAction` estrena la prop `glass`; los otros dos ya la tenían.

Los demás que admiten cristal se quedan como están porque no son accionables: `Nav` es cromado —
ADR-078 lo pone en `default`— y `Alert`, `Banderole`, `Toast` y `Hero` son superficies.

### 4. La lista del gate deja de poder desfasarse

`GLASS_LEVELS` en `tools/contrast-check/src/pairs.ts` era un literal suelto, no derivado de
`GlassLevel`: un nivel nuevo habría viajado **sin que ningún par lo midiera**. Pasa a construirse con
el mismo truco de exhaustividad que usa `packages/themes/src/enums.ts`, así que si el tipo gana un
valor y no se añade allí, la tool deja de compilar. No se reutiliza `glassLevels` de `themes` porque
`enums.ts` es interno de ese paquete y exportarlo sería otra API pública nueva.

## Alternativas descartadas

**Recalibrar `control`.** Es lo que ADR-078 querría —su receta original es justo esta— pero hoy
`control` es el defecto del `variantMap` y por tanto el cristal de 22 componentes. Recalibrarlo mezcla
dos cambios: arreglar el control y repintar el catálogo. `veil` los separa; recalibrar `control` para
que vuelva a su intención queda como trabajo aparte, con su propia evidencia.

**Añadir el nivel como intensidad.** ADR-078 descartó un cuarto nivel de intensidad (`faint`) porque
«el control seguiría eligiendo intensidad en vez de clase». La objeción no aplica aquí: el mecanismo
de clase ya existe desde ese ADR, y `veil` entra **como clase** —la del accionable—, no como un
peldaño más de una escala que el componente elija a ojo.

## Consecuencias

- **Rompe los temas propios.** `Record<GlassLevel, GlassSurfaceRecipe>` exige la clave nueva. El
  schema de `packages/themes` da un borde por defecto si el tema omite `borderColor`, pero no inventa
  la entrada entera. Va con changeset.
- Cuatro sitios más tuvieron que aprender el nivel, y los cuatro los cazó el compilador:
  `schema.ts` (borde de reserva), `enums.ts` (lista exhaustiva), `contract.css.ts` (variables de
  Vanilla Extract) y `theme-vars.ts` (el mapeo tema → variables).
- **Residual anotado**: `check:contrast` compone el cristal contra `surface.*` y nada más. El botón de
  la portada vive sobre el `StarField` y los degradados, que el gate no modela; y `resolve.ts` evalúa
  la clase del `variantMap`, nunca el override por componente, así que `veil` se mide por sus propios
  pares y no en su sitio real. Cerrarlo es el mismo trabajo que el gate de bytes por ruta: medir sobre
  el render, no sobre el tema.
