import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Paper, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Paper> = {
  title: "Layout/Paper",
  component: Paper,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Paper>;

export const Shadows: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Paper key={shadow} shadow={shadow} radius="md" p="md" miw={120}>
          <Text>shadow {shadow}</Text>
        </Paper>
      ))}
    </Box>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      <Paper withBorder radius="md" p="md">
        <Text>con borde</Text>
      </Paper>
      <Paper withBorder radius="lg" p="md" bg="surface.sunken">
        <Text>borde + bg sunken</Text>
      </Paper>
    </Box>
  ),
};

export const Radius: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["xs", "md", "xl"] as const).map((radius) => (
        <Paper key={radius} withBorder radius={radius} p="md" miw={110}>
          <Text>radius {radius}</Text>
        </Paper>
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Shadows, globals: { theme: "nebula-dark" } };
export const Playful: Story = { ...WithBorder, globals: { theme: "playful" } };
