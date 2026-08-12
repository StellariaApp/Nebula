import type { Metadata } from "next";

import MotionLab from "@stellaria/nebula-demos/Patterns/MotionLab";
import ProductSurface from "@stellaria/nebula-demos/Patterns/ProductSurface";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Feature,
  Flex,
  GlassSurface,
  GradientText,
  Hero,
  Main,
  Reveal,
  SimpleGrid,
  Stat,
  Text,
} from "@stellaria/nebula-web";

import { CATALOG } from "../lib/catalog";
import { GuidesHome } from "../lib/content";
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { DEFAULT_SECTION, SectionHref } from "../lib/sections";
import { HeroPreview } from "../islands/hero-preview";

import { SiteNav } from "../islands/site-nav";
import { ThemePanel } from "../islands/theme-panel";
import { Band } from "../ui/band";
import { SiteBackground } from "../ui/site-background";
import { SiteFooter } from "../ui/site-footer";
import type { Dictionary } from "../lib/dictionary";

export const metadata: Metadata = { alternates: { canonical: "/" } };

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

function Bar({ dict, guides }: { dict: Dictionary; guides: string }) {
  return (
    <SiteNav
      links={[
        { href: guides, label: dict["nav.docs"] ?? "" },
        { href: SectionHref("components"), label: dict["section.components"] ?? "" },
        { href: "/theme", label: dict["nav.theme"] ?? "" },
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

export default async function Home() {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");
  const guides = await GuidesHome(lang);

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

  const LINKED_DATA = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}#site`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareSourceCode",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        codeRepository: REPO_URL,
        programmingLanguage: "TypeScript",
        license: "https://opensource.org/licenses/MIT",
        runtimePlatform: ["React", "React Native"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LINKED_DATA) }}
      />
      <Main
        momentum
        withSkipLink
        skipLabel={dict["skip.content"]}
        header={<Bar dict={dict} guides={guides} />}
        footer={<SiteFooter dict={dict} />}
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
          }}
        />

        <Hero
          size="xl"
          mih="720px"
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
              <Button
                component="a"
                href={SectionHref(DEFAULT_SECTION, "installation")}
                size="lg"
                variant="gradient"
              >
                {dict["home.cta.start"]}
              </Button>
              <Button component="a" href={SectionHref("components")} size="lg" variant="glass">
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
                component: dict["home.preview.component"] ?? "",
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

        <Band
          center
          level="major"
          eyebrow={dict["home.reach.eyebrow"]}
          title={dict["home.pillars.title"]}
          description={dict["home.reach.body"]}
        >
          <SimpleGrid cols={{ base: 1, tablet: 3 }} gap="xxl">
            {PILLARS.map((key, index) => (
              <Reveal key={key} component="article" index={index}>
                <GlassSurface w="100%" h="100%" level="strong" p="lg" r="md">
                  <Feature
                    icon={GLYPH[key]}
                    title={dict[`home.pillar.${key}.title`]}
                    description={dict[`home.pillar.${key}.body`]}
                  />
                </GlassSurface>
              </Reveal>
            ))}
          </SimpleGrid>
          <Flex w="100%" gap="xxl" direction="column">
            <Text fz="h4" fw="semibold" ta="center">
              {dict["home.numbers.title"]}
            </Text>
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
          </Flex>
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
              <Button
                component="a"
                href={SectionHref(DEFAULT_SECTION, "installation")}
                size="lg"
                variant="gradient"
              >
                {dict["home.cta.start"]}
              </Button>
              <Button
                component="a"
                href={REPO_URL}
                size="lg"
                variant="glass"
              >
                {dict["home.cta.source"]}
              </Button>
            </Box>
          </Box>
        </Band>
      </Main>
    </>
  );
}
