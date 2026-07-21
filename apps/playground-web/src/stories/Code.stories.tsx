import type { Meta, StoryObj } from "@storybook/react-vite";

import { Code, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Code> = {
  title: "Typography/Code",
  component: Code,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Code>;

export const Inline: Story = {
  render: () => (
    <Text>
      Instala con <Code>pnpm add @stellaria/nebula-web</Code> y listo.
    </Text>
  ),
};

export const Block: Story = {
  render: () => (
    <Code block>{`import { Button } from "@stellaria/nebula-web";

export function App() {
  return <Button>Hola</Button>;
}`}</Code>
  ),
};

export const Dark: Story = { ...Block, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...Block, globals: { theme: "nebula-light" } };
