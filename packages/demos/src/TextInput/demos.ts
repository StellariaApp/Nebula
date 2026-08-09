import type { DemoFamily } from "../types";

import Basic from "./Basic";
import Sizes from "./Sizes";

export const textInput: DemoFamily = {
  component: "TextInput",
  demos: [
    {
      id: "basic",
      render: Basic,
      source: "TextInput/Basic.tsx",
      title: "Label, description and error",
      description:
        "The three states a field needs. The error message is wired to the control, so a screen reader announces it without you doing anything.",
    },
    {
      id: "sizes",
      render: Sizes,
      source: "TextInput/Sizes.tsx",
      title: "Sizes",
      description:
        "The same control scale as every other field, so a form mixing inputs, selects and buttons lines up.",
    },
  ],
};
