import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { breakpoints } from "@stellaria/nebula-tokens";

import { vars } from "../../theme/contract.css.js";

const CONDITIONS = {
  base: {},
  phone: { "@media": `screen and (min-width: ${String(breakpoints.phone)}px)` },
  tablet: { "@media": `screen and (min-width: ${String(breakpoints.tablet)}px)` },
  laptop: { "@media": `screen and (min-width: ${String(breakpoints.laptop)}px)` },
  desktop: { "@media": `screen and (min-width: ${String(breakpoints.desktop)}px)` },
  wide: { "@media": `screen and (min-width: ${String(breakpoints.wide)}px)` },
} as const;

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

const LAYOUT_SPACE = {
  none: vars.space.none,
  xxs: vars.space.xxs,
  xs: vars.space.xs,
  sm: vars.space.sm,
  md: vars.space.md,
  lg: vars.space.lg,
  xl: vars.space.xl,
  xxl: vars.space.xxl,
  xxxl: vars.space.xxxl,
};

const RESPONSIVE = defineProperties({
  conditions: CONDITIONS,
  defaultCondition: "base",
  properties: {
    display: ["none", "flex", "block", "inline", "inline-flex", "inline-block", "grid"],
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
    textAlign: ["left", "center", "right", "justify"],
    fontSize: vars.font.size,
    padding: LAYOUT_SPACE,
    paddingInline: LAYOUT_SPACE,
    paddingBlock: LAYOUT_SPACE,
    paddingTop: LAYOUT_SPACE,
    paddingBottom: LAYOUT_SPACE,
    paddingLeft: LAYOUT_SPACE,
    paddingRight: LAYOUT_SPACE,
    margin: LAYOUT_SPACE,
    marginInline: LAYOUT_SPACE,
    marginBlock: LAYOUT_SPACE,
    marginTop: LAYOUT_SPACE,
    marginBottom: LAYOUT_SPACE,
    marginLeft: LAYOUT_SPACE,
    marginRight: LAYOUT_SPACE,
    gap: LAYOUT_SPACE,
    columnGap: LAYOUT_SPACE,
    rowGap: LAYOUT_SPACE,
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
    direction: ["flexDirection"],
    wrap: ["flexWrap"],
    align: ["alignItems"],
    justify: ["justifyContent"],
    self: ["alignSelf"],
    ta: ["textAlign"],
    fz: ["fontSize"],
  },
});

const UNRESPONSIVE = defineProperties({
  properties: {
    position: ["relative", "absolute", "fixed", "sticky", "static"],
    overflow: ["visible", "hidden", "scroll", "auto"],
    overflowX: ["visible", "hidden", "scroll", "auto"],
    overflowY: ["visible", "hidden", "scroll", "auto"],
    textTransform: ["none", "uppercase", "lowercase", "capitalize"],
    textDecoration: ["none", "underline", "line-through"],
    whiteSpace: ["normal", "nowrap", "pre", "pre-wrap", "pre-line"],
    fontFamily: vars.font.family,
    fontWeight: vars.font.weight,
    lineHeight: vars.font.lineHeight,
    letterSpacing: vars.font.letterSpacing,
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
    tt: ["textTransform"],
    td: ["textDecoration"],
    ws: ["whiteSpace"],
    ff: ["fontFamily"],
    fw: ["fontWeight"],
    lh: ["lineHeight"],
    ls: ["letterSpacing"],
  },
});

export const sprinkles = createSprinkles(RESPONSIVE, UNRESPONSIVE);
export type Sprinkles = Parameters<typeof sprinkles>[0];
