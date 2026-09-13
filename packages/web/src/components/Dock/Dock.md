# Dock

La caja flotante de preferencias de una landing —idioma, moneda, tema— y su pliegue (ADR-193).
Cuatro productos llevaban la misma caja copiada: un `Affix` abajo a la derecha con un
`GlassSurface level="strong" r="lg"` en fila y, bajo `phone`, otro con un `ActionIcon` que abre un
`Popover` con los mismos controles apilados. Los controles cambian de producto a producto; la caja
no cambia nunca.

## Los controles se pintan dos veces, y por eso `children` puede ser una función

La fila y la columna son la misma cosa en dos anchos, pero un `Select` que en la fila mide 72 px en
la columna quiere el ancho entero. `children(stacked)` recibe `false` en la fila y `true` en el
popover; con un nodo suelto se pinta igual en las dos. Cada copia llama a sus propios ganchos: el
estado que leen —idioma, moneda, tema— es compartido y no hay nada que pasarse entre ellas.

## Por qué el pliegue es de la caja y no de los controles

Tres controles en fila miden ~300 px y un teléfono tiene 390: la fila tapaba casi el ancho entero
del contenido. Quién decide plegarse es quien conoce el ancho de la caja, no cada control, y por
eso `compactBelow` vive aquí. Es CSS —dos superficies, una se apaga donde la otra se enciende— y no
un `useMediaQuery`: en el primer pintado del servidor las dos existen y la hoja elige.

## `data-floating="dock"`

Las dos superficies lo llevan. Es el contrato de ADR-188: `useFloatingBand` suma los `header` como
techo y todo lo demás como suelo, así que centrar algo en pantalla lo centra sobre el dock y no
debajo de él.

## Lo que no lleva

Los controles. `Dock.Language` o `Dock.Theme` serían de Nebula sólo en apariencia: los datos, las
cookies y el `router.replace` son del producto. Y el bloque de usuario del pie de un carril tampoco
es un `Dock`: vive en `AppShell.Sidebar.Footer` y no flota.
