import { useId, type CSSProperties, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { ButtonClose } from "../../ButtonClose/ButtonClose.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Alert.css.js";
import type { AlertProps } from "../Alert.types.js";

const DEFAULT_LIVE: Record<string, "status" | "alert"> = {
  error: "alert",
  warning: "alert",
};

export interface AlertBodyProps extends AlertProps {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function AlertBody(props: AlertBodyProps): ReactElement {
  const {
    children,
    title,
    color = "info",
    variant = "light",
    icon,
    withCloseButton = false,
    onClose,
    closeLabel = "Dismiss notice",
    live,
    actions,
    className,
    reveal,
    titleProps,
    iconProps,
    bodyProps,
    messageProps,
    actionsProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const role = live ?? DEFAULT_LIVE[color] ?? "status";

  return (
    <Box
      className={cx(styles.root, tone, sprinkle_class, className)}
      style={{ ...toneStyle, ...sprinkle_style }}
      {...(reveal === undefined ? {} : { reveal })}
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
          <Text {...titleProps} id={title_id} className={cx(styles.title, titleProps?.className)}>
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
    </Box>
  );
}

AlertBody.displayName = "Alert.Body";
