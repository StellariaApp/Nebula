---
"@stellaria/nebula-tokens": minor
"@stellaria/nebula-themes": minor
"@stellaria/nebula-web": minor
---

El cristal de los accionables es un velo, no una superficie (ADR-136)

`GlassLevel` gana `veil`, el escalón más transparente de la escala: `blur(1px)` con el borde subido.
En dark el velo **aclara** —`rgba(255, 255, 255, 0.05)`, la receta que ADR-078 describía— en vez de
oscurecer, que sobre un canvas oscuro no separaba nada; en light es `rgba(255, 255, 255, 0.30)`.

El borde es lo que separa un control de 48 px de su fondo, así que subirlo deja bajar el velo y el
filo **mejora**: de 1,18 con `control` a 1,25–1,60. `check:contrast`: 165 pares, 165 PASS.

`Button`, `ActionIcon` y `QuickAction` lo toman por defecto. Son los únicos accionables del catálogo
que admiten `variant="glass"`; el resto estrecha `Variant` sin incluirlo. `QuickAction` estrena la
prop `glass`, que los otros dos ya tenían.

**Rompedor para temas propios.** El contrato es `Record<GlassLevel, GlassSurfaceRecipe>`, así que un
tema que no defina `veil` deja de compilar. Añade la entrada con la receta que quieras; si omites
`borderColor`, el schema pone `rgba(128, 128, 128, 0.24)`.

Consumir componentes no rompe: quien no escriba temas propios solo ve el material nuevo en los tres
accionables.
