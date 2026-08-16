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
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
  type PanInfo,
} from "motion/react";

import { MotionOff } from "../../../utils/motion.js";
import { Rubber } from "../../../utils/rubber.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import { useSegment } from "../Segment.context.js";
import * as styles from "../Segment.css.js";
import type { SegmentContentItemProps, SegmentContentProps } from "../Segment.types.js";

import { SegmentPanel, type SegmentPanelMode } from "./Panel.js";

const FLICK_VELOCITY = 380;

interface SegmentMetrics {
  offsets: number[];
  widths: number[];
  period: number;
}

const UNMEASURED: SegmentMetrics = { offsets: [], widths: [], period: 0 };

export function SegmentContentItem(_props: SegmentContentItemProps): null {
  return null;
}

SegmentContentItem.displayName = "SegmentContentItem";

function Wrap(value: number, total: number): number {
  return ((value % total) + total) % total;
}

function Shortest(from: number, to: number, total: number): number {
  const delta = Wrap(to - from, total);
  if (delta * 2 === total) return to < from ? delta - total : delta;
  return delta * 2 > total ? delta - total : delta;
}

function AlignPage(page: number, index: number, total: number, loop: boolean): number {
  if (total === 0) return page;
  if (!loop) return index;
  return page + Shortest(Wrap(page, total), index, total);
}

function HeightMode(fill: boolean, auto: boolean): SegmentPanelMode {
  if (fill) return "fill";
  if (auto) return "auto";
  return "max";
}

function PageOffset(metrics: SegmentMetrics, total: number, page: number): number {
  if (total === 0) return 0;
  const turn = Math.floor(page / total);
  return (metrics.offsets[page - turn * total] ?? 0) + turn * metrics.period;
}

function NearestPage(
  metrics: SegmentMetrics,
  total: number,
  scroll: number,
  from: number,
  loop: boolean,
): number {
  const pages = loop ? [from - 1, from, from + 1] : metrics.offsets.map((_, index) => index);
  let best = from;
  let distance = Number.POSITIVE_INFINITY;
  for (const page of pages) {
    const away = Math.abs(scroll - PageOffset(metrics, total, page));
    if (away < distance) {
      distance = away;
      best = page;
    }
  }
  return best;
}

function Same(previous: SegmentMetrics, next: SegmentMetrics): boolean {
  return (
    previous.period === next.period &&
    previous.offsets.length === next.offsets.length &&
    previous.offsets.every((value, index) => value === next.offsets[index]) &&
    previous.widths.every((value, index) => value === next.widths[index])
  );
}

