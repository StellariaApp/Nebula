import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Dict } from "../../../../lib/dictionary";
import { CurrentLang } from "../../../../lib/lang";
import { FindSection, SECTIONS, SectionHref } from "../../../../lib/sections";
import { SITE_DESCRIPTION } from "../../../../lib/site";
import { CatalogIndex } from "../../../../ui/catalog-index";
import { DocsIndex } from "../../../../ui/docs-index";
import { Reserved } from "../../../../ui/reserved";

/** Las seis secciones son un registro cerrado, así que la ruta se prerenderiza entera (ADR-133). */
export function generateStaticParams(): { section: string }[] {
  return SECTIONS.map((entry) => ({ section: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const entry = FindSection(section);
  if (entry === undefined) return {};

  const dict = await Dict(await CurrentLang(), "chrome");
  const title = dict[entry.label] ?? entry.slug;
  const description =
    entry.kind === "catalog" ? dict["catalog.lede"] : (dict[entry.note ?? ""] ?? SITE_DESCRIPTION);
  const canonical = SectionHref(entry.slug);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = FindSection(section);
  if (entry === undefined) notFound();

  if (entry.kind === "catalog") return <CatalogIndex />;
  if (entry.kind === "reserved") return <Reserved heading={entry.label} note={entry.note} />;
  return <DocsIndex section={entry} />;
}
