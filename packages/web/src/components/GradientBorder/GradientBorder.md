# GradientBorder

## Por qué `mask-composite` y no dos capas

La alternativa obvia —un contenedor con el gradiente de fondo y un hijo con la superficie encima— es
más simple y se descarta por una razón concreta: obliga a que el interior sea **opaco**. Un anillo de
gradiente alrededor de una card translúcida, de un `GlassSurface` o de un fondo con imagen quedaría
tapado por el relleno del hijo.

El anillo se recorta con dos máscaras compuestas sobre un `::before`:

```
mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
mask-composite: exclude;
```

La primera máscara cubre solo la caja de contenido, la segunda la caja entera; `exclude` deja
justamente el `padding`, que es el grosor del anillo. El interior queda transparente de verdad, y por
eso `surface` es opcional y su default es `"none"`.

`-webkit-mask` y `-webkit-mask-composite: xor` acompañan a las propiedades sin prefijo por Safari; son
la misma operación con otro nombre (`xor` ≡ `exclude` para dos capas opacas).

## Las dos degradaciones

1. **Sin `mask-composite`** — `@supports not ((mask-composite: exclude) or (-webkit-mask-composite:
xor))` oculta el `::before` y pone un `border: 1px solid` con el **primer stop** del gradiente
   (`ResolveGradientEdge`). Sin esa rama el `::before` pintaría un rectángulo de gradiente macizo
   encima de todo, que es peor que no tener anillo.
2. **Forced colors** — mismo camino con `CanvasText`. El sistema no repinta un `background` de
   gradiente, así que el anillo tiene que volver a ser un borde real para existir en alto contraste.

## `z-index: -1` en el `::before`

El anillo es hermano del contenido en el orden de pintado, no un fondo. Con `z-index: auto` se pintaría
encima del texto del hijo; con `-1` cae debajo del contenido y encima del fondo del contexto de
apilamiento, que el `isolation: isolate` de la raíz garantiza que sea el propio componente.

## `width` es un número, no un token

No hay escala de grosores de borde en `NebulaTheme` —los componentes usan 1 px— y este es el único
sitio del catálogo donde un anillo de 2–3 px tiene sentido visual. Se expone como número en px en vez
de inventar un token que ningún otro componente consumiría.

## `beam` — el arco que orbita el marco

Trae la maqueta de producto de Rosette (`.product-preview::before` en su `globals.css`): un arco de
luz que recorre el marco mientras el resto del borde se queda quieto.

**Con `beam` el anillo estático deja de ser el gradiente y pasa a `border.default`.** Es la parte que
más se nota si se omite: con el anillo entero teñido de marca, el arco no se lee como luz viajando
sino como un neón con halo alrededor de todo el marco. El gradiente sigue mandando, pero solo en el
arco.

### Los lados se eligen, y son cuatro

`edges` toma los lados por número en sentido horario —**1 arriba, 2 derecha, 3 abajo, 4 izquierda**— y
por defecto van los cuatro. El orden de la prop no importa: `edges={[3, 1]}` y `edges={[1, 3]}` dan lo
mismo, porque la secuencia la marca el recorrido del marco, no el orden en que se escriban.

### `sequence`: qué pasa con los lados que no están

|                            | recorrido                                                                 | ciclo con N lados |
| -------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `continuous` (por defecto) | al acabar un lado la luz salta al siguiente **elegido**                   | `slot × N`        |
| `spaced`                   | cada lado espera su turno del marco completo; los que faltan son silencio | `slot × 4`        |

`slot` es constante —`duration.expressive × 3.25`, ≈1.37 s— y ese es el punto: **la luz recorre un
lado a la misma velocidad se elijan los que se elijan**. Un ciclo fijo repartido entre los lados haría
que con dos lados la luz fuera al doble de lento, que se lee como otro efecto, no como el mismo con
menos lados. Con los cuatro y `continuous` el ciclo son 5.46 s, que es la órbita de 5.5 s de la
referencia.

### Cómo está montado, y por qué no con `@property`

La forma directa sería animar el ángulo de un `conic-gradient` con `@property --angle`, que es como lo
hace la referencia. No se usa: vanilla-extract no emite `@property`, y registrarlo desde JS con
`CSS.registerProperty` dejaría el primer pintado sin animación hasta que corriera el cliente.

En su lugar cada lado es un `<span>` sobredimensionado (`inset: -100%`) con el arco en cónico, que
**gira**. Una rotación es interpolable en cualquier navegador sin registrar nada. El contenedor lleva
la misma máscara de anillo que el `::before`, así que el arco solo se ve en la banda del borde y sigue
la curva del radio.

Cada `<span>` corre dos animaciones a la vez: el **barrido**, que gira 90° dentro del cuadrante de su
lado y dura `slot`; y la **compuerta**, que lo enciende durante su turno y dura el ciclo. Los dos ejes
viajan como nombre de keyframe en una var en línea en vez de como clases combinadas: las 16
combinaciones de lado × turno eran 16 módulos de vanilla-extract, y esos tienen efecto, así que no se
sacuden del barrel y engordaban el presupuesto de cualquiera que importara del índice.

### El reparto en cuadrantes es exacto en un cuadrado

Cada lado ocupa 90° del cónico. En un marco cuadrado eso cae justo en las esquinas; en uno muy
apaisado la luz cambia de lado un poco antes o después del vértice. Para la maqueta de producto —de
1:1 a 16:9— no se aprecia. El `inset: -100%` cubre la rotación hasta proporciones de 1:3.

### Las tres paradas

`prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco **estático**, no roto:
las capas no se montan (o no animan) y queda el anillo de siempre. Igual que en `StarField`, el tier se
decide en JS y el media query en CSS.

Las capas son `aria-hidden` y `pointer-events: none`, y las dos degradaciones del anillo —sin
`mask-composite` y en `forced-colors`— también las apagan.
