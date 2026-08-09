"use client";

import { Badge, Burger, Button, Nav } from "@stellaria/nebula-web";
import { useState, type ReactElement } from "react";

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

const CTA_HREF = "/docs/installation";

export function SiteNav({
  links,
  labels,
}: {
  links: readonly SiteNavLink[];
  labels: SiteNavLabels;
}): ReactElement {
  const [menu, set_menu] = useState(false);

  const items = links.map((link) => (
    <Nav.Links.Link key={link.href} href={link.href}>
      {link.label}
    </Nav.Links.Link>
  ));

  return (
    <Nav component="header" aria-label={labels.site} floating>
      <Nav.Logo href="/" aria-label={labels.site}>
        <Logo id="nav-logo" height={26} />
      </Nav.Logo>

      <Nav.Links aria-label={labels.nav} justify="center" overflowMenu>
        {items}
      </Nav.Links>

      <Nav.Actions>
        <Badge variant="light" color="warning">
          v0
        </Badge>
        <Button component="a" href={CTA_HREF} size="sm" variant="gradient">
          {labels.cta}
        </Button>
      </Nav.Actions>

      <Burger
        size="sm"
        showBelow="tablet"
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
        label={labels.drawer}
        closeLabel={labels.menuClose}
        footer={
          <Button component="a" href={CTA_HREF} variant="gradient" fullWidth>
            {labels.cta}
          </Button>
        }
      >
        {items}
      </Nav.Sidebar>
    </Nav>
  );
}
