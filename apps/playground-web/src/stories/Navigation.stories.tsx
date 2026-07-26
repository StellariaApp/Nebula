import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Badge, Box, NavLink, Pagination, Paper, Text, Title } from "@stellaria/nebula-web";

const meta: Meta = {
  title: "Navigation/Overview",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const NavLinks: Story = {
  render: () => (
    <Box maw={280} display="flex" direction="column" gap="xxs">
      <NavLink label="Inicio" href="#inicio" leftSection="🏠" active />
      <NavLink label="Clientes" href="#clientes" leftSection="👥" />
      <NavLink label="Facturación" href="#facturacion" leftSection="🧾" rightSection={<Badge size="xs">3</Badge>} />
      <NavLink label="Deshabilitado" href="#nada" leftSection="🚫" disabled />
    </Box>
  ),
};

export const NavLinkWithDescription: Story = {
  render: () => (
    <Box maw={320}>
      <NavLink
        label="Plan Profesional"
        description="Renueva el 12 de agosto"
        leftSection="💳"
        active
      />
    </Box>
  ),
};

export const NavLinkNested: Story = {
  render: () => (
    <Box maw={280}>
      <NavLink label="Configuración" leftSection="⚙️" defaultOpened>
        <NavLink label="Perfil" href="#perfil" />
        <NavLink label="Seguridad" href="#seguridad" />
        <NavLink label="Notificaciones" href="#notificaciones" />
      </NavLink>
    </Box>
  ),
};

export const Paginations: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Pagination total={5} defaultValue={2} aria-label="Ejemplo básico" />
      <Pagination total={20} defaultValue={10} aria-label="Ejemplo con elipsis" />
      <Pagination
        total={20}
        defaultValue={1}
        siblings={0}
        boundaries={1}
        aria-label="Ejemplo sin vecinos"
      />
      <Pagination
        total={5}
        defaultValue={2}
        withControls={false}
        aria-label="Ejemplo sin controles"
      />
    </Box>
  ),
};

export const PaginationSizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" style={{ alignItems: "flex-start" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Pagination key={size} total={7} defaultValue={3} size={size} aria-label={`Tamaño ${size}`} />
      ))}
    </Box>
  ),
};

export const PaginationStates: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" style={{ alignItems: "flex-start" }}>
      <Pagination total={7} defaultValue={1} aria-label="Primera página" />
      <Pagination total={7} defaultValue={7} aria-label="Última página" />
      <Pagination total={7} defaultValue={3} disabled aria-label="Deshabilitada" />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box display="flex" gap="xl" style={{ alignItems: "flex-start" }}>
      <Box maw={240} display="flex" direction="column" gap="xxs">
        <Title order={5}>Cuenta</Title>
        <NavLink label="Resumen" href="#resumen" leftSection="📊" active />
        <NavLink label="Movimientos" href="#movimientos" leftSection="💸" />
        <NavLink label="Reportes" leftSection="📁" defaultOpened>
          <NavLink label="Mensual" href="#mensual" />
          <NavLink label="Anual" href="#anual" />
        </NavLink>
      </Box>
      <Paper withBorder radius="md" p="lg" style={{ flex: 1 }}>
        <Box display="flex" direction="column" gap="md">
          <Text fw="semibold">Últimos movimientos</Text>
          <Text c="text.secondary" fz="body3">
            Mostrando la página 3 de 20.
          </Text>
          <Pagination total={20} defaultValue={3} aria-label="Movimientos" />
        </Box>
      </Paper>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "sober-light" } };

export const ReducedMotion: Story = { ...Paginations, globals: { reducedMotion: "reduce" } };

/** Tab/Enter/flechas nativas del botón; el disclosure abre con Enter/Space y expone aria-expanded. */
export const KeyboardFlow: Story = {
  render: () => (
    <Box maw={280}>
      <NavLink label="Configuración" leftSection="⚙️">
        <NavLink label="Perfil" href="#perfil" />
      </NavLink>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Configuración" });

    trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("link", { name: "Perfil" })).toBeInTheDocument();
  },
};

export const PaginationKeyboardFlow: Story = {
  render: () => <Pagination total={5} defaultValue={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Página siguiente" });

    next.focus();
    await userEvent.keyboard("{Enter}");
    await expect(canvas.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
