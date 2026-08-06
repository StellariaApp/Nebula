"use client";

import { useId, type ReactElement } from "react";

import { usePermissionGranted, useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion } from "motion/react";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./NavLink.css.js";
import type { NavLinkProps } from "./NavLink.types.js";
import * as variables from "./NavLink.vars.css.js";
import { ChevronDown } from "../../glyphs/index.js";

const CHEVRON = <ChevronDown />;

export function NavLink(props: NavLinkProps): ReactElement | null {
  const {
    label,
    description,
    href,
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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const granted = usePermissionGranted(permission);
  const denied = !granted;
  const is_disabled = disabled || (denied && permissionMode === "disable");
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);
  const transition = Spring("default", motion_context);

  const panel_id = useId();
  const has_children = children !== undefined && children !== null;
  const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onOpenChange);

  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.accent]: resolved.foreground,
    [variables.activeBg]: resolved.background,
    [variables.activeBgHover]: resolved.backgroundHover,
  });

  const inner = (
    <>
      {active ? (
        <m.span
          className={styles.indicator}
          initial={is_off ? false : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={transition}
          aria-hidden="true"
        />
      ) : null}
      {leftSection === undefined || leftSection === null ? null : (
        <span className={styles.section} aria-hidden="true">
          {leftSection}
        </span>
      )}
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description === undefined || description === null ? null : (
          <span className={styles.description}>{description}</span>
        )}
      </span>
      {rightSection === undefined || rightSection === null ? null : (
        <span className={styles.section}>{rightSection}</span>
      )}
      {has_children ? (
        <m.span
          className={styles.chevron}
          animate={{ rotate: is_open ? 180 : 0 }}
          transition={transition}
        >
          {CHEVRON}
        </m.span>
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
        <div id={panel_id} className={styles.children}>
          {children}
        </div>
      </Collapse>
    </>
  ) : href !== undefined ? (
    <a
      {...shared}
      href={is_disabled ? undefined : href}
      {...(active ? { "aria-current": "page" as const } : {})}
      {...(is_disabled ? { "aria-disabled": true } : {})}
    >
      {inner}
    </a>
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
