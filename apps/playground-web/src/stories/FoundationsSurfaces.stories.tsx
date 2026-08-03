import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ShadowLevel } from "@stellaria/nebula-tokens";
import { Box, Card, Flex, Paper, Section, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix, rosette } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Foundations/Visual QA/Surfaces",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

type SurfaceRoleName = "surface.sunken" | "surface.raised" | "surface.overlay";

const levels: {
  level: number;
  role: string;
  surface: SurfaceRoleName;
  shadow: ShadowLevel | "none";
  border: boolean;
}[] = [
  { level: 0, role: "canvas / sunken", surface: "surface.sunken", shadow: "none", border: false },
  { level: 1, role: "card / panel", surface: "surface.raised", shadow: "xs", border: true },
  {
    level: 2,
    role: "elemento elevado / sticky",
    surface: "surface.raised",
    shadow: "sm",
    border: true,
  },
  {
    level: 3,
    role: "dropdown / popover",
    surface: "surface.overlay",
    shadow: "md",
    border: true,
  },
  { level: 4, role: "modal / drawer", surface: "surface.overlay", shadow: "lg", border: true },
];

const SHADOW_STEPS: ShadowLevel[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"];

function Ladder(): React.ReactElement {
  return (
    <Flex direction="column" gapy="lg">
      {levels.map((step) => (
        <Paper
          key={step.level}
          withBorder={step.border}
          shadow={step.shadow}
          radius="md"
          p="lg"
          bg={step.surface}
        >
          <Flex justify="space-between" align="baseline" gapx="md">
            <Text fw="semibold">Nivel {step.level}</Text>
            <Text fz="caption" ff="mono" c="text.muted">
              {step.surface} · shadow {step.shadow}
            </Text>
          </Flex>
          <Text fz="body2" c="text.secondary" mt="xs">
            {step.role}
          </Text>
        </Paper>
      ))}
    </Flex>
  );
}

/**
 * La escalera 0–4 de docs/06 §5, con el rol de superficie que el documento asigna a cada nivel.
 * La superficie es la mitad del contraste; la sombra sola no sostiene la escalera en dark.
 */
export const ElevationLadder: Story = {
  render: () => (
    <Box p="lg" bg="surface.base">
      <Ladder />
    </Box>
  ),
};

/**
 * Los primitivos de superficie SIN props, sobre el lienzo. Existe porque la escalera de arriba pasa
 * `bg` explícito en los cinco niveles y por eso no pudo detectar que `Paper` había perdido su
 * superficie por defecto: durante dos días pintó el color del lienzo con los cuatro gates en verde
 * (WR2.1 A-1). Si un default vuelve a romperse, se ve aquí.
 */
export const Defaults: Story = {
  render: () => (
    <Box p="xl" bg="surface.base">
      <Text fz="body2" c="text.secondary" mb="md">
        Ninguna de las tres cajas lleva props de superficie. Las que deben distinguirse del lienzo
        son `Paper` y `Card` (nivel 1); `Section` no pinta superficie por diseño.
      </Text>
      <Flex direction="column" gapy="md">
        <Paper p="lg">
          <Text fz="caption" ff="mono" c="text.muted">
            {"<Paper />"} — debe verse sobre surface.base
          </Text>
        </Paper>
        <Card p="lg">
          <Text fz="caption" ff="mono" c="text.muted">
            {"<Card />"} — misma superficie que Paper, mismo nivel
          </Text>
        </Card>
        <Section title="<Section />">
          <Text fz="caption" ff="mono" c="text.muted">
            sin superficie propia: es un contenedor de ritmo
          </Text>
        </Section>
      </Flex>
    </Box>
  ),
};

/** Los siete peldaños de sombra, aislados: ninguno debe repetir al anterior. */
export const ShadowSteps: Story = {
  render: () => (
    <Flex wrap="wrap" gapx="lg" gapy="lg" p="xl" bg="surface.base">
      {SHADOW_STEPS.map((step) => (
        <Paper key={step} shadow={step} radius="md" p="lg" style={{ minWidth: 132 }}>
          <Text fz="caption" ff="mono" c="text.muted">
            {step}
          </Text>
        </Paper>
      ))}
    </Flex>
  ),
};

/** Superficies anidadas: sunken → base → raised → overlay dentro del mismo tema. */
export const SurfaceRoles: Story = {
  render: () => (
    <Box p="lg" bg="surface.sunken" r="lg">
      <Text fz="caption" ff="mono" c="text.muted" mb="sm">
        surface.sunken
      </Text>
      <Box p="lg" bg="surface.base" r="md">
        <Text fz="caption" ff="mono" c="text.muted" mb="sm">
          surface.base
        </Text>
        <Box p="lg" bg="surface.raised" r="md">
          <Text fz="caption" ff="mono" c="text.muted" mb="sm">
            surface.raised
          </Text>
          <Box p="md" bg="surface.overlay" r="sm">
            <Text fz="caption" ff="mono" c="text.muted">
              surface.overlay
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box p="lg" bg="surface.base">
      <Title order={4} mb="lg">
        Escalera de elevación en contexto
      </Title>
      <Ladder />
    </Box>
  ),
};

/**
 * Los cuatro temas oficiales más Rosette como tema de producto: si un nivel desaparece en alguno,
 * el componente está leyendo algo fuera del tema.
 */
export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette (producto)" }]}>
      <Flex direction="column" gapy="md">
        {levels.slice(0, 4).map((step) => (
          <Paper
            key={step.level}
            withBorder={step.border}
            shadow={step.shadow}
            radius="md"
            p="md"
            {...(step.level === 0 ? { bg: "surface.sunken" as const } : {})}
          >
            <Text fz="body2" fw="semibold">
              Nivel {step.level}
            </Text>
            <Text fz="caption" c="text.muted">
              {step.role}
            </Text>
          </Paper>
        ))}
      </Flex>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...ElevationLadder, globals: { theme: "dark" } };

export const ReducedMotion: Story = { ...ElevationLadder, globals: { reducedMotion: "reduce" } };
