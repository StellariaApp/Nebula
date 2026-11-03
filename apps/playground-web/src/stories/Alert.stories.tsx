import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Alert, Box, Button } from "@stellaria/nebula-web";

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  args: { title: "Cambios guardados", children: "Los cambios se aplicaron a tu cuenta." },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      {(["info", "success", "warning", "error"] as const).map((color) => (
        <Alert key={color} color={color} title={`Aviso ${color}`}>
          Mensaje para el estado {color}.
        </Alert>
      ))}
    </Box>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      {(["light", "filled", "outline", "glass"] as const).map((variant) => (
        <Alert key={variant} variant={variant} color="info" title={variant}>
          Variante {variant}.
        </Alert>
      ))}
    </Box>
  ),
};

export const InContext: Story = {
  render: () => (
    <Box maw={520}>
      <Alert
        color="warning"
        title="Tu sesión está por expirar"
        withCloseButton
        actions={<Button size="xs">Renovar sesión</Button>}
      >
        Se cerrará en 5 minutos. Guarda tu trabajo antes de continuar.
      </Alert>
    </Box>
  ),
};

export const Dark: Story = { ...Colors, globals: { theme: "dark" } };

export const Dismiss: Story = {
  args: { withCloseButton: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Dismiss notice" })).toHaveFocus();
  },
};
