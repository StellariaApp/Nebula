import { Button } from "@stellaria/nebula-web";
import { FULL, SIZES, ByVariant, BySize, States, CHECK } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Button>Button</Button>,
  groups: [
    ByVariant(FULL, (variant) => <Button variant={variant}>Button</Button>),
    BySize(SIZES, (size) => <Button size={size}>Button</Button>),
    States(
      { label: "disabled", node: <Button disabled>Button</Button> },
      { label: "loading", node: <Button loading>Button</Button> },
      { label: "fullWidth", node: <Button fullWidth>Button</Button> },
    ),
  ],
  usage: {
    code: `<Button variant="gradient" size="lg" leftSection={<Check />}>
Reconcile 24 movements
</Button>`,
    node: (
      <Button variant="gradient" size="lg" leftSection={CHECK}>
        Reconcile 24 movements
      </Button>
    ),
  },
};

export default preview;
