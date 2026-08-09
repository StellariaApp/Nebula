import ProductSwitch from "@stellaria/nebula-demos/Patterns/ProductSwitch";
import {
  Anchor,
  Badge,
  Box,
  Card,
  GradientText,
  SimpleGrid,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { CATALOG } from "../../lib/catalog";
import { Dict } from "../../lib/dictionary";
import { AsLang } from "../../lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");

  return (
    <Box display="flex" direction="column" gap="xxl">
      <Box display="flex" direction="column" gap="md" maw="60ch">
        <Badge variant="light">{dict["home.eyebrow"]}</Badge>
        <Title order={1} fz="h1" lh="tight">
          <GradientText>{dict["home.headline"]}</GradientText>
        </Title>
        <Text fz="body1" c="text.secondary">
          {dict["home.lede"]}
        </Text>
        <Box display="flex" gap="md" wrap="wrap" align="center">
          <Anchor href="/docs/installation" fw="semibold" fz="body1">
            {dict["home.cta.start"]}
          </Anchor>
          <Anchor href="/components" fw="semibold" fz="body1" c="text.secondary">
            {dict["home.cta.browse"]} ({CATALOG.count})
          </Anchor>
        </Box>
      </Box>

      <Box display="flex" direction="column" gap="sm">
        <Title order={2} fz="h4">
          {dict["home.proof.title"]}
        </Title>
        <Text fz="body3" c="text.secondary" maw="60ch">
          {dict["home.proof.body"]}
        </Text>
        <ProductSwitch />
      </Box>

      <Box display="flex" direction="column" gap="sm">
        <Title order={2} fz="h4">
          {dict["home.pillars.title"]}
        </Title>
        <SimpleGrid cols={{ base: 1, tablet: 3 }} gap="md">
          {["theme", "a11y", "budget"].map((key) => (
            <Card key={key}>
              <Box display="flex" direction="column" gap="xxs" p="md">
                <Text fw="semibold" c="text.primary">
                  {dict[`home.pillar.${key}.title`]}
                </Text>
                <Text fz="body3" c="text.secondary">
                  {dict[`home.pillar.${key}.body`]}
                </Text>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      <Box display="flex" direction="column" gap="sm">
        <Title order={2} fz="h4">
          {dict["home.premium.title"]}
        </Title>
        <Text fz="body3" c="text.secondary" maw="60ch">
          {dict["home.premium.body"]}
        </Text>
        <Box display="flex" gap="xs" wrap="wrap">
          {["commerce", "sales", "payments", "people", "maps", "native-camera"].map((name) => (
            <Badge key={name} variant="outline">
              {name}
            </Badge>
          ))}
        </Box>
        <Text fz="caption" c="text.muted">
          {dict["home.premium.note"]}
        </Text>
      </Box>

      <Box display="flex" gap="md" wrap="wrap">
        <Anchor href="/docs/introduction">{dict["nav.docs"]}</Anchor>
        <Anchor href="/components">{dict["nav.components"]}</Anchor>
        <Anchor href="/changelog">{dict["nav.changelog"]}</Anchor>
      </Box>
    </Box>
  );
}
