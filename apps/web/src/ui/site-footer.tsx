import Link from "next/link";

import { Footer } from "@stellaria/nebula-web";
import type { ReactElement } from "react";

import { GuidesHome } from "../lib/content";
import type { Dictionary } from "../lib/dictionary";
import { CurrentLang } from "../lib/lang";
import { DEFAULT_SECTION, SectionHref } from "../lib/sections";
import { Logo } from "./logo";
import { REPO_URL } from "../lib/site";

export interface SiteFooterProps {
  dict: Dictionary;
  /** Distingue el logo de esta instancia; hay dos en el sitio y el `id` del SVG no puede repetirse. */
  id?: string | undefined;
}

export async function SiteFooter({
  dict,
  id = "foot-logo",
}: SiteFooterProps): Promise<ReactElement> {
  const guides = await GuidesHome(await CurrentLang());

  return (
    <Footer glass>
      <Footer.Brand
        component={Link}
        logo={<Logo id={id} height={24} />}
        href="/"
        aria-label={dict["site.name"]}
        description={dict["site.tagline"]}
      />
      <Footer.Group title={dict["nav.section.learn"]}>
        <Footer.Group.Link component={Link} href={SectionHref(DEFAULT_SECTION, "installation")}>
          {dict["home.cta.start"]}
        </Footer.Group.Link>
        <Footer.Group.Link component={Link} href={guides}>
          {dict["nav.docs"]}
        </Footer.Group.Link>
      </Footer.Group>
      <Footer.Group title={dict["nav.section.reference"]}>
        <Footer.Group.Link component={Link} href={SectionHref("components")}>
          {dict["section.components"]}
        </Footer.Group.Link>
        <Footer.Group.Link component={Link} href="/theme">
          {dict["nav.theme"]}
        </Footer.Group.Link>
        <Footer.Group.Link component={Link} href={SectionHref("native")}>
          {dict["section.native"]}
        </Footer.Group.Link>
        <Footer.Group.Link component={Link} href="/changelog">
          {dict["nav.changelog"]}
        </Footer.Group.Link>
      </Footer.Group>
      <Footer.Group title="GitHub">
        <Footer.Group.Link href={REPO_URL}>{dict["home.cta.source"]}</Footer.Group.Link>
      </Footer.Group>
      <Footer.Legal>{dict["home.legal"]}</Footer.Legal>
    </Footer>
  );
}
