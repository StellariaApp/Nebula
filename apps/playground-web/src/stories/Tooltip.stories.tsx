import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ActionIcon, Box, Button, Text, Title, Tooltip } from "@stellaria/nebula-web";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    trigger: <Button>Guardar</Button>,
    label: "Guarda los cambios del formulario",
  },
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" gap="lg">
      <Tooltip trigger={<Button variant="outline">neutral</Button>} label="Superficie de overlay" />
      <Tooltip
        color="inverted"
        trigger={<Button variant="outline">inverted</Button>}
        label="Alto contraste"
      />
    </Box>
  ),
};

export const Placements: Story = {
  render: () => (
    <Box display="flex" gap="lg" style={{ flexWrap: "wrap" }}>
      {(["top", "bottom", "start", "end"] as const).map((placement) => (
        <Tooltip
          key={placement}
          placement={placement}
          withArrow
          trigger={<Button variant="outline">{placement}</Button>}
          label={`Anclado a ${placement}`}
        />
      ))}
    </Box>
  ),
};

/** Caso canónico: botón solo-icono cuyo nombre accesible ya viene de aria-label. */
export const OnIconButton: Story = {
  render: () => (
    <Box display="flex" gap="md">
      <Tooltip
        label="Duplicar registro"
        trigger={
          <ActionIcon aria-label="Duplicar registro" variant="light">
            ⧉
          </ActionIcon>
        }
      />
      <Tooltip
        label="Eliminar registro"
        color="inverted"
        trigger={
          <ActionIcon aria-label="Eliminar registro" variant="light" color="error">
            ✕
          </ActionIcon>
        }
      />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={520} display="flex" direction="column" gap="md">
      <Title order={4}>Barra de herramientas</Title>
      <Text c="text.secondary">
        Los tooltips acompañan acciones icónicas sin sustituir su nombre accesible.
      </Text>
      <Box display="flex" gap="sm">
        <Tooltip label="Deshacer" trigger={<ActionIcon aria-label="Deshacer">↶</ActionIcon>} />
        <Tooltip label="Rehacer" trigger={<ActionIcon aria-label="Rehacer">↷</ActionIcon>} />
        <Tooltip label="Exportar a CSV" trigger={<Button variant="outline">Exportar</Button>} />
      </Box>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "playful" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** El tooltip aparece al enfocar por teclado y desaparece al salir el foco. */
export const KeyboardFlow: Story = {
  args: { trigger: <Button>Guardar</Button>, label: "Guarda los cambios", delay: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Guardar" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await within(document.body).findByRole("tooltip")).toBeInTheDocument();

    await userEvent.tab();
    await expect(within(document.body).queryByRole("tooltip")).toBeNull();
  },
};
