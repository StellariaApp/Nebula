import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Box, Button, nebulaToast, ToastProvider } from "@stellaria/nebula-web";

const meta: Meta<typeof ToastProvider> = {
  title: "Feedback/Toast",
  component: ToastProvider,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Button onPress={() => nebulaToast.success("Cambios guardados")}>Guardar</Button>
    </ToastProvider>
  ),
};

export const Colors: Story = {
  render: () => (
    <ToastProvider>
      <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
        <Button onPress={() => nebulaToast.success("Cambios guardados")}>Success</Button>
        <Button
          variant="outline"
          onPress={() => nebulaToast.error("No se pudo guardar", { title: "Error" })}
        >
          Error
        </Button>
        <Button variant="outline" onPress={() => nebulaToast.warning("Revisa los campos")}>
          Warning
        </Button>
        <Button variant="outline" onPress={() => nebulaToast.info("Sincronizando…")}>
          Info
        </Button>
      </Box>
    </ToastProvider>
  ),
};

export const Dark: Story = { ...Colors, globals: { theme: "dark" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

export const Flow: Story = {
  render: () => (
    <ToastProvider>
      <Button onPress={() => nebulaToast.success("Cambios guardados", { duration: 0 })}>
        Guardar
      </Button>
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "Guardar" }));
    await expect(await body.findByRole("status")).toHaveTextContent("Cambios guardados");
    await userEvent.click(body.getByRole("button", { name: "Dismiss notification" }));
    await waitFor(() => {
      void expect(body.queryByRole("status")).toBeNull();
    });
  },
};
