import { Switch } from "@stellaria/nebula-web";
import { States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Switch label="Reduced motion" />,
  groups: [
    States(
      { label: "checked", node: <Switch defaultChecked label="Reduced motion" /> },
      { label: "disabled", node: <Switch disabled label="Reduced motion" /> },
    ),
  ],
};

export default preview;
