# band

El ritmo vertical de una **banda de página** — `Section` y `Hero`, los dos únicos componentes que
ocupan el ancho de la página y aportan aire por sí mismos.

## Por qué existe este módulo

Los dos declaraban los mismos ocho números en literales, duplicados uno a uno, y el mayor —90— era
**el único valor del ritmo de la landing que no caía en la rejilla de 4 px** (90/4 = 22.5). Duplicado
y fuera de rejilla es la combinación que garantiza que los dos se separen en cuanto alguien toque uno.

Con ADR-072 los números pasan a la escala de marca y viven en un sitio:

| Tamaño | `paddingBlock` | `minHeight` |
| ------ | -------------: | ----------: |
| `xl`   |        **120** |         320 |
| `lg`   |             80 |         224 |
| `md`   |             48 |         144 |
| `sm`   |             24 |          80 |

`xl` es la medida de sección de las landings de Stellaria. Los cuatro peldaños caen en rejilla de 8.

## Por qué son números y no tokens

`docs/06` §4.1 prohíbe que un componente declare alturas en literales, y la regla apunta a las dos
escalas de **control**: `sizes.control` y `sizes.compact`, cuyos máximos son 64 y 36. Una banda de
portada no es un control ni un objetivo táctil, y 320 px no es una altura que ninguna de las dos
escalas deba llegar a tener.

`space` tampoco sirve: su peldaño mayor es `xxxl` = 64, y §3 lo reserva a **layout** —lo que separa
dos cosas—, mientras que esto es cuánto respira una banda por dentro. Por §3 eso es un múltiplo, y los
múltiplos viven en el CSS del componente, no en los style props.

Lo que la regla persigue es que el número no se elija a ojo en el sitio donde se escribe. Aquí se
elige una vez, con nombre, y los dos componentes lo consumen.

## Una banda trae su propio aire; `Main` no lo añade

`Main.spacing` es opt-in y existe para el contenido que **no** son bandas — un dashboard donde el hijo
directo es una `Card` o una tabla. Cuando el contenido son `Section` o `Hero`, no se pasa: el ritmo lo
gobierna el padding de la banda y punto.

La razón está medida. Con los dos mecanismos vivos, entre dos secciones de la landing había **244 px**
—90 + 64 de gap + 90— que nadie eligió: era la suma de un componente que declara su aire y un
contenedor que añade el suyo encima. Con el gap fuera, dos bandas `xl` adyacentes dan 240 px y ese
número se lee directamente de la tabla en vez de calcularse.

## `minHeight` no es `paddingBlock × 2`

Es el doble del padding **más un mínimo de contenido**: 320 = 240 + 80 en `xl`, 144 = 96 + 48 en `md`.
Si fuera exactamente el doble, `minHeight` no haría nada —el padding solo ya lo alcanza— y una banda
sin contenido colapsaría a una franja de aire. El sobrante es lo que garantiza que la banda se lea
como una banda aunque su contenido sea una sola línea.
