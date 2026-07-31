import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";

import {
  Badge,
  Box,
  Button,
  Container,
  GradientText,
  Group,
  StarField,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof StarField> = {
  title: "Effects/StarField",
  component: StarField,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof StarField>;

function Sky(props: { children?: ReactNode; h?: number }): ReactElement {
  const { children, h = 200 } = props;
  return (
    <Box
      position="relative"
      h={h}
      r="lg"
      bg="surface.base"
      style={{ overflow: "hidden", isolation: "isolate" }}
    >
      {children}
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Sky>
      <StarField />
    </Sky>
  ),
};

export const Densidades: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((density) => (
        <Box key={density}>
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            {density}
          </Text>
          <Box
            position="relative"
            w={180}
            h={130}
            r="md"
            bg="surface.base"
            style={{ overflow: "hidden", isolation: "isolate" }}
          >
            <StarField density={density} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Semillas: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {[1, 7, 13].map((seed) => (
        <Box key={seed}>
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            seed={seed}
          </Text>
          <Box
            position="relative"
            w={220}
            h={140}
            r="md"
            bg="surface.base"
            style={{ overflow: "hidden", isolation: "isolate" }}
          >
            <StarField seed={seed} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Reticula: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {[
        { label: "sin retícula", props: { grid: false } },
        { label: "celda 40", props: { gridSize: 40 } },
        { label: "celda 96, sin fade", props: { gridSize: 96, fade: false } },
      ].map((item) => (
        <Box key={item.label}>
          <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
            {item.label}
          </Text>
          <Box
            position="relative"
            w={220}
            h={140}
            r="md"
            bg="surface.base"
            style={{ overflow: "hidden", isolation: "isolate" }}
          >
            <StarField {...item.props} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Sky h={240}>
      <StarField density="lg" />
    </Sky>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={620}>
      <Sky h={180}>
        <StarField density="lg" />
      </Sky>
      <Text component="p" fz="caption" c="text.muted" mt="sm">
        Sin parpadeo y sin parallax: las estrellas se quedan a opacidad 0.6 y escala 1, uniformes. El
        listener de scroll no llega a registrarse.
      </Text>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box
      position="relative"
      r="xl"
      bg="surface.base"
      style={{ overflow: "hidden", isolation: "isolate" }}
    >
      <StarField density="xl" />
      <Container size="md" style={{ position: "relative" }}>
        <Box py="xl" ta="center">
          <Badge variant="light" mb="md">
            Stellaria
          </Badge>
          <Title order={1} mb="sm">
            Un sistema, <GradientText inherit>muchos productos</GradientText>
          </Title>
          <Text component="p" c="text.secondary" mb="lg" maw={460} style={{ marginInline: "auto" }}>
            La retícula con estrellas es el fondo de casa. Es decorativa, no ocupa flujo y se apaga
            entera en alto contraste.
          </Text>
          <Group justify="center" gap="sm">
            <Button variant="filled">Empezar</Button>
            <Button variant="ghost">Documentación</Button>
          </Group>
        </Box>
      </Container>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box
        position="relative"
        h={150}
        r="md"
        bg="surface.base"
        style={{ overflow: "hidden", isolation: "isolate" }}
      >
        <StarField density="lg" />
      </Box>
    </ThemeMatrix>
  ),
};
