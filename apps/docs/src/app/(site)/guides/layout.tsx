import type { ReactElement, ReactNode } from "react";

import { Anchor, AppShell, Box, GlassSurface, Text } from "@stellaria/nebula-web";

import { GuidesRail, GuidesTabs, RailLink } from "../../../islands/guides-nav";
import { ByFamily, ComponentSlug, FamilySlug } from "../../../lib/catalog";
import { DocIndex, SectionLanding } from "../../../lib/content";
import { Dict, type Dictionary } from "../../../lib/dictionary";
import type { Lang } from "../../../lib/i18n";
import { CurrentLang } from "../../../lib/lang";
import { BAND_HEIGHT, CHROME_HEIGHT, NAV_HEIGHT, SHELL_WIDTH } from "../../../lib/layout";
import { SECTIONS, SectionHref, type Section } from "../../../lib/sections";
import { SiteFooter } from "../../../ui/site-footer";

async function Rail({
  section,
  lang,
  dict,
}: {
  section: Section;
  lang: Lang;
  dict: Dictionary;
}): Promise<ReactElement> {
  if (section.kind === "docs") {
    const docs = await DocIndex(lang, section.slug);
    return (
      <AppShell.Links deep>
        {docs.map((doc) => (
          <RailLink
            key={doc.slug.join("/")}
            href={SectionHref(section.slug, ...doc.slug)}
            label={doc.title}
          />
        ))}
      </AppShell.Links>
    );
  }

  if (section.kind === "catalog") {
    return (
      <>
        {ByFamily().map(({ family, components }) => (
          <AppShell.Links
            key={family}
            deep
            title={
              <Anchor
                href={`${SectionHref(section.slug)}#${FamilySlug(family)}`}
                td="none"
                c="inherit"
              >
                {family}
              </Anchor>
            }
          >
            {components.map((entry) => (
              <RailLink
                key={entry.name}
                href={SectionHref(section.slug, ComponentSlug(entry.name))}
                label={entry.name}
              />
            ))}
          </AppShell.Links>
        ))}
      </>
    );
  }

  return (
    <AppShell.Links>
      <Text fz="body3" c="text.muted">
        {dict["reserved.eta"]}
      </Text>
    </AppShell.Links>
  );
}

export default async function GuidesLayout({ children }: { children: ReactNode }) {
  const lang = await CurrentLang();
  const dict = await Dict(lang, "chrome");

  const tabs = await Promise.all(
    SECTIONS.map(async (section) => ({
      value: section.slug,
      label: dict[section.label] ?? section.slug,
      href: await SectionLanding(lang, section.slug),
    })),
  );

  return (
    <Box display="flex" direction="column" z={1} grow={1} miw={0} mih={0}>
      <GlassSurface
        level="subtle"
        r={0}
        withBorder={false}
        position="fixed"
        top={NAV_HEIGHT}
        left={0}
        right={0}
        z="sticky"
        display="flex"
        px="lg"
        bdbw={1}
        bdbs="solid"
        bdc="border.subtle"
      >
        <Box
          display="flex"
          align="center"
          grow={1}
          miw={0}
          maw={SHELL_WIDTH}
          mih={BAND_HEIGHT}
          mx="auto"
          overflowX="auto"
        >
          <GuidesTabs sections={tabs} label={dict["guides.sections"] ?? ""} />
        </Box>
      </GlassSurface>

      <AppShell
        grow={1}
        miw={0}
        mih={0}
        h="auto"
        contentWidth={SHELL_WIDTH}
        scrollShadow={false}
        mainProps={{ pt: CHROME_HEIGHT }}
        labels={{ skipToContent: dict["skip.content"] ?? "" }}
        sidebar={
          <AppShell.Sidebar h={{ tablet: "100%" }} pt={{ tablet: CHROME_HEIGHT }}>
            <AppShell.Sidebar.Body grow={1}>
              {SECTIONS.map((section) => (
                <GuidesRail key={section.slug} section={section.slug}>
                  <Rail section={section} lang={lang} dict={dict} />
                </GuidesRail>
              ))}
            </AppShell.Sidebar.Body>
          </AppShell.Sidebar>
        }
      >
        <AppShell.Section mih="100%">
          <AppShell.Content grow={1}>{children}</AppShell.Content>
          <Box mt="xl">
            <SiteFooter dict={dict} id="guides-foot-logo" />
          </Box>
        </AppShell.Section>
      </AppShell>
    </Box>
  );
}
