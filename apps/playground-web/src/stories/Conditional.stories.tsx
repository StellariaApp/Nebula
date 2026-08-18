import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Conditional,
  Text,
} from "@stellaria/nebula-web";

const meta: Meta<typeof Conditional> = {
  title: "Utilities/Conditional",
  component: Conditional,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Conditional>;

export const WhenTrue: Story = {
  render: () => (
    <Conditional when fallback={<Text c="text.muted">fallback</Text>}>
      <Text>se muestra porque when es true</Text>
    </Conditional>
  ),
};

export const WhenFalse: Story = {
  render: () => (
    <Conditional when={false} fallback={<Text c="text.muted">se muestra el fallback</Text>}>
      <Text>no visible</Text>
    </Conditional>
  ),
};

export const Dark: Story = { ...WhenTrue, globals: { theme: "dark" } };
