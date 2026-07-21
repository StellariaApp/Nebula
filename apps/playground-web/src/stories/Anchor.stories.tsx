import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Anchor, Box, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Anchor> = {
  title: "Typography/Anchor",
  component: Anchor,
  args: { href: "#anchor", children: "un enlace" },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  render: (args) => (
    <Text>
      Texto con <Anchor {...args} /> dentro de un párrafo.
    </Text>
  ),
};

export const Underlines: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Anchor href="#a" underline="always">
        underline always (por defecto)
      </Anchor>
      <Anchor href="#a" underline="hover">
        underline hover
      </Anchor>
      <Anchor href="#a" underline="never">
        underline never
      </Anchor>
    </Box>
  ),
};

export const Colored: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Anchor href="#a" c="primary.600">
        enlace teñido primary.600
      </Anchor>
      <Anchor href="#a" external>
        enlace externo (target + rel)
      </Anchor>
    </Box>
  ),
};

export const Dark: Story = { ...Underlines, globals: { theme: "nebula-dark" } };

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "un enlace" });
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};
