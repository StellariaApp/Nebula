import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

export const typography = style({
  "@layer": {
    [base_layer]: {
      color: vars.color.text.primary,
      fontSize: vars.font.size.body2,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

const HEADING = {
  margin: 0,
  marginBlockStart: vars.space.lg,
  marginBlockEnd: vars.space.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.text.primary,
} as const;

const Layered = (rules: Record<string, unknown>): Record<string, unknown> => ({
  "@layer": { [base_layer]: rules },
});

globalStyle(`${typography} > :first-child`, Layered({ marginBlockStart: 0 }));
globalStyle(`${typography} > :last-child`, Layered({ marginBlockEnd: 0 }));

globalStyle(`${typography} h1`, Layered({ ...HEADING, fontSize: vars.font.size.h1 }));
globalStyle(`${typography} h2`, Layered({ ...HEADING, fontSize: vars.font.size.h2 }));
globalStyle(`${typography} h3`, Layered({ ...HEADING, fontSize: vars.font.size.h3 }));
globalStyle(`${typography} h4`, Layered({ ...HEADING, fontSize: vars.font.size.h4 }));
globalStyle(`${typography} h5`, Layered({ ...HEADING, fontSize: vars.font.size.h5 }));
globalStyle(`${typography} h6`, Layered({ ...HEADING, fontSize: vars.font.size.h6 }));

globalStyle(`${typography} p`, Layered({ margin: 0, marginBlockEnd: vars.space.sm }));
globalStyle(
  `${typography} strong, ${typography} b`,
  Layered({ fontWeight: vars.font.weight.semibold }),
);
globalStyle(
  `${typography} small`,
  Layered({ fontSize: vars.font.size.caption, color: vars.color.text.muted }),
);

globalStyle(
  `${typography} a`,
  Layered({ color: vars.color.primary["600"], textDecoration: "underline" }),
);
globalStyle(`${typography} a:hover`, Layered({ color: vars.color.primary["700"] }));

globalStyle(
  `${typography} ul, ${typography} ol`,
  Layered({ margin: 0, marginBlockEnd: vars.space.sm, paddingInlineStart: vars.space.lg }),
);
globalStyle(`${typography} li`, Layered({ marginBlockEnd: vars.space.xxs }));
globalStyle(
  `${typography} li > ul, ${typography} li > ol`,
  Layered({ marginBlockStart: vars.space.xxs, marginBlockEnd: 0 }),
);

globalStyle(
  `${typography} blockquote`,
  Layered({
    margin: 0,
    marginBlockEnd: vars.space.sm,
    paddingInlineStart: vars.space.md,
    borderInlineStart: `3px solid ${vars.color.border.strong}`,
    color: vars.color.text.secondary,
    fontStyle: "italic",
  }),
);

globalStyle(
  `${typography} hr`,
  Layered({
    marginBlock: vars.space.lg,
    border: "none",
    borderTop: `1px solid ${vars.color.border.subtle}`,
  }),
);

globalStyle(
  `${typography} code`,
  Layered({
    padding: "0.15em 0.35em",
    borderRadius: vars.radius.xs,
    background: vars.color.surface.sunken,
    fontFamily: vars.font.family.mono,
    fontSize: "0.9em",
  }),
);
globalStyle(
  `${typography} pre`,
  Layered({
    margin: 0,
    marginBlockEnd: vars.space.sm,
    padding: vars.space.sm,
    borderRadius: vars.radius.md,
    background: vars.color.surface.sunken,
    fontFamily: vars.font.family.mono,
    fontSize: vars.font.size.body3,
    overflowX: "auto",
    direction: "ltr",
    textAlign: "left",
  }),
);
globalStyle(`${typography} pre code`, Layered({ padding: 0, background: "transparent" }));

globalStyle(
  `${typography} img, ${typography} video`,
  Layered({ maxWidth: "100%", height: "auto", borderRadius: vars.radius.md }),
);
globalStyle(`${typography} figure`, Layered({ margin: 0, marginBlockEnd: vars.space.sm }));
globalStyle(
  `${typography} figcaption`,
  Layered({
    marginBlockStart: vars.space.xxs,
    fontSize: vars.font.size.caption,
    color: vars.color.text.muted,
    textAlign: "center",
  }),
);

globalStyle(
  `${typography} table`,
  Layered({
    width: "100%",
    marginBlockEnd: vars.space.sm,
    borderCollapse: "collapse",
    fontSize: vars.font.size.body3,
  }),
);
globalStyle(
  `${typography} th, ${typography} td`,
  Layered({
    padding: `${vars.space.xs} ${vars.space.sm}`,
    borderBottom: `1px solid ${vars.color.border.subtle}`,
    textAlign: "start",
  }),
);
globalStyle(
  `${typography} th`,
  Layered({ fontWeight: vars.font.weight.semibold, color: vars.color.text.secondary }),
);
