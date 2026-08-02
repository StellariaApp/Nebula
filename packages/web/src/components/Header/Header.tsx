"use client";

import { useId, useMemo, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";

import * as styles from "./Header.css.js";
import { HEADER_LABELS } from "./labels.js";
import type { HeaderProps } from "./Header.types.js";

const BACK_ICON = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export function Header(props: HeaderProps): ReactElement {
  const {
    children,
    component,
    title,
    subtitle,
    order = 1,
    leftSection,
    rightSection,
    withBack = false,
    onBack,
    backIcon,
    labels,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? HEADER_LABELS : { ...HEADER_LABELS, ...labels }),
    [labels],
  );

  const title_id = useId();
  const has_title = title !== undefined;
  const Root = component ?? "div";
  const Heading = `h${String(order)}` as "h1";

  const labelling =
    component === undefined
      ? {}
      : has_title
        ? { "aria-labelledby": title_id }
        : aria_label === undefined
          ? {}
          : { "aria-label": aria_label };

  const has_lead = withBack || leftSection !== undefined;
  const has_heading = has_title || subtitle !== undefined;

  return (
    <Root
      className={cx(styles.header, sprinkle_class, className)}
      style={sprinkle_style}
      {...labelling}
      {...rest}
    >
      <div className={styles.row}>
        {has_lead ? (
          <div className={styles.lead}>
            {withBack ? (
              <ActionIcon variant="ghost" color="gray" aria-label={text.back} onPress={onBack}>
                {backIcon ?? BACK_ICON}
              </ActionIcon>
            ) : null}
            {leftSection}
          </div>
        ) : null}

        {has_heading ? (
          <div className={styles.heading}>
            {has_title ? (
              <Heading className={styles.title} id={title_id}>
                {title}
              </Heading>
            ) : null}
            {subtitle === undefined ? null : <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        ) : null}

        {rightSection === undefined ? null : <div className={styles.trail}>{rightSection}</div>}
      </div>

      {children === undefined ? null : <div className={styles.body}>{children}</div>}
    </Root>
  );
}

Header.displayName = "Header";
