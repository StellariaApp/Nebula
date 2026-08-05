# Modal

Diálogo modal sobre el elemento nativo `<dialog>` (decisión de `docs/00-inventory.md` §1.9 y ADR-003: "HTML nativo donde baste"), con los props de aria de `useDialog`.

## Por qué `<dialog>` y no `useModalOverlay`

`showModal()` mete el diálogo en el **top layer**: desaparecen los conflictos de `z-index` con cualquier contenido de la app, y el navegador vuelve inerte el resto de la página y restaura el foco al cerrar. Eso ya cubre lo que `useModalOverlay` consigue con `FocusScope contain` + `ariaHideOutside`. Montar ambos duplicaría la contención de foco y las dos implementaciones compiten.

Lo que sí se toma de React Aria: `useDialog` (rol, `aria-labelledby` ligado al título, foco inicial) y `usePreventScroll` (scroll-lock con las particularidades de iOS resueltas).

## Estado y `Esc`

`<dialog>` cierra por `Esc` **directamente en el DOM**, sin pasar por React: eso desincronizaría `opened`. Por eso `onCancel` hace `preventDefault()` y delega en `onClose`, dejando que el estado del consumidor siga siendo la única fuente de verdad. `closeOnEscape={false}` simplemente no propaga el cierre.

El click fuera se detecta comparando `event.target` con el propio `<dialog>`: el backdrop pertenece al elemento, así que los clicks en el contenido tienen otro target.

**Al escribir tests**: el navegador solo emite `cancel` ante teclado real, así que `userEvent.keyboard("{Escape}")` **no cierra** el diálogo — dispara un keydown sintético y nada más. Para cubrir esa ruta hay que despachar el evento directamente (`dialog.dispatchEvent(new Event("cancel", { cancelable: true }))`), que es lo que hace el test unitario; las play functions del playground cierran por el botón de cierre.

## Animación

Entrada **y salida** con `OverlayMotion` (`overlays/overlay-motion.tsx`), y desde ADR-034 con dos ejes independientes: `preset` elige la **transformada** según el layout (`scale` centrado, `slide-down` arriba, `edge-*` en drawer, `fade` a pantalla completa) y `surface` elige la **física** —`modal` o `drawer`—. Modal es el único componente que combina ambos, porque es el único con varias transformadas para la misma superficie. La entrada usa `spring.default`; la salida, un tween acelerado más corto, como todas las salidas del catálogo.

## El `<dialog>` no es el panel

Lo fue hasta que se corrigió: el elemento nativo llevaba fondo, sombra, radio y ancho, y `OverlayMotion` animaba un `div` interior. El resultado era que el zoom del modal escalaba **el contenido dentro de una caja quieta**, y que un drawer no podía deslizar porque su caja ya estaba pegada al borde.

Ahora el reparto es:

- **`<dialog>`**: contenedor a pantalla completa, transparente, sin sombra. Aporta el top layer, el `::backdrop` y la **colocación** del panel con flexbox (`centered`, `top`, `drawer-*`).
- **`surface`**: el panel visible. Lleva fondo, sombra, radio y ancho, y es el nodo que anima.

Así la transformada actúa sobre lo que el usuario percibe como el modal. Es también lo que permite que `edge-start`/`edge-end` desplacen el panel un 100 % de su propio ancho: el `overflow: hidden` del diálogo lo recorta mientras entra.

`variables.width` se sigue publicando como var en el `<dialog>` y la consume `surface` por herencia, así que el cálculo del ancho no cambió de sitio.

**Limitación conocida**: `edge-start` y `edge-end` traducen en el eje físico (`x`), no en el lógico. En RTL el drawer entraría por el lado contrario al que indica su colocación, que sí es lógica (`justifyContent`). Se corrige cuando el catálogo aborde RTL como contrato, no antes.

La salida obliga a **retrasar el `close()` nativo**: el elemento debe seguir en el top layer mientras el contenido anima. Se resuelve con un estado local `visible` que se enciende al abrir y solo se apaga en `onExitComplete`; el efecto que llama `showModal()`/`close()` observa ese estado, no `opened`. `opened` sigue siendo la única fuente de verdad del consumidor.

El backdrop no puede animarse con motion (es un pseudo-elemento), así que entra con `@keyframes` y se desvanece por transición de `opacity` colgada de `&:not([data-open='true'])::backdrop`. `prefers-reduced-motion` reduce ambas a 0,01 ms.

**Al escribir tests o play functions**: tras cerrar, el diálogo permanece en el DOM mientras dura la salida. Las aserciones de desmontaje van dentro de `waitFor`.

## Nombre accesible del diálogo

El `aria-labelledby` se enlaza con un id propio, no con el mecanismo de _slot_ de `useDialog`: ese comprueba tras montar si existe un elemento con el id generado, y como el contenido ahora solo se monta al abrir, la comprobación fallaba y el diálogo se quedaba sin nombre (`aria-dialog-name`, serious).

## Scrim

El fondo se deriva de un rol del tema con `color-mix(in srgb, gray.950 62%, transparent)` — cero color crudo y repinta solo al cambiar de tema. `blurred` publica `blur(blur.sm)` en el `backdrop-filter`.

## Relación con Drawer

`Drawer` es este mismo componente con `drawer` fijado a un lado; la prop `drawer` se conserva en `Modal` porque la API de referencia de TFV (`docs/api/tfv-components.md` §2) la expone así y facilita la migración.
