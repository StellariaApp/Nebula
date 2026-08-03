import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import {
  Badge,
  Hero,
  Box,
  Button,
  Card,
  Divider,
  Feature,
  Footer,
  GradientText,
  Main,
  Nav,
  NebulaProvider,
  Reveal,
  Section,
  SimpleGrid,
  Stat,
  Text,
  StarField,
} from "@stellaria/nebula-web";

import { lagrange, MATRIX_A11Y, rosette, stellaria, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Patterns/Landing",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;

const RAIL = 1180;

const SECTIONS = [
  { href: "#solucion", label: "Solución" },
  { href: "#capacidades", label: "Capacidades" },
  { href: "#precios", label: "Precios" },
  { href: "#seguridad", label: "Seguridad" },
] as const;

const MARK = (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="6" r="4" fill="currentColor" />
    <circle cx="6" cy="16" r="4" fill="currentColor" opacity="0.75" />
    <circle cx="18" cy="16" r="4" fill="currentColor" opacity="0.5" />
  </svg>
);

const ICON_LINK = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </svg>
);

const ICON_SHIELD = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
  </svg>
);

const ICON_BOLT = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M13 2L5 14h6l-1 8 8-12h-6z" />
  </svg>
);

const CAPABILITIES = [
  {
    icon: ICON_LINK,
    title: "Conciliación continua",
    description:
      "Cada movimiento se contrasta contra el extracto del banco en cuanto entra, no al cierre de mes.",
  },
  {
    icon: ICON_BOLT,
    title: "Reglas que aprenden",
    description:
      "Las excepciones que resuelves a mano se convierten en reglas propuestas. Tú decides cuáles se quedan.",
  },
  {
    icon: ICON_SHIELD,
    title: "Trazabilidad completa",
    description:
      "Cada asiento guarda quién lo tocó, cuándo y con qué regla. El auditor no vuelve a pedirte una hoja de cálculo.",
  },
] as const;

const PLANS = [
  { name: "Equipo", price: "49 €", note: "por usuario / mes", cta: "Empezar", featured: false },
  {
    name: "Empresa",
    price: "129 €",
    note: "por usuario / mes",
    cta: "Hablar con ventas",
    featured: true,
  },
  { name: "A medida", price: "Hablemos", note: "según volumen", cta: "Contactar", featured: false },
] as const;

function Bar(): ReactElement {
  return (
    <Nav component="header" aria-label="Cabecera del sitio" floating floatingWidth={RAIL}>
      <Nav.Logo href="#inicio" aria-label="Inicio">
        {MARK}
        <span>Rosette</span>
      </Nav.Logo>
      <Nav.Links aria-label="Principal">
        {SECTIONS.map((item) => (
          <Nav.Links.Link key={item.href} href={item.href}>
            {item.label}
          </Nav.Links.Link>
        ))}
      </Nav.Links>
      <Nav.Actions>
        <Badge variant="light">en línea</Badge>
        <Button size="sm">Probar gratis</Button>
      </Nav.Actions>
    </Nav>
  );
}

function Portada(): ReactElement {
  return (
    <Hero
      id="inicio"
      size="xl"
      hiper="Cierre de marzo en 4 días"
      mih="100vh"
      title={
        <>
          Concilia sin <GradientText>hojas de cálculo</GradientText>
        </>
      }
      description="Rosette contrasta cada movimiento contra el extracto del banco en cuanto entra. Lo que antes era una semana de cierre son ahora cuatro días y un registro que el auditor acepta."
      actions={
        <>
          <Button>Probar gratis</Button>
          <Button variant="glass">Ver una Nebula</Button>
        </>
      }
    />
  );
}

function Numbers(): ReactElement {
  return (
    <Section
      id="solucion"
      size="xl"
      variant="glass"
      reveal
      title="Lo que cambia el primer mes"
      description="Medido sobre 40 equipos de finanzas que migraron desde una hoja compartida."
    >
      <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
        <Stat label="Días de cierre" value="4" diff="-62 %" trend="down" />
        <Stat label="Movimientos automáticos" value="94 %" diff="+31 pp" trend="up" />
        <Stat label="Excepciones por cierre" value="12" diff="-78 %" trend="down" />
      </SimpleGrid>
    </Section>
  );
}

function Capabilities(): ReactElement {
  return (
    <Section
      id="capacidades"
      size="xl"
      reveal
      title="Capacidades"
      description="Tres piezas, un solo flujo."
    >
      <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
        {CAPABILITIES.map((item, index) => (
          <Reveal key={item.title} component="article" index={index}>
            <Feature icon={item.icon} title={item.title} description={item.description} />
          </Reveal>
        ))}
      </SimpleGrid>
    </Section>
  );
}

function Pricing(): ReactElement {
  return (
    <Section
      id="precios"
      size="xl"
      reveal
      title="Precios"
      description="Sin permanencia. El primer mes no se cobra."
    >
      <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
        {PLANS.map((plan, index) => (
          <Reveal key={plan.name} component="article" index={index}>
            <Card p="lg" withBorder radius="md">
              <Box display="flex" direction="column" gap="sm">
                <Box display="flex" align="center" justify="space-between" gap="xs">
                  <Text component="h3" fz="body2" fw="semibold">
                    {plan.name}
                  </Text>
                  {plan.featured ? <Badge variant="light">Más elegido</Badge> : null}
                </Box>
                <Box display="flex" align="baseline" gap="xxs">
                  <Text fz="h2" fw="bold">
                    {plan.price}
                  </Text>
                  <Text fz="caption" c="text.muted">
                    {plan.note}
                  </Text>
                </Box>
                <Divider />
                <Button variant={plan.featured ? "filled" : "outline"} fullWidth>
                  {plan.cta}
                </Button>
              </Box>
            </Card>
          </Reveal>
        ))}
      </SimpleGrid>
    </Section>
  );
}

