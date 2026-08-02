"use client";

import { useMemo, type ElementType, type ReactElement } from "react";

import { m, type MotionStyle } from "motion/react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import type { RevealProps } from "./Reveal.types.js";
import { useReveal } from "./use-reveal.js";

const TAGS = m as unknown as Record<string, ElementType>;

export function Reveal(props: RevealProps): ReactElement {
  const {
    children,
    component,
    preset,
    spring,
    duration,
    once,
    amount,
    rootMargin,
    index,
    className,
    style,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);
  const merged_style =
    sprinkle_style === undefined && style === undefined
      ? undefined
      : { ...sprinkle_style, ...style };

  const reveal = useReveal({ preset, spring, duration, once, amount, rootMargin, index });

  const tag = component ?? "div";
  const Root = useMemo(
    () => (typeof tag === "string" ? (TAGS[tag] ?? m.div) : m.create(tag)),
    [tag],
  );

  return (
    <Root
      ref={reveal.ref}
      className={cx(sprinkle_class, className)}
      {...(merged_style === undefined ? {} : { style: merged_style as MotionStyle })}
      data-reveal={reveal["data-reveal"]}
      initial={false}
      {...(reveal.animate === undefined
        ? {}
        : { animate: reveal.animate, transition: reveal.transition })}
      {...rest}
    >
      {children}
    </Root>
  );
}

Reveal.displayName = "Reveal";
