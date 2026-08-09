"use client";

import type { ReactElement, ReactNode } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Stepper.css.js";
import * as variables from "./Stepper.vars.css.js";
import type { StepperLabels, StepperProps, StepperState } from "./Stepper.types.js";
import { Check } from "../../glyphs/index.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const DEFAULT_LABELS: StepperLabels = {
  completed: "completado",
  current: "paso actual",
  pending: "pendiente",
  error: "with errors",
};

const CHECK = <Check strokeWidth={3} />;

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
    listProps,
    itemProps,
    stepProps,
    bulletProps,
    bodyProps,
    labelProps,
    descriptionProps,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bulletBg]: resolved.background,
    [variables.bulletFg]: resolved.foreground,
    [variables.bulletBorder]: resolved.borderColor,
    [variables.bulletBorderWidth]: resolved.borderWidth === "0" ? "1px" : resolved.borderWidth,
    [variables.trackDone]: resolved.foreground,
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
      <Box
        component="ol"
        {...listProps}
        className={cx(
          styles.list,
          styles.orientation[orientation],
          className,
          listProps?.className,
        )}
        data-orientation={orientation}
      >
        {steps.map((step, index) => {
          const state = StateOf(index, active, step.error === true);
          const reachable = allowNextStepsSelect || index <= active;
          const clickable =
            onStepClick !== undefined && reachable && step.disabled !== true && index !== active;

          const body = (
            <>
              <Box
                component="span"
                data-state={state}
                {...bulletProps}
                className={cx(styles.bullet, styles.bullet_size[size], bulletProps?.className)}
              >
                {Bullet(index, state, step.icon)}
              </Box>
              <Box
                component="span"
                {...bodyProps}
                className={cx(styles.body, bodyProps?.className)}
              >
                <Text
                  component="span"
                  {...labelProps}
                  className={cx(styles.label, labelProps?.className)}
                >
                  {step.label}
                </Text>
                {step.description === undefined ? null : (
                  <Text
                    component="span"
                    {...descriptionProps}
                    className={cx(styles.description, descriptionProps?.className)}
                  >
                    {step.description}
                  </Text>
                )}
              </Box>
              <VisuallyHidden>{text[state]}</VisuallyHidden>
            </>
          );

          return (
            <Box
              component="li"
              key={index}
              {...itemProps}
              className={cx(styles.item, itemProps?.className)}
              data-state={state}
              {...(state === "current" ? { "aria-current": "step" } : {})}
            >
              {clickable ? (
                <Box
                  component="button"
                  type="button"
                  {...stepProps}
                  className={cx(styles.step, stepProps?.className)}
                  onClick={() => {
                    onStepClick(index);
                  }}
                >
                  {body}
                </Box>
              ) : (
                <Box
                  component="span"
                  data-static="true"
                  {...stepProps}
                  className={cx(styles.step, stepProps?.className)}
                >
                  {body}
                </Box>
              )}
              {index === steps.length - 1 ? null : (
                <span className={styles.track} data-state={state} aria-hidden="true" />
              )}
            </Box>
          );
        })}
      </Box>
      {children === undefined ? null : <div className={styles.panel}>{children}</div>}
    </div>
  );
}

Stepper.displayName = "Stepper";
