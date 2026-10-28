# Dialog

Panel **no modal** anclado a una esquina de la pantalla, para avisos que acompañan al trabajo: «Sincronizando», «Conexión perdida». No es el diálogo modal: ese es `Modal`.

## Por qué se llama Dialog y se comporta como un aviso

El nombre viene de la librería semilla. Aquí no bloquea la página, no atrapa el foco y no tiene `aria-modal`; se anuncia como `role="status"` con `aria-live` (`polite` por defecto, `assertive` con `live`). Si necesitas una ventana que interrumpa y pida una decisión, usa `Modal`; si el aviso es breve y se retira solo, `Toast`.

## Contrato

- `aria-label` nombra la región cuando no hay `title`.
- El botón de cerrar solo existe con `onClose`, y su nombre accesible sale de `closeLabel` (en inglés por defecto, para que el copy lo ponga quien lo usa).
- Se monta en un portal; `withinPortal={false}` lo deja en su sitio.
- Entra y sale con un resorte suave. Con `prefers-reduced-motion` o `motion.tier: "minimal"` aparece sin animar.
