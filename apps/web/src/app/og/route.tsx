import type { NextRequest } from "next/server";

import { OgImage } from "../../ui/og-card";

const LIMIT = { title: 80, description: 160, eyebrow: 40 } as const;

function Clip(value: string | null, max: number): string | undefined {
  if (value === null) return undefined;
  const text = value.trim();
  return text === "" ? undefined : text.slice(0, max);
}

/**
 * La tarjeta parametrizada. Existe como endpoint y no como `opengraph-image` de la ruta porque el
 * router no admite nada **después** de un catch-all, y las fichas viven bajo `[...slug]`.
 */
export function GET(request: NextRequest): Response {
  const query = request.nextUrl.searchParams;
  const tags = (query.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
    .slice(0, 3);

  return OgImage({
    eyebrow: Clip(query.get("eyebrow"), LIMIT.eyebrow),
    title: Clip(query.get("title"), LIMIT.title) ?? "Nebula",
    description: Clip(query.get("description"), LIMIT.description),
    tags: tags.length === 0 ? undefined : tags,
  });
}
