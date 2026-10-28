import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Avatar, AvatarGroup, Box } from "@stellaria/nebula-web";

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  parameters: { layout: "padded" },
  args: { name: "Ana Rivera" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" align="center" gap="md">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size} name="Ana Rivera" />
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" align="center" gap="md">
      <Avatar name="Beto Ruiz" color="success" />
      <Avatar name="Carla Díaz" color="warning" radius="md" />
      <Avatar src="/imagen-que-no-existe.png" name="Dani Mora" />
      <Avatar />
    </Box>
  ),
};

export const InContext: Story = {
  render: () => (
    <AvatarGroup max={3} total={8} aria-label="Equipo del proyecto">
      <Avatar name="Ana Rivera" />
      <Avatar name="Beto Ruiz" color="success" />
      <Avatar name="Carla Díaz" color="warning" />
      <Avatar name="Dani Mora" />
    </AvatarGroup>
  ),
};

export const Dark: Story = { ...InContext, globals: { theme: "dark" } };

export const AccessibleName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "Ana Rivera" })).toBeInTheDocument();
  },
};
