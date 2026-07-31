# DragDrop

Subpath `@stellaria/nebula-web/dnd`. Cuatro piezas sobre dnd-kit 6.x ([ADR-060](../../../../../docs/adr/ADR-060-deps-de-dnd-carousel-y-media.md)):
`DragDropContext` monta el motor, `Draggable`/`Droppable` son las primitivas libres y `SortableList`
es la lista reordenable que resuelve el 90 % de los casos sin tocar dnd-kit.

## La a11y de arrastre no es opcional, y por eso se eligió esta línea

Arrastrar con ratón es la parte fácil. El contrato de `docs/03` §1 exige que **todo** sea operable sin
ratón, y un DnD accesible necesita cuatro cosas que dnd-kit 6.x trae y su reescritura 0.x todavía no
documenta:

1. **`KeyboardSensor` con `sortableKeyboardCoordinates`** — sin ese `coordinateGetter`, las flechas
   mueven el puntero virtual en píxeles y no de item en item, que es lo que un usuario de teclado
   espera en una lista.
2. **`screenReaderInstructions`** — el texto que se lee al enfocar un elemento arrastrable. Sin él, un
   `role="button"` que además se arrastra es indistinguible de un botón normal.
3. **`announcements`** en live region para los cuatro momentos (levantar, sobrevolar, soltar,
   cancelar). Un reordenamiento silencioso no existe para quien no ve la pantalla.
4. **`DragOverlay`** para que el elemento en vuelo salga del flujo y no arrastre el layout consigo.

Los cuatro están en `DragDropContext`, con los textos en `labels.ts` y sobrescribibles por
`labels`. Están en castellano porque el resto del catálogo también lo está; el día que haya i18n real,
este es uno de los sitios que la consume.

## `withHandle` cambia quién es el control, no solo el aspecto

Con `withHandle={false}` la tarjeta entera recibe `attributes` (que incluyen `role="button"`,
`tabIndex` y `aria-roledescription`) y `listeners`. Con `withHandle`, **los dos se mueven al asa** y la
raíz se queda sin ninguno.

Es deliberado y evita el fallo habitual: si el asa lleva los listeners pero la raíz conserva
`tabIndex` y `role="button"`, hay dos paradas de tabulación por fila y solo una funciona. La segunda
se anuncia como botón y no hace nada.

El asa es además el `setActivatorNodeRef` de dnd-kit, no solo el sitio donde cuelgan los listeners: el
sensor de teclado calcula las coordenadas iniciales desde el nodo activador, así que declararlo es lo
que hace que el arrastre por teclado empiece donde el usuario está mirando.

## `activationConstraint`, o por qué un item arrastrable sigue siendo clicable

`PointerSensor` con `{ distance: 6 }`: el arrastre no empieza hasta que el puntero recorre 6 px. Sin
esa restricción, dnd-kit captura el `pointerdown` y **un click normal sobre la tarjeta deja de
funcionar**, que es lo que rompe cualquier lista donde el item también navega a un detalle.

## El contrato de eventos no es el de dnd-kit

`onDragStart`/`onDragOver`/`onDragEnd` reciben un `DragMove` propio (`{ activeId, overId }`) en vez del
evento de la librería. Es la misma razón por la que `DataGrid` no expone la instancia de tanstack: el
caso común no necesita `active.rect`, `delta` ni `collisions`, y exponerlos ata nuestra API pública a
la suya. Para lo que sí lo necesite, el subpath **reexporta** `DragStartEvent`, `DragOverEvent` y
`DragEndEvent`, igual que `/datagrid` reexporta `ColumnDef`.

## `SortableList` no guarda estado

Recibe `items` y devuelve el array ya reordenado en `onReorder(items, from, to)`. No mantiene copia
interna: el orden vive donde vive el dato. El `Move` local es una pura función de array; si el
consumidor no aplica el resultado, la lista vuelve visualmente a su sitio, que es el comportamiento
correcto para un fallo de guardado en servidor.
