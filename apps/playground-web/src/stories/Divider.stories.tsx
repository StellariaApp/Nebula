import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Divider, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Divider> = {
  title: "Layout/Divider",
  component: Divider,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <Box>
      <Text>arriba</Text>
      <Divider my="sm" />
      <Text>abajo</Text>
    </Box>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Divider label="izquierda" labelPosition="left" />
      <Divider label="centro" labelPosition="center" />
      <Divider label="derecha" labelPosition="right" />
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" color="strong" size="md" />
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box display="flex" align="center" gap="sm" h={40}>
      <Text>uno</Text>
      <Divider orientation="vertical" />
      <Text>dos</Text>
      <Divider orientation="vertical" />
      <Text>tres</Text>
    </Box>
  ),
};

export const Dark: Story = { ...WithLabel, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...WithLabel, globals: { theme: "nebula-light" } };
