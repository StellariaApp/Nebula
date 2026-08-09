import type { ReactNode } from "react";

import { Anchor, AppShell, Badge, Box, Divider, Text } from "@stellaria/nebula-web";

import { DocIndex } from "../lib/content";
import type { Dictionary } from "../lib/dictionary";
import { LANGS, type Lang } from "../lib/i18n";
import { LangSwitch } from "../islands/lang-switch";
import { SchemeSwitch } from "../islands/scheme-switch";
import { Search } from "../islands/search";
import { Logo } from "./logo";

interface ChromeProps {
  lang: Lang;
  dict: Dictionary;
  children: ReactNode;
}

const REFERENCE = [
  { href: "/components", label: "nav.components" },
  { href: "/theme", label: "nav.theme" },
  { href: "/native", label: "nav.native" },
  { href: "/changelog", label: "nav.changelog" },
];

export async function Chrome({ lang, dict, children }: ChromeProps) {
  const guides = await DocIndex(lang);

  return (
    <AppShell
      labels={{ skipToContent: dict["skip.content"] ?? "" }}
      sidebar={
        <AppShell.Sidebar>
          <AppShell.Sidebar.Header>
            <Anchor href="/" aria-label={dict["site.name"]} display="flex" align="center" px="sm">
              <Logo id="chrome-logo" height={24} />
            </Anchor>
          </AppShell.Sidebar.Header>
          <AppShell.Sidebar.Body>
            <AppShell.Links title={dict["nav.section.learn"]}>
              <AppShell.Link href="/" label={dict["nav.home"]} />
              {guides.map((guide) => (
                <AppShell.Link
                  key={guide.slug.join("/")}
                  href={`/docs/${guide.slug.join("/")}`}
                  label={guide.title}
                />
              ))}
            </AppShell.Links>
            <AppShell.Links title={dict["nav.section.reference"]}>
              {REFERENCE.map((link) => (
                <AppShell.Link key={link.href} href={link.href} label={dict[link.label]} />
              ))}
            </AppShell.Links>
          </AppShell.Sidebar.Body>
          <AppShell.Sidebar.Footer>
            <Badge variant="light" color="warning">
              v0 · pre-release
            </Badge>
          </AppShell.Sidebar.Footer>
        </AppShell.Sidebar>
      }
    >
      <AppShell.Section>
        <AppShell.Header
          actions={
            <Box display="flex" gap="xs" align="center">
              <Search
                label={dict["search.label"] ?? ""}
                placeholder={dict["search.placeholder"] ?? ""}
              />
              <SchemeSwitch label={dict["scheme.switch"] ?? ""} />
              {LANGS.length > 1 && <LangSwitch lang={lang} label={dict["lang.switch"] ?? ""} />}
            </Box>
          }
        >
          <Text fz="body3" c="text.muted">
            {dict["status.api"]}
          </Text>
        </AppShell.Header>
        <AppShell.Content>{children}</AppShell.Content>
        <Divider my="xl" />
        <Box py="lg">
          <Text fz="caption" c="text.muted">
            {dict["site.tagline"]}
          </Text>
          <Anchor href="https://github.com/stellaria/nebula" fz="caption">
            GitHub
          </Anchor>
        </Box>
      </AppShell.Section>
    </AppShell>
  );
}
