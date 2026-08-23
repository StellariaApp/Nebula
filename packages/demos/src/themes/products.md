# `themes/products` — los temas que prueban el argumento

Nueve productos construidos desde **dos semillas de paleta cada uno**. Es la prueba del argumento de
Nebula: entre dos productos que no se parecen en nada, lo único que cambia es este objeto, y el
catálogo no se entera.

## `nebula` no es un producto

`ThemeOf` reconoce una entrada más, `nebula`, y **no pasa por `PRODUCT_SEEDS`**: apunta directamente a
`nebulaDark`/`nebulaLight`. La identidad de la librería la fija [ADR-020](../../../../docs/adr/) —el
eje `#3F37C9 → #9D4EDD`— y darle una semilla propia con su `wash` y su `lift` sería inventar una
identidad paralela que se separaría de la oficial en cuanto alguien retocara las semillas.

Por eso `ProductName` tiene nueve miembros y `ThemeName` tiene diez. El tipo dice cuál de las dos
cosas es cada una.

## No hay tabla de temas: se construyen de uno en uno

Existían `PRODUCTS` y `THEMES` como constantes de módulo, y eso construía los **veinte** temas al
importar este archivo — aunque quien importara solo quisiera un hex para pintar un punto de color.
`ThemeOf(name, scheme)` construye el que se pide y lo memoriza, y `BRAND_STOPS` da los swatches sin
construir ninguno, leyendo `from`/`to` de la semilla.

## `ink.floor = 1` apaga la elección de tinta, y es a propósito

`OnColor` elige tinta legible por luminancia contra `theme.ink.floor` ([ADR-021](../../../../docs/adr/ADR-021-button-color-extended-gradient-prop.md)).
Con el suelo en **1** cualquier contraste le vale, así que **la tinta se queda blanca siempre** — que
es lo que quiere un producto cuya marca es oscura.

El precio está medido (2026-08-16, `check:contrast` sobre los 18 JSON): **los nueve fallan AA**, entre
11 y 17 pares de 165. Todos son `#ffffff` sobre un relleno claro — `warning` a 1,86:1, y los siete
`variantMap.gradient · *` a 2,64:1.

Qué pasaría al subir el suelo, por si algún día se promueven:

| Temas                                     | Con suelo 4.5    |
| ----------------------------------------- | ---------------- |
| `aurora`, `nova`, `polaris`, `star`       | **0 fallos**     |
| `rosette`, `stellaria`, `cosmos`, `eclipse` | 7 — irreducible |
| `lagrange`                                | 12 — el peor     |

Ese suelo de 7 son los gradientes de marca: **no los arregla ninguna tinta**, porque el color no llega
a 4,5:1 ni con blanco ni con negro. Solo cambiaría cambiando el color.

**Se decidió dejarlo así** (2026-08-16): son temas adicionales, no contrato, y `docs/02` §3 ya declara
que el gate AA cubre solo los dos oficiales. Queda escrito para que no se vuelva a investigar desde
cero ni se confunda con nueve temas mal calibrados: es una constante, deliberada.

## Por qué `ResolveChoice` devuelve a veces un string

`setTheme` acepta un nombre oficial o un tema entero ([ADR-121](../../../../docs/adr/ADR-121-set-theme-acepta-un-tema-entero.md)),
y **las dos vías no son equivalentes**:

| Lo que se pasa   | Se persiste    | `ThemeScript` lo pinta antes del primer frame |
| ---------------- | -------------- | --------------------------------------------------- |
| `"dark"`         | sí             | sí — la clase está en el mapa que serializa         |
| un `NebulaTheme` | sólo su scheme | no — son vars inline, y las escribe el efecto       |

Así que `ResolveChoice` devuelve **el nombre** cuando la elección es la identidad de Nebula sin
retocar, que es el caso por defecto y el que ve todo el que llega al sitio: sin salto al recargar y con
la preferencia guardada. En cuanto la elección se desvía —otro producto, o `motion`/`glass`
cambiados— no hay nombre que la represente y devuelve el objeto.

`untouched` compara contra el tema base, no contra `BASE_CHOICE`: un producto podría traer su propio
`tier`, y lo que hay que detectar es si la elección lo respeta o lo pisa.

## Los dos interruptores

`motion.tier` y `effects.glass.enabled` viajan en el objeto, no en las vars CSS: son data que los
componentes leen del contexto (`docs/02` §4). Cambiarlos por aquí alcanza a `GlassSurface`, `Nav`,
`StarField`, `GradientBorder`, `AnimatedGradient`, `NoiseOverlay`, las recetas de variante que
resuelven cristal y **todo** el motion, que pasa por `utils/motion.ts`.

## `glass` no es un booleano: es cuánto cristal

Cuatro posiciones —`off · sheer · frosted · milky`— y solo la primera apaga el material
([ADR-178](../../../../docs/adr/ADR-178-el-velo-vuelve-a-ser-cristal-y-la-intensidad-es-un-eje.md)
§3). Las otras tres sustituyen la tabla `effects.glass.surface`, que es la misma forma que tienen
`corner` sobre `radius` y `density` sobre `spacing.unit`: un preset que reemplaza algo que el
contrato **ya** tiene, no una extensión del contrato.

**`frosted` no lleva tabla, y eso importa.** Es el valor del tema, así que se devuelve la del propio
tema y la elección sigue contando como intacta en `ResolveChoice` — con eso el tema viaja como clase
y no como vars en línea (ADR-163). Si `frosted` tuviera tabla propia, el defecto entraría siempre por
la vía del objeto y todo el mundo pagaría el parpadeo desde el primer render.

Lo que se mueve es el **suelo** de la rampa: `sheer` arranca en 0.32, `frosted` en 0.46 y `milky` en
0.60, y las tres rematan en el 0.90 de `strong`. `veil` queda fuera de las tres —es el escalón del
material, no de la superficie— y el desenfoque tampoco se toca: el eje dosifica velo, no blur.

El suelo se sustituye por nivel construyendo el `rgba()` desde la tinta del esquema, nunca parseando
el valor del tema. Ese parseo es lo que ADR-102 borró y ADR-118 §4 dejó prohibido.
