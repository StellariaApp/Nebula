import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, Button, Modal, Text, TextInput, Title } from "@stellaria/nebula-web";
import type { ModalProps } from "@stellaria/nebula-web";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Modal>;

type DemoProps = Omit<ModalProps, "opened" | "onClose" | "children"> & {
  label?: string;
  children?: React.ReactNode;
};

function Demo(props: DemoProps): React.ReactElement {
  const { label = "Abrir modal", children, ...modal } = props;
  const [opened, set_opened] = useState(false);
  return (
    <>
      <Button onPress={() => set_opened(true)}>{label}</Button>
      <Modal {...modal} opened={opened} onClose={() => set_opened(false)}>
        {children ?? <Text>Contenido del diálogo.</Text>}
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <Demo title="Confirmar acción" subtitle="Esta acción no se puede deshacer" />,
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Demo key={size} size={size} label={size} title={`Modal ${size}`} />
      ))}
    </Box>
  ),
};

export const FullScreen: Story = {
  render: () => <Demo fullScreen title="Pantalla completa" label="Abrir a pantalla completa" />,
};

export const Blurred: Story = {
  render: () => <Demo blurred title="Fondo desenfocado" label="Abrir con blur" />,
};

export const AsDrawer: Story = {
  render: () => <Demo drawer title="Modal en modo drawer" label="Abrir lateral" />,
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Demo
      withCloseButton={false}
      closeOnClickOutside={false}
      title="Cierre explícito"
      label="Abrir sin botón de cierre"
    />
  ),
};

export const Composition: Story = {
  render: () => (
    <Demo title="Invitar al equipo" subtitle="Se enviará un correo con la invitación" size="sm">
      <Box display="flex" direction="column" gap="md">
        <TextInput label="Correo" placeholder="persona@empresa.com" required />
        <TextInput label="Cargo" placeholder="Analista" />
        <Box display="flex" gap="sm" style={{ justifyContent: "flex-end" }}>
          <Button variant="outline">Cancelar</Button>
          <Button>Enviar invitación</Button>
        </Box>
      </Box>
    </Demo>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "nebula-dark" } };

export const AllThemes: Story = { ...Composition, globals: { theme: "sober-light" } };

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/**
 * Abre con teclado, el foco entra al diálogo y el botón de cierre lo cierra. El cierre por `Esc`
 * cuelga del evento `cancel` nativo del `<dialog>`, que el navegador solo emite ante teclado real
 * (no se provoca con eventos sintéticos); su cobertura está en el test unitario.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <Demo title="Confirmar acción">
      <Box display="flex" direction="column" gap="md">
        <Text>¿Deseas continuar?</Text>
        <Button>Continuar</Button>
      </Box>
    </Demo>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir modal" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");

    const body = within(document.body);
    const dialog = await body.findByRole("dialog", { name: "Confirmar acción" });
    await expect(dialog).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Cerrar" }));
    await expect(body.queryByRole("dialog")).toBeNull();
  },
};

export const OnlyTitle: Story = {
  name: "Solo título",
  render: () => (
    <Demo title="Sin subtítulo">
      <Title order={6}>Cuerpo</Title>
    </Demo>
  ),
};
