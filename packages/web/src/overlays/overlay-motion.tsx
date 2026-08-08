"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type MotionStyle,
  type TargetAndTransition,
} from "motion/react";

import { SurfaceTransition, type MotionSurface } from "../utils/motion.js";

export type OverlayMotionPreset =
  | "scale"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-start"
  | "slide-end"
  | "edge-start"
  | "edge-end"
  | "edge-top"
  | "edge-bottom";

const PRESETS: Record<OverlayMotionPreset, { from: TargetAndTransition; to: TargetAndTransition }> =
  {
    scale: { from: { opacity: 0, scale: 0.96 }, to: { opacity: 1, scale: 1 } },
    fade: { from: { opacity: 0 }, to: { opacity: 1 } },
    "slide-up": { from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 } },
    "slide-down": { from: { opacity: 0, y: -12 }, to: { opacity: 1, y: 0 } },
    "slide-start": { from: { opacity: 0, x: -12 }, to: { opacity: 1, x: 0 } },
    "slide-end": { from: { opacity: 0, x: 12 }, to: { opacity: 1, x: 0 } },
    "edge-start": { from: { x: "-100%" }, to: { x: 0 } },
    "edge-end": { from: { x: "100%" }, to: { x: 0 } },
    "edge-top": { from: { y: "-100%" }, to: { y: 0 } },
    "edge-bottom": { from: { y: "100%" }, to: { y: 0 } },
  };

export interface OverlayPresence {
  render: boolean;
  OnExitComplete: () => void;
}

export function useOverlayPresence(open: boolean): OverlayPresence {
  const [render, set_render] = useState(open);

  useEffect(() => {
    if (open) set_render(true);
  }, [open]);

  const OnExitComplete = useCallback(() => {
    set_render(false);
  }, []);

  return { render: render || open, OnExitComplete };
}

type MotionConflictingProps =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop";

export interface OverlayMotionProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "style" | "ref" | MotionConflictingProps
> {
  open: boolean;
  surface: MotionSurface;
  preset?: OverlayMotionPreset | undefined;
  onExitComplete?: (() => void) | undefined;
  style?: CSSProperties | undefined;
  children: ReactNode;
}

/**
 * Lo que una prop de ranura puede ajustar del envoltorio de motion: todo menos lo que el componente
 * gobierna —si está abierto, qué superficie es y qué pinta dentro—.
 */
export type OverlayMotionSlotProps = Omit<
  OverlayMotionProps,
  "open" | "surface" | "children" | "onExitComplete"
>;

export const OverlayMotion = forwardRef<HTMLDivElement, OverlayMotionProps>(
  function OverlayMotion(props, ref): ReactElement {
    const {
      open,
      surface,
      preset = "scale",
      onExitComplete,
      className,
      style,
      children,
      ...dom_rest
    } = props;

    const { theme } = useTheme();
    const prefers_reduced = useReducedMotion();
    const motion_context = { theme, reduced: prefers_reduced === true };

    const frozen = useRef<CSSProperties | undefined>(style);
    if (open) frozen.current = style;

    const phase = PRESETS[preset];

    return (
      <AnimatePresence {...(onExitComplete === undefined ? {} : { onExitComplete })}>
        {open ? (
          <m.div
            {...dom_rest}
            ref={ref}
            key="overlay"
            className={className}
            style={frozen.current as MotionStyle}
            initial={phase.from}
            animate={phase.to}
            exit={{
              ...phase.from,
              transition: SurfaceTransition(surface, "exit", motion_context),
            }}
            transition={SurfaceTransition(surface, "enter", motion_context)}
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    );
  },
);
