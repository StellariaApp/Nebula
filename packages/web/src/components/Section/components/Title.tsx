import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Title } from "../../Title/Title.js";

import * as styles from "../Section.css.js";
import type { SectionOrder, SectionSlotProps } from "../Section.types.js";

export interface SectionTitleProps extends Omit<SectionSlotProps, "order"> {
  /**
   * The heading level. `<Section title>` passes it for you; writing the title by hand means passing
   * it yourself, because the root cannot reach an element it did not create (ADR-156).
   */
  order?: SectionOrder | undefined;
  /** What `aria-labelledby` on the root points at. Same rule as `order`. */
  id?: string | undefined;
}

export function SectionTitle(props: SectionTitleProps): ReactElement {
  const { children, className, order, id, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);

  return (
    <Title
      {...(id === undefined ? {} : { id })}
      order={order}
      className={cx(styles.title, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </Title>
  );
}

SectionTitle.displayName = "Section.Title";
