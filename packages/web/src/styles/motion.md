# Capa de motion compartida

Dos módulos, una decisión (ADR-034): **ningún componente vuelve a escribir a mano una duración, una curva o el bloque de reduced-motion**. `styles/motion.css.ts` gobierna lo que transiciona por CSS; `utils/motion.ts` gobierna lo que anima `motion/react`.

## Por qué las transiciones se componen de `vars`, no del token

`tokens/animation.ts` publica `transition.interaction`, `.layout` y `.overlay` como cadenas ya resueltas (`transform 120ms cubic-bezier(…)`). Usarlas tal cual congelaría duración y curva en el bundle: un tema que recalibre `motion.duration` dejaría de repintar, que es exactamente la fuga que `docs/02` prohíbe. Las composiciones de aquí llevan los mismos nombres y la misma semántica, pero apuntan a `vars.motion.*`, de modo que siguen siendo tematizables por CSS.

## Las cinco composiciones

| Nombre        | Propiedades                                                                   | Tiempo                | Para qué                                                        |
| ------------- | ----------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------- |
| `interaction` | `background, border-color, color, text-decoration-color, box-shadow, opacity` | `fast` · `standard`   | realimentación de superficie: hover, press, foco, disabled      |
| `layout`      | `transform, opacity`                                                          | `base` · `decelerate` | lo que se mueve o escala **por CSS**                            |
| `overlay`     | `opacity, transform`                                                          | `base` · `standard`   | pseudo-elementos que no puede tocar motion, como `::backdrop`   |
| `confirm`     | `opacity, transform`                                                          | `base` · `emphasized` | confirmación de estado: la marca de Checkbox, el punto de Radio |
| `value`       | `width, stroke-dashoffset`                                                    | `base` · `decelerate` | barras y anillos de progreso                                    |

Listar de más es gratis: `transition-property` no genera trabajo para una propiedad que no cambia. Es lo que permite que once de los diecisiete usos del catálogo colapsen en `interaction` sin listas por componente.

**`interaction` no incluye `transform` a propósito.** Los componentes que escalan al pulsar lo hacen con `motion`, que escribe `transform` en el estilo inline fotograma a fotograma; una transición CSS sobre `transform` competiría con esa escritura y produciría un arrastre visible. Lo que se mueva por CSS usa `layout`, y esos nodos nunca son `m.*`.

## El idioma único de reduced-motion

`still` es el par `transitionProperty: "none"` + `animationName: "none"`; `reducedMotion` lo envuelve en su media query para spread directo, y `reducedMedia` expone la condición para los casos que hay que anidar bajo `selectors`.

Se retira `transitionDuration: "0.01ms"`, que era un truco para forzar el disparo de `transitionend` y que aquí nadie necesitaba.

**No es automático**: se declara componente a componente, y en los que animan por keyframes se **compone con su sustituto estático**. Congelar un spinner a media vuelta diría lo contrario de lo que quiere decir, así que `Loader` apaga la animación y a cambio fija un aspecto estable (`borderTopColor: currentColor`, opacidad reducida); `Skeleton` apaga el barrido y retira su gradiente; `Progress` indeterminado se queda al 100 % de ancho en vez de a medias. Se escriben como `{ ...motion.still, …el sustituto }`.

## La física por superficie

`SurfaceTransition(surface, phase, context)` es la única puerta. La entrada es la del ADR:

| Superficie     | Entrada          |
| -------------- | ---------------- |
| Tooltip        | tween `fast`     |
| Popover · Menu | `spring.snappy`  |
| Modal · Drawer | `spring.default` |
| Toast          | `spring.gentle`  |

### `surface` y `preset` son dos props, no una

El ADR dice que «el `preset` de `OverlayMotion` deja de gobernar solo la transformada y pasa a gobernar también la física». Colapsarlos no es posible: `Modal` necesita **transformadas distintas para la misma física** —centrado escala, `drawer-bottom` desliza hacia arriba, pantalla completa funde—, y todas ellas son la física de un modal. Así que `surface` gobierna la física y `preset` la transformada, y `Modal` es el único que las combina: elige la transformada por su layout y la superficie según sea drawer o no.

**La salida es siempre un tween acelerado**, a dos tercios de la duración de referencia. El ADR lo fija explícitamente para Popover, Menu, Modal y Drawer, y lo deja implícito para Toast; se completa igual porque la regla 2 está escrita como invariante —«una salida nunca dura más que su entrada»— y un spring no tiene duración con la que cumplirla. Para las entradas por spring la referencia es `duration.base`; para Tooltip, su propia `duration.fast`, lo que deja la salida en 80 ms y estrena `duration.instant` en la escala.

## `ease` no acepta la cadena del tema

`motion/react` admite un nombre de curva, una tupla de cuatro números o una función, pero **no** una cadena `cubic-bezier(...)` de CSS. `ToBezier` la traduce a la tupla. Si un tema publica una curva no parseable —`ease-in-out`, por ejemplo— la función devuelve `undefined` y el tween sale con la curva por defecto de motion en vez de romper.

## `emphasized` solo confirma

`confirm` es la única composición con la curva de rebase, y su sitio es la aparición del indicador que dice «tu acción se registró»: la marca del Checkbox y el punto del Radio. **No se usa en hover ni en transiciones de color** —ahí el rebase se lee como imprecisión, no como respuesta—, y por eso `interaction` sigue en `standard`.

Las dos aparecían escritas con la forma abreviada `transition: "…"` en vez de las tres propiedades largas, así que sobrevivieron al primer barrido de la migración; las encontró leer el código, no el grep.

## Stagger con tope

`Stagger` devuelve el paso en segundos, derivado de `duration.instant`. `StaggerDelay(index)` lo multiplica por el índice **acotado a 8**: a partir del noveno elemento el retardo deja de crecer, de modo que una lista larga no encadena una espera perceptible en su último item. Ambos devuelven 0 con `prefers-reduced-motion` o con `motion.tier: "minimal"`, lo que anula la orquestación entera sin ramas en el componente.

Lo consumen las dos colecciones que aparecen como unidad dentro de un overlay: `collections/option-list.tsx` —Select, Combobox y MultiSelect— y `Menu/MenuList.tsx`. El retardo va **por item** y no con `staggerChildren`, porque el tope de la regla 8 no se puede expresar con `staggerChildren`: esa prop reparte linealmente y no admite techo.

Los items pasan a ser `m.li`, con el mismo cast en la frontera con React Aria que ya usan los botones: los props del hook son `DOMAttributes` y motion los tipa aparte por diseño. Al filtrar en Combobox solo montan los items nuevos, así que la orquestación se repite únicamente sobre lo que cambia.
