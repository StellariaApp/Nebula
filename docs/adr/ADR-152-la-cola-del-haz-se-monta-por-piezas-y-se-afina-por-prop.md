# ADR-152 — La cola del haz se monta por piezas y se afina por prop

- **Estado**: aceptada · 2026-08-15 (decisión del propietario) · **W5** · implementada
- **Cambia API pública**: sí, y **solo añade**: `trail` en `GradientBorder` y el tipo
  `GradientBorderTrail`. Ninguna prop actual cambia de tipo ni de significado.
- Reescribe las tripas del **haz** y su sección en `GradientBorder.md`. El anillo estático —la máscara
  compuesta y sus dos degradaciones— no se toca.

## Contexto

El haz de `GradientBorder` se rehízo dos veces en la misma sesión y las dos primeras fallaron por el
mismo malentendido: tratar «una luz que recorre el marco» como **un objeto** que se mueve.

1. **Arco cónico girando** (el original). Barría ángulo, no perímetro. En una card de 476×82 la luz
   recorría el borde superior de `x = -h/2` a `x = +h/2` —una fracción `h/w` del lado—, así que
   iluminaba el 12% central y cruzaba el resto de golpe.
2. **Una estela recta sobre `offset-path`**. Corrige el recorrido, y descubre el problema siguiente:
   `offset-rotate` orienta el **ancla**, no deforma la caja. Una estela de 121px es un rectángulo
   rígido, y donde el trazado curva sus extremos siguen rectos. En una esquina de radio `r`, un
   segmento de largo `L` se desvía `r − sqrt(r² − (L/2)²)` de la banda del anillo, y lo que se sale lo
   recorta la máscara. Medido con `r: 20`: por encima de ~13px de largo el recorte ya se ve.

De ahí el síntoma que se reportó y que ninguna de las dos versiones podía arreglar: la luz «se
acortaba» en los lados cortos y «saltaba» al doblar. No era un desajuste de sincronía. Era que **la
estela no cabía en la curva**.

## Decisión

### La cola es un reparto, no un objeto

Lo que recorre el marco son `parts` piezas cortas escalonadas sobre el mismo trazado. Cada una es
bastante corta para que su desviación en la esquina quede en el orden del grosor del anillo, y la
longitud de la cola la da la **separación entre piezas**, no el tamaño de ninguna.

El escalón se mide en **fracción de vuelta** y no en píxeles, porque en CSS una duración no se deriva
de una longitud: la cola mide entonces `parts * gap` del perímetro y crece con el marco, que es lo
que ya hacía la estela proporcional.

El perfil de luz —`transparent 0%, from 36%, to 64%, transparent 100%`— pasa de vivir **dentro** de la
estela a vivir **entre** las piezas: `ARC_RISE` y `ARC_FALL` los leen los dos montajes, de modo que un
`edges` parcial y la vuelta entera se ven como el mismo efecto y no como dos componentes.

### Los tres ejes se exponen por separado, en un objeto

```ts
interface GradientBorderTrail {
  parts?: number;  // resolución del gradiente
  gap?: number;    // longitud, en fracción de vuelta
  bloom?: number;  // desenfoque del conjunto, en px
}
```

Van juntos en un objeto y no sueltos en la raíz porque los tres solo aplican con `beam`, y la raíz ya
lleva ocho props. Van **separados entre sí** porque confundir resolución con longitud es justo el
error que se cometió afinándolo: alargar la cola subiendo el tamaño de las piezas la vuelve tosca;
alargarla subiendo `gap` sin subir `parts` la deja rala. Un solo peldaño `"soft" | "base" | "sharp"`
habría impedido corregir un eje sin mover los otros.

`trail` se lee **solo** cuando el haz da la vuelta entera. Un subconjunto de `edges` o `sequence:
"spaced"` usa una estela por lado, que no es una cola y no tiene nada que afinar.

### El desenfoque va en el contenedor

`filter` se aplica **antes** que `mask`, así que un blur en el contenedor funde las piezas entre sí y
la máscara del anillo recorta después. Pieza a pieza cada una se difuminaría por su cuenta y el
troceado seguiría leyéndose.

### La banda del haz es la del anillo, y no puede ser otra

La máscara solo pinta dentro de la caja, así que ensanchar la banda del haz **solo puede crecer hacia
dentro**. Un haz más grueso que su borde es, por construcción, un haz metido en el relleno. Se probó
con `ringWidth * 2` y el resultado fue exactamente eso. Quien quiera un haz más grueso sube `width`,
que engorda el borde entero.

Corolario: **no hay halo posible con esta arquitectura**. Todo lo que pinta el haz —el `drop-shadow`
de las piezas incluido— está recortado a la banda. Un derrame hacia fuera exige una segunda capa sin
máscara, y eso es duplicar las piezas.

## Consecuencias

- **No rompe a nadie**: `trail` es opcional y sus defaults son los valores con los que se calibró.
- **Coste en nodos, y es la parte a vigilar**: la vuelta entera monta `parts` elementos por marco. El
  guardrail de `GradientBorder` ya decía «un anillo por región, no uno por fila de una lista»
  (`docs/06` §6); con la cola esa regla deja de ser estética y pasa a ser de presupuesto.
- **`parts` lleva suelo**: por debajo de 2 no hay rampa que repartir, y en `0` o negativo el haz
  desaparecería sin error — el fallo silencioso que el suelo evita.
- **Los subconjuntos siguen con estela y sus dos límites**: ignoran el radio en el reparto y dan el
  mismo tiempo a lados de distinta longitud. Está escrito en el `.md`.

## Alternativas descartadas

**Una sola estela más corta**, que sí cabe en la curva. Es lo que se probó: por debajo de ~13px queda
demasiado tenue para leerse como luz, y el efecto desaparece.

**Una sola estela larga**, aceptando el recorte en las esquinas. También se probó. Es lo que producía
el salto reportado.

**Volver al cónico**, que sigue la curva por construcción. Su barrido es angular, y eso es lo que
rompía el recorrido en cuanto el marco dejaba de ser cuadrado.
