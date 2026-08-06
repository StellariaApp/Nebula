import type { StyleProps } from "../utils/style-props.js";
import type { STYLE_PROPS } from "../utils/style-registry.js";

type Expect<T extends true> = T;
type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Has<K extends string> = K extends keyof StyleProps ? true : false;
type Accepts<K extends keyof StyleProps, V> = V extends StyleProps[K] ? true : false;

export type CheckKeywordsStayLiteral = Expect<
  Eq<
    (typeof STYLE_PROPS)["display"]["keywords"][number],
    | "none"
    | "flex"
    | "block"
    | "inline"
    | "inline-flex"
    | "inline-block"
    | "grid"
    | "inline-grid"
    | "contents"
  >
>;

export type CheckKeywordsAreNotWidened = Expect<
  Eq<Eq<(typeof STYLE_PROPS)["display"]["keywords"][number], string>, false>
>;

export type CheckTokenStaysLiteral = Expect<Eq<(typeof STYLE_PROPS)["fz"]["token"], "fontSize">>;

export type CheckShorthandExists = Expect<Has<"p">>;
export type CheckLongAliasIsGone = Expect<Eq<Has<"padding">, false>>;
export type CheckColorAliasIsGone = Expect<Eq<Has<"color">, false>>;
export type CheckBackgroundAliasIsGone = Expect<Eq<Has<"background">, false>>;

export type CheckNewBorderProp = Expect<Has<"bd">>;
export type CheckLogicalBorderKeepsCssName = Expect<Has<"borderBlockStartStyle">>;
export type CheckLooseCornerExists = Expect<Has<"rtl">>;
export type CheckGridPropExists = Expect<Has<"gridTemplateColumns">>;

export type CheckTokenValue = Expect<Accepts<"p", "md">>;
export type CheckOpenNumber = Expect<Accepts<"p", 10>>;
export type CheckOpenString = Expect<Accepts<"p", "1.5rem">>;
export type CheckResponsive = Expect<Accepts<"p", { base: "md"; tablet: 24 }>>;
export type CheckKeywordProp = Expect<Accepts<"position", "sticky">>;
export type CheckKeywordResponsive = Expect<Accepts<"position", { base: "static" }>>;
export type CheckKeywordRejectsUnknown = Expect<Eq<Accepts<"position", "floaty">, false>>;
export type CheckBooleanGrow = Expect<Accepts<"grow", true>>;
