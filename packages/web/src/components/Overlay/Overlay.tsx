"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { blur as blur_variants, content, overlay, veil } from "./Overlay.css.js";
import * as variables from "./Overlay.vars.css.js";
import type { OverlayProps } from "./Overlay.types.js";

export function Overlay(props: OverlayProps): ReactElement {
  const {
    color = "black",
    opacity = 0.6,
    blur = "none",
    r = 0,
    fixed = false,
    center = false,
    zIndex,
    children,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps({
    r,
    ...style_rest,
  });

  const css_vars = assignInlineVars({
    [variables.tint]: ResolveAccent(color, "600"),
    [variables.alpha]: String(opacity),
  });

  const has_content = children !== undefined && children !== null;

  return (
    <div
      className={cx(overlay, blur_variants[blur], sprinkle_class, className)}
      style={{
        ...css_vars,
        ...(zIndex === undefined ? {} : { zIndex }),
        ...sprinkle_style,
      }}
      data-fixed={fixed ? "true" : undefined}
      data-center={center || has_content ? "true" : undefined}
      aria-hidden={has_content ? undefined : true}
    >
      {has_content ? (
        <>
          <span className={veil} aria-hidden="true" />
          <div className={content}>{children}</div>
        </>
      ) : null}
    </div>
  );
}

Overlay.displayName = "Overlay";
