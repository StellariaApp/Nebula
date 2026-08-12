import { Menu, Button } from "@stellaria/nebula-web";
import type { Preview } from "./types";

const preview: Preview = {
  base: (
    <Menu
      trigger={<Button variant="light">Open menu</Button>}
      items={[
        { key: "copy", label: "Copy" },
        { key: "duplicate", label: "Duplicate", shortcut: "⌘D" },
        { key: "delete", label: "Delete", disabled: true },
      ]}
    />
  ),
};

export default preview;
