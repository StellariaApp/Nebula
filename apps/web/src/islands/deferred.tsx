"use client";

import dynamic from "next/dynamic";

/**
 * Lo que la portada monta para ENSEÑAR el catálogo, fuera del arranque (P2 del plan de performance).
 *
 * Ninguna de las tres hace falta para pintar el Hero, que es el elemento que marca el LCP, y las tres
 * pesan: `ThemePanel` arrastra los temas de producto enteros, `ProductSurface` monta un escenario
 * completo bajo el pliegue y `StarField` pinta un canvas con parallax y aurora.
 *
 * `ssr: false` es deliberado y no solo aplaza el JavaScript: saca también su marcado del HTML, que es
 * donde el presupuesto de la portada iba más apretado. Son decorado y demostración — nada que un
 * buscador necesite indexar ni que el usuario vea en el primer pintado.
 */

export const DeferredBackground = dynamic(
  async () => ({ default: (await import("../ui/site-background")).SiteBackground }),
  { ssr: false },
);

export const DeferredThemePanel = dynamic(
  async () => ({ default: (await import("./theme-panel")).ThemePanel }),
  { ssr: false },
);

export const DeferredProductSurface = dynamic(
  async () => (await import("@stellaria/nebula-demos/Patterns/ProductSurface")).default,
  { ssr: false },
);
