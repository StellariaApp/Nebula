# Capa de motion compartida

Dos módulos, una decisión (ADR-034): **ningún componente vuelve a escribir a mano una duración, una curva o el bloque de reduced-motion**. `styles/motion.css.ts` gobierna lo que transiciona por CSS; `utils/motion.ts` gobierna lo que anima `motion/react`.

## Por qué las transiciones se componen de `vars`, no del token

`tokens/animation.ts` publica `transition.interaction`, `.layout` y `.overlay` como cadenas ya resueltas (`transform 120ms cubic-bezier(…)`). Usarlas tal cual congelaría duración y curva en el bundle: un tema que recalibre `motion.duration` dejaría de repintar, que es exactamente la fuga que `docs/02` prohíbe. Las composiciones de aquí llevan los mismos nombres y la misma semántica, pero apuntan a `vars.motion.*`, de modo que siguen siendo tematizables por CSS.

## Las cuatro composiciones

| Nombre        | Propiedades                                                                   | Tiempo                | Para qué                                                      |
| ------------- | ----------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------- |
| `interaction` | `background, border-color, color, text-decoration-color, box-shadow, opacity` | `fast` · `standard`   | realimentación de superficie: hover, press, foco, disabled    |
| `layout`      | `transform, opacity`                                                          | `base` · `decelerate` | lo que se mueve o escala **por CSS**                          |
| `overlay`     | `opacity, transform`                                                          | `base` · `standard`   | pseudo-elementos que no puede tocar motion, como `::backdrop` |
| `value`       | `width, stroke-dashoffset`                                                    | `base` · `standard`   | barras y anillos de progreso                                  |

Listar de más es gratis: `transition-property` no genera trabajo para una propiedad que no cambia. Es lo que permite que once de los diecisiete usos del catálogo colapsen en `interaction` sin listas por componente.

**`interaction` no incluye `transform` a propósito.** Los componentes que escalan al pulsar lo hacen con `motion`, que escribe `transform` en el estilo inline fotograma a fotograma; una transición CSS sobre `transform` competiría con esa escritura y produciría un arrastre visible. Lo que se mueva por CSS usa `layout`, y esos nodos nunca son `m.*`.

## El idioma único de reduced-motion

`still` es el par `transitionProperty: "none"` + `animationName: "none"`; `reducedMotion` lo envuelve en su media query para spread directo, y `reducedMedia` expone la condición para los casos que hay que anidar bajo `selectors`.

Se retira `transitionDuration: "0.01ms"`, que era un truco para forzar el disparo de `transitionend` y que aquí nadie necesitaba.

**No es automático**: se declara componente a componente. Una animación que comunica que el sistema sigue trabajando —el giro de `Loader`— no debe congelarse, porque un spinner detenido dice lo contrario de lo que quiere decir. `docs/03` §2 pide colapsar a fades cortos «o nada», no apagar la señal de progreso.

## La física por superficie

`SurfaceTransition(surface, phase, context)` es la única puerta. La entrada es la del ADR:

| Superficie     | Entrada          |
| -------------- | ---------------- |
| Tooltip        | tween `fast`     |
| Popover · Menu | `spring.snappy`  |
| Modal · Drawer | `spring.default` |
| Toast          | `spring.gentle`  |

**La salida es siempre un tween acelerado**, a dos tercios de la duración de referencia. El ADR lo fija explícitamente para Popover, Menu, Modal y Drawer, y lo deja implícito para Toast; se completa igual porque la regla 2 está escrita como invariante —«una salida nunca dura más que su entrada»— y un spring no tiene duración con la que cumplirla. Para las entradas por spring la referencia es `duration.base`; para Tooltip, su propia `duration.fast`, lo que deja la salida en 80 ms y estrena `duration.instant` en la escala.

## `ease` no acepta la cadena del tema

`motion/react` admite un nombre de curva, una tupla de cuatro números o una función, pero **no** una cadena `cubic-bezier(...)` de CSS. `ToBezier` la traduce a la tupla. Si un tema publica una curva no parseable —`ease-in-out`, por ejemplo— la función devuelve `undefined` y el tween sale con la curva por defecto de motion en vez de romper.

## Stagger con tope

`Stagger` devuelve el paso en segundos, derivado de `duration.instant`. `StaggerDelay(index)` lo multiplica por el índice **acotado a 8**: a partir del noveno elemento el retardo deja de crecer, de modo que una lista larga no encadena una espera perceptible en su último item. Ambos devuelven 0 con `prefers-reduced-motion` o con `motion.tier: "minimal"`, lo que anula la orquestación entera sin ramas en el componente.
