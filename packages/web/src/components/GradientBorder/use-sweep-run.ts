"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GradientBorderEdge } from "./GradientBorder.types.js";

const PREV_EDGE = { 1: 4, 2: 1, 3: 2, 4: 3 } as const satisfies Record<
  GradientBorderEdge,
  GradientBorderEdge
>;
const NEXT_EDGE = { 1: 2, 2: 3, 3: 4, 4: 1 } as const satisfies Record<
  GradientBorderEdge,
  GradientBorderEdge
>;

const EDGE_COUNT = 4;
const HALF_TURN = 180;
const FULL_TURN = 360;
const STOPS = 192;
const SCAN = STOPS * 24;
const SQUARE_CORNERS = 8;
const CLEARANCE = 1.15;

export interface Frame {
  w: number;
  h: number;
  r: number;
}

interface Point {
  x: number;
  y: number;
}

export interface SweepPlan {
  wedges: number;
  easing: string | null;
}

interface Measured {
  Track: (node: HTMLElement | null) => void;
  plan: SweepPlan | null;
}

export function Perimeter(frame: Frame): number {
  return 2 * (frame.w + frame.h) - (SQUARE_CORNERS - 2 * Math.PI) * frame.r;
}

function Boundary(deg: number, frame: Frame): Point {
  const rad = (deg * Math.PI) / HALF_TURN;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const half_w = frame.w / 2;
  const half_h = frame.h / 2;
  const flat_x = half_w - frame.r;
  const flat_y = half_h - frame.r;
  let reach = Number.POSITIVE_INFINITY;

  const Side = (step: number, along: number, limit: number): void => {
    if (step > 0 && step < reach && Math.abs(along * step) <= limit + 1e-9) reach = step;
  };

  if (Math.abs(dy) > 1e-9) Side(dy < 0 ? -half_h / dy : half_h / dy, dx, flat_x);
  if (Math.abs(dx) > 1e-9) Side(dx > 0 ? half_w / dx : -half_w / dx, dy, flat_y);

  if (frame.r > 0) {
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const cx = sx * flat_x;
        const cy = sy * flat_y;
        const mid = dx * cx + dy * cy;
        const gap = mid * mid - (cx * cx + cy * cy - frame.r * frame.r);
        if (gap < 0) continue;
        const step = mid + Math.sqrt(gap);
        if (step <= 0 || step >= reach) continue;
        if ((dx * step - cx) * sx >= -1e-9 && (dy * step - cy) * sy >= -1e-9) reach = step;
      }
    }
  }

  return { x: dx * reach, y: dy * reach };
}

export function ArcAt(deg: number, frame: Frame): number {
  const at = Boundary(deg, frame);
  const r = frame.r;
  const flat_x = frame.w / 2 - r;
  const flat_y = frame.h / 2 - r;
  const run_w = frame.w - 2 * r;
  const run_h = frame.h - 2 * r;
  const bend = (Math.PI / 2) * r;

  const top_right = run_w;
  const right = top_right + bend;
  const bottom_right = right + run_h;
  const bottom = bottom_right + bend;
  const bottom_left = bottom + run_w;
  const left = bottom_left + bend;
  const top_left = left + run_h;

  if (Math.abs(at.x) <= flat_x) return at.y < 0 ? at.x + flat_x : bottom + (flat_x - at.x);
  if (Math.abs(at.y) <= flat_y) return at.x > 0 ? right + (at.y + flat_y) : left + (flat_y - at.y);

  if (at.x > 0 && at.y < 0) return top_right + r * Math.atan2(at.x - flat_x, -(at.y + flat_y));
  if (at.x > 0) return bottom_right + r * Math.atan2(at.y - flat_y, at.x - flat_x);
  if (at.y > 0) return bottom_left + r * Math.atan2(-(at.x + flat_x), at.y - flat_y);
  return top_left + r * Math.atan2(-(at.y + flat_y), -(at.x + flat_x));
}

