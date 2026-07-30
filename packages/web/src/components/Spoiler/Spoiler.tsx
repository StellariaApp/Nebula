"use client";

import { useEffect, useId, useRef, useState, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Anchor } from "../Anchor/Anchor.js";

import * as styles from "./Spoiler.css.js";
import type { SpoilerProps } from "./Spoiler.types.js";

export function Spoiler(props: SpoilerProps): ReactElement {
  const {
    children,
    maxHeight = 100,
    showLabel = "Mostrar más",
    hideLabel = "Mostrar menos",
    expanded,
    defaultExpanded = false,
    onExpandedChange,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const [open, set_open] = useUncontrolled(expanded, defaultExpanded, onExpandedChange);
  const content_ref = useRef<HTMLDivElement>(null);
  const [overflows, set_overflows] = useState(false);
  const content_id = useId();

  useEffect(() => {
    const node = content_ref.current;
    if (node === null) return;
    const Measure = (): void => {
      set_overflows(node.scrollHeight > maxHeight + 1);
    };
    Measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(Measure);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [maxHeight, children]);

  return (
    <div className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
      <div
        ref={content_ref}
        id={content_id}
        className={cx(styles.content, overflows && !open ? styles.clipped : undefined)}
        style={overflows && !open ? { maxHeight } : undefined}
      >
        {children}
      </div>
      {overflows ? (
        <Anchor
          component="button"
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={content_id}
          onClick={() => {
            set_open(!open);
          }}
        >
          {open ? hideLabel : showLabel}
        </Anchor>
      ) : null}
    </div>
  );
}

Spoiler.displayName = "Spoiler";
