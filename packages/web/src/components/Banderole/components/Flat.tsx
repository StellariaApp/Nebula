"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { BanderoleProps } from "../Banderole.types.js";
import * as variables from "../Banderole.vars.css.js";
import { BanderoleBody } from "./Body.js";

export function BanderoleFlat(props: BanderoleProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);

  return (
    <BanderoleBody
      {...rest}
      variant={variant}
      toneStyle={assignInlineVars({
        [variables.bg]: refs?.background ?? resolved.background,
        [variables.fg]: refs?.foreground ?? resolved.foreground,
        [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
        [variables.blur]: refs?.backdropFilter ?? resolved.backdropFilter,
      })}
    />
  );
}

BanderoleFlat.displayName = "Banderole.Flat";
