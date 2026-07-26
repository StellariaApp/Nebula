"use client";

import { forwardRef, useId, type Ref } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";

import { vars } from "../../theme/contract.css.js";
import { ScaleShade } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { Collapse } from "../Collapse/Collapse.js";

import * as styles from "./NavLink.css.js";
import type { NavLinkProps } from "./NavLink.types.js";
import { bg, fg } from "./NavLink.vars.css.js";

const CHEVRON = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

function Palette(
  active: boolean,
  color: NonNullable<NavLinkProps["color"]>,
): { bg: string; fg: string } {
  if (!active) return { bg: "transparent", fg: vars.color.text.primary };
  return {
    bg: `color-mix(in srgb, ${ScaleShade(color, "500")} 16%, transparent)`,
    fg: ScaleShade(color, "700"),
  };
}

export const NavLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, NavLinkProps>(
  function NavLink(props, ref) {
    const {
      label,
      description,
      leftSection,
      rightSection,
      active = false,
      disabled = false,
      color = "primary",
      href,
      onPress,
      children,
      opened: opened_prop,
      defaultOpened = false,
      onOpenedChange,
      className,
      "aria-label": aria_label,
    } = props;

    const has_children = children !== undefined && children !== null;
    const panel_id = useId();
    const { theme } = useTheme();
    const prefers_reduced = useReducedMotion();
    const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
    const spring = theme.motion.spring.default;

    const [opened, set_opened] = useUncontrolled(opened_prop, defaultOpened, onOpenedChange);

    const palette = Palette(active, color);
    const css_vars = assignInlineVars({ [bg]: palette.bg, [fg]: palette.fg });

    const class_name = cx(
      styles.root({ withDescription: description !== undefined }),
      className,
    );

    const spring_transition = {
      type: "spring" as const,
      stiffness: spring.stiffness,
      damping: spring.damping,
      mass: spring.mass,
    };

    const motion_props =
      is_off || disabled
        ? {}
        : {
            whileTap: { scale: 0.99 },
            transition: spring_transition,
          };

    const Toggle = (): void => {
      set_opened(!opened);
      onPress?.();
    };

    const content = (
      <>
        {leftSection === undefined || leftSection === null ? null : (
          <span className={styles.icon} aria-hidden="true">
            {leftSection}
          </span>
        )}
        <span className={styles.body}>
          <span className={styles.label}>{label}</span>
          {description === undefined || description === null ? null : (
            <span className={styles.description}>{description}</span>
          )}
        </span>
        {has_children ? (
          <m.span
            className={styles.chevron}
            animate={{ rotate: opened ? 90 : 0 }}
            transition={is_off ? { duration: 0 } : spring_transition}
          >
            {CHEVRON}
          </m.span>
        ) : rightSection === undefined || rightSection === null ? null : (
          <span className={styles.icon} aria-hidden="true">
            {rightSection}
          </span>
        )}
      </>
    );

    return (
      <LazyMotion features={domAnimation} strict>
        <div className={styles.wrapper}>
          {has_children ? (
            <m.button
              ref={ref as Ref<HTMLButtonElement>}
              type="button"
              className={class_name}
              style={css_vars}
              disabled={disabled}
              aria-expanded={opened}
              aria-controls={panel_id}
              data-active={active ? "true" : undefined}
              onClick={Toggle}
              {...motion_props}
              {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
            >
              {content}
            </m.button>
          ) : href !== undefined ? (
            <m.a
              ref={ref as Ref<HTMLAnchorElement>}
              href={disabled ? undefined : href}
              className={class_name}
              style={css_vars}
              data-active={active ? "true" : undefined}
              data-disabled={disabled ? "true" : undefined}
              aria-current={active ? "page" : undefined}
              aria-disabled={disabled ? "true" : undefined}
              tabIndex={disabled ? -1 : undefined}
              onClick={disabled ? undefined : onPress}
              {...motion_props}
              {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
            >
              {content}
            </m.a>
          ) : (
            <m.button
              ref={ref as Ref<HTMLButtonElement>}
              type="button"
              className={class_name}
              style={css_vars}
              disabled={disabled}
              data-active={active ? "true" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={onPress}
              {...motion_props}
              {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
            >
              {content}
            </m.button>
          )}
          {has_children ? (
            <Collapse in={opened}>
              <div id={panel_id} role="group" className={styles.children}>
                {children}
              </div>
            </Collapse>
          ) : null}
        </div>
      </LazyMotion>
    );
  },
);

NavLink.displayName = "NavLink";
