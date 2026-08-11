import { CATALOG } from "../lib/catalog";
import { OG_SIZE, SITE_TAGLINE } from "../lib/site";
import { OgImage } from "../ui/og-card";

export const alt = "Nebula — a universal UI library for web and React Native";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return OgImage({
    eyebrow: "Web + React Native",
    title: SITE_TAGLINE,
    description:
      "The contract lives in the tokens and each platform implements only the visual layer.",
    tags: [`${String(CATALOG.count)} components`, "MIT core", "WCAG 2.2 AA"],
  });
}
