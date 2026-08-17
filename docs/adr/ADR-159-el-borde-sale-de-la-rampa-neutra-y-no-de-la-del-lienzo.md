# ADR-159 — El borde sale de la rampa neutra, no de la del lienzo

- **Estado**: **rechazada** · 2026-08-17 — se construyó, se midió, **se aplicó y se miró
  renderizada**, y el propietario la descartó: el resultado visual no convenció. El código está
  revertido y el gate volvió a sus 165 pares. Se conserva por lo que mide: **el defecto que
  describe sigue ahí**, y quien lo redescubra encontrará aquí los números y por qué esta salida
  no se tomó.
- **Resuelve**: §2.1 de la [auditoría del sistema](../reviews/auditoria-sistema-2026-08-16.md), el
  único hallazgo **crítico**: un campo de texto dentro de una `Card` no tiene frontera visible en
  ninguno de los dos temas oficiales.
- **Depende de**: ADR-158. Sin la escalera abierta, ningún valor de borde cumple a la vez contra las
  cinco superficies.
- **Toca**: `colors.border` de `nebula-dark` y `nebula-light`. **No cambia la forma del contrato**:
  `BorderRole` conserva sus cinco miembros.

## Contexto

### El defecto

`styles/field.css.ts` fija `surface: "outline"` como variante por defecto de los 27 campos y pinta su
borde en reposo con `border.default`. Medido antes de ADR-158, contra la `Card` sobre la que se apoya:

| tema    | borde vs la card               | relleno vs la card | ¿algo llega a 3:1? |
| ------- | ------------------------------ | ------------------ | ------------------ |
| `dark`  | **1.00** — el mismo hex exacto | 1.052              | **no**             |
| `light` | 1.083                          | 1.026              | **no**             |

WCAG 2.2 **SC 1.4.11** pide 3:1 a la información visual que identifica un componente de interfaz, y
el borde en reposo de un campo es el ejemplo canónico. `docs/03` declara **AA estricto**, así que es
contrato incumplido, no preferencia.

Está además **invertido**: `bdHover` sí usa `border.strong` (3.48:1), de modo que la frontera aparece
al pasar el ratón — cuando ya has encontrado el campo.

### La causa, y es de una línea

**`subtle` y `default` se tomaban de la misma rampa que las superficies.**

| rol       | `dark` antes | `light` antes | rampa             | ¿pasaba? |
| --------- | ------------ | ------------- | ----------------- | -------- |
| `subtle`  | `dark.700`   | `light.400`   | la **del lienzo** | no       |
| `default` | `dark.700`   | `light.500`   | la **del lienzo** | no       |
| `strong`  | `gray.500`   | `gray.500`    | la **neutra**     | **sí**   |
| `focus`   | `indigo.400` | `indigo.600`  | la de marca       | **sí**   |

Un borde tomado de la rampa que pinta las superficies **no puede separarse de ellas**: compite en el
mismo tramo de luminancia, y las paletas `dark` y `light` son justo las de menos recorrido del sistema
—19 y 14 puntos de L\* contra los ~73 de una cromática (auditoría §2.3)—. En `dark` la coincidencia
llegó a ser literal: `border.default` y `surface.raised` eran ambos `#20222c`.

**Los dos roles que estaban en la rampa neutra son exactamente los dos que pasaban.** No hacía falta
más diagnóstico.

### Por qué ningún gate lo vio

`tools/contrast-check` medía `border.strong` y `border.focus` contra las superficies, y **no medía
`border.default` ni `border.subtle`**. Los dos que fallaban eran los dos que no se miraban. Se corrigió
el 2026-08-16 (`docs/03` §4 gate 2) y es lo que puso este defecto en rojo por primera vez.

## Decisión

### 1. Los tres bordes de separación salen de `gray`

```
                 subtle        default       strong
  dark        gray.800       gray.400      gray.200
  light       gray.300       gray.600      gray.800
```

Medido contra `surface.base`, y contra las cinco superficies opacas en el peor caso:

| tema    | `subtle` | `default`            | `strong` |
| ------- | -------- | -------------------- | -------- |
| `dark`  | 1.59     | **6.23** (mín. 4.72) | 11.97    |
| `light` | 1.57     | **5.65** (mín. 4.51) | 9.44     |

