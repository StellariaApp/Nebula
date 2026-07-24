# FieldError

Muestra el error de un campo como **burbuja flotante** sobre el control (patrón del `Error` de fonicredito), en vez de texto inline debajo. Envuelve al control y publica el mensaje con `role="alert"`, flecha y fondo de color de estado. Es el modo por defecto de los inputs (`errorDisplay="tooltip"`).

## Por qué no usa `motion`

La burbuja anima con **CSS transition** (tokens `motion.duration`/`easing` del theme) y se apaga con `@media (prefers-reduced-motion: reduce)`. Usar la librería `motion` arrastraría ~27 kB a cada input y rompería sus budgets; el `Tooltip` interactivo genérico (hover/focus con React Aria) llega en W2.4 y podrá respaldar a FieldError más adelante.

## Estado y color

Acepta el `field: NebulaField` directo (lee `touched`+`status`+`error`) o `message`/`status`/`error` ya resueltos por el input. Con `status="validating"` muestra "Validando…" en color `info` tras un retardo de 500 ms; en error usa `error`. El color se resuelve a `scale.600` (fondo) + `scale.50` (texto) — contraste alto e independiente del tema, sin hex crudos. El mensaje es **sticky**: se conserva mientras la burbuja se desvanece.

## a11y

`role="alert"` anuncia el error al aparecer; el `<input>` conserva `aria-invalid`. El vínculo `aria-describedby` → burbuja queda como mejora futura.
