import type { Metadata } from "next";

import ProductSurface from "@stellaria/nebula-demos/Patterns/ProductSurface";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Flex,
  GradientText,
  Hero,
  Main,
  SimpleGrid,
  Text,
} from "@stellaria/nebula-web";

import { HeroPreview } from "../islands/hero-preview";
import { CATALOG } from "../lib/catalog";
import { GuidesHome } from "../lib/content";
import { Dict } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { DEFAULT_SECTION, SectionHref } from "../lib/sections";
import { REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/site";

import { SiteNav } from "../islands/site-nav";
import { ThemePanel } from "../islands/theme-panel";
import type { Dictionary } from "../lib/dictionary";
import { Band } from "../ui/band";
import { SiteBackground } from "../ui/site-background";
import { SiteFooter } from "../ui/site-footer";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const FRAMEWORKS = ["Next.js", "Vite", "React Router"];

const INSTALL = "pnpm add @stellaria/nebula-web";

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
          mih="920px"
          ta="center"
          align="center"
          contentWidth={620}
          hiper={
            <Flex justify="center">
              <Badge variant="light">{dict["home.eyebrow"]}</Badge>
            </Flex>
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
        >
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
        </Hero>

        <Band
          glass
          level="minor"
          eyebrow={dict["home.proof.eyebrow"]}
          title={dict["home.proof.title"]}
          description={dict["home.proof.body"]}
        >
          <ProductSurface />
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
              <Button component="a" href={REPO_URL} size="lg" variant="glass">
                {dict["home.cta.source"]}
              </Button>
            </Box>
          </Box>
        </Band>
      </Main>
    </>
  );
}
