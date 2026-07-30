# StatusBadge

Ejecuta [ADR-055](../../../../../docs/adr/ADR-055-mapa-de-estados-de-statusbadge.md).

## Subconjunto de `variant`

Hereda el de `Badge` —`filled · outline · light · ghost · gradient`— por decisión del propietario en el
checkpoint de apertura del bloque C de W3.3. La alternativa evaluada fue recortar `gradient` aplicando
el precedente de `Chip` (`docs/06` §6: gradient no es fondo dominante en tablas), y se descartó: el
hábitat que se prioriza es el estado suelto —cabecera de un detalle, fila de una tarjeta—, donde Badge
conserva `gradient` por la misma razón. Queda registrado en la enmienda de ADR-038.

## Precedencia

De más fuerte a más débil:

1. props del punto de uso (`variant`, `color`, `dot`);
2. lo que diga el descriptor del mapa;
3. el default del componente (`light`, `primary`, sin punto).

La prop `map` sustituye al mapa del provider **entero**, no se fusiona con él. Fusionar obligaría a
decidir qué gana clave a clave y haría imposible que un punto de uso apague un estado que el provider
define; sustituir es la regla que ADR-053 ya aplicó a los prefijos telefónicos.

## Estado sin mapear

No hay mapa por defecto, así que un `status` que ningún mapa declara —o un `StatusBadge` sin provider y
sin `map`— **no se pinta en gris**: se pinta como `outline` sobre `error` y su etiqueta es la clave
cruda. La regla es de ADR-055 §Consecuencias: inventarse un estado por defecto es adivinar el dominio,
y un estado desconocido tiene que verse.

No se emite `console.warn` ni se lee `process.env`: el paquete no tiene hoy ninguna de las dos cosas y
el fallo ya es visible en la propia UI, que es donde se mira. Un dato sin mapear en una tabla de cien
filas se ve cien veces en rojo; un warning se pierde entre cien warnings iguales.

## Budget propio de 15 kB

Medido: **14,55 kB** brotli por módulo. `Badge` solo ya mide **14,1** contra un techo de clase de
**14,5** («primitivo temable con variantes en runtime»), de modo que cualquier componente que lo
componga sale de esa clase por construcción — el problema es la clasificación, no el peso.

Los 450 B propios son el contexto, la resolución del descriptor y la clase visually-hidden de la
descripción. La clase que le tocaría por composición es «compuestos ≤48 kB», pero un techo de 48 kB
sobre un badge no detectaría ninguna regresión, así que lleva budget propio ajustado, igual que `Chip`
(16 kB). Si un día supera los 15, lo que hay que mirar es qué se le añadió, no subir el número.

La descripción usa la **clase** `visuallyHidden`, no el componente `VisuallyHidden`: el componente
arrastra `Box` y su maquinaria polimórfica y costaba 80 B para renderizar un `span` sin ninguna prop.

## Por qué no reexpone `data-status`

`Badge` —como `Tag` y el resto de presentacionales de su familia— no reenvía al DOM las props que no
están en su contrato. Es la convención del paquete, no un olvido, y `StatusBadge` la respeta en vez de
ensanchar `BadgeProps` para colar un atributo de diagnóstico. Un consumidor que necesite el atributo
envuelve el badge en su propio nodo.
