"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "@stellaria/nebula-themes/web";

import type { TagProps } from "../Tag.types.js";
import * as variables from "../Tag.vars.css.js";
import { TagBody } from "./Body.js";

export function TagFlat(props: TagProps): ReactElement {
  const { variant = "light", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  return (
    <TagBody
      {...rest}
      variant={variant}
      toneStyle={assignInlineVars({
        [variables.bg]: resolved.background,
        [variables.fg]: resolved.foreground,
        [variables.borderColor]: resolved.borderColor,
      })}
    />
  );
}

TagFlat.displayName = "Tag.Flat";
