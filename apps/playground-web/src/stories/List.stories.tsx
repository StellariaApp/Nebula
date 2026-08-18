import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  List,
} from "@stellaria/nebula-web";

const meta: Meta<typeof List> = {
  title: "Typography/List",
  component: List,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  render: () => (
    <List withPadding>
      <List.Item>Primer punto</List.Item>
      <List.Item>Segundo punto</List.Item>
      <List.Item>Tercer punto</List.Item>
    </List>
  ),
};

export const Ordered: Story = {
  render: () => (
    <List type="ordered" withPadding spacing="sm">
      <List.Item>Paso uno</List.Item>
      <List.Item>Paso dos</List.Item>
      <List.Item>Paso tres</List.Item>
    </List>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <List icon={<span aria-hidden="true">✓</span>} spacing="sm">
      <List.Item>Tarea completada</List.Item>
      <List.Item>Otra tarea completada</List.Item>
      <List.Item icon={<span aria-hidden="true">›</span>}>Con icono propio</List.Item>
    </List>
  ),
};

export const Dark: Story = { ...WithIcon, globals: { theme: "dark" } };

export const Nested: Story = {
  render: () => (
    <Box maw={420}>
      <List withPadding>
        <List.Item>Nivel uno</List.Item>
        <List.Item>
          Nivel uno con anidada
          <List withPadding spacing="none">
            <List.Item>Anidada A</List.Item>
            <List.Item>Anidada B</List.Item>
          </List>
        </List.Item>
      </List>
    </Box>
  ),
};
