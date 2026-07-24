"use client";

import { useRef, type ReactElement } from "react";

import { useMenu, useMenuItem } from "react-aria";
import { Item, useTreeState, type Node, type TreeState } from "react-stately";

import { cx } from "../../utils/style-props.js";

import * as styles from "./Menu.css.js";
import type { MenuItemData, MenuListOwnProps } from "./Menu.types.js";

interface RowProps {
  node: Node<MenuItemData>;
  state: TreeState<MenuItemData>;
  onAction: ((key: string) => void) | undefined;
}

function MenuRow(props: RowProps): ReactElement {
  const { node, state, onAction } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;

  const { menuItemProps, labelProps, descriptionProps, keyboardShortcutProps, isFocused, isDisabled } =
    useMenuItem(
      {
        key: node.key,
        ...(onAction === undefined ? {} : { onAction: () => onAction(String(node.key)) }),
      },
      state,
      ref,
    );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={styles.item}
      data-focused={isFocused ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-danger={data?.danger === true ? "true" : undefined}
    >
      {data?.icon === undefined || data.icon === null ? null : (
        <span className={styles.icon} aria-hidden="true">
          {data.icon}
        </span>
      )}
      <span className={styles.labels}>
        <span {...labelProps}>{node.rendered}</span>
        {data?.description === undefined || data.description === null ? null : (
          <span {...descriptionProps} className={styles.description}>
            {data.description}
          </span>
        )}
      </span>
      {data?.shortcut === undefined ? null : (
        <kbd {...keyboardShortcutProps} className={styles.shortcut}>
          {data.shortcut}
        </kbd>
      )}
    </li>
  );
}

export interface MenuListProps extends MenuListOwnProps {
  menuProps?: Record<string, unknown> | undefined;
}

export function MenuList(props: MenuListProps): ReactElement {
  const {
    items,
    onAction,
    autoFocus = true,
    "aria-label": aria_label,
    className,
    menuProps: outer_menu_props,
  } = props;

  const ref = useRef<HTMLUListElement>(null);

  const state = useTreeState<MenuItemData>({
    items,
    selectionMode: "none",
    disabledKeys: items.filter((entry) => entry.disabled === true).map((entry) => entry.key),
    children: (entry: MenuItemData) => (
      <Item key={entry.key} textValue={entry.textValue ?? (typeof entry.label === "string" ? entry.label : entry.key)}>
        {entry.label}
      </Item>
    ),
  });

  const { menuProps } = useMenu(
    {
      autoFocus,
      ...(aria_label === undefined ? {} : { "aria-label": aria_label }),
      ...(outer_menu_props ?? {}),
    },
    state,
    ref,
  );

  return (
    <ul {...menuProps} ref={ref} className={cx(styles.menu, className)}>
      {[...state.collection].map((node) => (
        <MenuRow key={node.key} node={node} state={state} onAction={onAction} />
      ))}
    </ul>
  );
}

MenuList.displayName = "MenuList";
