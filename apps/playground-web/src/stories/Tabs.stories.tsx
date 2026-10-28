import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Tabs, Text } from "@stellaria/nebula-web";

const DATA = [
  { value: "resumen", label: "Resumen", content: <Text>Movimientos del mes</Text> },
  { value: "facturas", label: "Facturas", content: <Text>Listado de facturas</Text> },
  { value: "ajustes", label: "Ajustes", disabled: true, content: <Text>Ajustes</Text> },
  { value: "equipo", label: "Equipo", content: <Text>Personas con acceso</Text> },
];

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  args: { data: DATA, "aria-label": "Cuenta" },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tabs key={size} {...args} size={size} aria-label={`Cuenta ${size}`} />
      ))}
    </>
  ),
};

export const InContext: Story = { args: { fullWidth: true } };

export const Dark: Story = { globals: { theme: "dark" } };

export const ReducedMotion: Story = { globals: { reducedMotion: "reduce" } };

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "Resumen" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Facturas" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Equipo" })).toHaveFocus();
  },
};
