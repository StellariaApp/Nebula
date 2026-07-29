"use client";

import { useRef, type ComponentPropsWithoutRef, type ReactElement, type RefObject } from "react";

import { useDateSegment } from "react-aria";
import type { DateFieldState, DateSegment, TimeFieldState } from "react-stately";

import { cx } from "../utils/style-props.js";

import * as styles from "./date-segments.css.js";

type AnyDateFieldState = DateFieldState | TimeFieldState;

interface SegmentProps {
  segment: DateSegment;
  state: AnyDateFieldState;
}

function Segment(props: SegmentProps): ReactElement {
  const { segment, state } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={styles.segment}
      data-placeholder={segment.isPlaceholder ? "true" : undefined}
      data-literal={segment.type === "literal" ? "true" : undefined}
      data-disabled={state.isDisabled ? "true" : undefined}
      style={{ ...segmentProps.style, minWidth: segment.maxValue === undefined ? undefined : "1ch" }}
    >
      {segment.text}
    </div>
  );
}

export interface DateSegmentsProps {
  state: AnyDateFieldState;
  fieldProps: ComponentPropsWithoutRef<"div">;
  fieldRef: RefObject<HTMLDivElement | null>;
  className?: string | undefined;
}

export function DateSegments(props: DateSegmentsProps): ReactElement {
  const { state, fieldProps, fieldRef, className } = props;

  return (
    <div {...fieldProps} ref={fieldRef} className={cx(styles.group, className)}>
      {state.segments.map((segment, index) => (
        <Segment key={index} segment={segment} state={state} />
      ))}
    </div>
  );
}

DateSegments.displayName = "DateSegments";
