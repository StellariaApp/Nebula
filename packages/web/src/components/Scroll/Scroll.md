# Scroll

Contenedor con overflow y scrollbar temada (color de `border.strong`, radio `full`), presentacional y server-safe. Es la primitiva de scroll de Tier 1; no reimplementa scrollbars custom (patrón ScrollArea) — usa la barra nativa estilizada por `scrollbar-color`/`scrollbar-width` y `::-webkit-scrollbar`, que cubre el caso común sin coste de JS.

`axis` decide qué ejes hacen overflow; `gutter` reserva el hueco de la barra (`scrollbar-gutter: stable`) para evitar saltos de layout. El grosor se puede fijar con `scrollbarSize` (var local `--scrollbar-size`, 8px por defecto).

Si el contenido es desplazable, el consumidor debe hacer la región alcanzable por teclado (`tabIndex={0}` + `role`/`aria-label`) según su caso; Scroll no lo impone para no ensuciar la a11y de contenedores no desplazables.
