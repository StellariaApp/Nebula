import type { DemoFamily } from "../types";

import Basic from "./Basic";

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
