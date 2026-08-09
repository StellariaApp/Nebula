"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Banderole.css.js";
import * as variables from "./Banderole.vars.css.js";
import type { BanderoleProps } from "./Banderole.types.js";
import { Box } from "../Box/Box.js";

export function Banderole(props: BanderoleProps): ReactElement {
  const {
    children,
    variant = "filled",
    color = "primary",
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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bg]: resolved.background,
    [variables.fg]: resolved.foreground,
    [variables.borderColor]: resolved.borderColor,
    [variables.blur]: resolved.backdropFilter,
  });

  return (
    <div
      {...(label === undefined ? {} : { role: "region", "aria-label": label })}
      className={cx(styles.root, sticky ? styles.sticky : undefined, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
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

Banderole.displayName = "Banderole";
