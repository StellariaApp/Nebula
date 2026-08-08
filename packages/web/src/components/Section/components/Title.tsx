"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../Section.css.js";
import { useSection } from "../Section.context.js";
import type { SectionSlotProps } from "../Section.types.js";

export function SectionTitle(props: SectionSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  const section = useSection();
  const Heading = `h${String(section.order)}` as "h2";

  return (
    <Heading
      id={section.titleId}
      className={cx(styles.title, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Heading>
  );
}

SectionTitle.displayName = "Section.Title";
