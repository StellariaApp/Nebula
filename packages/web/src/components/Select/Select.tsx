"use client";

import { useRef, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { DismissButton, HiddenSelect, Overlay, useButton, usePopover, useSelect } from "react-aria";
import { Item, useSelectState } from "react-stately";

import { OptionList } from "../../collections/option-list.js";
import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { DisabledKeys, OptionByValue, type SelectOption } from "../../collections/options.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";

import * as styles from "./Select.css.js";
import type { SelectProps } from "./Select.types.js";

const CHEVRON = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function Select(props: SelectProps): ReactElement {
  const {
    data,
    label,
    description,
    placeholder = "Selecciona una opción",
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",

    surface = "outline",
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    renderOption,
    placement = "bottom start",
    maxDropdownHeight,
    emptyLabel,
    className,
    rootClassName,
    name,
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

  const state = useSelectState<SelectOption>({
    items: data,
    selectedKey: fp.value === "" ? null : fp.value,
    onSelectionChange: (key) => {
      fp.onChange(key === null ? "" : String(key));
    },
    disabledKeys: DisabledKeys(data),
    isDisabled: fp.isDisabled,
    children: (option: SelectOption) => (
      <Item key={option.value} textValue={option.label}>
        {option.label}
      </Item>
    ),
  });

  const trigger_ref = useRef<HTMLButtonElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);
  const listbox_ref = useRef<HTMLUListElement>(null);

  const { triggerProps, valueProps, menuProps } = useSelect(
    {
      isDisabled: fp.isDisabled,
      isRequired: required,
      ...(label === undefined ? { "aria-label": placeholder } : {}),
    },
    state,
    trigger_ref,
  );

  const { buttonProps } = useButton(triggerProps, trigger_ref);

  const { popoverProps, underlayProps } = usePopover(
    { triggerRef: trigger_ref, popoverRef: popover_ref, placement, offset: 6 },
    state,
  );

  const selected = OptionByValue(data, fp.value);
  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const presence = useOverlayPresence(state.isOpen);

  const Close = (): void => {
    state.close();
  };

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
      {({ "aria-required": _required, ...control }) => (
        <div
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <HiddenSelect
            state={state}
            triggerRef={trigger_ref}
            label={label}
            {...(name === undefined ? {} : { name })}
          />
          <button
            {...buttonProps}
            {...control}
            ref={trigger_ref}
            type="button"
            className={cx(styles.trigger, className)}
            disabled={fp.isDisabled}
            aria-labelledby={
              label === undefined
                ? undefined
                : `${control.id}-label ${String(valueProps.id ?? "")}`.trim()
            }
          >
            <span
              {...valueProps}
              className={cx(styles.value, selected === undefined ? styles.placeholder : undefined)}
            >
              {selected === undefined ? placeholder : selected.label}
            </span>
            <span className={styles.chevron} data-open={state.isOpen ? "true" : undefined}>
              {CHEVRON}
            </span>
          </button>
          {presence.render ? (
            <Overlay>
              {state.isOpen ? <div {...underlayProps} /> : null}
              <OverlayMotion
                {...popoverProps}
                surface="popover"
                open={state.isOpen}
                onExitComplete={presence.OnExitComplete}
                ref={popover_ref}
                className={styles.dropdown}
                style={{
                  ...popoverProps.style,
                  width: trigger_ref.current?.parentElement?.offsetWidth,
                  ...(maxDropdownHeight === undefined ? {} : { maxHeight: maxDropdownHeight }),
                }}
              >
                <DismissButton onDismiss={Close} />
                <OptionList
                  state={state}
                  listBoxRef={listbox_ref}
                  listBoxProps={menuProps as unknown as Record<string, unknown>}
                  {...(renderOption === undefined ? {} : { renderOption })}
                  {...(emptyLabel === undefined ? {} : { emptyLabel })}
                />
                <DismissButton onDismiss={Close} />
              </OverlayMotion>
            </Overlay>
          ) : null}
        </div>
      )}
    </FormField>
  );
}

Select.displayName = "Select";
