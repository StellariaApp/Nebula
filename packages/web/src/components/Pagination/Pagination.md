El rango de páginas visibles (`PaginationRange`) sigue el algoritmo clásico de Mantine: calcula
cuántos números caben (`siblings * 2 + 3 + boundaries * 2`) y decide con qué lado necesita elipsis
(`…`) antes de generar el arreglo. No se extrajo a un hook porque es una función pura sin estado —
vive junto al componente para no crear un archivo con una sola función de ~15 líneas.

Los botones de página numérica resuelven color con `ScaleShade` en cada render (como `Badge`), no
con `data-*` + CSS: la página activa necesita el color de marca del tema, que solo se conoce en
runtime.
