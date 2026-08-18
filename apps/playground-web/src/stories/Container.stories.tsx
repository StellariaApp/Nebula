import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Container,
  Paper,
  Text,
} from "@stellaria/nebula-web";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Container>;

export const Sizes: Story = {
  render: () => (
    <>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Container key={size} size={size} my="sm">
          <Paper p="sm" withBorder r="md">
            <Text>size = {size}</Text>
          </Paper>
        </Container>
      ))}
    </>
  ),
};

export const Fluid: Story = {
  render: () => (
    <Container fluid py="md">
      <Paper p="md" withBorder r="md">
        <Text>fluid: ocupa todo el ancho disponible</Text>
      </Paper>
    </Container>
  ),
};

export const Dark: Story = { ...Sizes, globals: { theme: "dark" } };
export const Light: Story = { ...Sizes, globals: { theme: "light" } };
