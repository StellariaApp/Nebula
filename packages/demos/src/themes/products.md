# `themes/products` — los temas que prueban el argumento

Ocho productos construidos desde **dos semillas de paleta cada uno**. Es la prueba del argumento de
Nebula: entre dos productos que no se parecen en nada, lo único que cambia es este objeto, y el
catálogo no se entera.

## `nebula` no es un producto

`THEMES` añade una novena entrada, `nebula`, y **no pasa por `PRODUCT_SEEDS`**: apunta directamente a
`nebulaDark`/`nebulaLight`. La identidad de la librería la fija [ADR-020](../../../../docs/adr/) —el
eje `#3F37C9 → #9D4EDD`— y darle una semilla propia con su `wash` y su `lift` sería inventar una
identidad paralela que se separaría de la oficial en cuanto alguien retocara las semillas.

Por eso `ProductName` sigue teniendo ocho miembros y `ThemeName` tiene nueve. El tipo dice cuál de las
dos cosas es cada una.

## Por qué `ResolveChoice` devuelve a veces un string

`setTheme` acepta un nombre oficial o un tema entero ([ADR-121](../../../../docs/adr/ADR-121-set-theme-acepta-un-tema-entero.md)),
y **las dos vías no son equivalentes**:

| Lo que se pasa | Se persiste | `ColorSchemeScript` lo pinta antes del primer frame |
| -------------- | ----------- | --------------------------------------------------- |
| `"dark"`       | sí          | sí — la clase está en el mapa que serializa          |
| un `NebulaTheme` | sólo su scheme | no — son vars inline, y las escribe el efecto    |

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
