import type { CSSProperties, ReactElement, ReactNode } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Check } from "../../../glyphs/index.js";
import { Box } from "../../Box/Box.js";
import { Text } from "../../Text/Text.js";
import { VisuallyHidden } from "../../VisuallyHidden/VisuallyHidden.js";

import * as styles from "../Stepper.css.js";
import type { StepperLabels, StepperProps, StepperState } from "../Stepper.types.js";

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

export interface StepperBodyProps extends Omit<StepperProps, "color" | "variant"> {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function StepperBody(props: StepperBodyProps): ReactElement {
  const {
    steps,
    active,
    onStepClick,
    children,
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
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };

  const Bullet = (index: number, state: StepperState, icon: ReactNode): ReactNode => {
    if (icon !== undefined && icon !== null) return icon;
    if (state === "completed") return CHECK;
    return index + 1;
  };

  return (
    <div
      className={cx(styles.root, tone, sprinkle_class, rootClassName)}
      style={{ ...toneStyle, ...sprinkle_style }}
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

StepperBody.displayName = "Stepper.Body";
