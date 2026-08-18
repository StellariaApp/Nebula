import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  SimpleGrid,
} from "@stellaria/nebula-web";

const meta: Meta<typeof SimpleGrid> = {
  title: "Layout/SimpleGrid",
  component: SimpleGrid,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof SimpleGrid>;

function Cells({ n }: { n: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} p="sm" bg="primary.500" c="text.onPrimary" r="sm" ta="center">
          {i + 1}
        </Box>
      ))}
    </>
  );
}

export const Default: Story = {
  render: () => (
    <SimpleGrid cols={3} spacing="sm">
      <Cells n={6} />
    </SimpleGrid>
  ),
};

/** Cambia el viewport en la toolbar: 1 → 2 → 4 columnas por breakpoint. */
export const Responsive: Story = {
  render: () => (
    <SimpleGrid cols={{ base: 1, tablet: 2, laptop: 4 }} spacing="sm">
      <Cells n={8} />
    </SimpleGrid>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Light: Story = { ...Responsive, globals: { theme: "light" } };
