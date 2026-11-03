import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { Button, Dialog, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Dialog> = {
  title: "Overlays/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

function Demo(props: {
  corner?: "bottom-end" | "bottom-start" | "top-end" | "top-start";
}): ReactElement {
  const [opened, set_opened] = useState(false);
  return (
    <>
      <Button onPress={() => set_opened(true)}>Iniciar sincronización</Button>
      <Dialog
        opened={opened}
        onClose={() => set_opened(false)}
        title="Sincronizando"
        closeLabel="Cerrar aviso"
        {...(props.corner === undefined ? {} : { corner: props.corner })}
      >
        <Text>Subiendo 3 archivos a tu espacio de trabajo.</Text>
      </Dialog>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const Corners: Story = {
  render: () => (
    <Dialog opened title="Esquina superior" corner="top-start" withinPortal={false}>
      <Text>Un panel no modal anclado a la esquina.</Text>
    </Dialog>
  ),
};

export const Dark: Story = { ...Corners, globals: { theme: "dark" } };

export const ReducedMotion: Story = {
  render: () => <Demo />,
  globals: { reducedMotion: "reduce" },
};

export const OpenAndClose: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("button", { name: "Iniciar sincronización" }));
    await expect(await body.findByRole("status")).toHaveTextContent("Sincronizando");
    await userEvent.click(body.getByRole("button", { name: "Cerrar aviso" }));
    await waitFor(() => {
      void expect(body.queryByRole("status")).toBeNull();
    });
  },
};
