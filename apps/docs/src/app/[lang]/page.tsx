import ProductSwitch from "@stellaria/nebula-demos/Patterns/ProductSwitch";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Divider,
  Feature,
  Footer,
  GlassSurface,
  GradientBorder,
  GradientText,
  Hero,
  Main,
  Nav,
  Reveal,
  Section,
  SimpleGrid,
  StarField,
  Stat,
  Text,
} from "@stellaria/nebula-web";

import { CATALOG } from "../../lib/catalog";
import { Dict } from "../../lib/dictionary";
import { AsLang } from "../../lib/i18n";
import { ThemeFab } from "../../islands/theme-fab";
import { Logo, Mark } from "../../ui/logo";
import type { Dictionary } from "../../lib/dictionary";

const PREMIUM = ["commerce", "sales", "payments", "people", "maps", "native-camera"];

const SNIPPET = `import { Button, Card, Stat } from "@stellaria/nebula-web";

export function Panel() {
  return (
    <Card withBorder p="lg">
      <Stat label="Closing days" value="4" diff="-62 %" trend="down" />
      <Button variant="gradient">Deploy</Button>
    </Card>
  );
}`;

const GLYPH = {
  theme: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
    </svg>
  ),
  a11y: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M4 8h16M12 10v10M12 14l-4 6M12 14l4 6" />
    </svg>
  ),
  budget: (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 17l5-6 4 4 5-8 4 5" />
    </svg>
  ),
};

function Bar({ dict }: { dict: Dictionary }) {
  return (
    <Nav component="header" aria-label={dict["site.name"]} floating>
      <Nav.Logo href="/" aria-label={dict["site.name"]}>
        <Logo id="nav-logo" height={26} />
      </Nav.Logo>
      <Nav.Links aria-label={dict["nav.section.reference"]} justify="center">
        <Nav.Links.Link href="/components">{dict["nav.components"]}</Nav.Links.Link>
        <Nav.Links.Link href="/docs/introduction">{dict["nav.docs"]}</Nav.Links.Link>
        <Nav.Links.Link href="/theme">{dict["nav.theme"]}</Nav.Links.Link>
        <Nav.Links.Link href="/changelog">{dict["nav.changelog"]}</Nav.Links.Link>
      </Nav.Links>
      <Nav.Actions>
        <Badge variant="light" color="warning">
          v0
        </Badge>
        <Button component="a" href="/docs/installation" size="sm" variant="gradient">
          {dict["home.cta.start"]}
        </Button>
      </Nav.Actions>
    </Nav>
  );
}

function Preview() {
  return (
    <GradientBorder beam radius="xl" width={2} w="100%" maw={540}>
      <GlassSurface p="lg" display="flex" direction="column" gap="md" r="inherit">
        <Box display="flex" align="center" gap="xs">
          <Mark id="preview-mark" size={20} />
          <Code>app/panel.tsx</Code>
        </Box>
        <Code block fz="caption">
          {SNIPPET}
        </Code>
        <Divider />
        <Box display="flex" align="center" gap="sm" wrap="wrap">
          <Button size="sm" variant="gradient">
            Deploy
          </Button>
          <Button size="sm" variant="outline">
            Preview
          </Button>
          <Badge variant="light" color="success">
            614 axe checks
          </Badge>
        </Box>
      </GlassSurface>
    </GradientBorder>
  );
}

