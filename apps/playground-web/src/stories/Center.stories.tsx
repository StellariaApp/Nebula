import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Center,
  Text,
} from "@stellaria/nebula-web";

const meta: Meta<typeof Center> = {
  title: "Layout/Center",
  component: Center,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Center>;

export const Default: Story = {
  render: () => (
    <Center h={160} bg="surface.sunken" r="md">
      <Box p="sm" bg="primary.500" c="text.onPrimary" r="sm">
        centrado en ambos ejes
      </Box>
    </Center>
  ),
};

export const Inline: Story = {
  render: () => (
    <Text>
      texto con{" "}
      <Center inline px="xs">
        <Box bg="accent.500" c="text.onPrimary" px="xs" r="xs">
          badge
        </Box>
      </Center>{" "}
      en línea
    </Text>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Light: Story = { ...Default, globals: { theme: "light" } };
