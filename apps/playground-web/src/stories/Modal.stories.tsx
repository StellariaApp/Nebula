import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Box,
  Button,
  Modal,
  Text,
  Title,
} from "@stellaria/nebula-web";
import type { ModalProps } from "@stellaria/nebula-web";

import ModalAsDrawer from "@stellaria/nebula-demos/Modal/AsDrawer";
import ModalBasic from "@stellaria/nebula-demos/Modal/Basic";
import ModalComposition from "@stellaria/nebula-demos/Modal/Composition";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Modal>;

/**
 * Fixture del playground, no una demo: existe para que los gates puedan abrir un modal con
 * cualquier combinación de props sin escribir un archivo por combinación.
 */
type FixtureProps = Omit<ModalProps, "opened" | "onClose" | "children"> & {
  label?: string;
  children?: React.ReactNode;
};

function Fixture(props: FixtureProps): React.ReactElement {
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

export const Default: Story = { render: () => <ModalBasic /> };

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap="sm" wrap="wrap">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Fixture key={size} size={size} label={size} title={`Modal ${size}`} />
      ))}
    </Box>
  ),
};

export const FullScreen: Story = {
  render: () => <Fixture fullScreen title="Pantalla completa" label="Abrir a pantalla completa" />,
};

export const Blurred: Story = {
  render: () => <Fixture blurred title="Fondo desenfocado" label="Abrir con blur" />,
};

export const AsDrawer: Story = { render: () => <ModalAsDrawer /> };

export const WithoutCloseButton: Story = {
  render: () => (
    <Fixture
      withCloseButton={false}
      closeOnClickOutside={false}
      title="Cierre explícito"
      label="Abrir sin botón de cierre"
    />
  ),
};

export const Composition: Story = { render: () => <ModalComposition /> };

export const Dark: Story = { ...Composition, globals: { theme: "dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <ModalComposition />
    </ThemeMatrix>
  ),
};

export const ReducedMotion: Story = { ...Default, globals: { reducedMotion: "reduce" } };

/**
 * Abre con teclado, el foco entra al diálogo y el botón de cierre lo cierra. El cierre por `Esc`
 * cuelga del evento `cancel` nativo del `<dialog>`, que el navegador solo emite ante teclado real
 * (no se provoca con eventos sintéticos); su cobertura está en el test unitario.
 */
export const KeyboardFlow: Story = {
  render: () => (
    <Fixture title="Confirmar acción">
      <Box display="flex" direction="column" gap="md">
        <Text>¿Deseas continuar?</Text>
        <Button>Continuar</Button>
      </Box>
    </Fixture>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Abrir modal" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");

    const body = within(document.body);
    const dialog = await body.findByRole("dialog", { name: "Confirmar acción" });
    await expect(dialog).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Close" }));
    await waitFor(() => {
      void expect(body.queryByRole("dialog")).toBeNull();
    });
  },
};

export const OnlyTitle: Story = {
  name: "Solo título",
  render: () => (
    <Fixture title="Sin subtítulo">
      <Title order={6}>Cuerpo</Title>
    </Fixture>
  ),
};
