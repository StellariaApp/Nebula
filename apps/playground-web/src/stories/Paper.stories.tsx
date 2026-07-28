import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Paper, Text } from "@stellaria/nebula-web";

import { ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Paper> = {
  title: "Layout/Paper",
  component: Paper,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Paper>;

export const Shadows: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((shadow) => (
        <Paper key={shadow} shadow={shadow} radius="md" p="md" miw={120}>
          <Text>shadow {shadow}</Text>
        </Paper>
      ))}
    </Box>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      <Paper withBorder radius="md" p="md">
        <Text>con borde</Text>
      </Paper>
      <Paper withBorder radius="lg" p="md" bg="surface.sunken">
        <Text>borde + bg sunken</Text>
      </Paper>
    </Box>
  ),
};

export const Radius: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["xs", "md", "xl"] as const).map((radius) => (
        <Paper key={radius} withBorder radius={radius} p="md" miw={110}>
          <Text>radius {radius}</Text>
        </Paper>
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Shadows, globals: { theme: "nebula-dark" } };
export const Playful: Story = { ...WithBorder, globals: { theme: "playful" } };

/** Una colección usa un solo nivel de elevación; el detalle sube un peldaño, no tres. */
export const Composition: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg" style={{ maxWidth: "60ch" }}>
      <Box display="flex" direction="column" gap="md">
        {["Cuenta operativa", "Cuenta de reserva"].map((account) => (
          <Paper key={account} withBorder shadow="xs" radius="md" p="lg">
            <Box display="flex" justify="space-between" align="baseline" gap="md">
              <Text fw="semibold">{account}</Text>
              <Text fz="body2" c="text.secondary">
                MXN 1,248,300.00
              </Text>
            </Box>
            <Text fz="caption" c="text.muted" mt="xs">
              Actualizado hace 4 minutos
            </Text>
          </Paper>
        ))}
      </Box>
      <Paper withBorder shadow="md" radius="md" p="lg">
        <Text fw="semibold">Detalle seleccionado</Text>
        <Text fz="body2" c="text.secondary" mt="xs">
          Un solo peldaño por encima de la colección basta para señalar el foco.
        </Text>
      </Paper>
    </Box>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <Paper withBorder shadow="xs" radius="md" p="md">
          <Text fz="body2">Nivel 1 · card</Text>
        </Paper>
        <Paper withBorder shadow="md" radius="md" p="md">
          <Text fz="body2">Nivel 3 · popover</Text>
        </Paper>
      </Box>
    </ThemeMatrix>
  ),
};
