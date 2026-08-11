import { CATALOG } from "../../../../lib/catalog";
import { Dict } from "../../../../lib/dictionary";
import { SOURCE_LANG } from "../../../../lib/i18n";
import { FindSection } from "../../../../lib/sections";
import { OG_SIZE, SITE_TAGLINE } from "../../../../lib/site";
import { OgImage } from "../../../../ui/og-card";

export const alt = "Nebula documentation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = FindSection(section);
  const dict = await Dict(SOURCE_LANG, "chrome");
  const title = entry === undefined ? "Guides" : (dict[entry.label] ?? entry.slug);

  return OgImage({
    eyebrow: "Guides",
    title,
    description: entry?.kind === "catalog" ? dict["catalog.lede"] : SITE_TAGLINE,
    tags: entry?.kind === "catalog" ? [`${String(CATALOG.count)} components`] : undefined,
  });
}
