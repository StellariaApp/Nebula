import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { Box } from "@stellaria/nebula-web";

import { ReadDoc } from "../../../../lib/content";
import { Dict } from "../../../../lib/dictionary";
import { CurrentLang } from "../../../../lib/lang";
import { FallbackNotice } from "../../../../ui/fallback-notice";
import { MDX_COMPONENTS } from "../../../../ui/mdx";
import { PageHeader } from "../../../../ui/page-header";

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const lang = await CurrentLang();
  const doc = await ReadDoc(lang, slug);
  if (doc === null) notFound();

  const dict = await Dict(lang, "chrome");
  const { content } = await compileMDX({ source: doc.body, components: MDX_COMPONENTS });

  return (
    <Box display="flex" direction="column" maw={760}>
      {doc.fallbackFrom !== null && <FallbackNotice dict={dict} from={doc.lang} slug={slug} />}
      <PageHeader title={doc.front.title} description={doc.front.summary} />
      <Box display="flex" direction="column" gap="sm">
        {content}
      </Box>
    </Box>
  );
}
