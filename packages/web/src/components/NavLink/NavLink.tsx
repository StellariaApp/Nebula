"use client";

import { useId, type ReactElement } from "react";

import { usePermissionGranted, useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { MotionOff } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./NavLink.css.js";
import type { NavLinkProps } from "./NavLink.types.js";
import * as variables from "./NavLink.vars.css.js";
import { ChevronDown } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const CHEVRON = <ChevronDown />;

export function NavLink(props: NavLinkProps): ReactElement | null {
  const {
    label,
    description,
    href,
    component,
    onPress,
    active = false,
    disabled = false,
    permission,
    permissionMode = "hide",
    variant = "light",
    color = "primary",
    leftSection,
    rightSection,
    children,
    opened,
    defaultOpened = false,
    onOpenChange,
    className,
    leftSectionProps,
    rightSectionProps,
    bodyProps,
    labelProps,
    descriptionProps,
    childrenProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const Element = component ?? "a";

  const { theme } = useTheme();
  const granted = usePermissionGranted(permission);
  const denied = !granted;
  const is_disabled = disabled || (denied && permissionMode === "disable");
  // Solo el escalon del tema: `prefers-reduced-motion` lo lleva la hoja con su consulta.
  const motion_context = { theme, reduced: false };
  const is_off = MotionOff(motion_context);

  const panel_id = useId();
  const has_children = children !== undefined && children !== null;
  const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onOpenChange);

  const resolved = ResolveVariant(variant, color, theme);

  const refs = VariantRefs(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.accent]: refs?.foreground ?? resolved.foreground,
    [variables.activeBg]: refs?.background ?? resolved.background,
    [variables.activeBgHover]: refs?.backgroundHover ?? resolved.backgroundHover,
  });

  const inner = (
    <>
      {active ? (
        <span
          className={styles.indicator}
          data-motion={is_off ? "off" : undefined}
          aria-hidden="true"
        />
      ) : null}
      {leftSection === undefined || leftSection === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...leftSectionProps}
          className={cx(styles.section, leftSectionProps?.className)}
        >
          {leftSection}
        </Box>
      )}
      <Box component="span" {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
        <Text
          inherit
          component="span"
          {...labelProps}
          className={cx(styles.label, labelProps?.className)}
        >
          {label}
        </Text>
        {description === undefined || description === null ? null : (
          <Text
            component="span"
            {...descriptionProps}
            className={cx(styles.description, descriptionProps?.className)}
          >
            {description}
          </Text>
        )}
      </Box>
      {rightSection === undefined || rightSection === null ? null : (
        <Box
          component="span"
          {...rightSectionProps}
          className={cx(styles.section, rightSectionProps?.className)}
        >
          {rightSection}
        </Box>
      )}
      {has_children ? (
        <span
          className={styles.chevron}
          data-open={is_open ? "true" : undefined}
          data-motion={is_off ? "off" : undefined}
        >
          {CHEVRON}
        </span>
      ) : null}
    </>
  );

  const shared = {
    className: cx(styles.root, sprinkle_class, className),
    style: { ...css_vars, ...sprinkle_style },
    "data-active": active ? "true" : undefined,
    "data-disabled": is_disabled ? "true" : undefined,
  };

  if (denied && permissionMode === "hide") return null;

  return has_children ? (
    <>
      <button
        {...shared}
        type="button"
        disabled={is_disabled}
        aria-expanded={is_open}
        aria-controls={panel_id}
        {...(active ? { "aria-current": "page" as const } : {})}
        onClick={() => {
          set_open(!is_open);
          onPress?.();
        }}
      >
        {inner}
      </button>
      <Collapse in={is_open}>
        <Box
          {...childrenProps}
          id={panel_id}
          className={cx(styles.children, childrenProps?.className)}
        >
          {children}
        </Box>
      </Collapse>
    </>
  ) : href !== undefined ? (
    <Element
      {...shared}
      href={is_disabled ? undefined : href}
      {...(active ? { "aria-current": "page" as const } : {})}
      {...(is_disabled ? { "aria-disabled": true } : {})}
    >
      {inner}
    </Element>
  ) : (
    <button
      {...shared}
      type="button"
      disabled={is_disabled}
      {...(active ? { "aria-current": "page" as const } : {})}
      onClick={onPress}
    >
      {inner}
    </button>
  );
}

NavLink.displayName = "NavLink";