`default` cumple SC 1.4.11 con holgura sobre el mínimo de 3:1, y **el borde del campo dentro de una
card pasa de 1.08 a 5.50 en oscuro y de 1.05 a 5.21 en claro**.

Las dos escaleras quedan **perceptualmente emparejadas** —1.59/1.57, 6.23/5.65, 11.97/9.44— sin ser
espejo de peldaño, porque las superficies tampoco están en posiciones espejadas.

### 2. `focus` y `disabled` no se tocan

`focus` ya cumplía (6.04 y 6.64) y es identidad de marca. `disabled` está **exento de contraste por
WCAG 1.4.3**, ningún gate lo mide y la auditoría no lo señaló: moverlo sería ampliar el alcance sin
un defecto que lo pida.

### 3. La regla que queda escrita

> **Un borde nunca se toma de la rampa que pinta las superficies.** Su trabajo es separarse de ellas,
> y en la rampa del lienzo no tiene recorrido para hacerlo.

Va a `docs/06` §5 junto a la escalera, y la verifica el gate.

## Alternativas

- **Subir solo `border.default` y dejar `subtle` donde estaba.** Cierra el fallo crítico con el mínimo
  cambio, y deja `subtle` en 1.05–1.11, es decir invisible. Descartada: `withBorder` es parte del
  lenguaje de elevación (`docs/06` §5), no una decoración, y un separador que no se ve no separa.

- **Mantener los bordes en la rampa del lienzo y abrir esa rampa.** Es lo que haría falta si se
  quisieran bordes tintados con el canvas. Exige regenerar `dark` y `light` con más recorrido —el ADR
  de `lift`, auditoría §2.3— y aun así compite con las superficies por el mismo tramo. Descartada por
  coste y por no resolver la causa.

- **Bajar el mínimo de `subtle` de 1.15 a lo que hoy cumple.** El 1.15 no viene de ninguna norma: lo
  fijó el gate el 2026-08-16 tomándolo del filo del cristal, que es el precedente del repo para «tiene
  que percibirse, pero no identifica nada». Bajarlo es apagar la única medida que hay. Descartada.

- **Derivar el borde del color de la superficie en runtime** (un `color-mix` sobre la superficie
  activa). Da separación constante sobre cualquier fondo, como el velo de hover de ADR-158, pero
  `border.*` son roles del contrato que native también consume, y el cristal ya demostró en ADR-102 lo
  caro que es que un filo deje de ser un valor. Descartada; anotada por si el filo del cristal la
  reabre.

## Consecuencias

- **Cierra el hallazgo crítico** de la auditoría y **todos los rojos de borde del gate**: `dark`
  17 → 4 y `light` 20 → 8, sin romper ningún par que pasara. Los 12 que quedan son **todos del filo
  del cristal**.

- **Los bordes dejan de teñirse con el lienzo, y eso se nota en los temas de producto.** `BuildProduct`
  tiñe `colors.surface`, no `colors.border`, así que ya antes los bordes eran neutros; lo que cambia
  es que ahora **se ven**, y por tanto se ve que son neutros. Si un producto quisiera el borde teñido,
  eso es una ampliación de `BuildProduct` y no de este ADR.

- **El filo del cristal es lo único que queda entre el gate y el verde.** ADR-102/ADR-118 lo dejaron
  como **hex fijo por tema** (`#e9e9ea` / `#23252c`) en vez de derivarlo de un rol, así que se
  descalibró en cuanto ADR-158 movió las superficies. Es la tercera y última decisión de la serie.

- **Cambio visual en todo el catálogo**: 72 usos de `withBorder`, los 27 campos y todo separador. Con
  ADR-158 comparte PR y comparte recaptura de baseline; no tiene sentido separarlos.

- **Un `default` a 6:1 es un borde presente.** Es el precio de que la rampa neutra no tenga un peldaño
  entre `gray.500` (2.77 en oscuro, no llega) y `gray.400` (4.72): el mínimo que cumple es el que hay.
  Si al mirarlo resultara pesado, la salida no es bajar el borde sino **añadir el peldaño**, y eso es
  del ADR de paletas.
