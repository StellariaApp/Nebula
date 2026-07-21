import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Space, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Space> = {
  title: "Layout/Space",
  component: Space,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Space>;

export const Vertical: Story = {
  render: () => (
    <Box>
      <Text>bloque uno</Text>
      <Space h="xl" />
      <Text>bloque dos (separado por Space h=xl)</Text>
    </Box>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Box display="flex" align="center">
      <Box p="sm" bg="primary.600" c="text.onPrimary" r="sm">
        a
      </Box>
      <Space w="lg" />
      <Box p="sm" bg="primary.600" c="text.onPrimary" r="sm">
        b
      </Box>
    </Box>
  ),
};

export const Dark: Story = { ...Vertical, globals: { theme: "nebula-dark" } };
