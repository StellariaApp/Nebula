import { notFound } from "next/navigation";

import { FindSection } from "../../../../lib/sections";
import { CatalogIndex } from "../../../../ui/catalog-index";
import { DocsIndex } from "../../../../ui/docs-index";
import { Reserved } from "../../../../ui/reserved";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = FindSection(section);
  if (entry === undefined) notFound();

  if (entry.kind === "catalog") return <CatalogIndex />;
  if (entry.kind === "reserved") return <Reserved heading={entry.label} note={entry.note} />;
  return <DocsIndex section={entry} />;
}
