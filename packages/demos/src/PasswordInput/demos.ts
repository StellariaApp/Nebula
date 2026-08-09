import type { DemoFamily } from "../types.js";

import Basic from "./Basic.js";

export const passwordInput: DemoFamily = {
  component: "PasswordInput",
  demos: [
    {
      id: "basic",
      render: Basic,
      source: "PasswordInput/Basic.tsx",
      title: "Reveal toggle",
      description:
        "The toggle is a real button with its own accessible name, not an icon glued to the field.",
    },
  ],
};
