# Kanban

`KanbanBoard` es multi-contenedor: hay que mover claves **entre** listas, no solo dentro de una. Eso
cambia tres cosas respecto a `SortableList`.

## Por qué hay estado local si el componente es controlado

El tablero deriva sus columnas de `items` + `getColumn`, que es la fuente de verdad. Pero durante un
arrastre entre columnas el hueco tiene que abrirse **antes** de soltar: si esperásemos a `onDragEnd`
para avisar al consumidor, la tarjeta flotaría sobre una columna que no se ha reorganizado y el
usuario no sabría dónde va a caer.

`useKanbanColumns` resuelve eso con un override local que solo vive mientras dura el arrastre:

- `onDragOver` mueve la clave de columna en el estado local (feedback inmediato);
- `onDragEnd` calcula el reparto definitivo, lo aplica en local y **entonces** llama a `onMove`;
- cuando `items` cambia de verdad —porque el consumidor guardó—, la firma derivada cambia y el
  override se descarta.

Esa última parte es la que evita el bug clásico del optimistic UI: si el consumidor **no** aplica el
movimiento, la firma derivada no cambia... y el override tampoco se descarta, así que la tarjeta se
queda donde el usuario la soltó. Es una decisión consciente: revertir una tarjeta bajo el cursor es
más desconcertante que dejarla y que el consumidor muestre su error.

## `Resolve` distingue soltar sobre columna de soltar sobre tarjeta

dnd-kit devuelve un único `overId` que puede ser lo uno o lo otro. Si el id coincide con una columna,
el destino es el final de esa columna —es lo que pasa al soltar sobre una columna **vacía**, donde no
hay ninguna tarjeta que interceptar—; si coincide con una tarjeta, el destino es su índice. Sin esa
bifurcación, una columna vacía no aceptaría nada, que es el fallo más común al montar un Kanban con
dnd-kit.

Por eso `KanbanColumn` es además un `useDroppable`: la columna necesita ser una zona de destino por sí
misma, no solo el contenedor de una `SortableContext`.

## `withHandle` por defecto es `false`, al revés que en `SortableList`

Una tarjeta de Kanban se arrastra entera: es el gesto que el patrón enseña y la tarjeta no suele tener
controles dentro que compitan por el puntero. Una fila de lista, en cambio, casi siempre tiene un
botón o un enlace, y ahí el asa evita el conflicto. El `activationConstraint` de 6 px cubre el resto.

## `limit` no bloquea

Se pinta `count/limit` y se tiñe de warning al pasarse, pero el componente **no** impide soltar. Un
WIP limit es una política de equipo, no una regla de UI: quién puede saltárselo y con qué
justificación es una decisión del producto, y un componente que la impone a ciegas obliga a hacerle
un `if` alrededor.
