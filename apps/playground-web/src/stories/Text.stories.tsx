import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Text } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const SIZES = ["h1", "h2", "h3", "h4", "h5", "h6", "body1", "body2", "body3", "caption"] as const;

const SAMPLE = "El veloz murciélago hindú comía feliz cardillo y kiwi.";

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  args: { children: SAMPLE },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

/** Escala tipográfica completa del tema activo. */
export const Sizes: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="xs">
      {SIZES.map((fz) => (
        <Text key={fz} {...args} fz={fz}>
          {fz} — {SAMPLE}
        </Text>
      ))}
    </Box>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="xs">
      {(["light", "regular", "medium", "semibold", "bold", "black"] as const).map((fw) => (
        <Text key={fw} {...args} fw={fw}>
          {fw}
        </Text>
      ))}
    </Box>
  ),
};

/** Solo roles semánticos de texto — nunca hex ni paletas crudas. */
export const Colors: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="xs">
      {(["text.primary", "text.secondary", "text.muted"] as const).map((c) => (
        <Text key={c} {...args} c={c}>
          {c}
        </Text>
      ))}
      <Box bg="primary.600" p="sm" r="sm">
        <Text {...args} c="text.onPrimary">
          text.onPrimary sobre primary.600
        </Text>
      </Box>
    </Box>
  ),
};

export const Truncation: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="md" maw={320}>
      <Text {...args} truncate>
        Una sola línea con elipsis: {SAMPLE}
      </Text>
      <Text {...args} lines={2}>
        Recortado a dos líneas: {SAMPLE} {SAMPLE}
      </Text>
    </Box>
  ),
};

export const Polymorphic: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="xs">
      <Text {...args} component="h2" fz="h2" fw="bold">
        component=&quot;h2&quot; (semántica de encabezado)
      </Text>
      <Text {...args} component="span" fz="body2">
        component=&quot;span&quot; (inline)
      </Text>
    </Box>
  ),
};

export const Alignment: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="xs">
      {(["left", "center", "right", "justify"] as const).map((ta) => (
        <Text key={ta} {...args} ta={ta} fz="body2">
          {ta}
        </Text>
      ))}
    </Box>
  ),
};

export const Light: Story = {
  ...Colors,
  globals: { theme: "light" },
};

export const ReducedMotion: Story = {
  ...Default,
  globals: { reducedMotion: "reduce" },
};

/** Composición real: jerarquía, medida de lectura y metadata en un bloque creíble. */
export const Composition: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm" style={{ maxWidth: "62ch" }}>
      <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted">
        Movimiento
      </Text>
      <Text fz="h5" fw="semibold" lh="tight">
        Transferencia SPEI recibida
      </Text>
      <Text c="text.secondary">
        El depósito se acreditó en la cuenta operativa y ya está disponible para dispersión. La
        conciliación automática lo emparejó con la factura A-1042.
      </Text>
      <Text fz="caption" c="text.muted">
        27 de julio, 09:14 · referencia 7788123 · MXN 48,900.00
      </Text>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="xs">
        <Text fz="body2" fw="semibold">
          Transferencia recibida
        </Text>
        <Text fz="body3" c="text.secondary">
          Conciliada con la factura A-1042
        </Text>
        <Text fz="caption" c="text.muted">
          27 de julio · MXN 48,900.00
        </Text>
      </Box>
    </ThemeMatrix>
  ),
};
