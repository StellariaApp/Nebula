import type { CSSProperties } from "react";

export type TokenScale =
  | "space"
  | "radius"
  | "color"
  | "role"
  | "fontSize"
  | "fontFamily"
  | "fontWeight"
  | "lineHeight"
  | "letterSpacing"
  | "shadow"
  | "zIndex";

export interface PropSpec {
  css: readonly (keyof CSSProperties)[];
  token?: TokenScale | undefined;
  keywords?: readonly string[] | undefined;
  open?: boolean | undefined;
  bool?: boolean | undefined;
  length?: boolean | undefined;
}

const DISPLAY = [
  "none",
  "flex",
  "block",
  "inline",
  "inline-flex",
  "inline-block",
  "grid",
  "inline-grid",
  "contents",
] as const;
const POSITION = ["relative", "absolute", "fixed", "sticky", "static"] as const;
const OVERFLOW = ["visible", "hidden", "scroll", "auto", "clip"] as const;
const DIRECTION = ["row", "column", "row-reverse", "column-reverse"] as const;
const WRAP = ["nowrap", "wrap", "wrap-reverse"] as const;
const ALIGN = ["flex-start", "flex-end", "center", "stretch", "baseline"] as const;
const SELF = ["auto", "flex-start", "flex-end", "center", "stretch", "baseline"] as const;
const JUSTIFY = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
] as const;
const CONTENT = [
  "flex-start",
  "flex-end",
  "center",
  "stretch",
  "space-between",
  "space-around",
  "space-evenly",
] as const;
const ITEMS = ["start", "end", "center", "stretch"] as const;
const TEXT_ALIGN = ["left", "center", "right", "justify", "start", "end"] as const;
const TEXT_TRANSFORM = ["none", "uppercase", "lowercase", "capitalize"] as const;
const TEXT_DECORATION = ["none", "underline", "line-through"] as const;
const WHITE_SPACE = ["normal", "nowrap", "pre", "pre-wrap", "pre-line"] as const;
const FONT_STYLE = ["normal", "italic", "oblique"] as const;
const BORDER_STYLE = ["none", "solid", "dashed", "dotted", "double", "hidden"] as const;
const OBJECT_FIT = ["contain", "cover", "fill", "none", "scale-down"] as const;
const CURSOR = [
  "auto",
  "default",
  "pointer",
  "text",
  "move",
  "grab",
  "grabbing",
  "not-allowed",
  "wait",
  "help",
  "crosshair",
  "zoom-in",
  "zoom-out",
] as const;
const POINTER_EVENTS = ["auto", "none"] as const;
const USER_SELECT = ["auto", "none", "text", "all"] as const;
const VISIBILITY = ["visible", "hidden", "collapse"] as const;
const VERTICAL_ALIGN = ["baseline", "top", "middle", "bottom", "sub", "super"] as const;
const AUTO_FLOW = ["row", "column", "dense", "row dense", "column dense"] as const;

type Css = keyof CSSProperties;

const space = (...css: Css[]) => ({ css, token: "space", open: true, length: true }) as const;
const radius = (...css: Css[]) => ({ css, token: "radius", open: true, length: true }) as const;
const palette = (...css: Css[]) => ({ css, token: "color", open: true }) as const;
const role = (...css: Css[]) => ({ css, token: "role", open: true }) as const;
const length = (...css: Css[]) => ({ css, open: true, length: true }) as const;
const raw = (...css: Css[]) => ({ css, open: true }) as const;

const keywords = <const T extends readonly string[]>(css: Css, list: T) =>
  ({ css: [css], keywords: list }) as const;

const scale = <const S extends TokenScale>(css: Css, token: S, is_length = false) =>
  ({ css: [css], token, open: true, length: is_length }) as const;

