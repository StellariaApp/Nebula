"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../../theme/resolve-variant.js";

import type { StepperProps } from "../Stepper.types.js";
import * as variables from "../Stepper.vars.css.js";
import { StepperBody } from "./Body.js";

export function StepperFlat(props: StepperProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  return (
    <StepperBody
      {...rest}
      toneStyle={assignInlineVars({
        [variables.bulletBg]: resolved.background,
        [variables.bulletFg]: resolved.foreground,
        [variables.bulletBorder]: resolved.borderColor,
        [variables.bulletBorderWidth]: resolved.borderWidth === "0" ? "1px" : resolved.borderWidth,
        [variables.trackDone]: resolved.foreground,
      })}
    />
  );
}

StepperFlat.displayName = "Stepper.Flat";
