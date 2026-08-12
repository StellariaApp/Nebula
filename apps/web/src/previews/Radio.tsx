import { Radio } from "@stellaria/nebula-web";
import { States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <Radio name="preview" value="dark" label="Dark" />,
  groups: [
    States({ label: "disabled", node: <Radio name="p3" value="b" disabled label="Dark" /> }),
  ],
};

export default preview;
