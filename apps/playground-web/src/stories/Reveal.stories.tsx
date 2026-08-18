import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Card,
  Reveal,
  SimpleGrid,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, rosette, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Reveal> = {
  title: "Motion/Reveal",
  component: Reveal,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Reveal>;

const PRESETS = [
  "fade",
  "scale",
  "pop",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
] as const;

function Filler(props: { label: string }) {
  return (
    <Box h={220} r="md" bg="surface.sunken" p="md" display="flex" direction="column" gap="xs">
      <Text fz="caption" c="text.muted" ff="mono">
        {props.label}
      </Text>
      <Text fz="body3" c="text.secondary">
        Desplaza para que el bloque siguiente cruce el umbral.
      </Text>
    </Box>
  );
}

export const Default: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <Box p="lg" display="flex" direction="column" gap="xxl">
      <Text fz="body3" c="text.secondary" maw="62ch">
        El contenido se rinde visible; el estado oculto lo aplica un efecto en cliente. Sin JS, sin
        `IntersectionObserver` o con reduced-motion, el mecanismo no se arma y todo está ahí.
      </Text>
      <Filler label="antes del pliegue" />
      <Filler label="sigue bajando" />
      <Reveal>
        <Card p="lg" withBorder r="md">
          <Title order={3}>Aparezco al entrar</Title>
          <Text fz="body3" c="text.secondary">
            `preset=&quot;slide-up&quot;` por defecto, `once` activado.
          </Text>
        </Card>
      </Reveal>
    </Box>
  ),
};

export const Variants: Story = {
  name: "Variants (los siete presets)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <Box p="lg" display="flex" direction="column" gap="xxl">
      <Text fz="body3" c="text.secondary">
        Mismo vocabulario que `Transition`, con otro disparador.
      </Text>
      <Filler label="desplaza" />
      {PRESETS.map((preset) => (
        <Reveal key={preset} preset={preset}>
          <Card p="md" withBorder r="md">
            <Text fz="body2" ff="mono">
              {preset}
            </Text>
          </Card>
        </Reveal>
      ))}
    </Box>
  ),
};

export const Stagger: Story = {
  name: "Stagger (tope de ocho, docs/03 §2 regla 5)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <Box p="lg" display="flex" direction="column" gap="xxl">
      <Text fz="body3" c="text.secondary" maw="62ch">
        `index` alimenta `StaggerDelay`. A partir del octavo, todos comparten retardo: una fila
        larga no encadena una espera perceptible en el último.
      </Text>
      <Filler label="desplaza" />
      <SimpleGrid cols={{ base: 2, tablet: 4 }} spacing="md">
        {Array.from({ length: 12 }, (_, index) => (
          <Reveal key={index} index={index}>
            <Card p="md" withBorder r="md">
              <Text fz="body3">#{String(index + 1)}</Text>
            </Card>
          </Reveal>
        ))}
      </SimpleGrid>
    </Box>
  ),
};

export const States: Story = {
  name: "States (once activado y desactivado)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <Box p="lg" display="flex" direction="column" gap="xxl">
      <Text fz="body3" c="text.secondary" maw="62ch">
        Con `once` —el defecto— el bloque se queda. Con `once={false}` vuelve a esconderse al salir
        del viewport: sube y baja para verlo.
      </Text>
      <Filler label="desplaza" />
      <Reveal>
        <Card p="md" withBorder r="md">
          <Text fz="body2">once (defecto): me quedo</Text>
        </Card>
      </Reveal>
      <Filler label="sigue" />
      <Reveal once={false}>
        <Card p="md" withBorder r="md">
          <Text fz="body2">once=false: me voy y vuelvo</Text>
        </Card>
      </Reveal>
      <Filler label="fin" />
    </Box>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Text fz="body3" c="text.secondary" maw="62ch">
        Con reduced-motion el mecanismo no se arma: no hay estado oculto, no hay observer, no hay
        animación. El contenido aparece y ya.
      </Text>
      <Reveal>
        <Card p="md" withBorder r="md">
          <Text fz="body2">Visible sin depender de nada</Text>
        </Card>
      </Reveal>
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <Reveal>
      <Card p="lg" withBorder r="md">
        <Title order={3}>Bloque revelado</Title>
      </Card>
    </Reveal>
  ),
};

export const AllThemes: Story = {
  parameters: { ...MATRIX_A11Y, layout: "padded" },
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette" }]}>
      <Reveal>
        <Card p="md" withBorder r="md">
          <Text fz="body3">Bloque revelado</Text>
        </Card>
      </Reveal>
    </ThemeMatrix>
  ),
};
