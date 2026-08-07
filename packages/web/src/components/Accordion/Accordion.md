# Accordion

## El chevrón no tiene ranura, y es a propósito

`Accordion` expone `itemProps`, `triggerProps`, `iconProps`, `labelProps` y `panelProps`, pero **no**
`chevronProps`. El chevrón lo anima motion con un `rotate` calculado desde el estado de apertura, y
una prop de ranura ahí deja que el consumidor pise la animación sin darse cuenta —basta un `style`—.

Quien necesite otro chevrón cambia el glifo, no el nodo que lo mueve.

Es el mismo criterio que el thumb de `Switch`, y está escrito en
[el cuaderno del barrido](../../../../../docs/reviews/wn-n3-barrido-ranuras.md).
