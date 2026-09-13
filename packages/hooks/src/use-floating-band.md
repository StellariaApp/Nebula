# use-floating-band

El contrato de las barras flotantes (ADR-188). Toda barra que flota sobre el contenido lleva
`data-floating="header" | "footer" | "dock"`: `AppShell.Header` y `AppShell.Subbar` cuando van
pegados, `Nav` cuando flota, `Dock` siempre, y la cabecera que cuelga de `AppShell.Section`. El
consumidor lo pone a mano en lo suyo —una barra de acción fija al pie de una pantalla—.

`FloatingBand(height)` recorre esos nodos y devuelve dónde acaba el **techo** visible (el borde
inferior más bajo de los `header`) y dónde empieza el **suelo** (el borde superior más alto de lo
demás). Los que miden cero no cuentan: un dock plegado por una media query no descuenta nada.

`CenterOn(el)` centra un elemento **entre los dos** y en el contenedor que scrollea de verdad: sube
por los ancestros hasta el primero con `overflow-y` auto/scroll y recorrido, y si no hay ninguno,
el documento. Sin esto «centrar en pantalla» centra en la ventana, y bajo una cabecera pegada de
120 px lo centrado queda tapado por arriba.

`useFloatingBand()` es lo mismo mantenido al día en scroll (en captura, para oír los contenedores
que scrollean dentro) y en resize. `useScrollSpy` lo usa como `chrome` cuando no se le pasa uno.
