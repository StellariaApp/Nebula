import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, SimpleGrid } from "@stellaria/nebula-web";

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

/** ADR-201: una celda que abarca dos columnas y dos filas; el resto va suelto. */
export const MosaicoConCelda2x2: Story = {
  name: "Mosaico con celda 2×2",
  render: () => (
    <SimpleGrid cols={{ base: 2, laptop: 4 }} spacing="sm">
      <SimpleGrid.Cell span={2} rowSpan={2}>
        <Box p="sm" bg="accent.500" c="text.onPrimary" r="sm" ta="center" h="100%">
          2 × 2
        </Box>
      </SimpleGrid.Cell>
      <Cells n={8} />
      <SimpleGrid.Cell span={{ base: 2, laptop: 4 }}>
        <Box p="sm" bg="primary.700" c="text.onPrimary" r="sm" ta="center">
          ancho completo
        </Box>
      </SimpleGrid.Cell>
    </SimpleGrid>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Light: Story = { ...Responsive, globals: { theme: "light" } };
