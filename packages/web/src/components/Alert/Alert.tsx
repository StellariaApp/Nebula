"use client";

import { useId, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Alert.css.js";
import type { AlertProps } from "./Alert.types.js";
import * as variables from "./Alert.vars.css.js";

const DEFAULT_LIVE: Record<string, "status" | "alert"> = {
  error: "alert",
  warning: "alert",
};

export function Alert(props: AlertProps): ReactElement {
  const {
    children,
    title,
    color = "info",
    variant = "light",
    icon,
    withCloseButton = false,
    onClose,
    closeLabel = "Cerrar aviso",
    live,
    actions,
    className,
    titleProps,
    iconProps,
    bodyProps,
    messageProps,
    actionsProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const role = live ?? DEFAULT_LIVE[color] ?? "status";

  const css_vars = assignInlineVars({
    [variables.bg]: resolved.background,
    [variables.fg]: resolved.foreground,
    [variables.accent]:
      variant === "filled" ? vars.color.text.onPrimary : ResolveAccent(color, "600"),
    [variables.borderColor]: resolved.borderColor,
  });

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      {...(role === "off" ? {} : { role })}
      {...(title === undefined ? {} : { "aria-labelledby": title_id })}
    >
      {icon === undefined || icon === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...iconProps}
          className={cx(styles.icon, iconProps?.className)}
        >
          {icon}
        </Box>
      )}
      <Box {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
        {title === undefined ? null : (
          <Text id={title_id} {...titleProps} className={cx(styles.title, titleProps?.className)}>
            {title}
          </Text>
        )}
        {children === undefined || children === null ? null : (
          <Box {...messageProps} className={cx(styles.message, messageProps?.className)}>
            {children}
          </Box>
        )}
        {actions === undefined || actions === null ? null : (
          <Box {...actionsProps} className={cx(styles.actions, actionsProps?.className)}>
            {actions}
          </Box>
        )}
      </Box>
      {withCloseButton ? (
        <ButtonClose aria-label={closeLabel} size="sm" variant="ghost" onPress={onClose} />
      ) : null}
    </div>
  );
}

Alert.displayName = "Alert";
