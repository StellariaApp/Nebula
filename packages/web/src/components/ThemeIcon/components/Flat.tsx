"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { ThemeIconProps } from "../ThemeIcon.types.js";
import * as variables from "../ThemeIcon.vars.css.js";
import { ThemeIconBody } from "./Body.js";

export function ThemeIconFlat(props: ThemeIconProps): ReactElement {
  const { variant = "light", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);

  return (
    <ThemeIconBody
      {...rest}
      variant={variant}
      toneStyle={assignInlineVars({
        [variables.bg]: refs?.background ?? resolved.background,
        [variables.fg]: refs?.foreground ?? resolved.foreground,
        [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
        [variables.borderWidth]: refs?.borderWidth ?? resolved.borderWidth,
      })}
    />
  );
}

ThemeIconFlat.displayName = "ThemeIcon.Flat";
