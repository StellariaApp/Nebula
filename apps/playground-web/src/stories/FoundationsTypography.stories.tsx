import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Divider, Flex, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Foundations/Visual QA/Typography",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const HEADING_ORDERS = [1, 2, 3, 4, 5, 6] as const;

const HEADING_SAMPLE: Record<(typeof HEADING_ORDERS)[number], string> = {
  1: "Infraestructura que escala contigo",
  2: "Cobros, conciliación y reportes",
  3: "Configuración de la cuenta",
  4: "Métodos de pago",
  5: "Historial reciente",
  6: "Detalle del movimiento",
};

const LEAD_ES =
  "Nebula unifica el contrato de cada componente entre web y React Native, de modo que un producto " +
  "cambia de personalidad ajustando su tema y no bifurcando la librería.";

const LEAD_EN =
  "Nebula unifies each component contract across web and React Native, so a product changes its " +
  "personality by adjusting its theme instead of forking the library.";

function Row(props: {
  token: string;
  note: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Flex direction="column" gapy="xxs" py="sm">
      <Flex gapx="sm" align="baseline">
        <Text component="span" fz="caption" ff="mono" c="text.muted">
          {props.token}
        </Text>
        <Text component="span" fz="caption" c="text.muted">
          {props.note}
        </Text>
      </Flex>
      {props.children}
    </Flex>
  );
}

/** Escalera de headings: el tamaño baja y el peso pasa de bold a semibold en h3. */
export const Hierarchy: Story = {
  render: () => (
    <Box component="section" p="lg" bg="surface.base">
      <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted" mb="md">
        Jerarquía
      </Text>
      {HEADING_ORDERS.map((order) => (
        <Row
          key={order}
          token={`h${String(order)}`}
          note={order <= 3 ? "letterSpacing tight" : "letterSpacing normal"}
        >
          <Title order={order}>{HEADING_SAMPLE[order]}</Title>
        </Row>
      ))}
    </Box>
  ),
};

/** Cuerpo y metadata: ningún tamaño informativo baja de 12 px (ADR-024). */
export const BodyAndMetadata: Story = {
  render: () => (
    <Box component="section" p="lg" bg="surface.base" style={{ maxWidth: "68ch" }}>
      <Row token="body1 · 16" note="cuerpo por defecto, formularios y lectura">
        <Text>{LEAD_ES}</Text>
      </Row>
      <Divider />
      <Row token="body2 · 14" note="cuerpo secundario y UI compacta">
        <Text fz="body2" c="text.secondary">
          {LEAD_ES}
        </Text>
      </Row>
      <Divider />
      <Row token="body3 · 13" note="apoyo denso; no para párrafos largos">
        <Text fz="body3" c="text.secondary">
          Última sincronización hace 4 minutos · 128 registros procesados
        </Text>
      </Row>
      <Divider />
      <Row token="button · 14 semibold" note="label de controles">
        <Text fz="button" fw="semibold">
          Guardar cambios
        </Text>
      </Row>
      <Divider />
      <Row token="caption · 12" note="mínimo absoluto de texto informativo">
        <Text fz="caption" c="text.muted">
          El importe incluye IVA. La conversión usa el tipo de cambio del día de la operación.
        </Text>
      </Row>
    </Box>
  ),
};

/** Medida de línea: 60–70 caracteres es cómodo, 75 es el techo (docs/06 §2). */
export const LineMeasure: Story = {
  render: () => (
    <Flex direction="column" gapy="lg" p="lg" bg="surface.base">
      <Box>
        <Text fz="caption" ff="mono" c="text.muted" mb="xs">
          ~65ch — dentro del rango cómodo
        </Text>
        <Box style={{ maxWidth: "65ch" }}>
          <Text>{LEAD_ES}</Text>
        </Box>
      </Box>
      <Box>
        <Text fz="caption" ff="mono" c="text.muted" mb="xs">
          sin límite — la línea se vuelve difícil de seguir
        </Text>
        <Text>{LEAD_ES}</Text>
      </Box>
    </Flex>
  ),
};

/** El inglés ocupa entre 15 % y 30 % más ancho: la jerarquía no debe romperse. */
export const Bilingual: Story = {
  render: () => (
    <Flex direction="column" gapy="xl" p="lg" bg="surface.base">
      {(
        [
          { lang: "es", eyebrow: "Plataforma", title: HEADING_SAMPLE[2], lead: LEAD_ES },
          {
            lang: "en",
            eyebrow: "Platform",
            title: "Payments, reconciliation and reporting",
            lead: LEAD_EN,
          },
        ] as const
      ).map((block) => (
        <Box key={block.lang} component="section" lang={block.lang} style={{ maxWidth: "62ch" }}>
          <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted">
            {block.eyebrow}
          </Text>
          <Title order={2} mt="xs" mb="sm">
            {block.title}
          </Title>
          <Text c="text.secondary">{block.lead}</Text>
        </Box>
      ))}
    </Flex>
  ),
};

export const Composition: Story = { ...Bilingual };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Box style={{ maxWidth: "40ch" }}>
        <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted">
          Plataforma
        </Text>
        <Title order={4} mt="xs" mb="sm">
          {HEADING_SAMPLE[4]}
        </Title>
        <Text fz="body2" c="text.secondary">
          Tarjeta terminada en 4242 · vence 09/29
        </Text>
        <Text fz="caption" c="text.muted" mt="sm">
          Se cobra el día 1 de cada mes.
        </Text>
      </Box>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...Hierarchy, globals: { theme: "nebula-dark" } };

export const ReducedMotion: Story = { ...Hierarchy, globals: { reducedMotion: "reduce" } };