function Security(): ReactElement {
  return (
    <Section
      id="seguridad"
      size="xl"
      reveal
      title="Seguridad"
      description="Los datos del banco no salen de tu región, y cada acceso queda registrado."
      footer={
        <Text fz="caption" c="text.muted">
          Auditoría SOC 2 Tipo II en curso · cifrado en reposo y en tránsito
        </Text>
      }
    >
      <SimpleGrid cols={{ base: 1, tablet: 2 }} spacing="md">
        <Feature
          icon={ICON_SHIELD}
          title="Residencia de datos"
          description="Eliges la región al crear la cuenta y no se mueve de ahí."
        />
        <Feature
          icon={ICON_LINK}
          title="Acceso por rol"
          description="Quien concilia no exporta, y quien exporta deja rastro."
        />
      </SimpleGrid>
    </Section>
  );
}

function Contacto(): ReactElement {
  return (
    <Section
      id="contacto"
      size="xl"
      reveal
      title="Cierra marzo con nosotros"
      description="Te acompañamos en la primera conciliación. Sin permanencia y sin tarjeta."
    >
      <Box display="flex" gap="md" wrap="wrap">
        <Button size="lg">Probar gratis</Button>
        <Button size="lg" variant="glass">
          Hablar con ventas
        </Button>
      </Box>
    </Section>
  );
}

function Foot(): ReactElement {
  return (
    <Footer contentWidth={RAIL} glass>
      <Footer.Brand
        href="#inicio"
        aria-label="Inicio"
        logo={
          <>
            {MARK}
            <span>Rosette</span>
          </>
        }
        description="Conciliación continua para equipos de finanzas que cerraron su última hoja de cálculo."
      />
      <Footer.Group title="Producto">
        <Footer.Group.Link href="#solucion">Solución</Footer.Group.Link>
        <Footer.Group.Link href="#capacidades">Capacidades</Footer.Group.Link>
        <Footer.Group.Link href="#precios">Precios</Footer.Group.Link>
      </Footer.Group>
      <Footer.Group title="Empresa">
        <Footer.Group.Link href="#seguridad">Seguridad</Footer.Group.Link>
        <Footer.Group.Link href="/legal">Aviso legal</Footer.Group.Link>
        <Footer.Group.Link href="/privacidad">Privacidad</Footer.Group.Link>
      </Footer.Group>
      <Footer.Legal>
        <Text fz="caption" c="text.muted">
          © 2026 Rosette
        </Text>
        <Text fz="caption" c="text.muted">
          Compuesto solo con componentes de Nebula
        </Text>
      </Footer.Legal>
    </Footer>
  );
}

function Page(): ReactElement {
  return (
    <Main
      momentum
      withSkipLink
      header={<Bar />}
      footer={<Foot />}
      background={<StarField parallax />}
    >
      <Portada />
      <Numbers />
      <Capabilities />
      <Pricing />
      <Security />
      <Contacto />
    </Main>
  );
}

export const Nebula: Story = {
  render: () => <Page />,
};

/**
 * B6: las tres landings de Stellaria sobre la misma composición. `Rosette`,
 * `Stellaria` y `Lagrange` rinden el mismo componente `Page` y solo cambian de
 * tema — ni una prop distinta. Si para pasar de una a otra hiciera falta cambiar
 * algo que no es color, el sistema no estaría alineado.
 *
 * El `Box` no es decoración: el provider de la story queda anidado dentro del
 * global del toolbar, así que el tema de producto tiene que pintar su propio
 * lienzo o hereda el fondo del de fuera y el texto se pierde.
 */
export const Rosette: Story = {
  render: () => (
    <NebulaProvider defaultTheme={rosette} storage={null}>
      <Box bg="surface.base" c="text.primary">
        <Page />
      </Box>
    </NebulaProvider>
  ),
};

export const Stellaria: Story = {
  render: () => (
    <NebulaProvider defaultTheme={stellaria} storage={null}>
      <Box bg="surface.base" c="text.primary">
        <Page />
      </Box>
    </NebulaProvider>
  ),
};

export const Lagrange: Story = {
  render: () => (
    <NebulaProvider defaultTheme={lagrange} storage={null}>
      <Box bg="surface.base" c="text.primary">
        <Page />
      </Box>
    </NebulaProvider>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Page />,
};

export const AllThemes: Story = {
  parameters: { ...MATRIX_A11Y, layout: "padded" },
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette" }]}>
      <Box display="flex" direction="column" gap="md">
        <Hero
          order={2}
          variant="light"
          size="sm"
          title={
            <>
              Concilia sin <GradientText>hojas de cálculo</GradientText>
            </>
          }
          description="Cuatro días de cierre en vez de una semana."
        />
        <Box display="flex" gap="md">
          <Button size="sm">Probar</Button>
          <Button size="sm" variant="outline">
            Nebula
          </Button>
        </Box>
        <Stat label="Días de cierre" value="4" diff="-62 %" trend="down" />
      </Box>
    </ThemeMatrix>
  ),
};
