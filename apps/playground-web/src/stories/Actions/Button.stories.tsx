import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Box, Button, Text } from "@stellaria/nebula-web";

const VARIANTS = [
  "filled",
  "outline",
  "light",
  "glass",
  "ghost",
  "glow",
  "gradient",
  "unstyled",
] as const;

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  args: { children: "Acción" },
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "select", options: SIZES },
    color: {
      control: "select",
      options: ["primary", "accent", "gray", "success", "warning", "error", "info"],
    },
  },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

/**
 * Las 8 recetas del `variantMap`. Lo que pinta cada una lo decide el TEMA:
 * cambia el tema en la toolbar y `filled` puede pasar a gradiente (playful) o
 * `glass` degradar a superficie sólida (sober, que trae glass off).
 */
export const Variants: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" wrap="wrap" maw={640}>
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </Box>
  ),
};

/** Alturas reales de `sizes.control` del tema activo. */
export const Sizes: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" align="center" wrap="wrap">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </Box>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" wrap="wrap" maw={640}>
      {(["primary", "accent", "success", "warning", "error", "info"] as const).map((color) => (
        <Button key={color} {...args} color={color}>
          {color}
        </Button>
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" wrap="wrap" align="center">
      <Button {...args}>normal</Button>
      <Button {...args} disabled>
        disabled
      </Button>
      <Button {...args} loading>
        loading
      </Button>
      <Button {...args} fullWidth={false} variant="outline" disabled>
        outline disabled
      </Button>
    </Box>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" wrap="wrap" align="center">
      <Button {...args} leftSection={<span>←</span>}>
        Anterior
      </Button>
      <Button {...args} rightSection={<span>→</span>}>
        Siguiente
      </Button>
      <Button {...args} aria-label="Cerrar" leftSection={<span>×</span>}>
        {null}
      </Button>
    </Box>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => (
    <Box w={420}>
      <Button {...args}>Ocupa todo el ancho</Button>
    </Box>
  ),
};

export const Dark: Story = {
  ...Variants,
  globals: { theme: "nebula-dark" },
};

/** El press con spring se desactiva; el spinner ralentiza su giro. */
export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: (args) => (
    <Box display="flex" gap="sm" align="center">
      <Button {...args}>Sin animación de press</Button>
      <Button {...args} loading>
        Cargando
      </Button>
    </Box>
  ),
};

/** Los 4 temas lado a lado: el gate visual de W1. */
export const AllThemes: Story = {
  render: (args) => (
    <Box display="flex" direction="column" gap="md">
      <Text fz="body2" c="text.muted">
        Cambia el tema en la toolbar: los mismos componentes se reconfiguran sin tocar props.
      </Text>
      <Box display="flex" gap="sm" wrap="wrap">
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ))}
      </Box>
    </Box>
  ),
};

/** Contrato de teclado APG: foco por Tab, activación con Enter y Space. */
export const KeyboardActivation: Story = {
  args: { children: "Pulsa con teclado" },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Pulsa con teclado" });

    await step("Tab lleva el foco al botón", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Enter y Space activan sin mover el foco", async () => {
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      await expect(button).toHaveFocus();
    });
  },
};

/** Un botón deshabilitado no recibe foco ni dispara la acción. */
export const DisabledIsNotFocusable: Story = {
  args: { children: "No disponible", disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "No disponible" });
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
  },
};
