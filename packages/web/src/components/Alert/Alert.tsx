"use client";

import { useId, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Alert.css.js";
import type { AlertProps } from "./Alert.types.js";
import { accent, bg, borderColor, fg } from "./Alert.vars.css.js";

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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const title_id = useId();
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);
  const role = live ?? DEFAULT_LIVE[color] ?? "status";

  const css_vars = assignInlineVars({
    [bg]: resolved.background,
    [fg]: resolved.foreground,
    [accent]: variant === "filled" ? vars.color.text.onPrimary : ResolveAccent(color, "600"),
    [borderColor]: resolved.borderColor,
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
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.body}>
        {title === undefined ? null : (
          <p id={title_id} className={styles.title}>
            {title}
          </p>
        )}
        {children === undefined || children === null ? null : (
          <div className={styles.message}>{children}</div>
        )}
        {actions === undefined || actions === null ? null : (
          <div className={styles.actions}>{actions}</div>
        )}
      </div>
      {withCloseButton ? (
        <ButtonClose aria-label={closeLabel} size="sm" variant="ghost" onPress={onClose} />
      ) : null}
    </div>
  );
}

Alert.displayName = "Alert";
