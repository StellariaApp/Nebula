import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Box,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  SegmentedControl,
  Switch,
  SwitchGroup,
} from "@stellaria/nebula-web";

const meta: Meta = {
  title: "Forms/Toggles",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Checkboxes: Story = {
  render: () => (
    <CheckboxGroup label="Notificaciones" defaultValue={["email"]}>
      <Checkbox value="email" label="Correo electrónico" />
      <Checkbox value="sms" label="SMS" />
      <Checkbox value="push" label="Push" />
    </CheckboxGroup>
  ),
};

export const CheckboxSizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Checkbox key={size} size={size} label={`size ${size}`} defaultChecked />
      ))}
    </Box>
  ),
};

export const Radios: Story = {
  render: () => (
    <RadioGroup label="Plan" defaultValue="pro" description="Puedes cambiarlo cuando quieras">
      <Radio value="free" label="Gratis" />
      <Radio value="pro" label="Pro" />
      <Radio value="team" label="Equipo" />
    </RadioGroup>
  ),
};

export const Switches: Story = {
  render: () => (
    <SwitchGroup label="Preferencias" defaultValue={["dark"]}>
      <Switch value="dark" label="Modo oscuro" />
      <Switch value="sound" label="Sonidos" />
      <Switch value="beta" label="Funciones beta" />
    </SwitchGroup>
  ),
};

export const Segmented: Story = {
  render: function SegmentedStory() {
    const [view, set_view] = useState("lista");
    return (
      <Box display="flex" direction="column" gap="md" align="flex-start">
        <SegmentedControl
          aria-label="Vista"
          value={view}
          onChange={set_view}
          data={[
            { value: "lista", label: "Lista" },
            { value: "cuadricula", label: "Cuadrícula" },
            { value: "tabla", label: "Tabla" },
          ]}
        />
        <SegmentedControl aria-label="Rango" fullWidth data={["Día", "Semana", "Mes", "Año"]} />
      </Box>
    );
  },
};

export const Dark: Story = { ...Switches, globals: { theme: "nebula-dark" } };

export const Keyboard: Story = {
  render: () => (
    <CheckboxGroup label="Opciones">
      <Checkbox value="a" label="Opción A" />
      <Checkbox value="b" label="Opción B" />
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("checkbox", { name: "Opción A" });
    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.keyboard(" ");
    await expect(first).toBeChecked();
  },
};
