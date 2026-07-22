import { globalStyle, style } from "@vanilla-extract/css";

export const group = style({
  display: "inline-flex",
});

export const horizontal = style({ flexDirection: "row" });
export const vertical = style({ flexDirection: "column" });

globalStyle(`${horizontal} > *:not(:last-child)`, {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});
globalStyle(`${horizontal} > *:not(:first-child)`, {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  marginInlineStart: "-1px",
});

globalStyle(`${vertical} > *:not(:last-child)`, {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});
globalStyle(`${vertical} > *:not(:first-child)`, {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  marginBlockStart: "-1px",
});
