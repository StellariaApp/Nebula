# ADR-185 — La barra inferior se pliega, con el tirador que el carril ya tenía

- **Estado**: **aceptada** · 2026-08-28 — decidida por el propietario
- **Cambia API pública**: **no**. `collapsed` y `onCollapse` ya existían en `AppShell.Sidebar`; lo
  que cambia es que por debajo de `tablet` **también hacen algo**. Un consumidor que no pase
  `onCollapse` no ve el tirador, igual que antes.
- **Toca**: `packages/web/src/components/AppShell/AppShell.css.ts`.
- Va sobre la barra que [ADR-184](ADR-184-la-barra-inferior-es-una-fila-y-no-flota-sobre-un-hueco.md)
  metió en el grid.

## Contexto

La barra inferior son **94 px de una pantalla de 664** — el 14 %—, y hay pasos donde quien mira
prefiere el sitio: el asistente de creación, una lista larga, cualquier cosa que se lea de arriba
abajo.

El tirador de plegado ya existía: `AppShell.Sidebar` lo pinta cuando recibe `onCollapse`, y sirve
para el carril mini de escritorio. Estaba apagado con `display: none` por debajo de `laptop`,
porque ahí el carril ya está en su forma mínima y no hay nada más que encoger. Tendido como barra
inferior sí lo hay: la barra entera.

## Decisión

**El mismo estado, `collapsed`, gobierna las dos formas.** Es coherente —«la barra está
plegada»— y no añade API que mantener.

Por debajo de `tablet`:

1. **El tirador vuelve**, a caballo del borde de arriba de la barra y centrado, con el galón
   mirando abajo. Plegada, mira arriba y se queda a la vista para devolverla: el `<aside>` conserva
   veinte píxeles de alto porque el tirador va absoluto y no cuenta para la fila.
2. **La barra deja de ocupar fila.** No basta con esconderla: como es una fila `auto` del grid, lo
   que devuelve el sitio es que su contenido mida cero.
3. **Y sigue siendo de una columna.** El selector de colapso del carril —`railMiniWidth 1fr`, para
   el modo mini— tiene más especificidad que la regla de la media query, así que ganaba también en
   el teléfono: la barra se plegaba y el contenido quedaba encajonado en la columna del carril con
   media pantalla vacía al lado. Se le devuelve la columna única con la misma especificidad y más
   tarde en la hoja.

## Consecuencias

- Medido en WebKit a 390: desplegada el `<aside>` mide 94 px; plegada, 20. **Setenta y cuatro
  píxeles de vuelta**, y el contenido pasa a usar el ancho entero.
- **El estado es el mismo que el del carril mini**, así que un consumidor que lo persista verá el
  escritorio en mini si lo plegó en el teléfono. Es la lectura correcta de «plegada», pero conviene
  saberlo antes de guardarlo en una cookie.
- El punto 3 es un fallo que ya existía y no se veía: sin barra que plegar en el teléfono, nadie
  había llegado a ese estado.
