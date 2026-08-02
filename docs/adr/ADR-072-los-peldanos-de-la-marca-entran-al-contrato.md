# ADR-072 — Los peldaños de la marca entran al contrato

- **Estado**: **aceptada** · 2026-08-02 — checkpoint de B1 con el propietario
- **Resuelve**: **D3** del
  [plan de marca](../reviews/brand-alignment-plan-2026-08-02.md): cinco de las seis medidas de las
  landings en producción caen **entre** peldaños de Nebula, y por eso cada una inventó su escala.
- **Cambia**: `radius` y `sizes.control` en `@stellaria/nebula-tokens`, el ritmo vertical de
  `Section`, y **enmienda `docs/06` §4.1** retirando la relación 2:3.
- **Depende de**: [ADR-033](ADR-033-escala-de-tamanos-no-control.md) (la segunda escala) y
  [ADR-045](ADR-045-peldanos-intermedios-de-spacing.md) (tallas contra múltiplos).

## Contexto

El principio §0 del plan de marca es que **entre productos solo cambia el color**. Radio, ritmo y
alto de control no son decisiones de producto: si las tres landings difieren en ellos, es que el
sistema no los fijó y cada una rellenó el hueco a mano.

Medido contra `packages/tokens/src/tokens/layout.ts`:

| Medida             | Marca | Nebula antes                |
| ------------------ | ----- | --------------------------- |
| Radio de acción    | 9     | `radius.sm` = 8             |
| Radio de card      | 32    | `radius.xxl` = 28           |
| Alto de acción     | 48    | `control.md` 42 · `lg` 50   |
| Padding de sección | 120   | 90 en literal · `xxxl` = 64 |
| Carril             | 1180  | ✅ ya alineado (ADR-070)    |

## Decisión

### 1. Los peldaños se mueven a la marca

```
radius.sm    8 → 9      radius.xxl   28 → 32
```

La decisión es **una sola para los tres productos**. No cabe «radio 32 en Rosette y 28 en Lagrange»:
un tema cambia el color, no la geometría.

### 2. `sizes.control` se recalibra entera sobre rejilla de 8

```
antes    30  36  42  50  60      deltas  6   6   8  10
después  32  40  48  56  64      deltas  8   8   8   8
```

Mover solo `md` a 48 dejaba `lg` en 50, **2 px por encima del default**, que es tanto como no tener
`lg`. Y la escala anterior ya crecía de forma irregular. Con la rejilla de 8 el default de producto
cae en la medida de marca y los cinco peldaños quedan a distancia constante, que es lo que permite a
un tema recalibrarlos sin recalcular a mano.

### 3. `compact` no se mueve, y §4.1 retira la relación 2:3

`docs/06` §4.1 afirmaba que `compact` y `control` guardan relación 2:3 «en los cinco peldaños».
**Medido, se cumplía en tres**: `lg` daba 32/50 = 0.64 y `xl` 36/60 = 0.60. El documento describía una
regularidad que el contrato no tenía.

Con la escala nueva la relación se pierde también en `md`, así que se retira en vez de fingirla. Lo
que justifica que las dos escalas existan no es una proporción: es que **una es objetivo táctil y la
otra no** (ADR-033), y eso sigue intacto. `compact` se queda en 20/24/28/32/36.

### 4. El ritmo entre secciones lo gobierna `Section`, no `Main`

Medido sobre la landing: entre dos secciones adyacentes había **244 px** — 90 del padding inferior de
una, 64 del gap de `Main`, 90 del padding superior de la siguiente. Nadie decidió 244; es la suma de
dos mecanismos que no se hablan.

Gobierna el padding de `Section`; el gap de página deja de aportar ritmo vertical entre secciones.
El padding pasa a la escala de marca y deja de estar duplicado en literales entre `Section` y `Hero`.

## Alternativas

**Snapear la marca a las escalas** —que las landings usaran 28, 8 y `control.lg`—. Descartada por §0:
si el sistema no tiene el peldaño que la marca necesita, el hueco sigue ahí y la siguiente landing lo
vuelve a rellenar a mano. Era la opción de riesgo cero para el catálogo y de riesgo máximo para el
propósito de la fase.

**Mover solo lo que se ve** (radio de card y alto de acción, dejando `radius.sm`). Descartada porque
deja D3 resuelto a medias, y el propio plan avisa de que a medias es exactamente el estado del que se
partía.

**Mover `compact` en paralelo** para conservar el 2:3. Descartada: no arreglaba `lg` ni `xl`, que ya
estaban fuera, y movía una segunda escala del contrato —Badge, Tag, Indicator— que no tenía ningún
problema.

## Consecuencias

- **Toca los 158 componentes y ningún gate lo detecta.** `size-limit` no ve un peldaño mal elegido y
  las suites de a11y tampoco. Lo detecta el ojo, y por eso **B6 es el cierre**: reconstruir las tres
  landings con una sola composición y tres temas es la única verificación que vale.

- **Un control `md` pasa de 42 a 48 px.** Es el default de producto, así que las densidades de todo el
  catálogo se desplazan. Lo que era `md` en una tabla densa probablemente quiera `sm` (40) a partir de
  ahora; esa relectura es parte del trabajo, no un efecto colateral.

- **El objetivo táctil mejora en toda la escala.** `control.xs` sube de 30 a 32 y el mínimo de WCAG 2.2
  (24 px CSS) queda más holgado en los componentes que derivan su altura de la escala desplazada un
  peldaño, como `Pagination`.

- **`docs/06` §4.1 pierde una regla y no la sustituye por otra.** No hace falta: la separación entre
  las dos escalas ya está justificada por el objetivo táctil, que es un criterio verificable, y no por
  una proporción, que era decorativa.
