import { DEFAULT_THEME } from "@stellaria/nebula-themes/web";

/** La ruta que sirve los quince temas que el HTML no incrusta. */
export const THEMES_HREF = "/themes.css";

const LINK_ID = "nebula-themes-rest";

/**
 * Corre pegado a `ThemeScript`, que ya ha resuelto la identidad y la ha puesto en `data-theme`.
 *
 * Si lo que el visitante eligio no es el tema incrustado, su regla no esta en el HTML y sin ella
 * pintaria el por defecto —no algo roto, porque `:root` lleva `nebula` entero, pero tampoco lo suyo—.
 * Asi que se cuelga la hoja del `<head>` antes del primer pintado. Solo lo paga quien eligio, y a
 * cambio ve su tema desde el primer fotograma.
 */
export const THEME_REST_SCRIPT = `(function(){
var html=document.documentElement;
if(html.getAttribute("data-theme")==="${DEFAULT_THEME}")return;
if(document.getElementById("${LINK_ID}"))return;
var link=document.createElement("link");
link.id="${LINK_ID}";
link.rel="stylesheet";
link.href="${THEMES_HREF}";
document.head.appendChild(link);
})();`;

/** Lo mismo, desde el cliente: el panel la necesita entera para poder enseñar los dieciséis. */
export function EnsureThemeRest(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(LINK_ID) !== null) return;
  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = THEMES_HREF;
  document.head.appendChild(link);
}
