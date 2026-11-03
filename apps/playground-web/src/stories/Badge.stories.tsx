import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, Box, StatusBadge } from "@stellaria/nebula-web";

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  parameters: { layout: "padded" },
  args: { children: "Activo" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

const STATUS = {
  paid: { label: "Pagado", color: "success", dot: true },
  pending: { label: "Pendiente", color: "warning", dot: true },
  late: { label: "Vencido", color: "error", dot: true },
  draft: { label: "Borrador", color: "gray" },
} as const;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
      {(["filled", "light", "outline", "ghost"] as const).map((variant) => (
        <Badge key={variant} variant={variant} color="primary">
          {variant}
        </Badge>
      ))}
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
      {(["success", "warning", "error", "info"] as const).map((color) => (
        <Badge key={color} color={color} dot>
          {color}
        </Badge>
      ))}
    </Box>
  ),
};

export const Status: Story = {
  render: () => (
    <Box display="flex" gap="sm" style={{ flexWrap: "wrap" }}>
      {(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((status) => (
        <StatusBadge key={status} status={status} map={STATUS} />
      ))}
    </Box>
  ),
};

export const Dark: Story = { ...Status, globals: { theme: "dark" } };
