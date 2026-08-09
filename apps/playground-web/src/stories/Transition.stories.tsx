import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Button, Paper, Text, Transition, type TransitionPreset } from "@stellaria/nebula-web";

const meta: Meta<typeof Transition> = {
  title: "Utilities/Transition",
  component: Transition,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Transition>;

function Demo({ transition }: { transition: TransitionPreset }) {
  const [mounted, set_mounted] = useState(true);
  return (
    <Box display="flex" direction="column" gap="sm" align="flex-start">
      <Button size="sm" onClick={() => set_mounted((v) => !v)}>
        {mounted ? "Ocultar" : "Mostrar"}
      </Button>
      <Transition mounted={mounted} transition={transition}>
        <Paper p="md" withBorder r="md">
          <Text>preset: {transition}</Text>
        </Paper>
      </Transition>
    </Box>
  );
}

export const Fade: Story = { render: () => <Demo transition="fade" /> };
export const Scale: Story = { render: () => <Demo transition="scale" /> };
export const SlideUp: Story = { render: () => <Demo transition="slide-up" /> };

/** Con reduced-motion la transición colapsa a un cambio instantáneo. */
export const ReducedMotion: Story = {
  globals: { reducedMotion: "reduce" },
  render: () => <Demo transition="scale" />,
};

export const Dark: Story = {
  render: () => <Demo transition="pop" />,
  globals: { theme: "dark" },
};
