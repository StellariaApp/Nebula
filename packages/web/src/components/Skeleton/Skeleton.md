# Skeleton

Placeholder de carga. `loading={false}` devuelve los hijos tal cual, así que el sitio de llamada no
necesita un ternario.

## El brillo va en un pseudo-elemento, y no es capricho

El shimmer animaba `background-position` sobre el propio nodo. Eso **no lo compone la GPU**: cada
fotograma repinta el elemento en el hilo principal, y un skeleton vive precisamente en el momento en
que ese hilo está más ocupado —hidratando, resolviendo un `import()`—. Medido con Lighthouse sobre un
Moto G Power emulado, la portada aparecía con tres elementos en «evita las animaciones no compuestas»,
los tres skeletons, con el motivo explícito: «propiedad CSS no compatible: background-position-x».

Ahora el degradado vive en un `::after` en absoluto que barre con `translateX(-100%)` → `100%`.
`transform` sí compone, así que el barrido se va al hilo del compositor y deja de repintar. El nodo
conserva su `surface.sunken` de fondo, de modo que el aspecto no cambia.

El `overflow: hidden` del nodo es lo que recorta el barrido a la forma del skeleton, incluido el
`radius` de la variante `circle`.

## Reduced motion apaga el pseudo, no solo la animación

`motion.still` apaga `animationName` **del nodo**, y el barrido ya no vive ahí. Por eso la regla de
`prefers-reduced-motion` de la variante pone `content: none` en el `::after`: sin eso quedaría un
degradado congelado a mitad de recorrido, que es peor que no tenerlo. Es el mismo criterio de ADR-034
—apagar el movimiento y dejar un sustituto estático estable—, aplicado a un pseudo.
