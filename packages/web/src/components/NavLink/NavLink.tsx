"use client";

import { useId, type ReactElement } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

import { ScaleShade } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./NavLink.css.js";
import type { NavLinkProps } from "./NavLink.types.js";
import { accent, activeBg } from "./NavLink.vars.css.js";

const CHEVRON = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function NavLink(props: NavLinkProps): ReactElement {
  const {
    label,
    description,
    href,
    onPress,
    active = false,
    disabled = false,
    color = "primary",
    leftSection,
    rightSection,
    children,
    opened,
    defaultOpened = false,
    onOpenChange,
    className,
  } = props;

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const spring = theme.motion.spring.default;

  const panel_id = useId();
  const has_children = children !== undefined && children !== null;
  const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onOpenChange);

  const css_vars = assignInlineVars({
    [accent]: ScaleShade(color, "700"),
    [activeBg]: `color-mix(in srgb, ${ScaleShade(color, "500")} 14%, transparent)`,
  });

  const transition = is_off
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: spring.stiffness,
        damping: spring.damping,
        mass: spring.mass,
      };

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
    className: cx(styles.root, className),
    style: css_vars,
    "data-active": active ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
  };

  return (
    <LazyMotion features={domAnimation} strict>
      {has_children ? (
        <>
          <button
            {...shared}
            type="button"
            disabled={disabled}
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
          href={disabled ? undefined : href}
          {...(active ? { "aria-current": "page" as const } : {})}
          {...(disabled ? { "aria-disabled": true } : {})}
        >
          {inner}
        </a>
      ) : (
        <button
          {...shared}
          type="button"
          disabled={disabled}
          {...(active ? { "aria-current": "page" as const } : {})}
          onClick={onPress}
        >
          {inner}
        </button>
      )}
    </LazyMotion>
  );
}

NavLink.displayName = "NavLink";
