import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Paper, Portal, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Portal> = {
  title: "Utilities/Portal",
  component: Portal,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => (
    <Box>
      <Text>El contenido del Portal se monta al final de &lt;body&gt;, fuera de este árbol.</Text>
      <Portal>
        <Paper
          p="sm"
          withBorder
          radius="md"
          style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}
        >
          <Text>portaleado a body</Text>
        </Paper>
      </Portal>
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box p="sm" bg="surface.sunken" r="md">
      <Text>Con `disabled`, el Portal renderiza en su sitio original:</Text>
      <Portal disabled>
        <Paper p="sm" withBorder radius="md" mt="sm">
          <Text>renderizado en línea</Text>
        </Paper>
      </Portal>
    </Box>
  ),
};
