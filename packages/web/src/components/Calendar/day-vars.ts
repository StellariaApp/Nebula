import type { CSSProperties } from "react";

import type { ColorExtended, NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { CalendarVariant } from "./Calendar.types.js";
import * as variables from "./Calendar.vars.css.js";

export function CalendarDayVars(
  variant: CalendarVariant,
  color: ColorExtended,
  theme: NebulaTheme,
): CSSProperties {
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);
  return assignInlineVars({
    [variables.dayBg]: refs?.background ?? resolved.background,
    [variables.dayBgHover]: refs?.backgroundHover ?? resolved.backgroundHover,
    [variables.dayFg]: refs?.foreground ?? resolved.foreground,
    [variables.dayBorder]: refs?.borderColor ?? resolved.borderColor,
    [variables.rangeBg]: `color-mix(in srgb, ${refs?.background ?? resolved.background} 16%, transparent)`,
  });
}
