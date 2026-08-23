import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AnimatedGradient,
  Badge,
  Box,
  Button,
  GradientBackground,
  GradientBorder,
  GradientText,
  Group,
  MeshGradientBg,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof GradientBackground> = {
  title: "Effects/Gradientes",
  component: GradientBackground,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof GradientBackground>;

const ROLES = ["brand", "accent", "surface"] as const;

export const Default: Story = {
  render: () => (
    <GradientBackground p="xl" maw={520} scrim={0.35}>
      <Title order={3} mb="xxs">
        Acento de marca
      </Title>
      <Text component="p" fz="body2">
        Un gradiente del tema como fondo de una región corta, con velo para que el texto siga siendo
        legible en los cuatro temas.
      </Text>
    </GradientBackground>
  ),
};

export const Roles: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={560}>
      {ROLES.map((role) => (
        <Box key={role}>
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            gradient=&quot;{role}&quot;
          </Text>
          <GradientBackground gradient={role} h={72} r="md" />
        </Box>
      ))}
    </Box>
  ),
};

export const Scrim: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {([0, 0.25, 0.5, 0.75] as const).map((value) => (
        <GradientBackground key={value} scrim={value} p="md" w={200} r="md">
          <Text component="p" fz="caption" ff="mono" mb="xxs">
            scrim={value}
          </Text>
          <Text component="p" fz="body2">
            Texto sobre el gradiente
          </Text>
        </GradientBackground>
      ))}
    </Box>
  ),
};

export const Anillos: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {([1, 2, 3] as const).map((width) => (
        <GradientBorder key={width} width={width} surface="raised" p="md" w={190} r="lg">
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            width={width}
          </Text>
          <Text component="p" fz="body2">
            Anillo de marca
          </Text>
        </GradientBorder>
      ))}
      <GradientBorder gradient="accent" p="md" w={190} r="lg">
        <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
          interior transparente
        </Text>
        <Text component="p" fz="body2">
          surface=&quot;none&quot;
        </Text>
      </GradientBorder>
    </Box>
  ),
};

export const AnillosAnimados: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(
        [
          { label: "los cuatro", edges: undefined },
          { label: "solo el 1", edges: [1] as const },
          { label: "1 y 2", edges: [1, 2] as const },
          { label: "1 y 3", edges: [1, 3] as const },
        ] as const
      ).map((item) => (
        <GradientBorder
          key={item.label}
          beam
          {...(item.edges === undefined ? {} : { edges: item.edges })}
          surface="raised"
          p="md"
          w={190}
          h={130}
          r="lg"
        >
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            {item.label}
          </Text>
          <Text component="p" fz="body2">
            Marco de producto
          </Text>
        </GradientBorder>
      ))}
    </Box>
  ),
};

export const Malla: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {ROLES.map((role) => (
        <Box key={role}>
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            {role}
          </Text>
          <MeshGradientBg gradient={role} w={220} h={140} r="lg" />
        </Box>
      ))}
      <Box>
        <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
          brand + grain
        </Text>
        <MeshGradientBg gradient="brand" grain w={220} h={140} r="lg" />
      </Box>
    </Box>
  ),
};

export const Deriva: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["slow", "base", "fast"] as const).map((speed) => (
        <AnimatedGradient key={speed} speed={speed} scrim={0.3} p="md" w={220} h={140} r="lg">
          <Text component="p" fz="caption" ff="mono" c="text.muted">
            speed=&quot;{speed}&quot;
          </Text>
        </AnimatedGradient>
      ))}
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <GradientBackground p="xl" maw={460} scrim={0.3}>
      <Title order={3}>Dark first</Title>
    </GradientBackground>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={560}>
      <AnimatedGradient p="lg" h={160} r="lg" scrim={0.3}>
        <Text component="p" fz="body2">
          La capa se detiene en el frame 0 con su transformada de reposo, no en la posición sin
          escalar: si volviera a escala 1 se verían las esquinas del recorte.
        </Text>
      </AnimatedGradient>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={720}>
      <AnimatedGradient r="xl" scrim={0.55} p="xl">
        <Group justify="space-between" mb="lg">
          <Badge variant="light">v1 · web</Badge>
          <Text component="p" fz="caption" ff="mono" c="text.muted">
            nebula
          </Text>
        </Group>
        <Title order={1} mb="sm" maw={480}>
          Diseña una vez, <GradientText inherit>publica en dos plataformas</GradientText>
        </Title>
        <Text component="p" c="text.secondary" mb="lg" maw={440}>
          El fondo es el único efecto dominante de la región: el gradiente deriva detrás de un velo,
          el titular usa el mismo eje cromático y el cuerpo se queda en un rol legible.
        </Text>
        <Group gap="sm">
          <Button variant="filled">Empezar</Button>
          <Button variant="outline">Ver el catálogo</Button>
        </Group>
      </AnimatedGradient>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box display="flex" direction="column" gap="sm">
        <GradientBackground h={56} r="md" />
        <GradientBorder surface="raised" p="sm" r="md">
          <Text component="p" fz="caption">
            anillo
          </Text>
        </GradientBorder>
        <MeshGradientBg h={56} r="md" grain />
        <AnimatedGradient h={56} r="md" />
      </Box>
    </ThemeMatrix>
  ),
};
