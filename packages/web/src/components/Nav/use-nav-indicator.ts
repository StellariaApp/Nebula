"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react";

import { SpringOptions } from "../../utils/motion.js";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NavIndicatorApi {
  containerRef: (node: HTMLElement | null) => void;
  SetItemRef: (key: string) => (node: HTMLElement | null) => void;
  x: MotionValue<number>;
  width: MotionValue<number>;
  y: number;
  height: number;
  ready: boolean;
}

const EMPTY: Rect = { x: 0, y: 0, width: 0, height: 0 };

export function useNavIndicator(active: string | undefined): NavIndicatorApi {
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_animated = prefers_reduced !== true && theme.motion.tier !== "minimal";
  const config = SpringOptions("default", theme);

  const container = useRef<HTMLElement | null>(null);
  const items = useRef(new Map<string, HTMLElement>());
  const setters = useRef(new Map<string, (node: HTMLElement | null) => void>());
  const first = useRef(true);

  const [rect, set_rect] = useState<Rect>(EMPTY);

  const target_x = useMotionValue(0);
  const target_w = useMotionValue(0);
  const spring_x = useSpring(target_x, config);
  const spring_w = useSpring(target_w, config);

  const Measure = useCallback(() => {
    const root = container.current;
    const node = active === undefined ? undefined : items.current.get(active);

    if (root === null || node === undefined) {
      set_rect((prev) => (prev.width === 0 ? prev : EMPTY));
      return;
    }

    const base = root.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    const next = {
      x: box.left - base.left,
      y: box.top - base.top,
      width: box.width,
      height: box.height,
    };
    set_rect((prev) =>
      prev.x === next.x &&
      prev.y === next.y &&
      prev.width === next.width &&
      prev.height === next.height
        ? prev
        : next,
    );
  }, [active]);

  const SetContainerRef = useCallback((node: HTMLElement | null) => {
    container.current = node;
  }, []);

  const SetItemRef = useCallback((key: string) => {
    const cached = setters.current.get(key);
    if (cached !== undefined) return cached;

    const setter = (node: HTMLElement | null): void => {
      if (node === null) items.current.delete(key);
      else items.current.set(key, node);
    };
    setters.current.set(key, setter);
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
    if (rect.width === 0) return;

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
  }, [rect, is_animated, target_x, target_w, spring_x, spring_w]);

  return {
    containerRef: SetContainerRef,
    SetItemRef,
    x: is_animated ? spring_x : target_x,
    width: is_animated ? spring_w : target_w,
    y: rect.y,
    height: rect.height,
    ready: rect.width > 0,
  };
}
