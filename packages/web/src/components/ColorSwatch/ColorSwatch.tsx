"use client";

import type { ReactElement } from "react";

import type { ColorExtended } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import * as styles from "./ColorSwatch.css.js";
import * as variables from "./ColorSwatch.vars.css.js";
import type { ColorSwatchProps } from "./ColorSwatch.types.js";

function Paint(color: ColorSwatchProps["color"]): string {
  if (color.startsWith("#") || color.includes("(")) return color;
  return ResolveAccent(color as ColorExtended, "600");
}

export function ColorSwatch(props: ColorSwatchProps): ReactElement {
  const {
    color,
    size = 24,
    radius = "full",
    withShadow = true,
    children,
    label,
    onPress,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const css_vars = assignInlineVars({
    [variables.swatch]: Paint(color),
    [variables.swatchSize]: `${String(size)}px`,
  });

  const shared = {
    className: cx(
      styles.root,
      styles.radius[radius],
      withShadow ? styles.shadow : undefined,
      sprinkle_class,
      className,
    ),
    style: { ...css_vars, ...sprinkle_style },
  };

  if (onPress !== undefined) {
    return (
      <UnstyledButton {...shared} aria-label={label ?? color} onPress={onPress}>
        {children}
      </UnstyledButton>
    );
  }

  return (
    <span
      {...shared}
      {...(label === undefined ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {children}
    </span>
  );
}

ColorSwatch.displayName = "ColorSwatch";
