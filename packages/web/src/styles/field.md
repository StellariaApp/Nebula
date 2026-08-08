# `field` — la lámina compartida de los campos

La consumen `TextInput`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `Combobox`,
`Select`, `MultiSelect`, `ColorPicker`, `DatePicker`, `DateRangePicker`, `TimeInput`, `FileInput`,
`JsonInput`, `PinInput` y `TagsInput`. Es la razón de que los dieciséis tengan la misma caja sin
sincronizarla a mano, y de que arreglar uno los arregle a todos.

## El hueco entre valor y adorno escala con el tamaño (G1.4)

`gap` estaba en la base del recipe con `space.xs` (4 px), el mismo valor para un campo `xs` de 30 px que
para uno `xl` de 60. El archivo de diseño usa **12** entre el valor y el chevron de su `FieldSelect`,
que mide 43 px —el equivalente de nuestro `md`—.

Portar ese 12 como valor fijo habría dejado un campo `xs` con 8 px de padding y 12 de hueco: más
separación entre el icono y el texto que entre el texto y el borde. Así que el `gap` baja a las
variantes de `size` y sigue la misma progresión que `paddingInline`, que ya estaba ahí:

| `size` | `paddingInline` |         `gap` |
| ------ | --------------: | ------------: |
| `xs`   |        8 (`sm`) |      8 (`sm`) |
| `sm`   |        8 (`sm`) |      8 (`sm`) |
| `md`   |       16 (`md`) | **12 (`u3`)** |
| `lg`   |       16 (`md`) | **12 (`u3`)** |
| `xl`   |       24 (`lg`) |     16 (`md`) |

## Por qué el texto del campo NO baja a 12 px

El diseño resuelve su campo con texto de 12; `md` usa `body1` (16). No se porta, y no es por descuido:

- 12 px es `caption` en la escala de Nebula, el tamaño del texto de ayuda. Usarlo también para el valor
  colapsaría dos niveles de la jerarquía en uno.
- El plan de convergencia fija que del archivo se porta **la relación**, no el píxel. La relación de
  Nebula ya es correcta: etiqueta (14) < valor (16), y ayuda (12) < etiqueta. El diseño consigue la
  misma jerarquía con el peso —etiqueta 12/600 contra valor 12/400— en vez de con el tamaño.

Ambas son válidas. La de Nebula, además, sobrevive a un tema que cambie la familia tipográfica.

## El estado deshabilitado (ADR-048)

`background: surface.disabled`, `borderColor: border.disabled`, `color: text.disabled`. Antes eran
`sunken`, `border.subtle` y `text.secondary`: tres roles prestados de otros ejes que ningún tema podía
recalibrar como estado. `field` era la receta más completa de las cinco del censo, y por eso se
normalizó aquí en vez de esperar a G1.10 — se estaba tocando el archivo de todos modos.

## Por qué el relleno en reposo es `surface.sunken` y no `surface.raised`

Reportado en el playground: el campo no se distingue del fondo de la página. Medido, el relleno en
reposo contra el canvas (`surface.base`):

| Tema  | `raised` (antes) | `sunken` (ahora) |
| ----- | ---------------: | ---------------: |
| light |            1.017 |        **1.062** |
| dark  |            1.012 |        **1.062** |

`raised` no está mal calibrado: ADR-028 fijó que en dark la escalera de elevación **no la lleva la
luminosidad sino el rim** de `effects.shadows`, y en light la lleva la sombra. Una Card a 1.01 se
distingue perfectamente porque tiene sombra. Un campo no tiene sombra, así que hereda el 1.01 sin el
cue que lo compensa. El defecto es de la receta, no del tema, y por eso se corrige aquí.

`sunken` es además el rol que le corresponde por significado: un campo de texto es una superficie
hundida —un pozo donde se escribe—, no una elevada. El escalón resultante es **exactamente simétrico**,
1.062 en los dos esquemas: en light oscurece y en dark aclara, que es la dirección que pidió el
propietario.

Con esto `outline` y `filled` comparten relleno y se diferencian por el borde, que es exactamente lo
que dicen sus nombres. Enmienda el punto 2 de [ADR-042](../../../../docs/adr/ADR-042-eje-surface-del-recipe-field.md).

### El hover de `filled` aparece como borde, no como relleno

`filled` tenía `bgHover: surface.hover`, y en los cuatro temas oficiales `hover` y `sunken` resuelven
al **mismo peldaño** (índice 300). Como `filled` también lleva el borde transparente, el resultado era
un campo sin ninguna respuesta al puntero.

El primer arreglo fue `bgHover: surface.active`, y el rol de placeholder demostró que estaba mal:
oscurecer el relleno **bajo el texto** cuesta contraste, y en los tres temas de escala light dejaba el
placeholder a 4.20 sobre un campo con el puntero encima. Así que `filled` deja el relleno quieto y su
hover pasa a ser el borde apareciendo —`transparent` → `border.default`—, que es el mismo idioma que
usa `outline` y no toca el fondo del texto.

`outline` tampoco necesita escalón de relleno: su hover lo comunica el borde endureciéndose,
`border.default` → `border.strong`, que es 1.39 → 3.50 en light y 2.27 → 4.15 en dark.

## El placeholder tiene rol propio (ADR-052)

`&::placeholder` usaba `text.muted`. `text.muted` es un rol de propósito general y debe cumplir 4.5:1
**sobre las seis superficies**, incluida `surface.active`; un placeholder solo se apoya en el fondo de
un campo. Mientras compartieran rol, atenuar el placeholder era imposible sin arrastrar los demás usos
de `muted`.

Con rol propio, el peldaño que light no podía dar pasa a estar disponible:

| Tema  | antes (`muted`) | ahora (`placeholder`) | sobre el campo | separación vs. valor |
| ----- | --------------- | --------------------- | -------------: | -------------------: |
| light | `gray.700`      | **`gray.600`**        |           4.54 |      1.74 → **2.34** |
| dark  | `gray.500`      | `gray.500`            |           5.38 |                 3.26 |

**dark ya estaba en su suelo** y no se mueve: el siguiente peldaño de la rampa gris cae a 3.90 sobre
su fondo de campo, por debajo del mínimo de texto. No hay medio peldaño en la rampa.

Un campo deshabilitado pinta su placeholder con `text.disabled` (`&:disabled::placeholder`), que es el
rol correcto y el que WCAG exime por componente inactivo. Antes heredaba `muted` sobre
`surface.disabled`, el par más apretado de todos.

### Lo que sigue abierto

El borde en reposo (`border.default`) mide **1.39** contra el canvas en light y **2.27** en dark, por
debajo del 3:1 que WCAG 2.2 SC 1.4.11 exige al límite visual de un componente de UI. Ningún cambio de
esta serie lo introduce ni lo empeora —el relleno suma, no resta—, pero tampoco lo resuelve: el
contorno en reposo de un campo sigue siendo la deuda de a11y del eje, y arreglarlo es recalibrar
`colors.border.default` en los cinco temas, no tocar la receta.
