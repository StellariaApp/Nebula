"use client";

import dynamic from "next/dynamic";

/**
 * Lo que la portada monta para ENSEÑAR el catálogo, fuera del arranque (P2 del plan de performance).
 *
 * Los tres siguen partiendo su chunk, que es lo que quita peso del arranque. Lo que cambia entre
 * ellos es si además se les quita el marcado del HTML, y eso ya no se decide igual para los tres.
 *
 * `ssr: true` en el fondo y en la superficie: sin marcado servido, el usuario ve aparecer el fondo y
 * el segmento DESPUÉS del primer pintado, y ese salto se nota más de lo que costaban. El resto del
 * sitio ya sirve el fondo sin diferir (`ui/chrome.tsx`), así que la portada era la excepción.
 *
 * En `ProductSurface` la cuenta cambió con `lazy` (ADR-154): antes servir su marcado eran los seis
 * escenarios, ahora es uno.
 *
 * `ThemePanel` se queda en `ssr: false`: no existe hasta que se abre, así que su marcado no le sirve
 * a nadie en el primer pintado.
 */

export const DeferredThemePanel = dynamic(
  async () => ({ default: (await import("./theme-panel")).ThemePanel }),
  { ssr: false },
);
