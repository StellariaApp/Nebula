import type { Meta, StoryObj } from "@storybook/react-vite";

import type { SpacingName } from "@stellaria/nebula-tokens";
import { Box, Button, Divider, Flex, Paper, Text, Title } from "@stellaria/nebula-web";

import { ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Foundations/Visual QA/Spacing",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const rhythm: { token: SpacingName; base: string; role: string }[] = [
  { token: "xxs", base: "2 px", role: "corrección óptica; no separa elementos distintos" },
  { token: "xs", base: "4 px", role: "icono+label muy compacto, label+required" },
  { token: "sm", base: "8 px", role: "relación interna directa" },
  { token: "md", base: "16 px", role: "padding/gap base de componente" },
  { token: "lg", base: "24 px", role: "separación de grupos relacionados" },
  { token: "xl", base: "32 px", role: "separación de secciones" },
  { token: "xxl", base: "48 px", role: "regiones de página" },
  { token: "xxxl", base: "64 px", role: "separación editorial/hero" },
];

/** La escala con su significado compositivo (docs/06 §3). El ancho de la barra es el token. */
export const Scale: Story = {
  render: () => (
    <Flex direction="column" gapy="sm" p="lg" bg="surface.base">
      {rhythm.map((step) => (
        <Flex key={step.token} align="center" gapx="md">
          <Text component="span" fz="caption" ff="mono" c="text.muted" style={{ width: "4rem" }}>
            {step.token}
          </Text>
          <Box bg="primary.500" r="xs" px={step.token} style={{ height: 12 }} />
          <Text component="span" fz="caption" ff="mono" c="text.muted" style={{ width: "3.5rem" }}>
            {step.base}
          </Text>
          <Text component="span" fz="body3" c="text.secondary">
            {step.role}
          </Text>
        </Flex>
      ))}
    </Flex>
  ),
};

/** Dentro < entre: el espacio interno de un grupo siempre es menor que el que lo separa del siguiente. */
export const InsideVersusBetween: Story = {
  render: () => (
    <Flex direction="column" gapy="xl" p="lg" bg="surface.base">
      <Box>
        <Text fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted" mb="sm">
          Correcto — interno sm, entre grupos lg
        </Text>
        <Flex direction="column" gapy="lg">
          {["Datos de la cuenta", "Notificaciones"].map((group) => (
            <Flex key={group} direction="column" gapy="sm">
              <Text fw="semibold">{group}</Text>
              <Text fz="body2" c="text.secondary">
                Primera opción del grupo
              </Text>
              <Text fz="body2" c="text.secondary">
                Segunda opción del grupo
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Divider />
      <Box>
        <Text fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted" mb="sm">
          Incorrecto — un único gap uniforme borra la agrupación
        </Text>
        <Flex direction="column" gapy="md">
          {["Datos de la cuenta", "Notificaciones"].map((group) => (
            <Flex key={group} direction="column" gapy="md">
              <Text fw="semibold">{group}</Text>
              <Text fz="body2" c="text.secondary">
                Primera opción del grupo
              </Text>
              <Text fz="body2" c="text.secondary">
                Segunda opción del grupo
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Flex>
  ),
};

/** Ritmo de región: inline → componente → grupo → sección. */
export const RegionRhythm: Story = {
  render: () => (
    <Flex component="main" direction="column" gapy="xl" p="lg" bg="surface.base">
      {(
        [
          { title: "Resumen", body: "Movimientos de los últimos 30 días." },
          { title: "Facturación", body: "Método de pago y dirección fiscal." },
        ] as const
      ).map((section) => (
        <Flex key={section.title} component="section" direction="column" gapy="lg">
          <Flex direction="column" gapy="sm">
            <Title order={4}>{section.title}</Title>
            <Text fz="body2" c="text.secondary">
              {section.body}
            </Text>
          </Flex>
          <Paper withBorder p="lg" radius="md">
            <Flex direction="column" gapy="md">
              <Flex justify="space-between" align="center" gapx="md">
                <Text fw="semibold">Plan Escala</Text>
                <Text fz="body2" c="text.secondary">
                  MXN 2,400 / mes
                </Text>
              </Flex>
              <Divider />
              <Flex gapx="sm">
                <Button size="sm">Cambiar plan</Button>
                <Button size="sm" variant="ghost">
                  Ver detalle
                </Button>
              </Flex>
            </Flex>
          </Paper>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Composition: Story = { ...RegionRhythm };

export const AllThemes: Story = {
  render: () => (
    <ThemeMatrix>
      <Flex direction="column" gapy="lg">
        <Flex direction="column" gapy="sm">
          <Title order={5}>Facturación</Title>
          <Text fz="body2" c="text.secondary">
            Método de pago y dirección fiscal.
          </Text>
        </Flex>
        <Paper withBorder p="md" radius="md">
          <Flex direction="column" gapy="sm">
            <Text fw="semibold">Plan Escala</Text>
            <Text fz="caption" c="text.muted">
              MXN 2,400 / mes
            </Text>
          </Flex>
        </Paper>
      </Flex>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...RegionRhythm, globals: { theme: "nebula-dark" } };

export const ReducedMotion: Story = { ...RegionRhythm, globals: { reducedMotion: "reduce" } };
