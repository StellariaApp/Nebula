"use client";

import { useRef, type ReactElement, type RefObject } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useListBox, useOption } from "react-aria";
import type { ListState, Node } from "react-stately";

import { MotionOff, StaggerDelay, Tween, type MotionContext } from "../utils/motion.js";
import { cx } from "../utils/style-props.js";

import * as styles from "./option-list.css.js";
import type { RenderOption, SelectOption } from "./options.js";
import { useWindowedList } from "./use-windowed-list.js";

const CHECK = (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

interface RowProps {
  node: Node<SelectOption>;
  state: ListState<SelectOption>;
  renderOption: RenderOption | undefined;
  withCheck: boolean;
  index: number;
  motionContext: MotionContext;
}

function OptionRow(props: RowProps): ReactElement {
  const { node, state, renderOption, withCheck, index, motionContext } = props;
  const ref = useRef<HTMLLIElement>(null);
  const data = node.value;
  const is_off = MotionOff(motionContext);

  const { optionProps, labelProps, descriptionProps, isSelected, isFocused, isDisabled } =
    useOption({ key: node.key }, state, ref);

  const custom =
    renderOption === undefined || data === null
      ? undefined
      : renderOption(data, { isSelected, isFocused, isDisabled });

  return (
    <m.li
      {...(optionProps as unknown as HTMLMotionProps<"li">)}
      ref={ref}
      className={styles.option}
      data-focused={isFocused ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      initial={is_off ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...Tween("fast", "decelerate", motionContext),
        delay: StaggerDelay(index, motionContext),
      }}
    >
      {custom === undefined ? (
        <>
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
          {withCheck && isSelected ? (
            <span className={styles.check} aria-hidden="true">
              {CHECK}
            </span>
          ) : null}
        </>
      ) : (
        custom
      )}
    </m.li>
  );
}

export interface OptionListProps {
  state: ListState<SelectOption>;
  listBoxRef: RefObject<HTMLUListElement | null>;
  listBoxProps: Record<string, unknown>;
  renderOption?: RenderOption | undefined;
  withCheck?: boolean | undefined;
  emptyLabel?: string | undefined;
  virtualizeFrom?: number | undefined;
  rowHeight?: number | undefined;
  viewportHeight?: number | undefined;
  className?: string | undefined;
}

const DEFAULT_ROW_HEIGHT = 36;
const DEFAULT_VIEWPORT = 288;
const OVERSCAN = 6;

export function OptionList(props: OptionListProps): ReactElement {
  const {
    state,
    listBoxRef,
    listBoxProps: outer,
    renderOption,
    withCheck = true,
    emptyLabel = "Sin resultados",
    virtualizeFrom,
    rowHeight = DEFAULT_ROW_HEIGHT,
    viewportHeight = DEFAULT_VIEWPORT,
    className,
  } = props;

  const { listBoxProps } = useListBox(outer, state, listBoxRef);
  const nodes = [...state.collection];

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };

  const windowed = virtualizeFrom !== undefined && nodes.length >= virtualizeFrom;
  const focused_key = state.selectionManager.focusedKey;
  const focused_index =
    focused_key === null ? -1 : nodes.findIndex((node) => node.key === focused_key);

  const view = useWindowedList({
    count: nodes.length,
    rowHeight,
    viewportHeight,
    overscan: OVERSCAN,
    focusedIndex: focused_index,
    enabled: windowed,
    scrollRef: listBoxRef,
  });

  const visible = windowed ? nodes.slice(view.start, view.end) : nodes;

  return (
    <>
      <ul
        {...listBoxProps}
        ref={listBoxRef}
        className={cx(styles.listbox, className)}
        data-windowed={windowed ? "true" : undefined}
        onScroll={windowed ? view.OnScroll : undefined}
      >
        {windowed && view.padStart > 0 ? (
          <li aria-hidden="true" style={{ height: view.padStart }} />
        ) : null}
        {visible.map((node, index) => (
          <OptionRow
            key={node.key}
            node={node}
            state={state}
            renderOption={renderOption}
            withCheck={withCheck}
            index={windowed ? 0 : index}
            motionContext={motion_context}
          />
        ))}
        {windowed && view.padEnd > 0 ? (
          <li aria-hidden="true" style={{ height: view.padEnd }} />
        ) : null}
      </ul>
      {nodes.length === 0 ? <div className={styles.empty}>{emptyLabel}</div> : null}
    </>
  );
}

OptionList.displayName = "OptionList";
