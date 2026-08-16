import type { CSSProperties, ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { ButtonClose } from "../../ButtonClose/ButtonClose.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Tag.css.js";
import type { TagProps } from "../Tag.types.js";

export interface TagBodyProps extends Omit<TagProps, "color"> {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function TagBody(props: TagBodyProps): ReactElement {
  const {
    children,
    variant = "light",
    size = "md",
    radius = "full",
    leftSection,
    onRemove,
    removeLabel = "Remove",
    disabled = false,
    className,
    sectionProps,
    labelProps,
    removeProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <span
      className={cx(
        styles.tag,
        styles.size[size],
        styles.radius[radius],
        tone,
        sprinkle_class,
        className,
      )}
      style={{ ...toneStyle, ...sprinkle_style }}
      data-variant={variant}
      data-disabled={disabled ? "true" : undefined}
      {...(disabled ? { "aria-disabled": true } : {})}
    >
      {leftSection === undefined || leftSection === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...sectionProps}
          className={cx(styles.section, sectionProps?.className)}
        >
          {leftSection}
        </Box>
      )}
      <Text
        inherit
        component="span"
        {...labelProps}
        className={cx(styles.label, labelProps?.className)}
      >
        {children}
      </Text>
      {onRemove === undefined ? null : (
        <ButtonClose
          size={size === "xs" || size === "sm" ? "xs" : "sm"}
          aria-label={
            typeof children === "string" || typeof children === "number"
              ? `${removeLabel}: ${String(children)}`
              : removeLabel
          }
          disabled={disabled}
          onPress={onRemove}
          {...removeProps}
          className={cx(styles.remove, removeProps?.className)}
        />
      )}
    </span>
  );
}

TagBody.displayName = "Tag.Body";
