import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Button,
  GradientText,
  Paper,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof GradientText> = {
  title: "Typography/GradientText",
  component: GradientText,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof GradientText>;

export const Default: Story = {
  render: () => (
    <Title order={1}>
      <GradientText inherit>Diseña una vez</GradientText>
    </Title>
  ),
};

export const Roles: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      {(["brand", "accent", "surface"] as const).map((role) => (
        <Box key={role}>
          <Text component="p" fz="caption" c="text.muted" mb="xxs">
            gradient=&quot;{role}&quot;
          </Text>
          <Title order={2}>
            <GradientText inherit gradient={role}>
              Nebula {role}
            </GradientText>
          </Title>
        </Box>
      ))}
    </Box>
  ),
};

export const CustomGradient: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Title order={2}>
        <GradientText inherit gradient={{ from: "#3f37c9", to: "#9d4edd" }}>
          Eje de identidad
        </GradientText>
      </Title>
      <Title order={2}>
        <GradientText inherit gradient={{ from: "primary.500", to: "accent.400", deg: 90 }}>
          Desde roles del tema
        </GradientText>
      </Title>
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      {([1, 2, 3, 4] as const).map((order) => (
        <Title key={order} order={order}>
          <GradientText inherit>Titular de orden {order}</GradientText>
        </Title>
      ))}
    </Box>
  ),
};

export const Inline: Story = {
  render: () => (
    <Box maw={520}>
      <Title order={2}>
        Un sistema, <GradientText inherit>muchos productos</GradientText>
      </Title>
      <Text component="p" c="text.secondary" mt="sm">
        El gradiente acentúa dos palabras del titular. El resto del texto se queda en un color
        sólido:
        <Text component="span" c="text.muted">
          {" "}
          docs/06 §6 prohíbe que un gradiente pinte texto principal.
        </Text>
      </Text>
    </Box>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={520}>
      <Text component="p" fz="caption" c="text.muted">
        El color de fallback es el que se pinta sin soporte de <code>background-clip: text</code>,
        en forced-colors y en el subrayado. Se ve activando el alto contraste del sistema.
      </Text>
      <Title order={2}>
        <GradientText inherit fallbackColor="text.primary">
          Fallback por defecto
        </GradientText>
      </Title>
      <Title order={2}>
        <GradientText inherit fallbackColor="primary.600">
          Fallback tintado
        </GradientText>
      </Title>
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <Title order={1}>
      <GradientText inherit>Dark first</GradientText>
    </Title>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={480}>
      <Title order={2}>
        <GradientText inherit>Sin motion que reducir</GradientText>
      </Title>
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        GradientText no anima: <code>AnimatedGradient</code> es un componente propio de W4 y animar
        <code> background-position</code> incumpliría docs/03 §2.
      </Text>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Paper maw={560} p="xl" r="lg" withBorder shadow="sm">
      <Text
        component="p"
        fz="caption"
        fw="semibold"
        tt="uppercase"
        ls="wide"
        c="text.muted"
        mb="sm"
      >
        Nebula
      </Text>
      <Title order={1} mb="sm">
        Un design system, <GradientText inherit>cuatro temas</GradientText>
      </Title>
      <Text component="p" c="text.secondary" mb="lg">
        El gradiente es el único efecto dominante de esta región, sobre una superficie sólida y con
        el cuerpo del texto en un rol legible. Es el uso que docs/06 §6 autoriza: hero y titular
        corto.
      </Text>
      <Button variant="filled">Empezar</Button>
    </Paper>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Title order={3}>
        <GradientText inherit>Nebula</GradientText>
      </Title>
    </ThemeMatrix>
  ),
};
