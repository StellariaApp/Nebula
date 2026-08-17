# ADR-162 — El peldaño más pequeño de `control` sube al mínimo táctil

- **Estado**: **aceptada** · 2026-08-17 — decisión del propietario sobre §2 de las
  [decisiones pendientes](../reviews/decisiones-pendientes-2026-08-17.md).
- **Resuelve**: tres hallazgos de la [auditoría visual](../reviews/auditoria-visual-2026-08-17.md) que
  resultaron ser **el mismo hueco**.
- **Enmienda**: `sizes.control.xxs` de `@stellaria/nebula-tokens`, y la frase de `docs/06` §4 que
  declaraba ese peldaño inalcanzable.
- **No cambia el contrato**: `SizeName` conserva sus siete miembros y `Size` sus cinco. **Ningún tema
  deja de validar.**

## Contexto

### Tres defectos, un solo hueco

| Hallazgo    | Qué pasa                                                                              |
| ----------- | ------------------------------------------------------------------------------------- |
| `Tag`       | tras bajar su cierre a `xs` (28) le quedan **+2 px** de desborde sobre un padre de 28 |
| `DataGrid`  | un elemento declara **24** y aloja un hijo de **28**                                  |
| `ThemeIcon` | declara **26**, que no existe en ninguna de las dos escalas                           |

Los tres piden lo mismo: **un control de 24 px**. Hoy `control` va **20 → 28** y `compact` **28 → 32**,
así que entre 20 y 28 no hay nada.

`docs/06` §4 anticipa el caso con precisión: «si una altura no cabe en ninguna de las dos escalas, la
discusión es **qué peldaño falta**, no qué `rem` escribir».

### El peldaño ya existe — y está mal puesto

`control.xxs` vale **20**, y `docs/06` §4 tiene que explicar por qué es inservible:

> `xxs` (20) **no es alcanzable desde ninguna prop** — está por debajo del mínimo táctil y existe para
> composición interna y alturas no interactivas.

Es decir: **el peldaño está ahí, y la única razón de que no se use es que 20 < 24**, el mínimo de
WCAG 2.2 SC 2.5.8 que `docs/03` §1 regla 3 declara como contrato. Un peldaño de control por debajo del
mínimo táctil no es un peldaño pequeño: es una trampa que el doc tiene que señalizar.

Medido: **`control.xxs` no tiene un solo consumidor en el código**. Lo añadió
[ADR-099](ADR-099-la-escala-de-tamanos-se-ancla-en-md-y-abre-a-xxs-xxl.md) para que las dos escalas
tuvieran la misma forma, y desde entonces nadie lo ha tocado.

## Decisión

### 1. `control.xxs` pasa de 20 a 24

```
antes   20 · 28 · 36 · 44 · 52 · 60 · 68
ahora   24 · 28 · 36 · 44 · 52 · 60 · 68
```

**24 es exactamente el mínimo de WCAG 2.2 SC 2.5.8**, así que el peldaño pasa a ser el más pequeño que
un control puede medir sin incumplir el contrato de `docs/03`.

### 2. Deja de ser inalcanzable, pero sigue sin ser público

`Size` —la superficie pública— **no cambia**: sigue siendo `xs`…`xl`. Lo que cambia es que
`vars.size.control.xxs` pasa a ser **utilizable en composición interna**, que es justo el uso que
`docs/06` §4 ya le asignaba y que hasta hoy era contradictorio: no se podía usar para nada interactivo
porque no llegaba al mínimo.

`docs/06` §4 se corrige en el mismo PR: el peldaño ya no es «inalcanzable por estar bajo el mínimo»,
sino **el suelo táctil del sistema, reservado a composición interna**.

### 3. Los tres consumidores lo adoptan

- **`Tag`**: su hoja fija el cierre en `control.xxs`. Con 24 dentro de un padre de 28 y 1 px de borde,
  el desborde pasa de **+2 a 0**.
- **`DataGrid`**: el hijo del elemento de 24 baja al mismo peldaño.
- **`ThemeIcon`**: `26 → 24`, y sus tamaños de letra fuera de escala —17, 21, 27— se encajan.

## Alternativas

- **Añadir un octavo miembro a `SizeName`.** Era la propuesta original. Resuelve lo mismo **y cuesta un
  cambio de contrato**: `sizes.control` y `sizes.compact` ganan una clave obligatoria, así que un tema
  de terceros deja de validar. Descartada al descubrir que el peldaño que hacía falta **ya existía y
  solo estaba mal calibrado**.
- **Re-fasar toda la escala** para conservar el paso de 8 uniforme. Movería los seis peldaños con
  consumidores reales para arreglar el único que no los tiene. Descartada por desproporción.
- **Aceptar los tres desbordes.** Coste cero, y `docs/06` §4 queda como una regla que el catálogo
  incumple en tres sitios distintos.
- **Usar `compact.sm` (24) para los hijos interactivos.** El valor es el correcto, pero `docs/06` §4.1
  es explícito: «lo que consuma `compact` no puede ser interactivo». Descartada por contradecir el
  contrato de las dos escalas.

## Consecuencias

- **El paso de 8 uniforme se rompe en el primer escalón**: la escala pasa a ser +4 · +8 · +8 · +8 · +8
  · +8. Es el precio, y es pequeño comparado con lo que compra: `xxs` deja de ser un peldaño que el
  propio doc tiene que desaconsejar.

- **`control.xxs` gana su primer consumidor** desde que ADR-099 lo creó. Deja de ser un miembro que
  existe solo por simetría.

- **Cambio visual acotado**: al no tener consumidores previos, lo único que se mueve es lo que se
  migra a propósito —el cierre del `Tag`, el hijo del `DataGrid` y `ThemeIcon`—. **No hay deriva
  silenciosa** en el resto del catálogo.

- **`compact` no se toca.** Sus siete peldaños siguen igual: lo que separa a las dos escalas es el
  objetivo táctil (ADR-072), y esta decisión lo refuerza en vez de diluirlo.

- **Regla derivada**: **ningún peldaño de `control` puede quedar por debajo de 24 px.** Es la escala de
  lo interactivo, y `docs/03` §1 regla 3 fija ese suelo. Si algún día hace falta algo más pequeño, va
  en `compact` y no es interactivo.
