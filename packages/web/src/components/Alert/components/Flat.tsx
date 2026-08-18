"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, vars } from "@stellaria/nebula-themes/web";
import { ResolveAccent } from "../../../utils/scale.js";

import type { AlertProps } from "../Alert.types.js";
import * as variables from "../Alert.vars.css.js";
import { AlertBody } from "./Body.js";

export function AlertFlat(props: AlertProps): ReactElement {
  const { variant = "light", color = "info" } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  return (
    <AlertBody
      {...props}
      toneStyle={assignInlineVars({
        [variables.bg]: resolved.background,
        [variables.fg]: resolved.foreground,
        [variables.accent]:
          variant === "filled" ? vars.color.text.onPrimary : ResolveAccent(color, "600"),
        [variables.borderColor]: resolved.borderColor,
      })}
    />
  );
}

AlertFlat.displayName = "Alert.Flat";
