# ADR-091 — El suelo tipográfico baja a 11 px

- **Estado**: **revertida** · 2026-08-04 — el propietario la deshizo el mismo día, tras verla en el
  banco de pruebas. `caption` vuelve a 12 px y el suelo de §2.1 con él.
- **Se conserva** por lo que documenta: el 11 px se probó y se descartó **mirando la lámina**, que es
  como §2.1 dice que se revisan estas decisiones. Quien vuelva a proponerlo tiene aquí el intento y
  el motivo por el que se planteó —`caption` a 12 compite con `body3` a 13—, que sigue siendo cierto
  aunque la respuesta no fuera bajar el suelo.
- **Enmienda**: `docs/06-visual-language.md` §2.1, que fijaba el suelo en 12 px y lo listaba como
  invariante que «no puede cambiar».

## Contexto

Al montar el panel, `caption` se veía grande para lo que hace. No es una impresión suelta: `caption`
es **metadata** —rótulos de sección, fechas, contadores, estados secundarios— y a 12 px compite con
`body3` (13 px), que sí es texto de lectura densa. Un peldaño de 1 px entre «apoyo denso» y «metadata»
no separa dos registros: los confunde.

El suelo de 12 px venía de §2.1 y estaba escrito como invariante. Conviene mirar de dónde salía: no
de WCAG —que no fija tamaño mínimo de fuente— sino de una decisión de legibilidad tomada cuando la
escala se diseñó, sin un caso de panel denso delante.

## Decisión

**`caption` pasa a 11 px, y el suelo pasa a ser 11 px.**

La regla de §2.1 —«ningún texto informativo o interactivo baja de 12 px»— se reescribe a 11, y
`caption` sigue siendo el peldaño que _es_ el suelo. Con ello la separación con `body3` pasa de 1 px
a 2, que es la que ya hay entre `body2` y `body3`.

### El `max()` del código se queda en 12 px

[ADR-066](ADR-066-dimensionado-del-codigo.md) fija `max(0.875em, 12px)` para código inline. **No
baja.** El código es más denso que la prosa —glifos estrechos, sin ligaduras, con símbolos que se
distinguen por detalles finos— y a 11 px un `l` y un `1` empiezan a confundirse. Que el suelo general
baje no obliga a que baje el del código: son dos legibilidades distintas.

La consecuencia es que un `code` dentro de un `caption` mide 12 px, un pelo **más** que su contenedor.
Es deliberado y es la lectura correcta de ADR-066: el `max()` existe justamente para que el código no
herede reducciones que no aguanta.

### Lo que no cambia

`caption` sigue siendo metadata, ayuda y estados secundarios. **No** se convierte en un tamaño para
texto de lectura, ni para controles: `button` sigue en 14 px. Bajar el suelo no autoriza a usarlo en
más sitios; autoriza a que el sitio donde ya se usaba pese menos.

## Consecuencias

- Un solo token cambia: `font.size.caption` 12 → 11.
- `docs/06` §2.1 se actualiza en el mismo commit: la tabla, la regla del suelo y la fila de la matriz
  de §2.2 que listaba «el suelo de 12 px» como inamovible.
- Es un cambio **visible en todo el catálogo**: `caption` lo usan badges, rótulos, ayudas de campo y
  pies de tabla. Se revisa mirando la lámina, no midiendo.
- El riesgo real es de accesibilidad blanda: 11 px es pequeño para lectura sostenida. Se acota
  manteniendo el registro —metadata, no prosa— y el suelo de 12 px del código.
