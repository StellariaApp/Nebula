import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import {
  ActionIcon,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Header,
  Main,
  NavLink,
  SimpleGrid,
  Text,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, rosette, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Header> = {
  title: "Layout/Header",
  component: Header,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Header>;

const ICON_BELL = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export const Default: Story = {
  render: () => <Header title="Expediente 40-118" subtitle="118 movimientos activos" />,
};

export const WithBack: Story = {
  render: () => (
    <Header
      title="Expediente 40-118"
      subtitle="Aurora S.A. · alta el 12 de marzo"
      withBack
      rightSection={
        <>
          <ActionIcon variant="ghost" color="gray" aria-label="Notificaciones">
            {ICON_BELL}
          </ActionIcon>
          <Button size="sm">Conciliar</Button>
        </>
      }
    />
  ),
};

export const Orders: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Text fz="body3" c="text.secondary">
        `order` vale 1 por defecto porque un header de pantalla es el h1 de esa pantalla. Se baja
        cuando el consumidor ya tiene el suyo.
      </Text>
      {([1, 2, 3] as const).map((order) => (
        <Header key={order} order={order} title={`Título con order ${String(order)}`} />
      ))}
    </Box>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <Header title="Cartera" withBack rightSection={<Badge>4 pendientes</Badge>}>
      <Box display="flex" gap="xs">
        <NavLink label="Todos" href="#" active />
        <NavLink label="Vencidos" href="#" />
        <NavLink label="Al día" href="#" />
      </Box>
    </Header>
  ),
};

function InShell(): ReactElement {
  return (
    <AppShell
      headerHeight={72}
      header={
        <AppShell.Header sticky>
          <Header
            title="Conciliación"
            subtitle="Cierre de marzo"
            rightSection={<Button size="sm">Exportar</Button>}
          />
        </AppShell.Header>
      }
      navbar={
        <AppShell.Nav aria-label="Navegación principal">
          <Box p="sm" display="flex" direction="column" gap="xxs">
            <NavLink label="Inicio" href="#" active />
            <NavLink label="Movimientos" href="#" />
            <NavLink label="Reportes" href="#" />
          </Box>
        </AppShell.Nav>
      }
    >
      <SimpleGrid cols={{ base: 1, tablet: 2 }} spacing="md">
        <Card p="md" withBorder radius="md">
          <Text fz="body3">M-1042 · Aurora S.A.</Text>
        </Card>
        <Card p="md" withBorder radius="md">
          <Text fz="body3">M-1043 · Nébula Ltda.</Text>
        </Card>
      </SimpleGrid>
    </AppShell>
  );
}

export const InAppShell: Story = {
  parameters: { layout: "fullscreen" },
  render: () => <InShell />,
};

export const InMain: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Box h={420}>
      <Main
        header={
          <Header
            title="Expediente 40-118"
            subtitle="Aurora S.A."
            withBack
            rightSection={<Button size="sm">Guardar</Button>}
          />
        }
      >
        <Box display="flex" direction="column" gap="md">
          {Array.from({ length: 8 }, (_, index) => (
            <Card key={index} p="md" withBorder radius="md">
              <Text fz="body3">Movimiento {String(index + 1)}</Text>
            </Card>
          ))}
        </Box>
      </Main>
    </Box>
  ),
};

export const Standalone: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Fuera de AppShell se eleva a landmark con `component="header"`. Dentro del slot de AppShell
        no, porque ese `header` ya es el banner.
      </Text>
      <Header component="header" title="Rosette" subtitle="Sin AppShell alrededor" withBack />
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: { ...MATRIX_A11Y, layout: "padded" },
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette" }]}>
      <Header title="Cartera" subtitle="118 expedientes" withBack rightSection={<Badge>4</Badge>} />
    </ThemeMatrix>
  ),
};
