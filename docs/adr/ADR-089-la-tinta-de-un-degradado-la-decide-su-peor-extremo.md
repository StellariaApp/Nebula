# ADR-089 — La tinta de un degradado la decide su peor extremo

- **Estado**: **aceptada** · 2026-08-04 — a petición del propietario, al ver texto negro sobre el
  degradado indigo→cyan de un producto
- **Enmienda**: [ADR-085](ADR-085-cada-escala-lleva-su-propia-tinta.md), que dejó la tinta del
  degradado en `text.onPrimary` sin definir de dónde salía ese valor.
- **Añade**: `ink?: "light" | "dark"` a `GradientToken`.

## Contexto

Un botón `variant="gradient"` sobre un degradado indigo→cyan salía con letra negra. Dos fallos
distintos, con la misma raíz.

**1. La tinta no miraba el fondo que tenía debajo.** `ResolveScale` usa `vars.color.ink[escala]` solo
cuando el fondo empieza por `scale.`; un degradado no, así que cae en `text.onPrimary`. Y
`text.onPrimary` se derivaba de `OnColor(primary[500])` — el relleno _plano_ de la marca. Si el `500`
de esa paleta es claro, la tinta sale oscura y se pinta sobre un degradado que puede no tener nada
que ver con él. En la práctica `text.onPrimary` **solo** la consume la variante `gradient`, así que
estaba derivándose del sitio equivocado.

**2. Cuando sí miraba el degradado, miraba un solo extremo.** La rama de gradiente de `OnFill` tomaba
`stops[0]`. Pero el texto se apoya en **todo** el recorrido: en un cyan→indigo, el primer stop es
claro y pide tinta oscura, que luego queda ilegible sobre el extremo profundo.

## Decisión

### 1. `text.onPrimary` sale del degradado que la usa

Se deriva de `variantMap.gradient.background`, no de `filled`. Es el único sitio que la consume.

### 2. Sin declarar, manda el peor extremo

`WorstInk` elige la tinta que **maximiza el contraste mínimo** sobre todos los stops. Es la única
política honesta para una superficie que cambia de color bajo la misma línea de texto, y es
autoexplicativa: la letra tiene que leerse en el punto más difícil, no en el más fácil.

Medido, no cambia ninguna tinta de los temas oficiales: `light` y `dark` siguen en blanca (4.53
mínimo contra 4.33 de la oscura) y `playful` en oscura — su degradado de variante es cyan→lima, donde
la blanca daría **1.76:1**.

### 3. El autor puede declararlo, como en `orange`

`GradientToken` gana `ink?: "light" | "dark"`, que gana sobre el cálculo. Es el mismo mecanismo que
[ADR-085 §3](ADR-085-cada-escala-lleva-su-propia-tinta.md) dio a `SeedSpec` para que `orange`
conservara letra blanca: hay degradados donde la decisión es de **identidad de marca** y no de
luminancia, y esos se revisan mirando la lámina.

Los tres productos del banco de pruebas lo declaran `light`. Es un intercambio explícito: en un
indigo→cyan la blanca cae a **2.21:1** contra el extremo cyan, por debajo de AA. Igual que con
`orange`, la prop existe precisamente para que esa decisión sea visible en el tema en vez de quedar
escondida en un cálculo.

## Consecuencias

- Gate de contraste en verde, 116 pares, 5 temas. `web` compila y typechequea; 18 tests de tema.
- Ninguna tinta de tema oficial cambia: el arreglo corrige la **fuente**, no el resultado, salvo donde
  el degradado y el `primary` plano discrepaban.
- `ink.ts` exporta `INK_LIGHT`, `INK_DARK`, `Contrast` y `WorstInk`. Sigue sin dependencias.
- **Queda un hueco conocido**: `tools/contrast-check/src/pairs.ts` también muestrea `stops[0]` para
  evaluar un fondo de degradado, así que valida el extremo fácil y deja pasar el difícil. Cerrarlo
  volvería el gate más estricto y hay que medir qué tumba antes de hacerlo — se anota como hallazgo
  de WN.
