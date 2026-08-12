import { TextInput } from "@stellaria/nebula-web";
import { SIZES, BySize, States } from "./kit";
import type { Preview } from "./types";

const preview: Preview = {
  base: <TextInput w={240} placeholder="you@example.com" />,
  groups: [
    BySize(SIZES, (size) => <TextInput size={size} w={200} placeholder="Email" />),
    States(
      { label: "label", node: <TextInput w={240} label="Email" placeholder="you@example.com" /> },
      { label: "disabled", node: <TextInput w={240} disabled placeholder="Email" /> },
      {
        label: "error",
        node: <TextInput w={240} label="Email" error="That address is taken" />,
      },
    ),
  ],
  usage: {
    code: `<TextInput
label="Email"
description="We only use it for the receipt."
placeholder="you@example.com"
required
/>`,
    node: (
      <TextInput
        w={320}
        label="Email"
        description="We only use it for the receipt."
        placeholder="you@example.com"
        required
      />
    ),
  },
};

export default preview;
