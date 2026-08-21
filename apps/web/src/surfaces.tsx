import {
  Affix,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Footer,
  GradientText,
  Header,
  Hero,
  Main,
  Nav,
  Panel,
  ScrollProgress,
  Text,
  Title,
} from "@stellaria/nebula-web";
import type { ReactElement, ReactNode } from "react";

import { Logo } from "./ui/logo";

/**
 * Las superficies de página no caben en la tarjeta de una ficha: montan su propio `main`, su barra o
 * su pie, y anidarlas dentro del chasis del sitio da dos shells compitiendo. Se sirven en su ruta
 * `/preview/<nombre>` sin cromado y la ficha las enmarca en un `iframe`.
 */
export interface Surface {
  node: ReactNode;
  /** Alto del marco. Lo fija la muestra porque solo ella sabe cuánto necesita para leerse. */
  height: number;
}

function Row(label: string): ReactElement {
  return (
    <Card withBorder r="md" p="md" mb="sm">
      <Text fz="body3">{label}</Text>
    </Card>
  );
}

const LINKS = ["Guides", "Components", "Theme Creator"];

export const SURFACES: Record<string, Surface> = {
  AppShell: {
    height: 420,
    node: (
      <AppShell
        h="100dvh"
        sidebar={
          <AppShell.Sidebar>
            <AppShell.Sidebar.Header>
              <Text fz="body2" fw="semibold">
                Nebula
              </Text>
            </AppShell.Sidebar.Header>
            <AppShell.Sidebar.Body grow={1}>
              <AppShell.Links title="Learn">
                <AppShell.Link href="#shell" label="Getting started" active />
                <AppShell.Link href="#shell" label="Components" />
              </AppShell.Links>
            </AppShell.Sidebar.Body>
            <AppShell.Sidebar.Footer>
              <Badge variant="light" color="warning">
                v0
              </Badge>
            </AppShell.Sidebar.Footer>
          </AppShell.Sidebar>
        }
      >
        <AppShell.Section mih="100%">
          <AppShell.Header title="Reconciliation" subtitle="24 movements pending" />
          <AppShell.Content grow={1}>
            {Row("The rail keeps its own scroll")}
            {Row("The section owns its header")}
          </AppShell.Content>
        </AppShell.Section>
      </AppShell>
    ),
  },

  Nav: {
    height: 200,
    node: (
      <Nav component="header" aria-label="Nebula" floating={false}>
        <Nav.Logo href="#nav" aria-label="Nebula">
          <Logo id="surface-nav-logo" height={26} />
        </Nav.Logo>
        <Nav.Links aria-label="Main" justify="flex-start" overflowMenu>
          {LINKS.map((link) => (
            <Nav.Links.Link key={link} href="#nav">
              {link}
            </Nav.Links.Link>
          ))}
        </Nav.Links>
        <Nav.Actions>
          <Badge variant="light" color="primary">
            v0
          </Badge>
          <Button size="sm" variant="gradient">
            Get started
          </Button>
        </Nav.Actions>
      </Nav>
    ),
  },

  Header: {
    height: 220,
    node: (
      <Box p="lg">
        <Header
          title="Reconciliation"
          subtitle="24 movements pending since Monday"
          rightSection={
            <Button size="sm" variant="light">
              Export
            </Button>
          }
        />
      </Box>
    ),
  },

  Footer: {
    height: 320,
    node: (
      <Footer glass>
        <Footer.Brand
          logo={<Logo id="surface-foot-logo" height={24} />}
          href="#footer"
          description="A UI library for web and React Native."
        />
        <Footer.Group title="Learn">
          <Footer.Group.Link href="#footer">Get started</Footer.Group.Link>
          <Footer.Group.Link href="#footer">Guides</Footer.Group.Link>
        </Footer.Group>
        <Footer.Group title="Reference">
          <Footer.Group.Link href="#footer">Components</Footer.Group.Link>
          <Footer.Group.Link href="#footer">Theme Creator</Footer.Group.Link>
        </Footer.Group>
        <Footer.Legal>Core released under the MIT licence.</Footer.Legal>
      </Footer>
    ),
  },

  Main: {
    height: 420,
    node: (
      <Main
        contentWidth={720}
        padded
        header={
          <Nav component="header" aria-label="Nebula" floating={false}>
            <Nav.Logo href="#main" aria-label="Nebula">
              <Logo id="surface-main-logo" height={24} />
            </Nav.Logo>
            <Nav.Links aria-label="Main" justify="flex-start">
              <Nav.Links.Link href="#main">Guides</Nav.Links.Link>
            </Nav.Links>
          </Nav>
        }
        footer={
          <Footer>
            <Footer.Legal>One catalogue, two platforms.</Footer.Legal>
          </Footer>
        }
      >
        <Title order={1} fz="h3">
          The page shell
        </Title>
        {Row("Header, content and footer in one component")}
        {Row("It owns the scroll, and the momentum")}
      </Main>
    ),
  },

  Hero: {
    height: 460,
    node: (
      <Hero
        size="md"
        mih="440px"
        contentWidth={520}
        hiper={
          <Box display="flex">
            <Badge variant="light">Web + React Native</Badge>
          </Box>
        }
        title={
          <>
            One catalogue.
            <br />
            <GradientText>Zero forks.</GradientText>
          </>
        }
        description="The contract lives in the tokens and each platform implements only the visual layer."
        actions={
          <Button size="lg" variant="gradient">
            Get started
          </Button>
        }
      />
    ),
  },

  Panel: {
    height: 360,
    node: (
      <Panel
        h="100dvh"
        master={
          <Box p="md">
            <Text fz="caption" c="text.muted" tt="uppercase" ls="wide" fw="semibold" mb="sm">
              Movements
            </Text>
            {Row("Invoice 1042")}
            {Row("Invoice 1043")}
          </Box>
        }
        detail={
          <Box p="lg">
            <Title order={2} fz="h5" mb="sm">
              Invoice 1042
            </Title>
            <Text fz="body3" c="text.secondary">
              The master keeps its width and the detail takes whatever is left.
            </Text>
          </Box>
        }
      />
    ),
  },

  Affix: {
    height: 280,
    node: (
      <Box p="lg" h="100dvh">
        <Text fz="body3" c="text.secondary" maw="48ch">
          Whatever it holds stays pinned to a corner of the viewport, over the content.
        </Text>
        <Affix position={{ bottom: 24, right: 24 }}>
          <Button variant="gradient">Pinned here</Button>
        </Affix>
      </Box>
    ),
  },

  ScrollProgress: {
    height: 260,
    node: (
      <Box h="100dvh" overflowY="auto">
        <ScrollProgress position="top" />
        <Box p="lg">
          <Text fz="body3" c="text.secondary" mb="md">
            Scroll this frame: the bar at the top measures how much is left.
          </Text>
          {["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"].map((item) =>
            Row(item),
          )}
        </Box>
      </Box>
    ),
  },
};

export function FindSurface(name: string): Surface | undefined {
  return SURFACES[name];
}
