# ADR-203 — El foco inicial del modal cae en el panel, no en el botón de cerrar

- **Estado**: **aceptada** · 2026-09-13 — decidida por el propietario · **implementada** el mismo
  día. Hallazgo 6 de C3 en Polaris (`docs/reviews/rosette-a-nebula-2026-09-12.md` §7, y en Polaris
  `docs/reviews/alineacion-polaris-2026-09-12.md` §6 «Hallazgos de catálogo»).
- **Cambia API pública**: sí, y **solo añade**: `initialFocus` en `Modal` (y en `Drawer`, que
  extiende sus props). **Cambia un comportamiento por defecto**: el foco al abrir ya no cae en el
  primer focusable.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/Modal/` (`Modal.tsx`, `Modal.types.ts`, `Modal.md`,
  `__tests__/Modal.test.tsx`), `CommandPalette` y `GlobalSearch` (que fijan `initialFocus`), la
  story de `Modal` en el playground.

## Contexto

`Modal` abre con `node.showModal()`, y el `<dialog>` nativo enfoca **el primer focusable** que
encuentra. Con la cabecera de serie ése es `ButtonClose`: el modal aparecía con el aro de foco
encendido sobre «cerrar» (`modal-quitar-acceso-dark-1440.png` en Polaris), que es el control que
menos sentido tiene ofrecer al abrir una ventana, y en un diálogo de confirmación es además el que
deshace lo que el usuario acaba de pedir.

`useDialog` de React Aria tiene otro contrato: el diálogo lleva `tabIndex -1` y **se enfoca él
mismo** al montar, para que el lector anuncie el título y `Tab` lleve al primer control. Ese
enfoque existe en el código —`useDialog` lo hace en su efecto de montaje— pero no llegaba a nada:
el `<dialog>` está siempre montado y cerrado hasta que `visible` lo abre, y sobre un `<dialog>`
cerrado `focus()` no hace nada. El enfoque que mandaba era el de `showModal()`.

## Decisión

```tsx
<Modal initialFocus="dialog" | "first" | RefObject<HTMLElement | null> />
```

- **`"dialog"` es el defecto**: tras `showModal()` se enfoca el propio `<dialog>`. Ningún aro al
  abrir, el título se anuncia, `Tab` va al primer control del panel.
- **`"first"`** deja el comportamiento nativo —el primer focusable—, que es lo que quiere una
  ventana cuyo único contenido es una caja de búsqueda. `GlobalSearch` lo fija; `CommandPalette` pasa
  la ref de su campo, que tenía a mano.
- **Una ref** enfoca ese elemento si sigue dentro del diálogo y conectado; si no, cae al diálogo.
  Es el caso del formulario: el primer campo.
- El enfoque va **en el mismo efecto** que llama a `showModal()`, sin `requestAnimationFrame`:
  `OverlayMotion` monta los hijos en el render de apertura y anima `opacity`/`transform`, nunca
  `visibility`, así que el elemento es enfocable en ese instante.

## Alternativas

- **`autofocus` en el `<dialog>`**: `showModal()` lo respeta y daría el defecto gratis, pero React
  **no emite el atributo**: lo simula llamando a `focus()` al montar —sobre un `<dialog>` cerrado,
  nada— y `showModal()` nunca lo ve. Y es estático: no expresa la ref ni `"first"`.
- **Enfocar por `requestAnimationFrame`**: retrasa el anuncio del lector un frame y no hace falta.
- **Cambiar el orden del DOM** para que el botón de cierre no sea el primero: mueve el problema al
  siguiente control, que tampoco pidió el foco.

## Consecuencias

- Todo modal del catálogo abre sin aro de foco visible y con el título anunciado. Quien dependiera
  de que el primer botón recibiera el foco pasa `initialFocus="first"`.
- `Drawer` hereda la prop por `DrawerProps extends ModalProps`. `ModalDelete` no la expone: un
  diálogo de confirmación quiere el defecto.
- Test (jsdom stubea `showModal` sin mover el foco, `src/__tests__/setup.ts`): el defecto deja
  `document.activeElement` en el diálogo y no en «Close»; una ref lo deja en el campo; `"first"` no
  lo mueve por su cuenta; una ref ajena al diálogo cae en el diálogo. Lo que jsdom **no** puede
  comprobar es el `showModal()` real de `"first"`: se verifica con la story `InitialFocus` y el
  gate de teclado.
