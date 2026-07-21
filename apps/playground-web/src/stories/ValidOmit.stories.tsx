import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Omit, Text, Valid } from "@stellaria/nebula-web";

const meta: Meta<typeof Valid> = {
  title: "Utilities/Valid & Omit",
  component: Valid,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Valid>;

export const ValidGuard: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Valid valid invalid={<Text c="text.muted">rama inválida</Text>}>
        <Text>valid = true → children</Text>
      </Valid>
      <Valid valid={false} invalid={<Text c="text.muted">valid = false → invalid</Text>}>
        <Text>no visible</Text>
      </Valid>
    </Box>
  ),
};

export const OmitGuard: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Omit>
        <Text>omit por defecto es false → visible</Text>
      </Omit>
      <Omit omit>
        <Text>no visible</Text>
      </Omit>
    </Box>
  ),
};

export const Dark: Story = { ...ValidGuard, globals: { theme: "nebula-dark" } };
