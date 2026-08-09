import type { DemoFamily } from "../types";

import Controlled from "./Controlled";

export const numberInput: DemoFamily = {
  component: "NumberInput",
  demos: [
    {
      id: "controlled",
      render: Controlled,
      source: "NumberInput/Controlled.tsx",
      title: "Controlled, with bounds",
      description:
        "min and max clamp the value and disable the steppers at the ends, so the control never emits something out of range.",
    },
  ],
};
