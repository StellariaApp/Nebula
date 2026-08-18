"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "@stellaria/nebula-themes/web";

import type { BanderoleProps } from "../Banderole.types.js";
import * as variables from "../Banderole.vars.css.js";
import { BanderoleBody } from "./Body.js";

export function BanderoleFlat(props: BanderoleProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  return (
    <BanderoleBody
      {...rest}
      variant={variant}
      toneStyle={assignInlineVars({
        [variables.bg]: resolved.background,
        [variables.fg]: resolved.foreground,
        [variables.borderColor]: resolved.borderColor,
        [variables.blur]: resolved.backdropFilter,
      })}
    />
  );
}

BanderoleFlat.displayName = "Banderole.Flat";
