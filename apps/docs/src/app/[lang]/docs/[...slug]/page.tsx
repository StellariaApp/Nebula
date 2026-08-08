import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";

import { Box, Text } from "@stellaria/nebula-web";

import { AllSlugs, ReadDoc } from "../../../../lib/content";
import { Dict } from "../../../../lib/dictionary";
import { AsLang } from "../../../../lib/i18n";
import { FallbackNotice } from "../../../../ui/fallback-notice";
import { MDX_COMPONENTS } from "../../../../ui/mdx";

export async function generateStaticParams() {
  return (await AllSlugs()).map(({ lang, slug }) => ({ lang, slug }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>;
}) {
  const { lang: raw, slug } = await params;
  const lang = AsLang(raw);
  const doc = await ReadDoc(lang, slug);
  if (doc === null) notFound();

  const dict = await Dict(lang, "chrome");
  const { content } = await compileMDX({ source: doc.body, components: MDX_COMPONENTS });

  return (
    <Box display="flex" direction="column" gap="sm" maw={760}>
      {doc.fallbackFrom !== null && <FallbackNotice dict={dict} from={doc.lang} slug={slug} />}
      <Text fz="caption" c="text.muted">
        {doc.front.summary}
      </Text>
      {content}
    </Box>
  );
}
