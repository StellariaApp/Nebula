"use client";

import type { ReactElement } from "react";

import { cx } from "../../utils/style-props.js";

import * as styles from "./Segment.css.js";
import type { SegmentSectionProps } from "./Segment.types.js";

export function SegmentHeader(props: SegmentSectionProps): ReactElement {
  const { children, className } = props;
  return <div className={cx(styles.section, className)}>{children}</div>;
}

SegmentHeader.displayName = "SegmentHeader";

export function SegmentFooter(props: SegmentSectionProps): ReactElement {
  const { children, className } = props;
  return <div className={cx(styles.section, className)}>{children}</div>;
}

SegmentFooter.displayName = "SegmentFooter";
