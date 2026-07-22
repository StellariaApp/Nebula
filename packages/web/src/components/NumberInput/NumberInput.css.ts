import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const numberInput = style({
  "@layer": {
    [baseLayer]: {
      MozAppearance: "textfield",
      selectors: {
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
      },
    },
  },
});

export const stepper = style({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  alignSelf: "stretch",
  justifyContent: "center",
  borderInlineStartWidth: "1px",
  borderInlineStartStyle: "solid",
  borderInlineStartColor: vars.color.border.subtle,
  marginInlineEnd: `calc(-1 * ${vars.space.xs})`,
});

export const stepperButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: "50%",
  minWidth: "1.6em",
  paddingInline: vars.space.xs,
  color: vars.color.text.muted,
  fontSize: "0.55em",
  lineHeight: 1,
});
