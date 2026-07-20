# Text

Primitivo tipográfico construido sobre Box. Las props de tipografía (`fz`, `fw`, `lh`, `ls`, `ta`, `c`…) las resuelve el sprinkles compartido de Box; Text solo añade truncado, line-clamp y el modo `inherit`.

## Por qué los estilos base van en `@layer`

`Text.css.ts` declara su base dentro de `baseLayer` (`src/theme/layers.css.ts`). Las reglas dentro de una `@layer` pierden siempre frente a las que están fuera de capas, sin importar especificidad ni orden.

Sin la capa, la clase base de Text —que fija `color`— ganaba a la clase atómica de `c="text.onPrimary"` por orden en la hoja, y el texto se pintaba con el color por defecto sobre una superficie de color. El gate axe lo detectó como contraste insuficiente; en revisión de código es invisible.

**Regla general**: todo componente con estilos base que acepte style props debe declararlos en `baseLayer`.
