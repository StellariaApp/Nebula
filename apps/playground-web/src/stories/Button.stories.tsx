import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  Box,
  Button,
} from "@stellaria/nebula-web";

import ButtonColors from "@stellaria/nebula-demos/Button/Colors";
import ButtonComposition from "@stellaria/nebula-demos/Button/Composition";
import ButtonFullWidth from "@stellaria/nebula-demos/Button/FullWidth";
import ButtonSizes from "@stellaria/nebula-demos/Button/Sizes";
import ButtonStates from "@stellaria/nebula-demos/Button/States";
import ButtonVariants from "@stellaria/nebula-demos/Button/Variants";
import ButtonWithSections from "@stellaria/nebula-demos/Button/WithSections";

import { MATRIX_A11Y, ThemeMatrix, roseta } from "../fixtures/themes.js";

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
 * cambia el tema en la toolbar y la misma variante se resuelve contra el
 * `variantMap` de cada tema, sin tocar props.
 */
export const Variants: Story = { render: () => <ButtonVariants /> };

/** Alturas reales de `sizes.control` del tema activo. */
export const Sizes: Story = { render: () => <ButtonSizes /> };

export const Colors: Story = { render: () => <ButtonColors /> };

export const States: Story = { render: () => <ButtonStates /> };

export const WithSections: Story = { render: () => <ButtonWithSections /> };

export const FullWidth: Story = { render: () => <ButtonFullWidth /> };

export const Light: Story = {
  ...Variants,
  globals: { theme: "light" },
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

/**
 * Los cuatro temas oficiales lado a lado, más Rosette como tema de producto: mismas props,
 * misma estructura. Si una variante se rompe en una columna, el componente lee algo fuera del tema.
 */
export const AllThemes: Story = {
  parameters: MATRIX_A11Y,
  render: (args) => (
    <ThemeMatrix extra={[{ theme: roseta, label: "roseta" }]}>
      <Box display="flex" gap="sm" wrap="wrap">
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ))}
      </Box>
    </ThemeMatrix>
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

/** Una acción principal por región; el resto baja de jerarquía por variante, no por tamaño. */
export const Composition: Story = { render: () => <ButtonComposition /> };
