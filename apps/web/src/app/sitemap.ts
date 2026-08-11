import type { MetadataRoute } from "next";

import { CATALOG, ComponentSlug } from "../lib/catalog";
import { DocIndex } from "../lib/content";
import { SOURCE_LANG } from "../lib/i18n";
import { SECTIONS, SectionHref } from "../lib/sections";
import { Absolute } from "../lib/site";

/**
 * Todo lo que un buscador puede visitar. `/preview/*` queda fuera a propósito: son las muestras que
 * la ficha enmarca, no páginas con contenido propio.
 */
export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const guides = await DocIndex(SOURCE_LANG, "getting-started");

  const roots = ["/", "/theme", "/changelog"];
  const sections = SECTIONS.map((section) => SectionHref(section.slug));
  const pages = guides.map((doc) => SectionHref("getting-started", ...doc.slug));
  const components = CATALOG.components.map((entry) =>
    SectionHref("components", ComponentSlug(entry.name)),
  );

  return [...roots, ...sections, ...pages, ...components].map((path) => ({
    url: Absolute(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
