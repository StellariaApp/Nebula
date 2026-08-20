import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Anchor } from "../Anchor/Anchor.js";
import { Text } from "../Text/Text.js";
import { ThemeIcon } from "../ThemeIcon/ThemeIcon.js";

import * as styles from "./Feature.css.js";
import type { FeatureProps } from "./Feature.types.js";

export function Feature(props: FeatureProps): ReactElement {
  const {
    title,
    description,
    icon,
    color = "primary",
    href,
    linkText = "Learn more",
    align = "start",
    children,
    className,
    reveal,
    titleProps,
    descriptionProps,
    iconProps,
    linkProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <Box
      className={cx(styles.feature, sprinkle_class, className)}
      style={sprinkle_style}
      {...(reveal === undefined ? {} : { reveal })}
      data-align={align}
    >
      {icon === undefined || icon === null ? null : (
        <ThemeIcon mb="sm" size="xl" variant="light" color={color} {...iconProps}>
          {icon}
        </ThemeIcon>
      )}
      <Text {...titleProps} className={cx(styles.title, titleProps?.className)}>
        {title}
      </Text>
      {description === undefined ? null : (
        <Text {...descriptionProps} className={cx(styles.description, descriptionProps?.className)}>
          {description}
        </Text>
      )}
      {children}
      {href === undefined ? null : (
        <Anchor href={href} {...linkProps}>
          {linkText}
        </Anchor>
      )}
    </Box>
  );
}

Feature.displayName = "Feature";
