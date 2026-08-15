# ADR-151 — El segmento gana un peldaño `xs` que no baja el objetivo

- **Estado**: aceptada · 2026-08-15 (decisión del propietario) · **W5** · implementada
- **Cambia API pública**: sí, y **solo añade**: `"xs"` entra en `SegmentSize`. Ningún peldaño actual
  cambia de valor, y un `Segment` que no lo pida sale idéntico al de antes.
- **Matiza [ADR-047](ADR-047-segment-en-escala-desplazada.md)** sin retirarlo: el suelo de
  `sizes.control` sigue donde estaba. Lo que se descubre es que ese suelo nunca fue el problema.

## Contexto

`Segment.md` cerró W3 con una sección llamada «Por qué `size` empieza en `sm` y no en `xs`»: un
`radiogroup` o un `tablist` son objetivos táctiles, `docs/06` §4.1 veda `sizes.compact` para lo
interactivo, y por debajo de `control.xs` (28) no hay peldaño al que desplazarse. La conclusión —no
hay `xs`— era correcta para la pregunta que se hizo.

La pregunta era la equivocada. Al pedir un segmento más pequeño para la cabecera de los bloques de
código del sitio, lo que sobra no es el objetivo táctil: es **el cromado que lo rodea**. Un
`Segment sm` mide 48 px de alto, y de esos solo 28 son el tab; los otros 20 son el `padding` del
contenedor, que es constante para toda la escala.

Bajar el tab a `control.xxs` (20) habría dado el tamaño pedido y **habría incumplido WCAG 2.2 SC
2.5.8 «Target Size (Minimum)», que es nivel AA** y exige 24×24 px. La excepción de espaciado del
criterio no rescata el caso: los tabs de un segmento se tocan entre sí, así que no hay hueco que
contar. `theme-a11y-motion` declara AA estricto, de modo que ese camino estaba cerrado por
partida doble.

## Decisión

### `xs` aprieta el cromado y deja el objetivo donde está

```
             tab      padding    alto total    fuente
  xs         28         6          40 px       caption (12)
  sm         28        10          48 px       body3   (13)
```

`xs` comparte `minHeight` con `sm` —`control.xs`, el suelo de ADR-047— y se separa por lo que sí
puede encoger sin tocar a nadie: el `padding` del contenedor baja a `space.u1_5`, el radio se
recalcula sobre ese padding, el `top` del indicador lo acompaña, y la fuente baja un peldaño a
`caption`. Salen 40 px en vez de 48 —un 17% menos— con el objetivo intacto en 28 px.

**Que `xs` y `sm` midan igual de tab no es un descuido, es el punto**: el suelo táctil no es una
preferencia estética y no se negocia peldaño a peldaño. Lo que la escala ofrece por debajo de `sm`
es menos aire, no menos objetivo.

### El `top` del indicador viaja con el padding

`Segment.md` ya fijaba que el `padding` del contenedor y los insets del indicador «deben leer el
mismo token», porque el indicador se posiciona en absoluto dentro del contenedor y si se separan la
píldora deja de encajar en el hueco. `xs` hereda esa regla: mueve los dos a `u1_5` en el mismo
peldaño, nunca uno solo.

## Consecuencias

- **No rompe a nadie**: `xs` es aditivo y ningún peldaño existente cambia. `Tabs`, que es un atajo
  sobre este compound, lo hereda sin tocarse.
- **AA se mantiene sin excepción que anotar**: el objetivo sigue en 28 px en toda la escala, así que
  no hay ningún tamaño del catálogo que dependa de la excepción de espaciado de SC 2.5.8.
- **`Segment.md` se reescribe**: su sección «Por qué `size` empieza en `sm` y no en `xs`» decía lo
  contrario de lo que ahora hace el código, y era de las que se leen antes de tocar el componente.
- **Regla derivada**: cualquier peldaño futuro por debajo de `xs` encoge cromado, nunca objetivo. Si
  algún día hace falta un control realmente diminuto, no es un `Segment` — es otro componente, y no
  es interactivo.

## Alternativas descartadas

**`xs` sobre `control.xxs` (20 px).** Es lo que se pidió literalmente y lo que se implementó primero.
Falla SC 2.5.8 en AA, y el fallo es invisible en revisión visual porque el control se ve perfecto en
ratón. Es exactamente el tipo de deuda que ADR-047 se escribió para no contraer.

**Bajar el `padding` del contenedor para toda la escala** en vez de crear un peldaño. Arreglaba el
caso del sitio sin ampliar la API, pero cambia en silencio el aspecto de todos los `Segment` ya
montados, incluidos los del panel de tema y los de las apps consumidoras.

**Un `density` propio del componente**, ortogonal a `size`. Multiplica la matriz de estados a probar
por dos para un único caso de uso, y el contrato ya tiene una palanca de densidad en el tema.
