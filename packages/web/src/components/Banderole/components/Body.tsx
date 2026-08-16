import type { CSSProperties, ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { ButtonClose } from "../../ButtonClose/ButtonClose.js";

import * as styles from "../Banderole.css.js";
import type { BanderoleProps } from "../Banderole.types.js";

export interface BanderoleBodyProps extends Omit<BanderoleProps, "color"> {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function BanderoleBody(props: BanderoleBodyProps): ReactElement {
  const {
    children,
    variant = "filled",
    icon,
    actions,
    onClose,
    closeLabel = "Dismiss notice",
    label,
    sticky = false,
    className,
    iconProps,
    bodyProps,
    actionsProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      {...(label === undefined ? {} : { role: "region", "aria-label": label })}
      className={cx(
        styles.root,
        sticky ? styles.sticky : undefined,
        tone,
        sprinkle_class,
        className,
      )}
      style={{ ...toneStyle, ...sprinkle_style }}
      data-variant={variant}
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
        {children}
      </Box>
      {actions === undefined ? null : (
        <Box {...actionsProps} className={cx(styles.actions, actionsProps?.className)}>
          {actions}
        </Box>
      )}
      {onClose === undefined ? null : (
        <ButtonClose size="sm" aria-label={closeLabel} onPress={onClose} />
      )}
    </div>
  );
}

BanderoleBody.displayName = "Banderole.Body";
