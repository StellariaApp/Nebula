# Toast

Cola imperativa (`nebulaToast`) sobre un store de Jotai, y un único `ToastProvider` que la pinta en un portal. El consumidor no monta toasts: los pide.

## Dónde aterrizan las style props

`ToastProvider` renderiza `{children}` y, en un portal aparte, la región de notificaciones. Los children son la app entera, así que el único nodo propio del componente es esa región: ahí van la clase atómica y el estilo de dimensión.

Sirve para lo que la región necesita de verdad — `maw` para acotar el ancho de la pila, `gap` para separar los toasts, `z` para convivir con overlays ajenos. Lo que no cabe es `position`: la región es `fixed` por contrato y la prop `position` del componente elige la esquina (`top-start` … `bottom-end`), no el modo de posicionamiento CSS. Es la tercera clase de colisión de la auditoría —nombre de propiedad CSS reutilizado con otra semántica, como `position` en FieldError— y se resuelve omitiéndola de `StyleProps`.

`ToastProvider` no expone `className`: las style props son hoy la única vía de ajuste desde fuera.

## `region` va en `baseLayer`

Sin capa, `position: fixed`, `zIndex` y el `maxWidth` de la región ganarían a la clase atómica y las style props de la pila no se aplicarían. Con capa, la style prop del consumidor manda, que es el contrato de `docs/patterns/web-component-template.md` §2.
