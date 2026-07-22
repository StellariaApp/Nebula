import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { CreateIcons } from "@stellaria/nebula-icons";
import { CommonPack } from "@stellaria/nebula-icons/packs";
import { ActionIcon, Box, Paper, Text } from "@stellaria/nebula-web";

const { Icon } = CreateIcons({ ...CommonPack });

const VARIANTS = ["filled", "light", "outline", "ghost", "glass", "glow"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const meta: Meta<typeof ActionIcon> = {
  title: "Actions/ActionIcon",
  component: ActionIcon,
  args: { "aria-label": "Ajustes", children: <Icon name="settings" /> },
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ActionIcon>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" wrap="wrap" align="center">
      {VARIANTS.map((variant) => (
        <ActionIcon key={variant} {...args} variant={variant} aria-label={variant} />
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" align="center">
      {SIZES.map((size) => (
        <ActionIcon key={size} {...args} size={size} aria-label={`tamaño ${size}`} />
      ))}
    </Box>
  ),
};

export const States: Story = {
  render: (args) => (
    <Box display="flex" gap="sm" align="center">
      <ActionIcon {...args} aria-label="normal" />
      <ActionIcon {...args} disabled aria-label="deshabilitado" />
      <ActionIcon {...args} loading aria-label="cargando" />
    </Box>
  ),
};

export const Dark: Story = { ...Variants, globals: { theme: "nebula-dark" } };

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Ajustes" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(button).toHaveFocus();
  },
};

export const Composition: Story = {
  render: () => (
    <Paper p="sm" radius="lg" withBorder>
      <Box display="flex" gap="sm" align="center">
        <Text fz="body2" fw="semibold">
          Vista del panel
        </Text>
        <Box display="flex" gap="xs" align="center">
          <ActionIcon variant="ghost" aria-label="Buscar">
            <Icon name="search" />
          </ActionIcon>
          <ActionIcon variant="ghost" aria-label="Configurar">
            <Icon name="settings" />
          </ActionIcon>
          <ActionIcon variant="ghost" aria-label="Más opciones">
            <Icon name="more" />
          </ActionIcon>
        </Box>
      </Box>
    </Paper>
  ),
};
