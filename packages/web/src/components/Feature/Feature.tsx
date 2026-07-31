"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Anchor } from "../Anchor/Anchor.js";
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
    linkText = "Saber más",
    align = "start",
    children,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.feature, sprinkle_class, className)}
      style={sprinkle_style}
      data-align={align}
    >
      {icon === undefined || icon === null ? null : (
        <ThemeIcon size="lg" variant="light" color={color}>
          {icon}
        </ThemeIcon>
      )}
      <p className={styles.title}>{title}</p>
      {description === undefined ? null : <p className={styles.description}>{description}</p>}
      {children}
      {href === undefined ? null : <Anchor href={href}>{linkText}</Anchor>}
    </div>
  );
}

Feature.displayName = "Feature";
