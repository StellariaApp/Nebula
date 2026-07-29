import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const wrapper = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: vars.space.xs,
      flex: 1,
      minWidth: 0,
      paddingBlock: vars.space.xxs,
    },
  },
});

export const tag = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.xxs,
      maxWidth: "100%",
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xxs,
      borderRadius: vars.radius.full,
      background: vars.color.primary["100"],
      color: vars.color.primary["900"],
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.tight,
      selectors: {
        "&[data-disabled='true']": {
          background: vars.color.surface.disabled,
          color: vars.color.text.disabled,
        },
      },
    },
  },
});

export const tagLabel = style({
  "@layer": {
    [baseLayer]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const remove = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      appearance: "none",
      border: "none",
      background: "transparent",
      color: "inherit",
      padding: 0,
      width: "1.1em",
      height: "1.1em",
      borderRadius: vars.radius.full,
      cursor: "pointer",
      outline: "none",
      lineHeight: 0,
      ...motion.interaction,
      ...motion.reducedMotion,
      selectors: {
        "&:hover:not(:disabled)": { background: vars.color.primary["200"] },
        "&[data-focus-visible='true']": focus.ring,
        "&:disabled": { cursor: "not-allowed" },
      },
    },
  },
});

export const input = style({
  "@layer": {
    [baseLayer]: {
      flex: "1 1 6ch",
      minWidth: "6ch",
    },
  },
});
