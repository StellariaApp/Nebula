import { globalStyle, style } from "@vanilla-extract/css";

import { groupCount, groupGap } from "./Group.vars.css.js";

export const group = style({
  display: "flex",
  flexDirection: "row",
  gap: groupGap,
});

export const wrapOn = style({ flexWrap: "wrap" });
export const wrapOff = style({ flexWrap: "nowrap" });

globalStyle(`${group}[data-grow="true"] > *`, {
  flexGrow: 1,
  flexBasis: 0,
});

globalStyle(`${group}[data-grow="true"][data-prevent-overflow="true"] > *`, {
  maxWidth: `calc((100% - (${groupCount} - 1) * ${groupGap}) / ${groupCount})`,
});
