const LINK_ID = "nebula-themes-rest";

/**
 * Cuelga la hoja de los quince temas que el HTML no incrusta (ADR-175). Idempotente: el script de
 * arranque puede haberla puesto ya.
 *
 * La URL **no se importa**, se lee de `data-themes-href` en el `<html>`. Importarla arrastraría el
 * módulo que compila los temas al bundle de cliente, y con él los 236 kB que este reparto existe
 * justamente para no mandar.
 */
export function EnsureThemeRest(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(LINK_ID) !== null) return;
  const href = document.documentElement.dataset["themesHref"];
  if (href === undefined) return;
  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
