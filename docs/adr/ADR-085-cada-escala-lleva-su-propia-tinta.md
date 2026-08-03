# ADR-085 — Cada escala lleva su propia tinta

- **Estado**: **aceptada** · 2026-08-03 — a petición del propietario durante WB
- **Enmienda**: [ADR-083](ADR-083-la-tinta-del-relleno-la-decide-la-luminancia.md), que derivaba una
  sola tinta por tema, y [ADR-084](ADR-084-el-paso-500-se-ancla-al-contraste.md), que anclaba todos
  los `500` contra blanco.
- **Añade**: `vars.color.ink.<escala>` al contrato CSS.

## Contexto

Al revisar las paletas el propietario pidió aclarar `cyan`, `lime`, `gold` y `pink`, y bajar la
intensidad de `orange`. Ninguna de las cinco era cuestión de tono: **la altura del `500` estaba fijada
por el anclaje**, que exigía 4.5:1 contra blanco. Un amarillo que aguanta letra blanca es
necesariamente un mostaza; uno vivo no puede.

La causa de fondo es que había **una sola tinta por tema**, derivada del relleno de `primary`. Si
`primary` es indigo la tinta sale blanca, y entonces un botón `warning` amarillo hereda esa blanca
aunque le convenga negra. Con una tinta única, la única forma de que todas las familias pasen AA es
hundir las claras.

## Decisión

### 1. Una tinta por escala

El contrato gana `ink` con las siete escalas de rol. `ThemeToVars` la deriva de **el relleno de esa
escala**, y `ResolveVariant` la usa cuando la receta pide `text.onPrimary` y su fondo es un
`scale.NNN`. Sigue viajando como var, así que el tema puede cambiar por clase CSS sin re-renderizar.

Cuando el fondo **no** es una escala —el caso de `gradient`— la tinta sigue siendo
`text.onPrimary`: un degradado es el mismo en todas las escalas, así que no tiene sentido pedirle una
tinta por escala. Saltarse ese matiz costaba cuatro pares del gate en rojo: la variante `gradient`
tomaba la tinta oscura de `warning` sobre el degradado de marca, que es oscuro.

### 2. Gana la tinta que más contrasta

`OnColor` deja de comparar contra un umbral fijo de luminancia y compara los dos contrastes. Es
autoexplicativo y siempre óptimo, y da el reparto que se busca sin ajustar nada: los tonos saturados
y hondos —indigo, violet, red, rose, green, blue— siguen con blanca, y los claros con oscura.

El umbral `LUMINANCE_DARK_THRESHOLD = 0.7` de ADR-083 desaparece. Era una aproximación a este cálculo
cuando la tinta era una sola.

### 3. La semilla declara la tinta de su `500`

`SeedSpec` gana `ink?: "light" | "dark"`. Con `"dark"`, el `500` **no se ancla**: se queda en la
lightness de la curva y su tinta oscura le da de sobra. Lo llevan las siete familias claras —`orange`,
`gold`, `yellow`, `lime`, `cyan`, `teal`, `pink`—; el resto mantiene el anclaje de ADR-084.

No se deriva de la luminancia de la semilla a propósito: es una decisión de identidad —si esta familia
se lee clara o profunda— y se revisa mirando la lámina, no calculándola.

| paleta   | antes (blanco) | ahora (oscura) |
| -------- | -------------- | -------------- |
| `orange` | `#bd5b00`      | `#d36600`      |
| `gold`   | `#9b6e00`      | `#b27f00`      |
| `yellow` | `#897600`      | `#9f8900`      |
| `lime`   | `#5a8200`      | `#6c9a00`      |
| `cyan`   | `#00819d`      | `#0098b9`      |
| `teal`   | `#008574`      | `#009f8c`      |
| `pink`   | `#d0339c`      | `#dc41a7`      |

Las siete suben a **5.02–5.94:1**, más contraste que antes, porque un color claro con letra oscura
contrasta mejor que con letra blanca.

### 4. Una familia clara no vive a la misma altura que una honda

Soltar el anclaje no bastaba: a `L=0.63` —el centro de la curva— cualquier amarillo es un mostaza. El
tono era correcto (hue 98); lo que fallaba era la altura.

`SeedSpec` gana `lift`, que sube la curva en el tramo medio de esa familia. El peso es máximo en el
`500` y **cero del 700 hacia abajo**: esos son los peldaños que se usan como texto sobre el lienzo, y
subirlos cuesta contraste —al levantarlos, `outline` y `ghost` de `warning` cayeron a 4.33:1—.

`yellow` sube 0.17 y su `500` queda en `L=0.80`, que es donde Tailwind pone el suyo. Detrás van
`gold` 0.13, `lime` 0.12, `orange` 0.06, `cyan` y `teal` 0.05 y `pink` 0.03.

### 5. El hover se aleja de la tinta

ADR-083 hizo que el hover ahondara en los temas oscuros. Con tinta oscura eso lo acerca a su propia
letra: medido, `warning` en hover caía a 3.15:1. El paso pasa a depender de la tinta —hacia lo oscuro
si la tinta es clara, hacia lo claro si es oscura— combinado con la inversión de `FlipScale`.

## Consecuencias

- Medido en `Button/Colors` sobre `dark`: `warning` con tinta oscura a 10.58:1 y las otras cinco con
  blanca entre 4.50 y 4.56. **Todos los gates en verde**: contraste 5 temas, 1187 tests, a11y 85
  suites y 587 tests.
- Siete vars más por tema en el contrato, que empujan cinco presupuestos: `NebulaProvider`
  73 → 73.5 kB, `Tabs` 32.5 → 33, `Card` 23.5 → 24, `StatusBadge` 16 → 16.5 y
  `TypographyStylesProvider` 11 → 11.5. Es el coste fijo de ampliar el contrato, no de un componente.
- La regla de ADR-084 se afina: **el `500` lleva tinta, y ahora cada familia decide cuál**. El `600`
  sigue siendo el peldaño que _es_ tinta sobre el lienzo.
