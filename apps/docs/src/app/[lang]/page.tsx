import { Anchor, Box, Text, Title } from "@stellaria/nebula-web";

import { CATALOG } from "../../lib/catalog";
import { Dict } from "../../lib/dictionary";
import { AsLang } from "../../lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column" gap="md">
      <Title order={1} c="text.primary">
        {dict["site.name"]}
      </Title>
      <Text c="text.secondary">{dict["site.tagline"]}</Text>
      <Text c="text.muted" fz="body3">
        {CATALOG.count} {dict["catalog.count"]}
      </Text>
      <Box display="flex" gap="md">
        <Anchor href="/docs/introduction">{dict["nav.docs"]}</Anchor>
        <Anchor href="/components">{dict["nav.components"]}</Anchor>
      </Box>
    </Box>
  );
}
