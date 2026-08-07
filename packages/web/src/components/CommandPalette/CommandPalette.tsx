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
  CommandPaletteSlotProps,
} from "./CommandPalette.types.js";
import { useHotkey } from "./use-hotkey.js";
import { Box } from "../Box/Box.js";
import { Modal } from "../Modal/Modal.js";
import { Text } from "../Text/Text.js";
import { Search } from "../../glyphs/index.js";

const DEFAULT_LABELS: CommandPaletteLabels = {
  placeholder: "Escribe un comando o busca…",
  search: "Buscar comandos",
  empty: "Sin resultados",
  list: "Comandos",
};

const ICON_SEARCH = <Search />;

interface RowProps {
  node: Node<CommandItem>;
  state: ListState<CommandItem>;
  slots: CommandPaletteSlotProps;
}

function CommandRow(props: RowProps): ReactElement {
  const { node, state, slots } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;
  const {
    optionProps: aria_option,
    isFocused,
    isDisabled,
  } = useOption({ key: node.key }, state, ref);

  return (
    <li
      {...aria_option}
      ref={ref}
      data-focused={isFocused ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      {...slots.optionProps}
      className={cx(styles.option, slots.optionProps?.className)}
    >
      {data?.icon === undefined || data.icon === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...slots.iconProps}
          className={cx(styles.icon, slots.iconProps?.className)}
        >
          {data.icon}
        </Box>
      )}
      <Box
        component="span"
        {...slots.bodyProps}
        className={cx(styles.body, slots.bodyProps?.className)}
      >
        <Text
          component="span"
          {...slots.labelProps}
          className={cx(styles.label, slots.labelProps?.className)}
        >
          {data?.label}
        </Text>
        {data?.description === undefined || data.description === null ? null : (
          <Text
            component="span"
            {...slots.descriptionProps}
            className={cx(styles.description, slots.descriptionProps?.className)}
          >
            {data.description}
          </Text>
        )}
      </Box>
      {data?.shortcut === undefined ? null : (
        <Kbd size="sm" {...slots.shortcutProps}>
          {data.shortcut}
        </Kbd>
      )}
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
    inputRowProps,
    searchIconProps,
    inputProps,
    emptyProps,
    listProps,
    optionProps,
    iconProps,
    bodyProps,
    labelProps,
    descriptionProps,
    shortcutProps,
  } = props;

  const slots: CommandPaletteSlotProps = {
    optionProps,
    iconProps,
    bodyProps,
    labelProps,
    descriptionProps,
    shortcutProps,
  };

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

  const { inputProps: aria_input, listBoxProps } = useComboBox(
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
        <Box {...inputRowProps} className={cx(styles.input_row, inputRowProps?.className)}>
          <Box
            component="span"
            {...searchIconProps}
            className={cx(styles.icon, searchIconProps?.className)}
          >
            {ICON_SEARCH}
          </Box>
          <input
            {...aria_input}
            ref={input_ref}
            {...inputProps}
            className={cx(styles.input, inputProps?.className)}
          />
        </Box>
        {matches.length === 0 ? (
          <Text {...emptyProps} className={cx(styles.empty, emptyProps?.className)}>
            {text.empty}
          </Text>
        ) : (
          <ul
            {...aria_list}
            ref={list_ref}
            {...listProps}
            className={cx(styles.list, listProps?.className)}
          >
            {[...state.collection].map((node) => (
              <CommandRow key={node.key} node={node} state={state} slots={slots} />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

CommandPalette.displayName = "CommandPalette";
