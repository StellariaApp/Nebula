import { SLICES } from "@stellaria/nebula-themes/all/web";
import { DEFAULT_THEME } from "@stellaria/nebula-themes/web";

/** Los quince temas que el HTML no incrusta (ADR-175). */
export const THEMES_REST = Object.entries(SLICES)
  .filter(([name]) => name !== DEFAULT_THEME)
  .map(([, css]) => css)
  .join("");

function Hash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/**
 * La ruta va firmada por su contenido, y ese detalle no es decorativo: sin él, `immutable` deja la
 * hoja clavada un año y tocar una semilla no se ve nunca —ni en desarrollo—. Con la firma, cambiar
 * un tema cambia la URL y el navegador la pide de nuevo, así que el año de caché sigue siendo cierto.
 */
export const THEMES_HREF = `/themes.css?v=${Hash(THEMES_REST)}`;

/**
 * Corre pegado a `ThemeScript`, que ya ha resuelto la identidad y la ha puesto en `data-theme`.
 *
 * Si lo que el visitante eligió no es el tema incrustado, su regla no está en el HTML y sin ella
 * pintaría el por defecto —no algo roto, porque `:root` lleva `nebula` entero, pero tampoco lo suyo—.
 * Así que se cuelga la hoja del `<head>` antes del primer pintado. Solo lo paga quien eligió, y a
 * cambio ve su tema desde el primer fotograma.
 */
export const THEME_REST_SCRIPT = `(function(){
var html=document.documentElement;
if(html.getAttribute("data-theme")==="${DEFAULT_THEME}")return;
if(document.getElementById("nebula-themes-rest"))return;
var link=document.createElement("link");
link.id="nebula-themes-rest";
link.rel="stylesheet";
link.href="${THEMES_HREF}";
document.head.appendChild(link);
})();`;
