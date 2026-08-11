/**
 * El origen público. Sale del entorno porque las URL absolutas de las etiquetas sociales y del
 * sitemap no pueden deducirse de la petición en build.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nebula.stellaria.dev";

export const SITE_NAME = "Nebula";

export const SITE_TAGLINE = "One catalogue, two platforms, zero forks";

export const SITE_DESCRIPTION =
  "A universal UI library for web and React Native. The contract lives in the tokens and each platform implements only the visual layer, so two products that look nothing alike ship from the same components.";

/** El eje de marca de ADR-020, que es lo que pinta el fondo de las tarjetas sociales. */
export const BRAND = { from: "#3F37C9", to: "#9D4EDD", ink: "#F7F7FB", paper: "#0B0B10" } as const;

/** Lo que piden Open Graph y Twitter: 1200×630 y una relación 1.91:1. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function Absolute(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export interface OgQuery {
  eyebrow?: string | undefined;
  title: string;
  description?: string | undefined;
  tags?: readonly string[] | undefined;
}

/** La URL de la tarjeta social de una página, que se pinta en `/og` con estos parámetros. */
export function OgHref({ eyebrow, title, description, tags }: OgQuery): string {
  const query = new URLSearchParams({ title });
  if (eyebrow !== undefined) query.set("eyebrow", eyebrow);
  if (description !== undefined) query.set("description", description);
  if (tags !== undefined && tags.length > 0) query.set("tags", tags.join(","));
  return `/og?${query.toString()}`;
}
