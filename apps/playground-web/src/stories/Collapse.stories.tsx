import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Button, Collapse, Paper, Text } from "@stellaria/nebula-web";

const meta: Meta<typeof Collapse> = {
  title: "Utilities/Collapse",
  component: Collapse,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Collapse>;

function Demo() {
  const [open, set_open] = useState(true);
  return (
    <Box display="flex" direction="column" gap="sm" align="flex-start">
      <Button size="sm" aria-expanded={open} onClick={() => set_open((v) => !v)}>
        {open ? "Cerrar" : "Abrir"}
      </Button>
      <Collapse in={open}>
        <Paper p="md" withBorder radius="md" maw={360}>
          <Text>
            Contenido que se pliega y despliega animando la altura. Es una transición discreta, así
            que animar `height` está permitido.
          </Text>
        </Paper>
      </Collapse>
    </Box>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Demo />,
};

export const Dark: Story = { render: () => <Demo />, globals: { theme: "dark" } };
