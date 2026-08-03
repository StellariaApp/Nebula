# Section

Una banda de la página con su contenido en un carril centrado. Es la pieza con la que alterna `Hero`
en una landing, y comparte su anatomía a propósito.

## Banda fuera, carril dentro

La raíz ocupa el ancho completo; el contenido cuelga de un `div` interior que lleva el `max-width`.
El reparto no es arbitrario:

|                 | se queda                                                                         |
| --------------- | -------------------------------------------------------------------------------- |
| la banda (raíz) | `padding-block`, `min-height`, el cristal, el `id` y el rol de región            |
| el carril       | `max-width`, `margin-inline`, `padding-inline`, la columna con `gap`, el divisor |

El `padding-inline` va en el carril y no en la banda, y eso es lo que conserva la geometría: el
contenido sigue midiendo `contentWidth` menos los dos padrones. Si el padrón viviera en la banda, el
carril se aplicaría por fuera y el contenido saldría más ancho.

El divisor de `divided` también vive en el carril, para que una sección dividida no cruce una línea
de lado a lado de la pantalla.

**Consecuencia a tener presente**: un `bg` por style props pinta la banda entera, no el carril. Es lo
que significa una sección —una franja de la página—, pero conviene saberlo antes de usarlo.

## `glass` — la banda intercalada

Enciende la receta `band`, el peldaño más bajo del cristal (ADR-082): fondo al 2 % en dark, filo
arriba y abajo, y 1 px de desenfoque. Está por debajo del botón y del chrome a propósito; lo que hace
legible una franja de 1400 px no es el desenfoque sino su filo.

Se usa **alternando**, no en todas las secciones:

```tsx
<Numbers />              {/* lisa   */}
<Capabilities glass />   {/* banda  */}
<Pricing />              {/* lisa   */}
<Security glass />       {/* banda  */}
```

Encenderlas todas devuelve un fondo uniforme con líneas cada tanto, que es justo lo contrario del
efecto: lo que separa las regiones es el contraste entre una banda y la siguiente.

## `reveal` arma cambiando el tipo de elemento

`Section reveal` aplica `useReveal` sobre su propio `<section>`, sin nodo intermedio. El detalle que
importa está en `Reveal.md`: sin armar se rinde el tag liso y al armar el de motion, porque es la
única forma de que el estado oculto llegue a pintarse.

## `order` y el nombre de la región

`title` nombra la región por `aria-labelledby`; sin título, `aria-label`. `order` elige el nivel del
encabezado (`h2` por defecto) sin tocar su tamaño: el nivel es estructura y el tamaño es `fz`.
