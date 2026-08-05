"use client";

import { useId, useRef, type ReactElement, type ReactNode } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from "react-aria";
import { useSliderState } from "react-stately";

import type { ColorExtended, NebulaTheme, Size } from "@stellaria/nebula-tokens";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Slider.css.js";
import { sliderColor, trackBg, trackBorder, trackBorderWidth } from "./Slider.vars.css.js";
import type { SliderMark, SliderVariant } from "./Slider.types.js";

interface ThumbProps {
  index: number;
  state: ReturnType<typeof useSliderState>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  size: Size;
  disabled: boolean;
  label: string | undefined;
  labelledBy: string | undefined;
  name: string | undefined;
}

function Thumb(props: ThumbProps): ReactElement {
  const { index, state, trackRef, size, disabled, label, labelledBy, name } = props;
  const input_ref = useRef<HTMLInputElement>(null);
  const own_id = useId();

  const { focusProps, isFocusVisible } = useFocusRing();
  const { thumbProps, inputProps, isDragging } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef: input_ref,
      isDisabled: disabled,
      ...(label === undefined ? {} : { "aria-label": label }),
      ...(name === undefined ? {} : { name }),
    },
    state,
  );

  const described =
    labelledBy === undefined
      ? undefined
      : label === undefined
        ? labelledBy
        : `${labelledBy} ${own_id}`;

  return (
    <div
      {...thumbProps}
      className={cx(styles.thumb, styles.thumb_size[size])}
      data-dragging={isDragging ? "true" : undefined}
      data-focus-visible={isFocusVisible ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      <VisuallyHidden>
        <input
          ref={input_ref}
          {...mergeProps(inputProps, focusProps)}
          id={own_id}
          {...(described === undefined ? {} : { "aria-labelledby": described })}
        />
      </VisuallyHidden>
    </div>
  );
}

function TrackVars(
  variant: SliderVariant | undefined,
  color: ColorExtended,
  theme: NebulaTheme,
): Record<string, string> {
  if (variant === undefined) return {};
  const resolved = ResolveVariant(variant, color, theme);
  return {
    [trackBg]: resolved.background,
    [trackBorder]: resolved.borderColor,
    [trackBorderWidth]: resolved.borderWidth,
  };
}

export interface SliderBaseProps {
  values: number[];
  onChange: (values: number[]) => void;
  onChangeEnd?: ((values: number[]) => void) | undefined;
  min: number;
  max: number;
  step: number;
  size: Size;
  color: ColorExtended;
  variant?: SliderVariant | undefined;
  disabled: boolean;
  marks?: readonly SliderMark[] | undefined;
  withValue: boolean;
  formatValue?: ((value: number) => string) | undefined;
  thumbLabels?: readonly string[] | undefined;
  ariaLabel?: string | undefined;
  ariaLabelledBy?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
}

export function SliderBase(props: SliderBaseProps): ReactElement {
  const {
    values,
    onChange,
    onChangeEnd,
    min,
    max,
    step,
    size,
    color,
    variant,
    disabled,
    marks,
    withValue,
    formatValue,
    thumbLabels,
    ariaLabel,
    ariaLabelledBy,
    name,
    className,
  } = props;

  const track_ref = useRef<HTMLDivElement>(null);
  const formatter = useNumberFormatter();
  const { theme } = useTheme();

  const state = useSliderState({
    value: values,
    onChange,
    ...(onChangeEnd === undefined ? {} : { onChangeEnd }),
    minValue: min,
    maxValue: max,
    step,
    isDisabled: disabled,
    numberFormatter: formatter,
  });

  const { groupProps, trackProps, outputProps } = useSlider(
    {
      isDisabled: disabled,
      ...(ariaLabel === undefined ? {} : { "aria-label": ariaLabel }),
      ...(ariaLabelledBy === undefined ? {} : { "aria-labelledby": ariaLabelledBy }),
    },
    state,
    track_ref,
  );

  const Display = (): ReactNode => {
    const shown = values.map((v) => (formatValue === undefined ? String(v) : formatValue(v)));
    return shown.join(" – ");
  };

  const with_marks = marks !== undefined && marks.length > 0;
  const start = state.getThumbPercent(0);
  const end = values.length > 1 ? state.getThumbPercent(values.length - 1) : start;
  const left = values.length > 1 ? Math.min(start, end) : 0;
  const width = values.length > 1 ? Math.abs(end - start) : start;

  return (
    <div {...groupProps} className={cx(styles.row, className)}>
      <div
        className={cx(styles.root, with_marks ? styles.root_with_marks : undefined)}
        style={assignInlineVars({ [sliderColor]: ResolveAccent(color, "600") })}
        data-disabled={disabled ? "true" : undefined}
      >
        <div
          {...trackProps}
          ref={track_ref}
          className={cx(styles.track, styles.track_size[size])}
          style={assignInlineVars(TrackVars(variant, color, theme))}
          data-disabled={disabled ? "true" : undefined}
        >
          <div
            className={styles.fill}
            style={{ left: `${String(left * 100)}%`, width: `${String(width * 100)}%` }}
            data-disabled={disabled ? "true" : undefined}
          />
          {values.map((_, index) => (
            <Thumb
              key={index}
              index={index}
              state={state}
              trackRef={track_ref}
              size={size}
              disabled={disabled}
              label={thumbLabels?.[index]}
              labelledBy={ariaLabelledBy}
              name={
                name === undefined
                  ? undefined
                  : values.length > 1
                    ? `${name}.${String(index)}`
                    : name
              }
            />
          ))}
          {!with_marks || marks === undefined ? null : (
            <div className={styles.marks} aria-hidden="true">
              {marks.map((entry) => (
                <span
                  key={entry.value}
                  className={styles.mark}
                  style={{ left: `${String(((entry.value - min) / (max - min)) * 100)}%` }}
                >
                  {entry.label ?? entry.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {withValue ? (
        <output {...outputProps} className={styles.output}>
          {Display()}
        </output>
      ) : null}
    </div>
  );
}

SliderBase.displayName = "SliderBase";
