import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Blockquote,
  Box,
} from "@stellaria/nebula-web";

const meta: Meta<typeof Blockquote> = {
  title: "Typography/Blockquote",
  component: Blockquote,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Blockquote>;

export const Default: Story = {
  render: () => (
    <Box maw={520}>
      <Blockquote cite="— Guía de Nebula">
        La personalización entre productos se logra exclusivamente vía temas, nunca con forks.
      </Blockquote>
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      {(["primary", "success", "warning", "error"] as const).map((color) => (
        <Blockquote key={color} color={color}>
          Acento de color {color}.
        </Blockquote>
      ))}
    </Box>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Box maw={520}>
      <Blockquote color="info" icon={<span aria-hidden="true">“</span>} cite="— Anónimo">
        Una cita con icono y atribución.
      </Blockquote>
    </Box>
  ),
};

export const Dark: Story = { ...Colors, globals: { theme: "dark" } };
