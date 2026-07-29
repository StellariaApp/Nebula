"use client";

import { useRef, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { useColorArea, useColorSlider, useFocusRing, VisuallyHidden } from "react-aria";
import { parseColor, useColorAreaState, useColorSliderState } from "react-stately";
import type { Color } from "react-stately";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./ColorPicker.css.js";
import type { ColorFormat, ColorPickerLabels, ColorPickerProps } from "./ColorPicker.types.js";

const FALLBACK = "#000000";

export function ParseColorValue(raw: string): Color | null {
  if (raw.trim() === "") return null;
  try {
    return parseColor(raw);
  } catch {
    return null;
  }
}

export function FormatColorValue(color: Color, format: ColorFormat): string {
  return color.toString(format);
}

interface AreaProps {
  color: Color;
  onChange: (next: Color) => void;
  disabled: boolean;
  label: string;
}

function ColorArea(props: AreaProps): ReactElement {
  const { color, onChange, disabled, label } = props;
  const input_x = useRef<HTMLInputElement>(null);
  const input_y = useRef<HTMLInputElement>(null);
  const container = useRef<HTMLDivElement>(null);

  const state = useColorAreaState({
    value: color,
    onChange,
    xChannel: "saturation",
    yChannel: "brightness",
    isDisabled: disabled,
  });

  const { colorAreaProps, thumbProps, xInputProps, yInputProps } = useColorArea(
    {
      "aria-label": label,
      isDisabled: disabled,
      inputXRef: input_x,
      inputYRef: input_y,
      containerRef: container,
    },
    state,
  );
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...colorAreaProps}
      ref={container}
      className={styles.area}
      data-disabled={disabled ? "true" : undefined}
      data-focus-visible={isFocusVisible ? "true" : undefined}
      style={{ ...colorAreaProps.style, borderRadius: undefined }}
    >
      <div {...thumbProps} className={styles.thumb} style={thumbProps.style}>
        <VisuallyHidden>
          <input ref={input_x} {...focusProps} {...xInputProps} />
          <input ref={input_y} {...focusProps} {...yInputProps} />
        </VisuallyHidden>
      </div>
    </div>
  );
}

interface ChannelProps {
  color: Color;
  onChange: (next: Color) => void;
  channel: "hue" | "alpha";
  disabled: boolean;
  label: string;
}

function ColorChannel(props: ChannelProps): ReactElement {
  const { color, onChange, channel, disabled, label } = props;
  const track = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const state = useColorSliderState({
    value: color,
    onChange,
    channel,
    orientation: "horizontal",
    isDisabled: disabled,
    locale: "en-US",
  });

  const { trackProps, thumbProps, inputProps } = useColorSlider(
    {
      "aria-label": label,
      isDisabled: disabled,
      channel,
      trackRef: track,
      inputRef: input,
      orientation: "horizontal",
    },
    state,
  );
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <div
      {...trackProps}
      ref={track}
      className={cx(styles.track, channel === "alpha" ? styles.checker : undefined)}
      data-disabled={disabled ? "true" : undefined}
      data-focus-visible={isFocusVisible ? "true" : undefined}
      style={{
        ...trackProps.style,
        ...(channel === "alpha"
          ? { backgroundImage: `${String(trackProps.style?.background ?? "")}` }
          : {}),
      }}
    >
      <div {...thumbProps} className={styles.thumb} style={thumbProps.style}>
        <VisuallyHidden>
          <input ref={input} {...focusProps} {...inputProps} />
        </VisuallyHidden>
      </div>
    </div>
  );
}

function SwatchLabel(labels: ColorPickerLabels | undefined, value: string): string {
  return labels?.swatch === undefined ? value : labels.swatch(value);
}

export function ColorPicker(props: ColorPickerProps): ReactElement {
  const {
    label,
    format = "hex",
    withAlpha = false,
    swatches,
    disabled = false,
    field: nebula_field,
    value,
    defaultValue = FALLBACK,
    onChange,
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    disabled,
  });

  const parsed = ParseColorValue(fp.value) ?? parseColor(FALLBACK);
  const hsb = parsed.toFormat("hsb");

  const Emit = (next: Color): void => {
    fp.onChange(FormatColorValue(next, format));
  };

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
    >
      <ColorArea
        color={hsb}
        onChange={Emit}
        disabled={fp.isDisabled}
        label={labels?.area ?? "Saturación y brillo"}
      />
      <ColorChannel
        color={hsb}
        onChange={Emit}
        channel="hue"
        disabled={fp.isDisabled}
        label={labels?.hue ?? "Tono"}
      />
      {withAlpha ? (
        <ColorChannel
          color={hsb}
          onChange={Emit}
          channel="alpha"
          disabled={fp.isDisabled}
          label={labels?.alpha ?? "Opacidad"}
        />
      ) : null}
      {swatches === undefined || swatches.length === 0 ? null : (
        <div className={styles.swatches} role="group" aria-label={labels?.swatches ?? "Muestras"}>
          {swatches.map((entry) => (
            <button
              key={entry}
              type="button"
              className={styles.swatch}
              style={{ background: entry }}
              aria-label={SwatchLabel(labels, entry)}
              aria-pressed={fp.value === entry}
              data-selected={fp.value === entry ? "true" : undefined}
              disabled={fp.isDisabled}
              onClick={() => {
                const next = ParseColorValue(entry);
                if (next !== null) Emit(next);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

ColorPicker.displayName = "ColorPicker";
