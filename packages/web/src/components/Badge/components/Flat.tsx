"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../../theme/resolve-variant.js";

import type { BadgeProps } from "../Badge.types.js";
import * as variables from "../Badge.vars.css.js";
import { BadgeBody } from "./Body.js";

export function BadgeFlat(props: BadgeProps): ReactElement {
  const { variant = "light", color = "primary" } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  return (
    <BadgeBody
      {...props}
      toneStyle={assignInlineVars({
        [variables.bg]: resolved.background,
        [variables.fg]: resolved.foreground,
        [variables.borderColor]: resolved.borderColor,
      })}
    />
  );
}

BadgeFlat.displayName = "Badge.Flat";
