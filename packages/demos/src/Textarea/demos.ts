import type { DemoFamily } from "../types.js";

import Autosize from "./Autosize.js";

export const textarea: DemoFamily = {
  component: "Textarea",
  demos: [
    {
      id: "autosize",
      render: Autosize,
      source: "Textarea/Autosize.tsx",
      title: "Grows with its content",
      description:
        "rows is the starting height, not a ceiling: with autosize the field grows as you type instead of scrolling inside itself.",
    },
  ],
};
