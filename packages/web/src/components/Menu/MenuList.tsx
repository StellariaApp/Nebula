"use client";

import { useMemo, useRef, type ReactElement } from "react";

import { usePermissionResolver, useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useMenu, useMenuItem } from "react-aria";
import { Item, useTreeState, type Node, type TreeState } from "react-stately";

import { MotionOff, StaggerDelay, Tween, type MotionContext } from "../../utils/motion.js";
import { ApplyPermissions } from "../../utils/permission.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Menu.css.js";
import type { MenuItemData, MenuListOwnProps, MenuSlotProps } from "./Menu.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

interface RowProps {
  node: Node<MenuItemData>;
  state: TreeState<MenuItemData>;
  onAction: ((key: string) => void) | undefined;
  index: number;
  motionContext: MotionContext;
  slots: MenuSlotProps;
}

function MenuRow(props: RowProps): ReactElement {
  const { node, state, onAction, index, motionContext, slots } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;
  const is_off = MotionOff(motionContext);

  const {
    menuItemProps,
    labelProps: aria_label_props,
    descriptionProps: aria_description_props,
    keyboardShortcutProps: aria_shortcut_props,
    isFocused,
    isDisabled,
  } = useMenuItem(
    {
      key: node.key,
      ...(onAction === undefined ? {} : { onAction: () => onAction(String(node.key)) }),
    },
    state,
    ref,
  );

  return (
    <m.li
      {...(menuItemProps as unknown as HTMLMotionProps<"li">)}
      ref={ref}
      className={styles.item}
      data-focused={isFocused ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-danger={data?.danger === true ? "true" : undefined}
      initial={is_off ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...Tween("fast", "decelerate", motionContext),
        delay: StaggerDelay(index, motionContext),
      }}
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
        className={cx(styles.labels, slots.bodyProps?.className)}
      >
        <Text inherit component="span" {...slots.labelProps} {...aria_label_props}>
          {node.rendered}
        </Text>
        {data?.description === undefined || data.description === null ? null : (
          <Text
            component="span"
            {...slots.descriptionProps}
            {...aria_description_props}
            className={cx(styles.description, slots.descriptionProps?.className)}
          >
            {data.description}
          </Text>
        )}
      </Box>
      {data?.shortcut === undefined ? null : (
        <Box
          component="kbd"
          {...slots.shortcutProps}
          {...aria_shortcut_props}
          className={cx(styles.shortcut, slots.shortcutProps?.className)}
        >
          {data.shortcut}
        </Box>
      )}
    </m.li>
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
    listProps,
    iconProps,
    bodyProps,
    labelProps,
    descriptionProps,
    shortcutProps,
  } = props;

  const ref = useRef<HTMLUListElement>(null);

  const resolve = usePermissionResolver();
  const gated = useMemo(() => ApplyPermissions(items, resolve), [items, resolve]);

  const state = useTreeState<MenuItemData>({
    items: gated,
    selectionMode: "none",
    disabledKeys: gated.filter((entry) => entry.disabled === true).map((entry) => entry.key),
    children: (entry: MenuItemData) => (
      <Item
        key={entry.key}
        textValue={entry.textValue ?? (typeof entry.label === "string" ? entry.label : entry.key)}
      >
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

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };

  const slots: MenuSlotProps = {
    iconProps,
    bodyProps,
    labelProps,
    descriptionProps,
    shortcutProps,
  };

  return (
    <Box
      component="ul"
      {...menuProps}
      ref={ref}
      {...listProps}
      className={cx(styles.menu, className, listProps?.className)}
    >
      {[...state.collection].map((node, index) => (
        <MenuRow
          key={node.key}
          node={node}
          state={state}
          onAction={onAction}
          index={index}
          motionContext={motion_context}
          slots={slots}
        />
      ))}
    </Box>
  );
}

MenuList.displayName = "MenuList";
