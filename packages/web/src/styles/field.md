# `field` — la lámina compartida de los campos

La consumen `TextInput`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `Combobox`,
`Select` y `MultiSelect`. Es la razón de que los ocho tengan la misma caja sin sincronizarla a mano, y
de que arreglar uno los arregle a todos.

## El hueco entre valor y adorno escala con el tamaño (G1.4)

`gap` estaba en la base del recipe con `space.xs` (4 px), el mismo valor para un campo `xs` de 30 px que
para uno `xl` de 60. El archivo de diseño usa **12** entre el valor y el chevron de su `FieldSelect`,
que mide 43 px —el equivalente de nuestro `md`—.

Portar ese 12 como valor fijo habría dejado un campo `xs` con 8 px de padding y 12 de hueco: más
separación entre el icono y el texto que entre el texto y el borde. Así que el `gap` baja a las
variantes de `size` y sigue la misma progresión que `paddingInline`, que ya estaba ahí:

| `size` | `paddingInline` | `gap` |
| ------ | --------------: | ----: |
| `xs`   |        8 (`sm`) | 8 (`sm`) |
| `sm`   |        8 (`sm`) | 8 (`sm`) |
| `md`   |       16 (`md`) | **12 (`u3`)** |
| `lg`   |       16 (`md`) | **12 (`u3`)** |
| `xl`   |       24 (`lg`) | 16 (`md`) |

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
