import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement, ReactNode } from "react";

import {
  Badge,
  BlurOverlay,
  Box,
  Button,
  GlassSurface,
  GradientText,
  Group,
  MeshGradientBg,
  NoiseOverlay,
  Stat,
  Text,
  Title,
} from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof GlassSurface> = {
  title: "Effects/Glass y velos",
  component: GlassSurface,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof GlassSurface>;

function Backdrop(props: { children: ReactNode; h?: number }): ReactElement {
  const { children, h = 220 } = props;
  return (
    <Box position="relative" h={h} r="lg" style={{ overflow: "hidden", isolation: "isolate" }}>
      <MeshGradientBg gradient="brand" radius="lg" style={{ position: "absolute", inset: 0 }} />
      <Box position="relative" p="lg" h="100%">
        {children}
      </Box>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Backdrop>
      <GlassSurface p="lg" maw={360}>
        <Title order={4} mb="xxs">
          Panel de resumen
        </Title>
        <Text component="p" fz="body2" c="text.secondary">
          Superficie esmerilada sobre el material del tema.
        </Text>
      </GlassSurface>
    </Backdrop>
  ),
};

export const Niveles: Story = {
  render: () => (
    <Backdrop h={260}>
      <Box display="flex" gap="md" wrap="wrap">
        {(["subtle", "default", "strong"] as const).map((level) => (
          <GlassSurface key={level} level={level} p="md" miw={160}>
            <Text component="p" fz="caption" ff="mono" c="text.muted" mb="xxs">
              level=&quot;{level}&quot;
            </Text>
            <Text component="p" fz="body2">
              Blur {level === "subtle" ? "md" : level === "default" ? "xl" : "xxl"}
            </Text>
          </GlassSurface>
        ))}
      </Box>
    </Backdrop>
  ),
};

export const ConGrano: Story = {
  render: () => (
    <Backdrop>
      <Box display="flex" gap="md" wrap="wrap">
        <GlassSurface p="md" miw={180}>
          <Text component="p" fz="body2">
            Sin grano
          </Text>
        </GlassSurface>
        <GlassSurface noise p="md" miw={180}>
          <Text component="p" fz="body2">
            Con <code>noise</code>
          </Text>
        </GlassSurface>
      </Box>
    </Backdrop>
  ),
};

export const Guardrail: Story = {
  render: () => (
    <Box maw={620}>
      <Title order={4} mb="sm">
        Dónde sí y dónde no
      </Title>
      <Text component="p" c="text.secondary" mb="md">
        El material es para top bars, cards destacadas, paneles resumen, empty states, onboarding,
        command palette y drawers premium. Queda prohibido en tablas densas, celdas de data grid,
        formularios críticos y vistas financieras de precisión: el <code>backdrop-filter</code> se
        repinta con cada scroll y resta contraste justo donde se comparan cifras.
      </Text>
      <Backdrop h={180}>
        <GlassSurface p="md" maw={280}>
          <Stat label="Cartera activa" value="1.284.900" description="MXN" />
        </GlassSurface>
      </Backdrop>
    </Box>
  ),
};

export const VeloConBlur: Story = {
  render: () => (
    <Box position="relative" maw={420} p="lg" r="lg" bg="surface.raised" style={{ isolation: "isolate" }}>
      <Title order={4} mb="xxs">
        Proyección trimestral
      </Title>
      <Text component="p" fz="body2" c="text.secondary">
        El detalle de la proyección queda ilegible hasta desbloquear el módulo. El desenfoque no oculta
        el contenido de un lector de pantalla: la región de detrás va marcada con <code>inert</code>.
      </Text>
      <BlurOverlay radius="lg" center>
        <Button variant="filled" size="sm">
          Desbloquear
        </Button>
      </BlurOverlay>
    </Box>
  ),
};

export const Grano: Story = {
  render: () => (
    <Box display="flex" gap="md" wrap="wrap">
      {([undefined, 0.04, 0.09] as const).map((value, index) => (
        <Box
          key={index}
          position="relative"
          w={200}
          h={120}
          r="md"
          bg="surface.raised"
          style={{ overflow: "hidden", isolation: "isolate" }}
        >
          <NoiseOverlay {...(value === undefined ? {} : { opacity: value })} radius="md" />
          <Box position="relative" p="md">
            <Text component="p" fz="caption" ff="mono" c="text.muted">
              {value === undefined ? "del tema" : `opacity=${String(value)}`}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Dark: Story = {
  globals: { theme: "nebula-dark" },
  render: () => (
    <Backdrop>
      <GlassSurface p="lg" maw={340}>
        <Title order={4}>Dark first</Title>
      </GlassSurface>
    </Backdrop>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => (
    <Box maw={560}>
      <Backdrop h={180}>
        <GlassSurface p="md" maw={300}>
          <Text component="p" fz="body2">
            Glass, blur y grano no animan: no hay motion que reducir.
          </Text>
        </GlassSurface>
      </Backdrop>
    </Box>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box position="relative" r="xl" style={{ overflow: "hidden", isolation: "isolate" }}>
      <MeshGradientBg gradient="brand" grain radius="xl" style={{ position: "absolute", inset: 0 }} />
      <Box position="relative" p="xl">
        <Group justify="space-between" mb="lg">
          <Text component="p" fz="caption" fw="semibold" tt="uppercase" ls="wide" c="text.muted">
            Panel de control
          </Text>
          <Badge variant="light">Julio</Badge>
        </Group>
        <Title order={2} mb="lg" maw={420}>
          Un material, <GradientText inherit>cuatro temas</GradientText>
        </Title>
        <Box display="flex" gap="md" wrap="wrap">
          <GlassSurface p="md" miw={190}>
            <Stat label="Colocación" value="4.2M" trend="up" />
          </GlassSurface>
          <GlassSurface p="md" miw={190}>
            <Stat label="Morosidad" value="1,8 %" trend="down" />
          </GlassSurface>
          <GlassSurface level="subtle" p="md" miw={190}>
            <Stat label="Clientes" value="9.140" />
          </GlassSurface>
        </Box>
      </Box>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box position="relative" h={150} r="md" style={{ overflow: "hidden", isolation: "isolate" }}>
        <MeshGradientBg gradient="brand" radius="md" style={{ position: "absolute", inset: 0 }} />
        <Box position="relative" p="md">
          <GlassSurface noise p="md">
            <Text component="p" fz="body2">
              Glass
            </Text>
            <Text component="p" fz="caption" c="text.muted">
              sober lo apaga
            </Text>
          </GlassSurface>
        </Box>
      </Box>
    </ThemeMatrix>
  ),
};
