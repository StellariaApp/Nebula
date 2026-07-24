import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, within } from "storybook/test";

import { Box, ContextMenu, Paper, Text, Title } from "@stellaria/nebula-web";
import type { MenuItemData } from "@stellaria/nebula-web";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

const ITEMS: MenuItemData[] = [
  { key: "copy", label: "Copiar", shortcut: "⌘C" },
  { key: "paste", label: "Pegar", shortcut: "⌘V" },
  { key: "rename", label: "Renombrar" },
  { key: "delete", label: "Eliminar", danger: true },
];

const SURFACE = (
  <Paper withBorder radius="md" p="xl" shadow="xs">
    <Text>Haz click derecho aquí</Text>
  </Paper>
);

export const Default: Story = {
  args: { items: ITEMS, "aria-label": "Acciones del archivo", children: SURFACE },
};

export const Composition: Story = {
  render: () => (
    <Box maw={520} display="flex" direction="column" gap="md">
      <Title order={4}>Documentos</Title>
      <Text c="text.secondary">
        Cada fila abre su menú contextual con click derecho, o con Shift+F10 desde el teclado.
      </Text>
      <Box display="flex" direction="column" gap="xs">
        {["Contrato marco.pdf", "Anexo tarifas.xlsx", "Acta 2041.docx"].map((name) => (
          <ContextMenu key={name} items={ITEMS} aria-label={`Acciones de ${name}`}>
            <Paper withBorder radius="sm" p="sm">
              <Text>{name}</Text>
            </Paper>
          </ContextMenu>
        ))}
      </Box>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "playful" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** El menú contextual se abre con la tecla dedicada, no solo con ratón. */
export const KeyboardFlow: Story = {
  render: () => (
    <ContextMenu items={ITEMS} aria-label="Acciones">
      <button type="button">Fila seleccionable</button>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const row = canvas.getByRole("button", { name: "Fila seleccionable" });
    row.focus();
    await fireEvent.keyDown(row, { key: "F10", shiftKey: true });

    await expect(await body.findByRole("menu")).toBeInTheDocument();
    await expect(body.getAllByRole("menuitem")).toHaveLength(4);
  },
};
