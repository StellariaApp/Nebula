import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Mark, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Mark> = {
  title: "Typography/Mark",
  component: Mark,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Mark>;

export const Default: Story = {
  render: () => (
    <Text>
      Un texto con una <Mark>parte resaltada</Mark> en medio.
    </Text>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      {(["primary", "accent", "gray", "success", "warning", "error", "info"] as const).map(
        (color) => (
          <Text key={color}>
            color={color}: <Mark color={color}>resaltado</Mark>
          </Text>
        ),
      )}
    </Box>
  ),
};

export const Dark: Story = { ...Colors, globals: { theme: "nebula-dark" } };
