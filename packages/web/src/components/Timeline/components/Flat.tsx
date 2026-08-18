"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";

import type { TimelineProps } from "../Timeline.types.js";
import * as variables from "../Timeline.vars.css.js";
import { TimelineBody } from "./Body.js";

export function TimelineFlat(props: TimelineProps): ReactElement {
  const { variant = "filled", color = "primary", ...rest } = props;
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const refs = VariantRefs(variant, color, theme);

  return (
    <TimelineBody
      {...rest}
      toneStyle={assignInlineVars({
        [variables.bulletBg]: refs?.background ?? resolved.background,
        [variables.bulletFg]: refs?.foreground ?? resolved.foreground,
        [variables.bulletBorder]: refs?.borderColor ?? resolved.borderColor,
      })}
    />
  );
}

TimelineFlat.displayName = "Timeline.Flat";
