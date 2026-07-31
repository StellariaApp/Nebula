# GlobalSearch

## Qué lo separa de `CommandPalette`

`CommandPalette` (W3.4, subpath `/command`) busca **acciones que la app ya conoce**: el registro es
local, el filtrado es síncrono y el resultado es ejecutar un comando.

`GlobalSearch` busca **datos que están en el servidor**: el componente no sabe qué hay, solo emite
`onQueryChange` con debounce y pinta lo que le devuelvan. De ahí las tres props que el otro no tiene:
`loading`, `recent` y `debounce`.

No comparten implementación porque no comparten problema, y forzarlas a una sola API habría dejado a
`CommandPalette` cargando un ciclo de red que no usa.

## Combobox con foco virtual

El patrón es el de APG para combobox con listbox: el foco del DOM **no se mueve nunca del input**. Las
flechas cambian `aria-activedescendant`, que apunta al `id` de la opción activa. Así se puede seguir
escribiendo mientras se navega, que es lo que un buscador necesita y lo que un `tabindex` móvil haría
imposible.

Las flechas ciclan (de la última a la primera) porque la lista es corta y cerrada; `Home` y `End`
saltan a los extremos.

`onPointerMove` sincroniza el activo con el ratón, no `onPointerEnter`: este último dispararía al
reaparecer la lista bajo un cursor quieto y movería el activo sin que el usuario haya hecho nada.

## Una sola voz para el lector de pantalla

El recuento se anuncia en una live region **o** el mensaje de vacío lleva `role="status"`, nunca los
dos. Con las dos ramas activas, «Sin resultados» se anunciaba dos veces; lo destapó un test que
encontró el texto duplicado en el DOM.

## El atajo se registra en `window`

`Ctrl`/`Cmd` + `K` cuelga de `window`, no del componente, porque su gracia es funcionar sin que el
disparador esté enfocado. Se apaga con `withShortcut={false}` si la app ya usa esa combinación.
