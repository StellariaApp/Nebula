import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Badge, Box, Button, Card, Text, Title } from "@stellaria/nebula-web";

const meta: Meta<typeof Card> = {
  title: "Data Display/Card",
  component: Card,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card maw={360} aria-label="Resumen de la cuenta">
      <Card.Section>
        <Title order={4}>Cuenta corriente</Title>
        <Text>Saldo disponible: 12,480.00</Text>
      </Card.Section>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <Box display="flex" gap="md" style={{ flexWrap: "wrap" }}>
      {(["filled", "outline", "light", "glass"] as const).map((variant) => (
        <Card key={variant} variant={variant} w={200} aria-label={variant}>
          <Card.Section>{variant}</Card.Section>
        </Card>
      ))}
    </Box>
  ),
};

export const InContext: Story = {
  render: () => (
    <Card maw={360} aria-label="Plan Pro">
      <Card.Section>
        <Box display="flex" justify="space-between" align="center">
          <Title order={4}>Plan Pro</Title>
          <Badge color="success">Activo</Badge>
        </Box>
        <Text>Renueva el 1 de diciembre.</Text>
      </Card.Section>
      <Card.Section withBorder>
        <Button size="sm">Administrar</Button>
      </Card.Section>
    </Card>
  ),
};

export const Dark: Story = { ...InContext, globals: { theme: "dark" } };

export const Pressable: Story = {
  render: () => (
    <Card interactive onPress={() => undefined} maw={360} aria-label="Abrir cuenta corriente">
      <Card.Section>Cuenta corriente</Card.Section>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByLabelText("Abrir cuenta corriente")).toHaveFocus();
  },
};
