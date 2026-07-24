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

Entrada por `@keyframes` de CSS con los tokens `motion.duration.fast`/`easing`, y `prefers-reduced-motion` la reduce a 0,01 ms. **No hay animación de salida**: requeriría retrasar el `close()` real del elemento y mantener un estado de "cerrando" que se desincroniza con `opened`. Es un intercambio consciente; si se necesita, el sitio para resolverlo es un `Transition` alrededor del contenido, no del `<dialog>`.

## Scrim

El fondo se deriva de un rol del tema con `color-mix(in srgb, gray.950 62%, transparent)` — cero color crudo y repinta solo al cambiar de tema. `blurred` publica `blur(blur.sm)` en el `backdrop-filter`.

## Relación con Drawer

`Drawer` es este mismo componente con `drawer` fijado a un lado; la prop `drawer` se conserva en `Modal` porque la API de referencia de TFV (`docs/api/tfv-components.md` §2) la expone así y facilita la migración.
