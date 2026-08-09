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
import { Box } from "../Box/Box.js";
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
    previewProps,
    triggerProps,
    dropdownProps,
    placeholder = "#000000",
    openLabel = "Open colour picker",
    labels,
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    name,
    className,
    rootClassName,
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
    ...style_rest
  } = props;
  const field_slots = {
    labelProps,
    descriptionProps,
    requiredProps,
    headerProps,
    bodyProps,
    errorProps,
  };
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
    (malformed ? "Colour not recognised" : undefined) ??
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
      {...field_slots}
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
          <Box
            component="span"
            aria-hidden="true"
            {...previewProps}
            className={cx(
              styles.preview,
              styles.preview_size[size],
              styles.checker,
              previewProps?.className,
            )}
            style={{
              ...previewProps?.style,
              ...(parsed === null ? {} : { background: fp.value }),
            }}
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
              disabled={fp.isDisabled || readOnly}
              data-focus-visible={isFocusVisible ? "true" : undefined}
              {...triggerProps}
              className={cx(styles.trigger, triggerProps?.className)}
            >
              <Box
                component="span"
                {...previewProps}
                className={cx(
                  styles.preview,
                  styles.preview_size[size],
                  styles.checker,
                  previewProps?.className,
                )}
                style={{
                  ...previewProps?.style,
                  background: parsed === null ? undefined : fp.value,
                }}
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
                {...dropdownProps}
                className={cx(styles.dropdown, dropdownProps?.className)}
                style={{ ...dropdownProps?.style, ...popoverProps.style }}
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
