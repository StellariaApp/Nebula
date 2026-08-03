import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio, Center, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof AspectRatio> = {
  title: "Layout/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Ratios: Story = {
  render: () => (
    <Center display="flex" gap="md" wrap="wrap" align="flex-start">
      {(
        [
          ["16 / 9", 16 / 9],
          ["4 / 3", 4 / 3],
          ["1 / 1", 1],
        ] as const
      ).map(([label, ratio]) => (
        <AspectRatio key={label} ratio={ratio} maw={220}>
          <Center bg="primary.600" r="md">
            <Text c="text.onPrimary">{label}</Text>
          </Center>
        </AspectRatio>
      ))}
    </Center>
  ),
};

export const Dark: Story = { ...Ratios, globals: { theme: "dark" } };
export const Light: Story = { ...Ratios, globals: { theme: "light" } };
