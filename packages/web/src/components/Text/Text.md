# Text

Primitivo tipográfico construido sobre Box. Las props de tipografía (`fz`, `fw`, `lh`, `ls`, `ta`, `c`…) las resuelve el sprinkles compartido de Box; Text solo añade truncado, line-clamp y el modo `inherit`.

## Por qué los estilos base van en `@layer`

`Text.css.ts` declara su base dentro de `primitive_layer` (`src/theme/layers.css.ts`). Las sprinkles viven en `util_layer`, que va después en el orden declarado, así que la style prop gana siempre sin importar especificidad ni orden de archivo (ADR-142). Y como las cinco capas anidan bajo `nebula`, cualquier CSS sin capa del consumidor gana a todas ellas.

Sin la capa, la clase base de Text —que fija `color`— ganaba a la clase atómica de `c="text.onPrimary"` por orden en la hoja, y el texto se pintaba con el color por defecto sobre una superficie de color. El gate axe lo detectó como contraste insuficiente; en revisión de código es invisible.

**Regla general**: todo componente declara sus estilos en la capa que le toca por composición — ver `src/theme/layers.md`. Ninguna regla de componente se queda fuera de capa.
