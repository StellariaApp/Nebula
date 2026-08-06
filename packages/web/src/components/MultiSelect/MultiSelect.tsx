"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from "react";

import { useFieldProps } from "@stellaria/nebula-hooks";
import { DismissButton, Overlay, useComboBox, useFilter, usePopover } from "react-aria";
import { Item, useComboBoxState } from "react-stately";

import { OptionList } from "../../collections/option-list.js";
import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { DisabledKeys, type SelectOption } from "../../collections/options.js";
import * as field from "../../styles/field.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { FormField } from "../FormField/FormField.js";
import * as select_styles from "../Select/Select.css.js";
import { UnstyledButton } from "../UnstyledButton/UnstyledButton.js";

import * as styles from "./MultiSelect.css.js";
import type { MultiSelectProps } from "./MultiSelect.types.js";

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

const CROSS = (
  <svg
    viewBox="0 0 24 24"
    width="0.75em"
    height="0.75em"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const EMPTY: readonly string[] = [];

export function MultiSelect(props: MultiSelectProps): ReactElement {
  const {
    data,
    label,
    description,
    placeholder = "Selecciona opciones",
    error,
    errorDisplay = "tooltip",
    required = false,
    disabled = false,
    size = "md",

    surface = "outline",
    field: nebula_field,
    value,
    defaultValue = EMPTY,
    onChange,
    searchable = true,
    maxValues,
    renderOption,
    placement = "bottom start",
    maxDropdownHeight,
    emptyLabel,
    removeLabel = (option) => `Quitar ${option.label}`,
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

  const controlled = useMemo(() => (value === undefined ? undefined : [...value]), [value]);
  const initial = useMemo(() => [...defaultValue], [defaultValue]);

  const fp = useFieldProps<string[]>({
    field: nebula_field,
    value: controlled,
    defaultValue: initial,
    onChange,
    error,
    disabled,
    required,
  });

  const { contains } = useFilter({ sensitivity: "base" });

  const auto_id = useId();
  const input_id = `${auto_id}-multiselect`;

  const [query, set_query] = useState("");

  const selected_values = fp.value;
  const value_keys = useMemo(() => [...selected_values], [selected_values]);
  const at_max = maxValues !== undefined && selected_values.length >= maxValues;

  const items = useMemo(
    () => (query === "" ? [...data] : data.filter((option) => contains(option.label, query))),
    [data, query, contains],
  );

  const disabled_keys = useMemo(() => {
    const base = DisabledKeys(data);
    if (!at_max) return base;
    const blocked = data
      .filter((option) => !selected_values.includes(option.value))
      .map((option) => option.value);
    return [...new Set([...base, ...blocked])];
  }, [data, at_max, selected_values]);

  const state = useComboBoxState<SelectOption, "multiple">({
    selectionMode: "multiple",
    items,
    value: value_keys,
    onChange: (keys) => {
      fp.onChange(keys.map(String));
    },
    disabledKeys: disabled_keys,
    isDisabled: fp.isDisabled,
    isRequired: required,
    allowsEmptyCollection: true,
    menuTrigger: "input",
    inputValue: query,
    onInputChange: set_query,
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

  const { inputProps, listBoxProps, buttonProps } = useComboBox<SelectOption, "multiple">(
    {
      inputRef: input_ref,
      buttonRef: trigger_ref,
      popoverRef: popover_ref,
      listBoxRef: listbox_ref,
      isDisabled: fp.isDisabled,
      isRequired: required,
      ...(label === undefined
        ? { "aria-label": placeholder }
        : { "aria-labelledby": `${input_id}-label` }),
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

  const chips = selected_values
    .map((entry) => data.find((option) => option.value === entry))
    .filter((option): option is SelectOption => option !== undefined);

  const form_error = fp.errorMessage ?? (fp.isInvalid ? true : undefined);

  const Remove = (option: SelectOption): void => {
    fp.onChange(selected_values.filter((entry) => entry !== option.value));
  };

  const presence = useOverlayPresence(state.isOpen);

  const Close = (): void => {
    state.close();
  };

  const HandleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    inputProps.onKeyDown?.(event);
    if (event.key !== "Backspace" || query !== "" || selected_values.length === 0) return;
    fp.onChange(selected_values.slice(0, -1));
  };

  return (
    <FormField
      {...field_slots}
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
          className={field.field({ size, surface })}
          data-invalid={fp.isInvalid ? "true" : undefined}
          data-disabled={fp.isDisabled ? "true" : undefined}
        >
          <div className={styles.control}>
            {chips.map((option) => (
              <span key={option.value} className={styles.chip}>
                <span className={styles.chip_label}>{option.label}</span>
                <UnstyledButton
                  className={styles.chip_remove}
                  aria-label={removeLabel(option)}
                  disabled={fp.isDisabled}
                  tabIndex={state.isOpen ? -1 : undefined}
                  onPress={() => Remove(option)}
                >
                  {CROSS}
                </UnstyledButton>
              </span>
            ))}
            <input
              {...inputProps}
              id={control.id}
              aria-describedby={control["aria-describedby"]}
              aria-invalid={control["aria-invalid"]}
              ref={input_ref}
              onKeyDown={HandleKeyDown}
              className={cx(styles.search, className)}
              readOnly={!searchable}
              placeholder={chips.length === 0 ? placeholder : undefined}
            />
          </div>
          <UnstyledButton
            {...buttonProps}
            ref={trigger_ref}
            className={field.section}
            disabled={fp.isDisabled}
            tabIndex={state.isOpen ? -1 : undefined}
            {...(label === undefined ? { "aria-label": placeholder } : {})}
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
                surface="popover"
                open={state.isOpen}
                onExitComplete={presence.OnExitComplete}
                ref={popover_ref}
                className={select_styles.dropdown}
                style={{
                  ...popoverProps.style,
                  width: input_ref.current?.closest("div")?.parentElement?.offsetWidth,
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

MultiSelect.displayName = "MultiSelect";
