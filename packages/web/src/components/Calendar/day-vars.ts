import type { CSSProperties } from "react";

import type { ColorExtended, NebulaTheme } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";

import type { CalendarVariant } from "./Calendar.types.js";
import * as variables from "./Calendar.vars.css.js";

export function CalendarDayVars(
  variant: CalendarVariant,
  color: ColorExtended,
  theme: NebulaTheme,
): CSSProperties {
  const resolved = ResolveVariant(variant, color, theme);
  return assignInlineVars({
    [variables.dayBg]: resolved.background,
    [variables.dayBgHover]: resolved.backgroundHover,
    [variables.dayFg]: resolved.foreground,
    [variables.dayBorder]: resolved.borderColor,
    [variables.rangeBg]: `color-mix(in srgb, ${resolved.background} 16%, transparent)`,
  });
}
