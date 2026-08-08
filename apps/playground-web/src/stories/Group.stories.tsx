import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Group } from "@stellaria/nebula-web";

const meta: Meta<typeof Group> = {
  title: "Layout/Group",
  component: Group,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Group>;

function Cell({ children }: { children: string }) {
  return (
    <Box p="sm" bg="primary.500" c="text.onPrimary" r="sm">
      {children}
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Group gap="sm">
      <Cell>uno</Cell>
      <Cell>dos</Cell>
      <Cell>tres</Cell>
    </Group>
  ),
};

/** `grow` reparte el ancho por igual; `preventGrowOverflow` evita que un hijo largo desborde. */
export const Grow: Story = {
  render: () => (
    <Group gap="sm" grow>
      <Cell>corto</Cell>
      <Cell>un poco más largo</Cell>
      <Cell>x</Cell>
    </Group>
  ),
};

export const Dark: Story = { ...Grow, globals: { theme: "dark" } };
export const Light: Story = { ...Default, globals: { theme: "light" } };