function Foot({ dict }: { dict: Dictionary }) {
  return (
    <Footer glass>
      <Footer.Brand logo={<Logo id="foot-logo" height={24} />} href="/">
        {dict["site.tagline"]}
      </Footer.Brand>
      <Footer.Group title={dict["nav.section.learn"]}>
        <Footer.Group.Link href="/docs/installation">{dict["home.cta.start"]}</Footer.Group.Link>
        <Footer.Group.Link href="/docs/introduction">{dict["nav.docs"]}</Footer.Group.Link>
      </Footer.Group>
      <Footer.Group title={dict["nav.section.reference"]}>
        <Footer.Group.Link href="/components">{dict["nav.components"]}</Footer.Group.Link>
        <Footer.Group.Link href="/theme">{dict["nav.theme"]}</Footer.Group.Link>
        <Footer.Group.Link href="/changelog">{dict["nav.changelog"]}</Footer.Group.Link>
      </Footer.Group>
      <Footer.Legal>{dict["home.legal"]}</Footer.Legal>
    </Footer>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = AsLang(raw);
  const dict = await Dict(lang, "chrome");

  return (
    <Main
      momentum
      withSkipLink
      skipLabel={dict["skip.content"]}
      header={<Bar dict={dict} />}
      footer={<Foot dict={dict} />}
      background={<StarField parallax aurora translucency={2} />}
    >
      <ThemeFab
        labels={{ dark: dict["theme.to.dark"] ?? "", light: dict["theme.to.light"] ?? "" }}
      />

      <Hero
        size="xl"
        mih="820px"
        contentWidth={640}
        hiper={<Badge variant="light">{dict["home.eyebrow"]}</Badge>}
        title={
          <>
            One catalogue.
            <br />
            Two platforms.
            <br />
            <GradientText>Zero forks.</GradientText>
          </>
        }
        description={dict["home.lede"]}
        actions={
          <>
            <Button component="a" href="/docs/installation" size="lg" variant="gradient">
              {dict["home.cta.start"]}
            </Button>
            <Button component="a" href="/components" size="lg" variant="glass">
              {dict["home.cta.browse"]} ({CATALOG.count})
            </Button>
          </>
        }
        right={<Preview />}
      />

      <Section
        size="xl"
        reveal
        glass
        title={dict["home.proof.title"]}
        description={dict["home.proof.body"]}
      >
        <ProductSwitch />
      </Section>

      <Section size="xl" reveal title={dict["home.numbers.title"]}>
        <SimpleGrid cols={{ base: 2, tablet: 4 }} spacing="md" gap="lg">
          <Stat label={dict["home.stat.components"]} value={String(CATALOG.count)} />
          <Stat label={dict["home.stat.gates"]} value="8" />
          <Stat label={dict["home.stat.styleProps"]} value="128" />
          <Stat label={dict["home.stat.themes"]} value="2" />
        </SimpleGrid>
      </Section>

      <Section size="xl" reveal glass title={dict["home.pillars.title"]}>
        <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md" gap="xl">
          {(["theme", "a11y", "budget"] as const).map((key, index) => (
            <Reveal key={key} component="article" index={index}>
              <Feature
                icon={GLYPH[key]}
                title={dict[`home.pillar.${key}.title`]}
                description={dict[`home.pillar.${key}.body`]}
              />
            </Reveal>
          ))}
        </SimpleGrid>
      </Section>

      <Section
        size="xl"
        reveal
        title={dict["home.premium.title"]}
        description={dict["home.premium.body"]}
        footer={
          <Text fz="caption" c="text.muted">
            {dict["home.premium.note"]}
          </Text>
        }
      >
        <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md" gap="md">
          {PREMIUM.map((name, index) => (
            <Reveal key={name} component="article" index={index}>
              <Card
                withBorder
                radius="md"
                p="md"
                h="100%"
                display="flex"
                direction="column"
                gap="xs"
              >
                <Code>@stellaria/nebula-{name}</Code>
                <Badge variant="outline" size="sm" color="accent">
                  {dict["home.premium.badge"]}
                </Badge>
              </Card>
            </Reveal>
          ))}
        </SimpleGrid>
      </Section>

      <Section size="xl" reveal glass title={dict["home.closing.title"]}>
        <Box display="flex" gap="md" wrap="wrap">
          <Button component="a" href="/docs/installation" size="lg" variant="gradient">
            {dict["home.cta.start"]}
          </Button>
          <Button
            component="a"
            href="https://github.com/stellaria/nebula"
            size="lg"
            variant="glass"
          >
            {dict["home.cta.source"]}
          </Button>
        </Box>
      </Section>
    </Main>
  );
}
