import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  BackgroundImage,
  Box,
  Button,
  Card,
  EmptyState,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@stellaria/nebula-web";
import type { AccordionItemData } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix } from "../fixtures/themes.js";

const meta: Meta = {
  title: "Data display/Overview",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const COLORS = ["primary", "success", "warning", "error", "info"] as const;

const FAQ: AccordionItemData[] = [
  { value: "envio", label: "¿Cuánto tarda el envío?", content: "Entre 2 y 4 días hábiles." },
  { value: "pago", label: "¿Qué formas de pago aceptan?", content: "Tarjeta y transferencia." },
  {
    value: "devolucion",
    label: "¿Puedo devolver un producto?",
    content: "Sí, dentro de los 30 días posteriores a la compra.",
  },
];

export const Badges: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md">
      <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
        {COLORS.map((color) => (
          <Badge key={color} color={color}>
            {color}
          </Badge>
        ))}
      </Box>
      <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
        {(["light", "filled", "outline", "ghost", "gradient"] as const).map((variant) => (
          <Badge key={variant} variant={variant} color="success">
            {variant}
          </Badge>
        ))}
      </Box>
      <Box display="flex" gap="sm" style={{ alignItems: "center", flexWrap: "wrap" }}>
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Badge key={size} size={size}>
            {size}
          </Badge>
        ))}
      </Box>
    </Box>
  ),
};

export const Avatars: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="lg">
      <Box display="flex" gap="md" style={{ alignItems: "center" }}>
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size} name="Ana García" />
        ))}
      </Box>
      <Box display="flex" gap="md" style={{ alignItems: "center" }}>
        <Avatar name="Ana García" color="success" />
        <Avatar name="Beto Ruiz" color="warning" radius="md" />
        <Avatar name="Carla Díaz" color="error" radius="sm" />
      </Box>
      <AvatarGroup max={3} total={8} aria-label="Equipo del proyecto">
        <Avatar name="Ana García" />
        <Avatar name="Beto Ruiz" color="success" />
        <Avatar name="Carla Díaz" color="warning" />
        <Avatar name="Diego Lara" color="error" />
      </AvatarGroup>
    </Box>
  ),
};

export const Images: Story = {
  render: () => (
    <SimpleGrid cols={2} spacing="md">
      <Image alt="Sin origen todavía" fallback="Imagen no disponible" height={160} />
      <BackgroundImage src="" radius="md" overlay={55}>
        <Box p="lg">
          <Title order={5} c="text.inverted">
            Con capa de contraste
          </Title>
          <Text c="text.inverted">El overlay garantiza legibilidad sobre cualquier foto.</Text>
        </Box>
      </BackgroundImage>
    </SimpleGrid>
  ),
};

/** El acordeón sigue el patrón APG: `aria-expanded`, panel vinculado y flechas. */
export const Accordions: Story = {
  render: () => (
    <Box maw={560} display="flex" direction="column" gap="lg">
      <Accordion data={FAQ} defaultValue="envio" />
      <Accordion data={FAQ} multiple chevronPosition="start" defaultValue={["envio", "pago"]} />
    </Box>
  ),
};

export const Cards: Story = {
  render: () => (
    <SimpleGrid cols={2} spacing="md">
      <Card>
        <Card.Image src="" alt="Portada del plan" height={140} />
        <Box display="flex" direction="column" gap="xs" pt="sm">
          <Card.Badges>
            <Badge color="success">Activo</Badge>
            <Badge variant="outline">Anual</Badge>
          </Card.Badges>
          <Title order={5}>Plan Profesional</Title>
          <Text c="text.secondary">Proyectos ilimitados y soporte prioritario.</Text>
          <Card.Meta>Renueva el 12 de agosto</Card.Meta>
          <Card.Actions>
            <Button size="sm">Gestionar</Button>
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Card.Actions>
        </Box>
      </Card>
      <Card onPress={() => undefined} aria-label="Abrir ficha del cliente" shadow="sm">
        <Box display="flex" gap="md" style={{ alignItems: "center" }}>
          <Avatar name="Ana García" size="lg" />
          <Box>
            <Title order={5}>Ana García</Title>
            <Text c="text.secondary">Cliente desde 2021</Text>
          </Box>
        </Box>
      </Card>
    </SimpleGrid>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      title="Sin movimientos todavía"
      description="Cuando registres tu primer cobro aparecerá aquí el detalle."
      icon="📭"
      actions={<Button>Registrar cobro</Button>}
    />
  ),
};

export const Composition: Story = {
  render: () => (
    <Box maw={720} display="flex" direction="column" gap="lg">
      <Title order={4}>Cartera de clientes</Title>
      <SimpleGrid cols={2} spacing="md">
        <Card>
          <Box display="flex" direction="column" gap="sm">
            <Box display="flex" gap="md" style={{ alignItems: "center" }}>
              <Avatar name="Ana García" />
              <Box style={{ flex: 1 }}>
                <Title order={5}>Ana García</Title>
                <Card.Meta>Última actividad hace 2 días</Card.Meta>
              </Box>
              <Badge color="success" variant="outline" dot>
                Al corriente
              </Badge>
            </Box>
            <Card.Actions>
              <Button size="sm" variant="outline">
                Ver detalle
              </Button>
            </Card.Actions>
          </Box>
        </Card>
        <Card>
          <EmptyState
            size="sm"
            title="Sin clientes en riesgo"
            description="Todo tu portafolio está al día."
          />
        </Card>
      </SimpleGrid>
      <Accordion data={FAQ} />
    </Box>
  ),
};

export const Dark: Story = { ...Composition, globals: { theme: "dark" } };

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args, ctx) => <ThemeMatrix>{Composition.render?.(args, ctx)}</ThemeMatrix>,
};

export const ReducedMotion: Story = { ...Accordions, globals: { reducedMotion: "reduce" } };

/** APG accordion: Enter abre, las flechas mueven el foco saltando deshabilitados. */
export const KeyboardFlow: Story = {
  render: () => <Accordion data={FAQ} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const first = canvas.getByRole("button", { name: "¿Cuánto tarda el envío?" });
    first.focus();
    await expect(first).toHaveAttribute("aria-expanded", "false");

    await userEvent.keyboard("{Enter}");
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const panel_id = first.getAttribute("aria-controls") ?? "";
    await expect(document.getElementById(panel_id)).toHaveAttribute("aria-labelledby", first.id);

    await userEvent.keyboard("{ArrowDown}");
    await expect(
      canvas.getByRole("button", { name: "¿Qué formas de pago aceptan?" }),
    ).toHaveFocus();
  },
};
