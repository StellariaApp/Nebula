import type { ReactNode } from "react";

import { AppShell, Anchor, Badge, Box, Divider, Text, Title } from "@stellaria/nebula-web";

import type { Dictionary } from "../lib/dictionary";
import { type Lang } from "../lib/i18n";
import { LangSwitch } from "../islands/lang-switch";
import { SchemeSwitch } from "../islands/scheme-switch";
import { Search } from "../islands/search";

interface ChromeProps {
  lang: Lang;
  dict: Dictionary;
  path: string;
  children: ReactNode;
}

const SECTIONS = [
  {
    label: "nav.section.learn",
    links: [
      { href: "", label: "nav.home" },
      { href: "/docs/introduccion", label: "nav.docs" },
    ],
  },
  {
    label: "nav.section.reference",
    links: [
      { href: "/components", label: "nav.components" },
      { href: "/theme", label: "nav.theme" },
      { href: "/native", label: "nav.native" },
      { href: "/changelog", label: "nav.changelog" },
    ],
  },
];

export function Chrome({ lang, dict, path, children }: ChromeProps) {
  return (
    <AppShell
      labels={{ skipToContent: dict["skip.content"] ?? "" }}
      sidebar={
        <AppShell.Sidebar>
          <AppShell.Sidebar.Header>
            <Title order={2} fz="h5" c="text.primary">
              {dict["site.name"] ?? "Nebula"}
            </Title>
          </AppShell.Sidebar.Header>
          <AppShell.Sidebar.Body>
            {SECTIONS.map((section) => (
              <AppShell.Links key={section.label} title={dict[section.label]}>
                {section.links.map((link) => (
                  <AppShell.Link
                    key={link.href}
                    href={`/${lang}${link.href}`}
                    active={path === link.href}
                    label={dict[link.label]}
                  />
                ))}
              </AppShell.Links>
            ))}
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
              <LangSwitch lang={lang} label={dict["lang.switch"] ?? ""} />
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
