# SearchableList

## `mode="client"` vs `mode="server"`

En `client` el componente filtra `items` con `filter` o, si no se pasa, comparando en minúsculas contra
`getSearchText`. En `server` **no filtra nada**: asume que quien responde a `onSearchChange` ya devuelve
la lista correcta. Es la diferencia entre un catálogo de 200 filas ya cargado y un endpoint paginado, y
no se puede inferir de los datos — de ahí que sea una prop y no una heurística.

`getSearchText` cae a `JSON.stringify` cuando no se pasa y el item no es un string. Es un default
deliberadamente tosco: funciona para una lista de objetos planos y se nota enseguida que hay que
declarar el campo real en cuanto el item tiene un `id` o una fecha que ensucian la comparación.

## Dos debounces sobre el mismo número

`debounce` gobierna dos relojes distintos y por eso se pasa a los dos sitios:

- el de `SearchInput`, que retrasa `onSearch` → `onSearchChange` (la petición al servidor);
- el `useDebounce` local sobre el valor, que retrasa el **filtrado en cliente**.

Filtrar en cada pulsación una lista larga bloquea el hilo mientras se escribe, así que el modo cliente
necesita su propio retardo aunque nadie escuche `onSearchChange`. El input, en cambio, sigue siendo
inmediato: lo que se retrasa es el trabajo, nunca el eco de la tecla.

## `noResults` no es `empty`

`empty` es «este módulo no tiene datos»; `noResults` es «tu búsqueda no encontró nada», que es un
estado con salida —borrar el término— y merece otro texto. Cuando no se pasa `noResults` se cae a
`empty`, de modo que el caso simple sigue siendo una sola prop.

## La lista se delega en `InfiniteList`

Toda la parte de listado —claves, `aria-busy`, región `aria-live`, botón de cargar más, sentinel—
es la de `InfiniteList`, configurable por la prop `infinite`. Buscar y paginar son ejes independientes:
una lista buscable sobre datos ya cargados no pasa nunca por el pie, y una buscable sobre servidor
compone los dos sin que este componente reimplemente ninguno.
