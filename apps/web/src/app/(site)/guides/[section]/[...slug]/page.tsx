import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

import { Flex } from "@stellaria/nebula-web";
import { Toc } from "../../../../../islands/toc";
import { CATALOG, ComponentSlug, FromSlug } from "../../../../../lib/catalog";
import { DocIndex, ReadDoc } from "../../../../../lib/content";
import { Dict } from "../../../../../lib/dictionary";
import { Headings } from "../../../../../lib/headings";
import { SOURCE_LANG } from "../../../../../lib/i18n";
import { CurrentLang } from "../../../../../lib/lang";
import { FindSection, SectionHref } from "../../../../../lib/sections";
import { CONTENT_PATH, OgHref, REPO_URL, SITE_DESCRIPTION } from "../../../../../lib/site";
import { ComponentPage } from "../../../../../ui/component-page";
import { DocNav } from "../../../../../ui/doc-nav";
import { FallbackNotice } from "../../../../../ui/fallback-notice";
import { MDX_COMPONENTS } from "../../../../../ui/mdx";
import { PageHeader } from "../../../../../ui/page-header";

const SOURCE = `${REPO_URL}/edit/main/${CONTENT_PATH}`;

/**
 * Las mismas tres fuentes que enumera el sitemap —el índice de documentos y el registro del
 * catálogo—, para que ruta prerenderizada y URL anunciada no puedan discrepar (ADR-133).
 */
export async function generateStaticParams(): Promise<{ section: string; slug: string[] }[]> {
  const docs = await DocIndex(SOURCE_LANG, "getting-started");

  return [
    ...docs.map((doc) => ({ section: "getting-started", slug: doc.slug })),
    ...CATALOG.components.map((entry) => ({
      section: "components",
      slug: [ComponentSlug(entry.name)],
    })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string[] }>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const current = FindSection(section);
  if (current === undefined) return {};

  const lang = await CurrentLang();
  const canonical = SectionHref(section, ...slug);

  if (current.kind === "catalog") {
    const entry = FromSlug(slug[0] ?? "");
    if (entry === undefined) return {};

    const doc = await ReadDoc(lang, section, [slug[0] ?? ""]);
    const description =
      doc?.front.summary ??
      `${entry.name} in the Nebula catalogue: props, slot props and the entry point it ships from.`;

    const card = OgHref({
      eyebrow: entry.family ?? "Components",
      title: entry.name,
      description,
      tags: [
        entry.subpath === "." ? "@stellaria/nebula-web" : (entry.subpath ?? ""),
        entry.boundary,
        ...(entry.budget === null ? [] : [entry.budget]),
      ],
    });

    return {
      title: entry.name,
      description,
      alternates: { canonical },
      openGraph: {
        title: entry.name,
        description,
        url: canonical,
        type: "article",
        images: [card],
      },
      twitter: { images: [card] },
    };
  }

  const doc = await ReadDoc(lang, section, slug);
  if (doc === null) return {};

  const description = doc.front.summary || SITE_DESCRIPTION;
  const card = OgHref({ eyebrow: "Guides", title: doc.front.title, description });

  return {
    title: doc.front.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: doc.front.title,
      description,
      url: canonical,
      type: "article",
      images: [card],
    },
    twitter: { images: [card] },
  };
}

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
    <>
      <Flex justify="flex-start" align="flex-start" gap="xl" flex={1}>
        <Flex direction="column" maw={820} miw={0} grow={1} data-pagefind-body>
          {doc.fallbackFrom !== null && (
            <FallbackNotice dict={dict} from={doc.lang} section={section} slug={slug} />
          )}
          <PageHeader title={doc.front.title} description={doc.front.summary} />
          <Flex direction="column" gap="md">
            {content}
          </Flex>
        </Flex>

        <Toc
          headings={headings}
          title={dict["doc.toc"] ?? ""}
          edit={{
            href: `${SOURCE}/${doc.lang}/${section}/${slug.join("/")}.mdx`,
            label: dict["doc.edit"] ?? "",
          }}
        />
      </Flex>

      {here === -1 ? null : (
        <DocNav
          previous={index[here - 1]}
          next={index[here + 1]}
          base={SectionHref(section)}
          dict={dict}
        />
      )}
    </>
  );
}
