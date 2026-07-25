import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { ActionIcon, Box, Button, Menu, Text, Title } from "@stellaria/nebula-web";
import type { MenuItemData } from "@stellaria/nebula-web";

const meta: Meta<typeof Menu> = {
  title: "Overlays/Menu",
  component: Menu,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Menu>;

const ITEMS: MenuItemData[] = [
  { key: "edit", label: "Editar", shortcut: "⌘E" },
  { key: "duplicate", label: "Duplicar", shortcut: "⌘D" },
  { key: "archive", label: "Archivar", disabled: true },
  { key: "delete", label: "Eliminar", danger: true, shortcut: "⌫" },
];

export const Default: Story = {
  args: {
    trigger: <Button>Acciones</Button>,
    items: ITEMS,
    "aria-label": "Acciones del registro",
  },
};

export const WithDescriptions: Story = {
  args: {
    trigger: <Button>Exportar</Button>,
    "aria-label": "Formatos de exportación",
    items: [
      { key: "csv", label: "CSV", description: "Compatible con hojas de cálculo" },
      { key: "pdf", label: "PDF", description: "Listo para imprimir" },
      { key: "json", label: "JSON", description: "Para integraciones" },
    ],
  },
};

export const OnIconTrigger: Story = {
  args: {
    trigger: <ActionIcon aria-label="Más acciones">⋯</ActionIcon>,
    items: ITEMS,
    "aria-label": "Más acciones",
  },
};

export const Placements: Story = {
  render: () => (
    <Box display="flex" gap="md" style={{ flexWrap: "wrap" }}>
      {(["bottom start", "bottom end", "top start", "top end"] as const).map((placement) => (
        <Menu
          key={placement}
          placement={placement}
          items={ITEMS}
          aria-label={placement}
          trigger={<Button variant="outline">{placement}</Button>}
        />
      ))}
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={520} display="flex" direction="column" gap="md">
      <Title order={4}>Factura #2041</Title>
      <Text c="text.secondary">
        El menú acompaña a la fila sin robarle jerarquía: acción principal a la izquierda,
        secundarias plegadas.
      </Text>
      <Box display="flex" gap="sm" style={{ alignItems: "center" }}>
        <Button>Cobrar</Button>
        <Menu
          trigger={<ActionIcon aria-label="Más acciones">⋯</ActionIcon>}
          items={ITEMS}
          aria-label="Más acciones"
        />
      </Box>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "sober-light" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** APG menu button: Enter abre, las flechas navegan saltando deshabilitados, Escape cierra. */
export const KeyboardFlow: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    canvas.getByRole("button", { name: "Acciones" }).focus();
    await userEvent.keyboard("{Enter}");
    await expect(await body.findByRole("menu")).toBeInTheDocument();
    await expect(body.getAllByRole("menuitem")).toHaveLength(4);

    await expect(body.getByRole("menuitem", { name: /Archivar/ })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await userEvent.keyboard("{End}");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      void expect(body.queryByRole("menu")).toBeNull();
    });
  },
};

/** ArrowDown abre el menú con el foco ya en el primer item. */
export const ArrowOpens: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    canvas.getByRole("button", { name: "Acciones" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await body.findByRole("menu")).toBeInTheDocument();
  },
};
