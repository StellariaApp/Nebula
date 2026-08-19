import { THEMES_REST } from "../../lib/theme-rest.server";

/**
 * Los quince temas que el HTML no incrusta (ADR-175).
 *
 * El layout manda la base y el tema por defecto, que es lo que pinta la primera visita. El resto
 * vive aqui y lo pide quien de verdad lo necesita: el panel al abrirse, o el propio script de
 * arranque cuando el tema guardado no es el incrustado.
 *
 * `immutable` es cierto porque la URL va firmada por el contenido —ver `THEMES_HREF`—: si un tema
 * cambia, cambia la firma y con ella la peticion.
 */
export function GET(): Response {
  return new Response(THEMES_REST, {
    headers: {
      "content-type": "text/css; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