export function ArcEasing(frame: Frame): string | null {
  const total = Perimeter(frame);
  if (total <= 0) return null;

  const degrees: number[] = [0];
  const arcs: number[] = [ArcAt(0, frame)];
  let laps = 0;

  for (let index = 1; index <= SCAN; index += 1) {
    const deg = (FULL_TURN * index) / SCAN;
    const raw = ArcAt(deg, frame);
    const last = arcs[arcs.length - 1] ?? 0;
    if (raw + laps * total < last) laps += 1;
    degrees.push(deg);
    arcs.push(raw + laps * total);
  }

  const first = arcs[0] ?? 0;
  const last = arcs[arcs.length - 1] ?? 0;
  if (last - first <= 0) return null;

  const marks: number[] = [];
  let cursor = 0;
  for (let index = 0; index <= STOPS; index += 1) {
    const target = first + ((last - first) * index) / STOPS;
    while (cursor < arcs.length - 2 && (arcs[cursor + 1] ?? 0) < target) cursor += 1;
    const low = arcs[cursor] ?? 0;
    const high = arcs[cursor + 1] ?? low;
    const ratio = high === low ? 0 : (target - low) / (high - low);
    const from = degrees[cursor] ?? 0;
    const to = degrees[cursor + 1] ?? from;
    marks.push(Math.round(((from + (to - from) * ratio) / FULL_TURN) * 10000) / 10000);
  }
  marks[0] = 0;
  marks[marks.length - 1] = 1;

  return `linear(${marks.map((one) => String(one)).join(", ")})`;
}

export function ResolveWedges(
  lit: readonly GradientBorderEdge[],
  frame: Frame,
  head: number,
): number {
  if (lit.length === 0 || lit.length === EDGE_COUNT) return 1;
  if (frame.w <= 0 || frame.h <= 0) return 1;

  const heads = lit.filter((edge) => !lit.includes(PREV_EDGE[edge]));
  const [start] = heads;
  if (heads.length !== 1 || start === undefined) return 1;

  let end = start;
  while (lit.includes(NEXT_EDGE[end]) && NEXT_EDGE[end] !== start) end = NEXT_EDGE[end];

  const corner = (Math.atan2(frame.w / 2, frame.h / 2) * HALF_TURN) / Math.PI;
  const bounds = [-corner, corner, HALF_TURN - corner, HALF_TURN + corner, FULL_TURN - corner];

  const opens = bounds[start - 1] ?? 0;
  let closes = bounds[end] ?? FULL_TURN;
  if (closes <= opens) closes += FULL_TURN;

  const play = closes - opens + head;
  if (play >= FULL_TURN) return 1;

  const room = Math.floor(FULL_TURN / Math.max(head * CLEARANCE, 1));
  return Math.max(1, Math.min(Math.ceil(FULL_TURN / play), room));
}

export function UseSweepRun(
  lit: readonly GradientBorderEdge[],
  head: number,
  tiled: boolean,
  enabled: boolean,
): Measured {
  const node = useRef<HTMLElement | null>(null);
  const [frame, set_frame] = useState<Frame | null>(null);

  const Measure = useCallback(() => {
    const el = node.current;
    if (el === null) return;
    const rect = el.getBoundingClientRect();
    const declared = Number.parseFloat(window.getComputedStyle(el).borderTopLeftRadius) || 0;
    const r = Math.max(0, Math.min(declared, rect.width / 2, rect.height / 2));
    set_frame((prev) =>
      prev !== null && prev.w === rect.width && prev.h === rect.height && prev.r === r
        ? prev
        : { w: rect.width, h: rect.height, r },
    );
  }, []);

  const Track = useCallback(
    (el: HTMLElement | null) => {
      node.current = el;
      if (el !== null) Measure();
    },
    [Measure],
  );

  useEffect(() => {
    const el = node.current;
    if (!enabled || el === null) {
      set_frame(null);
      return;
    }
    Measure();
    const observer = new ResizeObserver(Measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [enabled, Measure]);

  if (!enabled || frame === null) return { Track, plan: null };

  return {
    Track,
    plan: {
      wedges: tiled ? ResolveWedges(lit, frame, head) : 1,
      easing: ArcEasing(frame),
    },
  };
}
