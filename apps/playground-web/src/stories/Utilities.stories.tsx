import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import {
  Affix,
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  HoverCard,
  LoadingOverlay,
  NProgress,
  Overlay,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Overlay> = {
  title: "Overlays/Utilidades",
  component: Overlay,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Overlay>;

const ICON_UP = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const Velos: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      <Box position="relative" w={220} h={140} r="md" style={{ overflow: "hidden" }}>
        <Card p="md" withBorder radius="md">
          <Text fz="body3">Contenido debajo del velo</Text>
        </Card>
        <Overlay opacity={0.6} radius="md" />
      </Box>
      <Box position="relative" w={220} h={140} r="md" style={{ overflow: "hidden" }}>
        <Card p="md" withBorder radius="md">
          <Text fz="body3">Con contenido centrado</Text>
        </Card>
        <Overlay opacity={0.6} radius="md">
          <Button size="sm">Desbloquear</Button>
        </Overlay>
      </Box>
    </Box>
  ),
};

function CargaDemo(): ReactElement {
  const [loading, set_loading] = useState(false);

  return (
    <Box display="flex" direction="column" gap="sm">
      <Button
        size="sm"
        onPress={() => {
          set_loading(true);
          setTimeout(() => {
            set_loading(false);
          }, 1600);
        }}
      >
        Cargar durante 1,6 s
      </Button>
      <Box position="relative" r="md" style={{ overflow: "hidden" }}>
        <Card p="lg" withBorder radius="md">
          <Title order={6}>Movimientos</Title>
          <Text fz="body3" c="text.secondary" mt="xs">
            El velo cubre esta tarjeta sin retirar su contenido.
          </Text>
        </Card>
        <LoadingOverlay visible={loading} label="Cargando movimientos" radius="md" />
      </Box>
      <NProgress loading={loading} />
    </Box>
  );
}

export const Carga: Story = {
  render: () => <CargaDemo />,
};

export const Flotantes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        El botón flotante vive en un Portal y se posiciona por esquina.
      </Text>
      <Affix position={{ bottom: 24, right: 24 }}>
        <ActionIcon aria-label="Volver arriba" variant="filled">
          {ICON_UP}
        </ActionIcon>
      </Affix>
    </Box>
  ),
};

export const Tarjetas: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        HoverCard abre con el puntero y también con el foco: prueba con Tab.
      </Text>
      <Box>
        <HoverCard openDelay={150} trigger={<Button variant="ghost">Ada Lovelace</Button>}>
          <Box display="flex" gap="sm" align="center">
            <Avatar name="Ada Lovelace" size="md" />
            <Box display="flex" direction="column">
              <Text fz="body3" fw="semibold">
                Ada Lovelace
              </Text>
              <Text fz="caption" c="text.muted">
                Responsable de conciliación
              </Text>
            </Box>
          </Box>
        </HoverCard>
      </Box>
    </Box>
  ),
};

function AvisoDemo(): ReactElement {
  const [opened, set_opened] = useState(false);

  return (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Dialog es el panel de esquina: interrumpe sin robar el foco, por eso es una región viva y no
        un Modal.
      </Text>
      <Button
        size="sm"
        onPress={() => {
          set_opened(true);
        }}
      >
        Mostrar aviso
      </Button>
      <Dialog
        opened={opened}
        onClose={() => {
          set_opened(false);
        }}
        title="Sesión a punto de expirar"
      >
        <Text fz="body3">Quedan 2 minutos. Guarda los cambios.</Text>
      </Dialog>
    </Box>
  );
}

export const Avisos: Story = {
  render: () => <AvisoDemo />,
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <Box position="relative" h={80} r="md" style={{ overflow: "hidden" }}>
          <Card p="sm" withBorder radius="md">
            <Text fz="caption">Bajo el velo</Text>
          </Card>
          <Overlay opacity={0.5} radius="md" />
        </Box>
        <NProgress loading value={60} withinPortal={false} />
      </Box>
    </ThemeMatrix>
  ),
};
