"use client";

import { useRef, useState, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import {
  DismissButton,
  Overlay,
  useButton,
  useFocusRing,
  usePopover,
  mergeProps,
} from "react-aria";
import { useOverlayTriggerState } from "react-stately";

import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import { ColorPicker, ParseColorValue } from "./ColorPicker.js";
import * as styles from "./ColorPicker.css.js";
import type { ColorInputProps } from "./ColorPicker.types.js";

export function ColorInput(props: ColorInputProps): ReactElement {
  const {
    label,
    description,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    surface = "outline",
    format = "hex",
    withAlpha = false,
    withPicker = true,
    swatches,
    placement = "bottom start",
    placeholder = "#000000",
    openLabel = "Abrir selector de color",
    labels,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    name,
    className,
    rootClassName,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const fp = useFieldProps<string>({
    field: nebula_field,
    value,
    defaultValue,
    onChange,
    error,
    disabled,
    required,
  });

  const [draft, set_draft] = useState<string | null>(null);
  const shown = draft ?? fp.value;
  const parsed = ParseColorValue(fp.value);
  const malformed = fp.value.trim() !== "" && parsed === null;
  const form_error =
    fp.errorMessage ??
    (malformed ? "Color no reconocido" : undefined) ??
    (fp.isInvalid ? true : undefined);
  const invalid = fp.isInvalid || malformed;

  const state = useOverlayTriggerState({});
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);

  const { buttonProps } = useButton(
    {
      isDisabled: fp.isDisabled || readOnly,
      onPress: () => {
        state.open();
      },
    },
    trigger_ref,
  );
  const { focusProps, isFocusVisible } = useFocusRing();
  const { popoverProps, underlayProps } = usePopover(
    { triggerRef: trigger_ref, popoverRef: popover_ref, placement, offset: 6 },
    state,
  );
  const presence = useOverlayPresence(state.isOpen);

  return (
    <FormField
      label={label}
      description={description}
      error={form_error}
      errorDisplay={errorDisplay}
      status={fp.status}
      required={required}
      className={cx(sprinkle_class, rootClassName)}
      style={sprinkle_style}
    >
      {(control) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={invalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <span
            className={cx(styles.preview, styles.previewSize[size], styles.checker)}
            style={{ background: parsed === null ? undefined : fp.value }}
            aria-hidden="true"
          />
          <input
            {...control}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={invalid ? true : undefined}
            className={cx(field.input, className)}
            value={shown}
            placeholder={placeholder}
            disabled={fp.isDisabled}
            readOnly={readOnly}
            required={required}
            {...(name === undefined ? {} : { name })}
            onChange={(event) => {
              set_draft(event.target.value);
              fp.onChange(event.target.value);
            }}
            onBlur={() => {
              set_draft(null);
            }}
          />
          {withPicker ? (
            <button
              {...mergeProps(buttonProps, focusProps)}
              ref={trigger_ref}
              type="button"
              aria-label={openLabel}
              aria-haspopup="dialog"
              aria-expanded={state.isOpen}
              className={styles.trigger}
              disabled={fp.isDisabled || readOnly}
              data-focus-visible={isFocusVisible ? "true" : undefined}
            >
              <span
                className={cx(styles.preview, styles.previewSize[size], styles.checker)}
                style={{ background: parsed === null ? undefined : fp.value }}
              />
            </button>
          ) : null}
          {withPicker && presence.render ? (
            <Overlay>
              {state.isOpen ? <div {...underlayProps} /> : null}
              <OverlayMotion
                {...popoverProps}
                surface="popover"
                open={state.isOpen}
                onExitComplete={presence.OnExitComplete}
                ref={popover_ref}
                className={styles.dropdown}
                style={popoverProps.style}
              >
                <DismissButton
                  onDismiss={() => {
                    state.close();
                  }}
                />
                <ColorPicker
                  label={openLabel}
                  format={format}
                  withAlpha={withAlpha}
                  swatches={swatches}
                  disabled={fp.isDisabled}
                  value={fp.value}
                  onChange={(next) => {
                    set_draft(null);
                    fp.onChange(next);
                  }}
                  labels={labels}
                />
                <DismissButton
                  onDismiss={() => {
                    state.close();
                  }}
                />
              </OverlayMotion>
            </Overlay>
          ) : null}
        </div>
      )}
    </FormField>
  );
}

ColorInput.displayName = "ColorInput";
