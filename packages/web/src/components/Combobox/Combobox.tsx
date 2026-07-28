"use client";

import { useId, useMemo, useRef, useState, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { DismissButton, Overlay, useComboBox, useFilter, usePopover } from "react-aria";
import { Item, useComboBoxState } from "react-stately";

import { OptionList } from "../../collections/option-list.js";
import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { DisabledKeys, OptionByValue, type SelectOption } from "../../collections/options.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import * as select_styles from "../Select/Select.css.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import type { ComboboxProps } from "./Combobox.types.js";

const CHEVRON = (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function Combobox(props: ComboboxProps): ReactElement {
  const {
    data,
    label,
    description,
    placeholder,
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",
    field: nebula_field,
    value,
    defaultValue = "",
    onChange,
    inputValue,
    onInputChange,
    allowsCustomValue = false,
    menuTrigger = "input",
    renderOption,
    placement = "bottom start",
    maxDropdownHeight,
    emptyLabel,
    toggleLabel = "Mostrar opciones",
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

  const { contains } = useFilter({ sensitivity: "base" });

  const auto_id = useId();
  const input_id = `${auto_id}-combobox`;

  const [draft, set_draft] = useState<string | null>(null);
  const selected = OptionByValue(data, fp.value);
  const query = inputValue ?? draft ?? selected?.label ?? "";

  const HandleInputChange = (next: string): void => {
    set_draft(next);
    onInputChange?.(next);
  };

  const shows_selection = selected !== undefined && query === selected.label;

  const items = useMemo(
    () =>
      query === "" || shows_selection
        ? [...data]
        : data.filter((option) => contains(option.label, query)),
    [data, query, shows_selection, contains],
  );

  const state = useComboBoxState<SelectOption>({
    items,
    selectedKey: fp.value === "" ? null : fp.value,
    onSelectionChange: (key) => {
      set_draft(null);
      fp.onChange(key === null ? "" : String(key));
    },
    disabledKeys: DisabledKeys(data),
    isDisabled: fp.isDisabled,
    isRequired: required,
    allowsCustomValue,
    allowsEmptyCollection: true,
    menuTrigger,
    inputValue: query,
    onInputChange: HandleInputChange,
    children: (option: SelectOption) => (
      <Item key={option.value} textValue={option.label}>
        {option.label}
      </Item>
    ),
  });

  const input_ref = useRef<HTMLInputElement>(null);
  const trigger_ref = useRef<HTMLButtonElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);
  const listbox_ref = useRef<HTMLUListElement>(null);

  const { inputProps, listBoxProps, buttonProps: trigger_props } = useComboBox(
    {
      inputRef: input_ref,
      buttonRef: trigger_ref,
      popoverRef: popover_ref,
      listBoxRef: listbox_ref,
      isDisabled: fp.isDisabled,
      isRequired: required,
      ...(label === undefined
        ? { "aria-label": toggleLabel }
        : { "aria-labelledby": `${input_id}-label` }),
      ...(name === undefined ? {} : { name }),
    },
    state,
  );

  const { popoverProps, underlayProps } = usePopover(
    {
      triggerRef: input_ref,
      popoverRef: popover_ref,
      placement,
      offset: 6,
      isNonModal: true,
    },
    state,
  );

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const presence = useOverlayPresence(state.isOpen);

  const Close = (): void => {
    state.close();
  };

  return (
    <FormField
      id={input_id}
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
          className={field.field({ size })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <input
            {...inputProps}
            id={control.id}
            aria-describedby={control["aria-describedby"]}
            aria-invalid={control["aria-invalid"]}
            ref={input_ref}
            className={cx(field.input, className)}
            {...(placeholder === undefined ? {} : { placeholder })}
          />
          <UnstyledButton
            {...trigger_props}
            ref={trigger_ref}
            className={field.section}
            disabled={fp.isDisabled}
            tabIndex={state.isOpen ? -1 : undefined}
            {...(label === undefined ? { "aria-label": toggleLabel } : {})}
          >
            <span
              className={select_styles.chevron}
              data-open={state.isOpen ? "true" : undefined}
              aria-hidden="true"
            >
              {CHEVRON}
            </span>
          </UnstyledButton>
          {presence.render ? (
            <Overlay>
              {state.isOpen ? <div {...underlayProps} /> : null}
              <OverlayMotion
                {...popoverProps}
                open={state.isOpen}
                onExitComplete={presence.OnExitComplete}
                ref={popover_ref}
                className={select_styles.dropdown}
                style={{
                  ...popoverProps.style,
                  width: input_ref.current?.parentElement?.offsetWidth,
                  ...(maxDropdownHeight === undefined ? {} : { maxHeight: maxDropdownHeight }),
                }}
              >
                <DismissButton onDismiss={Close} />
                <OptionList
                  state={state}
                  listBoxRef={listbox_ref}
                  listBoxProps={listBoxProps as unknown as Record<string, unknown>}
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

Combobox.displayName = "Combobox";
