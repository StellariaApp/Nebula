import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Grid } from "@stellaria/nebula-web";

const meta: Meta<typeof Grid> = {
  title: "Layout/Grid",
  component: Grid,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Grid>;

function Cell({ children }: { children: string }) {
  return (
    <Box p="sm" bg="primary.600" c="text.onPrimary" r="sm" ta="center">
      {children}
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Grid columns={12} gutter="sm">
      <Grid.Col span={6}>
        <Cell>span 6</Cell>
      </Grid.Col>
      <Grid.Col span={6}>
        <Cell>span 6</Cell>
      </Grid.Col>
      <Grid.Col span={4}>
        <Cell>span 4</Cell>
      </Grid.Col>
      <Grid.Col span={4}>
        <Cell>span 4</Cell>
      </Grid.Col>
      <Grid.Col span={4}>
        <Cell>span 4</Cell>
      </Grid.Col>
    </Grid>
  ),
};

export const Offset: Story = {
  render: () => (
    <Grid columns={12} gutter="sm">
      <Grid.Col span={4} offset={4}>
        <Cell>span 4 · offset 4</Cell>
      </Grid.Col>
      <Grid.Col span={4}>
        <Cell>span 4</Cell>
      </Grid.Col>
    </Grid>
  ),
};

/** `span="auto"` reparte el espacio restante a partes iguales. */
export const AutoAndContent: Story = {
  render: () => (
    <Grid columns={12} gutter="sm">
      <Grid.Col span="content">
        <Cell>content</Cell>
      </Grid.Col>
      <Grid.Col span="auto">
        <Cell>auto</Cell>
      </Grid.Col>
      <Grid.Col span="auto">
        <Cell>auto</Cell>
      </Grid.Col>
    </Grid>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...Default, globals: { theme: "nebula-light" } };
