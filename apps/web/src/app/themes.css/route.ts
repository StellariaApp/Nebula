import { SLICES } from "@stellaria/nebula-themes/all/web";
import { DEFAULT_THEME } from "@stellaria/nebula-themes/web";

/**
 * Los quince temas que el HTML NO incrusta (ADR-175).
 *
 * El layout manda la base y el tema por defecto, que es lo que pinta la primera visita. El resto
 * vive aqui y lo pide quien de verdad lo necesita: el panel al abrirse, o el propio script de
 * arranque cuando el tema guardado no es el incrustado.
 *
 * La respuesta es inmutable porque su contenido esta horneado en el build: si un tema cambia, cambia
 * el build y con el la URL del bundle que la pide.
 */
const REST = Object.entries(SLICES)
  .filter(([name]) => name !== DEFAULT_THEME)
  .map(([, css]) => css)
  .join("");

export function GET(): Response {
  return new Response(REST, {
    headers: {
      "content-type": "text/css; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
