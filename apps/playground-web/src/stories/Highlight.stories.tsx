import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Highlight } from "@stellaria/nebula-web";

const meta: Meta<typeof Highlight> = {
  title: "Typography/Highlight",
  component: Highlight,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Highlight>;

export const Default: Story = {
  args: { highlight: "Nebula", children: "Nebula es una librería UI universal Web + Native." },
};

export const MultipleTerms: Story = {
  render: () => (
    <Box maw={520}>
      <Highlight highlight={["Web", "Native"]} color="info">
        Un mismo componente en Web y en Native con la misma API.
      </Highlight>
    </Box>
  ),
};

export const CaseInsensitive: Story = {
  args: { highlight: "ui", children: "UI, ui, Ui — todas las coincidencias se resaltan." },
};

export const Dark: Story = {
  ...MultipleTerms,
  globals: { theme: "dark" },
};
