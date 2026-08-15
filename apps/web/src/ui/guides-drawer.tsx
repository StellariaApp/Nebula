import { Fragment, type ReactElement } from "react";

import { Text } from "@stellaria/nebula-web";

import { DrawerLink, DrawerRail } from "../islands/guides-nav";
import { ByFamily, ComponentSlug } from "../lib/catalog";
import { DocIndex } from "../lib/content";
import type { Dictionary } from "../lib/dictionary";
import type { Lang } from "../lib/i18n";
import { SECTIONS, SectionHref, type Section } from "../lib/sections";

function Heading({ children }: { children: string }): ReactElement {
  return (
    <Text fz="body3" fw="semibold" c="text.muted" px="xs" pt="sm">
      {children}
    </Text>
  );
}

async function DrawerSection({
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
      <>
        {docs.map((doc) => (
          <DrawerLink
            key={doc.slug.join("/")}
            href={SectionHref(section.slug, ...doc.slug)}
            label={doc.title}
          />
        ))}
      </>
    );
  }

  if (section.kind === "catalog") {
    return (
      <>
        {ByFamily().map(({ family, components }) => (
          <Fragment key={family}>
            <Heading>{family}</Heading>
            {components.map((entry) => (
              <DrawerLink
                key={entry.name}
                href={SectionHref(section.slug, ComponentSlug(entry.name))}
                label={entry.name}
              />
            ))}
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <Text fz="body3" c="text.muted">
      {dict["reserved.eta"]}
    </Text>
  );
}

/**
 * El carril de guides en idioma de cajón (ADR-153). No reutiliza `AppShell.Links` a propósito: sus
 * reglas por debajo de `laptop` lo tienden en fila para la barra inferior, que es justo el modo que
 * el sitio retira.
 */
export function GuidesDrawer({ lang, dict }: { lang: Lang; dict: Dictionary }): ReactElement {
  return (
    <>
      {SECTIONS.map((section) => (
        <DrawerRail key={section.slug} section={section.slug}>
          <DrawerSection section={section} lang={lang} dict={dict} />
        </DrawerRail>
      ))}
    </>
  );
}
