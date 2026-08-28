# `useMomentumScroll`

## `OwnedByNested` no resuelve estilo salvo que haga falta

El listener de `wheel` es `passive: false` —tiene que poder cancelar el evento— así que todo lo que
haga corre **antes** de que el navegador desplace, en el hilo principal y por cada muesca de la rueda.

`OwnedByNested` sube por los ancestros buscando un scroller anidado con recorrido. Preguntaba primero
por el `overflow`, y `getComputedStyle` **vacía el estilo pendiente**: un recálculo forzado por
ancestro y por muesca, justo mientras el usuario desplaza y justo cuando la hoja está más sucia.

El orden ahora es el barato primero: `scrollHeight - clientHeight` y `scrollTop` son lecturas de
layout que no piden estilo, y descartan casi todos los ancestros —la mayoría no desborda, o desborda
pero ya está en el tope hacia donde va el gesto—. Sólo a los que sobreviven se les pregunta el
`overflow`. La decisión es idéntica; lo que cambia es cuántas veces se paga por ella.
