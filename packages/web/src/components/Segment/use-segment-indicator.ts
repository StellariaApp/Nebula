"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
  type PanInfo,
} from "motion/react";

import { Rubber } from "../../utils/rubber.js";

const FLICK_VELOCITY = 380;

interface Rect {
  x: number;
  width: number;
}

export interface SegmentIndicatorOptions {
  activeIndex: number;
  count: number;
  draggable: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
  isEnabled?: ((index: number) => boolean) | undefined;
}

export interface SegmentIndicatorApi {
  containerRef: (node: HTMLElement | null) => void;
  SetItemRef: (index: number) => (node: HTMLElement | null) => void;
  x: MotionValue<number>;
  width: MotionValue<number>;
  ready: boolean;
  dragging: boolean;
  panHandlers: {
    onPanStart?: () => void;
    onPan?: (event: unknown, info: PanInfo) => void;
    onPanEnd?: (event: unknown, info: PanInfo) => void;
  };
  ConsumeDrag: () => boolean;
}

export function useSegmentIndicator(options: SegmentIndicatorOptions): SegmentIndicatorApi {
  const { activeIndex, count, draggable, disabled, onSelect, isEnabled } = options;

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_animated = prefers_reduced !== true && theme.motion.tier !== "minimal";
  const spring = theme.motion.spring.default;

  const container = useRef<HTMLElement | null>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [rects, set_rects] = useState<Rect[]>([]);
  const [dragging, set_dragging] = useState(false);

  const target_x = useMotionValue(0);
  const target_w = useMotionValue(0);
  const config = { stiffness: spring.stiffness, damping: spring.damping, mass: spring.mass };
  const spring_x = useSpring(target_x, config);
  const spring_w = useSpring(target_w, config);

  const first = useRef(true);
  const origin = useRef(0);
  const dragged = useRef(false);

  const Measure = useCallback(() => {
    const root = container.current;
    if (root === null) return;
    const base = root.getBoundingClientRect().left;
    const next = items.current.slice(0, count).map((node) => {
      if (node === null) return { x: 0, width: 0 };
      const box = node.getBoundingClientRect();
      return { x: box.left - base, width: box.width };
    });
    set_rects((prev) =>
      prev.length === next.length &&
      prev.every((rect, index) => rect.x === next[index]?.x && rect.width === next[index]?.width)
        ? prev
        : next,
    );
  }, [count]);

  const SetContainerRef = useCallback((node: HTMLElement | null) => {
    container.current = node;
  }, []);

  const setters = useRef(new Map<number, (node: HTMLElement | null) => void>());

  const SetItemRef = useCallback((index: number) => {
    const cached = setters.current.get(index);
    if (cached !== undefined) return cached;
    const setter = (node: HTMLElement | null): void => {
      items.current[index] = node;
    };
    setters.current.set(index, setter);
    return setter;
  }, []);

  useLayoutEffect(() => {
    Measure();
  });

  useLayoutEffect(() => {
    const root = container.current;
    if (root === null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      Measure();
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
    };
  }, [Measure]);

  useEffect(() => {
    const rect = rects[activeIndex];
    if (rect === undefined || rect.width === 0 || dragging) return;
    if (first.current || !is_animated) {
      target_x.jump(rect.x);
      target_w.jump(rect.width);
      spring_x.jump(rect.x);
      spring_w.jump(rect.width);
      first.current = false;
      return;
    }
    target_x.set(rect.x);
    target_w.set(rect.width);
  }, [activeIndex, rects, dragging, is_animated, target_x, target_w, spring_x, spring_w]);

  const Nearest = useCallback(
    (position: number): number => {
      let best = activeIndex;
      let distance = Number.POSITIVE_INFINITY;
      rects.forEach((rect, index) => {
        if (rect.width === 0) return;
        if (isEnabled !== undefined && !isEnabled(index)) return;
        const gap = Math.abs(rect.x + rect.width / 2 - position);
        if (gap < distance) {
          distance = gap;
          best = index;
        }
      });
      return best;
    },
    [rects, activeIndex, isEnabled],
  );

  const can_drag = draggable && is_animated && !disabled && rects.length > 1;

  const HandlePanStart = useCallback(() => {
    origin.current = target_x.get();
    set_dragging(true);
  }, [target_x]);

  const HandlePan = useCallback(
    (_event: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > 2) dragged.current = true;
      const last = rects[rects.length - 1];
      const max = last === undefined ? 0 : last.x;
      target_x.set(Rubber(origin.current + info.offset.x, 0, max));
    },
    [rects, target_x],
  );

  const HandlePanEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      set_dragging(false);
      const current = target_x.get();
      const rect = rects[activeIndex];
      const center = current + (rect === undefined ? 0 : rect.width / 2);
      const flick = Math.abs(info.velocity.x) > FLICK_VELOCITY;
      const step = flick ? (info.velocity.x > 0 ? 1 : -1) : 0;
      const nearest = Nearest(center);
      const index = flick ? Math.min(count - 1, Math.max(0, activeIndex + step)) : nearest;
      onSelect(index);
    },
    [rects, activeIndex, count, Nearest, onSelect, target_x],
  );

  const ConsumeDrag = useCallback((): boolean => {
    const was = dragged.current;
    dragged.current = false;
    return was;
  }, []);

  return {
    containerRef: SetContainerRef,
    SetItemRef,
    x: is_animated ? spring_x : target_x,
    width: is_animated ? spring_w : target_w,
    ready: rects.some((rect) => rect.width > 0),
    dragging,
    panHandlers: can_drag
      ? { onPanStart: HandlePanStart, onPan: HandlePan, onPanEnd: HandlePanEnd }
      : {},
    ConsumeDrag,
  };
}
