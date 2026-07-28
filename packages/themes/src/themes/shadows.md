# Sombras calibradas por esquema

`@stellaria/nebula-tokens` exporta un único set `shadows`, calibrado para superficies claras: negro con
opacidades de 0,04 a 0,24. Sobre un canvas oscuro ese set es invisible — una sombra negra al 4 % sobre
`#080a12` no separa nada — y hasta el cierre de W2 los cuatro temas lo consumían tal cual, dejando la
escalera de elevación de `nebula-dark` prácticamente plana.

`darkShadows` implementa lo que pide `docs/06-visual-language.md` §5 para esquemas oscuros: cada nivel
combina **oclusión** (sombra proyectada, mucho más opaca que en light) y **rim** (`inset 0 1px 0` blanco
de baja opacidad, la línea de luz superior que la guía Stellaria describe como firma de la casa). La
oclusión sitúa el elemento sobre el fondo; el rim lo despega del borde.

Es un módulo interno: no se exporta desde `src/index.ts`. Los temas oscuros lo consumen al construir su
sección `effects.shadows`, que ya es dato por tema en el contrato. No hay ampliación de `NebulaTheme`.

La mitad `native` solo lleva la oclusión: React Native no admite sombras `inset`, así que el rim se
resuelve allí con borde, no con sombra.
