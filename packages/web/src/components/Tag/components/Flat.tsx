"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { TagProps } from "../Tag.types.js";
import * as variables from "../Tag.vars.css.js";
import { TagBody } from "./Body.js";

export function TagFlat(props: TagProps): ReactElement {
  const { variant = "light", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);

  return (
    <TagBody
      {...rest}
      variant={variant}
      toneStyle={assignInlineVars({
        [variables.bg]: refs?.background ?? resolved.background,
        [variables.fg]: refs?.foreground ?? resolved.foreground,
        [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
      })}
    />
  );
}

TagFlat.displayName = "Tag.Flat";
