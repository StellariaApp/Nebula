# ADR-183 — La barra inferior es una fila de pestañas, y una pestaña lleva su nombre

- **Estado**: **aceptada** · 2026-08-27 — decidida por el propietario
- **Cambia API pública**: **no**. Ninguna prop cambia; es CSS del modo carril por debajo de
  `tablet`. **Sí cambia el aspecto**, y ese es el punto: los destinos de la barra inferior pasan a
  llevar su rótulo debajo del icono.
- **Toca**: `packages/web/src/components/AppShell/AppShell.css.ts`.
- Va sobre la barra que tendió [ADR-153](ADR-153-el-carril-declara-que-hace-cuando-no-cabe.md) y
  después de que [ADR-182](ADR-182-quien-scrollea-la-barra-cambia-con-el-ancho.md) hiciera que el
  destino activo se vea.

## Contexto

`AppShell.Label` se apaga por debajo de `laptop`, y con razón: ahí el carril es una columna de
iconos de 64 px y un rótulo al lado no cabe. Bajo `tablet` el carril deja de ser esa columna y se
tiende como **barra inferior**, pero heredaba la misma regla — así que la barra quedaba en una fila
de iconos pelados.

Un icono sin nombre obliga a adivinar, y en Rosette la fila tenía diez: dos engranajes distintos
—«Saldo y gasto» y «Ajustes»— y dos siluetas —«Usuarios» y el avatar del pie—. Con ADR-182 ya se
sabe **dónde estás**; sin rótulo seguía sin saberse **a dónde vas**.

El contenedor tampoco ayudaba: `links_content` gastaba `paddingInline: md` por grupo, que en una
barra de cuatro grupos son 128 px de los 366 dedicados a aire entre separadores.

## Decisión

Por debajo de `tablet`, y sólo ahí:

1. **El enlace se apila.** `flex-direction: column`, icono arriba y rótulo debajo, los dos
   centrados, con `min-width: 64` para que un destino de nombre corto no se estreche por debajo de
   la diana táctil.
2. **El rótulo vuelve.** La regla se ata al enlace —`${link} ${body} ${label}`, tres clases— para
   que las otras dos `AppShell.Label` de la barra, la de la cabecera y la del pie, sigan apagadas:
   ésas sí desbordan.
3. **Dos renglones, no uno.** `NavLink` escribe su rótulo en una línea con elipsis, que es lo que
   quiere una fila vertical porque ahí el enlace tiene todo el ancho. Debajo de un icono no lo
   tiene: «Volver al inicio» en una línea de 84 px sale «Volver al i…». Con
   `-webkit-line-clamp: 2` y `overflow-wrap: anywhere` cabe entero, y el recorte queda para lo que
   de verdad no entra en dos — con su elipsis, que la hereda de `NavLink`.
4. **El tope son 84 px.** Sin él, cada destino mide lo que mida su nombre y la barra deja de leerse
   como una rejilla.
5. **El contenedor suelta relleno**: `paddingInline` de `md` a `xs` y el hueco entre destinos de
   `sm` a `xxs`. Lo que se ahorra se lo quedan los enlaces.

## Consecuencias

- Un destino ocupa más ancho que antes, así que caben menos a la vez y la barra desplaza más. Es un
  intercambio deliberado: con ADR-182 el activo siempre se ve, y saber qué es cada icono vale más
  que ver dos iconos más sin nombre.
- Medido en Rosette con WebKit a 390, los diez destinos: todos los rótulos reales caben en **una**
  línea sin recorte y con el icono centrado —el más largo, «Volver al inicio», mide 81 de los 84—.
  Metiendo a mano un rótulo de 34 caracteres sale a dos líneas y se recorta con elipsis; una palabra
  larga sin espacios —«Internacionalizacion»— se parte y **no** se corta.
- El carril vertical y el mini de `laptop` no cambian: todas las reglas viven dentro de
  `SmallerThan("tablet")`.
- El tamaño del icono lo sigue poniendo el consumidor. `AppShell` no lo toca, porque el icono llega
  en `leftSection` y es suyo.
