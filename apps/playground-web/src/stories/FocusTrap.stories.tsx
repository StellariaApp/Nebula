import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button, FocusTrap, Group, Paper } from "@stellaria/nebula-web";

const meta: Meta<typeof FocusTrap> = {
  title: "Utilities/FocusTrap",
  component: FocusTrap,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof FocusTrap>;

export const Default: Story = {
  render: () => (
    <FocusTrap>
      <Paper p="md" withBorder radius="md">
        <Group gap="sm">
          <Button size="sm">uno</Button>
          <Button size="sm">dos</Button>
          <Button size="sm">tres</Button>
        </Group>
      </Paper>
    </FocusTrap>
  ),
};

/** El foco no escapa del trap: al tabular más allá del último control vuelve al primero. */
export const KeyboardContainment: Story = {
  ...Default,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const uno = canvas.getByRole("button", { name: "uno" });
    const names = ["uno", "dos", "tres"];

    await step("El foco recorre los controles y queda contenido", async () => {
      uno.focus();
      for (let i = 0; i < 5; i += 1) {
        await userEvent.tab();
        const active = document.activeElement as HTMLElement | null;
        await expect(names).toContain(active?.textContent);
      }
    });
  },
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
