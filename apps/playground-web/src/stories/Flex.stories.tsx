import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Flex } from "@stellaria/nebula-web";

const meta: Meta<typeof Flex> = {
  title: "Layout/Flex",
  component: Flex,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Flex>;

function Cell({ children }: { children: string }) {
  return (
    <Box p="sm" bg="primary.600" c="text.onPrimary" r="sm">
      {children}
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Flex gap="sm">
      <Cell>uno</Cell>
      <Cell>dos</Cell>
      <Cell>tres</Cell>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap="sm" maw={200}>
      <Cell>uno</Cell>
      <Cell>dos</Cell>
      <Cell>tres</Cell>
    </Flex>
  ),
};

export const AlignJustify: Story = {
  render: () => (
    <Flex justify="space-between" align="center" gap="sm" p="sm" bg="surface.sunken" r="md">
      <Cell>izquierda</Cell>
      <Cell>centro</Cell>
      <Cell>derecha</Cell>
    </Flex>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...AlignJustify, globals: { theme: "nebula-light" } };
