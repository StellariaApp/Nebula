"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Segment.css.js";
import type { SegmentSectionProps } from "./Segment.types.js";

function Section(props: SegmentSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div className={cx(styles.section, sprinkle_class, className)} style={sprinkle_style}>
      {children}
    </div>
  );
}

export function SegmentHeader(props: SegmentSectionProps): ReactElement {
  return <Section {...props} />;
}

SegmentHeader.displayName = "SegmentHeader";

export function SegmentFooter(props: SegmentSectionProps): ReactElement {
  return <Section {...props} />;
}

SegmentFooter.displayName = "SegmentFooter";
