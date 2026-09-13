# Affix

Lo que se clava a un rincón del viewport: un volver arriba, una acción flotante, una barra de
cookies. Va por un portal para que un `transform` o un `overflow` de un ancestro no se quede la
posición fija.

## `data-floating` (ADR-188)

`Affix` no sabe qué lleva dentro, así que no lo pone él: lo pone lo que flota. Una barra que tape
contenido declara `data-floating="header"` si va arriba y `"footer"` o `"dock"` si va abajo, y con
eso `useFloatingBand` y `CenterOn` de `@stellaria/nebula-hooks` saben dónde acaba el techo y dónde
empieza el suelo visibles. `Dock` lo lleva de serie; un `Affix` con una barra de acción propia lo
pasa como atributo en su hijo.
