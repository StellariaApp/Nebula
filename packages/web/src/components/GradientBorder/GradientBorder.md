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

En su lugar cada lado es un `<span>` que **recorre el marco** con `offset-path: border-box`, animando
`offset-distance`. El contenedor lleva la misma máscara de anillo que el `::before`, así que la estela
solo se ve en la banda del borde; `offset-rotate: auto` la orienta con la tangente, de modo que sigue
la curva del radio en las esquinas en vez de cortarse en seco.

Cada `<span>` corre dos animaciones a la vez: el **barrido**, que va del principio al final de su lado
y dura `slot`; y la **compuerta**, que lo enciende durante su turno y dura el ciclo. Los dos ejes
viajan como nombre de keyframe en una var en línea en vez de como clases combinadas: las 16
combinaciones de lado × turno eran 16 módulos de vanilla-extract, y esos tienen efecto, así que no se
sacuden del barrel y engordaban el presupuesto de cualquiera que importara del índice.

`offset-distance` no es `transform` ni `opacity`, y `docs/03` §2 solo admite esos dos. Cumple igual:
el navegador lo resuelve **a una transformada** sobre la estela ya rasterizada —es la misma traslación
más rotación que escribiríamos a mano— y no refluye ni repinta nada del marco. Lo que `docs/03`
prohíbe es animar propiedades que disparan layout o paint por frame; esta no es una de ellas.

### Por qué ya no es una rotación cónica

La primera versión daba a cada lado un `<span>` sobredimensionado con un arco en cónico que **giraba**
90° dentro de su cuadrante. Esa geometría solo es correcta en un cuadrado, y no por un margen
pequeño: la luz recorre el borde superior de `x = -h/2` a `x = +h/2`, o sea **una fracción `h/w` del
lado**. A 16:9 ilumina el 56% del borde y jamás llega a los vértices; en una card de 8:1 —las tiras
de la landing— ilumina el 12% y cruza el resto de golpe, que en pantalla se lee como un pegote quieto
en el centro y un fogonazo después. El barrido angular no es el barrido del perímetro salvo en 1:1.

`offset-distance` recorre longitud, no ángulo, así que el problema desaparece en cualquier
proporción, y de paso la velocidad de la luz deja de depender de en qué punto del lado esté.

### Los tramos se miden en unidades de contenedor

El contenedor del haz lleva `container-type: size`, y los cuatro tramos se escriben sumando `100cqw` y
`100cqh`: el lado 1 va de `0` a `100cqw`, el 2 de `100cqw` a `100cqw + 100cqh`, y así. Sin eso no hay
forma de decir «hasta el final del borde superior» en CSS, porque `offset-distance` en porcentaje se
mide contra el recorrido completo y las cuatro fracciones dependen de la proporción de la caja.

La suma trata el marco como un rectángulo recto e **ignora el radio**: el perímetro real de un
rectángulo redondeado es algo más corto —unos `0.86r` por esquina— así que el reparto se pasa de
largo en esa cantidad y cada lado empieza unos píxeles después del vértice. Con los radios del
contrato sobre cajas de tamaño normal es un desfase de un dígito porcentual, y el recorrido es
cerrado, así que el sobrante da la vuelta en lugar de acumularse.

### Las tres paradas

`prefers-reduced-motion`, `motion.tier: "minimal"` y `edges={[]}` dejan el marco **estático**, no roto:
las capas no se montan (o no animan) y queda el anillo de siempre. Igual que en `StarField`, el tier se
decide en JS y el media query en CSS.

Las capas son `aria-hidden` y `pointer-events: none`, y las dos degradaciones del anillo —sin
`mask-composite` y en `forced-colors`— también las apagan.
