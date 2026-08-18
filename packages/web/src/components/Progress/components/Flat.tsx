"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { ProgressProps } from "../Progress.types.js";
import * as variables from "../Progress.vars.css.js";
import { ProgressBody } from "./Body.js";

export function ProgressFlat(props: ProgressProps): ReactElement {
  const { variant, color = "primary" } = props;
  const { theme } = useTheme();

  if (variant === undefined) return <ProgressBody {...props} />;

  const resolved = ResolveVariant(variant, color, theme);

  const refs = VariantRefs(variant, color, theme);

  return (
    <ProgressBody
      {...props}
      toneStyle={assignInlineVars({
        [variables.trackBg]: refs?.background ?? resolved.background,
        [variables.trackBorder]: refs?.borderColor ?? resolved.borderColor,
        [variables.trackBorderWidth]: refs?.borderWidth ?? resolved.borderWidth,
      })}
    />
  );
}

ProgressFlat.displayName = "Progress.Flat";
