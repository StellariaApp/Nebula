"use client";

import { useId, useMemo, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Header.css.js";
import { HEADER_LABELS } from "./labels.js";
import type { HeaderProps } from "./Header.types.js";
import { ArrowLeft } from "../../glyphs/index.js";

const BACK_ICON = <ArrowLeft />;

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
    rowProps,
    leadProps,
    headingProps,
    trailProps,
    bodyProps,
    titleProps,
    subtitleProps,
    backProps,
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
      <Box {...rowProps} className={cx(styles.row, rowProps?.className)}>
        {has_lead ? (
          <Box {...leadProps} className={cx(styles.lead, leadProps?.className)}>
            {withBack ? (
              <ActionIcon
                variant="ghost"
                color="gray"
                aria-label={text.back}
                onPress={onBack}
                {...backProps}
              >
                {backIcon ?? BACK_ICON}
              </ActionIcon>
            ) : null}
            {leftSection}
          </Box>
        ) : null}

        {has_heading ? (
          <Box {...headingProps} className={cx(styles.heading, headingProps?.className)}>
            {has_title ? (
              <Text
                component={Heading}
                id={title_id}
                {...titleProps}
                className={cx(styles.title, titleProps?.className)}
              >
                {title}
              </Text>
            ) : null}
            {subtitle === undefined ? null : (
              <Text {...subtitleProps} className={cx(styles.subtitle, subtitleProps?.className)}>
                {subtitle}
              </Text>
            )}
          </Box>
        ) : null}

        {rightSection === undefined ? null : (
          <Box {...trailProps} className={cx(styles.trail, trailProps?.className)}>
            {rightSection}
          </Box>
        )}
      </Box>

      {children === undefined ? null : (
        <Box {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
          {children}
        </Box>
      )}
    </Root>
  );
}

Header.displayName = "Header";
