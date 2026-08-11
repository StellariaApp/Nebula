"use client";

import type { ReactElement, ReactNode, Ref } from "react";

import { m, useTransform, type MotionValue } from "motion/react";

import { cx } from "../../../utils/style-props.js";

import { Box } from "../../Box/Box.js";
import type { BoxSlotProps } from "../../Box/Box.types.js";

import * as styles from "../Segment.css.js";

const MotionBox = /* @__PURE__ */ m.create(Box);

export type SegmentPanelMode = "max" | "auto" | "fill";

export interface SegmentPanelProps {
  panelProps?: BoxSlotProps | undefined;
  rail: MotionValue<number>;
  offset: number;
  period: number;
  loop: boolean;
  active: boolean;
  mode: SegmentPanelMode;
  fit: boolean;
  id: string;
  labelledBy: string;
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLElement> | undefined;
}

export function SegmentPanel(props: SegmentPanelProps): ReactElement {
  const { panelProps, rail, offset, period, loop, active, mode, fit } = props;

  const x = useTransform(rail, (value) => {
    if (!loop || period <= 0) return 0;
    return Math.round((-value - offset) / period) * period;
  });

  return (
    <MotionBox
      {...panelProps}
      ref={props.ref}
      role="tabpanel"
      id={props.id}
      aria-labelledby={props.labelledBy}
      aria-hidden={active ? undefined : true}
      {...(active ? {} : { inert: true })}
      tabIndex={active ? 0 : -1}
      className={cx(styles.panel({ mode, fit }), props.className, panelProps?.className)}
      style={{ ...panelProps?.style, x }}
    >
      {props.children}
    </MotionBox>
  );
}

SegmentPanel.displayName = "SegmentPanel";
