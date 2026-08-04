import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  AppShell,
  Hero,
  Box,
  Burger,
  Button,
  Card,
  Feature,
  NavLink,
  Panel,
  Section,
  SimpleGrid,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof AppShell> = {
  title: "Layout/Shell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof AppShell>;

const ICON_STAR = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="m12 3 2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 17.3 6.2 20.8l1.6-6.6L2.6 9.8l6.8-.5z" />
  </svg>
);

function Shell(): ReactElement {
  const [opened, set_opened] = useState(true);

  return (
    <AppShell
      navbarOpened={opened}
      onNavbarChange={set_opened}
      header={
        <AppShell.Header sticky>
          <Box display="flex" align="center" gap="sm">
            <Burger opened={opened} onChange={set_opened} size="sm" />
            <Text fz="body1" fw="semibold">
              Conciliación
            </Text>
          </Box>
        </AppShell.Header>
      }
      navbar={
        <AppShell.Nav aria-label="Navegación principal">
          <Box p="sm" display="flex" direction="column" gap="xxs">
            <NavLink label="Inicio" href="#" active />
            <NavLink label="Movimientos" href="#" />
            <NavLink label="Reportes" href="#" />
            <NavLink label="Ajustes" href="#" />
          </Box>
        </AppShell.Nav>
      }
      aside={
        <AppShell.Aside aria-label="Resumen">
          <Box p="md" display="flex" direction="column" gap="sm">
            <Title order={3}>Resumen</Title>
            <Text fz="body3" c="text.secondary">
              4 movimientos pendientes de conciliar.
            </Text>
          </Box>
        </AppShell.Aside>
      }
      footer={
        <AppShell.Footer>
          <Text fz="caption" c="text.muted">
            Nebula · panel de conciliación
          </Text>
        </AppShell.Footer>
      }
    >
      <Section
        title="Movimientos del mes"
        description="Todo lo recibido en los últimos 30 días."
        actions={<Button size="sm">Exportar</Button>}
      >
        <SimpleGrid cols={{ base: 1, tablet: 2 }} spacing="md">
          <Card p="md" withBorder radius="md">
            <Text fz="body3">M-1042 · Aurora S.A.</Text>
          </Card>
          <Card p="md" withBorder radius="md">
            <Text fz="body3">M-1043 · Nébula Ltda.</Text>
          </Card>
        </SimpleGrid>
      </Section>
    </AppShell>
  );
}

export const Default: Story = {
  render: () => <Shell />,
};

export const MasterDetail: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        El separador es operable con teclado: enfócalo con Tab y usa las flechas, o Inicio y Fin
        para ir a los topes.
      </Text>
      <Box h={320} style={{ border: "1px solid var(--nebula-border)" }}>
        <Panel
          defaultSize={260}
          min={180}
          max={480}
          master={
            <Box p="md" display="flex" direction="column" gap="xs">
              <Title order={3}>Lista</Title>
              <Text fz="body3">M-1042</Text>
              <Text fz="body3">M-1043</Text>
              <Text fz="body3">M-1044</Text>
            </Box>
          }
          detail={
            <Box p="md">
              <Title order={3}>Detalle</Title>
              <Text fz="body3" c="text.secondary" mt="xs">
                Selecciona un movimiento de la lista.
              </Text>
            </Box>
          }
        />
      </Box>
    </Box>
  ),
};

export const HeroBand: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Hero
        hiper="Novedad"
        title="Concilia en un clic"
        subtitle="Sin hojas de cálculo"
        description="Conecta tu banco y deja que Nebula empareje los movimientos por ti."
        size="lg"
        actions={<Button>Empezar</Button>}
      />
      <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
        <Feature
          icon={ICON_STAR}
          title="Automática"
          description="Empareja por importe, fecha y referencia."
        />
        <Feature
          icon={ICON_STAR}
          title="Auditable"
          description="Cada emparejamiento deja traza."
          href="#"
          linkText="Ver la traza"
        />
        <Feature icon={ICON_STAR} title="Segura" description="El backend sigue mandando." />
      </SimpleGrid>
    </Box>
  ),
};

export const HeroVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Box display="flex" direction="column" gap="md">
      {(["filled", "outline", "light", "glass"] as const).map((variant) => (
        <Hero key={variant} variant={variant} title={variant} size="sm" />
      ))}
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: { ...MATRIX_A11Y, layout: "padded" },
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <Hero title="Concilia en un clic" size="sm" />
        <Feature icon={ICON_STAR} title="Automática" description="Por importe y fecha." />
        <Burger />
      </Box>
    </ThemeMatrix>
  ),
};
