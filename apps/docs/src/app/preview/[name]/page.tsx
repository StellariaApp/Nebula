import { notFound } from "next/navigation";

import { FromSlug } from "../../../lib/catalog";
import { FindSurface } from "../../../surfaces";

/** La muestra sola, sin cromado: es lo que la ficha enmarca en su `iframe`. */
export default async function SurfacePreview({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const entry = FromSlug(name);
  const surface = entry === undefined ? undefined : FindSurface(entry.name);
  if (surface === undefined) notFound();

  return surface.node;
}
