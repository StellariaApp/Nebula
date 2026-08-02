"use client";

import { useCallback, useMemo, useRef, useState, type ReactElement } from "react";

import { usePermissionResolver, useUncontrolled } from "@stellaria/nebula-hooks";
import { useComboBox, useListBox, useOption } from "react-aria";
import { Item, useComboBoxState, type ListState, type Node } from "react-stately";

import { ApplyPermissions } from "../../utils/permission.js";
import { cx } from "../../utils/style-props.js";
import { Kbd } from "../Kbd/Kbd.js";

import { BestScore } from "./command-score.js";
import * as styles from "./CommandPalette.css.js";
import type {
  CommandItem,
  CommandPaletteLabels,
  CommandPaletteProps,
} from "./CommandPalette.types.js";
import { useHotkey } from "./use-hotkey.js";
import { Modal } from "../Modal/Modal.js";

const DEFAULT_LABELS: CommandPaletteLabels = {
  placeholder: "Escribe un comando o busca…",
  search: "Buscar comandos",
  empty: "Sin resultados",
  list: "Comandos",
};

const ICON_SEARCH = (
  <svg
    viewBox="0 0 24 24"
    width="1.1em"
    height="1.1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

interface RowProps {
  node: Node<CommandItem>;
  state: ListState<CommandItem>;
}

function CommandRow(props: RowProps): ReactElement {
  const { node, state } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;
  const { optionProps, isFocused, isDisabled } = useOption({ key: node.key }, state, ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      className={styles.option}
      data-focused={isFocused ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
    >
      {data?.icon === undefined || data.icon === null ? null : (
        <span className={styles.icon} aria-hidden="true">
          {data.icon}
        </span>
      )}
      <span className={styles.body}>
        <span className={styles.label}>{data?.label}</span>
        {data?.description === undefined || data.description === null ? null : (
          <span className={styles.description}>{data.description}</span>
        )}
      </span>
      {data?.shortcut === undefined ? null : <Kbd size="sm">{data.shortcut}</Kbd>}
    </li>
  );
}

export function CommandPalette(props: CommandPaletteProps): ReactElement {
  const {
    items,
    opened,
    defaultOpened = false,
    onOpenChange,
    onAction,
    hotkey = "mod+k",
    maxResults = 50,
    labels,
    className,
  } = props;

  const text = { ...DEFAULT_LABELS, ...labels };
  const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onOpenChange);
  const [query, set_query] = useState("");

  const Open = useCallback(() => {
    set_open(true);
  }, [set_open]);
  useHotkey(hotkey, Open);

  const resolve = usePermissionResolver();
  const allowed = useMemo(() => ApplyPermissions(items, resolve), [items, resolve]);

  const matches = useMemo(() => {
    const scored = allowed
      .map((item) => ({
        item,
        score: BestScore([item.label, item.group ?? "", ...(item.keywords ?? [])], query),
      }))
      .filter((entry) => entry.score > 0);
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxResults).map((entry) => entry.item);
  }, [allowed, query, maxResults]);

  const Run = useCallback(
    (key: string): void => {
      const found = matches.find((entry) => entry.key === key);
      if (found?.disabled === true) return;
      found?.onAction?.();
      onAction?.(key);
      set_open(false);
      set_query("");
    },
    [matches, onAction, set_open],
  );

  const state = useComboBoxState<CommandItem>({
    items: matches,
    inputValue: query,
    onInputChange: set_query,
    allowsEmptyCollection: true,
    defaultFilter: () => true,
    disabledKeys: matches.filter((entry) => entry.disabled === true).map((entry) => entry.key),
    onSelectionChange: (key) => {
      if (key !== null) Run(String(key));
    },
    children: (entry: CommandItem) => (
      <Item key={entry.key} textValue={entry.label}>
        {entry.label}
      </Item>
    ),
  });

  const input_ref = useRef<HTMLInputElement>(null);
  const list_ref = useRef<HTMLUListElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);

  const { inputProps, listBoxProps } = useComboBox(
    {
      inputRef: input_ref,
      listBoxRef: list_ref,
      popoverRef: popover_ref,
      "aria-label": text.search,
      placeholder: text.placeholder,
      menuTrigger: "focus",
    },
    state,
  );

  const { listBoxProps: aria_list } = useListBox(
    { ...listBoxProps, "aria-label": text.list, disallowEmptySelection: true },
    state,
    list_ref,
  );

  const Close = useCallback(() => {
    set_open(false);
    set_query("");
  }, [set_open]);

  return (
    <Modal
      opened={is_open}
      onClose={Close}
      size="lg"
      padding="none"
      withCloseButton={false}
      aria-label={text.search}
      className={className}
    >
      <div className={styles.root} ref={popover_ref}>
        <div className={styles.inputRow}>
          <span className={styles.icon}>{ICON_SEARCH}</span>
          <input {...inputProps} ref={input_ref} className={styles.input} />
        </div>
        {matches.length === 0 ? (
          <p className={styles.empty}>{text.empty}</p>
        ) : (
          <ul {...aria_list} ref={list_ref} className={cx(styles.list)}>
            {[...state.collection].map((node) => (
              <CommandRow key={node.key} node={node} state={state} />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

CommandPalette.displayName = "CommandPalette";
