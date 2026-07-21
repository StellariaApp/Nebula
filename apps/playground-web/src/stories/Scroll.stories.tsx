import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Scroll, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Scroll> = {
  title: "Layout/Scroll",
  component: Scroll,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Scroll>;

export const Vertical: Story = {
  render: () => (
    <Scroll axis="y" h={160} p="sm" bg="surface.sunken" r="md" tabIndex={0} aria-label="Lista">
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i}>línea {i + 1}</Text>
      ))}
    </Scroll>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Scroll axis="x" p="sm" bg="surface.sunken" r="md" tabIndex={0} aria-label="Columnas">
      <Box display="flex" gap="sm" w={1200}>
        {Array.from({ length: 12 }, (_, i) => (
          <Box key={i} p="sm" bg="primary.600" c="text.onPrimary" r="sm" miw={120} ta="center">
            col {i + 1}
          </Box>
        ))}
      </Box>
    </Scroll>
  ),
};

export const Dark: Story = { ...Vertical, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...Vertical, globals: { theme: "nebula-light" } };
