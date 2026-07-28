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

export type OverlayMotionPreset = "scale" | "fade" | "slide-up" | "slide-down";

const PRESETS: Record<OverlayMotionPreset, { from: TargetAndTransition; to: TargetAndTransition }> =
  {
    scale: { from: { opacity: 0, scale: 0.96 }, to: { opacity: 1, scale: 1 } },
    fade: { from: { opacity: 0 }, to: { opacity: 1 } },
    "slide-up": { from: { opacity: 0, y: 12 }, to: { opacity: 1, y: 0 } },
    "slide-down": { from: { opacity: 0, y: -12 }, to: { opacity: 1, y: 0 } },
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
  preset?: OverlayMotionPreset | undefined;
  onExitComplete?: (() => void) | undefined;
  style?: CSSProperties | undefined;
  children: ReactNode;
}

export const OverlayMotion = forwardRef<HTMLDivElement, OverlayMotionProps>(
  function OverlayMotion(props, ref): ReactElement {
    const {
      open,
      preset = "scale",
      onExitComplete,
      className,
      style,
      children,
      ...dom_rest
    } = props;

    const { theme } = useTheme();
    const prefers_reduced = useReducedMotion();
    const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
    const spring = theme.motion.spring.default;

    const frozen = useRef<CSSProperties | undefined>(style);
    if (open) frozen.current = style;

    const phase = PRESETS[preset];

    return (
      <AnimatePresence
        initial={false}
        {...(onExitComplete === undefined ? {} : { onExitComplete })}
      >
        {open ? (
          <m.div
            {...dom_rest}
            ref={ref}
            key="overlay"
            className={className}
            style={frozen.current as MotionStyle}
            initial={phase.from}
            animate={phase.to}
            exit={phase.from}
            transition={
              is_off
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: spring.stiffness,
                    damping: spring.damping,
                    mass: spring.mass,
                  }
            }
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    );
  },
);
