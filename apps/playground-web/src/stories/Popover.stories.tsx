import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Box, Button, Popover, Text, TextInput, Title } from "@stellaria/nebula-web";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button>Abrir panel</Button>,
    "aria-label": "Detalles",
    children: <Text>Contenido del popover, anclado al trigger.</Text>,
  },
};

export const WithArrow: Story = {
  args: { ...Default.args, withArrow: true },
};

export const Placements: Story = {
  render: () => (
    <Box display="flex" gap="md" style={{ flexWrap: "wrap" }}>
      {(["top", "bottom", "start", "end"] as const).map((placement) => (
        <Popover
          key={placement}
          placement={placement}
          withArrow
          aria-label={placement}
          trigger={<Button variant="outline">{placement}</Button>}
        >
          <Text>Anclado a {placement}</Text>
        </Popover>
      ))}
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={520} display="flex" direction="column" gap="md">
      <Title order={4}>Miembros del equipo</Title>
      <Text c="text.secondary">
        El popover contiene un formulario real para comprobar foco, medida de texto y superficie.
      </Text>
      <Popover
        aria-label="Invitar miembro"
        trigger={<Button>Invitar</Button>}
        width={300}
        withArrow
      >
        <Box display="flex" direction="column" gap="sm">
          <Title order={6}>Invitar por correo</Title>
          <TextInput label="Correo" placeholder="persona@empresa.com" />
          <Button size="sm">Enviar invitación</Button>
        </Box>
      </Popover>
    </Box>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = {
  ...Composition,
  globals: { theme: "sober-light" },
};

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** Enter abre, Escape cierra y el foco vuelve al trigger. */
export const KeyboardFlow: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir panel" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(await within(document.body).findByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await expect(within(document.body).queryByRole("dialog")).toBeNull();
    await waitFor(() => {
      void expect(trigger).toHaveFocus();
    });
  },
};
