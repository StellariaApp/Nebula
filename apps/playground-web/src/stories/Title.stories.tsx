import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Title, type TitleOrder } from "@stellaria/nebula-web";

const meta: Meta<typeof Title> = {
  title: "Typography/Title",
  component: Title,
  args: { children: "Título de sección" },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Title>;

export const Default: Story = {};

export const Orders: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      {([1, 2, 3, 4, 5, 6] as TitleOrder[]).map((order) => (
        <Title key={order} order={order}>
          Título order={order}
        </Title>
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Orders, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...Orders, globals: { theme: "nebula-light" } };
