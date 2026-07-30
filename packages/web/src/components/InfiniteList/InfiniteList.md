# InfiniteList

## Duck-typing de TanStack Query, sin depender de TanStack Query

`docs/00-inventory.md` §1.18 pide que el componente «acepte el objeto de query **y** props sueltas» sin
dependencia directa. `InfiniteQueryLike<TPage>` describe **solo lo que se lee** del retorno de
`useInfiniteQuery` —`data.pages`, `fetchNextPage`, `hasNextPage`, `isFetchingNextPage`, `isLoading` /
`isPending`, `isError`— y todo es opcional. Un objeto de TanStack encaja estructuralmente; un objeto
escrito a mano con esas mismas claves, también.

`isLoading` e `isPending` se leen los dos porque v4 y v5 de TanStack no llaman igual al mismo estado.
Gana `isLoading` si está presente.

## Las props sueltas ganan

`ResolveInfiniteSource` resuelve cada campo como `prop ?? query ?? default`. Es lo que permite pasar el
objeto de query entero y corregir un solo aspecto —forzar `loading` en una story, interceptar
`onLoadMore` para telemetría— sin desmontar la integración.

## `getPageItems`

Una página de TanStack casi nunca es un array: lo normal es `{ items, nextCursor }`. Sin el selector,
el componente asume que la página **es** el array y devuelve `[]` para cualquier otra forma, en vez de
adivinar qué clave contiene los datos. La alternativa —probar `page.items`, `page.data`, `page.results`
en cascada— convierte un error de integración en un fallo silencioso que depende de cómo se llame el
campo.

## Por qué el botón «Cargar más» está siempre

El sentinel con `IntersectionObserver` es un **prefetch**, no el único camino. Una lista que solo carga
al intersecar es inoperable para quien navega con cursor virtual de lector de pantalla: ese modo de
navegación no genera scroll del contenedor, así que el sentinel nunca entra en viewport y la lista se
acaba en la primera página.

Con `autoLoad` el botón se ve un instante y desaparece al llegar los datos; sin `autoLoad` es el único
mecanismo. En los dos casos existe, que es lo que exige el contrato de teclado de `docs/03` §1.

## La región `aria-live` está siempre montada

Un `aria-live` que aparece **con** su contenido no se anuncia: el observador de mutaciones del lector
tiene que ver el nodo antes del cambio. Por eso la región vive fuera del pie condicional, siempre
presente y vacía en reposo.

El `Loader` visible va envuelto en `aria-hidden`. `Loader` monta siempre su propio `role="status"`,
así que sin el envoltorio la lista tendría **dos** regiones vivas anidadas anunciando el mismo evento
—una con texto y otra vacía—, que es peor que no tener ninguna. La animación se queda para quien la ve
y el anuncio, para quien lo escucha.
