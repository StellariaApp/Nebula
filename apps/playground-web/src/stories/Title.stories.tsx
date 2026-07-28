import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Text, Title, type TitleOrder } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Title> = {
  title: "Typography/Title",
  component: Title,
  args: { children: "Título de sección" },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Title>;

export const Default: Story = {};

export const Orders: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      {([1, 2, 3, 4, 5, 6] as TitleOrder[]).map((order) => (
        <Title key={order} order={order}>
          Título order={order}
        </Title>
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Orders, globals: { theme: "nebula-dark" } };
export const Light: Story = { ...Orders, globals: { theme: "nebula-light" } };

/**
 * `order` es escala visual; el nivel semántico se conserva con `component` (docs/06 §2).
 * Aquí la secuencia de headings es h1 → h2 → h3 aunque el tamaño salte de order 1 a 3 y a 5.
 */
export const Composition: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" style={{ maxWidth: "68ch" }}>
      <Box display="flex" direction="column" gap="sm">
        <Title order={1}>Panel de operación</Title>
        <Text c="text.secondary">
          Resumen de cobranza, dispersión y conciliación de las cuentas activas.
        </Text>
      </Box>
      <Box display="flex" direction="column" gap="sm">
        <Title order={3} component="h2">
          Cobranza
        </Title>
        <Text fz="body2" c="text.secondary">
          128 cargos liquidados en las últimas 24 horas.
        </Text>
      </Box>
      <Box display="flex" direction="column" gap="sm">
        <Title order={5} component="h3">
          Incidencias
        </Title>
        <Text fz="body2" c="text.secondary">
          Dos cargos rechazados por fondos insuficientes.
        </Text>
      </Box>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <Title order={4}>Cobranza</Title>
        <Text fz="body2" c="text.secondary">
          128 cargos liquidados hoy.
        </Text>
      </Box>
    </ThemeMatrix>
  ),
};
