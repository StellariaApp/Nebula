# Sombras calibradas por esquema

`@stellaria/nebula-tokens` exporta un único set `shadows`, calibrado para superficies claras: negro con
opacidades de 0,04 a 0,24. Sobre un canvas oscuro ese set es invisible — una sombra negra al 4 % sobre
`#080a12` no separa nada — y hasta el cierre de W2 los cuatro temas lo consumían tal cual, dejando la
escalera de elevación de `dark` prácticamente plana.

`darkShadows` implementa lo que pide `docs/06-visual-language.md` §5 para esquemas oscuros: cada nivel
combina **oclusión** (sombra proyectada, mucho más opaca que en light) y **rim** (`inset 0 1px 0` blanco
de baja opacidad, la línea de luz superior que la guía Stellaria describe como firma de la casa). La
oclusión sitúa el elemento sobre el fondo; el rim lo despega del borde.

Es un módulo interno: no se exporta desde `src/index.ts`. Los temas oscuros lo consumen al construir su
sección `effects.shadows`, que ya es dato por tema en el contrato. No hay ampliación de `NebulaTheme`.

La mitad `native` solo lleva la oclusión: React Native no admite sombras `inset`, así que el rim se
resuelve allí con borde, no con sombra.

## Por qué el rim progresa y la oclusión no

La primera versión de este módulo escalaba la oclusión —de 0,40 a 0,72 sobre negro— y dejaba el rim casi
plano, con `sm` y `md` compartiendo el mismo 0,06. Al mirar la lámina `Foundations/Visual QA/Surfaces`
renderizada quedó claro que eso no producía escalera: **negro sobre casi-negro no tiene recorrido**. Una
sombra al 45 % sobre un canvas de `#080a12` desplaza el color unos pocos puntos; entre dos niveles
adyacentes, nada perceptible.

El rim sí lo tiene, porque va en la dirección contraria a la superficie. Sus opacidades son ahora
estrictamente crecientes —0,04 · 0,07 · 0,10 · 0,13 · 0,16 · 0,18 · 0,20— y el filo superior es el cue
que separa un nivel del siguiente cuando comparten superficie.

## Tres escalones perceptibles, no cinco

`docs/06` §5 declara cinco niveles pero el contrato tiene cuatro roles de superficie, así que los niveles
1–2 comparten `surface.raised` y los 3–4 comparten `surface.overlay`. En dark eso da **tres escalones de
superficie** más la progresión del rim, no cinco escalones independientes.

Es deliberado y no se compensa. Los pares que colapsan no conviven adyacentes en una interfaz real: una
card y un elemento sticky no se comparan lado a lado, ni un popover y un modal. Ampliar `SurfaceRole`
para separarlos sería un cambio de contrato que arrastra a native, y `docs/06` §5 no lo pide.
