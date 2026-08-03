import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Text, VisuallyHidden } from "@stellaria/nebula-web";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Utilities/VisuallyHidden",
  component: VisuallyHidden,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof VisuallyHidden>;

/** El texto está en el árbol de accesibilidad pero no se ve: útil para nombres de controles solo-icono. */
export const Default: Story = {
  render: () => (
    <Box>
      <Text>Hay un texto solo para lectores de pantalla dentro de este bloque.</Text>
      <VisuallyHidden>Contenido oculto visualmente pero anunciado</VisuallyHidden>
      <button type="button">
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Cerrar</VisuallyHidden>
      </button>
    </Box>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
