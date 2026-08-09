import type { DemoFamily } from "../types.js";

import AsDrawer from "./AsDrawer.js";
import Basic from "./Basic.js";
import Composition from "./Composition.js";

export const modal: DemoFamily = {
  component: "Modal",
  demos: [
    {
      id: "basic",
      render: Basic,
      source: "Modal/Basic.tsx",
      title: "Title and subtitle",
      description:
        "The title names the dialog through aria-labelledby, so it is what a screen reader announces on open. Escape and the close button both close it.",
    },
    {
      id: "as-drawer",
      render: AsDrawer,
      source: "Modal/AsDrawer.tsx",
      title: "As a drawer",
      description:
        "The same component anchored to the edge. It is a prop, not another component: focus trapping, Escape and the backdrop behave identically.",
    },
    {
      id: "composition",
      render: Composition,
      source: "Modal/Composition.tsx",
      title: "With a form and a footer",
      description:
        "The footer is a slot, so the actions sit outside the scrolling area and stay visible on a long form.",
    },
  ],
};
