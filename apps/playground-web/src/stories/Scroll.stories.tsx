import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Scroll,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Scroll> = {
  title: "Layout/Scroll",
  component: Scroll,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Scroll>;

function Lines({ count = 20 }: { count?: number }) {
  return Array.from({ length: count }, (_, i) => <Text key={i}>línea {i + 1}</Text>);
}

function Columns({ count = 12 }: { count?: number }) {
  return (
    <Box display="flex" gap="sm" w={1200}>
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} p="sm" bg="primary.500" c="text.onPrimary" r="sm" miw={120} ta="center">
          col {i + 1}
        </Box>
      ))}
    </Box>
  );
}

export const Vertical: Story = {
  render: () => (
    <Scroll axis="y" h={120} p="sm" bg="surface.sunken" r="md" tabIndex={0} aria-label="Lista">
      <Lines />
    </Scroll>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Scroll axis="x" p="sm" bg="surface.sunken" r="md" tabIndex={0} aria-label="Columnas">
      <Columns />
    </Scroll>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Box>
        <Title order={4} mb="xs">
          Eje de bloque
        </Title>
        <Scroll
          shadows
          axis="y"
          h={140}
          p="sm"
          bg="surface.sunken"
          r="md"
          tabIndex={0}
          aria-label="Lista con indicador"
        >
          <Lines count={24} />
        </Scroll>
      </Box>

      <Box>
        <Title order={4} mb="xs">
          Eje inline
        </Title>
        <Scroll
          shadows
          axis="x"
          p="sm"
          bg="surface.sunken"
          r="md"
          tabIndex={0}
          aria-label="Columnas con indicador"
        >
          <Columns />
        </Scroll>
      </Box>

      <Box>
        <Title order={4} mb="xs">
          Los dos ejes a la vez
        </Title>
        <Scroll
          shadows
          axis="xy"
          h={140}
          p="sm"
          bg="surface.sunken"
          r="md"
          tabIndex={0}
          aria-label="Rejilla con indicador"
        >
          <Box w={1200}>
            <Lines count={24} />
          </Box>
        </Scroll>
      </Box>

      <Box>
        <Title order={4} mb="xs">
          Sin desbordamiento no hay indicador
        </Title>
        <Scroll shadows axis="y" h={140} p="sm" bg="surface.sunken" r="md">
          <Lines count={3} />
        </Scroll>
      </Box>
    </Box>
  ),
};

export const Momentum: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary">
        Con la rueda, un muelle del tema persigue el destino. Táctil, teclado y arrastre de la barra
        siguen siendo los nativos.
      </Text>
      <Scroll
        momentum
        shadows
        smooth
        spring="gentle"
        h={220}
        p="sm"
        bg="surface.sunken"
        r="md"
        tabIndex={0}
        aria-label="Lista con inercia"
      >
        <Lines count={40} />
      </Scroll>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      <Title order={3}>Actividad reciente</Title>
      <Scroll
        shadows
        smooth
        axis="y"
        h={200}
        p="sm"
        bg="surface.raised"
        r="md"
        tabIndex={0}
        aria-label="Actividad reciente"
      >
        <Box display="flex" direction="column" gap="xs">
          {Array.from({ length: 16 }, (_, i) => (
            <Box key={i} display="flex" justify="space-between" gap="sm">
              <Text>Movimiento {i + 1}</Text>
              <Text c="text.secondary">hace {i + 1} h</Text>
            </Box>
          ))}
        </Box>
      </Scroll>
      <Text fz="body3" c="text.secondary">
        La banda superior aparece en cuanto la lista se desplaza; la inferior desaparece al llegar
        al final.
      </Text>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Scroll
        shadows
        axis="y"
        h={140}
        p="sm"
        bg="surface.sunken"
        r="md"
        tabIndex={0}
        aria-label="Lista con indicador"
      >
        <Lines count={14} />
      </Scroll>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...Shadows, globals: { theme: "dark" } };
export const Light: Story = { ...Shadows, globals: { theme: "light" } };

export const ReducedMotion: Story = {
  ...Momentum,
  globals: { reducedMotion: "reduce" },
};
