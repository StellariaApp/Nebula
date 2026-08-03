import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, MultiSelect, Text, Title } from "@stellaria/nebula-web";
import type { SelectOption } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof MultiSelect> = {
  title: "Inputs/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof MultiSelect>;

const ETIQUETAS: SelectOption[] = [
  { value: "urgente", label: "Urgente" },
  { value: "bug", label: "Bug" },
  { value: "mejora", label: "Mejora" },
  { value: "docs", label: "Documentación" },
  { value: "bloqueado", label: "Bloqueado", disabled: true },
  { value: "diseno", label: "Diseño" },
];

export const Default: Story = {
  render: () => (
    <Box maw={380}>
      <MultiSelect label="Etiquetas" data={ETIQUETAS} />
    </Box>
  ),
};

export const WithValues: Story = {
  render: () => (
    <Box maw={380}>
      <MultiSelect label="Etiquetas" data={ETIQUETAS} defaultValue={["urgente", "bug"]} />
    </Box>
  ),
};

/** Al llegar al tope solo se bloquean las opciones no elegidas: las actuales siguen quitándose. */
export const MaxValues: Story = {
  render: () => (
    <Box maw={380}>
      <MultiSelect
        label="Etiquetas"
        description="Máximo 2"
        data={ETIQUETAS}
        maxValues={2}
        defaultValue={["urgente", "bug"]}
      />
    </Box>
  ),
};

export const NotSearchable: Story = {
  render: () => (
    <Box maw={380}>
      <MultiSelect label="Etiquetas" data={ETIQUETAS} searchable={false} />
    </Box>
  ),
};

export const States: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="xl" maw={380} pt="xl">
      <MultiSelect label="Requerido" data={ETIQUETAS} required />
      <MultiSelect label="Deshabilitado" data={ETIQUETAS} defaultValue={["bug"]} disabled />
      <MultiSelect label="Con error" data={ETIQUETAS} error="Selecciona al menos una" />
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={440} display="flex" direction="column" gap="md">
      <Title order={4}>Filtrar incidencias</Title>
      <Text c="text.secondary">
        Los valores elegidos quedan como chips dentro del campo, cada uno con su botón de quitar.
      </Text>
      <MultiSelect label="Etiquetas" data={ETIQUETAS} defaultValue={["urgente"]} />
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/**
 * Selección por teclado y chip resultante. Mientras la lista está abierta React Aria marca como
 * `aria-hidden` todo lo que queda fuera del combobox —chips incluidos—, así que el botón de quitar
 * solo es alcanzable con la lista cerrada.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <Box maw={380}>
      <MultiSelect label="Etiquetas" data={ETIQUETAS} />
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    const input = canvas.getByRole("combobox", { name: "Etiquetas" });
    await userEvent.type(input, "bug");

    const listbox = await body.findByRole("listbox");
    await expect(listbox).toHaveAttribute("aria-multiselectable", "true");

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    await expect(
      canvas.getByRole("button", { name: "Quitar Bug", hidden: true }),
    ).toBeInTheDocument();
  },
};
