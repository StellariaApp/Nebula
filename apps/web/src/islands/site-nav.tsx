"use client";

import Link from "next/link";

import { Badge, Burger, Button, Nav } from "@stellaria/nebula-web";
import { useState, type ReactElement, type ReactNode } from "react";

import { Logo } from "../ui/logo";

export interface SiteNavLink {
  href: string;
  label: string;
}

export interface SiteNavLabels {
  site: string;
  nav: string;
  cta: string;
  menuOpen: string;
  menuClose: string;
  drawer: string;
}

const CTA_HREF = "/guides/getting-started/installation";

const VERSION = process.env.NEXT_PUBLIC_NEBULA_VERSION ?? "";

export type SiteNavCollapse = "tablet" | "laptop";

export function SiteNav({
  links,
  labels,
  actions,
  drawer,
  floating = true,
  collapse = "tablet",
  contentWidth,
  height,
}: {
  links: readonly SiteNavLink[];
  labels: SiteNavLabels;
  /** Lo que va a la derecha. Sin ello manda el par de la landing: la insignia y el CTA. */
  actions?: ReactNode | undefined;
  /** Lo que el cajón añade bajo los enlaces: en docs, el índice del carril. */
  drawer?: ReactNode | undefined;
  floating?: boolean | undefined;
  /**
   * Dónde la barra se pliega en hamburger. Un solo valor manda sobre los enlaces, las acciones, el
   * botón y el cajón: si se separan, aparece un tramo con el menú abierto y los enlaces también.
   * @default "tablet"
   */
  collapse?: SiteNavCollapse | undefined;
  /** El mismo eje que el grid del carril: las dos capas comparten tope o no alinean. */
  contentWidth?: number | undefined;
  /** Alto mínimo de la barra. Sin él manda el peldaño de `size`. */
  height?: number | undefined;
}): ReactElement {
  const [menu, set_menu] = useState(false);

  const items = links.map((link) => (
    <Nav.Links.Link key={link.href} component={Link} href={link.href}>
      {link.label}
    </Nav.Links.Link>
  ));

  return (
    <Nav
      component="header"
      aria-label={labels.site}
      floating={floating}
      {...(contentWidth === undefined ? {} : { contentWidth })}
      {...(height === undefined ? {} : { mih: height })}
    >
      <Nav.Logo href="/" aria-label={labels.site}>
        <Logo id="nav-logo" height={26} />
      </Nav.Logo>

      <Nav.Links aria-label={labels.nav} justify="flex-start" overflowMenu collapse={collapse}>
        {items}
      </Nav.Links>

      <Nav.Actions collapse={collapse}>
        {actions ?? (
          <>
            <Badge variant="light" color="primary">
              v{VERSION}
            </Badge>
            <Button component={Link} href={CTA_HREF} size="sm" variant="gradient">
              {labels.cta}
            </Button>
          </>
        )}
      </Nav.Actions>

      <Burger
        size="sm"
        showBelow={collapse}
        opened={menu}
        onChange={set_menu}
        openLabel={labels.menuOpen}
        closeLabel={labels.menuClose}
      />

      <Nav.Sidebar
        opened={menu}
        onClose={() => {
          set_menu(false);
        }}
        collapse={collapse}
        label={labels.drawer}
        closeLabel={labels.menuClose}
        footer={
          <Button component={Link} href={CTA_HREF} variant="gradient" fullWidth>
            {labels.cta}
          </Button>
        }
      >
        {items}
        {drawer}
      </Nav.Sidebar>
    </Nav>
  );
}
