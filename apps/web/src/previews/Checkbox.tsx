import { Checkbox } from "@stellaria/nebula-web";
import { States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Checkbox label="Ship it" />,
  groups: [
    States(
      { label: "checked", node: <Checkbox defaultChecked label="Ship it" /> },
      { label: "indeterminate", node: <Checkbox indeterminate label="Ship it" /> },
      { label: "disabled", node: <Checkbox disabled label="Ship it" /> },
    ),
  ],
};

export default preview;
