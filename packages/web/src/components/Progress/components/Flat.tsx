"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "@stellaria/nebula-themes/web";

import type { ProgressProps } from "../Progress.types.js";
import * as variables from "../Progress.vars.css.js";
import { ProgressBody } from "./Body.js";

export function ProgressFlat(props: ProgressProps): ReactElement {
  const { variant, color = "primary" } = props;
  const { theme } = useTheme();

  if (variant === undefined) return <ProgressBody {...props} />;

  const resolved = ResolveVariant(variant, color, theme);

  return (
    <ProgressBody
      {...props}
      toneStyle={assignInlineVars({
        [variables.trackBg]: resolved.background,
        [variables.trackBorder]: resolved.borderColor,
        [variables.trackBorderWidth]: resolved.borderWidth,
      })}
    />
  );
}

ProgressFlat.displayName = "Progress.Flat";
