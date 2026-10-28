import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactElement } from "react";

import { Box, Button, Loader, Skeleton, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { args: { lines: 3 } };

export const Animations: Story = {
  render: () => (
    <Box display="flex" direction="column" gap="md" maw={360}>
      {(["shimmer", "pulse", "none"] as const).map((animation) => (
        <Skeleton key={animation} animation={animation} height={16} />
      ))}
    </Box>
  ),
};

export const Spinners: Story = {
  render: () => (
    <Box display="flex" gap="lg" align="center">
      <Loader label="Cargando facturas" />
      <Loader type="dots" label="Enviando" />
      <Loader type="bars" label="Sincronizando" />
    </Box>
  ),
};

function Swap(): ReactElement {
  const [loading, set_loading] = useState(true);
  return (
    <Box display="flex" direction="column" gap="md" maw={360}>
      <Skeleton loading={loading} lines={2}>
        <Text>Saldo disponible: 12,480.00</Text>
      </Skeleton>
      <Button onPress={() => set_loading((value) => !value)}>
        {loading ? "Mostrar contenido" : "Volver a cargar"}
      </Button>
    </Box>
  );
}

export const InContext: Story = { render: () => <Swap /> };

export const Dark: Story = { ...Animations, globals: { theme: "dark" } };

export const ReducedMotion: Story = { ...Animations, globals: { reducedMotion: "reduce" } };
