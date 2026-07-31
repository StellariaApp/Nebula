# Breadcrumbs

## Cómo llegó tarde

Es fila Tier 2 de `00-inventory` §1.10 y se nombró en el prompt de **W2.5**. `w2-closure` lo aplazó
correctamente —W2 era Tier 1—, y **W3, que era el tramo de Tier 2, no lo recogió**. Los cierres de W3
y W4 afirmaron cobertura completa sin reverificarla, así que el hueco viajó dos tramos. Apareció en la
auditoría de cobertura que precede a la revisión visual del catálogo, y de ahí sale el prompt WR1.1
de `prompts/2.1-web-refine/`.

## Declarativo y sin router

`items` es un array; el componente **no sabe nada de rutas**. Tres formas de navegar, por orden de
preferencia:

- `href` → renderiza `<a>`;
- `onSelect` sin `href` → renderiza `<button>`, porque un enlace sin destino no es un enlace;
- `component` → adapter del enrutador del consumidor (`next/link`, `react-router`), que recibe `href`
  y los hijos.

Es la misma decisión que `Anchor` tomó en W2.2 y la que el inventario pedía («sin acoplamiento a
router»). Nebula no depende de Next.

## El último item no es un enlace

Lleva `aria-current="page"` y se renderiza como `<span>`, no como control. Un breadcrumb cuyo último
elemento navega a la página en la que ya estás es un control que no hace nada; el patrón de APG dice
que la posición actual se marca, no se enlaza.

## El colapso conserva el primero y los dos últimos

`CollapseItems` es una función pura, exportada y con test propio, porque el reparto es lo único con
lógica del componente. A partir de `collapseFrom` items (5 por defecto) deja el primero, un botón de
expandir y los dos últimos: el origen y el contexto inmediato son lo que orienta, y los intermedios
son los que sobran en una ruta profunda.

El botón de expandir es un `<button>` con nombre accesible, no un `…` decorativo: es la única forma de
llegar a los items ocultos sin ratón. Una vez expandido no se vuelve a colapsar — cerrar lo que el
usuario acaba de pedir ver no tiene sentido.

## Los separadores no existen para el lector de pantalla

Van en `<span aria-hidden>`. La estructura la da el `<ol>`: un lector anuncia «lista de 3 elementos» y
la posición de cada uno, y leer «barra» entre ellos solo añade ruido.
