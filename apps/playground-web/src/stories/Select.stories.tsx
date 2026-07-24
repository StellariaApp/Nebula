import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, Button, Select, Text, TextInput, Title } from "@stellaria/nebula-web";
import type { SelectOption } from "@stellaria/nebula-web";

const meta: Meta<typeof Select> = {
  title: "Inputs/Select",
  component: Select,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Select>;

const PAISES: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
  { value: "pe", label: "Perú" },
];

const PLANES: SelectOption[] = [
  { value: "free", label: "Gratuito", description: "Hasta 3 proyectos" },
  { value: "pro", label: "Profesional", description: "Proyectos ilimitados" },
  { value: "team", label: "Equipo", description: "Roles y auditoría" },
];

export const Default: Story = {
  render: () => (
    <Box maw={320}>
      <Select label="País" data={PAISES} />
    </Box>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Box maw={360}>
      <Select label="Plan" description="Puedes cambiarlo cuando quieras" data={PLANES} />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={320}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Select key={size} size={size} label={size} data={PAISES} />
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={320} pt="xl">
      <Select label="Con valor" data={PAISES} defaultValue="cl" />
      <Select label="Requerido" data={PAISES} required />
      <Select label="Deshabilitado" data={PAISES} disabled />
      <Select label="Con error" data={PAISES} error="Selecciona un país" />
      <Select label="Error inline" data={PAISES} error="Selecciona un país" errorDisplay="text" />
    </Box>
  ),
};

/** `renderOption` sustituye la fila completa sin perder el comportamiento APG. */
export const CustomOption: Story = {
  render: () => (
    <Box maw={360}>
      <Select
        label="Plan"
        data={PLANES}
        renderOption={(option, state) => (
          <Box display="flex" direction="column" style={{ flex: 1 }}>
            <Text fw="semibold">{option.label}</Text>
            <Text fz="caption" c={state.isFocused ? "text.onPrimary" : "text.secondary"}>
              {option.description}
            </Text>
          </Box>
        )}
      />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="md">
      <Title order={4}>Datos de envío</Title>
      <Text c="text.secondary">
        El select comparte alto, radio y foco con el resto de campos del formulario.
      </Text>
      <TextInput label="Dirección" placeholder="Calle y número" />
      <Select label="País" data={PAISES} required />
      <TextInput label="Código postal" placeholder="00000" />
      <Button>Guardar dirección</Button>
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "sober-light" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** APG listbox: flechas navegan, Enter selecciona, Escape cierra. */
export const KeyboardFlow: Story = {
  render: () => (
    <Box maw={320}>
      <Select label="País" data={PAISES} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const trigger = canvas.getByRole("button", { name: /País/ });
    trigger.focus();
    await userEvent.keyboard("{ArrowDown}");

    const listbox = await body.findByRole("listbox");
    await expect(listbox).toBeInTheDocument();
    await expect(body.getByRole("option", { name: "Argentina" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expect(body.queryByRole("listbox")).toBeNull();
    await expect(trigger).toHaveTextContent("Colombia");
  },
};
