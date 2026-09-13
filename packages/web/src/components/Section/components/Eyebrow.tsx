import type { ReactElement } from "react";

import { cx } from "../../../utils/style-props.js";
import { Badge } from "../../Badge/Badge.js";
import type { BadgeProps } from "../../Badge/Badge.types.js";

import * as styles from "../Section.css.js";

export type SectionEyebrowProps = BadgeProps;

export function SectionEyebrow(props: SectionEyebrowProps): ReactElement {
  const { className, ...rest } = props;
  return <Badge variant="light" size="sm" {...rest} className={cx(styles.eyebrow, className)} />;
}

SectionEyebrow.displayName = "Section.Eyebrow";
