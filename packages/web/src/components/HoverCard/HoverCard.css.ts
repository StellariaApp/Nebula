import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

export const card = style({
  "@layer": {
    [primitive_layer]: {
      boxSizing: "border-box",
      padding: vars.space.md,
      borderRadius: vars.radius.md,
      background: vars.color.surface.overlay,
      border: `1px solid ${vars.color.border.default}`,
      boxShadow: vars.shadow.md,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body3,
      color: vars.color.text.primary,
      maxWidth: "min(90vw, 360px)",
    },
  },
});