export function SegmentContent(props: SegmentContentProps): ReactElement {
  const {
    children,
    swipeable,
    fill,
    auto,
    autoWidth,
    loop,
    lazy,
    className,
    panelProps,
    gap,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const rail_style = ExtractStyleProps(gap === undefined ? {} : { gap });
  const segment = useSegment();
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const inherited = segment.layout;
  const is_lazy = lazy ?? inherited.lazy ?? false;
  const wants_swipe = is_lazy ? false : (swipeable ?? inherited.swipeable ?? true);
  const fills = fill ?? inherited.fill ?? false;
  const autos = auto ?? inherited.auto ?? false;
  const fits_width = autoWidth ?? inherited.autoWidth ?? false;
  const loops = loop ?? inherited.loop ?? false;
  const flow = wants_swipe ? "rail" : "stack";

  const items = Children.toArray(children).filter(
    (child): child is ReactElement<SegmentContentItemProps> => isValidElement(child),
  );
  const values = items.map((child) => child.props.value);
  const total = values.length;
  const index = Math.max(0, values.indexOf(segment.value));
  const mode = HeightMode(fills, autos);

  const { RegisterPanels } = segment;
  const signature = values.join(" ");
  useEffect(() => {
    RegisterPanels(signature === "" ? [] : signature.split(" "));
  }, [signature, RegisterPanels]);

  const viewport = useRef<HTMLDivElement | null>(null);
  const rail = useRef<HTMLDivElement | null>(null);
  const [metrics, set_metrics] = useState<SegmentMetrics>(UNMEASURED);
  const [measured, set_measured] = useState(false);

  const is_animated = !MotionOff({ theme, reduced: prefers_reduced === true });
  const can_loop = wants_swipe && loops && total > 1;

  const target = useMotionValue(0);
  const x = useSpring(target, theme.motion.spring.default);
  const height_target = useMotionValue(0);
  const height = useSpring(height_target, theme.motion.spring.default);
  const width_target = useMotionValue(0);
  const width_spring = useSpring(width_target, theme.motion.spring.default);
  const room = is_animated ? width_spring : width_target;
  const position = is_animated ? x : target;

  const origin = useRef(0);
  const first = useRef(true);
  const first_height = useRef(true);
  const first_width = useRef(true);

  const [page, set_page] = useState(0);
  const aligned = AlignPage(page, index, total, can_loop);
  if (aligned !== page) set_page(aligned);

  const Measure = useCallback((): void => {
    const strip = rail.current;
    if (strip === null) return;
    const nodes = [...strip.children].filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    const widths = nodes.map((node) => node.getBoundingClientRect().width);
    const column = Number.parseFloat(getComputedStyle(strip).columnGap);
    const between = Number.isFinite(column) ? column : 0;
    const offsets: number[] = [];
    let running = 0;
    for (const width of widths) {
      offsets.push(running);
      running += width + between;
    }
    set_metrics((previous) => {
      const next = { offsets, widths, period: running };
      return Same(previous, next) ? previous : next;
    });
  }, []);

  useLayoutEffect(() => {
    const box = viewport.current;
    const strip = rail.current;
    if (box === null || strip === null || typeof ResizeObserver === "undefined") return;
    Measure();
    const observer = new ResizeObserver(Measure);
    observer.observe(box);
    observer.observe(strip);
    for (const node of strip.children) observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [Measure, signature]);

  useLayoutEffect(() => {
    if (mode !== "auto") return;
    const node = rail.current?.children[index];
    if (!(node instanceof HTMLElement) || typeof ResizeObserver === "undefined") return;
    const Sync = (): void => {
      const next = node.getBoundingClientRect().height;
      if (next <= 0) return;
      set_measured(true);
      if (first_height.current || !is_animated) {
        height_target.jump(next);
        height.jump(next);
        first_height.current = false;
        return;
      }
      height_target.set(next);
    };
    Sync();
    const observer = new ResizeObserver(Sync);
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [mode, index, signature, is_animated, height_target, height]);

  useEffect(() => {
    if (!fits_width) return;
    const next = metrics.widths[index];
    if (next === undefined || next <= 0) return;
    if (first_width.current || !is_animated) {
      width_target.jump(next);
      width_spring.jump(next);
      first_width.current = false;
      return;
    }
    width_target.set(next);
  }, [fits_width, index, metrics, is_animated, width_target, width_spring]);

  useEffect(() => {
    if (flow === "stack") {
      target.jump(0);
      x.jump(0);
      return;
    }
    const next = -PageOffset(metrics, total, aligned);
    if (first.current || !is_animated) {
      target.jump(next);
      x.jump(next);
      if (metrics.period > 0) first.current = false;
      return;
    }
    target.set(next);
  }, [flow, aligned, metrics, total, is_animated, target, x]);

  const Go = useCallback(
    (next: number): void => {
      const value = values[next];
      if (value === undefined) return;
      segment.SetValue(value);
    },
    [values, segment],
  );

  const can_swipe =
    wants_swipe && is_animated && !segment.disabled && total > 1 && metrics.period > 0;

  const HandlePanStart = (): void => {
    origin.current = target.get();
  };

  const HandlePan = (_event: unknown, info: PanInfo): void => {
    const dragged = origin.current + info.offset.x;
    if (can_loop) {
      target.set(dragged);
      return;
    }
    target.set(Rubber(dragged, -PageOffset(metrics, total, total - 1), 0));
  };

  const HandlePanEnd = (_event: unknown, info: PanInfo): void => {
    const flick = Math.abs(info.velocity.x) > FLICK_VELOCITY;
    const scroll = -target.get();
    const landed = flick
      ? info.velocity.x < 0
        ? aligned + 1
        : aligned - 1
      : NearestPage(metrics, total, scroll, aligned, can_loop);
    const next = can_loop
      ? Math.min(aligned + 1, Math.max(aligned - 1, landed))
      : Math.min(total - 1, Math.max(0, landed));
    if (next === aligned) {
      target.set(-PageOffset(metrics, total, aligned));
      return;
    }
    set_page(next);
    Go(can_loop ? Wrap(next, total) : next);
  };

  const fits = fits_width && (metrics.widths[index] ?? 0) > 0;

  return (
    <m.div
      ref={viewport}
      data-ready={metrics.period > 0 ? "true" : "false"}
      data-fit={autoWidth ? "true" : "false"}
      className={cx(styles.content, sprinkle_class, className)}
      style={
        {
          ...sprinkle_style,
          ...(mode === "auto" && measured ? { height } : {}),
          ...(fits ? { width: room } : {}),
        } as MotionStyle
      }
    >
      <m.div
        ref={rail}
        className={cx(styles.viewport({ mode, flow }), rail_style.className)}
        style={
          { ...rail_style.style, ...(flow === "rail" ? { x: position } : {}) } as MotionStyle
        }
        {...(can_swipe
          ? { onPanStart: HandlePanStart, onPan: HandlePan, onPanEnd: HandlePanEnd }
          : {})}
      >
        {items.map((child, slot) => (
          <SegmentPanel
            key={child.props.value}
            panelProps={panelProps}
            rail={position}
            offset={metrics.offsets[slot] ?? 0}
            period={metrics.period}
            loop={can_loop}
            active={slot === index}
            mode={mode}
            fit={fits_width}
            flow={flow}
            animated={is_animated}
            id={`${segment.baseId}-panel-${child.props.value}`}
            labelledBy={`${segment.baseId}-tab-${child.props.value}`}
            className={child.props.className}
          >
            {is_lazy && slot !== index ? null : child.props.children}
          </SegmentPanel>
        ))}
      </m.div>
    </m.div>
  );
}

SegmentContent.displayName = "SegmentContent";
