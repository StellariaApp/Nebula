# Modal

Diálogo modal sobre el elemento nativo `<dialog>` (decisión de `docs/00-inventory.md` §1.9 y ADR-003: "HTML nativo donde baste"), con los props de aria de `useDialog`.

## Por qué `<dialog>` y no `useModalOverlay`

`showModal()` mete el diálogo en el **top layer**: desaparecen los conflictos de `z-index` con cualquier contenido de la app, y el navegador vuelve inerte el resto de la página y restaura el foco al cerrar. Eso ya cubre lo que `useModalOverlay` consigue con `FocusScope contain` + `ariaHideOutside`. Montar ambos duplicaría la contención de foco y las dos implementaciones compiten.

Lo que sí se toma de React Aria: `useDialog` (rol, `aria-labelledby` ligado al título, foco inicial) y `usePreventScroll` (scroll-lock con las particularidades de iOS resueltas).

## Estado y `Esc`

`<dialog>` cierra por `Esc` **directamente en el DOM**, sin pasar por React: eso desincronizaría `opened`. Por eso `onCancel` hace `preventDefault()` y delega en `onClose`, dejando que el estado del consumidor siga siendo la única fuente de verdad. `closeOnEscape={false}` simplemente no propaga el cierre.

El click fuera se detecta en el **`pointerdown`**, no en el `click`, y se apoya en tres comprobaciones: el target es el propio `<dialog>` (el backdrop pertenece al elemento, así que los clicks en el contenido tienen otro target), el punto cae fuera del rectángulo del panel, y el panel no está `inert`.

Comparar solo `event.target` en el `click` no basta, y el fallo era real: `ariaHideOutside` de React Aria marca con **`inert`** todo lo que queda fuera de un popover abierto —incluido el panel—, y Chrome **excluye los subárboles `inert` del hit-testing**. Al pulsar el trigger de un `Select` dentro del panel, el `pointerdown` caía en el trigger, el popover se abría, el panel pasaba a `inert` y el `pointerup` ya aterrizaba en el `<dialog>`; el navegador resuelve entonces el `click` en el **ancestro común**, que es el `<dialog>`, y el modal se cerraba solo al abrir un desplegable.

Anclar la decisión al `pointerdown` la toma cuando el DOM todavía describe lo que el usuario pulsó. De paso da el comportamiento correcto por capas: con un popover abierto el panel está `inert`, así que el primer click fuera cierra **solo el popover** y hace falta un segundo para cerrar el modal. La prueba de `inert` es lo único acoplado a un detalle de React Aria; si algún día deja de usarlo, la prueba del rectángulo sigue evitando el cierre indebido y solo se pierde ese escalonado.

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

## Los overlays de los hijos se portalean dentro del diálogo

El top layer que aporta `showModal()` tiene una contrapartida: **nada que quede fuera del `<dialog>` puede pintarse encima**, por muchísimo `z-index` que lleve, y el navegador además vuelve inerte el resto del documento. Los overlays del catálogo (`Select`, `Combobox`, `MultiSelect`, `Menu`, `Popover`, `Tooltip`, `HoverCard`, `DatePicker`, `ColorInput`) montan su capa flotante con el `Overlay` de React Aria, que portalea a `document.body`. Dentro de un `Modal` o un `Drawer` eso los dejaba invisibles e inertes: el trigger abría, el chevron giraba y no aparecía nada.

El arreglo es un `UNSAFE_PortalProvider` que envuelve todo el contenido y apunta a un nodo vacío (`styles.portal`, `display: contents`) que el propio `<dialog>` renderiza después del panel. `Overlay` consulta ese contexto antes de caer en `document.body`, así que cualquier capa flotante de cualquier descendiente aterriza dentro del top layer y por detrás del panel en orden de DOM —sin `z-index` de por medio—. No hace falta tocar ningún componente hijo.

El nodo destino se guarda en estado (`ref` de callback), no en un `useRef`: si un overlay ya nace abierto, en el primer render el ref todavía valdría `null`, `Overlay` devolvería `null` y nada volvería a re-renderizar. El `set` del estado sí programa ese segundo render.

`display: contents` mantiene el nodo fuera del flexbox de colocación del diálogo, y lo que se portalea (`position: fixed` en popover y underlay) queda fuera de flujo de todos modos. El destino cuelga del `<dialog>` y no del panel a propósito: `OverlayMotion` transforma el panel, y una transformada crea bloque contenedor para los `position: fixed` de dentro, que quedarían mal colocados.

Es también una corrección de a11y: con el popover colgando de `document.body`, el `ariaHideOutside` de `usePopover` marcaba `aria-hidden="true"` sobre el `<dialog>` entero mientras el desplegable estuviera abierto.

Mover los overlays al top layer cambia también quién recibe los clicks; eso está tratado arriba, en «Estado y `Esc`».

## Nombre accesible del diálogo

El `aria-labelledby` se enlaza con un id propio, no con el mecanismo de _slot_ de `useDialog`: ese comprueba tras montar si existe un elemento con el id generado, y como el contenido ahora solo se monta al abrir, la comprobación fallaba y el diálogo se quedaba sin nombre (`aria-dialog-name`, serious).

## Scrim

El fondo se deriva de un rol del tema con `color-mix(in srgb, gray.950 62%, transparent)` — cero color crudo y repinta solo al cambiar de tema. `blurred` publica `blur(blur.sm)` en el `backdrop-filter`.

## Relación con Drawer

`Drawer` es este mismo componente con `drawer` fijado a un lado; la prop `drawer` se conserva en `Modal` porque la API de referencia de TFV (`docs/api/tfv-components.md` §2) la expone así y facilita la migración.
