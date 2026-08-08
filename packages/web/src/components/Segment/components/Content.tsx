"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useMotionValue, useReducedMotion, useSpring, type PanInfo } from "motion/react";

import { MotionOff } from "../../../utils/motion.js";
import { Rubber } from "../../../utils/rubber.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import { Box } from "../../Box/Box.js";

import { useSegment } from "../Segment.context.js";
import * as styles from "../Segment.css.js";
import type { SegmentContentItemProps, SegmentContentProps } from "../Segment.types.js";

const FLICK_VELOCITY = 380;

export function SegmentContentItem(_props: SegmentContentItemProps): null {
  return null;
}

SegmentContentItem.displayName = "SegmentContentItem";

export function SegmentContent(props: SegmentContentProps): ReactElement {
  const { children, swipeable = true, fill = false, className, panelProps, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const segment = useSegment();
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const items = Children.toArray(children).filter(
    (child): child is ReactElement<SegmentContentItemProps> => isValidElement(child),
  );
  const values = items.map((child) => child.props.value);
  const index = Math.max(0, values.indexOf(segment.value));

  const { RegisterPanels } = segment;
  const signature = values.join(" ");
  useEffect(() => {
    RegisterPanels(signature === "" ? [] : signature.split(" "));
  }, [signature, RegisterPanels]);

  const viewport = useRef<HTMLDivElement | null>(null);
  const [width, set_width] = useState(0);

  const is_animated = !MotionOff({ theme, reduced: prefers_reduced === true });

  const target = useMotionValue(0);
  const x = useSpring(target, theme.motion.spring.default);

  const origin = useRef(0);
  const first = useRef(true);

  useLayoutEffect(() => {
    const node = viewport.current;
    if (node === null || typeof ResizeObserver === "undefined") return;
    const Sync = (): void => {
      set_width(node.getBoundingClientRect().width);
    };
    Sync();
    const observer = new ResizeObserver(Sync);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const next = -index * width;
    if (first.current || !is_animated) {
      target.jump(next);
      x.jump(next);
      first.current = false;
      return;
    }
    target.set(next);
  }, [index, width, is_animated, target, x]);

  const Go = useCallback(
    (next: number): void => {
      const value = values[next];
      if (value === undefined) return;
      segment.SetValue(value);
    },
    [values, segment],
  );

  const can_swipe = swipeable && is_animated && !segment.disabled && values.length > 1 && width > 0;

  const HandlePanStart = (): void => {
    origin.current = target.get();
  };

  const HandlePan = (_event: unknown, info: PanInfo): void => {
    const min = -(values.length - 1) * width;
    target.set(Rubber(origin.current + info.offset.x, min, 0));
  };

  const HandlePanEnd = (_event: unknown, info: PanInfo): void => {
    const flick = Math.abs(info.velocity.x) > FLICK_VELOCITY;
    const approx = -target.get() / width;
    const landed = flick ? (info.velocity.x < 0 ? index + 1 : index - 1) : Math.round(approx);
    const next = Math.min(values.length - 1, Math.max(0, landed));
    if (next === index) target.set(-index * width);
    else Go(next);
  };

  return (
    <div
      ref={viewport}
      className={cx(styles.content, sprinkle_class, className)}
      style={sprinkle_style}
    >
      <m.div
        className={styles.viewport}
        style={{ x: is_animated ? x : target }}
        {...(can_swipe
          ? { onPanStart: HandlePanStart, onPan: HandlePan, onPanEnd: HandlePanEnd }
          : {})}
      >
        {items.map((child, position) => {
          const active = position === index;
          return (
            <Box
              key={child.props.value}
              role="tabpanel"
              id={`${segment.baseId}-panel-${child.props.value}`}
              aria-labelledby={`${segment.baseId}-tab-${child.props.value}`}
              aria-hidden={active ? undefined : true}
              {...(active ? {} : { inert: true })}
              tabIndex={active ? 0 : -1}
              {...panelProps}
              className={cx(styles.panel({ fill }), child.props.className, panelProps?.className)}
            >
              {child.props.children}
            </Box>
          );
        })}
      </m.div>
    </div>
  );
}

SegmentContent.displayName = "SegmentContent";
