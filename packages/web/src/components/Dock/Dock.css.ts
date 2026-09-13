import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import { composite_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

const BELOW = ["phone", "tablet", "laptop", "desktop"] as const;

export const row = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.space.sm,
      paddingInline: vars.space.md,
      paddingBlock: vars.space.sm,
    },
  },
});

export const row_folds = styleVariants(
  Object.fromEntries(
    BELOW.map((name) => [
      name,
      {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan(name)]: { display: "none" } } } },
      },
    ]),
  ) as Record<(typeof BELOW)[number], object>,
);

export const compact = style({
  "@layer": {
    [composite_layer]: {
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      padding: vars.space.xxs,
    },
  },
});

export const compact_shows = styleVariants(
  Object.fromEntries(
    BELOW.map((name) => [
      name,
      {
        "@layer": { [composite_layer]: { "@media": { [SmallerThan(name)]: { display: "flex" } } } },
      },
    ]),
  ) as Record<(typeof BELOW)[number], object>,
);

export const stack = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: vars.space.md,
      width: "100%",
    },
  },
});
