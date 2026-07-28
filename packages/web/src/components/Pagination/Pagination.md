# Pagination

API declarativa (`page` / `total` / `onChange`) sin acoplamiento a router: el cableado de navegación queda en la app, como fija `docs/00-inventory.md` §1.10.

## El rango vive en su propio módulo

`PaginationRange` está en `pagination-range.ts`, no dentro del componente: es una función pura con bastantes casos frontera (recorte por un lado, por ambos, o sin recorte) y separarla permite probarla **como lógica pura**, sin montar React ni simular clicks. Su entrada de `size-limit` mide 192 B, así que el consumidor que solo quiera el cálculo no arrastra el componente.

Calcula cuántos números caben (`siblings * 2 + boundaries * 2 + 3`) y decide de qué lado hacen falta elipsis antes de generar el arreglo.

## La píldora del activo usa `layoutId`

En vez de repintar el fondo de cada botón, un único elemento con `layoutId` **se desplaza** de una página a otra con el spring del tema. Da continuidad visual al cambio de página y evita animar `background` en varios nodos a la vez. Con `prefers-reduced-motion` o `motion.tier: "minimal"` el salto es instantáneo.

El color se resuelve en runtime con `ScaleShade` sobre variables CSS locales, no con `data-*` + CSS estático: el tono de marca depende del tema activo.

## Dónde aterrizan las style props

En el `<nav>`, que es la raíz y el elemento al que ya apuntaba `className`. La barra visible es el `<ul>` interior, así que `mt`, `mb`, `w`, `bg` o `r` se comportan como se espera pero **`gap` no separa los controles**: ese espaciado lo fija `styles.root` sobre el `<ul>` y no es alcanzable desde fuera. Si algún día hace falta abrirlo, será como prop propia del componente, no moviendo las style props a otro elemento — `className` y las style props deben seguir describiendo el mismo nodo.

## Etiquetas

Cada instancia debería recibir su propia `labels.root`: varias `nav` con el mismo nombre accesible en una misma vista disparan `landmark-unique` en axe. El texto por defecto ("Paginación") sirve cuando solo hay una.
