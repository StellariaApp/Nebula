import type { DemoFamily } from "../types";

import Basic from "./Basic";

export const searchInput: DemoFamily = {
  component: "SearchInput",
  demos: [
    {
      id: "basic",
      render: Basic,
      source: "SearchInput/Basic.tsx",
      title: "Search field",
      description:
        'A type="search" input with the clear affordance the role implies, so the browser and assistive tech treat it as a search box.',
    },
  ],
};