export const STYLE_PROPS = {
  p: space("padding"),
  px: space("paddingInline"),
  py: space("paddingBlock"),
  pt: space("paddingTop"),
  pb: space("paddingBottom"),
  pl: space("paddingLeft"),
  pr: space("paddingRight"),
  ps: space("paddingInlineStart"),
  pe: space("paddingInlineEnd"),

  m: space("margin"),
  mx: space("marginInline"),
  my: space("marginBlock"),
  mt: space("marginTop"),
  mb: space("marginBottom"),
  ml: space("marginLeft"),
  mr: space("marginRight"),
  ms: space("marginInlineStart"),
  me: space("marginInlineEnd"),

  gap: space("gap"),
  gapx: space("columnGap"),
  gapy: space("rowGap"),

  r: radius("borderRadius"),
  rt: radius("borderTopLeftRadius", "borderTopRightRadius"),
  rb: radius("borderBottomLeftRadius", "borderBottomRightRadius"),
  rl: radius("borderTopLeftRadius", "borderBottomLeftRadius"),
  rr: radius("borderTopRightRadius", "borderBottomRightRadius"),
  rtl: radius("borderTopLeftRadius"),
  rtr: radius("borderTopRightRadius"),
  rbl: radius("borderBottomLeftRadius"),
  rbr: radius("borderBottomRightRadius"),

  c: palette("color"),
  bg: palette("background"),

  bd: raw("border"),
  bdw: length("borderWidth"),
  bds: keywords("borderStyle", BORDER_STYLE),
  bdc: role("borderColor"),

  bdt: raw("borderTop"),
  bdb: raw("borderBottom"),
  bdl: raw("borderLeft"),
  bdr: raw("borderRight"),

  bdtw: length("borderTopWidth"),
  bdts: keywords("borderTopStyle", BORDER_STYLE),
  bdtc: role("borderTopColor"),
  bdbw: length("borderBottomWidth"),
  bdbs: keywords("borderBottomStyle", BORDER_STYLE),
  bdbc: role("borderBottomColor"),
  bdlw: length("borderLeftWidth"),
  bdls: keywords("borderLeftStyle", BORDER_STYLE),
  bdlc: role("borderLeftColor"),
  bdrw: length("borderRightWidth"),
  bdrs: keywords("borderRightStyle", BORDER_STYLE),
  bdrc: role("borderRightColor"),

  borderInlineStart: raw("borderInlineStart"),
  borderInlineEnd: raw("borderInlineEnd"),
  borderBlockStart: raw("borderBlockStart"),
  borderBlockEnd: raw("borderBlockEnd"),
  borderInlineStartWidth: length("borderInlineStartWidth"),
  borderInlineEndWidth: length("borderInlineEndWidth"),
  borderBlockStartWidth: length("borderBlockStartWidth"),
  borderBlockEndWidth: length("borderBlockEndWidth"),
  borderInlineStartStyle: keywords("borderInlineStartStyle", BORDER_STYLE),
  borderInlineEndStyle: keywords("borderInlineEndStyle", BORDER_STYLE),
  borderBlockStartStyle: keywords("borderBlockStartStyle", BORDER_STYLE),
  borderBlockEndStyle: keywords("borderBlockEndStyle", BORDER_STYLE),
  borderInlineStartColor: role("borderInlineStartColor"),
  borderInlineEndColor: role("borderInlineEndColor"),
  borderBlockStartColor: role("borderBlockStartColor"),
  borderBlockEndColor: role("borderBlockEndColor"),

  fz: scale("fontSize", "fontSize", true),
  ff: scale("fontFamily", "fontFamily"),
  fw: scale("fontWeight", "fontWeight"),
  lh: scale("lineHeight", "lineHeight"),
  ls: scale("letterSpacing", "letterSpacing", true),
  fs: keywords("fontStyle", FONT_STYLE),
  ta: keywords("textAlign", TEXT_ALIGN),
  tt: keywords("textTransform", TEXT_TRANSFORM),
  td: keywords("textDecoration", TEXT_DECORATION),
  ws: keywords("whiteSpace", WHITE_SPACE),
  verticalAlign: keywords("verticalAlign", VERTICAL_ALIGN),

  display: keywords("display", DISPLAY),
  position: keywords("position", POSITION),
  overflow: keywords("overflow", OVERFLOW),
  overflowX: keywords("overflowX", OVERFLOW),
  overflowY: keywords("overflowY", OVERFLOW),
  visibility: keywords("visibility", VISIBILITY),

  direction: keywords("flexDirection", DIRECTION),
  wrap: keywords("flexWrap", WRAP),
  align: keywords("alignItems", ALIGN),
  justify: keywords("justifyContent", JUSTIFY),
  self: keywords("alignSelf", SELF),
  alignContent: keywords("alignContent", CONTENT),
  justifyItems: keywords("justifyItems", ITEMS),
  justifySelf: keywords("justifySelf", ITEMS),
  placeItems: keywords("placeItems", ITEMS),

  flex: raw("flex"),
  grow: { css: ["flexGrow"], open: true, bool: true },
  shrink: { css: ["flexShrink"], open: true, bool: true },
  basis: length("flexBasis"),
  order: raw("order"),

  gridColumn: raw("gridColumn"),
  gridRow: raw("gridRow"),
  gridArea: raw("gridArea"),
  gridTemplateColumns: raw("gridTemplateColumns"),
  gridTemplateRows: raw("gridTemplateRows"),
  gridAutoFlow: keywords("gridAutoFlow", AUTO_FLOW),

  size: length("width", "height"),
  w: length("width"),
  h: length("height"),
  miw: length("minWidth"),
  maw: length("maxWidth"),
  mih: length("minHeight"),
  mah: length("maxHeight"),
  aspectRatio: raw("aspectRatio"),
  objectFit: keywords("objectFit", OBJECT_FIT),
  objectPosition: raw("objectPosition"),

  top: length("top"),
  right: length("right"),
  bottom: length("bottom"),
  left: length("left"),
  inset: length("inset"),
  insetInline: length("insetInline"),
  insetBlock: length("insetBlock"),

  shadow: scale("boxShadow", "shadow"),
  z: scale("zIndex", "zIndex"),
  opacity: raw("opacity"),
  cursor: keywords("cursor", CURSOR),
  pointerEvents: keywords("pointerEvents", POINTER_EVENTS),
  userSelect: keywords("userSelect", USER_SELECT),
} as const satisfies Record<string, PropSpec>;

export type StylePropName = keyof typeof STYLE_PROPS;

export function OpenVarName(prop: string, level: string): string {
  return level === "base" ? `--nb-${prop}` : `--nb-${prop}-${level}`;
}
