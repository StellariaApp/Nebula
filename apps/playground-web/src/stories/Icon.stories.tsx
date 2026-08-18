import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateIcons } from "@stellaria/nebula-icons";
import { CommonPack, DashboardPack } from "@stellaria/nebula-icons/packs";
import {
  Box,
  Text,
} from "@stellaria/nebula-web";
import { vars } from "@stellaria/nebula-themes/web";

const { Icon, names } = CreateIcons({ ...CommonPack, ...DashboardPack });

const meta: Meta = {
  title: "Icons/Icon",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

/** Galería del set tipado (CommonPack + DashboardPack). `name` autocompleta y valida en compilación. */
export const Gallery: Story = {
  render: () => (
    <Box display="flex" gap="lg" wrap="wrap">
      {names.map((name) => (
        <Box
          key={name}
          display="flex"
          direction="column"
          align="center"
          gap="sm"
          w={`calc(${vars.space.xxl} * 2)`}
        >
          <Icon name={name} size={28} />
          <Text fz="body3" c="text.muted" ta="center">
            {name}
          </Text>
        </Box>
      ))}
    </Box>
  ),
};

/** El tamaño por defecto (1em) escala con el texto; el color hereda de currentColor. */
export const InlineWithText: Story = {
  render: () => (
    <Text c="primary.600">
      <Icon name="dashboard" /> Icono que hereda color y tamaño del texto que lo rodea.
    </Text>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="md" align="center">
      {[16, 24, 32, 48].map((size) => (
        <Icon key={size} name="settings" size={size} />
      ))}
    </Box>
  ),
};

/** Con `label` el icono deja de ser decorativo: role="img" + aria-label. */
export const Labeled: Story = {
  render: () => <Icon name="trash" size={28} label="Eliminar" />,
};

export const Dark: Story = { ...Gallery, globals: { theme: "dark" } };
