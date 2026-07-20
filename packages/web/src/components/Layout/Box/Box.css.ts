/**
 * Sprinkles de Box — capa visual del primitivo (equivalente web del Collector de
 * native). Genera clases atómicas cuyos valores son `var(...)` del contrato, así
 * que el cambio de tema las repinta sin recomputar nada en JS.
 *
 * Solo tokens: los valores libres (`w="240px"`) los aplica el componente como
 * style inline (ver Box.tsx). Las paletas crudas NO se exponen — los componentes
 * leen roles semánticos y escalas semánticas (guardrail de docs/02 §2.1).
 */
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { vars } from "../../../theme/contract.css.js";

type Shade = keyof typeof vars.color.primary;

/** `{ "primary.600": "var(--…)" , … }` con las keys tipadas como literales. */
function scaleEntries<P extends string>(
  prefix: P,
  scale: Record<Shade, string>,
): { [K in `${P}.${Shade}`]: string } {
  const out = {} as { [K in `${P}.${Shade}`]: string };
  for (const shade of Object.keys(scale) as Shade[]) {
    out[`${prefix}.${shade}`] = scale[shade];
  }
  return out;
}

function roleEntries<P extends string, K extends string>(
  prefix: P,
  roles: Record<K, string>,
): { [R in `${P}.${K}`]: string } {
  const out = {} as { [R in `${P}.${K}`]: string };
  for (const role of Object.keys(roles) as K[]) {
    out[`${prefix}.${role}`] = roles[role];
  }
  return out;
}

/** Roles semánticos: el set que cubre la mayoría de usos (y el único permitido en bordes). */
const roleColors = {
  transparent: "transparent",
  currentColor: "currentColor",
  inherit: "inherit",
  ...roleEntries("surface", vars.color.surface),
  ...roleEntries("text", vars.color.text),
  ...roleEntries("border", vars.color.border),
};

/**
 * Roles + escalas semánticas, para `c`/`bg`. Las paletas crudas NO se exponen
 * (docs/02 §2.1). Cada entrada añade una clase atómica por propiedad, así que el
 * set se mantiene acotado: `bdc` usa solo roles para no triplicar el CSS.
 */
const paletteColors = {
  ...roleColors,
  ...scaleEntries("primary", vars.color.primary),
  ...scaleEntries("accent", vars.color.accent),
  ...scaleEntries("gray", vars.color.gray),
  ...scaleEntries("success", vars.color.semantic.success),
  ...scaleEntries("warning", vars.color.semantic.warning),
  ...scaleEntries("error", vars.color.semantic.error),
  ...scaleEntries("info", vars.color.semantic.info),
};

const unresponsive = defineProperties({
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
    color: paletteColors,
    background: paletteColors,
    borderColor: roleColors,
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

export const sprinkles = createSprinkles(unresponsive);
export type Sprinkles = Parameters<typeof sprinkles>[0];
