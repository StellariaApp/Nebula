import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { vars } from "../../theme/contract.css.js";

type Shade = keyof typeof vars.color.primary;

function ScaleEntries<P extends string>(
  prefix: P,
  scale: Record<Shade, string>,
): { [K in `${P}.${Shade}`]: string } {
  const out = {} as { [K in `${P}.${Shade}`]: string };
  for (const shade of Object.keys(scale) as Shade[]) {
    out[`${prefix}.${shade}`] = scale[shade];
  }
  return out;
}

function RoleEntries<P extends string, K extends string>(
  prefix: P,
  roles: Record<K, string>,
): { [R in `${P}.${K}`]: string } {
  const out = {} as { [R in `${P}.${K}`]: string };
  for (const role of Object.keys(roles) as K[]) {
    out[`${prefix}.${role}`] = roles[role];
  }
  return out;
}

const ROLE_COLORS = {
  transparent: "transparent",
  currentColor: "currentColor",
  inherit: "inherit",
  ...RoleEntries("surface", vars.color.surface),
  ...RoleEntries("text", vars.color.text),
  ...RoleEntries("border", vars.color.border),
};

const PALETTE_COLORS = {
  ...ROLE_COLORS,
  ...ScaleEntries("primary", vars.color.primary),
  ...ScaleEntries("accent", vars.color.accent),
  ...ScaleEntries("gray", vars.color.gray),
  ...ScaleEntries("success", vars.color.semantic.success),
  ...ScaleEntries("warning", vars.color.semantic.warning),
  ...ScaleEntries("error", vars.color.semantic.error),
  ...ScaleEntries("info", vars.color.semantic.info),
};

const UNRESPONSIVE = defineProperties({
  properties: {
    display: ["none", "flex", "block", "inline", "inline-flex", "inline-block", "grid"],
    position: ["relative", "absolute", "fixed", "sticky", "static"],
    flexDirection: ["row", "column", "row-reverse", "column-reverse"],
    flexWrap: ["nowrap", "wrap", "wrap-reverse"],
    alignItems: ["flex-start", "flex-end", "center", "stretch", "baseline"],
    alignSelf: ["auto", "flex-start", "flex-end", "center", "stretch", "baseline"],
    justifyContent: [
      "flex-start",
      "flex-end",
      "center",
      "space-between",
      "space-around",
      "space-evenly",
    ],
    overflow: ["visible", "hidden", "scroll", "auto"],
    overflowX: ["visible", "hidden", "scroll", "auto"],
    overflowY: ["visible", "hidden", "scroll", "auto"],
    textAlign: ["left", "center", "right", "justify"],
    textTransform: ["none", "uppercase", "lowercase", "capitalize"],
    textDecoration: ["none", "underline", "line-through"],
    whiteSpace: ["normal", "nowrap", "pre", "pre-wrap", "pre-line"],
    fontFamily: vars.font.family,
    fontSize: vars.font.size,
    fontWeight: vars.font.weight,
    lineHeight: vars.font.lineHeight,
    letterSpacing: vars.font.letterSpacing,
    padding: vars.space,
    paddingInline: vars.space,
    paddingBlock: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    margin: vars.space,
    marginInline: vars.space,
    marginBlock: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    gap: vars.space,
    columnGap: vars.space,
    rowGap: vars.space,
    borderRadius: vars.radius,
    borderTopLeftRadius: vars.radius,
    borderTopRightRadius: vars.radius,
    borderBottomLeftRadius: vars.radius,
    borderBottomRightRadius: vars.radius,
    color: PALETTE_COLORS,
    background: PALETTE_COLORS,
    borderColor: ROLE_COLORS,
    boxShadow: vars.shadow,
    zIndex: vars.zIndex,
  },
  shorthands: {
    p: ["padding"],
    px: ["paddingInline"],
    py: ["paddingBlock"],
    pt: ["paddingTop"],
    pb: ["paddingBottom"],
    pl: ["paddingLeft"],
    pr: ["paddingRight"],
    m: ["margin"],
    mx: ["marginInline"],
    my: ["marginBlock"],
    mt: ["marginTop"],
    mb: ["marginBottom"],
    ml: ["marginLeft"],
    mr: ["marginRight"],
    gapx: ["columnGap"],
    gapy: ["rowGap"],
    r: ["borderRadius"],
    rt: ["borderTopLeftRadius", "borderTopRightRadius"],
    rb: ["borderBottomLeftRadius", "borderBottomRightRadius"],
    rl: ["borderTopLeftRadius", "borderBottomLeftRadius"],
    rr: ["borderTopRightRadius", "borderBottomRightRadius"],
    c: ["color"],
    bg: ["background"],
    bdc: ["borderColor"],
    shadow: ["boxShadow"],
    z: ["zIndex"],
    direction: ["flexDirection"],
    wrap: ["flexWrap"],
    align: ["alignItems"],
    justify: ["justifyContent"],
    self: ["alignSelf"],
    ta: ["textAlign"],
    tt: ["textTransform"],
    td: ["textDecoration"],
    ws: ["whiteSpace"],
    ff: ["fontFamily"],
    fz: ["fontSize"],
    fw: ["fontWeight"],
    lh: ["lineHeight"],
    ls: ["letterSpacing"],
  },
});

export const sprinkles = createSprinkles(UNRESPONSIVE);
export type Sprinkles = Parameters<typeof sprinkles>[0];
