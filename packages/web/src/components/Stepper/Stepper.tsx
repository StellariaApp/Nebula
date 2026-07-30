"use client";

import type { ReactElement, ReactNode } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Stepper.css.js";
import {
  bulletBg,
  bulletBorder,
  bulletBorderWidth,
  bulletFg,
  trackDone,
} from "./Stepper.vars.css.js";
import type { StepperLabels, StepperProps, StepperState } from "./Stepper.types.js";

const DEFAULT_LABELS: StepperLabels = {
  completed: "completado",
  current: "paso actual",
  pending: "pendiente",
  error: "con errores",
};

const CHECK = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function StateOf(index: number, active: number, error: boolean): StepperState {
  if (error) return "error";
  if (index < active) return "completed";
  if (index === active) return "current";
  return "pending";
}

export function Stepper(props: StepperProps): ReactElement {
  const {
    steps,
    active,
    onStepClick,
    children,
    variant = "filled",
    color = "primary",
    size = "md",
    orientation = "horizontal",
    allowNextStepsSelect = false,
    labels,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [bulletBg]: resolved.background,
    [bulletFg]: resolved.foreground,
    [bulletBorder]: resolved.borderColor,
    [bulletBorderWidth]: resolved.borderWidth === "0" ? "1px" : resolved.borderWidth,
    [trackDone]: resolved.foreground,
  });

  const Bullet = (index: number, state: StepperState, icon: ReactNode): ReactNode => {
    if (icon !== undefined && icon !== null) return icon;
    if (state === "completed") return CHECK;
    return index + 1;
  };

  return (
    <div
      className={cx(styles.root, sprinkle_class, rootClassName)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      <ol
        className={cx(styles.list, styles.orientation[orientation], className)}
        data-orientation={orientation}
      >
        {steps.map((step, index) => {
          const state = StateOf(index, active, step.error === true);
          const reachable = allowNextStepsSelect || index <= active;
          const clickable =
            onStepClick !== undefined && reachable && step.disabled !== true && index !== active;

          const body = (
            <>
              <span className={cx(styles.bullet, styles.bulletSize[size])} data-state={state}>
                {Bullet(index, state, step.icon)}
              </span>
              <span className={styles.body}>
                <span className={styles.label}>{step.label}</span>
                {step.description === undefined ? null : (
                  <span className={styles.description}>{step.description}</span>
                )}
              </span>
              <VisuallyHidden>{text[state]}</VisuallyHidden>
            </>
          );

          return (
            <li
              key={index}
              className={styles.item}
              data-state={state}
              {...(state === "current" ? { "aria-current": "step" } : {})}
            >
              {clickable ? (
                <button
                  type="button"
                  className={styles.step}
                  onClick={() => {
                    onStepClick(index);
                  }}
                >
                  {body}
                </button>
              ) : (
                <span className={styles.step} data-static="true">
                  {body}
                </span>
              )}
              {index === steps.length - 1 ? null : (
                <span className={styles.track} data-state={state} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      {children === undefined ? null : <div className={styles.panel}>{children}</div>}
    </div>
  );
}

Stepper.displayName = "Stepper";
