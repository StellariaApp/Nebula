import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { Box } from "@stellaria/nebula-web";

import { FromSlug } from "../../../../../lib/catalog";
import { DocIndex, ReadDoc } from "../../../../../lib/content";
import { Dict } from "../../../../../lib/dictionary";
import { Headings } from "../../../../../lib/headings";
import { CurrentLang } from "../../../../../lib/lang";
import { CHROME_HEIGHT } from "../../../../../lib/layout";
import { FindSection, SectionHref } from "../../../../../lib/sections";
import { Toc } from "../../../../../islands/toc";
import { ComponentPage } from "../../../../../ui/component-page";
import { DocNav } from "../../../../../ui/doc-nav";
import { FallbackNotice } from "../../../../../ui/fallback-notice";
import { MDX_COMPONENTS } from "../../../../../ui/mdx";
import { PageHeader } from "../../../../../ui/page-header";

const SOURCE = "https://github.com/stellaria/nebula/edit/main/apps/docs/content";

export default async function DocPage({
  params,
}: {
  params: Promise<{ section: string; slug: string[] }>;
}) {
  const { section, slug } = await params;
  const current = FindSection(section);
  if (current === undefined) notFound();

  if (current.kind === "catalog") {
    const entry = slug.length === 1 ? FromSlug(slug[0] ?? "") : undefined;
    if (entry === undefined) notFound();
    return <ComponentPage entry={entry} />;
  }

  const lang = await CurrentLang();
  const doc = await ReadDoc(lang, section, slug);
  if (doc === null) notFound();

  const dict = await Dict(lang, "chrome");
  const { content } = await compileMDX({
    source: doc.body,
    components: MDX_COMPONENTS,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const index = await DocIndex(lang, section);
  const here = index.findIndex((entry) => entry.slug.join("/") === slug.join("/"));
  const headings = Headings(doc.body);

  return (
    <Box display="flex" direction="column" w="100%" maw={1180} mx="auto">
      <Box display="flex" align="flex-start" gap="xxl" w="100%">
        <Box display="flex" direction="column" maw={820} miw={0} grow={1}>
          {doc.fallbackFrom !== null && (
            <FallbackNotice dict={dict} from={doc.lang} section={section} slug={slug} />
          )}
          <PageHeader title={doc.front.title} description={doc.front.summary} />
          <Box display="flex" direction="column" gap="md">
            {content}
          </Box>
        </Box>

        <Toc
          headings={headings}
          offset={CHROME_HEIGHT}
          title={dict["doc.toc"] ?? ""}
          edit={{
            href: `${SOURCE}/${doc.lang}/${section}/${slug.join("/")}.mdx`,
            label: dict["doc.edit"] ?? "",
          }}
        />
      </Box>

      {here === -1 ? null : (
        <DocNav
          previous={index[here - 1]}
          next={index[here + 1]}
          base={SectionHref(section)}
          dict={dict}
        />
      )}
    </Box>
  );
}
