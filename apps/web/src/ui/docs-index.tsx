import { Anchor, Box, Card, Text, Title } from "@stellaria/nebula-web";
import Link from "next/link";
import type { ReactElement } from "react";

import { DocIndex } from "../lib/content";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { SectionHref, type Section } from "../lib/sections";
import { PageHeader } from "./page-header";

export async function DocsIndex({ section }: { section: Section }): Promise<ReactElement> {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");
  const docs = await DocIndex(lang, section.slug);

  return (
    <Box display="flex" direction="column">
      <PageHeader title={dict[section.label]} description={dict["guides.index.lede"]} />

      <Box
        display="grid"
        gap="md"
        gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
        w="100%"
      >
        {docs.map((doc, index) => (
          <Anchor
            key={doc.slug.join("/")}
            component={Link}
            href={SectionHref(section.slug, ...doc.slug)}
            td="none"
            h="100%"
          >
            <Card withBorder r="lg" padding="md" h="100%" reveal={{ index }}>
              <Box display="flex" direction="column" gap="xs">
                <Title order={2} fz="h6" c="text.primary">
                  {doc.title}
                </Title>
                <Text fz="body3" c="text.secondary">
                  {doc.summary}
                </Text>
              </Box>
            </Card>
          </Anchor>
        ))}
      </Box>
    </Box>
  );
}
