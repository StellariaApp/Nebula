import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";

import { Button, Card, Section, SimpleGrid, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta<typeof Section> = {
  title: "Layout/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Section>;

const STEPS = [
  { title: "Describe", body: "Cuenta en dos frases qué quieres y a quién se lo dices." },
  { title: "Revisa", body: "El borrador llega en segundos; corriges lo que no encaja." },
  { title: "Publica", body: "Sale a tu canal con el tono que ya conoces." },
];

function Steps(): ReactElement {
  return (
    <SimpleGrid cols={{ base: 1, tablet: 3 }} spacing="md">
      {STEPS.map((step, index) => (
        <Card
          key={step.title}
          variant="glass"
          glass="strong"
          h="100%"
          p="lg"
          r="lg"
          reveal={{ index }}
        >
          <Title fz="h5" order={3}>
            {step.title}
          </Title>
          <Text c="text.muted" fz="body2">
            {step.body}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export const Default: Story = {
  render: () => (
    <Section title="Cómo funciona" description="Tres pasos y ninguna configuración." py="xxl">
      <Steps />
    </Section>
  ),
};

/** El eyebrow va ANTES del título y fuera de él: la región se sigue llamando como el título. */
export const Eyebrow: Story = {
  render: () => (
    <Section
      eyebrow="Cómo funciona"
      title="Tres pasos"
      description="Describe, revisa y publica. Ninguna configuración por medio."
      py="xxl"
    >
      <Steps />
    </Section>
  ),
};

/** `align="center"` centra el encabezado entero y baja las acciones debajo. */
export const Centered: Story = {
  render: () => (
    <Section
      align="center"
      eyebrow="Planes"
      title="Empieza gratis"
      description="Diez piezas al mes sin tarjeta. Cuando te quedes corto, subes de plan."
      actions={<Button variant="gradient">Crear cuenta</Button>}
      glass
      py="xxl"
    >
      <Steps />
    </Section>
  ),
};

/** Dos bandas seguidas, como en una landing: sin cristal → con cristal, cada una con su eyebrow. */
export const Composition: Story = {
  render: () => (
    <>
      <Section eyebrow="Cómo funciona" title="Tres pasos" description="Sin configuración." py="xxl">
        <Steps />
      </Section>
      <Section
        align="center"
        eyebrow="Planes"
        title="Empieza gratis"
        description="Diez piezas al mes sin tarjeta."
        actions={<Button variant="gradient">Crear cuenta</Button>}
        glass
        py="xxl"
      >
        <Steps />
      </Section>
    </>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix>
      <Section
        align="center"
        eyebrow="Planes"
        title="Empieza gratis"
        description="Diez piezas al mes sin tarjeta."
        actions={<Button variant="gradient">Crear cuenta</Button>}
        glass
        py="lg"
      >
        <Steps />
      </Section>
    </ThemeMatrix>
  ),
};
