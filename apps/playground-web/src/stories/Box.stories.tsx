import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Box,
  Text,
} from "@stellaria/nebula-web";

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box p="md" bg="surface.raised" r="md">
      <Text>Box con padding, superficie y radio del tema.</Text>
    </Box>
  ),
};

/** Las style props tokenizadas se resuelven como clases atómicas (zero-runtime). */
export const StyleProps: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Box p="xs" bg="primary.100" c="primary.900" r="sm">
        p=xs · bg=primary.100 · c=primary.900
      </Box>
      <Box p="md" bg="surface.sunken" bdc="border.default" r="lg">
        p=md · bg=surface.sunken · borde con rol
      </Box>
      <Box p="lg" bg="accent.500" c="text.onPrimary" r="xl" shadow="md">
        p=lg · bg=accent.600 · shadow=md
      </Box>
    </Box>
  ),
};

/** Valores libres (no tokenizados) caen en estilo inline, sin ensuciar el CSS. */
export const FreeValues: Story = {
  render: () => (
    <Box display="flex" gap="sm" align="center">
      <Box w={120} h={60} bg="success.500" r="md" />
      <Box w="30%" h={60} bg="warning.500" r="md" />
      <Box w={60} h={60} bg="error.500" r="full" />
    </Box>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="sm">
      <Box component="section" p="sm" bg="surface.raised" r="sm">
        component=&quot;section&quot;
      </Box>
      <Box component="article" p="sm" bg="surface.sunken" r="sm">
        component=&quot;article&quot;
      </Box>
      <Box component="a" href="#box" p="sm" bg="info.100" c="info.900" r="sm">
        component=&quot;a&quot; (con href tipado)
      </Box>
    </Box>
  ),
};

export const Flex: Story = {
  render: () => (
    <Box
      display="flex"
      gap="sm"
      justify="space-between"
      align="center"
      p="sm"
      bg="surface.sunken"
      r="md"
    >
      <Box p="sm" bg="primary.500" c="text.onPrimary" r="sm">
        uno
      </Box>
      <Box p="sm" bg="primary.500" c="text.onPrimary" r="sm" grow>
        dos (grow)
      </Box>
      <Box p="sm" bg="primary.500" c="text.onPrimary" r="sm">
        tres
      </Box>
    </Box>
  ),
};

export const Light: Story = {
  ...StyleProps,
  globals: { theme: "light" },
};

export const ReducedMotion: Story = {
  ...Default,
  globals: { reducedMotion: "reduce" },
};
