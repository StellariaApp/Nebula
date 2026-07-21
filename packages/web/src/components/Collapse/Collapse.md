# Collapse

Anima la apertura/cierre de un bloque entre `height: auto` y `0` (con `opacity`), `overflow: hidden`. Animar `height` está permitido aquí porque es una **transición discreta** (abrir/cerrar), no un hot path continuo (docs/03 §2 restringe height solo en interacciones continuas). Se apaga con `useReducedMotion()` y con `motion.tier: "minimal"`. Cuando está cerrado marca `aria-hidden` para sacar el contenido del árbol de accesibilidad.
