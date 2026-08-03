## `glass` — el pie como superficie, no como chrome

Apagado por defecto. Cuando se enciende, el pie toma **la receta de superficie** —`glass.subtle`, la
misma que `Card` y `Paper`— y no la de chrome que usa `Nav`.

No es una elección estética: por [ADR-078](../../../../../docs/adr/ADR-078-el-cristal-es-una-receta-por-clase-de-superficie.md)
la clase de cristal la decide el componente según **qué es**, no según dónde está. Un pie no flota
sobre el contenido mientras se desplaza —eso es chrome—, sino que cierra la página como una
superficie más. Darle `glass.default` lo pondría a competir con el nav, que sí es chrome y sí
necesita separarse del contenido que le pasa por debajo.

El borde superior sale de la misma receta, de modo que filo y velo van a juego. Con `withBorder` y
sin `glass`, el borde sigue siendo `border.subtle`.
