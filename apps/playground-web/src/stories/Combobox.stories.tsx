import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, Combobox, Text, Title } from "@stellaria/nebula-web";
import type { SelectOption } from "@stellaria/nebula-web";

const meta: Meta<typeof Combobox> = {
  title: "Inputs/Combobox",
  component: Combobox,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

const PAISES: SelectOption[] = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina", disabled: true },
  { value: "cl", label: "Chile" },
  { value: "pe", label: "Perú" },
  { value: "uy", label: "Uruguay" },
];

export const Default: Story = {
  render: () => (
    <Box maw={320}>
      <Combobox label="País" data={PAISES} placeholder="Escribe para buscar" />
    </Box>
  ),
};

/** El filtro es por subcadena y respeta acentos: `co` casa con Colombia y con Méxi<b>co</b>. */
export const Filtering: Story = {
  render: () => (
    <Box maw={360} display="flex" direction="column" gap="sm">
      <Combobox label="País" data={PAISES} placeholder="Prueba con «co» o «MEXI»" />
      <Text fz="caption" c="text.secondary">
        Escribe «co»: coinciden Colombia y México.
      </Text>
    </Box>
  ),
};

export const AllowsCustomValue: Story = {
  render: () => (
    <Box maw={320}>
      <Combobox
        label="Etiqueta"
        data={PAISES}
        allowsCustomValue
        description="Acepta valores fuera de la lista"
      />
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={320} pt="xl">
      <Combobox label="Con valor" data={PAISES} defaultValue="cl" />
      <Combobox label="Requerido" data={PAISES} required />
      <Combobox label="Deshabilitado" data={PAISES} disabled />
      <Combobox label="Con error" data={PAISES} error="Selecciona un país" />
    </Box>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Box maw={320}>
      <Combobox label="País" data={PAISES} emptyLabel="Ningún país coincide" />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={420} display="flex" direction="column" gap="md">
      <Title order={4}>Buscar destino</Title>
      <Text c="text.secondary">
        El combobox se comporta como un campo de texto: se puede escribir, filtrar y elegir con el
        teclado.
      </Text>
      <Combobox label="País" data={PAISES} placeholder="Escribe para buscar" required />
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "playful" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/** APG combobox: escribir filtra, las flechas navegan y Enter confirma. */
export const KeyboardFlow: Story = {
  render: () => (
    <Box maw={320}>
      <Combobox label="País" data={PAISES} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const input = canvas.getByRole("combobox", { name: "País" });
    await expect(input).toHaveAttribute("aria-expanded", "false");

    await userEvent.type(input, "col");
    await expect(await body.findByRole("listbox")).toBeInTheDocument();
    await expect(body.getAllByRole("option")).toHaveLength(1);

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expect(body.queryByRole("listbox")).toBeNull();
    await expect(input).toHaveValue("Colombia");
  },
};
