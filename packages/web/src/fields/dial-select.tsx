"use client";

import { useMemo, useRef, useState, type ReactElement, type ReactNode } from "react";

import { DismissButton, Overlay, useComboBox, useFilter, useLocale, usePopover } from "react-aria";
import { Item, useComboBoxState } from "react-stately";

import { OptionList } from "../collections/option-list.js";
import { CountryNamer, DialCodes, FlagEmoji, type DialOption } from "../collections/dial-codes.js";
import type { SelectOption } from "../collections/options.js";
import { OverlayMotion, useOverlayPresence } from "../overlays/overlay-motion.js";
import * as select_styles from "../components/Select/Select.css.js";
import * as field from "../styles/field.css.js";
import { cx } from "../utils/style-props.js";

import * as styles from "./dial-select.css.js";

const MAX_OPTIONS = 50;

export type RenderFlag = (code: string) => ReactNode;

export interface DialSelectProps {
  value: string;
  onChange: (code: string) => void;
  data?: readonly DialOption[] | undefined;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  compact: boolean;
  ariaLabel: string;
  emptyLabel: string;
  renderFlag?: RenderFlag | undefined;
  controlId?: string | undefined;
  describedBy?: string | undefined;
  labelledBy?: string | undefined;
  name?: string | undefined;
  className?: string | undefined;
}

function Flag(code: string, render: RenderFlag | undefined): ReactNode {
  if (render !== undefined) return render(code);
  return (
    <span className={styles.flag} aria-hidden="true">
      {FlagEmoji(code)}
    </span>
  );
}

export function DialSelect(props: DialSelectProps): ReactElement {
  const {
    value,
    onChange,
    data,
    disabled,
    invalid,
    required,
    compact,
    ariaLabel,
    emptyLabel,
    renderFlag,
    controlId,
    describedBy,
    labelledBy,
    name,
    className,
  } = props;

  const { locale } = useLocale();
  const { contains } = useFilter({ sensitivity: "base" });

  const source = useMemo(() => data ?? DialCodes(), [data]);

  const options = useMemo<SelectOption[]>(() => {
    const NameOf = CountryNamer(locale);
    return source.map((entry) => ({
      value: entry.code,
      label: `${NameOf(entry.code)} ${entry.dial}`,
      icon: Flag(entry.code, renderFlag),
    }));
  }, [source, locale, renderFlag]);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );
  const dial = useMemo(
    () => source.find((entry) => entry.code === value)?.dial ?? "",
    [source, value],
  );

  const [draft, set_draft] = useState<string | null>(null);
  const query = draft ?? "";

  const items = useMemo(() => {
    const matched =
      query === "" ? options : options.filter((option) => contains(option.label, query));
    return matched.length > MAX_OPTIONS ? matched.slice(0, MAX_OPTIONS) : matched;
  }, [options, query, contains]);

  const state = useComboBoxState<SelectOption>({
    items,
    selectedKey: value === "" ? null : value,
    onSelectionChange: (key) => {
      set_draft(null);
      onChange(key === null ? "" : String(key));
    },
    isDisabled: disabled,
    isRequired: required,
    allowsEmptyCollection: true,
    menuTrigger: "focus",
    inputValue: query,
    onInputChange: set_draft,
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

  const { inputProps, listBoxProps } = useComboBox(
    {
      inputRef: input_ref,
      buttonRef: trigger_ref,
      popoverRef: popover_ref,
      listBoxRef: listbox_ref,
      isDisabled: disabled,
      isRequired: required,
      ...(labelledBy === undefined
        ? { "aria-label": ariaLabel }
        : { "aria-labelledby": labelledBy }),
      ...(name === undefined ? {} : { name }),
    },
    state,
  );

  const { popoverProps, underlayProps } = usePopover(
    {
      triggerRef: input_ref,
      popoverRef: popover_ref,
      placement: "bottom start",
      offset: 6,
      isNonModal: true,
    },
    state,
  );

  const presence = useOverlayPresence(state.isOpen);

  const Close = (): void => {
    state.close();
  };

  return (
    <div className={cx(styles.root, compact ? styles.compact : undefined, className)}>
      {value === "" ? null : Flag(value, renderFlag)}
      <input
        {...inputProps}
        ref={input_ref}
        className={cx(field.input, styles.input, compact ? styles.input_compact : undefined)}
        value={state.isOpen ? query : selected === undefined ? "" : dial}
        {...(controlId === undefined ? {} : { id: controlId })}
        {...(describedBy === undefined ? {} : { "aria-describedby": describedBy })}
        {...(invalid ? { "aria-invalid": true } : {})}
        placeholder="+"
      />
      {presence.render ? (
        <Overlay>
          {state.isOpen ? <div {...underlayProps} /> : null}
          <OverlayMotion
            {...popoverProps}
            surface="popover"
            open={state.isOpen}
            onExitComplete={presence.OnExitComplete}
            ref={popover_ref}
            className={cx(select_styles.dropdown, styles.dropdown)}
          >
            <DismissButton onDismiss={Close} />
            <OptionList
              state={state}
              listBoxRef={listbox_ref}
              listBoxProps={listBoxProps as unknown as Record<string, unknown>}
              emptyLabel={emptyLabel}
            />
            <DismissButton onDismiss={Close} />
          </OverlayMotion>
        </Overlay>
      ) : null}
    </div>
  );
}

DialSelect.displayName = "DialSelect";
