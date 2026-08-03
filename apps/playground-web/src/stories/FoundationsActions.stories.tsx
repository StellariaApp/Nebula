import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { CreateIcons } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import type { Size, Variant } from "@stellaria/nebula-tokens";
import { ActionIcon, Box, Button, Divider, Flex, Paper, Text, Title } from "@stellaria/nebula-web";

import { MATRIX_A11Y, ThemeMatrix, rosette } from "../fixtures/themes.js";

const { Icon } = CreateIcons({ ...CommonPack });

const meta: Meta = {
  title: "Foundations/Visual QA/Actions",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

const sizes: Size[] = ["xs", "sm", "md", "lg", "xl"];

const variants: Variant[] = ["filled", "outline", "light", "glass", "ghost", "glow", "gradient"];

const CONTROL_HEIGHT: Record<Size, string> = {
  xs: "30 · toolbars densas",
  sm: "36 · data-dense",
  md: "42 · default de producto",
  lg: "50 · formularios prominentes",
  xl: "60 · hero/onboarding",
};

function Label(props: { children: React.ReactNode }): React.ReactElement {
  return (
    <Text component="p" fz="caption" ff="mono" tt="uppercase" ls="wide" c="text.muted" mb="sm">
      {props.children}
    </Text>
  );
}

/** Densidad: sizes.control expresa densidad, no importancia (docs/06 §4). */
export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gapy="lg" p="lg" bg="surface.base">
      {sizes.map((size) => (
        <Flex key={size} align="center" gapx="md">
          <Text component="span" fz="caption" ff="mono" c="text.muted" style={{ width: "10rem" }}>
            {CONTROL_HEIGHT[size]}
          </Text>
          <Button size={size}>Guardar</Button>
          <ActionIcon size={size} aria-label={`Editar (${size})`}>
            <Icon name="edit" />
          </ActionIcon>
        </Flex>
      ))}
    </Flex>
  ),
};

/** Cada variante del variantMap. Un tema puede remapearlas: sober apaga glass, glow y gradient. */
export const Variants: Story = {
  render: () => (
    <Flex wrap="wrap" gapx="md" gapy="md" p="lg" bg="surface.base">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </Flex>
  ),
};

/** Estados: loading conserva el nombre accesible; disabled baja contraste sin perder legibilidad. */
export const States: Story = {
  render: () => (
    <Flex direction="column" gapy="lg" p="lg" bg="surface.base">
      <Box>
        <Label>Reposo · deshabilitado · cargando</Label>
        <Flex gapx="md" wrap="wrap">
          <Button>Guardar cambios</Button>
          <Button disabled>Guardar cambios</Button>
          <Button loading>Guardar cambios</Button>
        </Flex>
      </Box>
      <Divider />
      <Box>
        <Label>Jerarquía dentro de un grupo — una sola acción principal</Label>
        <Flex gapx="sm" wrap="wrap" align="center">
          <Button>Confirmar pago</Button>
          <Button variant="ghost">Cancelar</Button>
        </Flex>
      </Box>
      <Divider />
      <Box>
        <Label>Solo icono — nombre accesible obligatorio, glifo ≈50 % del control</Label>
        <Flex gapx="sm" align="center">
          <ActionIcon aria-label="Editar">
            <Icon name="edit" />
          </ActionIcon>
          <ActionIcon variant="light" aria-label="Duplicar">
            <Icon name="more" />
          </ActionIcon>
          <ActionIcon variant="ghost" aria-label="Eliminar">
            <Icon name="trash" />
          </ActionIcon>
        </Flex>
      </Box>
    </Flex>
  ),
};

export const Composition: Story = {
  render: () => (
    <Box p="lg" bg="surface.base">
      <Paper withBorder radius="md" p="lg" style={{ maxWidth: "56ch" }}>
        <Flex direction="column" gapy="lg">
          <Flex direction="column" gapy="sm">
            <Title order={4}>Cancelar la suscripción</Title>
            <Text fz="body2" c="text.secondary">
              Conservas el acceso hasta el 31 de agosto. Los reportes generados siguen disponibles
              para descarga durante 90 días.
            </Text>
          </Flex>
          <Divider />
          <Flex gapx="sm" justify="flex-end" wrap="wrap">
            <Button variant="ghost">Volver</Button>
            <Button color="error">Cancelar suscripción</Button>
          </Flex>
        </Flex>
      </Paper>
    </Box>
  ),
};

export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: () => (
    <ThemeMatrix extra={[{ theme: rosette, label: "rosette (producto)" }]}>
      <Flex direction="column" gapy="sm" align="flex-start">
        <Button>Confirmar pago</Button>
        <Button variant="outline">Ver detalle</Button>
        <Button variant="ghost">Cancelar</Button>
      </Flex>
    </ThemeMatrix>
  ),
};

export const Dark: Story = { ...States, globals: { theme: "dark" } };

export const ReducedMotion: Story = { ...States, globals: { reducedMotion: "reduce" } };

/** El foco llega por teclado y es visible; el orden de tabulación sigue el orden visual. */
export const FocusOrder: Story = {
  render: () => (
    <Flex gapx="sm" p="lg" bg="surface.base">
      <Button>Primero</Button>
      <Button variant="outline">Segundo</Button>
      <ActionIcon aria-label="Tercero">
        <Icon name="edit" />
      </ActionIcon>
    </Flex>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Primero" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Segundo" })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "Tercero" })).toHaveFocus();
  },
};
