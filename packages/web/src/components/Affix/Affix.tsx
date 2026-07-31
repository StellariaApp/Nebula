"use client";

import type { CSSProperties, ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Portal } from "../Portal/Portal.js";

import * as styles from "./Affix.css.js";
import type { AffixProps } from "./Affix.types.js";

function Offset(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${String(value)}px` : value;
}

export function Affix(props: AffixProps): ReactElement | null {
  const {
    children,
    position = { bottom: 24, right: 24 },
    zIndex = 200,
    withinPortal = true,
    visible = true,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  if (!visible) return null;

  const placement: CSSProperties = {
    top: Offset(position.top),
    right: Offset(position.right),
    bottom: Offset(position.bottom),
    left: Offset(position.left),
    zIndex,
  };

  const node = (
    <div
      className={cx(styles.affix, sprinkle_class, className)}
      style={{ ...placement, ...sprinkle_style }}
    >
      {children}
    </div>
  );

  return withinPortal ? <Portal>{node}</Portal> : node;
}

Affix.displayName = "Affix";
