import type { DemoFamily } from "../types.js";

import Colors from "./Colors.js";
import Composition from "./Composition.js";
import FullWidth from "./FullWidth.js";
import Sizes from "./Sizes.js";
import States from "./States.js";
import Variants from "./Variants.js";
import WithSections from "./WithSections.js";

export const button: DemoFamily = {
  component: "Button",
  demos: [
    {
      id: "variants",
      render: Variants,
      source: "Button/Variants.tsx",
      title: "Variants",
      description:
        "The eight recipes of the theme's variantMap. What each one paints is decided by the theme, not by the component: switch themes and the same variant resolves differently without touching a prop.",
    },
    {
      id: "sizes",
      render: Sizes,
      source: "Button/Sizes.tsx",
      title: "Sizes",
      description: "Heights come from the active theme's control scale, anchored at md.",
    },
    {
      id: "colors",
      render: Colors,
      source: "Button/Colors.tsx",
      title: "Colors",
      description:
        "Semantic scales, not raw hex. Every one of them is a key of the theme, so a product can retune all of them at once.",
    },
    {
      id: "states",
      render: States,
      source: "Button/States.tsx",
      title: "States",
      description:
        "Disabled and loading. While loading the label dims to make room for the spinner without the button changing size.",
    },
    {
      id: "with-sections",
      render: WithSections,
      source: "Button/WithSections.tsx",
      title: "With icons",
      description:
        "leftSection and rightSection take any node. Nebula does not ship an icon set: bring your own.",
    },
    {
      id: "full-width",
      render: FullWidth,
      source: "Button/FullWidth.tsx",
      title: "Full width",
      description: "Fills its container, which is what a form footer or a narrow column needs.",
    },
    {
      id: "composition",
      render: Composition,
      source: "Button/Composition.tsx",
      title: "One primary action per region",
      description:
        "Hierarchy comes from the variant, never from the size. A smaller button is not a secondary button.",
    },
  ],
};
