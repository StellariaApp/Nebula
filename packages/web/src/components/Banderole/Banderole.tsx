"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Banderole.css.js";
import { bg, blur, borderColor, fg } from "./Banderole.vars.css.js";
import type { BanderoleProps } from "./Banderole.types.js";

export function Banderole(props: BanderoleProps): ReactElement {
  const {
    children,
    variant = "filled",
    color = "primary",
    icon,
    actions,
    onClose,
    closeLabel = "Cerrar aviso",
    label,
    sticky = false,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [bg]: resolved.background,
    [fg]: resolved.foreground,
    [borderColor]: resolved.borderColor,
    [blur]: resolved.backdropFilter,
  });

  return (
    <div
      {...(label === undefined ? {} : { role: "region", "aria-label": label })}
      className={cx(styles.root, sticky ? styles.sticky : undefined, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
    >
      {icon === undefined || icon === null ? null : (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.body}>{children}</div>
      {actions === undefined ? null : <div className={styles.actions}>{actions}</div>}
      {onClose === undefined ? null : (
        <ButtonClose size="sm" aria-label={closeLabel} onPress={onClose} />
      )}
    </div>
  );
}

Banderole.displayName = "Banderole";
