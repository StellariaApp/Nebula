# Stat

Cifra con rótulo, glifo opcional, cambio con tendencia y descripción. Cada parte tiene su ranura
(`labelProps`, `valueProps`, `diffProps`…) y la tendencia viaja como `data-trend` en el cambio, que
es de donde sale el color de la flecha.

## `uppercase` — el rótulo en versalitas o en caja normal

ADR-200. El catálogo pinta el rótulo en versalitas con tracking ancho (`letterSpacing.wide`), y así
sigue por defecto. Rosette descartó las versalitas porque no existen en ninguna otra pantalla del
producto (`docs/07` §10), y no había forma limpia de quitarlas: `labelProps={{ tt: "none", ls:
"normal" }}` funciona porque las style props viven en la capa `util`, que manda sobre `component`,
pero es anular una decisión visual desde fuera en vez de pedirla.

`uppercase={false}` quita las dos cosas a la vez —caja y tracking—, porque el tracking ancho sólo
tiene sentido sobre versalitas. Se implementa como clase condicional (`label_uppercase`) sobre la
base del rótulo, y el rótulo lleva `data-uppercase="true"` mientras está en versalitas, para que un
consumidor o una prueba lo distinga sin depender de la clase.
