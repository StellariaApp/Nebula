import MotionLab from "@stellaria/nebula-demos/Patterns/MotionLab";
import ProductSurface from "@stellaria/nebula-demos/Patterns/ProductSurface";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Feature,
  Footer,
  GradientText,
  Hero,
  Main,
  Reveal,
  SimpleGrid,
  Stat,
  Text,
} from "@stellaria/nebula-web";

import { CATALOG } from "../lib/catalog";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { HeroPreview } from "../islands/hero-preview";

import { SiteNav } from "../islands/site-nav";
import { ThemePanel } from "../islands/theme-panel";
import { Band } from "../ui/band";
import { SiteBackground } from "../ui/site-background";
import { Logo } from "../ui/logo";
import type { Dictionary } from "../lib/dictionary";

const PILLARS = ["theme", "a11y", "budget"] as const;

const FRAMEWORKS = ["Next.js", "Vite", "React Router"];

const INSTALL = "pnpm add @stellaria/nebula-web";

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
    <SiteNav
      links={[
        { href: "/components", label: dict["nav.components"] ?? "" },
        { href: "/docs/introduction", label: dict["nav.docs"] ?? "" },
        { href: "/theme", label: dict["nav.theme"] ?? "" },
        { href: "/changelog", label: dict["nav.changelog"] ?? "" },
      ]}
      labels={{
        site: dict["site.name"] ?? "",
        nav: dict["nav.section.reference"] ?? "",
        cta: dict["home.cta.start"] ?? "",
        menuOpen: dict["nav.menu.open"] ?? "",
        menuClose: dict["nav.menu.close"] ?? "",
        drawer: dict["nav.drawer.label"] ?? "",
      }}
    />
  );
}

function Foot({ dict }: { dict: Dictionary }) {
  return (
    <Footer glass>
      <Footer.Brand
        logo={<Logo id="foot-logo" height={24} />}
        href="/"
        description={dict["site.tagline"]}
      />
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

export default async function Home() {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");

  const NUMBERS = [
    {
      label: dict["home.stat.components"],
      value: String(CATALOG.count),
      description: dict["home.stat.components.diff"],
    },
    { label: dict["home.stat.gates"], value: "9", description: dict["home.stat.gates.note"] },
    {
      label: dict["home.stat.styleProps"],
      value: "128",
      description: dict["home.stat.styleProps.note"],
    },
    { label: dict["home.stat.themes"], value: "7", description: dict["home.stat.themes.note"] },
  ];

  return (
    <Main
      momentum
      withSkipLink
      skipLabel={dict["skip.content"]}
      header={<Bar dict={dict} />}
      footer={<Foot dict={dict} />}
      background={<SiteBackground />}
    >
      <ThemePanel
        labels={{
          open: dict["panel.open"] ?? "",
          close: dict["panel.close"] ?? "",
          region: dict["panel.region"] ?? "",
          lede: dict["panel.lede"] ?? "",
          product: dict["panel.product"] ?? "",
          scheme: dict["panel.scheme"] ?? "",
          dark: dict["panel.dark"] ?? "",
          light: dict["panel.light"] ?? "",
          motion: dict["panel.motion"] ?? "",
          glass: dict["panel.glass"] ?? "",
          corner: dict["panel.corner"] ?? "",
          density: dict["panel.density"] ?? "",
          face: dict["panel.face"] ?? "",
        }}
      />

      <Hero
        size="xl"
        mih="760px"
        contentWidth={620}
        hiper={
          <Box display="flex">
            <Badge variant="light">{dict["home.eyebrow"]}</Badge>
          </Box>
        }
        title={
          <>
            {dict["home.hero.title.a"]}
            <br />
            {dict["home.hero.title.b"]}
            <br />
            <GradientText>{dict["home.hero.title.c"]}</GradientText>
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
        right={
          <HeroPreview
            labels={{
              copy: dict["home.preview.copy"] ?? "",
              copied: dict["home.preview.copied"] ?? "",
              checks: dict["home.preview.checks"] ?? "",
              filename: dict["home.preview.file"] ?? "",
              snippetCopy: dict["home.preview.snippetCopy"] ?? "",
              code: dict["home.preview.code"] ?? "",
              result: dict["home.preview.result"] ?? "",
              view: dict["home.preview.view"] ?? "",
              tooltip: dict["home.preview.tooltip"] ?? "",
              info: dict["home.preview.info"] ?? "",
            }}
          />
        }
      />

      <Band
        glass
        level="major"
        eyebrow={dict["home.proof.eyebrow"]}
        title={dict["home.proof.title"]}
        description={dict["home.proof.body"]}
      >
        <ProductSurface />
      </Band>

      <Band level="strip" title={dict["home.numbers.title"]}>
        <SimpleGrid cols={{ base: 2, tablet: 4 }} gap="lg">
          {NUMBERS.map((item) => (
            <Stat
              key={String(item.label)}
              size="lg"
              label={item.label}
              value={item.value}
              description={item.description}
            />
          ))}
        </SimpleGrid>
      </Band>

      <Band
        center
        level="major"
        eyebrow={dict["home.reach.eyebrow"]}
        title={dict["home.pillars.title"]}
        description={dict["home.reach.body"]}
      >
        <Box display="flex" direction="column" gap="xl">
          <SimpleGrid cols={{ base: 1, tablet: 3 }} gap="xl">
            {PILLARS.map((key, index) => (
              <Reveal key={key} component="article" index={index}>
                <Feature
                  icon={GLYPH[key]}
                  title={dict[`home.pillar.${key}.title`]}
                  description={dict[`home.pillar.${key}.body`]}
                />
              </Reveal>
            ))}
          </SimpleGrid>
        </Box>
      </Band>

      <Band
        glass
        level="minor"
        eyebrow={dict["home.motion.eyebrow"]}
        title={dict["home.motion.title"]}
        description={dict["home.motion.body"]}
      >
        <MotionLab />
      </Band>

      <Band
        center
        level="closing"
        title={dict["home.closing.title"]}
        description={dict["home.closing.body"]}
      >
        <Box display="flex" direction="column" gap="lg" align="center">
          <SimpleGrid cols={{ base: 1, tablet: 3 }} gap="md" w="100%">
            {FRAMEWORKS.map((name) => (
              <Card key={name} withBorder r="md" p="md">
                <Box display="flex" direction="column" gap="xs" align="flex-start">
                  <Text fz="body2" fw="semibold">
                    {name}
                  </Text>
                  <Code>{INSTALL}</Code>
                </Box>
              </Card>
            ))}
          </SimpleGrid>
          <Box display="flex" gap="md" wrap="wrap" justify="center">
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
        </Box>
      </Band>
    </Main>
  );
}
