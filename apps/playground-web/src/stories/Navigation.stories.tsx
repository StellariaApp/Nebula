import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Badge,
  Box,
  Breadcrumbs,
  NavLink,
  Pagination,
  Paper,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Navigation/Overview",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const NavLinks: Story = {
  render: function Nav() {
    const [active, set_active] = useState("inicio");
    return (
      <Paper withBorder radius="md" p="xs" style={{ maxWidth: 280 }}>
        <Box display="flex" direction="column" gap="xxs">
          <NavLink
            label="Inicio"
            leftSection="🏠"
            active={active === "inicio"}
            onPress={() => set_active("inicio")}
          />
          <NavLink
            label="Clientes"
            description="Cartera y seguimiento"
            leftSection="👥"
            active={active === "clientes"}
            onPress={() => set_active("clientes")}
          />
          <NavLink
            label="Cobranza"
            leftSection="💳"
            rightSection={<Badge size="xs" color="error">3</Badge>}
            active={active === "cobranza"}
            onPress={() => set_active("cobranza")}
          />
          <NavLink label="Reportes" leftSection="📊" defaultOpened>
            <NavLink label="Ventas" href="#ventas" />
            <NavLink label="Cartera vencida" href="#cartera" />
          </NavLink>
          <NavLink label="Archivado" leftSection="📦" disabled />
        </Box>
      </Paper>
    );
  },
};

export const Paginations: Story = {
  render: function Pages() {
    const [page, set_page] = useState(5);
    return (
      <Box display="flex" direction="column" gap="lg">
        <Pagination
          total={10}
          page={page}
          onChange={set_page}
          labels={{ root: "Resultados" }}
        />
        <Pagination total={20} defaultPage={10} withEdges labels={{ root: "Con extremos" }} />
        <Pagination total={3} defaultPage={2} labels={{ root: "Pocas páginas" }} />
        <Box display="flex" direction="column" gap="sm">
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <Pagination
              key={size}
              total={7}
              defaultPage={4}
              size={size}
              labels={{ root: `Tamaño ${size}` }}
            />
          ))}
        </Box>
        <Pagination total={10} defaultPage={3} disabled labels={{ root: "Deshabilitada" }} />
      </Box>
    );
  },
};

export const Composition: Story = {
  render: function Layout() {
    const [page, set_page] = useState(1);
    return (
      <Box display="flex" gap="lg" style={{ alignItems: "flex-start" }}>
        <Paper withBorder radius="md" p="xs" style={{ width: 240, flexShrink: 0 }}>
          <Box display="flex" direction="column" gap="xxs">
            <NavLink label="Resumen" leftSection="🏠" active />
            <NavLink label="Solicitudes" leftSection="📄" />
            <NavLink label="Reportes" leftSection="📊">
              <NavLink label="Mensual" href="#mensual" />
              <NavLink label="Anual" href="#anual" />
            </NavLink>
          </Box>
        </Paper>
        <Box style={{ flex: 1 }} display="flex" direction="column" gap="md">
          <Title order={4}>Solicitudes</Title>
          <Text c="text.secondary">Mostrando la página {page} de 12.</Text>
          <Pagination total={12} page={page} onChange={set_page} withEdges />
        </Box>
      </Box>
    );
  },
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

export const ReducedMotion: Story = { ...Paginations, globals: { reducedMotion: "reduce" } };

/** La página activa se anuncia con `aria-current` y los controles se deshabilitan en los extremos. */
export const KeyboardFlow: Story = {
  render: () => <Pagination total={6} defaultPage={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("navigation", { name: "Paginación" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Página 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(canvas.getByRole("button", { name: "Página anterior" })).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Página siguiente" }));
    await expect(canvas.getByRole("button", { name: "Página 2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

const RUTA = [
  { key: "inicio", label: "Inicio", href: "#inicio" },
  { key: "cartera", label: "Cartera", href: "#cartera" },
  { key: "sucursal", label: "Sucursal Norte", href: "#sucursal" },
  { key: "expediente", label: "Expediente 40-118" },
];

const RUTA_LARGA = [
  { key: "inicio", label: "Inicio", href: "#inicio" },
  { key: "admin", label: "Administración", href: "#admin" },
  { key: "catalogos", label: "Catálogos", href: "#catalogos" },
  { key: "productos", label: "Productos", href: "#productos" },
  { key: "credito", label: "Crédito simple", href: "#credito" },
  { key: "condiciones", label: "Condiciones" },
];

export const Migas: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" maw={620}>
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="xxs">
          Ruta corta: se muestra entera
        </Text>
        <Breadcrumbs items={RUTA} labels={{ nav: "Ruta corta" }} />
      </Box>
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="xxs">
          Ruta de seis niveles: los intermedios se colapsan tras el primero
        </Text>
        <Breadcrumbs items={RUTA_LARGA} labels={{ nav: "Ruta larga" }} />
      </Box>
      <Box>
        <Text component="p" fz="caption" c="text.muted" mb="xxs">
          Separador propio y tamaño compacto
        </Text>
        <Breadcrumbs items={RUTA} separator="›" size="sm" labels={{ nav: "Ruta compacta" }} />
      </Box>
    </Box>
  ),
};

export const MigasTeclado: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inicio = canvas.getAllByRole("link", { name: "Inicio" })[0];
    inicio?.focus();
    await expect(inicio).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getAllByRole("link", { name: "Cartera" })[0]).toHaveFocus();
  },
  render: () => <Breadcrumbs items={RUTA} />,
};

export const MigasAllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Breadcrumbs items={RUTA} />
    </ThemeMatrix>
  ),
};
